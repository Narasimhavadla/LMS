// src/components/CodeEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";

const DEFAULTS = {
  javascript: `// JavaScript example
function greet(name) {
  console.log("Hello, " + name + "!");
}
greet("Learner");`,
  python: `# Python example
def greet(name):
    print("Hello, " + name + "!")
greet("Learner")`,
  java: `// Java example (class name Main required)
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Learner!");
    }
}`,
};

export default function CodeEditor({ initialLanguage = "javascript" }) {
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(DEFAULTS[initialLanguage]);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const iframeRef = useRef(null);
  const pyodideRef = useRef(null);
  const [pyLoaded, setPyLoaded] = useState(false);

  useEffect(() => {
    setCode(DEFAULTS[language] || "");
    setOutput("");
  }, [language]);

  useEffect(() => {
    function onMsg(e) {
      if (e.data && e.data.__lms_editor_log) {
        setOutput((prev) => prev + e.data.__lms_editor_log + "\n");
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Load Pyodide for Python
  async function loadPyodideIfNeeded() {
    if (pyLoaded) return pyodideRef.current;
    setOutput((o) => o + "Loading Python runtime...\n");
    setRunning(true);
    if (!window.loadPyodide) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
      script.onload = async () => {
        pyodideRef.current = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/" });
        setPyLoaded(true);
        setRunning(false);
        setOutput((o) => o + "Pyodide loaded.\n");
      };
      script.onerror = () => {
        setOutput((o) => o + "Failed to load Pyodide.\n");
        setRunning(false);
      };
      document.head.appendChild(script);
    } else {
      pyodideRef.current = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/" });
      setPyLoaded(true);
      setRunning(false);
      setOutput((o) => o + "Pyodide loaded.\n");
    }
    return pyodideRef.current;
  }

  // Run JavaScript in sandbox iframe
  async function runJS() {
    setOutput("");
    setRunning(true);

    const html = `
      <html>
        <body>
          <script>
            (function() {
              function send(msg){ parent.postMessage({__lms_editor_log: msg}, "*"); }
              const origLog = console.log;
              console.log = function(...args){
                const text = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
                send(text);
                origLog.apply(console, args);
              };
              window.onerror = function(msg, url, line) {
                send("Error: " + msg + " (line " + line + ")");
              };
              try { ${code} } catch(e) { send("Runtime Error: " + e.message); }
              send("__done__");
            })();
          </script>
        </body>
      </html>
    `;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    if (iframeRef.current) {
      iframeRef.current.src = url;
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
    const doneHandler = (e) => {
      if (e.data && e.data.__lms_editor_log === "__done__") {
        setRunning(false);
        window.removeEventListener("message", doneHandler);
      }
    };
    window.addEventListener("message", doneHandler);
  }

  // Run Python in Pyodide
  async function runPython() {
    setOutput("");
    setRunning(true);
    try {
      const pyodide = await loadPyodideIfNeeded();
      pyodide.setStdout({ batched: (s) => setOutput((o) => o + s) });
      pyodide.setStderr({ batched: (s) => setOutput((o) => o + s) });
      await pyodide.runPythonAsync(code);
      setRunning(false);
    } catch (err) {
      setOutput((o) => o + "Error: " + (err.message || String(err)) + "\n");
      setRunning(false);
    }
  }

  // Run Java via JDoodle API
  async function runJava() {
    setOutput("");
    setRunning(true);

    const clientId = "<YOUR_CLIENT_ID>";      // Replace with your JDoodle clientId
    const clientSecret = "<YOUR_CLIENT_SECRET>"; // Replace with your JDoodle clientSecret

    const payload = {
      script: code,
      language: "java",
      versionIndex: "4", // Java 17
      clientId,
      clientSecret,
    };

    try {
      const res = await fetch("https://api.jdoodle.com/v1/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      setOutput((o) => (json.output || "") + (json.memory ? `\nMemory: ${json.memory}` : ""));
    } catch (err) {
      setOutput((o) => o + "Error: " + err.message + "\n");
    } finally {
      setRunning(false);
    }
  }

  async function handleRun() {
    setOutput("");
    if (language === "javascript") await runJS();
    else if (language === "python") await runPython();
    else if (language === "java") await runJava();
  }

  function languageExtensions(lang) {
    if (lang === "javascript") return [javascript({ jsx: false })];
    if (lang === "python") return [python()];
    if (lang === "java") return [java()];
    return [];
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="px-3 py-2 border rounded-md">
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          <button onClick={() => setCode(DEFAULTS[language])} className="px-3 py-2 bg-gray-100 rounded-md">
            Reset
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={running}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm disabled:opacity-50"
          >
            {running ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <CodeMirror
            value={code}
            height="420px"
            theme={oneDark}
            extensions={languageExtensions(language)}
            onChange={(val) => setCode(val)}
          />
        </div>

        <div className="flex flex-col">
          <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Output</h3>
              <div className="text-xs text-gray-500">{running ? "Running..." : "Idle"}</div>
            </div>
            <pre className="mt-2 p-3 bg-gray-900 text-white rounded-md text-sm h-80 overflow-auto whitespace-pre-wrap">
              {output || "Program output will appear here..."}
            </pre>
          </div>

          {/* <div className="bg-white rounded-lg shadow-sm p-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Console / Info</h4>
            <p className="text-xs text-gray-500">
              Java: runs via JDoodle API. Python: runs in-browser with Pyodide. JavaScript: sandboxed iframe.
            </p>
            <iframe ref={iframeRef} title="sandbox" className="hidden" sandbox="allow-scripts" />
          </div> */}
        </div>
      </div>
    </div>
  );
}

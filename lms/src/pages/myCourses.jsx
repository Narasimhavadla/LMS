import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
// import AuthContext from "../Components/AuthContext";
import {AuthContext} from "../Components/AuthContext"
import ReactPlayer from "react-player";
import Assignment from "./Assignment";
import { FaSearch, FaCertificate, FaBell } from "react-icons/fa";
import CertificateManagement from "./CertificateManagement";
import NotificationsView from "../Components/NotificationsView";
import { fetchNotifications, sendNotification } from "../Components/notificationsApi";

const MyCourses = () => {
  const { username, email } = useContext(AuthContext); // update based on your AuthContext
  const APIURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const [activeTab, setActiveTab] = useState("videos");
  const [loading, setLoading] = useState(true);

  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [videos, setVideos] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [
          enrollmentsRes,
          batchesRes,
          coursesRes,
          videosRes,
          assignmentsRes
        ] = await Promise.all([
          axios.get(`${APIURL}/enrolledcourses?email=${email}`),
          axios.get(`${APIURL}/batches`),
          axios.get(`${APIURL}/courses`),
          axios.get(`${APIURL}/videos`),
          axios.get(`${APIURL}/assignments`)
        ]);
        setEnrollments(enrollmentsRes.data);
        setBatches(batchesRes.data);
        setCourses(coursesRes.data);
        setVideos(videosRes.data);
        setAssignments(assignmentsRes.data);
      } catch {
        setEnrollments([]);
        setBatches([]);
        setCourses([]);
        setVideos([]);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [APIURL, email]);

  // Fetch user notifications
  useEffect(() => {
    fetchNotifications(username).then(setNotifications);
  }, [username]);

  // "Got it" on notifications
  const handleGotIt = async (id) => {
    await sendNotification(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
    );
  };

  // For badges on tab if you want
const notifBadge = notifications.filter(n => n.status === "unread").length;
  const assignNotifBadge = notifications.filter(n => n.status === "unread" && n.type === "assignment_created").length;
  const certNotifBadge = notifications.filter(n => n.status === "unread" && n.type === "certificate_issued").length;

  // Video Batch Filtering, Player logic...
  useEffect(() => {
    if (selectedBatchId) {
      const vids = videos.filter(v => v.batchId === selectedBatchId);
      setSelectedVideoId(vids.length ? vids[0].id : null);
    }
  }, [selectedBatchId, videos]);

  // Build Batch Video List
  const batchVideoTitles = (batchId) =>
    videos
      .filter(v => v.batchId === batchId)
      .filter(v => v.title.toLowerCase().includes(search.toLowerCase()))
      .map(video => ({ id: video.id, title: video.title }));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-7 text-blue-900">My Learning</h2>
      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-blue-50 rounded-t-xl">
        <button
          onClick={() => { setActiveTab("videos"); setSelectedBatchId(null); }}
          className={`px-7 py-2 rounded-t-xl font-bold border-b-2 transition ${
            activeTab === "videos" ? "text-blue-700 border-blue-700 bg-white" : "text-gray-600 border-transparent"
          }`}
        >
          My course
        </button>
        <button
          onClick={() => setActiveTab("assignments")}
          className={`px-7 py-2 rounded-t-xl font-bold border-b-2 transition ${
            activeTab === "assignments" ? "text-blue-700 border-blue-700 bg-white" : "text-gray-600 border-transparent"
          }`}
        >
          Assignments {assignNotifBadge > 0 && <span className="ml-2 bg-red-500 text-white px-2 rounded-full text-xs">{assignNotifBadge}</span>}
        </button>
        <button
          onClick={() => setActiveTab("certificates")}
          className={`px-7 py-2 rounded-t-xl font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === "certificates" ? "text-blue-700 border-blue-700 bg-white" : "text-gray-600 border-transparent"
          }`}
        >
          <FaCertificate className="text-lg" />
          Certificates {certNotifBadge > 0 && <span className="ml-2 bg-red-500 text-white px-2 rounded-full text-xs">{certNotifBadge}</span>}
        </button>
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-7 py-2 rounded-t-xl font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === "notifications" ? "text-blue-700 border-blue-700 bg-white" : "text-gray-600 border-transparent"
          }`}
        >
          <FaBell className="text-lg" />
          Notifications {notifBadge > 0 && <span className="ml-2 bg-red-500 text-white px-2 rounded-full text-xs">{notifBadge}</span>}
        </button>
      </div>

      <div className="mb-7 flex">
        {activeTab !== "notifications" && (
          <div className="relative w-full">
            <input
              type="text"
              className="pl-10 pr-4 py-3 rounded-lg w-full border border-blue-200 focus:border-blue-600 text-lg shadow-sm"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-4 transform -translate-y-1/2 text-blue-400" />
          </div>
        )}
      </div>

      {/* Tab content */}
      {activeTab === "videos" && (
        loading ? (
          <div className="p-6">Loading...</div>
        ) : !selectedBatchId ? (
          <>
            <h3 className="font-semibold text-lg mb-3">Your Enrolled Batches</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {enrollments
                .filter(e =>
                  courses.find(c => c.title === e.courseName && c.title.toLowerCase().includes(search.toLowerCase())) &&
                  batches.find(b => b.id === e.batchId && b.name?.toLowerCase().includes(search.toLowerCase()))
                )
                .map(e => {
                  const batch = batches.find(b => b.id === e.batchId);
                  const course = courses.find(c => c.title === e.courseName);
                  if (!batch || !course) return null;
                  return (
                    <div
                      key={e.id}
                      className="bg-white border rounded-xl p-5 shadow hover:shadow-md cursor-pointer flex flex-col justify-between"
                      onClick={() => setSelectedBatchId(batch.id)}
                    >
                      <div>
                        <div className="text-blue-900 font-bold text-xl">{course.title}</div>
                        <div className="text-blue-600">{batch.name} Batch {batch.batchNumber}</div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 mt-3">
                        <span className="font-semibold">See Videos</span>
                      </div>
                    </div>
                  );
                })}
            </div>
            {enrollments.length === 0 && (
              <div className="p-8 text-gray-500 text-lg">
                You are not enrolled in any course batch.
              </div>
            )}
          </>
        ) : (
          <div className="flex gap-8">
            <div className="w-1/3">
              <button
                className="text-blue-600 hover:underline mb-5"
                onClick={() => setSelectedBatchId(null)}
              >
                Back to Batches
              </button>
              <h4 className="font-semibold mb-4">Videos</h4>
              <div className="bg-white rounded-md border">
                {batchVideoTitles(selectedBatchId).length === 0 ? (
                  <div className="p-4 text-gray-500">No videos uploaded for this batch.</div>
                ) : (
                  <ul>
                    {batchVideoTitles(selectedBatchId).map(video => (
                      <li
                        key={video.id}
                        className={`p-4 border-b cursor-pointer hover:bg-blue-50 ${
                          video.id === selectedVideoId ? "bg-blue-100 font-bold" : ""
                        }`}
                        onClick={() => setSelectedVideoId(video.id)}
                      >
                        {video.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex-1">
              {selectedVideoId ? (
                <div className="bg-white rounded-lg border p-6">
                  <ReactPlayer
                    url={videos.find(v => v.id === selectedVideoId)?.url}
                    controls
                    width="100%"
                    height="360px"
                  />
                  <div className="mt-2 font-semibold">{videos.find(v => v.id === selectedVideoId)?.title}</div>
                  <div className="mb-2 text-gray-600">{videos.find(v => v.id === selectedVideoId)?.description}</div>
                </div>
              ) : (
                <div className="p-16 text-gray-500 text-center">
                  Select a video from the left panel
                </div>
              )}
            </div>
          </div>
        )
      )}

      {activeTab === "assignments" && selectedBatchId && (
        <div className="py-4">
          <Assignment batchId={selectedBatchId} userId={username} />
        </div>
      )}

      {activeTab === "certificates" && (
        <CertificateManagement userId={username} userName={username} email={email} />
      )}

      {activeTab === "notifications" && (
        <div>
          {/* <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FaBell /> Notifications
          </h2> */}
          <NotificationsView
            notifications={notifications}
            onGotIt={handleGotIt}
          />
        </div>
      )}
    </div>
  );
};

export default MyCourses;

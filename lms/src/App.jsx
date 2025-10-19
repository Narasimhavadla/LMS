import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import LandingPage from './pages/landingPage'
import Courses from './pages/courses'
import Login from './pages/login'
import Signup from './pages/signup'
import Navbar from './Components/Navbar'
import Service from './pages/service'
import Footer from './Components/Footer'
import Assignment from './pages/Assignment'
import CodeEditor from './pages/editor'
import MyCourses from './pages/myCourses'
// import { AuthContext } from './Components/AuthContext'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
        <Navbar />
        <Routes>
          <Route path='/' element={<LandingPage />}></Route>
          <Route path='/course' element={<Courses />}></Route>
          <Route path='/login' element={< Login/>}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/service' element={<Service />}></Route>
          <Route path='/assignment' element={<Assignment />}></Route>
          <Route path='/editor' element={<CodeEditor />}></Route>
          <Route path='/mycourses' element={<MyCourses />}></Route>
          {/* <Route path='/authcontext' element={<AuthContext />}></Route> */}
        </Routes>
        <Footer />
    </div>
  );
}

export default App

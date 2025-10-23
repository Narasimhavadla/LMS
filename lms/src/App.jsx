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
import SkillManagement from './Components/skillManagment'
// import CertificationManagement from './pages/CertificateManagement'
import StudentCertificates from './pages/CertificateManagement'
import AdminCertificateManagement from './Admin/AdminCertificate'
import AdminDashboard from './Admin/AdminDashboard'
import ProtectedRoute from './Components/ProtectedRoute'
import AdminAssignments from './Admin/Adminassignment'
import AboutUs from './pages/Aboutus'
import ContactUs from './pages/Contactus'
import FAQ from './pages/Faq'
import EnrollPage from './pages/EnrollPage'
import AdminEnrollments from './Admin/AdminEnrollPage'
import ContactAdvisor from './Components/ContactCourseAdvisor'
import AddAdmin from './Admin/AddAdmin'



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
          <Route path='/skillmanagement' element={<SkillManagement />}></Route>
          {/* <Route path='/authcontext' element={<AuthContext />}></Route> */}
          {/* <Route path='/certificate-management' element={<CertificationManagement />}></Route> */}
          <Route path='/student-certificate' element={<StudentCertificates />}></Route>
          <Route path='/admin-certificate' element={<AdminCertificateManagement />}></Route>
          <Route path='/admin-assignment' element={<AdminAssignments />}></Route>
          <Route path='/aboutus' element={<AboutUs />}></Route>
          <Route path='/contactus' element={<ContactUs />}></Route>
          <Route path='/faq' element={<FAQ />}></Route>
          <Route path='/enroll/:id' element={<EnrollPage/>}></Route>
          <Route path='/adminenroll' element={<AdminEnrollments/>}></Route>
          <Route path='/contactadvisor/:id' element={<ContactAdvisor/>}></Route>
          <Route path='/addadmin' element={<AddAdmin/>}></Route>


          <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
          

        </Routes>
        <Footer />
    </div>
  );
}

export default App

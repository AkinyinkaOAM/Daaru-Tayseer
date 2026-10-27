import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import About from './pages/About'
import Academics from './pages/Academics'
import Admissions from './pages/Admissions'
import Staff from './pages/Staff'
import StudentLife from './pages/StudentLife'
import NewsEvents from './pages/NewsEvents'
import ParentsCorner from './pages/ParentsCorner'
import Downloads from './pages/Downloads'
import FAQ from './pages/FAQ'
import Search from './pages/Search'
import Programme from './pages/Programme'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Login from './pages/Login'
import ChangePassword from './pages/ChangePassword'
import ParentPortal from './pages/ParentPortal'
import Dashboard from './pages/admin/Dashboard'
import CreateStudent from './pages/admin/CreateStudent'
import Students from './pages/admin/Students'
import Scores from './pages/admin/Scores'
import ManageAdmins from './pages/admin/ManageAdmins'
import AdmissionsManage from './pages/admin/AdmissionsManage'
import NewsEventsManage from './pages/admin/NewsEventsManage'
import DownloadsManage from './pages/admin/DownloadsManage'
import ContactMessages from './pages/admin/ContactMessages'
import AcademicRecordsManage from './pages/admin/AcademicRecordsManage'
import PaymentsManage from './pages/admin/PaymentsManage'
import Broadsheet from './pages/admin/Broadsheet'
import ReportCards from './pages/admin/ReportCards'
import UsersManage from './pages/admin/UsersManage'
import AuditLogs from './pages/admin/AuditLogs'
import Teachers from './pages/admin/Teachers'
import TeacherDetail from './pages/admin/TeacherDetail'
import Classes from './pages/admin/Classes'
import ClassStudents from './pages/admin/ClassStudents'
import StudentDetail from './pages/admin/StudentDetail'
import TermSettings from './pages/admin/TermSettings'
import StudentPortal from './pages/StudentPortal'
import './App.css'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/student-life" element={<StudentLife />} />
        <Route path="/news-events" element={<NewsEvents />} />
        <Route path="/parents-corner" element={<ParentsCorner />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/search" element={<Search />} />
        <Route path="/programme" element={<Programme />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected admin routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/students/create" element={<CreateStudent />} />
          <Route path="/admin/students" element={<Students />} />
          <Route path="/admin/students/:id" element={<StudentDetail />} />
          <Route path="/admin/teachers" element={<Teachers />} />
          <Route path="/admin/teachers/:id" element={<TeacherDetail />} />
          <Route path="/admin/classes" element={<Classes />} />
          <Route path="/admin/classes/:grade" element={<ClassStudents />} />
          <Route path="/admin/term-settings" element={<TermSettings />} />
          <Route path="/admin/admissions" element={<AdmissionsManage />} />
          <Route path="/admin/news-events" element={<NewsEventsManage />} />
          <Route path="/admin/downloads" element={<DownloadsManage />} />
          <Route path="/admin/contact-messages" element={<ContactMessages />} />
          <Route path="/admin/academic-records" element={<AcademicRecordsManage />} />
          <Route path="/admin/payments" element={<PaymentsManage />} />
          <Route path="/admin/broadsheet" element={<Broadsheet />} />
          <Route path="/admin/report-cards" element={<ReportCards />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute roles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/scores" element={<Scores />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute roles={['super_admin', 'super_super_admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/admins" element={<ManageAdmins />} />
          <Route path="/admin/users" element={<UsersManage />} />
          <Route path="/admin/audit-logs" element={<AuditLogs />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute roles={['student']} />}>
        <Route path="/student/portal" element={<StudentPortal />} />
      </Route>

      <Route element={<PrivateRoute roles={['parent']} />}>
        <Route path="/parent/portal" element={<ParentPortal />} />
      </Route>
    </Routes>
  )
}

export default App

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import EmployeeManagementApp from './Elements/EmployeeManagementApp';
import EmployeeDetails from './Elements/EmployeeDetails';
import AddEmployee from './Elements/AddEmployee';  // Make sure this path is correct
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Statistics from './pages/Statistics';
import Feature from './pages/Feature';
import Image from './pages/Image';
import RSVPPage from './Elements/RSVPPage';
import emailjs from '@emailjs/browser';
import PhotoGallery from './Elements/PhotoGallery';
import Documentation from './pages/Documentation';
emailjs.init("JB2YupqQ3psOuc9HO");

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/rsvp/:id" element={<RSVPPage />} />
        <Route path="/photo" element={<PhotoGallery />} />
      
        
        <Route
          path="/dashboard/*"
          element={
            <div className="flex">
            
              <main className="flex-1 bg-slate-50 min-h-screen">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard/employee" />} />
                  <Route path="employee" element={<EmployeeManagementApp />} />
                  <Route path="employee/add" element={<AddEmployee />} />
                  <Route path="employee/edit/:id" element={<AddEmployee />} />
                  <Route path="employee/:id" element={<EmployeeDetails />} />
                  <Route path="feature" element={<Feature />} />
                  <Route path="statistics" element={<Statistics />} />
                  <Route path="Image" element={<Image />} />
                    <Route path="/documentation" element={<Documentation />} />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
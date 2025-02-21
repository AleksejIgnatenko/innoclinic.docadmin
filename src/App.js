import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import Doctors from './pages/Doctors';
import Cookies from 'js-cookie';
import SignInModal from './components/SignInModal';
import MySchedule from './pages/MySchedule';
import PatientProfile from './pages/PatientProfile';
import Appointments from './pages/Appointments';
import DoctorProfile from './pages/DoctorProfile';
import Offices from './pages/Offices';

function App() {
  const isUserLoggedIn = Boolean(Cookies.get('refreshToken'));
  //const isUserLoggedIn = true;

  return (
    <>
      <Router>
        {isUserLoggedIn ? (
          <>
            <Sidebar />
            <div className="App">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/mySchedule" element={<MySchedule />} />
                <Route path="/patientProfile/:patientId" element={<PatientProfile />} />
                <Route path="/doctorProfile/:doctorId?" element={<DoctorProfile />} />  
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/offices" element={<Offices />} />
              </Routes>
            </div>
          </>
        ) : (
          <SignInModal />
        )}
      </Router>
    </>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import Doctors from './pages/Doctors';
import Cookies from 'js-cookie';
import SignInModal from './components/SignInModal';
import MySchedule from './pages/MySchedule';

function App() {
  const isUserLoggedIn = Boolean(Cookies.get('refreshToken'));

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
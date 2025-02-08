import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import Doctors from './pages/Doctors';
import Cookies from 'js-cookie';
import SignInModal from './components/SignInModal';
import MySchedule from './pages/MySchedule';

function App() {
  //let isUserLoggedIn = Cookies.get('refreshToken') !== undefined;
  let isUserLoggedIn = false;

  return (
    <>
      {/* {isUserLoggedIn ? ( */}
        <Router>
          <Sidebar />
          <div className="App">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/doctors" element={<Doctors />} />
              <Route exact path="/mySchedule" element={<MySchedule />} />
            </Routes>
          </div>
        </Router>
      {/* ) : (
          <SignInModal />
      )} */}
    </>
  );
}

export default App;
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Sidebar from './components/Sidebar';
import Doctors from './pages/Doctors';

function App() {


  return (
    <Router>
      <Sidebar />
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/doctors" element={<Doctors/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
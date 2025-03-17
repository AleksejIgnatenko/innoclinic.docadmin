import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import FormModal from './components/organisms/FormModal';
import { InputWrapper } from './components/molecules/InputWrapper';
import { ButtonBase } from './components/atoms/ButtonBase';
import useSignInForm from './hooks/useSignInForm';
import Sidebar from './components/organisms/Sidebar';
import Offices from './pages/Offices';
import Doctors from './pages/Doctors';
import Doctor from './pages/Doctor';
import Appointments from './pages/Appointments';
import MySchedule from './pages/MySchedule';
import Patient from './pages/Patient';
import Cookies from 'js-cookie';
import SignInFetchAsync from './api/Authorization.API/SignInFetchAsync';

function App() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  //const isUserLoggedIn = Boolean(Cookies.get('refreshToken'));
  const isUserLoggedIn = true;

  const { formData, errors, handleChange, handleBlur, isFormValid } = useSignInForm({
    email: '',
    password: ''
  });

  const toggleTheme = () => {
    setCurrentTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
};

  const handleSignIn = async (e) => {
    e.preventDefault();
    await SignInFetchAsync(formData);
  };

  return (
    <>
      <Router>
        {isUserLoggedIn ? (
          <>
            <Sidebar currentTheme={currentTheme} toggleTheme={toggleTheme} isUserLoggedIn={isUserLoggedIn}/>
            <div className="App">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/doctor/:id?" element={<Doctor />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/offices" element={<Offices />} />
                <Route path="/my-schedule" element={<MySchedule />} />
                <Route path="/patient/:id?" element={<Patient />} />
              </Routes>
            </div>
          </>
        ) : (
          <div>
            <FormModal title="Sign in" onSubmit={handleSignIn}>
              <div className="modal-inputs sign-in-modal">
                <InputWrapper
                  type="email"
                  label="Email"
                  id="email"
                  value={formData.email}
                  onBlur={handleBlur('email')}
                  onChange={handleChange('email')}
                  required
                />
                <InputWrapper
                  type="password"
                  label="Password"
                  id="password"
                  value={formData.password}
                  onBlur={handleBlur('password')}
                  onChange={handleChange('password')}
                  required
                />
              </div>
              <div className="form-actions">
                <ButtonBase type="submit" disabled={!isFormValid}>
                  Sign in
                </ButtonBase>
              </div>
            </FormModal>
          </div>
        )}
      </Router>
    </>
  );
}

export default App;
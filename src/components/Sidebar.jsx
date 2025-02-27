import React, { useState, useEffect } from 'react';
import './../styles/Sidebar.css';
import 'boxicons/css/boxicons.min.css';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import GetAccountByAccountIdFromTokenFetchAsync from '../api/Authorization.API/GetAccountByAccountIdFromTokenFetchAsync';
import GetDoctorByAccountIdFromTokenFetchAsync from '../api/Profiles.API/GetDoctorByAccountIdFromTokenFetchAsync';
import GetReceptionistByAccountIdFromTokenFetchAsync from '../api/Profiles.API/GetReceptionistByAccountIdFromTokenFetchAsync';

const Sidebar = () => {
    const [account, setAccount] = useState(null);
    const [profile, setProfile] = useState(null);

    const [showSidebar, setShowSidebar] = useState(false);
    const [currentTheme, setCurrentTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedAccount = await GetAccountByAccountIdFromTokenFetchAsync();
                setAccount(fetchedAccount);

                if (fetchedAccount.role === "Doctor") {
                    const fetchedProfile = await GetDoctorByAccountIdFromTokenFetchAsync();
                    setProfile(fetchedProfile);
                } else if (fetchedAccount.role === "Receptionist") {
                    const fetchedProfile = await GetReceptionistByAccountIdFromTokenFetchAsync();
                    setProfile(fetchedProfile);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
    }, [currentTheme]);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleSubMenuClick = (e) => {
        const listItem = e.currentTarget.closest('li');
        if (listItem) {
            listItem.classList.toggle("showMenu");
        }
    };

    let isUserLoggedIn = Cookies.get('refreshToken') !== undefined;

    const handleLogOut = () => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = "/";
    };

    const toggleTheme = () => {
        setCurrentTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    return (
        <>
            <div className={`sidebar ${showSidebar ? '' : 'close'}`}>
                <div className="logo-details">
                    <i className='bx bx-menu' onClick={toggleSidebar}></i>
                    <span className="logo_name">DashBoard</span>
                </div>
                <ul className="nav-links">
                    <li>
                        <Link to="/">
                            <i className='bx bx-home'></i>
                            <span className="link_name">Home</span>
                        </Link>
                        <ul className="sub-menu blank">
                            <li><Link to="/" className="link_name">Home</Link></li>
                        </ul>
                    </li>
                    <li>
                        {account && account.role === 'Receptionist' && (
                            <>
                                <Link to="/doctors">
                                    <i className='bx bx-user-circle'></i>
                                    <span className="link_name">Doctors</span>
                                </Link>
                                <ul className="sub-menu blank">
                                    <li><Link to="/doctors" className="link_name">Doctors</Link></li>
                                </ul>
                            </>
                        )}
                    </li>
                    {account && (account.role === 'Doctor' ? (
                        <li>
                            <Link to="/mySchedule">
                                <i className='bx bx-calendar'></i>
                                <span className="link_name">My schedule</span>
                            </Link>
                            <ul className="sub-menu blank">
                                <li><Link to="/mySchedule" className="link_name">My schedule</Link></li>
                            </ul>
                        </li>
                    ) : account && (account.role === 'Receptionist' ? (
                        <li>
                            <Link to="/appointments">
                                <i className='bx bx-calendar'></i>
                                <span className="link_name">Appointments</span>
                            </Link>
                            <ul className="sub-menu blank">
                                <li><Link to="/appointments" className="link_name">Appointments</Link></li>
                            </ul>
                        </li>
                    ) : null))}
                    <li>
                        <Link to="/offices">
                            <i className='bx bx-buildings'></i>
                            <span className="link_name">Offices</span>
                        </Link>
                        <ul className="sub-menu blank">
                            <li><Link className="link_name" to="/offices">Offices</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/specialization">
                            <i className='bx bx-collection'></i>
                            <span className="link_name">Specialization</span>
                        </Link>
                        <ul className="sub-menu blank">
                            <li><Link className="link_name" to="/specialization">Specialization</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link onClick={toggleTheme}>
                            {currentTheme === 'light' ? <i className='bx bx-moon'></i> : <i className='bx bx-sun sun'></i>}
                            <span className="link_name">Switching themes</span>
                        </Link>
                        <ul className="sub-menu blank">
                            <li><Link className="link_name" onClick={toggleTheme}>Switching themes</Link></li>
                        </ul>
                    </li>
                    {isUserLoggedIn && account && profile ? (
                        <li>
                            <div className="profile-details">
                                <Link to="/doctorProfile">
                                    <div className="profile-content">
                                        <img src="https://th.bing.com/th/id/OIP.audMX4ZGbvT2_GJTx2c4GgAAAA?rs=1&pid=ImgDetMain" alt="profileImg" />
                                    </div>
                                    <div className="name-job">
                                        <div className="profile_name">{`${profile.firstName} ${profile.lastName}`}</div>
                                        <div className="job">{account.role}</div>
                                    </div>
                                </Link>
                                <i className='bx bx-log-out' onClick={handleLogOut}></i>
                            </div>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link >
                                    <i className='bx bx-log-in'></i>
                                    <span className="link_name">Login</span>
                                </Link>
                                <ul className="sub-menu blank">
                                    <li><Link className="link_name" >Login</Link></li>
                                </ul>
                            </li>
                            <li>
                                <Link >
                                    <i className='bx bx-user-plus'></i>
                                    <span className="link_name">SignUp</span>
                                </Link>
                                <ul className="sub-menu blank">
                                    <li><Link className="link_name" >SignUp</Link></li>
                                </ul>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
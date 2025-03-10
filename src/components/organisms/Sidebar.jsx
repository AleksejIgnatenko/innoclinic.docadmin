import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IconBase } from "../atoms/IconBase";
import '../../styles/organisms/Sidebar.css';
import 'boxicons/css/boxicons.min.css';
import Cookies from 'js-cookie';

export default function Sidebar({currentTheme, toggleTheme, isUserLoggedIn}) {
    const [account, setAccount] = useState(null);
    const [profile, setProfile] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            // try {
            //     const fetchedAccount = await GetAccountByAccountIdFromTokenFetchAsync();
            //     setAccount(fetchedAccount);

            //     if (fetchedAccount.role === "Doctor") {
            //         const fetchedProfile = await GetDoctorByAccountIdFromTokenFetchAsync();
            //         setProfile(fetchedProfile);
            //     } else if (fetchedAccount.role === "Receptionist") {
            //         const fetchedProfile = await GetReceptionistByAccountIdFromTokenFetchAsync();
            //         setProfile(fetchedProfile);
            //     }

            // } catch (error) {
            //     console.error('Error fetching data:', error);
            // }
        };

        fetchData();
    }, []);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleLogOut = () => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = "/";
    };

    return (
        <>
            <div className={`sidebar ${showSidebar ? '' : 'close'}`}>
                <div className="logo-details">
                    <IconBase name="bx-menu" className="menu-icon" onClick={toggleSidebar} />
                    <span className="logo_name">DashBoard</span>
                </div>
                <ul className="nav-links">
                    <li>
                        <Link to="/">
                            <IconBase name="bx-home" className="nav-icon" />
                            <span className="link_name">Home</span>
                        </Link>
                        <ul className="sub-menu blank">
                            <li><Link to="/" className="link_name">Home</Link></li>
                        </ul>
                    </li>
                    {/* {account && account.role === 'Receptionist' && ( */}
                        <li>
                            <Link to="/doctors">
                                <IconBase className='bx-user-circle' />
                                <span className="link_name">Doctors</span>
                            </Link>
                            <ul className="sub-menu blank">
                                <li><Link to="/doctors" className="link_name">Doctors</Link></li>
                            </ul>
                        </li>
                    {/* )} */}
                    {/* {account && (account.role === 'Doctor' ? ( */}
                        <li>
                            <Link to="/mySchedule">
                                <IconBase className='bx-calendar'/>
                                <span className="link_name">My schedule</span>
                            </Link>
                            <ul className="sub-menu blank">
                                <li><Link to="/mySchedule" className="link_name">My schedule</Link></li>
                            </ul>
                        </li>
                    {/* ) : account && (account.role === 'Receptionist' ? ( */}
                        <li>
                            <Link to="/appointments">
                                <IconBase className='bx-calendar' />
                                <span className="link_name">Appointments</span>
                            </Link>
                            <ul className="sub-menu blank">
                                <li><Link to="/appointments" className="link_name">Appointments</Link></li>
                            </ul>
                        </li>
                    {/* ) : null))} */}
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
                            <IconBase className='bx bx-collection' />
                            <span className="link_name">Specialization</span>
                        </Link>
                        <ul className="sub-menu blank">
                            <li><Link className="link_name" to="/specialization">Specialization</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link onClick={toggleTheme}>
                            <IconBase 
                                name={currentTheme === 'light' ? 'bx-moon' : 'bx-sun sun'} 
                                className="nav-icon"
                            />
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
                                    <IconBase className='bx bx-log-in' />
                                    <span className="link_name">Login</span>
                                </Link>
                                <ul className="sub-menu blank">
                                    <li><Link className="link_name" >Login</Link></li>
                                </ul>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </>
    );
};
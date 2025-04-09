import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IconBase } from "../atoms/IconBase";
import '../../styles/organisms/Sidebar.css';
import 'boxicons/css/boxicons.min.css';

import GetAccountByAccountIdFromTokenFetchAsync from "../../api/Authorization.API/GetAccountByAccountIdFromTokenFetchAsync";
import GetDoctorByAccountIdFromTokenFetchAsync from "../../api/Profiles.API/GetDoctorByAccountIdFromTokenFetchAsync";
import GetReceptionistByAccountIdFromTokenFetchAsync from "../../api/Profiles.API/GetReceptionistByAccountIdFromTokenFetchAsync";
import GetPhotoByIdAsync from "../../api/Documents.API/GetPhotoByIdAsync";
import LogOutFetchAsync from "../../api/Authorization.API/LogOutFetchAsync";

export default function Sidebar({ currentTheme, toggleTheme, isLoggedIn }) {

    const [photo, setPhoto] = useState(null);
    const [profile, setProfile] = useState(null);
    const [account, setAccount] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedAccount = await GetAccountByAccountIdFromTokenFetchAsync();
                setAccount(fetchedAccount);

                if (fetchedAccount.role === "Doctor") {
                    const fetchedProfile = await GetDoctorByAccountIdFromTokenFetchAsync();

                    if (fetchedProfile.account.photoId) {
                        const fetchedPhoto = await GetPhotoByIdAsync(fetchedProfile.account.photoId);
                        setPhoto(fetchedPhoto);
                    }

                    setProfile(fetchedProfile);
                } else if (fetchedAccount.role === "Receptionist") {
                    const fetchedProfile = await GetReceptionistByAccountIdFromTokenFetchAsync();

                    if (fetchedProfile.account.photoId) {
                        const fetchedPhoto = await GetPhotoByIdAsync(fetchedProfile.account.photoId);
                        setPhoto(fetchedPhoto);
                    }

                    setProfile(fetchedProfile);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    async function handleLogOut() {
        await LogOutFetchAsync();
    };

    const truncateName = (name) => {
        if (!name) return '';
        return name.length > 10 ? name.substring(0, 10) + '...' : name;
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
                    {account && account.role === 'Receptionist' && (
                        <li>
                            <Link to="/receptionists">
                                <IconBase name='bx-cool' />
                                <span className="link_name">Receptionists</span>
                            </Link>
                            <ul className="sub-menu blank">
                                <li><Link to="/doctors" className="link_name">Receptionists</Link></li>
                            </ul>
                        </li>
                    )}
                    {account && account.role === 'Receptionist' && (
                        <li>
                            <Link to="/doctors">
                                <IconBase name='bx-user-circle' />
                                <span className="link_name">Doctors</span>
                            </Link>
                            <ul className="sub-menu blank">
                                <li><Link to="/doctors" className="link_name">Doctors</Link></li>
                            </ul>
                        </li>
                    )}
                    {account && account.role === 'Receptionist' && (
                        <li>
                            <Link to="/patients">
                                <IconBase name='bx-group' />
                                <span className="link_name">Patients</span>
                            </Link>
                            <ul className="sub-menu blank">
                                <li><Link to="/patients" className="link_name">Patients</Link></li>
                            </ul>
                        </li>
                    )}
                    {account && account.role === 'Doctor' ? (
                        <li>
                            <Link to="/my-schedule">
                                <IconBase name='bx-calendar' />
                                <span className="link_name">My schedule</span>
                            </Link>
                            <ul className="sub-menu blank">
                                <li><Link to="/my-schedule" className="link_name">My schedule</Link></li>
                            </ul>
                        </li>
                    ) : account && account.role === 'Receptionist' ? (
                        <li>
                            <Link to="/appointments">
                                <IconBase name='bx-calendar' />
                                <span className="link_name">Appointments</span>
                            </Link>
                            <ul className="sub-menu blank">
                                <li><Link to="/appointments" className="link_name">Appointments</Link></li>
                            </ul>
                        </li>
                    ) : null}
                    {account && account.role === 'Receptionist' && (
                        <li>
                            <Link to="/offices">
                                <IconBase className='bx-buildings'></IconBase>
                                <span className="link_name">Offices</span>
                            </Link>
                            <ul className="sub-menu blank">
                                <li><Link className="link_name" to="/offices">Offices</Link></li>
                            </ul>
                        </li>
                    )}
                    {account && account.role === 'Receptionist' && (
                        <li>
                            <Link to="/specializations">
                                <IconBase name='bx-collection' />
                                <span className="link_name">Specialization</span>
                            </Link>
                            <ul className="sub-menu blank">
                                <li><Link className="link_name" to="/specializations">Specialization</Link></li>
                            </ul>
                        </li>
                    )}
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
                    {isLoggedIn ? (
                        <li>
                            <div className="profile-details">
                                <Link to={account && account.role === 'Doctor' ? "/doctor" : (account && account.role === 'Receptionist' ? "/receptionist" : "/")}>
                                    <div className="profile-content">
                                        <img src={photo} alt="profileImg" />
                                    </div>
                                    <div className="profile-info">
                                        {profile ? (
                                            <>
                                                <div className="profile_name">{`${truncateName(`${profile.firstName} ${profile.lastName}`)}`}</div>
                                                <div className="role">{profile.role || 'Role'}</div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="profile_name">Name</div>
                                                <div className="role">Role</div>
                                            </>
                                        )}

                                    </div>
                                </Link>
                                <i className='bx bx-log-out' onClick={handleLogOut}></i>
                            </div>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link >
                                    <IconBase name='bx-log-in' />
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
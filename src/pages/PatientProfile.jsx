import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import "./../styles/PatientProfile.css";
import Loader from '../components/Loader';
import ProfileCard from '../components/ProfileCard';
import GetPatientByIdFetchAsync from '../api/Profiles.API/GetPatientByIdFetchAsync';

function PatientProfile() {
    const { patientId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('PersonalInformation');
    const [profile, setProfile] = useState(null);
    const [appointmentResults, setAppointmentResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);
                const fetchProfile = await GetPatientByIdFetchAsync(patientId); 
                setProfile(fetchProfile);

                // const results = await GetAppointmentResultsByPatientIdFetchAsync(patientId);
                // setAppointmentResults(results);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, [patientId]);

    useEffect(() => {
        const tab = new URLSearchParams(location.search).get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [location]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/patientProfile/${patientId}?tab=${tab}`);
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    return (
        <div className="tabs">
            {isLoading && <Loader />}
            <ul className="tabs-content">
                <button
                    className={`tabs__button ${activeTab === 'PersonalInformation' ? 'is-active' : ''}`}
                    onClick={() => handleTabClick('PersonalInformation')}
                >
                    Personal Information
                </button>
                <button
                    className={`tabs__button ${activeTab === 'AppointmentResults' ? 'is-active' : ''}`}
                    onClick={() => handleTabClick('AppointmentResults')}
                >
                    Appointment Results
                </button>
            </ul>

            {!isLoading && (
                <div className='tabs-container'>
                    <div data-content className={activeTab === 'PersonalInformation' ? 'is-active' : ''} id="personalInformation">
                        <div className='container-profile-card'>
                           <ProfileCard profile={profile} />
                        </div>
                    </div>

                    <div data-content className={activeTab === 'AppointmentResults' ? 'is-active' : ''} id="appointmentResults">
                        <h2 className='profile-card-title'>Appointment Results</h2>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PatientProfile;
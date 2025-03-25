import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import usePatientForm from "../hooks/usePatientForm";
import Loader from "../components/organisms/Loader";
import ProfileCard from "../components/organisms/ProfileCard";
import GetPatientByIdFetchAsync from "../api/Profiles.API/GetPatientByIdFetchAsync";
import "./../styles/pages/Patient.css";

function Patient() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [photo, setPhoto] = useState(null);

    const [activeTab, setActiveTab] = useState('PersonalInformation');

    const [isLoading, setIsLoading] = useState(false);

    const { formData, setFormData, errors, handleChange, handleBlur, resetForm, isFormValid } = usePatientForm({
        firstName: '',
        lastName: '',
        middleName: '',
        isLinkedToAccount: false,
        dateOfBirth: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchPatient = await GetPatientByIdFetchAsync(id);
                setPatient(fetchPatient);
                setFormData(fetchPatient);

            } catch (error) {
                console.error('Error fetching patient:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const tab = new URLSearchParams(location.search).get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [location]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/patient/${id}?tab=${tab}`);
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    return (
        <>
            <div className="tabs">
                <ul className="tabs-content">
                    <button
                        className={`tabs-button ${activeTab === 'PersonalInformation' ? 'is-active' : ''}`}
                        onClick={() => handleTabClick('PersonalInformation')}
                    >
                        Personal Information
                    </button>
                    <button
                        className={`tabs-button ${activeTab === 'AppointmentResults' ? 'is-active' : ''}`}
                        onClick={() => handleTabClick('AppointmentResults')}
                    >
                        Appointment Results
                    </button>
                </ul>
            </div>
            {isLoading ? (
                <Loader />
            ) : (
                <ProfileCard>
                    <div data-content className={activeTab === 'PersonalInformation' ? 'is-active' : ''} id="personalInformation">
                        <div className="profile-img">
                            <div class="img-container">
                                <img src={photo} alt="" />
                            </div>
                        </div>
                        <div className="profile-content">
                            <p>First name: {formData.firstName}</p>
                            <p>Last name: {formData.lastName}</p>
                            <p>Middle name: {formData.middleName}</p>
                            <p>Date of birth: {formData.dateOfBirth}</p>
                        </div>
                    </div>
                </ProfileCard>
            )}
        </>
    );
}

export default Patient;
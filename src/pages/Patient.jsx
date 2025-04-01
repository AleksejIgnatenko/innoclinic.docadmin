import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import usePatientForm from "../hooks/usePatientForm";
import Loader from "../components/organisms/Loader";
import ProfileCard from "../components/organisms/ProfileCard";
import GetPatientByIdFetchAsync from "../api/Profiles.API/GetPatientByIdFetchAsync";
import "./../styles/pages/Patient.css";
import Toolbar from "../components/organisms/Toolbar";
import GetPhotoByNameAsync from "../api/Documents.API/GetPhotoByIdAsync";

function Patient() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);

    const [photo, setPhoto] = useState(null);
    const [editingPhoto, setEditingPhoto] = useState(null);

    const [activeTab, setActiveTab] = useState('personal-information');

    const [isLoading, setIsLoading] = useState(false);

    const { formData, setFormData, errors, handleChange, handleBlur, resetForm, isFormValid } = usePatientForm({
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchPatient = await GetPatientByIdFetchAsync(id);

                if (fetchPatient.account.photoId) {
                    const fetchedPhoto = await GetPhotoByNameAsync(fetchPatient.account.photoId);
                    setPhoto(fetchedPhoto);
                    setEditingPhoto(fetchedPhoto);
                }

                setPatient(fetchPatient);

                const formattedPatient = formatPatient(fetchPatient);
                setFormData(formattedPatient);


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

    const formatPatient = (patient) => {
        const {
            id,
            firstName,
            lastName,
            middleName,
            account,
            dateOfBirth,
        } = patient;

        return {
            id,
            firstName,
            lastName,
            middleName,
            phoneNumber: account.phoneNumber,
            dateOfBirth,
        };
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/profile?tab=${tab}`);
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    return (
        <>
            <Toolbar pageTitle="Profile" />
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <div className="tabs">
                        <ul className="tabs-content">
                            <button
                                className={`tabs-button ${activeTab === 'personal-information' ? 'is-active' : ''}`}
                                onClick={() => handleTabClick('personal-information')}
                            >
                                Personal Information
                            </button>
                            <button
                                className={`tabs-button ${activeTab === 'appointment-results' ? 'is-active' : ''}`}
                                onClick={() => handleTabClick('appointment-results')}
                            >
                                Appointment Results
                            </button>
                        </ul>
                    </div>

                    {activeTab === 'personal-information' && (
                        <ProfileCard>
                            <div data-content className={activeTab === 'personal-information' ? 'is-active' : ''} id="personalInformation">
                                <div className="profile-img">
                                    <div class="img-container">
                                        <img src={photo} alt="" />
                                    </div>
                                </div>
                                <div className="profile-content">
                                    <p>First name: {formData.firstName}</p>
                                    <p>Last name: {formData.lastName}</p>
                                    <p>Middle name: {formData.middleName}</p>
                                    <p>Phone Number: {formData.middleName}</p>
                                    <p>Date of birth: {formData.dateOfBirth}</p>
                                </div>
                            </div>
                        </ProfileCard>
                    )}

                    {activeTab === 'appointment-results' && (
                        <ProfileCard>
                            <div data-content className={activeTab === 'appointment-results' ? 'is-active' : ''} id="personalInformation">
                                <h1>Appointment results</h1>
                            </div>
                        </ProfileCard>
                    )}
                </>
            )}
        </>
    );
}

export default Patient;
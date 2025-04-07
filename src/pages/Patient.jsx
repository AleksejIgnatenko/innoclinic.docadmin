import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import usePatientForm from "../hooks/usePatientForm";
import Loader from "../components/organisms/Loader";
import ProfileCard from "../components/organisms/ProfileCard";
import GetPatientByIdFetchAsync from "../api/Profiles.API/GetPatientByIdFetchAsync";
import "./../styles/pages/Patient.css";
import "./../styles/organisms/Tab.css";
import Toolbar from "../components/organisms/Toolbar";
import GetPhotoByNameAsync from "../api/Documents.API/GetPhotoByIdAsync";
import GetAllAppointmentsByPatientIdFetchAsync from "../api/Appointments.API/GetAllAppointmentsByPatientIdFetchAsync";
import FieldNames from "../enums/FieldNames";
import Table from "../components/organisms/Table";
import { IconBase } from "../components/atoms/IconBase";

function Patient() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);

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

    const columnNames = [
        'date',
        'time',
        'doctorFullName',
        'medicalServiceName',
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedPatient = await GetPatientByIdFetchAsync(id);

                if (fetchedPatient.account.photoId) {
                    const fetchedPhoto = await GetPhotoByNameAsync(fetchedPatient.account.photoId);
                    setPhoto(fetchedPhoto);
                    setEditingPhoto(fetchedPhoto);
                }

                const fetchedAppointments = await GetAllAppointmentsByPatientIdFetchAsync(fetchedPatient.id);
                const formattedAppointments = formatAppointment(fetchedAppointments);
                setAppointments(formattedAppointments);

                setPatient(fetchedPatient);

                const formattedPatient = formatPatient(fetchedPatient);
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

    const formatAppointment = (appointments) => {
        return appointments.map(({ id, date, time, doctor, medicalService }) => ({
            id,
            date: date,
            time: time,
            doctorFullName: `${doctor.firstName} ${doctor.lastName} ${doctor.middleName}`,
            medicalServiceName: medicalService.serviceName,
        }));
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/patient/${id}?tab=${tab}`);
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    return (
        <>
            <Toolbar pageTitle="PAtient" />
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
                        <div data-content className={activeTab === 'appointment-results' ? 'is-active' : ''} id="personalInformation">
                            <>
                                {appointments.length === 0 && (
                                    <p className="no-items">Nothing was found</p>
                                )}
                                {appointments.length > 0 && (
                                    <div className="table">
                                        <Table>
                                            <thead>
                                                <tr>
                                                    {columnNames.map(columnName => (
                                                        <th key={columnName}>
                                                            {FieldNames[columnName]}
                                                        </th>
                                                    ))}
                                                    <th>Medical Results</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {appointments.map(appointment => (
                                                    <tr key={appointment.id}>
                                                        {columnNames.map(columnName => (
                                                            <td key={columnName}>{appointment[columnName]}</td>
                                                        ))}
                                                        <td
                                                            onClick={() => navigate(`/appointment-results/${appointment.id}/${patient.id}`)}
                                                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                                        >
                                                            Appointment Results
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                            </>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default Patient;
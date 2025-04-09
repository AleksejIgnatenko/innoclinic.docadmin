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
import UpdatePhotoFetchAsync from "../api/Documents.API/UpdatePhotoFetchAsync";
import CreatePhotoFetchAsync from "../api/Documents.API/CreatePhotoFetchAsync";
import ImageUploader from "../components/organisms/ImageUploader";
import { InputWrapper } from "../components/molecules/InputWrapper";
import UpdatePatientFecthAsync from "../api/Profiles.API/UpdatePatientFecthAsync";

function Patient() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);

    const [photo, setPhoto] = useState(null);
    const [editingPhoto, setEditingPhoto] = useState(null);

    const [activeTab, setActiveTab] = useState('personal-information');

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { formData, setFormData, errors, setErrors, handleChange, handleBlur, handlePhoneNumberKeyDown, resetForm, isFormValid } = usePatientForm({
        firstName: '',
        lastName: '',
        middleName: '',
        phoneNumber: '',
        dateOfBirth: '',
    });

    const columnNames = [
        'date',
        'time',
        'doctorFullName',
        'medicalServiceName',
    ];

    const fetchData = async () => {
        try {
            toggleLoader(true);

            const fetchedPatient = await GetPatientByIdFetchAsync(id);
            setPatient(fetchedPatient);

            if (fetchedPatient.account.photoId) {
                const fetchedPhoto = await GetPhotoByNameAsync(fetchedPatient.account.photoId);
                setPhoto(fetchedPhoto);
                setEditingPhoto(fetchedPhoto);
            }

            const fetchedAppointments = await GetAllAppointmentsByPatientIdFetchAsync(fetchedPatient.id);
            const formattedAppointments = formatAppointment(fetchedAppointments);
            setAppointments(formattedAppointments);

            const formattedPatient = formatPatient(fetchedPatient);
            setFormData(formattedPatient);
        } catch (error) {
            console.error('Error fetching patient:', error);
        } finally {
            toggleLoader(false);
        }
    };

    useEffect(() => {
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

    const toggleEditClick = () => {
        if (isEditing) {
            const confirmCancel = window.confirm("Do you really want to cancel? Changes will not be saved.");
            if (!confirmCancel) {
                return;
            }
            setFormData(patient);
        }
        setErrors({
            firstName: true,
            lastName: true,
            phoneNumber: true,
            dateOfBirth: true,
        });
        setIsEditing(!isEditing);
    };

    async function handleUpdate() {
        setIsEditing(false);

        let photoId = '';
        if (!patient.account.photoId && editingPhoto) {
            photoId = await CreatePhotoFetchAsync(editingPhoto);

            setPhoto(editingPhoto);
        } else if (editingPhoto instanceof Blob) {
            const imageUrl = URL.createObjectURL(editingPhoto);
            setPhoto(imageUrl)

            await UpdatePhotoFetchAsync(editingPhoto, patient.photoId);
        }

        const updatePatientRequest = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            middleName: formData.middleName,
            isLinkedToAccount: patient.isLinkedToAccount,
            phoneNumber: formData.phoneNumber,
            dateOfBirth: formData.dateOfBirth,
            photoId: photoId,
        }

        await UpdatePatientFecthAsync(patient.id, updatePatientRequest);
        fetchData();
    }

    return (
        <>
            <Toolbar pageTitle="Patient" />
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
                            <div className="profile-icon-container">
                                {isEditing ? (
                                    <>
                                        <IconBase
                                            name={"bx-check"}
                                            onClick={isFormValid ? handleUpdate : null}
                                            style={{ cursor: isFormValid ? 'pointer' : 'not-allowed' }}
                                            className={isFormValid ? '' : 'icon-invalid'}
                                        />
                                        <IconBase name={"bx-x"} onClick={toggleEditClick} />
                                    </>
                                ) : (
                                    <IconBase name={"bx-pencil"} onClick={toggleEditClick} style={{ cursor: 'pointer' }} />
                                )}
                            </div>
                            {isEditing ? (
                                <div className="img-container">
                                    <ImageUploader
                                        photo={photo}
                                        setPhoto={setEditingPhoto}
                                    />
                                </div>
                            ) : (
                                <div className="img-container">
                                    <img src={photo} alt="" className={photo ? '' : 'img-area'} />
                                </div>
                            )}

                            {isEditing ? (
                                <div>
                                    <InputWrapper
                                        type="text"
                                        label="First Name"
                                        id="firstName"
                                        value={formData.firstName}
                                        onBlur={handleBlur('firstName')}
                                        onChange={handleChange('firstName')}
                                        required
                                    />
                                    <InputWrapper
                                        type="text"
                                        label="Last Name"
                                        id="lastName"
                                        value={formData.lastName}
                                        onBlur={handleBlur('lastName')}
                                        onChange={handleChange('lastName')}
                                        required
                                    />
                                    <InputWrapper
                                        type="text"
                                        label="Middle Name"
                                        id="middleName"
                                        value={formData.middleName}
                                        onBlur={handleBlur('middleName', false)}
                                        onChange={handleChange('middleName', false)}
                                        required
                                    />
                                    <InputWrapper
                                        type="text"
                                        label="Phone Number"
                                        id="phoneNumber"
                                        value={formData.phoneNumber}
                                        onBlur={handleBlur('phoneNumber')}
                                        onChange={handleChange('phoneNumber')}
                                        onKeyDown={handlePhoneNumberKeyDown}
                                        required
                                    />
                                    <InputWrapper
                                        type="date"
                                        label="Date Of Birth"
                                        id="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onBlur={handleBlur('dateOfBirth')}
                                        onChange={handleChange('dateOfBirth')}
                                        required
                                    />
                                </div>
                            ) : (
                                <div className="profile-content">
                                    <p>First name: {formData.firstName}</p>
                                    <p>Last name: {formData.lastName}</p>
                                    <p>Middle name: {formData.middleName}</p>
                                    <p>Phone Number: {formData.phoneNumber}</p>
                                    <p>Date of birth: {formData.dateOfBirth}</p>
                                </div>
                            )}
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
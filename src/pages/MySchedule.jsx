import { useEffect, useState } from "react";
import Toolbar from '../components/organisms/Toolbar';
import Loader from '../components/organisms/Loader';
import Table from '../components/organisms/Table';
import 'boxicons/css/boxicons.min.css';
import '../styles/pages/Doctors.css';
import Calendar from "../components/organisms/Calendar";
import FieldNames from "../enums/FieldNames";
import { Link, useNavigate } from "react-router-dom";
import GetAppointmentsByDoctorAndDateFetchAsync from "../api/Appointments.API/GetAppointmentsByDoctorAndDateFetchAsync";
import FormModal from "../components/organisms/FormModal";
import { ButtonBase } from "../components/atoms/ButtonBase";
import IsAppointmentResultsExistenceFetchAsync from "../api/Appointments.API/IsAppointmentResultsExistenceFetchAsync";
import { InputWrapper } from "../components/molecules/InputWrapper";
import useAppointmentResultForm from "../hooks/useAppointmentResultForm";
import GetPatientByIdFetchAsync from "../api/Profiles.API/GetPatientByIdFetchAsync";
import GetDoctorByIdFetchAsync from "../api/Profiles.API/GetDoctorByIdFetchAsync";
import CreateAndSendToEmailAppointmentResultDocumentFetchAsync from "../api/Documents.API/CreateAndSendAppointmentResultDocumentToEmailAsync";
import CreateAppointmentResultFetchAsync from "../api/Appointments.API/CreateAppointmentResultFetchAsync";

export default function MySchedule() {
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [editableAppointments, setEditableAppointments] = useState([]);

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [isAppoimentResultAddModalOpen, setIsAppoimentResultAddModalOpen] = useState(false);

    const [columnNames, setColumnNames] = useState([
        'time',
        'patientFullName',
        'medicalServiceName',
        'isApproved',
    ]);

    const { appointmentResultFormData, setAppointmentResultFormData, appointmentResultFormDataErrors, handleChangeAppoimentResult, handleBlurAppoimentResult, isAppointmentResultFormValid } = useAppointmentResultForm({
        date: '',
        patientFullName: '',
        dateOfBirth: '',
        doctorFullName: '',
        specialization: '',
        medicalServiceName: '',
        complaints: '',
        conclusion: '',
        recommendations: '',
        diagnosis: '',
    });

    useEffect(() => {
        const getData = async () => {
            toggleLoader(true);

            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 1);
            const formattedDate = currentDate.toISOString().split('T')[0];
            setSelectedDate(formattedDate);

            toggleLoader(false);
        };

        getData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedAppointments = await GetAppointmentsByDoctorAndDateFetchAsync(selectedDate);
                setAppointments(fetchedAppointments);

                const formattedAppointments = formatAppointments(fetchedAppointments);
                setEditableAppointments(formattedAppointments);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, [selectedDate]);

    const formatAppointments = (appointments) => {
        return appointments.map(({ id, time, patient, medicalService, isApproved }) => ({
            id,
            time,
            patientFullName: `${patient.firstName} ${patient.lastName} ${patient.middleName}`,
            medicalServiceName: medicalService.serviceName,
            isApproved: isApproved ? 'Approved' : 'Not Approved',
        }));
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleCalendarClick = () => {
        setIsCalendarOpen(!isCalendarOpen);
    }

    const handleSetSelectedDate = (date) => {
        setSelectedDate(date);
    }

    const toggleAddAppointmentResultModal = () => {
        setIsAppoimentResultAddModalOpen(!isAppoimentResultAddModalOpen);
    };

    const handleAppointmentResultsLinkClick = (appointmentId, patientId) => async (event) => {
        event.preventDefault();

        const isAppointmentResultsExistence = await IsAppointmentResultsExistenceFetchAsync(appointmentId);

        if (isAppointmentResultsExistence) {
            navigate(`/appointment-results/${appointmentId}/${patientId}`)
        } else {
            const fetchedPatient = await GetPatientByIdFetchAsync(patientId);
            setPatient(fetchedPatient);

            const appointment = appointments.find(appointment => appointment.id === appointmentId);

            const fetchedDoctor = await GetDoctorByIdFetchAsync(appointment.doctor.id);
            setDoctor(fetchedDoctor);

            const {
                firstName: patientFirstName,
                lastName: patientLastName,
                middleName: patientMiddleName,
                dateOfBirth
            } = fetchedPatient;

            const {
                firstName: doctorFirstName,
                lastName: doctorLastName,
                middleName: doctorMiddleName,
                specialization: { specializationName },
            } = fetchedDoctor;

            const {
                date,
                medicalService: { serviceName },
                complaints,
                conclusion,
                recommendations,
                diagnosis
            } = appointment;

            const appointmentFormData = {
                appointmentId: appointment.id,
                date,
                patientFullName: `${patientFirstName} ${patientLastName} ${patientMiddleName}`,
                dateOfBirth: dateOfBirth,
                doctorFullName: `${doctorFirstName} ${doctorLastName} ${doctorMiddleName}`,
                specialization: specializationName,
                medicalServiceName: serviceName,
                complaints,
                conclusion,
                recommendations,
                diagnosis,
            };

            setAppointmentResultFormData(appointmentFormData);

            setIsAppoimentResultAddModalOpen(!isAppoimentResultAddModalOpen);
        }
    };

    async function handleAddAppointmentResult(e) {
        e.preventDefault();

        const createAppoimentResultDocumentAndSendToEmailRequest = {
            date: appointmentResultFormData.date,
            patientFullName: appointmentResultFormData.patientFullName,
            dateOfBirth: appointmentResultFormData.dateOfBirth,
            doctorFullName: appointmentResultFormData.doctorFullName,
            specialization: appointmentResultFormData.specialization,
            medicalServiceName: appointmentResultFormData.medicalServiceName,
            complaints: appointmentResultFormData.complaints,
            conclusion: appointmentResultFormData.conclusion,
            recommendations: appointmentResultFormData.recommendations,
            diagnosis: appointmentResultFormData.diagnosis,
            email: patient.account.email,
        }
        
        await CreateAppointmentResultFetchAsync(appointmentResultFormData);
    
        await CreateAndSendToEmailAppointmentResultDocumentFetchAsync(createAppoimentResultDocumentAndSendToEmailRequest);
    }

    return (
        <>
            <Toolbar
                pageTitle="My schedule"

                showCalendarIcon={true}
                toggleCalendarClick={toggleCalendarClick}
            />
            {isLoading ? (<Loader />
            ) : (
                <>
                    <div className="page">
                        {appointments.length === 0 ? (
                            <p className="no-items">Appointments not found</p>
                        ) : (
                            <>
                                {editableAppointments.length === 0 && (
                                    <p className="no-items">Nothing was found</p>
                                )}
                                {editableAppointments.length > 0 && (
                                    <div className="table">
                                        <Table>
                                            <thead>
                                                <tr>
                                                    {columnNames.map(columnName => (
                                                        <th key={columnName}>{FieldNames[columnName]}</th>
                                                    ))}
                                                    <th>Appointment Medical Results</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {editableAppointments.map(editableAppointment => (
                                                    <tr key={editableAppointment.id}>
                                                        {columnNames.map(columnName => (
                                                            <td key={columnName}>
                                                                {(columnName === 'patientFullName' && editableAppointment.isApproved === 'Approved') ? (
                                                                    <Link to={`/patient/${appointments.find(a => a.id === editableAppointment.id).patient.id}?tab=personal-information`} className="link_name">
                                                                        {editableAppointment[columnName]}
                                                                    </Link>
                                                                ) : (
                                                                    editableAppointment[columnName]
                                                                )}
                                                            </td>
                                                        ))}
                                                        <td>
                                                            {editableAppointment.isApproved === 'Approved' ? (
                                                                <Link onClick={handleAppointmentResultsLinkClick(editableAppointment.id, appointments.find(a => a.id === editableAppointment.id).patient.id)} className="link_name">
                                                                    Appointment Medical Results
                                                                </Link>
                                                            ) : (
                                                                "Appointment Medical Results"
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {isCalendarOpen && (
                        <Calendar onClose={toggleCalendarClick} handleSetSelectedDate={handleSetSelectedDate} currentDate={selectedDate} />
                    )}

                    {isAppoimentResultAddModalOpen && (
                        <FormModal title="Add doctor" onClose={toggleAddAppointmentResultModal} onSubmit={handleAddAppointmentResult} showCloseButton={true}>
                            <div className="modal-inputs">
                                <InputWrapper
                                    type="date"
                                    label="Date"
                                    id="Date"
                                    value={appointmentResultFormData.date}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Full Name Of The Patient"
                                    id="patientFullName"
                                    value={appointmentResultFormData.patientFullName}
                                    required
                                />
                                <InputWrapper
                                    type="date"
                                    label="Patient’s Date Of Birth"
                                    id="dateOfBirth"
                                    value={appointmentResultFormData.dateOfBirth}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Full Name Of The Doctor"
                                    id="doctorFullName"
                                    value={appointmentResultFormData.doctorFullName}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Doctor’s Specialization"
                                    id="specialization"
                                    value={appointmentResultFormData.specialization}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Service Name"
                                    id="medicalServiceName"
                                    value={appointmentResultFormData.medicalServiceName}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Complaints"
                                    id="complaints"
                                    value={appointmentResultFormData.complaints}
                                    onBlur={handleBlurAppoimentResult('complaints')}
                                    onChange={handleChangeAppoimentResult('complaints')}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Conclusion"
                                    id="conclusion"
                                    value={appointmentResultFormData.conclusion}
                                    onBlur={handleBlurAppoimentResult('conclusion')}
                                    onChange={handleChangeAppoimentResult('conclusion')}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Recommendations"
                                    id="recommendations"
                                    value={appointmentResultFormData.recommendations}
                                    onBlur={handleBlurAppoimentResult('recommendations')}
                                    onChange={handleChangeAppoimentResult('recommendations')}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Diagnosis"
                                    id="diagnosis"
                                    value={appointmentResultFormData.diagnosis}
                                    onBlur={handleBlurAppoimentResult('diagnosis')}
                                    onChange={handleChangeAppoimentResult('diagnosis')}
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <ButtonBase type="submit" disabled={!isAppointmentResultFormValid}>
                                    Confirm
                                </ButtonBase>
                                <ButtonBase variant="secondary" onClick={toggleAddAppointmentResultModal}>
                                    Cancel
                                </ButtonBase>
                            </div>
                        </FormModal>
                    )}
                </>
            )}
        </>
    );
}
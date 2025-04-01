import { useEffect, useState } from "react";
import Toolbar from '../components/organisms/Toolbar';
import Loader from '../components/organisms/Loader';
import Table from '../components/organisms/Table';
import 'boxicons/css/boxicons.min.css';
import '../styles/pages/Doctors.css';
import Calendar from "../components/organisms/Calendar";
import FieldNames from "../enums/FieldNames";
import { Link } from "react-router-dom";
import GetAppointmentsByDoctorAndDateFetchAsync from "../api/Appointments.API/GetAppointmentsByDoctorAndDateFetchAsync";
import useAppointmentResultForm from "../hooks/useAppointmentResultForm";
import FormModal from "../components/organisms/FormModal";
import { InputWrapper } from "../components/molecules/InputWrapper";
import { ButtonBase } from "../components/atoms/ButtonBase";

export default function MySchedule() {
    const [appointments, setAppointments] = useState([]);
    const [editableAppointments, setEditableAppointments] = useState([]);

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [isAppointmentAddModalOpen, setIsAppointmentAddModalOpen] = useState(false);

    const [columnNames, setColumnNames] = useState([
        'time',
        'patientFullName',
        'medicalServiceName',
        'isApproved',
    ]);

    const { appointmentFormData, setAppointmentFormData, appointmentErrors, handleChangeAppointment, handleBlurAppointment, isAppointmentFormValid } = useAppointmentResultForm({
        complaints: '',
        conclusion: '',
        recommendations: '',
        appointmentId: '',
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

    const toggleAddModalAppointment = () => {
        setIsAppointmentAddModalOpen(!isAppointmentAddModalOpen);
    };

    const handleAppointmentResultsLinkClick = (id) => (event) => {
        event.preventDefault();
        checkAppointmentResultsExistence(id);
    };

    async function checkAppointmentResultsExistence(id) {
        console.log(id);

        console.log(appointmentFormData);
    }

    async function handleAddAppointment(e) {
        e.preventDefault();

        console.log(appointmentFormData);
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
                                                                <Link onClick={handleAppointmentResultsLinkClick(editableAppointment.id)} className="link_name">
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

                        {isCalendarOpen && (
                            <Calendar onClose={toggleCalendarClick} handleSetSelectedDate={handleSetSelectedDate} currentDate={selectedDate} />
                        )}

                        {isAppointmentAddModalOpen && (
                            <FormModal title="Add office" onClose={toggleAddModalAppointment} onSubmit={handleAddAppointment} showCloseButton={true}>
                                <div className="modal-inputs">

                                </div>
                                <div className="form-actions">
                                    <ButtonBase type="submit" disabled={!isAppointmentFormValid}>
                                        Confirm
                                    </ButtonBase>
                                    <ButtonBase variant="secondary" onClick={toggleAddModalAppointment}>
                                        Cancel
                                    </ButtonBase>
                                </div>
                            </FormModal>
                        )}
                    </div>
                </>
            )}
        </>
    );
} 
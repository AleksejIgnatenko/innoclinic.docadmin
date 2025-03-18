import { useEffect, useState } from "react";
import Toolbar from '../components/organisms/Toolbar';
import Loader from '../components/organisms/Loader';
import Table from '../components/organisms/Table';
import 'boxicons/css/boxicons.min.css';
import '../styles/pages/Doctors.css';
import Calendar from "../components/organisms/Calendar";
import FieldNames from "../enums/FieldNames";
import { Link } from "react-router-dom";

export default function MySchedule() {
    const [appointments, setAppointments] = useState([]);
    const [editableAppointments, setEditableAppointments] = useState([]);

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [columnNames, setColumnNames] = useState([
        'time',
        'patientFullName',
        'medicalServiceName',
        'isApproved',
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedAppointments = [
                    {
                        "id": "8918c0b3-194d-43bc-9d50-576af108e2fb",
                        "patient": {
                            "id": "371add01-a140-4a54-9d46-14c6dfe8376e",
                            "firstName": "Иванов",
                            "lastName": "Иван",
                            "middleName": "Иванович",
                            "accountId": "d7144e1d-2ab3-4153-8026-355dcebdcae6"
                        },
                        "doctor": {
                            "id": "e45d3e6c-9f7a-4d29-b5d3-9c3a2a7c2e0e",
                            "accountId": "b3f51cf4-4a5d-483d-a72b-798243d938e2",
                            "firstName": "Петров",
                            "lastName": "Петр",
                            "middleName": "Петрович",
                            "cabinetNumber": 1,
                            "status": "At work"
                        },
                        "medicalService": {
                            "id": "0340c827-240e-4b2a-887a-dc10c836e7cf",
                            "serviceName": "MedicalService",
                            "price": 0,
                            "isActive": true
                        },
                        "date": "2025-03-12",
                        "time": "08:00 - 08:30",
                        "isApproved": false
                    },
                    {
                        "id": "8918c0b3-194d-43bc-9d50-576af108e2fc",
                        "patient": {
                            "id": "371add01-a140-4a54-9d46-14c6dfe8376e",
                            "firstName": "Иванов",
                            "lastName": "Иван",
                            "middleName": "Иванович",
                            "accountId": "d7144e1d-2ab3-4153-8026-355dcebdcae6"
                        },
                        "doctor": {
                            "id": "3c0985c6-4ddb-40a2-a3b3-7bc1048952c7",
                            "accountId": "b3f51cf4-4a5d-483d-a72b-798243d938e2",
                            "firstName": "Иванов",
                            "lastName": "Иван",
                            "middleName": "Иванович",
                            "cabinetNumber": 1,
                            "status": "At work"
                        },
                        "medicalService": {
                            "id": "0340c827-240e-4b2a-887a-dc10c836e7cf",
                            "serviceName": "MedicalService",
                            "price": 0,
                            "isActive": true
                        },
                        "date": "2025-03-12",
                        "time": "08:00 - 08:30",
                        "isApproved": true
                    }
                ]
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
    }, []);

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
                                                                    <Link to={`/patient/${editableAppointment.id}`} className="link_name">
                                                                        {editableAppointment[columnName]}
                                                                    </Link>
                                                                ) : (
                                                                    editableAppointment[columnName]
                                                                )}
                                                            </td>
                                                        ))}
                                                        <td>
                                                            {editableAppointment.isApproved === 'Approved' ? (
                                                                <Link to="/appointment-medical-results" className="link_name">
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
                    </div>
                </>
            )}
        </>
    );
} 
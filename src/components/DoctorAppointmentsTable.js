import React, { useState } from 'react';
import './../styles/DoctorAppointmentsTable.css';
import Calendar from './Calendar';
import { Link } from 'react-router-dom';
import DoctorToolbar from './DoctorToolbar';

const DoctorAppointmentsTable = ({ appointmentsData, selectedDate, setSelectedDate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);

    const handleCalendarClick = () => {
        setShowCalendar(!showCalendar);
    };

    const handleSelectDate = (date) => {
        setSelectedDate(date);
    }

    return (
        <>
            <DoctorToolbar
                pageTitle={"My schedule"}
                setSearchTerm={setSearchTerm}
                showCalendarIcon={true}
                onCalendarClick={handleCalendarClick}
            />
            {showCalendar && (
                <Calendar
                    currentDate={new Date(selectedDate)}
                    onClose={handleCalendarClick}
                    setSelectedDate={setSelectedDate}
                    onSelectDate={handleSelectDate}
                />
            )}
            {appointmentsData.length > 0 && (
                <div className='table-container'>
                    <table>
                        <thead>
                            <tr>
                                <th>Time for appointment</th>
                                <th>Full name</th>
                                <th>Service name</th>
                                <th>Approvement status</th>
                                <th>Medical results</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointmentsData.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td data-label="time-for-appointment">{appointment.time}</td>
                                    <td data-label="full-name">
                                        {appointment.isApproved ? (
                                            <Link to={`/patientProfile/${appointment.patient.id}?tab=PersonalInformation`}>
                                                {`${appointment.patient.lastName} ${appointment.patient.firstName} ${appointment.patient.middleName}`}
                                            </Link>
                                        ) : (
                                            `${appointment.patient.lastName} ${appointment.patient.firstName} ${appointment.patient.middleName}`
                                        )}
                                    </td>
                                    <td data-label="service-name">{appointment.medicalService.serviceName}</td>
                                    <td data-label="approvement-status">
                                        <span className={appointment.isApproved ? "active" : "inactive"}>
                                            {appointment.isApproved ? "Approved" : "Not approved"}
                                        </span>
                                    </td>
                                    <td data-label="medical-results">
                                        {appointment.isApproved ? (
                                            <a href={`https://example.com/results/${appointment.id}`} >link to add/view medical results of the appointment</a>
                                        ) : (
                                            "Results are not available"
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default DoctorAppointmentsTable;
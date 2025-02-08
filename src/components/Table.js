import React, { useState } from 'react';
import './../styles/Table.css';
import Toolbar from './Toolbar';
import Calendar from './Calendar';

const appointmentData = [
    {
        "id": "d9d675de-24c2-4365-a980-cbb8e2b87118",
        "patient": {
            "id": "20829999-7b12-4552-a9e4-e9591179e1b0",
            "firstName": "Петров",
            "lastName": "Петр",
            "middleName": "Петрович",
            "accountId": "04a1fbc5-c607-4522-8990-a4ee6a76e7cf"
        },
        "doctor": {
            "id": "c713fe08-b22f-43fc-8cf2-b2f773f887a5",
            "firstName": "Иванов",
            "lastName": "Иван",
            "middleName": "Иванович",
            "cabinetNumber": 1
        },
        "medicalService": {
            "id": "920789dd-10ea-4d77-bb70-b29078b28dd5",
            "serviceName": "service",
            "price": 0,
            "isActive": true
        },
        "date": "2025-02-07",
        "time": "09:00 AM",
        "isApproved": false
    }
];

const Table = () => {
        const [searchTerm, setSearchTerm] = useState('');
        const [selectedDate, setSelectedDate] = useState('');
        const [showCalendar, setShowCalendar] = useState(false);

        const handleCalendarClick = () => {
            setShowCalendar(!showCalendar);
        };

        const handleSelectDate = (date) => {
            console.log(date);
        }
    
    return (
        <>
            <Toolbar
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
                        {appointmentData.map((appointment) => (
                            <tr key={appointment.id}>
                                <td data-label="time-for-appointment">{appointment.time}</td>
                                <td data-label="full-name">
                                    {appointment.isApproved ? (
                                        <a href={`https://example.com/patient/${appointment.patient.id}`} target="_blank">
                                            {`${appointment.patient.lastName} ${appointment.patient.firstName} ${appointment.patient.middleName}`}
                                        </a>
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
                                        <a href={`https://example.com/results/${appointment.id}`} target="_blank">link to add/view medical results of the appointment</a>
                                    ) : (
                                        "Results are not available"
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Table;
import React, { useState } from 'react';
import './../styles/ReceptionistAppointmentsTable.css';
import Calendar from './Calendar';
import { Link } from 'react-router-dom';
import AppointmentToolbar from './AppointmentToolbar';
import UpdateAppointmentModelRequest from '../models/UpdateAppointmentModelRequest';
import UpdateAppointmentFetchAsync from '../api/Appointments.API/UpdateAppointmentFetchAsync';
import DeleteAppointmentFetchAsync from '../api/Appointments.API/DeleteAppointmentFetchAsync';

const ReceptionistAppointmentsTable =
    ({
        appointments,
        filteredAppointments,
        setFilteredAppointments,
        accounts,
        office,
        doctors,
        medicalServices,
        selectedDate,
        setSelectedDate,
        selectedAddresses,
        setSelectedAddresses,
        selectedDoctor,
        setSelectedDoctor,
        selectedMedicalService,
        setSelectedMedicalService,
        selectedAppointmentStatus,
        setSelectedAppointmentStatus,
        setSearchTerm,
        showCreateAppointmentModal,
    }) => {
        const [showCalendar, setShowCalendar] = useState(false);

        const handleCalendarClick = () => {
            setShowCalendar(!showCalendar);
        };

        const handleSelectDate = (date) => {
            setSelectedDate(date);
        }

        async function handleApproveAppointmentAsync(appointment) {
            const updateAppointmentModelRequest = new UpdateAppointmentModelRequest(
                appointment.id, appointment.doctor.id, appointment.medicalService.id, appointment.patient.id, appointment.date, appointment.time, !appointment.isApproved);

            const resultResponseStatus = await UpdateAppointmentFetchAsync(updateAppointmentModelRequest);
            if(resultResponseStatus === 200) {
                const row = document.getElementById(appointment.id);
                row.classList.add("approved-appointment");

                const btn = document.getElementById("appointment-approve-button");
                btn.classList.add("disabled-button-approve-style");
            }
        }

        async function handleCancelAppointmentAsync(appointment) {
            const confirmCancel = window.confirm("Вы уверены, что хотите отменить встречу?");
            
            if (confirmCancel) {
                const resultResponseStatus = await DeleteAppointmentFetchAsync(appointment.id);
                if(resultResponseStatus === 200) {
                    setFilteredAppointments(prevAppointments => 
                        prevAppointments.filter(a => a.id !== appointment.id)
                    );
                }
                console.log("Встреча отменена."); 
            } else {
                console.log("Отмена встречи отменена.");
            }
        };

        return (
            <>
                <AppointmentToolbar
                    pageTitle={"Appointments"}
                    setSearchTerm={setSearchTerm}

                    appointments={appointments}
                    filteredAppointments={appointments}
                    setFilteredAppointments={setFilteredAppointments}
                    office={office}
                    doctors={doctors}
                    medicalServices={medicalServices}

                    onFilterItems={filteredAppointments}
                    showCalendarIcon={true}
                    showFilterIcon={true}
                    showAddIcon={true}

                    selectedAddresses={selectedAddresses}
                    setSelectedAddresses={setSelectedAddresses}
                    selectedDoctor={selectedDoctor}
                    setSelectedDoctor={setSelectedDoctor}
                    selectedMedicalService={selectedMedicalService}
                    setSelectedMedicalService={setSelectedMedicalService}
                    selectedAppointmentStatus={selectedAppointmentStatus}
                    setSelectedAppointmentStatus={setSelectedAppointmentStatus}

                    onCalendarClick={handleCalendarClick}
                    showCreateAppointmentModal={showCreateAppointmentModal}
                />
                {showCalendar && (
                    <Calendar
                        currentDate={new Date(selectedDate)}
                        onClose={handleCalendarClick}
                        setSelectedDate={setSelectedDate}
                        onSelectDate={handleSelectDate}
                    />
                )}
                {filteredAppointments.length > 0 && (
                    <div className='table-container'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Appointment time</th>
                                    <th>Full name of the doctor</th>
                                    <th>Full name of the patient</th>
                                    <th>Patient phone number</th>
                                    <th>Service name</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAppointments.map((appointment) => (
                                    <tr id={appointment.id} key={appointment.id} className={appointment.isApproved ? 'approved-appointment' : ''}>
                                        <td data-label="appointment-time">{appointment.time}</td>
                                        <td data-label="full-name-of-the-doctor">
                                            {`${appointment.doctor.lastName} ${appointment.doctor.firstName} ${appointment.doctor.middleName}`}
                                        </td>
                                        <td data-label="full-name-of-the-patient">
                                            <Link to={`/patientProfile/${appointment.patient.id}?tab=PersonalInformation`}>
                                                {`${appointment.patient.lastName} ${appointment.patient.firstName} ${appointment.patient.middleName}`}
                                            </Link>
                                        </td>
                                        <td data-label="patient-phone-number">
                                            {accounts.find(account => account.id === appointment.patient.accountId)?.phoneNumber || "Not available"}
                                        </td>
                                        <td data-label="service-name">{appointment.medicalService.serviceName}</td>
                                        <td>
                                            <button className={`button-approve-style ${appointment.isApproved ? 'disabled-button-approve-style' : ''}`}
                                                disabled={appointment.isApproved}
                                                onClick={() => handleApproveAppointmentAsync(appointment)}
                                                id="appointment-approve-button">
                                                Approve
                                            </button>
                                            <button className="button-cancel-style" id="appointment-cancel-button"
                                                onClick={() => handleCancelAppointmentAsync(appointment)}>
                                            Cancel
                                            </button>
                                            <button className="button-reschedule-style" id="appointment-reschedule-button">Reschedule</button>
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

export default ReceptionistAppointmentsTable;
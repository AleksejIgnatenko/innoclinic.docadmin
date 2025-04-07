import { useEffect, useState } from "react";
import Toolbar from '../components/organisms/Toolbar';
import Loader from '../components/organisms/Loader';
import Table from '../components/organisms/Table';
import { ButtonBase } from '../components/atoms/ButtonBase';
import 'boxicons/css/boxicons.min.css';
import '../styles/pages/Doctors.css';
import FilterModal from "../components/organisms/FilterModal";
import CheckboxWrapper from "../components/molecules/CheckboxWrapper";
import Calendar from "../components/organisms/Calendar";
import FieldNames from "../enums/FieldNames";
import { IconBase } from "../components/atoms/IconBase";

import GetAllDoctorsFetchAsync from "../api/Profiles.API/GetAllDoctorsFetchAsync";
import GetAllMedicalServiceFetchAsync from "../api/Services.API/GetAllMedicalServiceFetchAsync";
import GetAllOfficesFetchAsync from "../api/Offices.API/GetAllOfficesFetchAsync";
import GetAppointmentsByDateFetchAsync from "../api/Appointments.API/GetAppointmentsByDateFetchAsync";
import GetAccountsByIdsFetchAsync from "../api/Authorization.API/GetAccountsByIdsFetchAsync";
import UpdateAppointmentModelRequest from "../models/appointmentModels/UpdateAppointmentModelRequest";
import UpdateAppointmentFetchAsync from "../api/Appointments.API/UpdateAppointmentFetchAsync";
import DeleteAppointmentFetchAsync from "../api/Appointments.API/DeleteAppointmentFetchAsync";

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [editableAppointments, setEditableAppointments] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [medicalServices, setMedicalServices] = useState([]);
    const [offices, setOffices] = useState([]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDoctors, setSelectedDoctors] = useState([]);
    const [selectedMedicalServices, setSelectedMedicalServices] = useState([]);
    const [selectedIsApproved, setSelectedIsApproved] = useState(null);
    const [selectedOffices, setSelectedOffices] = useState([]);

    const columnNames = [
        'time',
        'doctorFullName',
        'patientFullName',
        'patientPhoneNumber',
        'medicalServiceName',
        'isApproved',
    ];

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

                const fetchedAppointments = await GetAppointmentsByDateFetchAsync(selectedDate);
                setAppointments(fetchedAppointments);
                const accountIds = Array.from(new Set(fetchedAppointments.map(appointment => appointment.patient.accountId)));

                const fetchedDoctors = await GetAllDoctorsFetchAsync();
                setDoctors(fetchedDoctors);

                const fetchedMedicalServices = await GetAllMedicalServiceFetchAsync();
                setMedicalServices(fetchedMedicalServices);

                const fetchedOffices = await GetAllOfficesFetchAsync();
                setOffices(fetchedOffices);

                const fetchedAccounts = await GetAccountsByIdsFetchAsync(accountIds);
                setAccounts(fetchedAccounts);

                const formattedAppointments = formatAppointments(fetchedAppointments, fetchedAccounts);
                setEditableAppointments(formattedAppointments);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, [selectedDate]);

    const formatAppointments = (appointments, accounts) => {
        return appointments.map(({ id, time, doctor, patient, medicalService, isApproved }) => {
            const patientAccount = accounts.find(account => account.id === patient.accountId);
            const patientPhoneNumber = patientAccount ? patientAccount.phoneNumber : 'Phone number not found';

            return {
                id,
                time,
                doctorFullName: `${doctor.firstName} ${doctor.lastName} ${doctor.middleName}`,
                patientFullName: `${patient.firstName} ${patient.lastName} ${patient.middleName}`,
                patientPhoneNumber,
                medicalServiceName: medicalService.serviceName,
                isApproved: isApproved ? 'Approved' : 'Not Approved',
            };
        });
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleAddModalClick = () => {
        setIsAddModalOpen(!isAddModalOpen);
    }

    const toggleFilterModalClick = () => {
        setIsFilterModalOpen(!isFilterModalOpen);
    }

    const toggleCalendarClick = () => {
        setIsCalendarOpen(!isCalendarOpen);
    }

    const handleSetSelectedDate = (date) => {
        setSelectedDate(date);
    }

    const handleFilterDoctorChange = (doctor) => {
        setSelectedDoctors(prevSelectedDoctors => {
            if (prevSelectedDoctors.some(selectedDoctor => selectedDoctor.id === doctor.id)) {
                return prevSelectedDoctors.filter(selectedDoctor => selectedDoctor.id !== doctor.id);
            } else {
                return [...prevSelectedDoctors, doctor];
            }
        });
    };

    const handleFilterMedicalServiceChange = (medicalService) => {
        setSelectedMedicalServices(prevSelectedMedicalServices => {
            if (prevSelectedMedicalServices.some(selectedMedicalService => selectedMedicalService.id === medicalService.id)) {
                return prevSelectedMedicalServices.filter(selectedMedicalService => selectedMedicalService.id !== medicalService.id);
            } else {
                return [...prevSelectedMedicalServices, medicalService];
            }
        });
    };

    const handleFilterIsApprovedChange = (status) => {
        setSelectedIsApproved(status);
    };

    const handleFilterOfficeChange = (office) => {
        setSelectedOffices(prevSelectedOffices => {
            if (prevSelectedOffices.some(selectedOffice => selectedOffice.id === office.id)) {
                return prevSelectedOffices.filter(selectedOffice => selectedOffice.id !== office.id);
            } else {
                return [...prevSelectedOffices, office];
            }
        });
    };

    const handleApplyFilter = () => {
        let filteredAppointments = appointments;

        if (selectedDoctors.length > 0 || selectedMedicalServices.length > 0 || selectedIsApproved !== null || selectedOffices.length > 0) {
            const doctorsInSelectedOffice = doctors.filter(doctor =>
                selectedOffices.some(selectedOffice => selectedOffice.id === doctor.office.id)
            );

            filteredAppointments = appointments.filter(appointment =>
                (!selectedDoctors.length || selectedDoctors.some(selectedDoctor => selectedDoctor.id === appointment.doctor.id)) &&
                (!selectedMedicalServices.length || selectedMedicalServices.some(selectedMedicalService => selectedMedicalService.id === appointment.medicalService.id)) &&
                (selectedIsApproved === null || selectedIsApproved === appointment.isApproved) &&
                (!selectedOffices.length || doctorsInSelectedOffice.some(filteredDoctor => filteredDoctor.id === appointment.doctor.id))
            );
        }

        const formattedAppointments = formatAppointments(filteredAppointments);
        setEditableAppointments(formattedAppointments);
        setIsFilterModalOpen(!isFilterModalOpen);
    };

    const handleClearFilter = () => {
        const formattedAppointments = formatAppointments(appointments);
        setEditableAppointments(formattedAppointments);
        setSelectedDoctors([]);
        setSelectedMedicalServices([]);
        setSelectedIsApproved(null);
        setSelectedOffices([]);
        setIsFilterModalOpen(!isFilterModalOpen);
    }

    async function handleApproveAppointment(id) {
        const appointment = appointments.find(a => a.id === id);

        const updateAppointmentModelRequest = new UpdateAppointmentModelRequest(
            appointment.id, appointment.doctor.id, appointment.medicalService.id, appointment.patient.id, appointment.date, appointment.time, true);

        const resultResponseStatus = await UpdateAppointmentFetchAsync(updateAppointmentModelRequest);
        if (resultResponseStatus === 200) {
            setEditableAppointments(prevAppointments => {
                return prevAppointments.map(appointment => {
                    if (appointment.id === id) {
                        return { ...appointment, isApproved: 'Approved' };
                    }
                    return appointment;
                });
            });
        }
    };

    async function handleCancelAppointment(id) {
        const confirmCancel = window.confirm("Are you sure you want to cancel the appointment?");

        if (confirmCancel) {
            const resultResponseStatus = await DeleteAppointmentFetchAsync(id);
            if (resultResponseStatus === 200) {
                setEditableAppointments(prevAppointments =>
                    prevAppointments.filter(a => a.id !== id)
                );
                setAppointments(prevAppointments =>
                    prevAppointments.filter(a => a.id !== id)
                );
            }
        }
    }

    return (
        <>
            <Toolbar
                pageTitle="Appointments"

                showAddIcon={true}
                toggleAddModalClick={toggleAddModalClick}

                showFilterIcon={true}
                toggleFilterModalClick={toggleFilterModalClick}

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
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {editableAppointments.map(editableAppointment => (
                                                    <tr
                                                        key={editableAppointment.id}
                                                        className={editableAppointment.isApproved === 'Approved' ? 'approved-row' : ''}
                                                    >
                                                        {columnNames.map(columnName => (
                                                            <td key={columnName}>{editableAppointment[columnName]}</td>
                                                        ))}
                                                        <td>
                                                            <div className="table-actions">
                                                                <IconBase
                                                                    name='bx-chevron-down-circle'
                                                                    className={editableAppointment.isApproved === 'Approved' ? 'approved' : ''}
                                                                    onClick={editableAppointment.isApproved === 'Approved' ? undefined : () => handleApproveAppointment(editableAppointment.id)}
                                                                />
                                                                <IconBase name='bx-x-circle'
                                                                    onClick={() => handleCancelAppointment(editableAppointment.id)}
                                                                />
                                                            </div>
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

                        {isFilterModalOpen && (
                            <FilterModal onClose={() => setIsFilterModalOpen(false)}>
                                <div className="filter-section">
                                    <h2 className="filter-modal-title">Doctors</h2>
                                    <div className="filter-checkbox-container">
                                        {doctors.map(doctor => (
                                            <div className="filter-checkbox-group" key={doctor.id}>
                                                <CheckboxWrapper
                                                    id={doctor.id}
                                                    name="doctor-name"
                                                    value={`${doctor.firstName} ${doctor.lastName} ${doctor.middleName}`}
                                                    checked={selectedDoctors.some(selectedDoctor => selectedDoctor.id === doctor.id)}
                                                    onChange={() => handleFilterDoctorChange(doctor)}
                                                    label={`${doctor.firstName} ${doctor.lastName} ${doctor.middleName}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="filter-section">
                                    <h2 className="filter-modal-title">Medical Services</h2>
                                    <div className="filter-checkbox-container">
                                        {medicalServices.map(medicalService => (
                                            <div className="filter-checkbox-group" key={medicalService.id}>
                                                <CheckboxWrapper
                                                    id={medicalService.id}
                                                    name="medical-service-name"
                                                    value={`${medicalService.serviceName}`}
                                                    checked={selectedMedicalServices.some(selectedMedicalService => selectedMedicalService.id === medicalService.id)}
                                                    onChange={() => handleFilterMedicalServiceChange(medicalService)}
                                                    label={`${medicalService.serviceName}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="filter-section">
                                    <h2 className="filter-modal-title">Status</h2>
                                    <div className="filter-checkbox-container">
                                        <div className="filter-checkbox-group" key="approved-appointments">
                                            <CheckboxWrapper
                                                id="approved-appointments"
                                                name="approved-appointments"
                                                value={`approved-appointments`}
                                                checked={selectedIsApproved === true}
                                                onChange={() => handleFilterIsApprovedChange(true)}
                                                label={`Approved`}
                                            />
                                        </div>
                                        <div className="filter-checkbox-group" key="not-approved-appointments">
                                            <CheckboxWrapper
                                                id="not-approved-appointments"
                                                name="not-approved-appointments"
                                                value={`not-approved-appointments`}
                                                checked={selectedIsApproved === false}
                                                onChange={() => handleFilterIsApprovedChange(false)}
                                                label={`Not Approved`}
                                            />
                                        </div>
                                        <div className="filter-checkbox-group" key="all-appointments">
                                            <CheckboxWrapper
                                                id="all-appointments"
                                                name="all-appointments"
                                                value={`all-appointments`}
                                                checked={selectedIsApproved === null}
                                                onChange={() => handleFilterIsApprovedChange(null)}
                                                label={`All`}
                                            />
                                        </div>
                                    </div>
                                    <div className="filter-section">
                                        <h2 className="filter-modal-title">Offices</h2>
                                        <div className="filter-checkbox-container">
                                            {offices.map(office => (
                                                <div className="filter-checkbox-group" key={office.id}>
                                                    <CheckboxWrapper
                                                        id={office.id}
                                                        name="office-name"
                                                        value={`${office.city} ${office.street} ${office.houseNumber} ${office.officeNumber}`}
                                                        checked={selectedOffices.some(selectedOffice => selectedOffice.id === office.id)}
                                                        onChange={() => handleFilterOfficeChange(office)}
                                                        label={`${office.city} ${office.street} ${office.houseNumber} ${office.officeNumber}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <ButtonBase type="button" onClick={handleApplyFilter}>
                                        Apply
                                    </ButtonBase>
                                    <ButtonBase type="button" variant="secondary" onClick={handleClearFilter}>
                                        Clear
                                    </ButtonBase>
                                </div>
                            </FilterModal>
                        )}
                    </div>
                </>
            )}
        </>
    );
} 
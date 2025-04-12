import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
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
import UpdateAppointmentFetchAsync from "../api/Appointments.API/UpdateAppointmentFetchAsync";
import DeleteAppointmentFetchAsync from "../api/Appointments.API/DeleteAppointmentFetchAsync";
import useAppointmentForm from "../hooks/useAppointmentForm";
import { SelectWrapper } from "../components/molecules/SelectWrapper";
import { InputWrapper } from "../components/molecules/InputWrapper";
import GetAllSpecializationFetchAsync from "../api/Services.API/GetAllSpecializationFetchAsync";
import FormModal from "../components/organisms/FormModal";
import GetAllPatientsFetchAsync from "../api/Profiles.API/GetAllPatientsFetchAsync";
import GetAllAvailableTimeSlotsFetchAsync from "../api/Appointments.API/GetAllAvailableTimeSlotsFetchAsync";
import CreateAppointmentFetchAsync from "../api/Appointments.API/CreateAppointmentFetchAsync";

export default function Appointments() {
    const navigate = useNavigate();
    const location = useLocation();

    const [appointments, setAppointments] = useState([]);
    const [editableAppointments, setEditableAppointments] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [offices, setOffices] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [officeOptions, setOfficeOptions] = useState([]);
    
    const [patients, setPatients] = useState([]);
    const [editingPatients, setEditingPatients] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [editingSpecializations, setEditingSpecializations] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [editingDoctors, setEditingDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [editingServices, setEditingServices] = useState([]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());

    const [selectedDoctors, setSelectedDoctors] = useState([]);
    const [selectedMedicalServices, setSelectedMedicalServices] = useState([]);
    const [selectedIsApproved, setSelectedIsApproved] = useState(null);
    const [selectedOffices, setSelectedOffices] = useState([]);

    const [filteredPatients, setFilteredPatients] = useState([]);
    const [selectPatientName, setSelectPatientName] = useState('');

    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectDoctorName, setSelectDoctorName] = useState('');

    const [filteredSpecializations, setFilteredSpecializations] = useState([]);
    const [selectSpecializationName, setSelectSpecializationName] = useState('');

    const [filteredMedicalServices, setFilteredMedicalServices] = useState([]);
    const [selectMedicalServiceName, setSelectMedicalServiceName] = useState('');

    const columnNames = [
        'time',
        'doctorFullName',
        'patientFullName',
        'patientPhoneNumber',
        'medicalServiceName',
        'isApproved',
    ];

    const { appointmentFormData, setAppointmentFormData, appointmentErrors, setAppointmentErrors, handleAppointmentChange, handleAppointmentBlur, resetAppointmentForm, isAppointmentFormValid } = useAppointmentForm({
        patientId: '',
        doctorId: '',
        medicalServiceId: '',
        officeId: '',
        date: '',
        time: '',
        isApproved: false,
    });

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
    
        const dateParam = queryParams.get('date');
        if (dateParam) {
            setSelectedDate(dateParam);
        } else if (queryParams.get('modal') === 'create' && !isAddModalOpen) {
            setIsAddModalOpen(true);
        } else if (queryParams.get('modal') === 'update' && !isUpdateModalOpen) {
            setIsUpdateModalOpen(true);
        } else if (queryParams.get('modal') === 'filter' && !isFilterModalOpen) {
            setIsFilterModalOpen(true);
        } else if (queryParams.get('modal') === 'calendar' && !isCalendarOpen) {
            setIsCalendarOpen(true);
        }
    }, [location.search]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedSpecializations = await GetAllSpecializationFetchAsync();
                setSpecializations(fetchedSpecializations);
                setEditingSpecializations(fetchedSpecializations);

                const fetchedDoctors = await GetAllDoctorsFetchAsync();
                setDoctors(fetchedDoctors);
                setEditingDoctors(fetchedDoctors);

                const fetchedServices = await GetAllMedicalServiceFetchAsync();
                setServices(fetchedServices);
                setEditingServices(fetchedServices);

                const fetchedAppointments = await GetAppointmentsByDateFetchAsync(selectedDate);
                setAppointments(fetchedAppointments);
                const accountIds = Array.from(new Set(fetchedAppointments.map(appointment => appointment.patient.accountId)));

                const fecthedPatients = await GetAllPatientsFetchAsync();
                setPatients(fecthedPatients);
                setEditingPatients(fecthedPatients);

                const fetchedOffices = await GetAllOfficesFetchAsync();
                setOffices(fetchedOffices);
                const officeOptions = mapOfficesToOptions(fetchedOffices);
                setOfficeOptions(officeOptions);

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

    useEffect(() => {
        const fetchAllAvailableTimeSlotsFetch = async () => {
            try {
                const findService = services.find(s => s.id === appointmentFormData.medicalServiceId);

                if (findService) {
                    const timeSlotSize = findService.serviceCategory.timeSlotSize;
                    const fetchedTimeSlots = await GetAllAvailableTimeSlotsFetchAsync(appointmentFormData.date, timeSlotSize, appointmentFormData.doctorId);
                    const timeSlots = fetchedTimeSlots.map((timeSlot) => {
                        const [startTime, endTime] = timeSlot.split(' - ');
                        const id = `${startTime.replace(':', '')}${endTime.replace(':', '')}`;
                        return {
                            id: id,
                            value: timeSlot,
                            displayValue: timeSlot
                        };
                    });
                    setTimeSlots(timeSlots);
                } else {
                    console.error('Service not found');
                }

            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        if (appointmentFormData.medicalServiceId && appointmentFormData.date && appointmentFormData.doctorId) {
            fetchAllAvailableTimeSlotsFetch();
        }
    }, [appointmentFormData.medicalServiceId, appointmentFormData.date, appointmentFormData.doctorId]);

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

    const mapOfficesToOptions = (offices) => {
        return offices.map(({ id, city, street, houseNumber, officeNumber }) => ({
            id,
            value: id,
            displayValue: `${city} ${street} ${houseNumber} ${officeNumber}`
        }));
    };

    const toggleCreateModalClick = () => {
        const confirmCancel = isAddModalOpen
            ? window.confirm("Do you really want to cancel? Entered data will not be saved.")
            : true;
    
        if (confirmCancel) {
            const newModalState = !isAddModalOpen;
            const currentPath = location.pathname;
            const params = new URLSearchParams(location.search);

            if (newModalState) {
                params.set('modal', 'create');
            } else {
                params.delete('modal');
            }

            const updatedPath = `${currentPath}?${params.toString()}`;
            setIsAddModalOpen(newModalState);
            navigate(updatedPath);

            if (!newModalState) {
                resetAppointmentForm();
                setSelectSpecializationName('');
                setSelectPatientName('');
                setSelectDoctorName('');
                setSelectMedicalServiceName('');
            }
        }
    };

    const toggleUpdateModalClick = (appointmentId) => {
        resetAppointmentForm();
        
        if (appointmentId) {
            const appointment = appointments.find(appointment => appointment.id == appointmentId);
            const doctor = doctors.find(doctor => doctor.id === appointment.doctor.id);
            const patient = patients.find(patient => patient.id === appointment.patient.id);
    
            const office = officeOptions.filter(office => office.id === doctor.office.id);
            setOfficeOptions(office);
    
            setSelectSpecializationName(doctor.specialization.specializationName);
            setSelectDoctorName(`${doctor.firstName} ${doctor.lastName} ${doctor.middleName}`);
            setSelectPatientName(`${patient.firstName} ${patient.lastName} ${patient.middleName}`);
            setSelectMedicalServiceName(appointment.medicalService.serviceName);
    
            setAppointmentFormData({
                id: appointment.id,
                doctorId: doctor.id,
                medicalServiceId: appointment.medicalService.id,
                officeId: doctor.office.id,
                date: appointment.date,
                time: appointment.time,
            });
    
            setAppointmentErrors({
                doctorId: true,
                medicalServiceId: true,
                date: true,
                time: true,
            });
        }
    
        const currentPath = location.pathname;
        const params = new URLSearchParams(location.search);
        
        const newModalState = !isUpdateModalOpen;
    
        if (newModalState) {
            params.set('modal', 'update'); 
        } else {
            params.delete('modal');
        }
    
        const updatedPath = `${currentPath}?${params.toString()}`;
    
        setIsUpdateModalOpen(newModalState);
        navigate(updatedPath);
    };

    const toggleFilterModalClick = () => {
        const newModalState = !isFilterModalOpen;
        const currentPath = location.pathname;
        const params = new URLSearchParams(location.search);
    
        if (newModalState) {
            params.set('modal', 'filter');
        } else {
            params.delete('modal');
        }
    
        const updatedPath = `${currentPath}?${params.toString()}`;
        setIsFilterModalOpen(newModalState);
        navigate(updatedPath);
    };
    
    const toggleCalendarClick = () => {
        const newModalState = !isCalendarOpen;
        const currentPath = location.pathname;
        const params = new URLSearchParams(location.search);
    
        if (newModalState) {
            params.set('modal', 'calendar');
        } else {
            params.delete('modal');
        }
    
        const updatedPath = `${currentPath}?${params.toString()}`;
        setIsCalendarOpen(newModalState);
        navigate(updatedPath);
    };

    const handleSetSelectedDate = (date) => {
        const newModalState = !isCalendarOpen;
        const currentPath = location.pathname;
        const params = new URLSearchParams(location.search);
    
        params.set('date', date);
    
        const updatedPath = `${currentPath}?${params.toString()}`;
    
        setIsCalendarOpen(newModalState);
        setSelectedDate(date);
        navigate(updatedPath);
    };

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

    const handlePatientChange = (value) => {
        if (value === '') {
            setFilteredPatients([]);
        } else {
            const filtered = editingPatients.filter(
                patient => patient.firstName.toLowerCase().includes(value.toLowerCase()) ||
                patient.lastName.toLowerCase().includes(value.toLowerCase()) ||
                patient.middleName.toLowerCase().includes(value.toLowerCase()))
            setFilteredPatients(filtered);
        }
        setSelectPatientName(value);
    };

    const handleSpecializationChange = (value) => {
        if (value === '') {
            setFilteredSpecializations([]);
        } else {
            const filtered = editingSpecializations.filter(spec => spec.specializationName.toLowerCase().includes(value.toLowerCase()));
            setFilteredSpecializations(filtered);
        }
        setSelectSpecializationName(value);
    };

    const handleDoctorChange = (value) => {
        if (value === '') {
            setFilteredDoctors([]);
        } else {
            let filtered = editingDoctors;
            
            if (appointmentFormData.medicalServiceId) {
                const selectedService = services.find(service => service.id === appointmentFormData.medicalServiceId);
                if (selectedService) {
                    filtered = editingDoctors.filter(doc => 
                        doc.specialization.id === selectedService.specialization.id &&
                        (doc.firstName.toLowerCase().includes(value.toLowerCase()) ||
                        doc.lastName.toLowerCase().includes(value.toLowerCase()) ||
                        doc.middleName.toLowerCase().includes(value.toLowerCase()))
                    );
                }
            } else {
                filtered = editingDoctors.filter(doc => 
                    doc.firstName.toLowerCase().includes(value.toLowerCase()) ||
                    doc.lastName.toLowerCase().includes(value.toLowerCase()) ||
                    doc.middleName.toLowerCase().includes(value.toLowerCase())
                );
            }
            setFilteredDoctors(filtered);
        }
        setSelectDoctorName(value);

        if (value !== '') {
            const selectedDoctor = filteredDoctors.find(doc => 
                doc.firstName.toLowerCase().includes(value.toLowerCase()) ||
                doc.lastName.toLowerCase().includes(value.toLowerCase()) ||
                doc.middleName.toLowerCase().includes(value.toLowerCase())
            );
            
            if (selectedDoctor) {
                const updatedOfficeOptions = officeOptions.filter(office => 
                    office.id === selectedDoctor.office.id
                );
                setOfficeOptions(updatedOfficeOptions);
            }
        }
    };

    const handleMedicalServiceChange = (value) => {
        if (value === '') {
            setFilteredMedicalServices([]);
        } else {
            let filtered = editingServices;
            
            if (appointmentFormData.doctorId) {
                const selectedDoctor = doctors.find(doc => doc.id === appointmentFormData.doctorId);
                if (selectedDoctor) {
                    filtered = editingServices.filter(service => 
                        service.specialization.id === selectedDoctor.specialization.id &&
                        service.serviceName.toLowerCase().includes(value.toLowerCase())
                    );
                }
            } else if (appointmentFormData.specializationId) {
                filtered = editingServices.filter(service => 
                    service.specialization.id === appointmentFormData.specializationId &&
                    service.serviceName.toLowerCase().includes(value.toLowerCase())
                );
            } else if (appointmentFormData.officeId) {
                const officeDoctors = doctors.filter(doc => doc.office.id === appointmentFormData.officeId);
                const officeSpecializations = [...new Set(officeDoctors.map(doc => doc.specialization.id))];
                filtered = editingServices.filter(service => 
                    officeSpecializations.includes(service.specialization.id) &&
                    service.serviceName.toLowerCase().includes(value.toLowerCase())
                );
            } else {
                filtered = editingServices.filter(service => 
                    service.serviceName.toLowerCase().includes(value.toLowerCase())
                );
            }
            setFilteredMedicalServices(filtered);
        }
        setSelectMedicalServiceName(value);
    };

    const handlePatientSelect = (patient) => {
        appointmentFormData.patientId = patient.id;
        setFilteredPatients([]);
        setSelectPatientName(patient.firstName + ' ' + patient.lastName + ' ' + patient.middleName);
        appointmentErrors.patientId = true;
    };

    const handleSpecializationSelect = (specialization) => {
        appointmentFormData.specializationId = specialization.id;
        setFilteredSpecializations([]);
        setSelectSpecializationName(specialization.specializationName);
        appointmentErrors.specializationId = true;

        const filteredDoctors = editingDoctors.filter(doc => doc.specialization.id === specialization.id);
        setEditingDoctors(filteredDoctors);

        const filteredServices = editingServices.filter(service => service.specialization.id === specialization.id);
        setEditingServices(filteredServices);
    };

    const handleDoctorSelect = (doctor) => {
        appointmentFormData.doctorId = doctor.id;
        setFilteredDoctors([]);
        setSelectDoctorName(doctor.firstName + ' ' + doctor.lastName + ' ' + doctor.middleName);

        const office = officeOptions.filter(office => office.id === doctor.office.id);
        setOfficeOptions(office);

        const doctorSpecialization = specializations.find(spec => spec.id === doctor.specialization.id);
        if (doctorSpecialization) {
            appointmentFormData.specializationId = doctorSpecialization.id;
            setSelectSpecializationName(doctorSpecialization.specializationName);
            appointmentErrors.specializationId = true;
        }

        appointmentErrors.doctorId = true;
    };

    const handleMedicalServiceSelect = (medicalService) => {
        appointmentFormData.medicalServiceId = medicalService.id;
        setFilteredMedicalServices([]);
        setSelectMedicalServiceName(medicalService.serviceName);
        appointmentErrors.medicalServiceId = true;

        const medicalServiceSpecialization = specializations.find(spec => spec.id === medicalService.specialization.id);
        if (medicalServiceSpecialization) {
            appointmentFormData.specializationId = medicalServiceSpecialization.id;
            setSelectSpecializationName(medicalServiceSpecialization.specializationName);
            appointmentErrors.specializationId = true;
        }
    };

    const handleOfficeSelect = (option) => {
        appointmentFormData.officeId = option.id;
        appointmentErrors.officeId = true;
    
        if (appointmentFormData.specializationId) {
            const doctorsWithSpecialization = doctors.filter(
                doc => doc.specialization.id === appointmentFormData.specializationId
            );
            const filteredOffices = [...new Set(doctorsWithSpecialization.map(doc => doc.office.id))];
            const officeOptions = officeOptions
                .filter(office => filteredOffices.includes(office.id))
                .map(({ id, city, street, houseNumber, officeNumber }) => ({
                    id,
                    value: id,
                    displayValue: `${city} ${street} ${houseNumber} ${officeNumber}`
                }));
            setOfficeOptions(officeOptions);
        }
    };

    async function handleApproveAppointment(id) {
        const appointment = appointments.find(a => a.id === id);

        const updateAppointmentModelRequest = {
            id: appointment.id,
            doctorId: appointment.doctor.id,
            medicalServiceId: appointment.medicalService.id,
            patientId: appointment.patient.id,
            date: appointment.date,
            time: appointment.time,
            isActive: true
        };

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

    const handleCreateAppointment = async (e) => {
        e.preventDefault();

        const createAppointmentRequest = {
            patientId: appointmentFormData.patientId,
            doctorId: appointmentFormData.doctorId,
            medicalServiceId: appointmentFormData.medicalServiceId,
            date: appointmentFormData.date,
            time: appointmentFormData.time,
            isApproved: false,
        };
        console.log(createAppointmentRequest);

        await CreateAppointmentFetchAsync(createAppointmentRequest);
    };

    const handleUpdateAppointment = async (e) => {
        e.preventDefault();
        const updateAppointmentRequest = {
            id: appointmentFormData.id,
            doctorId: appointmentFormData.doctorId,
            medicalServiceId: appointmentFormData.medicalServiceId,
            date: appointmentFormData.date,
            time: appointmentFormData.time,
            isApproved: false
        };

        await UpdateAppointmentFetchAsync(updateAppointmentRequest);
    };

    return (
        <>
            <Toolbar
                pageTitle="Appointments"

                showAddIcon={true}
                toggleCreateModalClick={toggleCreateModalClick}

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
                                                                {editableAppointment.isApproved !== 'Approved' && (
                                                                    <IconBase name={"bx-pencil"} onClick={() => toggleUpdateModalClick(editableAppointment.id)} />
                                                                )}
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
                            <FilterModal onClose={toggleFilterModalClick}>
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
                                        {services.map(medicalService => (
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

                        {isAddModalOpen && (
                            <FormModal title="Create Appointment" onClose={toggleCreateModalClick} onSubmit={handleCreateAppointment} showCloseButton={true}>
                            <div className="modal-inputs">
                                <div>
                                    <InputWrapper
                                        type="text"
                                        label="Patient"
                                        id="patient"
                                        value={selectPatientName}
                                        onChange={(e) => handlePatientChange(e.target.value)}
                                        onBlur={handleAppointmentBlur('patient')}
                                        required
                                    />
                                    {filteredPatients.length > 0 && (
                                        <div className="filtred-list">
                                            {filteredPatients.map(patient => (
                                                <h5 key={patient.id} onClick={() => handlePatientSelect(patient)}>
                                                    {patient.firstName} {patient.lastName} {patient.middleName}
                                                </h5>
                                            ))}
                                        </div>
                                    )}
                                    <InputWrapper
                                        type="text"
                                        label="Specialization"
                                        id="specialization"
                                        value={selectSpecializationName}
                                        onChange={(e) => handleSpecializationChange(e.target.value)}
                                        onBlur={handleAppointmentBlur('specialization')}
                                        required
                                    />
                                    {filteredSpecializations.length > 0 && (
                                        <div className="filtred-list">
                                            {filteredSpecializations.map(specialization => (
                                                <h5 key={specialization.id} onClick={() => handleSpecializationSelect(specialization)}>
                                                    {specialization.specializationName}
                                                </h5>
                                            ))}
                                        </div>
                                    )}
                                    <InputWrapper
                                        type="text"
                                        label="Doctor"
                                        id="doctor"
                                        value={selectDoctorName}
                                        onChange={(e) => handleDoctorChange(e.target.value)}
                                        onBlur={handleAppointmentBlur('doctor')}
                                        required
                                    />
                                    {filteredDoctors.length > 0 && (
                                        <div className="filtred-list">
                                            {filteredDoctors.map(doctor => (
                                                <h5 key={doctor.id} onClick={() => handleDoctorSelect(doctor)}>
                                                    {doctor.firstName} {doctor.lastName} {doctor.middleName}
                                                </h5>
                                            ))}
                                        </div>
                                    )}
                                    <InputWrapper
                                        type="text"
                                        label="Medical Service"
                                        id="medicalServiceId"
                                        value={selectMedicalServiceName}
                                        onChange={(e) => handleMedicalServiceChange(e.target.value)}
                                        onBlur={handleAppointmentBlur('medicalService')}
                                        required
                                    />
                                    {filteredMedicalServices.length > 0 && (
                                        <div className="filtred-list">
                                            {filteredMedicalServices.map(medicalService => (
                                                <h5 key={medicalService.id} onClick={() => handleMedicalServiceSelect(medicalService)}>
                                                    {medicalService.serviceName}
                                                </h5>
                                            ))}
                                        </div>
                                    )}
                                    <SelectWrapper
                                        label="Office"
                                        id="office"
                                        value={appointmentFormData.officeId}
                                        onBlur={handleAppointmentBlur('officeId')}
                                        onChange={handleAppointmentChange('officeId')}
                                        onSelect={handleOfficeSelect} 
                                        required
                                        placeholder={appointmentFormData.officeId ? "" : "Select office"}
                                        options={officeOptions}
                                    />
                                    <InputWrapper
                                        type="date"
                                        label="Date"
                                        id="date"
                                        value={appointmentFormData.date}
                                        onChange={handleAppointmentChange('date')}
                                        onBlur={handleAppointmentBlur('date')}
                                        required
                                    />
                                    <SelectWrapper
                                        label="Time"
                                        id="time"
                                        value={appointmentFormData.time}
                                        onChange={handleAppointmentChange('time')}
                                        onBlur={handleAppointmentBlur('time')}
                                        required
                                        placeholder={appointmentFormData.time ? "" : "Select time"}
                                        options={timeSlots}
                                    />

                                    <div className="form-actions">
                                        <ButtonBase type="submit" disabled={!isAppointmentFormValid}>
                                            Confirm
                                        </ButtonBase>
                                    </div>
                                </div>
                            </div>
                        </FormModal>
                        )}

                        {isUpdateModalOpen && (
                            <FormModal title="Update Appointment" onClose={toggleUpdateModalClick} onSubmit={handleUpdateAppointment} showCloseButton={true}>
                            <div className="modal-inputs">
                                <div>
                                    <InputWrapper
                                        type="text"
                                        label="Specialization"
                                        id="specialization"
                                        value={selectSpecializationName}
                                        onChange={(e) => handleSpecializationChange(e.target.value)}
                                        onBlur={handleAppointmentBlur('specialization')}
                                        required
                                    />
                                    {filteredSpecializations.length > 0 && (
                                        <div className="filtred-list">
                                            {filteredSpecializations.map(specialization => (
                                                <h5 key={specialization.id} onClick={() => handleSpecializationSelect(specialization)}>
                                                    {specialization.specializationName}
                                                </h5>
                                            ))}
                                        </div>
                                    )}
                                    <InputWrapper
                                        type="text"
                                        label="Doctor"
                                        id="doctor"
                                        value={selectDoctorName}
                                        onChange={(e) => handleDoctorChange(e.target.value)}
                                        onBlur={handleAppointmentBlur('doctor')}
                                        required
                                    />
                                    {filteredDoctors.length > 0 && (
                                        <div className="filtred-list">
                                            {filteredDoctors.map(doctor => (
                                                <h5 key={doctor.id} onClick={() => handleDoctorSelect(doctor)}>
                                                    {doctor.firstName} {doctor.lastName} {doctor.middleName}
                                                </h5>
                                            ))}
                                        </div>
                                    )}
                                    <InputWrapper
                                        type="text"
                                        label="Medical Service"
                                        id="medicalServiceId"
                                        value={selectMedicalServiceName}
                                        onChange={(e) => handleMedicalServiceChange(e.target.value)}
                                        onBlur={handleAppointmentBlur('medicalService')}
                                        required
                                    />
                                    {filteredMedicalServices.length > 0 && (
                                        <div className="filtred-list">
                                            {filteredMedicalServices.map(medicalService => (
                                                <h5 key={medicalService.id} onClick={() => handleMedicalServiceSelect(medicalService)}>
                                                    {medicalService.serviceName}
                                                </h5>
                                            ))}
                                        </div>
                                    )}
                                    <SelectWrapper
                                        label="Office"
                                        id="office"
                                        value={appointmentFormData.officeId}
                                        onBlur={handleAppointmentBlur('officeId')}
                                        onChange={handleAppointmentChange('officeId')}
                                        onSelect={handleOfficeSelect} 
                                        required
                                        placeholder={appointmentFormData.officeId ? "" : "Select office"}
                                        options={officeOptions}
                                        />
                                    <InputWrapper
                                        type="date"
                                        label="Date"
                                        id="date"
                                        value={appointmentFormData.date}
                                        onChange={handleAppointmentChange('date')}
                                        onBlur={handleAppointmentBlur('date')}
                                        required
                                    />
                                    <SelectWrapper
                                        label="Time"
                                        id="time"
                                        value={appointmentFormData.time}
                                        onChange={handleAppointmentChange('time')}
                                        onBlur={handleAppointmentBlur('time')}
                                        required
                                        placeholder={appointmentFormData.time ? "" : "Select time"}
                                        options={timeSlots}
                                    />
    
                                    <div className="form-actions">
                                        <ButtonBase type="submit" disabled={!isAppointmentFormValid}>
                                            Confirm
                                        </ButtonBase>
                                    </div>
                                </div>
                            </div>
                        </FormModal>
                        )}
                    </div>
                </>
            )}
        </>
    );
} 
import React, { useEffect, useState } from 'react';
import "./../styles/Appointments.css";
import Loader from '../components/Loader';
import ReceptionistAppointmentsTable from '../components/ReceptionistAppointmentsTable';
import GetAppointmentsByDateFetchAsync from '../api/Appointments.API/GetAppointmentsByDateFetchAsync';
import GetAccountsByIdsFetchAsync from '../api/Authorization.API/GetAccountsByIdsFetchAsync';
import GetAllOfficesFetchAsync from '../api/Offices.API/GetAllOfficesFetchAsync';
import GetAllMedicalServiceFetchAsync from '../api/Services.API/GetAllMedicalServiceFetchAsync';
import GetAllDoctorsFetchAsync from '../api/Profiles.API/GetAllDoctorsFetchAsync';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [offices, setOffices] = useState([]);
  const [medicalServices, setMedicalServices] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedMedicalService, setSelectedMedicalService] = useState('');
  const [selectedAppointmentStatus, setSelectedAppointmentStatus] = useState('');
  const [selectedAddresses, setSelectedAddresses] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [showCreateAppointmentModal, setShowCreateAppointmentModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        toggleLoader(true);
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        const formattedDate = currentDate.toISOString().split('T')[0];
        setSelectedDate(formattedDate);

        const fetchedAppointments = await GetAppointmentsByDateFetchAsync(formattedDate);
        setAppointments(fetchedAppointments);
        setFilteredAppointments(fetchedAppointments);

        const accountIds = Array.from(new Set(fetchedAppointments.map(appointment => appointment.patient.accountId)));

        const fetchedAccounts = await GetAccountsByIdsFetchAsync(accountIds);
        setAccounts(fetchedAccounts);

        const fetchedDoctors = await GetAllDoctorsFetchAsync();
        setDoctors(fetchedDoctors);

        const fetchedOffices = await GetAllOfficesFetchAsync();
        setOffices(fetchedOffices);

        const fetchedMedicalServices = await GetAllMedicalServiceFetchAsync();
        setMedicalServices(fetchedMedicalServices);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        toggleLoader(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        toggleLoader(true);

        const fetchedAppointments = await GetAppointmentsByDateFetchAsync(selectedDate);
        setAppointments(fetchedAppointments);
        setFilteredAppointments(fetchedAppointments);

        const accountIds = Array.from(new Set(fetchedAppointments.map(appointment => appointment.patient.accountId)));

        const fetchedAccounts = await GetAccountsByIdsFetchAsync(accountIds);
        setAccounts(fetchedAccounts);

        const fetchedDoctors = await GetAllDoctorsFetchAsync();
        setDoctors(fetchedDoctors);

        const fetchedOffices = await GetAllOfficesFetchAsync();
        setOffices(fetchedOffices);

        const fetchedMedicalServices = await GetAllMedicalServiceFetchAsync();
        setMedicalServices(fetchedMedicalServices);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        toggleLoader(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    const filtered = appointments.filter(appointment => {
      const doctorName = `${appointment.doctor.lastName} ${appointment.doctor.firstName} ${appointment.doctor.middleName}`.toLowerCase();
      const patientName = `${appointment.patient.lastName} ${appointment.patient.firstName}`.toLowerCase();
      const serviceName = appointment.medicalService.serviceName.toLowerCase();
      const appointmentTime = appointment.time.toLowerCase();
      const phoneNumber = accounts.find(account => account.id === appointment.patient.accountId)?.phoneNumber.toLowerCase() || '';

      return (
        doctorName.includes(searchTerm.toLowerCase()) ||
        patientName.includes(searchTerm.toLowerCase()) ||
        serviceName.includes(searchTerm.toLowerCase()) ||
        appointmentTime.includes(searchTerm.toLowerCase()) ||
        phoneNumber.includes(searchTerm.toLowerCase())
      );
    });

    setFilteredAppointments(filtered);
  }, [searchTerm]);

  const toggleLoader = (status) => {
    setIsLoading(status);
  };

  const toggleCreateAppointmentModal = () => {
    setShowCreateAppointmentModal(!showCreateAppointmentModal);
    console.log(showCreateAppointmentModal)
  };

  useEffect(() => {
    const filtered = appointments.filter(appointment => {
      const doctorName = appointment.doctor.lastName + appointment.doctor.firstName + appointment.doctor.middleName.toLowerCase();
      const patientName = appointment.patient.lastName + appointment.patient.firstName.toLowerCase();
      const serviceName = appointment.medicalService.serviceName.toLowerCase();
      const appointmentTime = appointment.time.toLowerCase();
      const phoneNumber = accounts.find(account => account.id === appointment.patient.accountId)?.phoneNumber.toLowerCase() || '';

      const lowerCaseSearchTerm = searchTerm.toLowerCase();

      return (
        doctorName.includes(lowerCaseSearchTerm) ||
        patientName.includes(lowerCaseSearchTerm) ||
        serviceName.includes(lowerCaseSearchTerm) ||
        appointmentTime.includes(lowerCaseSearchTerm) ||
        phoneNumber.includes(lowerCaseSearchTerm)
      );
    });

    setFilteredAppointments(filtered);
  }, [searchTerm]);

  return (
    <div>
      {isLoading && <Loader />}
      {!isLoading && appointments.length === 0 && (
        <p className='no-appointments-message'>There are no records for the current date</p>
      )}
      <ReceptionistAppointmentsTable
        appointments={appointments}
        filteredAppointments={filteredAppointments}
        setFilteredAppointments={setFilteredAppointments}
        accounts={accounts}
        office={offices}
        doctors={doctors}
        medicalServices={medicalServices}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedAddresses={selectedAddresses}
        setSelectedAddresses={setSelectedAddresses}
        selectedDoctor={selectedDoctor}
        setSelectedDoctor={setSelectedDoctor}
        selectedMedicalService={selectedMedicalService}
        setSelectedMedicalService={setSelectedMedicalService}
        selectedAppointmentStatus={selectedAppointmentStatus}
        setSelectedAppointmentStatus={setSelectedAppointmentStatus}
        setSearchTerm={setSearchTerm}
        showCreateAppointmentModal={toggleCreateAppointmentModal}
      />
    </div>
  );
}

export default Appointments;
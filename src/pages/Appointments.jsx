import React, { useEffect, useState } from 'react';
import "./../styles/Appointments.css";
import Loader from '../components/Loader';
import GetAppointmentsByDateFetchAsync from '../api/Appointments.API/GetAppointmentsByDateFetchAsync';
import GetAccountsByIdsFetchAsync from '../api/Authorization.API/GetAccountsByIdsFetchAsync';
import GetAllOfficesFetchAsync from '../api/Offices.API/GetAllOfficesFetchAsync';
import GetAllMedicalServiceFetchAsync from '../api/Services.API/GetAllMedicalServiceFetchAsync';
import GetAllDoctorsFetchAsync from '../api/Profiles.API/GetAllDoctorsFetchAsync';
import AppointmentFilterModal from '../components/AppointmentFilterModal';
import Toolbar from '../components/Toolbar';
import Table from '../components/Table';
import Calendar from '../components/Calendar';
import UpdateAppointmentModelRequest from '../models/AppointmentModels/UpdateAppointmentModelRequest';
import UpdateAppointmentFetchAsync from '../api/Appointments.API/UpdateAppointmentFetchAsync';
import DeleteAppointmentFetchAsync from '../api/Appointments.API/DeleteAppointmentFetchAsync';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [offices, setOffices] = useState([]);
  const [medicalServices, setMedicalServices] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedMedicalService, setSelectedMedicalService] = useState('');
  const [selectedAppointmentStatus, setSelectedAppointmentStatus] = useState('');
  const [selectedAddresses, setSelectedAddresses] = useState('');

  const [showCreateAppointmentModal, setShowCreateAppointmentModal] = useState(false);
  const [showFilterAppointmentModal, setShowFilterAppointmentModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        toggleLoader(true);
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 1);
        const formattedDate = currentDate.toISOString().split('T')[0];
        setSelectedDate(formattedDate);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        toggleLoader(false);
      }
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

        const fetchedAccounts = await GetAccountsByIdsFetchAsync(accountIds);
        setAccounts(fetchedAccounts);

        const fetchedDoctors = await GetAllDoctorsFetchAsync();
        setDoctors(fetchedDoctors);

        const fetchedOffices = await GetAllOfficesFetchAsync();
        setOffices(fetchedOffices);

        const fetchedMedicalServices = await GetAllMedicalServiceFetchAsync();
        setMedicalServices(fetchedMedicalServices);

        const formattedAppointments = fetchedAppointments.map(({ id, time, doctor, patient, medicalService }) => {
          const patientAccount = fetchedAccounts.find(account => account.id === patient.accountId);
          const patientsPhoneNumber = patientAccount ? patientAccount.phoneNumber : 'Phone number not found';

          return {
            id,
            time,
            fullNameOfTheDoctor: `${doctor.lastName} ${doctor.firstName} ${doctor.middleName}`,
            fullNameOfThePatient: `${patient.lastName} ${patient.firstName} ${patient.middleName}`,
            patientsPhoneNumber,
            medicalService: medicalService.serviceName,
          };
        });
        setFilteredAppointments(formattedAppointments);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        toggleLoader(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    const filteredAppointments = appointments.filter(appointment => {
      const time = appointment.time.toLowerCase();
      const patientName = `${appointment.fullNameOfThePatient}`.toLowerCase();
      const doctorName = `${appointment.fullNameOfTheDoctor}`.toLowerCase();
      const medicalServiceName = `${appointment.medicalService}`.toLowerCase();

      return (
        time.includes(searchTerm.toLowerCase()) ||
        patientName.includes(searchTerm.toLowerCase()) ||
        doctorName.includes(searchTerm.toLowerCase()) ||
        medicalServiceName.includes(searchTerm.toLowerCase())
      );
    });

    const formattedAppointments = filteredAppointments.map(({ id, time, doctor, patient, medicalService }) => {
      const patientAccount = filteredAppointments.find(account => account.id === patient.accountId);
      const patientsPhoneNumber = patientAccount ? patientAccount.phoneNumber : 'Phone number not found';

      return {
        id,
        time,
        fullNameOfTheDoctor: `${doctor.firstName} ${doctor.lastName} ${doctor.middleName}`,
        fullNameOfThePatient: `${patient.firstName} ${patient.lastName} ${patient.middleName}`,
        patientsPhoneNumber,
        medicalService: medicalService.serviceName,
      };
    });

    setFilteredAppointments(formattedAppointments);
  }, [searchTerm]);

  const toggleLoader = (status) => {
    setIsLoading(status);
  };

  const toggleCreateAppointmentModal = () => {
    setShowCreateAppointmentModal(!showCreateAppointmentModal);
  };

  const toggleFilterAppointmentModal = () => {
    setShowFilterAppointmentModal(!showFilterAppointmentModal);
  };

  const toggleCalendarClick = () => {
    setShowCalendar(!showCalendar);
  };

  async function handleApproveAppointmentAsync(appointmentId) {
    const appointment = appointments.find(a => a.id === appointmentId);

    const updateAppointmentModelRequest = new UpdateAppointmentModelRequest(
      appointment.id, appointment.doctor.id, appointment.medicalService.id, appointment.patient.id, appointment.date, appointment.time, true);

    const resultResponseStatus = await UpdateAppointmentFetchAsync(updateAppointmentModelRequest);
    if (resultResponseStatus === 200) {
      const row = document.getElementById(appointment.id);
      row.classList.add("approved-appointment");

      const btn = document.getElementById("approve-button");
      btn.classList.add("disabled-button-approve-style");
    }
  }

  async function handleCancelAppointmentAsync(appointmentId) {
    const confirmCancel = window.confirm("Are you sure you want to cancel the appointment?");

    if (confirmCancel) {
      const resultResponseStatus = await DeleteAppointmentFetchAsync(appointmentId);
      if (resultResponseStatus === 200) {
        setFilteredAppointments(prevAppointments =>
          prevAppointments.filter(a => a.id !== appointmentId)
        );
      }
      console.log("The appointment has been cancelled.");
    }
  };

  return (
    <>
      {isLoading && <Loader />}

      <Toolbar
        pageTitle={"Appointments"}
        setSearchTerm={setSearchTerm}

        showAddIcon={true}
        toggleCreateModalClick={toggleCreateAppointmentModal}

        showFilterIcon={true}
        toggleFilterModalClick={toggleFilterAppointmentModal}

        showCalendarIcon={true}
        toggleCalendarClick={toggleCalendarClick}
      />

      {showFilterAppointmentModal && (
        <AppointmentFilterModal
          onClose={toggleFilterAppointmentModal}
          appointments={appointments}
          doctors={doctors}
          medicalServices={medicalServices}
          offices={offices}

          setFilteredAppointments={setFilteredAppointments}

          selectedAddresses={selectedAddresses}
          setSelectedAddresses={setSelectedAddresses}

          selectedDoctor={selectedDoctor}
          setSelectedDoctor={setSelectedDoctor}

          selectedMedicalService={selectedMedicalService}
          setSelectedMedicalService={setSelectedMedicalService}

          selectedAppointmentStatus={selectedAppointmentStatus}
          setSelectedAppointmentStatus={setSelectedAppointmentStatus}
        />
      )}

      {showCalendar && (
        <Calendar
          currentDate={new Date(selectedDate)}
          onClose={toggleCalendarClick}
          setSelectedDate={setSelectedDate}
        />
      )}

      <div className="appointments-container">
        {filteredAppointments.length > 0 ? (
          <Table
            items={filteredAppointments}

            showApproveButton={true}
            handleApprove={handleApproveAppointmentAsync}

            showCancelButton={true}
            handleCancel={handleCancelAppointmentAsync}
          />
        ) : (
          !isLoading && <p className="no-appointments-message">Nothing could be found.</p>
        )}
      </div>
    </>
  );
}

export default Appointments;
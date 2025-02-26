import React, { useEffect, useState } from 'react';
import "./../styles/MySchedule.css";
import Loader from '../components/Loader';
import GetAppointmentsByDoctorAndDateFetchAsync from '../api/Appointments.API/GetAppointmentsByDoctorAndDateFetchAsync';
import Toolbar from '../components/Toolbar';
import Table from '../components/Table';
import Calendar from '../components/Calendar';

function MySchedule() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

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
        const fetchedAppointments = await GetAppointmentsByDoctorAndDateFetchAsync(selectedDate);
        setAppointments(fetchedAppointments);

        const formattedAppointments = fetchedAppointments.map(({ id, time, patient, medicalService, isApproved }) => {
          return {
            id,
            patientId: patient.id,
            time,
            fullNameOfThePatient: `${patient.lastName} ${patient.firstName} ${patient.middleName}`,
            medicalService: medicalService.serviceName,
            status: isApproved ? 'Approved' : 'Not approved',
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

  const toggleLoader = (status) => {
    setIsLoading(status);
  };

  const toggleCalendarClick = () => {
    setShowCalendar(!showCalendar);
  };

  //add search

  return (
    <>
      {isLoading && <Loader />}
      <Toolbar
        pageTitle={"My schedule"}
        showCalendarIcon={true}
        toggleCalendarClick={toggleCalendarClick}
      />

      {showCalendar && (
        <Calendar
          currentDate={new Date(selectedDate)}
          onClose={toggleCalendarClick}
          setSelectedDate={setSelectedDate}
        />
      )}

      <div className="my-schedule-container">
        {filteredAppointments.length > 0 ? (
          <Table
            items={filteredAppointments}
            showAppointmentsResults={true}
          />
        ) : (
          !isLoading && <p className="no-appointments-message">Nothing could be found.</p>
        )}
      </div>
    </>
  );
}

export default MySchedule;
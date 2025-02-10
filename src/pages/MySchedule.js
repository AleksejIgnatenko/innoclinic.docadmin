import React, { useEffect, useState } from 'react';
import "./../styles/MySchedule.css";
import Table from '../components/Table';
import Loader from '../components/Loader';
import GetAppointmentsByDoctorAndDateFetchAsync from '../api/Appointments.API/GetAppointmentsByDoctorAndDateFetchAsync';

function MySchedule() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        toggleLoader(true);
        const currentDate = new Date().toISOString().split('T')[0];
        setSelectedDate(currentDate); 

        const fetchedAppointments = await GetAppointmentsByDoctorAndDateFetchAsync(currentDate);
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        toggleLoader(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchData = async () => {
      try {
        toggleLoader(true);
        const fetchedAppointments = await GetAppointmentsByDoctorAndDateFetchAsync(selectedDate);
        setAppointments(fetchedAppointments);
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

  return (
    <div>
      {isLoading && <Loader />}
      {!isLoading && appointments.length === 0 && (
        <p className='no-appointments-message'>There are no records for the current date</p>
      )}
      <Table
        appointmentsData={appointments}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
}

export default MySchedule;
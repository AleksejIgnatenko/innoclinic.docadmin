import React, { useEffect, useState } from 'react';
import "./../styles/MySchedule.css";
import Table from '../components/Table';
import GetAppointmentsByDoctorFetchAsync from '../api/Appointments.API/GetAppointmentsByDoctorFetchAsync';
import Loader from '../components/Loader';

function MySchedule() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        toggleLoader(true);

        const fetchedAppointments = await GetAppointmentsByDoctorFetchAsync();
        console.log(fetchedAppointments);
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        toggleLoader(false);
      }
    };

    fetchData();
  }, []);

  const toggleLoader = (status) => {
    setIsLoading(status);
  };

  return (
    <div>
      {isLoading && <Loader />}
      {!isLoading && (
        <Table appointmentsData={appointments}/>
      )}
    </div>
  );
}

export default MySchedule;
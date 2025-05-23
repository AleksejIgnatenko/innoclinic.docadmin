import { AppointmentAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function GetAppointmentsByDoctorAndDateFetchAsync(selectedDate) {
    try {
        if (selectedDate) {
            let jwtToken = Cookies.get('accessToken');
            if (!jwtToken) {
                await RefreshTokenFetchAsync();
                jwtToken = Cookies.get('accessToken');
            }

            const response = await fetch(`${AppointmentAPI}/Appointment/appointments-by-doctor-and-date?date=${selectedDate}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${jwtToken}`,
                },
            });


            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                const errorData = await response.json();
                console.error('Error fetching appointments:', errorData);
                return [];
            }
        }
    } catch (error) {
        console.error('Error in fetching get appointments:', error);
        //alert('An unexpected error occurred while fetching appointments. Please try again later.');
        return [];
    }
}

export default GetAppointmentsByDoctorAndDateFetchAsync;
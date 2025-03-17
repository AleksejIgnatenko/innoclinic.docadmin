import { AppointmentAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function GetAppointmentsByDoctorFetchAsync() {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${AppointmentAPI}/Appointment/appointments-by-doctor`, {
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
            //alert(`Error: ${errorData.message || 'Failed to retrieve appointments.'}`);
            return;
        }
    } catch (error) {
        console.error('Error in fetching appointments:', error);
        //alert('An unexpected error occurred while fetching appointments. Please try again later.');
    }
}

export default GetAppointmentsByDoctorFetchAsync;
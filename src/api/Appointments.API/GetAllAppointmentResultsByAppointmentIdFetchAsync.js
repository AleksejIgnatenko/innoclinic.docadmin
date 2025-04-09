import { AppointmentAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function GetAllAppointmentResultsByAppointmentIdFetchAsync(appointmentId) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${AppointmentAPI}/AppointmentResult/by-appointment-id/${appointmentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${jwtToken}`,
            },
        });

        if (response.ok) {
            return await response.json();
        } else {
            const result = await response.json();
            console.error('Failed to fetch appointment results:', result);
        }
    } catch (error) {
        console.error('Error fetching appointment results:', error);
        // alert('An error occurred while fetching appointment results.');
    }
}

export default GetAllAppointmentResultsByAppointmentIdFetchAsync;
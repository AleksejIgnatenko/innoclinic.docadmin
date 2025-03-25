import { AppointmentAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function DeleteAppointmentFetchAsync(appointmentId) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${AppointmentAPI}/Appointment/${appointmentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${jwtToken}`,
            },
        });

        return response.status;
    } catch (error) {
        console.error('Error in fetching delete appointment:', error);
        //alert('An unexpected error occurred while fetching update appointment. Please try again later.');
        return 500;
    }
}

export default DeleteAppointmentFetchAsync;

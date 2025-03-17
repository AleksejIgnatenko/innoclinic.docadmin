import { AppointmentAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function UpdateAppointmentFetchAsync(updateAppointment) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${AppointmentAPI}/Appointment/${updateAppointment.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(updateAppointment)
        });

        return response.status;
    } catch (error) {
        console.error('Error in fetching update appointment:', error);
        //alert('An unexpected error occurred while fetching update appointment. Please try again later.');
        return 500;
    }
}

export default UpdateAppointmentFetchAsync;

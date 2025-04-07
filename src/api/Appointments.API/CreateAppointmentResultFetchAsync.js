import { AppointmentAPI } from "../api";
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";
import Cookies from 'js-cookie';

async function CreateAppointmentResultFetchAsync(appointmentResult) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${AppointmentAPI}/AppointmentResult`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(appointmentResult)
        });

        if (response.status === 400) {
            const data = await response.json();
            console.log(data);
        }
    } catch (error) {
        console.error('Error in creating doctor:', error);
        //alert('An error occurred while creating the patient');
        return { status: 500, error: 'Internal Server Error' };
    }
}

export default CreateAppointmentResultFetchAsync;
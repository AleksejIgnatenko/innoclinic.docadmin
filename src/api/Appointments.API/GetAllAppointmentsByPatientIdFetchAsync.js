import { AppointmentAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function GetAllAppointmentsByPatientIdFetchAsync(patientId) {
    try {
        let jwtToken = Cookies.get('accessToken');

        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${AppointmentAPI}/Appointment/by-patient-id/${patientId}`, {
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
            console.error('Failed to fetch appointments:', result);
        }
    } catch (error) {
        console.error('Error fetching appointments:', error);
        // alert('An error occurred while fetching appointments.');
    }
}

export default GetAllAppointmentsByPatientIdFetchAsync;
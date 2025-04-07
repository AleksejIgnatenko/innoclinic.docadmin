import { AppointmentAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function IsAppointmentResultsExistenceFetchAsync(id) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${AppointmentAPI}/Appointment/is-appointment-results-existence/${id}`, {
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
            console.error('Error checking appointment results existence:', errorData);
            alert(`Error: ${errorData.message || 'Failed to check appointment results existence.'}`);
            return false; 
        }
    } catch (error) {
        console.error('Unexpected error while checking appointment results existence:', error);
        alert('An error occurred while processing the request. Please try again later.');
        return false; 
    }
}

export default IsAppointmentResultsExistenceFetchAsync;
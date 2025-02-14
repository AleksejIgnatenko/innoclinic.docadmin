import { ProfilesAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function GetDoctorByIdFetchAsync(doctorId) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync(); 
            jwtToken = Cookies.get('accessToken');
        }
        
        const response = await fetch(`${ProfilesAPI}/Doctors/${doctorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();

        if (response.ok) {
           return data;
        }
    } catch (error) {
        console.error('Error in getting all doctors:', error);
        alert('An error occurred while receiving all the doctors');
        return null;
    }
}

export default GetDoctorByIdFetchAsync;
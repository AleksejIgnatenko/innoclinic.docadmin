import { ProfilesAPI } from "../api";
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";
import Cookies from 'js-cookie';

async function GetPatientByIdFetchAsync(patientId) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync(); 
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${ProfilesAPI}/Patient/${patientId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`,
            },
        });

        const data = await response.json();
        
        if (response.ok) {
            return data;
        } else {
            console.error("Error in getting by id patients:", data);
            return null;
        }
    } catch (error) {
        console.error('Error in getting by id patients:', error);
        //alert('An error occurred while connecting the account with the patient');
        return null;
    }
}

export default GetPatientByIdFetchAsync;
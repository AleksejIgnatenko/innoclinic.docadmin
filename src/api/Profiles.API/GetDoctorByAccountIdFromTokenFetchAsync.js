import { ProfilesAPI } from "../api";
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";
import Cookies from 'js-cookie';

async function GetDoctorByAccountIdFromTokenFetchAsync() {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync(); 
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${ProfilesAPI}/Doctor/doctor-by-account-id-from-token`, {
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
            console.error("Error in getting by account id doctors:", data);
            return null;
        }
    } catch (error) {
        console.error('Error in getting by account id doctors:', error);
        //alert('An error occurred while connecting the account with the doctor');
        return null;
    }
}

export default GetDoctorByAccountIdFromTokenFetchAsync;
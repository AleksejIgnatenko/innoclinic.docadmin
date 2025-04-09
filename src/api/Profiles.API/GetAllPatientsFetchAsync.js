import { ProfilesAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function GetAllPatientsFetchAsync() {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }
        
        const response = await fetch(`${ProfilesAPI}/Patient`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`, 
            },
        });

        const data = await response.json();

        if (response.ok) {
           return data;
        } else {
            console.error('Failed to fetch patients:', data);
            return [];
        }
    } catch (error) {
        console.error('Error in getting all patients:', error);
        return [];
    }
}

export default GetAllPatientsFetchAsync;
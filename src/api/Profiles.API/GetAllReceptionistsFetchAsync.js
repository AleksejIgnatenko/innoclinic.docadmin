import { ProfilesAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function GetAllReceptionistsFetchAsync() {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${ProfilesAPI}/Receptionist`, {
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
            console.error('Failed to fetch receptionists:', data);
            return [];
        }
    } catch (error) {
        console.error('Error in getting all receptionists:', error);
        return [];
    }
}

export default GetAllReceptionistsFetchAsync;
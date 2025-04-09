import { ServicesAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function GetServiceByIdFetchAsync(id) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync(); 
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${ServicesAPI}/MedicalService/${id}`, {
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
            console.error('Failed to fetch medical service by ID:', data);
            return null;
        }
    } catch (error) {
        console.error('Error in getting medical service by id:', error);
        return null;
    }
}

export default GetServiceByIdFetchAsync;
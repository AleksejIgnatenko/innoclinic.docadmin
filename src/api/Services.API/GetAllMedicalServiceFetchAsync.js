import { ServicesAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function GetAllMedicalServiceFetchAsync() {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync(); 
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${ServicesAPI}/MedicalService`, {
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
            console.error('Failed to fetch medical services:', data);
            return [];
        }
    } catch (error) {
        console.error('Error in getting all services specialization:', error);
        return [];
    }
}

export default GetAllMedicalServiceFetchAsync;
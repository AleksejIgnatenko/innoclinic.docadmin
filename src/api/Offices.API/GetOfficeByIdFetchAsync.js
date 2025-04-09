import { OfficesAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function GetOfficeByIdFetchAsync(id) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync(); 
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${OfficesAPI}/Office/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`, // Add the token here
            },
        });

        const data = await response.json();
        
        if (response.ok) {
            return data;
        } else {
            console.error('Failed to fetch office by ID:', data);
            return null;
        }
    } catch (error) {
        console.error('Error while fetching office by ID:', error);
        return null;
    }
}

export default GetOfficeByIdFetchAsync;
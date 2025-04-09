import { ServicesAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function GetAllServiceCategoryFetchAsync() {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${ServicesAPI}/ServiceCategory`, {
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
            console.error('Failed to fetch service categories:', data);
            return [];
        }
    } catch (error) {
        console.error('Error occurred while fetching all service categories:', error);
        return [];
    }
}

export default GetAllServiceCategoryFetchAsync;
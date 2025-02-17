import Cookies from 'js-cookie';
import { AuthorizationAPI } from '../api';
import RefreshTokenFetchAsync from './RefreshTokenFetchAsync';

async function GetAccountByAccountIdFromTokenFetchAsync() {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${AuthorizationAPI}/Account/account-by-account-id-from-token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            console.error('Error fetching accounts:', data);
            alert(`Error: ${data.message || 'Failed to retrieve accounts.'}`);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}

export default GetAccountByAccountIdFromTokenFetchAsync;
import Cookies from 'js-cookie';
import { AuthorizationAPI } from '../api';
import { getCookie } from '../../services/getCookie';

async function RefreshTokenFetchAsync() {
    try {
        const jwtToken = getCookie('refreshToken');

        const response = await fetch(`${AuthorizationAPI}/Account/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken: jwtToken })
        });

        const data = await response.json();

        if (response.ok) {
            const { accessToken, refreshToken } = data;

            const accessTokenExpiry = 15 / (24 * 60);
            const refreshTokenExpiry = 180;

            Cookies.set('accessToken', accessToken, { sameSite: 'strict', expires: accessTokenExpiry });
            Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'strict', expires: refreshTokenExpiry });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration');
    }
}

export default RefreshTokenFetchAsync;
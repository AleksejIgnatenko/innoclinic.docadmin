import { AuthorizationAPI } from '../api';

async function RefreshTokenFetchAsync() {
    try {
        const response = await fetch(`${AuthorizationAPI}/Account/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });

        if (!response.ok) {
            console.error("Failed update access token");
        }
    } catch (error) {
        console.error('Error during registration:', error);
        //alert('An error occurred during registration');
    }
}

export default RefreshTokenFetchAsync;
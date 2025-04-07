import { ProfilesAPI } from "../api";
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";
import Cookies from 'js-cookie';

async function CreateReceptionistFetchAsync(receptionist) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${ProfilesAPI}/Receptionist`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(receptionist)
        });

        if (response.status === 400) {
            const data = await response.json();
            console.log('Validation errors:', data);
        }
    } catch (error) {
        console.error('Error in creating receptionist:', error);
        return { status: 500, error: 'Internal Server Error' };
    }
}

export default CreateReceptionistFetchAsync;
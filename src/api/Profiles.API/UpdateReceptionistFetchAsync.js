import { ProfilesAPI } from "../api";
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";
import Cookies from 'js-cookie';

async function UpdateReceptionistFetchAsync(id, receptionist) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${ProfilesAPI}/Receptionist/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(receptionist)
        });

        if (!response.ok) {
            const data = await response.json();
            console.log(data);
        }
    } catch (error) {
        console.error('Error in updating reception:', error);
        //alert('An error occurred while updating the patient');
        return { status: 500, error: 'Internal Server Error' };
    }
}

export default UpdateReceptionistFetchAsync;
import { AuthorizationAPI } from '../api';
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function AddImageInAccountFetchAsync(id, photoId) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${AuthorizationAPI}/Account/add-image-in-account/${id}?photoId=${photoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
        });

        if (!response.ok) {
            const data = await response.json();
            console.error('Failed to add image in account:', data);
        }
    } catch (error) {
        console.error('Error adding image in account:', error);
        //alert('An error occurred during the operation');
    }
}

export default AddImageInAccountFetchAsync;
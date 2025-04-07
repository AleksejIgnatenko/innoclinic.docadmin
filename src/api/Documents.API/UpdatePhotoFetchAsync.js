import { DocumentsAPI } from "../api";
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";
import Cookies from 'js-cookie';

async function UpdatePhotoFetchAsync(photoFile, id) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const formData = new FormData();
        formData.append('photo', photoFile);

        const response = await fetch(`${DocumentsAPI}/Photo/${id}`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${jwtToken}`, 
            },
            body: formData
        });

        if (response.ok) {
            const responseText = await response.text(); 
            return responseText;
        } else if (response.status === 400) {
            const data = await response.json();
            console.log(data);
        }
    } catch (error) {
        console.error('Error in updating photo:', error);
        return { status: 500, error: 'Internal Server Error' };
    }
}

export default UpdatePhotoFetchAsync;
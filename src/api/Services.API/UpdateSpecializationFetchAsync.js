import { ServicesAPI } from "../api";
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";
import Cookies from 'js-cookie';

async function UpdateSpecializationFetchAsync(id, specialization) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${ServicesAPI}/Specialization/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(specialization)
        });

        if (response.ok) {
            console.log("ok");
        } else if (response.status === 400) {
            const data = await response.json();
            console.log(data);
        }
    } catch (error) {
        console.error('Error in updating specialization:', error);
        //alert('An error occurred while creating the patient');
        return { status: 500, error: 'Internal Server Error' };
    }
}

export default UpdateSpecializationFetchAsync;
import { ServicesAPI } from "../api";
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";
import Cookies from 'js-cookie';

async function CreateMedicalServiceAsync(service) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${ServicesAPI}/MedicalService`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(service)
        });

        if (response.ok) {
            console.log("Medical service created successfully");
        } else if (response.status === 400) {
            const data = await response.json();
            console.log(data);
        }
    } catch (error) {
        console.error('Error in creating medical service:', error);
        return { status: 500, error: 'Internal Server Error' };
    }
}

export default CreateMedicalServiceAsync;
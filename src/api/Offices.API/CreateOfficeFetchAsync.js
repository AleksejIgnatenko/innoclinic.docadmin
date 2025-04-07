import { OfficesAPI } from "../api";
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";
import Cookies from 'js-cookie';

async function CreateOfficeFetchAsync(officeModel) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${OfficesAPI}/Office`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(officeModel)
        });

        if (response.ok) {
            console.log("ok");
        } else if (response.status === 400) {
            const data = await response.json();
            console.log(data);
        }
    } catch (error) {
        console.error('Error in creating office:', error);
        return { status: 500, error: 'Internal Server Error' };
    }
}

export default CreateOfficeFetchAsync;
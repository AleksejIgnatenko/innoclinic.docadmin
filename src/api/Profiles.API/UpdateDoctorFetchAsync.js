import { ProfilesAPI } from "../api";
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";
import Cookies from 'js-cookie';

async function UpdateDoctorFetchAsync(doctorId, doctorModel) {
    try {
        console.log(doctorModel)
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${ProfilesAPI}/Doctors/${doctorId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(doctorModel)
        });

        if (response.ok) {
            console.log("ok");
        } else if (response.status === 400) {
            const data = await response.json();
            console.log(data);
        }
    } catch (error) {
        console.error('Error in updating patient:', error);
        alert('An error occurred while updating the patient');
        return { status: 500, error: 'Internal Server Error' };
    }
}

export default UpdateDoctorFetchAsync;
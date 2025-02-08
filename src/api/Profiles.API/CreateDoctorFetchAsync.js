import { getCookie } from "../../services/getCookie";
import { ProfilesAPI } from "../api";
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function CreateDoctorFetchAsync(doctorModel) {
    try {
        // let jwtToken = getCookie('accessToken');
        // if (!jwtToken) {
        //     await RefreshTokenFetchAsync(); 
        //     jwtToken = getCookie('accessToken');
        // }

        const response = await fetch(`http://localhost:5002/api/Doctors`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${jwtToken}`,
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
        console.error('Error in creating patient:', error);
        alert('An error occurred while creating the patient');
        return { status: 500, error: 'Internal Server Error' };
    }
}

export default CreateDoctorFetchAsync;
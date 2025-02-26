import { ProfilesAPI } from "../api";

async function GetAllDoctorsFetchAsync() {
    try {
        const response = await fetch(`${ProfilesAPI}/Doctor`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();

        if (response.ok) {
           return data;
        }
    } catch (error) {
        console.error('Error in getting all doctors:', error);
        alert('An error occurred while receiving all the doctors');
        return [];
    }
}

export default GetAllDoctorsFetchAsync;
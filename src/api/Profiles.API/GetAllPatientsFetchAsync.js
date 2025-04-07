import { ProfilesAPI } from "../api";

async function GetAllPatientsFetchAsync() {
    try {
        const response = await fetch(`${ProfilesAPI}/Patient`, {
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
        console.error('Error in getting all patients:', error);
        //alert('An error occurred while receiving all the doctors');
        return [];
    }
}

export default GetAllPatientsFetchAsync;
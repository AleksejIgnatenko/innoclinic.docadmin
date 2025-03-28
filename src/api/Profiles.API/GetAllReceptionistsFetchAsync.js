import { ProfilesAPI } from "../api";

async function GetAllReceptionistsFetchAsync() {
    try {
        const response = await fetch(`${ProfilesAPI}/Receptionist`, {
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
        console.error('Error in getting all receptionist:', error);
        //alert('An error occurred while receiving all the doctors');
        return [];
    }
}

export default GetAllReceptionistsFetchAsync;
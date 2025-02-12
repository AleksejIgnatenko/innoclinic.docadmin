import { ServicesAPI } from "../api";

async function GetAllMedicalServiceFetchAsync() {
    try {
        const response = await fetch(`${ServicesAPI}/MedicalService`, {
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
        console.error('Error in getting all medical service:', error);
        alert('An error occurred while receiving all medical');
    }
}

export default GetAllMedicalServiceFetchAsync;
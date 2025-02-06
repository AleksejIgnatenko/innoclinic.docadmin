import { ServicesAPI } from "../api";

async function GetAllSpecializationFetchAsync() {
    try {
        const response = await fetch(`${ServicesAPI}/Specialization`, {
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
        console.error('Error in getting all specialization:', error);
        alert('An error occurred while receiving all specialization');
    }
}

export default GetAllSpecializationFetchAsync;
import { ServicesAPI } from "../api";

async function GetServicesBySpecializationIdFetchAsync(id) {
    try {
        const response = await fetch(`${ServicesAPI}/MedicalService/services-by-specialization-id/${id}`, {
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
        console.error('Error while fetching services by Id:', error);
        //alert('An error occurred while trying to fetch the office details. Please try again later.');
    }
}

export default GetServicesBySpecializationIdFetchAsync;
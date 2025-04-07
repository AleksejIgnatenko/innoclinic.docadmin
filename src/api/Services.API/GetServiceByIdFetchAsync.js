import { ServicesAPI } from "../api";

async function GetServiceByIdFetchAsync(id) {
    try {
        const response = await fetch(`${ServicesAPI}/MedicalService/${id}`, {
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
        console.error('Error in getting medical service by id:', error);
        //alert('An error occurred while trying to fetch the medical service details. Please try again later.');
    }
}

export default GetServiceByIdFetchAsync;
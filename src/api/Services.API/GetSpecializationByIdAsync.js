import { ServicesAPI } from "../api";

async function GetSpecializationByIdAsync(id) {
    try {
        const response = await fetch(`${ServicesAPI}/Specialization/${id}`, {
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
        console.error('Error while fetching specialization by Id:', error);
        //alert('An error occurred while trying to fetch the office details. Please try again later.');
    }
}

export default GetSpecializationByIdAsync;
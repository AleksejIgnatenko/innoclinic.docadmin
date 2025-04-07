import { OfficesAPI } from "../api";

async function GetOfficeByIdFetchAsync(id) {
    try {
        const response = await fetch(`${OfficesAPI}/Office/${id}`, {
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
        console.error('Error while fetching office by Id:', error);
        //alert('An error occurred while trying to fetch the office details. Please try again later.');
    }
}

export default GetOfficeByIdFetchAsync;
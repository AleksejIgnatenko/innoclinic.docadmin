import { OfficesAPI } from "../api";

async function GetAllOfficesFetchAsync() {
    try {
        const response = await fetch(`${OfficesAPI}/Office`, {
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
        console.error('Error in fetching all offices:', error);
        alert('An error occurred while fetching the offices.');
    }
}

export default GetAllOfficesFetchAsync;
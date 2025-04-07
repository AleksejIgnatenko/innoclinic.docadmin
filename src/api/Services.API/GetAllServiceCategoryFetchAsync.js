import { ServicesAPI } from "../api";

async function GetAllServiceCategoryFetchAsync() {
    try {
        const response = await fetch(`${ServicesAPI}/ServiceCategory`, {
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
        console.error('Error occurred while fetching all service categories:', error);
        //alert('An error occurred while receiving all medical services');
    }
}

export default GetAllServiceCategoryFetchAsync;
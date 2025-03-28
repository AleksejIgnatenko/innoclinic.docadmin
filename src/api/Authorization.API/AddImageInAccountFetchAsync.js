import { AuthorizationAPI } from '../api';

async function AddImageInAccountFetchAsync(id, photoId) {
    try {
        const response = await fetch(`${AuthorizationAPI}/Account/add-image-in-account/${id}?photoId=${photoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if(!response.ok) {
            const data = await response.json();
            console.log(data);
        }
    } catch (error) {
        console.error('Error add image in account:', error);
        //alert('An error occurred during sign in');
    }
}

export default AddImageInAccountFetchAsync;
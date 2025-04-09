import { AuthorizationAPI } from "../api";

async function IsEmailAvailableFetchAsync(email) {
    try {
        const response = await fetch(`${AuthorizationAPI}/Account/is-email-available?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.isEmailAvailability;
        } else {
            const data = await response.json();
            console.error('Error check email availability:', data);
            return;
        }
    } catch (error) {
        console.error('Error during check email availability:', error);
        //alert('An error occurred during check email availability');
    }
}

export default IsEmailAvailableFetchAsync;
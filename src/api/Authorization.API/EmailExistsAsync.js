import { AuthorizationAPI } from "../api";

async function EmailExistsAsync(email) {
    try {
        const response = await fetch(`${AuthorizationAPI}/Account/email-exists?email=${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const data = await response.json();
            console.error('Error check email availability:', data);
            alert(data.message || 'Check email availability failed');
            return;
        }

        const data = await response.json();
        return data.isEmailAvailability;
    } catch (error) {
        console.error('Error during check email availability:', error);
        alert('An error occurred during check email availability');
    }
}

export default EmailExistsAsync;
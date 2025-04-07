import { DocumentsAPI } from "../api";
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";
import Cookies from 'js-cookie';

async function CreateAndSendAppointmentResultDocumentToEmailAsync(appointmentResult) {
    try {
        console.log(appointmentResult);
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${DocumentsAPI}/Document/create-and-send-appointment-result-document-to-email`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(appointmentResult)
        });

        if (!response.ok) {
            console.error('Failed to create and send appointment result document to email. Server error:', response.status);
        }
    } catch (error) {
        console.error('Error while generating appointment result document:', error);
    }
}

export default CreateAndSendAppointmentResultDocumentToEmailAsync;
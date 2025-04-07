import { AppointmentAPI } from "../api";

async function GetAllAppointmentResultsByAppointmentIdFetchAsync(appointmentId) {
    try {
        const response = await fetch(`${AppointmentAPI}/AppointmentResult/by-appointment-id/${appointmentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return await response.json();
        } else {
            const result = await response.json();
            console.error('Failed to fetch appointment results:', result);
        }
    } catch (error) {
        console.error('Error fetching appointment results:', error);
        // alert('An error occurred while fetching appointment results.');
    }
}

export default GetAllAppointmentResultsByAppointmentIdFetchAsync;
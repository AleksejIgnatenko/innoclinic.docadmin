import { AppointmentAPI } from "../api";

async function GetAllAvailableTimeSlotsFetchAsync(date, timeSlotSize, doctorId) {
    try {
        const response = await fetch(`${AppointmentAPI}/Appointment/all-available-time-slots?date=${date}&timeSlotSize=${timeSlotSize}&doctorId=${doctorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return await response.json();
        } else {
            const result = await response.json();
            console.error('Failed to fetch available time slots:', result);
        }
    } catch (error) {
        console.error('Error fetching available time slots:', error);
        // alert('An error occurred while fetching available time slots.');
    }
}

export default GetAllAvailableTimeSlotsFetchAsync;
class UpdateAppointmentModelRequest {
    constructor(id, doctorId, medicalServiceId, patientId, date, time, isApproved) {
        this.id = id;
        this.doctorId = doctorId;
        this.medicalServiceId = medicalServiceId;
        this.patientId = patientId;
        this.date = date;
        this.time = time;
        this.isApproved = isApproved;
    }
}

export default UpdateAppointmentModelRequest;
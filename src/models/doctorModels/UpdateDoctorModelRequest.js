class UpdateDoctorModelRequest {
    constructor(
        firstName,
        lastName,
        middleName,
        cabinetNumber,
        dateOfBirth,
        specializationId,
        officeId,
        careerStartYear,
        status,
        photoId
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.cabinetNumber = cabinetNumber;
        this.dateOfBirth = dateOfBirth;
        this.specializationId = specializationId; 
        this.officeId = officeId; 
        this.careerStartYear = careerStartYear;
        this.status = status;
        this.photoId = photoId;
    }
}

export default UpdateDoctorModelRequest;
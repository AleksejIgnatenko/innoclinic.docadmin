class CreateDoctorModelRequest {
    constructor(
        firstName,
        lastName,
        middleName,
        cabinetNumber,
        dateOfBirth,
        email,
        specializationId,
        officeId,
        careerStartYear,
        status,
        photoId,
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.cabinetNumber = cabinetNumber;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.specializationId = specializationId; 
        this.officeId = officeId; 
        this.careerStartYear = careerStartYear;
        this.status = status;
        this.photoId = photoId;
    }
}

export default CreateDoctorModelRequest;
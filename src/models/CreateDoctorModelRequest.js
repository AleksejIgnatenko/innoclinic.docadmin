class CreateDoctorModelRequest {
    constructor(
        firstName,
        lastName,
        middleName,
        cabinetNumber,
        dateOfBirth,
        specializationId,
        officeId,
        careerStartYear,
        status
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
    }
}

export default CreateDoctorModelRequest;
class OfficeModelRequest {
    constructor(city, street, houseNumber, officeNumber, registryPhoneNumber, isActive) {
        this.city = city;
        this.street = street;
        this.houseNumber = houseNumber;
        this.officeNumber = officeNumber; 
        this.registryPhoneNumber = registryPhoneNumber;
        this.isActive = isActive;
    }
}

export default OfficeModelRequest;
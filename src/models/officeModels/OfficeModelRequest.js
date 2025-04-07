class OfficeModelRequest {
    constructor(city, street, houseNumber, officeNumber, photoId, registryPhoneNumber, isActive) {
        this.city = city;
        this.street = street;
        this.houseNumber = houseNumber;
        this.officeNumber = officeNumber; 
        this.photoId = photoId;
        this.registryPhoneNumber = registryPhoneNumber;
        this.isActive = isActive;
    }
}

export default OfficeModelRequest;
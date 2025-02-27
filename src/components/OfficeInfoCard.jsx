import React, { useState } from 'react';
import './../styles/OfficeInfoCard.css';
import OfficeModelRequest from '../models/officeModels/OfficeModelRequest';
import UpdateOfficeFetchAsync from '../api/Offices.API/UpdateOfficeFetchAsync';

const OfficeInfoCard = ({ office }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: office?.id || '',
        address: office?.city + " " + office?.street + " " + office?.houseNumber + " " + office?.officeNumber || '',
        registryPhoneNumber: office?.registryPhoneNumber || '',
        isActive: office?.isActive || '',
    }); 

    const [updateCity, setUpdateCity] = useState(office?.city);
    const [updateStreet, setUpdateStreet] = useState(office?.street);
    const [updateHouseNumber, setUpdateHouseNumber] = useState(office?.houseNumber);
    const [updateOfficeNumber, setUpdateOfficeNumber] = useState(office?.officeNumber);
    const [updateRegistryPhoneNumber, setUpdateRegistryPhoneNumber] = useState(office?.registryPhoneNumber);
    const [updateIsActive, setUpdateIsActive] = useState(office?.isActive);

    const [selectedImage, setSelectedImage] = useState(null);

    const [cityValid, setCityValid] = useState(true);
    const [streetValid, setStreetValid] = useState(true);
    const [houseNumberValid, setHouseNumberValid] = useState(true);
    const [registryPhoneNumberValid, setRegistryPhoneNumberValid] = useState(true);

    const handleEditClick = () => {
        if (isEditing) {
            const confirmEdit = window.confirm("Do you really want to cancel? Changes will not be saved.");
            if (confirmEdit) {
                setIsEditing(!isEditing);
                setFormData({
                    id: office?.id || '',
                    address: office?.address || '',
                    isActive: office?.isActive || '',
                    registryPhoneNumber: office?.registryPhoneNumber || ''
                });

                //setUpdateAddress(office?.address);
                setUpdateIsActive(office?.isActive);
                setUpdateRegistryPhoneNumber(office?.registryPhoneNumber);
            }
        } else {
            setIsEditing(!isEditing);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCityBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('office-info-card-city-label');

        if (!input.value) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = 'Please, enter the office’s city';
            setCityValid(false);
        } else {
            label.textContent = 'City';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setCityValid(true);
        }
    };

    const handleCityChange = (event) => {
        const inputValue = event.target.value;
    
        const cleanedValue = inputValue.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');

        if (cleanedValue.length === 0 || cleanedValue.length === 1) {
            setUpdateCity(cleanedValue);
        } else if (cleanedValue.length > 1) {
            setUpdateCity(cleanedValue);
        }
    };

    const handleCityInput = (event) => {
        const input = event.target;
        const label = document.getElementById('office-info-card-city-label');

        if (!input.value) {
            setCityValid(false);
        } else {
            label.textContent = 'City';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setCityValid(true);
        }
    }

    const handleStreetBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('office-info-card-street-label');

        if (!input.value) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = 'Please, enter the office’s street';
            setStreetValid(false);
        } else {
            label.textContent = 'Street';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setStreetValid(true);
        }
    };

    const handleStreetChange = (event) => {
        const inputValue = event.target.value;

        const cleanedValue = inputValue.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');

        if (cleanedValue.length === 0 || cleanedValue.length === 1) {
            setUpdateStreet(cleanedValue); 
        } else if (cleanedValue.length > 1) {
            setUpdateStreet(cleanedValue);
        }
    };

    const handleStreetInput = (event) => {
        const input = event.target;
        const label = document.getElementById('office-info-card-street-label');

        if (!input.value) {
            setStreetValid(false);
        } else {
            label.textContent = 'Street';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setStreetValid(true);
        }
    };

    const handleHouseNumberBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('office-info-card-houseNumber-label');

        if (!input.value) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = 'Please, enter the office’s house number';
            setHouseNumberValid(false);
        } else {
            label.textContent = 'House number';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setHouseNumberValid(true);
        }
    };

    const handleHouseNumberChange = (event) => {
        const inputValue = event.target.value;

        const cleanedValue = inputValue.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');

        if (cleanedValue.length === 0 || cleanedValue.length === 1) {
            setUpdateHouseNumber(cleanedValue); 
        } else if (cleanedValue.length > 1) {
            setUpdateHouseNumber(cleanedValue); 
        }
    };

    const handleHouseNumberInput = (event) => {
        const input = event.target;
        const label = document.getElementById('office-info-card-houseNumber-label');

        if (!input.value) {
            setHouseNumberValid(false);
        } else {
            label.textContent = 'House number';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setHouseNumberValid(true);
        }
    };

    const handleOfficeNumberChange = (event) => {
        const inputValue = event.target.value;

        const cleanedValue = inputValue.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
    
        if (cleanedValue.length === 0 || cleanedValue.length === 1) {
            setUpdateOfficeNumber(cleanedValue);
        } else if (cleanedValue.length > 1) {
            setUpdateOfficeNumber(cleanedValue); 
        }
    };

    const handleRegistryPhoneNumberBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('office-info-card-registryPhoneNumber-label');
        const phoneNumberPattern = /^\+375\(\d{2}\)\d{3}-\d{2}-\d{2}$/;

        if (!input.value) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = 'Please, enter the phone number';
            setRegistryPhoneNumberValid(false);
        } else if (!phoneNumberPattern.test(input.value)) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = 'You’ve entered an invalid phone number';
            setRegistryPhoneNumberValid(false);
        } else {
            label.textContent = 'Registry phone number (+375(xx)xxx-xx-xx)';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setRegistryPhoneNumberValid(true);
        }
    };

    const handleRegistryPhoneNumberChange = (event) => {
        setUpdateRegistryPhoneNumber(event.target.value);
    };

    const handleRegistryPhoneNumberInput = (event) => {
        const input = event.target;
        const label = document.getElementById('office-info-card-registryPhoneNumber-label');
        const phoneNumberPattern = /^\+375\(\d{2}\)\d{3}-\d{2}-\d{2}$/;
    
        if (!input.value) {
            setRegistryPhoneNumberValid(false);
            label.textContent = 'Registry phone number is required.';
            input.classList.add('error-input-border');
            label.classList.add('error-label');
        } else if (!phoneNumberPattern.test(input.value)) {
            setRegistryPhoneNumberValid(false);
            label.textContent = 'Invalid format. Use (+375(xx)xxx-xx-xx)';
            input.classList.add('error-input-border');
            label.classList.add('error-label');
        } else {
            label.textContent = 'Registry phone number (+375(xx)xxx-xx-xx)';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setRegistryPhoneNumberValid(true);
        }
    };

    const handleRegistryPhoneNumberKeyDown = (event) => {
        const input = event.target;

        if (event.key === 'Backspace' && input.value === '+') {
            event.preventDefault();
        }
    };

    const handleStatusChange = (e) => {
        setUpdateIsActive(e.target.value === 'true');
    };

    const isFormValid = cityValid && streetValid && houseNumberValid && registryPhoneNumberValid;

    async function handleUpdateOfficeSave() {
        setIsEditing(false);
        const updateDoctorModel = new OfficeModelRequest(updateCity, updateStreet, updateHouseNumber, updateOfficeNumber, updateRegistryPhoneNumber, updateIsActive);
        console.log(updateDoctorModel);
        await UpdateOfficeFetchAsync(office.id, updateDoctorModel);

        setFormData(prevFormData => ({
            ...prevFormData,
            address: office?.city + " " + office?.street + " " + office?.houseNumber + " " + office?.officeNumber || '',
            registryPhoneNumber: updateRegistryPhoneNumber,
            isActive: updateIsActive,
        }));
    };

    return (
        <div className="office-info-wrapper">
            <div className="office-info-card active">
                <div className="office-info-card-header">
                    <div className="icon-container">
                        {!isEditing && (
                            <i className='bx bx-pencil' onClick={handleEditClick}></i>
                        )}
                        {isEditing ? (
                            <>
                                <i
                                    className={`bx bx-check ${!isFormValid ? 'invalid' : ''}`}
                                    onClick={isFormValid ? handleUpdateOfficeSave : null} 
                                ></i>
                                <i className='bx bx-x' onClick={handleEditClick}></i>
                            </>
                        ) : null}
                    </div>
                    <img
                        src={selectedImage || "https://th.bing.com/th/id/OIP.audMX4ZGbvT2_GJTx2c4GgAAAA?rs=1&pid=ImgDetMain"}
                        alt="Doctor"
                        onClick={() => isEditing && document.getElementById('imageUpload').click()}
                    />
                    <input
                        type="file"
                        id="imageUpload"
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <div className="office-info-card-content">
                    {isEditing ? (
                        <div>
                            <div className="office-info-card-input-wrapper">
                                <input
                                    value={updateCity}
                                    onBlur={handleCityBlur}
                                    onChange={handleCityChange}
                                    onInput={handleCityInput}
                                    type="text"
                                    name=""
                                    id="office-info-card-city-input"
                                    class="input default-input-border"
                                    placeholder=" "
                                    required />
                                <label className="office-info-card-input-label" id="office-info-card-city-label">City</label>
                            </div>
                            <div className="office-info-card-input-wrapper">
                                <input
                                    value={updateStreet}
                                    onBlur={handleStreetBlur}
                                    onChange={handleStreetChange}   
                                    onInput={handleStreetInput}
                                    type="text"
                                    name=""
                                    id="office-info-card-street-input"
                                    class="input default-input-border"
                                    placeholder=" "
                                    required />
                                <label className="office-info-card-input-label" id="office-info-card-street-label">Street</label>
                            </div>
                            <div className="office-info-card-input-wrapper">
                                <input
                                    value={updateHouseNumber}
                                    onBlur={handleHouseNumberBlur}
                                    onChange={handleHouseNumberChange}
                                    onInput={handleHouseNumberInput}
                                    type="text"
                                    name=""
                                    id="office-info-card-houseNumber-input"
                                    class="input default-input-border"
                                    placeholder=" "
                                    required />
                                <label className="office-info-card-input-label" id="office-info-card-houseNumber-label">House number</label>
                            </div>
                            <div className="office-info-card-input-wrapper">
                                <input
                                    value={updateOfficeNumber}
                                    //onBlur={handleOfficeNumberBlur}
                                    onChange={handleOfficeNumberChange}
                                    //onInput={handleOfficeNumberInput}
                                    type="text"
                                    name=""
                                    id="office-info-card-officeNumber-input"
                                    class="input default-input-border"
                                    placeholder=" "
                                    required />
                                <label className="office-info-card-input-label" id="office-info-card-officeNumber-label">Office number</label>
                            </div>
                            <div className="office-info-card-input-wrapper">
                                <input
                                    type="radio"
                                    name="Status"
                                    value={true}
                                    checked={updateIsActive === true}
                                    onChange={handleStatusChange}
                                    id="office-info-card-status-input-true"
                                    className="office-info-card-radio-input"
                                />
                                <label htmlFor="office-info-card-status-input-true" className="office-info-card-radio-label">Active</label>

                                <input
                                    type="radio"
                                    name="Status"
                                    value={false}
                                    checked={updateIsActive === false}
                                    onChange={handleStatusChange}
                                    id="office-info-card-status-input-false"
                                    className="office-info-card-radio-input"
                                />
                                <label htmlFor="office-info-card-status-input-false" className="office-info-card-radio-label">Inactive</label>

                                <label className="office-info-card-input-label" id="office-info-card-isActive-label">Status</label>
                            </div>
                            <div className="office-info-card-input-wrapper">
                                <input
                                    value={updateRegistryPhoneNumber}
                                    onChange={handleRegistryPhoneNumberChange}
                                    onBlur={handleRegistryPhoneNumberBlur}
                                    onInput={handleRegistryPhoneNumberInput}
                                    onKeyDown={handleRegistryPhoneNumberKeyDown}
                                    type="text"
                                    name="RegistryPhoneNumber"
                                    id="office-info-card-registryPhoneNumber-input"
                                    class="input default-input-border"
                                    placeholder=" "
                                    required />
                                <label className="office-info-card-input-label" id="office-info-card-registryPhoneNumber-label">Registry phone number (+375(xx)xxx-xx-xx)</label>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3>Address: {formData.address || 'address'}</h3>
                            <h3>Status: {formData.isActive ? 'Active' : 'Inactive'}</h3>
                            <h3>Registry phone number: {formData.registryPhoneNumber || 'Registry phone number'}</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OfficeInfoCard;
import React, { useState } from 'react';
import './../styles/OfficeInfoCard.css';

const OfficeInfoCard = ({ office }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: office?.id || '',
        address: office?.address || '',
        isActive: office?.isActive || '',
        registryPhoneNumber: office?.registryPhoneNumber || ''
    });

    const [updateAddress, setUpdateAddress] = useState(office?.address);
    const [updateIsActive, setUpdateIsActive] = useState(office?.isActive);
    const [updateRegistryPhoneNumber, setUpdateRegistryPhoneNumber] = useState(office?.registryPhoneNumber);

    const [selectedImage, setSelectedImage] = useState(null);

    const [addressValid, setAddressValid] = useState(false);
    const [registryPhoneNumberValid, setRegistryPhoneNumberValid] = useState(false);

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
            }
        } else {
            setIsEditing(!isEditing);
        }
    };

    const handleAddressBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('office-info-card-address-label');

        if (!input.value) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = 'Please, enter the address';
            setAddressValid(false);
        } else {
            label.textContent = 'Address';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setAddressValid(true);
        }
    };

    const handleAddressChange = (event) => {
        setUpdateAddress(event.target.value);

        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddressInput = (event) => {
        const input = event.target;
        const label = document.getElementById('office-info-card-address-label');

        if (!input.value) {
            setAddressValid(false);
        } else {
            label.textContent = 'Address';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setAddressValid(true);
        }
    }

    const handleRegistryPhoneNumberBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('office-info-card-registryPhoneNumber-label');

        if (!input.value) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = 'Please, enter the registry phone number';
            setRegistryPhoneNumberValid(false);
        } else {
            label.textContent = 'Registry phone number';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setRegistryPhoneNumberValid(true);
        }
    };

    const handleRegistryPhoneNumberChange = (event) => {
        setRegistryPhoneNumberValid(event.target.value);

        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRegistryPhoneNumberInput = (event) => {
        const input = event.target;
        const label = document.getElementById('office-info-card-registryPhoneNumber-label');

        if (!input.value) {
            setRegistryPhoneNumberValid(false);
        } else {
            label.textContent = 'Registry phone number';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setRegistryPhoneNumberValid(true);
        }
    }

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

    async function handleSave() {
        // setIsEditing(false);
        // const updateDoctorModel = new UpdateDoctorModelRequest(updateFirstName, updateLastName, updateMiddleName,
        //     updateCabinetNumber, updateDateofBirth, updateSelectedSpecializationId, updateSelectedOfficeId, updateCareerStartYear, updateSelectedStatus);

        // await UpdateDoctorFetchAsync(formData.Id, updateDoctorModel);
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
                                <i className='bx bx-check' onClick={handleSave}></i>
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
                                    value={formData.address}
                                    onChange={handleAddressChange}
                                    onBlur={handleAddressBlur}
                                    onInput={handleAddressInput}
                                    type="text"
                                    name="Address"
                                    id="office-info-card-address-input"
                                    class="input default-input-border"
                                    placeholder=" "
                                    required />
                                <label className="office-info-card-input-label" id="office-info-card-address-label">Address</label>
                            </div>
                            <div className="office-info-card-input-wrapper">
                                <input
                                    type="radio"
                                    name="IsActive"
                                    value="true"
                                    checked={formData.isActive === true}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                                    id="office-info-card-isActive-active-radio"
                                    className="office-info-card-radio-input"
                                    placeholder="Active"
                                />
                                <label htmlFor="office-info-card-isActive-active-radio" className="office-info-card-radio-label">Active</label>

                                <input
                                    type="radio"
                                    name="IsActive"
                                    value="false"
                                    checked={formData.isActive === false}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                                    id="office-info-card-isActive-inactive-radio"
                                    className="office-info-card-radio-input"
                                    placeholder="Inactive"
                                />
                                <label htmlFor="office-info-card-isActive-inactive-radio" className="office-info-card-radio-label">Inactive</label>

                                <label className="office-info-card-input-label" id="office-info-card-isActive-label">Status</label>
                            </div>
                            <div className="office-info-card-input-wrapper">
                                <input
                                    value={formData.registryPhoneNumber}
                                    onChange={handleRegistryPhoneNumberChange}
                                    onBlur={handleRegistryPhoneNumberBlur}
                                    onInput={handleRegistryPhoneNumberInput}
                                    type="text"
                                    name="RegistryPhoneNumber"
                                    id="office-info-card-registryPhoneNumber-input"
                                    class="input default-input-border"
                                    placeholder=" "
                                    required />
                                <label className="office-info-card-input-label" id="office-info-card-registryPhoneNumber-label">Registry phone number</label>
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
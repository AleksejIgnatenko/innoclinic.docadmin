import React, { useState } from 'react';
import './../styles/DoctorProfileCard.css';
import UpdateDoctorFetchAsync from '../api/Profiles.API/UpdateDoctorFetchAsync';
import UpdateDoctorModelRequest from '../models/UpdateDoctorModelRequest';

const DoctorProfileCard = ({ doctor, specializations, offices }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        Id: doctor?.id || '',
        FirstName: doctor?.firstName || '',
        LastName: doctor?.lastName || '',
        MiddleName: doctor?.middleName || '',
        CabinetNumber: doctor?.cabinetNumber || 0,
        DateOfBirth: doctor?.dateOfBirth || '',
        Specialization: doctor?.specialization.specializationName || '',
        Office: doctor?.office.address || '',
        CareerStartYear: doctor?.careerStartYear || '',
        Status: doctor?.status || '',
    });

    const statusOptions = [
        "At work",
        "On vacation",
        "Sick Day",
        "Sick Leave",
        "Self-isolation",
        "Leave without pay",
        "Inactive"
    ];

    const [updateFirstName, setUpdateFirstName] = useState(doctor?.firstName);
    const [updateLastName, setUpdateLastName] = useState(doctor?.lastName);
    const [updateMiddleName, setUpdateMiddleName] = useState(doctor?.middleName);
    const [updateCabinetNumber, setUpdateCabinetNumber] = useState(doctor?.cabinetNumber);
    const [updateDateofBirth, setUpdateDateofBirth] = useState(doctor?.dateOfBirth);
    const [updateSelectedSpecializationId, setUpdateSelectedSpecializationId] = useState(doctor?.specialization.id);
    const [updateSelectedOfficeId, setUpdateSelectedOfficeId] = useState(doctor?.office.id);
    const [updateCareerStartYear, setUpdateCareerStartYear] = useState(doctor?.careerStartYear);
    const [updateSelectedStatus, setUpdateSelectedStatus] = useState(doctor?.status);

    const [filterSpecialization, setFilterSpecialization] = useState('');

    const [selectedImage, setSelectedImage] = useState(null); 

    const [firstNameValid, setFirstNameValid] = useState(false);
    const [lastNameValid, setLastNameValid] = useState(false);
    const [middleNameValid, setMiddleNameValid] = useState(false);
    const [cabinetNumberValid, setCabinetNumberValid] = useState(false);
    const [dateOfBirthValid, setDateOfBirthValid] = useState(false);
    const [specializationValid, setSpecializationValid] = useState(false);
    const [officeValid, setOfficeValid] = useState(false);
    const [careerStartYearValid, setCareerStartYearValid] = useState(false);

    const handleEditClick = () => {
        if (isEditing) {
            const confirmEdit = window.confirm("Do you really want to cancel? Changes will not be saved.");
            if (confirmEdit) {
                setIsEditing(!isEditing);
                setFormData({
                    Id: doctor?.id || '',
                    FirstName: doctor?.firstName || '',
                    LastName: doctor?.lastName || '',
                    MiddleName: doctor?.middleName || '',
                    CabinetNumber: doctor?.cabinetNumber || 0,
                    DateOfBirth: doctor?.dateOfBirth || '',
                    Specialization: doctor?.specialization.specializationName || '',
                    Office: doctor?.office.address || '',
                    CareerStartYear: doctor?.careerStartYear || '',
                    Status: doctor?.status || '',
                });
            }
        } else {
            setIsEditing(!isEditing);
        }
    };

    const handleFirstNameBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('updateDoctorProfile-firstName-label');

        if (!input.value) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = 'Please, enter the first name';
            setFirstNameValid(false);
        } else {
            label.textContent = 'First name';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setFirstNameValid(true);
        }
    };

    const handleFirstNameChange = (event) => {
        setUpdateFirstName(event.target.value);

        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFirstNameInput = (event) => {
        const input = event.target;
        const label = document.getElementById('updateDoctorProfile-firstName-label');

        if (!input.value) {
            setFirstNameValid(false);
        } else {
            label.textContent = 'First name';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setFirstNameValid(true);
        }
    }

    const handleLastNameBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('updateDoctorProfile-lastName-label');

        if (!input.value) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = 'Please, enter the last name';
            setLastNameValid(false);
        } else {
            label.textContent = 'Last name';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setLastNameValid(true);
        }
    };

    const handleLastNameChange = (event) => {
        setUpdateLastName(event.target.value);

        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLastNameInput = (event) => {
        const input = event.target;
        const label = document.getElementById('updateDoctorProfile-lastName-label');

        if (!input.value) {
            setLastNameValid(false);
        } else {
            label.textContent = 'Last name';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setLastNameValid(true);
        }
    };

    const handleMiddleNameChange = (event) => {
        setUpdateMiddleName(event.target.value);

        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCabinetNumberBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('updateDoctorProfile-cabinetNumber-label');

        if (!input.value) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = 'Please, enter the cabinet number';
            setCabinetNumberValid(false);
        } else {
            label.textContent = 'Cabinet number';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setCabinetNumberValid(true);
        }
    };

    const handleCabinetNumberChange = (event) => {
        setUpdateCabinetNumber(event.target.value);

        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCabinetNumberInput = (event) => {
        const input = event.target;
        const label = document.getElementById('updateDoctorProfile-cabinetNumber-label');

        if (!input.value) {
            setCabinetNumberValid(false);
        } else {
            label.textContent = 'Cabinet number';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setCabinetNumberValid(true);
        }
    }

    const handleDateOfBirthChange = (event) => {
        setUpdateDateofBirth(event.target.value);

        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSpecializationChange = (event) => {
        setFilterSpecialization(event.target.value);

        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSpecializationBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('updateDoctorProfile-specialization-label');

        if (!input.value) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = 'Please, choose the specialisation';

        } else {
            label.textContent = 'Specialization';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
        }
    };

    const handleListClick = (id, item, type) => {
        const input = document.getElementById(`updateDoctorProfile-${type}-input`)
        const label = document.getElementById(`updateDoctorProfile-${type}-label`);
        setUpdateSelectedSpecializationId(id);
        setFilterSpecialization('');

        input.classList.remove('error-input-border');
        label.classList.remove('error-label');
        label.textContent = `${type}`;

        setFormData({ ...formData, [type]: item.specializationName });

    };

    const handleOfficesChange = (event) => {
        setUpdateSelectedOfficeId(event.target.value);
        const label = document.getElementById('updateDoctorProfile-office-label');
        const input = event.target;
        input.classList.remove('error-input-border');
        label.classList.remove('error-label');
        label.textContent = 'Office';

        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleOfficeBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('updateDoctorProfile-office-label');

        if (!input.value) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = 'Please, choose the office';
            setOfficeValid(false);
        } else {
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            label.textContent = 'Office';
            setOfficeValid(true);
        }
    };

    const handleCareerStartYearBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('updateDoctorProfile-careerStartYear-label');

        if (!input.value) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = 'Please, select the year';

        } else {
            label.textContent = 'Career start year';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');

        }
    };

    const handleCareerStartYearChange = (event) => {
        const currentDate = new Date();
        const selectedDate = new Date(event.target.value);

        if (selectedDate <= currentDate) {
            setUpdateCareerStartYear(event.target.value);

            const { name, value } = event.target;
            setFormData({ ...formData, [name]: value });
        }
    };

    const filteredSpecializations = specializations.filter(specialization =>
        specialization.specializationName.toLowerCase().includes(filterSpecialization.toLowerCase())
    );

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

    const handleStatusChange = (event) => {
        setUpdateSelectedStatus(event.target.value);
        const label = document.getElementById('updateDoctorProfile-status-label');
        const input = event.target;
        input.classList.remove('error-input-border');
        label.classList.remove('error-label');
        label.textContent = 'Status';
    }

    const handleStatusBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('updateDoctorProfile-status-label');

        if (!input.value) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = 'Please, select the status';

        } else {
            label.textContent = 'Status';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');

        }
    };

    async function handleSave() {
        setIsEditing(false);
        const updateDoctorModel = new UpdateDoctorModelRequest(updateFirstName, updateLastName, updateMiddleName,
            updateCabinetNumber, updateDateofBirth, updateSelectedSpecializationId, updateSelectedOfficeId, updateCareerStartYear, updateSelectedStatus);
        
        console.log(updateDoctorModel);
        await UpdateDoctorFetchAsync(formData.Id, updateDoctorModel);
    };

    return (
        <div className="doctor-profile-wrapper">
            <div className="doctor-profile-card active">
                <div className="doctor-profile-card-header">
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
                <div className="doctor-profile-card-content">
                    {isEditing ? (
                        <div>
                            <div className="updateDoctorProfile-input-wrapper">
                                <input
                                    value={formData.FirstName}
                                    onChange={handleFirstNameChange}
                                    onBlur={handleFirstNameBlur}
                                    onInput={handleFirstNameInput}
                                    type="text"
                                    name="FirstName"
                                    id="updateDoctorProfile-firstName-input"
                                    class="input default-input-border"
                                    placeholder=" "
                                    required />
                                <label class="input-label" id="updateDoctorProfile-firstName-label">First name</label>
                            </div>
                            <div className="updateDoctorProfile-input-wrapper">
                                <input
                                    value={formData.LastName}
                                    onChange={handleLastNameChange}
                                    onBlur={handleLastNameBlur}
                                    onInput={handleLastNameInput}
                                    type="text"
                                    name="LastName"
                                    id="updateDoctorProfile-lastName-input"
                                    class="input default-input-border"
                                    placeholder=" "
                                    required />
                                <label class="input-label" id="updateDoctorProfile-lastName-label">Last name</label>
                            </div>
                            <div className="updateDoctorProfile-input-wrapper">
                                <input
                                    value={formData.MiddleName}
                                    onChange={handleMiddleNameChange}
                                    // onBlur={handleMiddleNameBlur}
                                    // onInput={handleMiddleNameInput}
                                    type="text"
                                    name="MiddleName"
                                    id="updateDoctorProfile-middleName-input"
                                    class="input default-input-border"
                                    placeholder=" "
                                    required />
                                <label class="input-label" id="updateDoctorProfile-middleName-label">Middle name</label>
                            </div>
                            <div className="updateDoctorProfile-input-wrapper">
                                <input
                                    value={formData.CabinetNumber}
                                    onChange={handleCabinetNumberChange}
                                    onBlur={handleCabinetNumberBlur}
                                    // onInput={handleCabinetNumberInput}
                                    type="number"
                                    name="CabinetNumber"
                                    id="updateDoctorProfile-CabinetNumber-input"
                                    class="input default-input-border"
                                    placeholder=" "
                                    required />
                                <label class="input-label" id="updateDoctorProfile-cabinetNumber-label">Cabinet number</label>
                            </div>
                            <div className="updateDoctorProfile-input-wrapper">
                                <input
                                    value={formData.DateOfBirth}
                                    onChange={handleDateOfBirthChange}
                                    type="date"
                                    name="DateOfBirth"
                                    id="updateDoctorProfile-dateOfBirth-input"
                                    class="input default-input-border"
                                    placeholder=" "
                                    required />
                                <label class="input-label" id="updateDoctorProfile-dateOfBirth-label">Date of birth</label>
                            </div>
                            <div className="updateDoctorProfile-input-wrapper">
                                <input
                                    id="updateDoctorProfile-specialization-input"
                                    value={formData.Specialization}
                                    onChange={handleSpecializationChange}
                                    onBlur={handleSpecializationBlur}
                                    name="Specialization"
                                    className="input default-input-border"
                                    placeholder=""
                                    required
                                />
                                <label className="input-label" id="updateDoctorProfile-Specialization-label">Specialization</label>
                                {filterSpecialization && (
                                    <div className="filtred-list">
                                        {filteredSpecializations.map(specialization => (
                                            <div key={specialization.id} onClick={() => handleListClick(specialization.id, specialization, 'Specialization')}>
                                                {specialization.specializationName}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="updateDoctorProfile-input-wrapper">
                                <select
                                    value={formData.Office}
                                    onChange={handleOfficesChange}
                                    onBlur={handleOfficeBlur}
                                    name="Office"
                                    className="input default-input-border custom-select"
                                    required
                                >
                                    <option value="" disabled>Select an office</option>
                                    {offices.map(office => (
                                        <option key={office.id} value={office.id}>{office.address}</option>
                                    ))}
                                </select>
                                <label className="input-label label-active" id="updateDoctorProfile-office-label">Office</label>
                            </div>
                            <div className="updateDoctorProfile-input-wrapper">
                                <input
                                    value={formData.CareerStartYear}
                                    onChange={handleCareerStartYearChange}
                                    onBlur={handleCareerStartYearBlur}
                                    // onInput={handleCareerStartYearInput}
                                    type="date"
                                    name="CareerStartYear"
                                    id="updateDoctorProfile-careerStartYear-input"
                                    class="input default-input-border custom-select"
                                    placeholder=" "
                                    required />
                                <label class="input-label" id="updateDoctorProfile-careerStartYear-label">Career start year</label>
                            </div>
                            <div className="updateDoctorProfile-input-wrapper">
                                <select
                                    value={updateSelectedStatus}
                                    onChange={handleStatusChange}
                                    onBlur={handleStatusBlur}
                                    name="Status"
                                    className="input default-input-border custom-select"
                                    required
                                >
                                    <option value="" disabled>Select an Status</option>
                                    {statusOptions.map((status, index) => (
                                        <option key={index} value={status}>{status}</option>
                                    ))}
                                </select>
                                <label className="input-label label-active" id="updateDoctorProfile-status-label">Status</label>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3>First name: {formData.FirstName || 'first name'}</h3>
                            <h3>Last name: {formData.LastName || 'last name'}</h3>
                            <h3>Middle name: {formData.MiddleName || 'middle name'}</h3>
                            <h3>Cabinet number: {formData.CabinetNumber || 'cabinet number'}</h3>
                            <h3>Date of birth: {formData.DateOfBirth || 'date of birth'}</h3>
                            <h3>Specialization: {formData.Specialization || 'specialization'}</h3>
                            <h3>Office: {formData.Office || 'office'}</h3>
                            <h3>Career start year: {formData.CareerStartYear || 'Career start year'}</h3>
                            <h3>Status: {formData.Status || 'Status'}</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorProfileCard;
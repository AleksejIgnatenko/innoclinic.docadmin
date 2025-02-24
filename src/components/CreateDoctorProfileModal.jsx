import React, { useState, useEffect, useRef } from 'react';
import './../styles/CreateDoctorProfileModal.css';
import EmailExistsAsync from '../api/Authorization.API/EmailExistsAsync';
import GetAllSpecializationFetchAsync from '../api/Services.API/GetAllSpecializationFetchAsync';
import GetAllOfficesFetchAsync from '../api/Offices.API/GetAllOfficesFetchAsync';
import CreateDoctorFetchAsync from '../api/Profiles.API/CreateDoctorFetchAsync';
import CreateDoctorModelRequest from '../models/CreateDoctorModelRequest';

const CreateDoctorProfileModal = ({ onClose }) => {

    const [currentStage, setCurrentStage] = useState(0);
    const stages = [
        { title: "Stage 1" },
        { title: "Stage 2" },
    ];

    const statusOptions = [
        "At work",
        "On vacation",
        "Sick Day",
        "Sick Leave",
        "Self-isolation",
        "Leave without pay",
        "Inactive"
    ];

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [email, setEmail] = useState('');
    const [specializations, setSpecializations] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [selectedSpecializationId, setSelectedSpecializationId] = useState('');
    const [offices, setOffices] = useState([]);
    const [selectedOfficeId, setSelectedOfficeId] = useState('');
    const [careerStartYear, setCareerStartYear] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const [firstNameValid, setFirstNameValid] = useState(false);
    const [lastNameValid, setLastNameValid] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [officeValid, setOfficeValid] = useState(false);

    const [filterSpecialization, setFilterSpecialization] = useState('');

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState('Project 1');
    const [fileType, setFileType] = useState('');

    const imagesTypes = ["jpeg", "png", "svg", "gif"];
    const dropZoonRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedSpecializations = await GetAllSpecializationFetchAsync();
                setSpecializations(fetchedSpecializations);

                const fetchedOffices = await GetAllOfficesFetchAsync();
                setOffices(fetchedOffices);
            } catch (error) {
                console.error('Error services:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [onClose]);

    const handleDragOver = (e) => {
        e.preventDefault();
        dropZoonRef.current.classList.add('drop-zoon--over');
    };

    const handleDragLeave = (e) => {
        dropZoonRef.current.classList.remove('drop-zoon--over');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        dropZoonRef.current.classList.remove('drop-zoon--over');
        const droppedFile = e.dataTransfer.files[0];
        if (validateFile(droppedFile)) {
            setFile(droppedFile);
            uploadFile(droppedFile);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (validateFile(selectedFile)) {
            setFile(selectedFile);
            uploadFile(selectedFile);
        }
    };

    const validateFile = (file) => {
        const fileType = file.type;
        const fileSize = file.size;
        let isImage = imagesTypes.filter((type) => fileType.indexOf(`image/${type}`) !== -1);

        if (isImage.length !== 0) {
            if (fileSize <= 2000000) {
                if (isImage[0] === 'jpeg') {
                    setFileType('jpg');
                } else {
                    setFileType(isImage[0]);
                }
                return true;
            } else {
                alert('Please your file should be 2 Megabytes or less');
                return false;
            }
        } else {
            alert('Please make sure to upload an image file type');
            return false;
        }
    };

    const uploadFile = (file) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        setLoading(true);
        setPreview(null);
        setProgress(0);

        fileReader.onload = () => {
            setTimeout(() => {
                setLoading(false);
                setPreview(fileReader.result);
                progressMove();
            }, 600);
        };

        setFileName(file.name);
    };

    const progressMove = () => {
        let counter = 0;
        const intervalId = setInterval(() => {
            if (counter === 100) {
                clearInterval(intervalId);
            } else {
                counter += 10;
                setProgress(counter);
            }
        }, 100);
    };

    const handleFirstNameBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('createDoctorProfile-firstName-label');

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
        setFirstName(event.target.value);
    };

    const handleFirstNameInput = (event) => {
        const input = event.target;
        const label = document.getElementById('createDoctorProfile-firstName-label');

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
        const label = document.getElementById('createDoctorProfile-lastName-label');

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
        setLastName(event.target.value);
    };

    const handleLastNameInput = (event) => {
        const input = event.target;
        const label = document.getElementById('createDoctorProfile-lastName-label');

        if (!input.value) {
            setLastNameValid(false);
        } else {
            label.textContent = 'Last name';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setLastNameValid(true);
        }
    };

    // const handleMiddleNameBlur = (event) => {
    //     const input = event.target;
    //     const label = document.getElementById('createDoctorProfile-middleName-label');

    //     if (!input.value) {
    //         input.classList.add('error-input-border');
    //         label.classList.add('error-label');
    //         label.textContent = 'Please, enter the middle name';
    //         setMiddleNameValid(false);
    //     } else {
    //         label.textContent = 'Middle name';
    //         input.classList.remove('error-input-border');
    //         label.classList.remove('error-label');
    //         setMiddleNameValid(true);
    //     }
    // };

    const handleMiddleNameChange = (event) => {
        setMiddleName(event.target.value);
    };

    // const handleMiddleNameInput = (event) => {
    //     const input = event.target;
    //     const label = document.getElementById('createDoctorProfile-middleName-label');

    //     if (!input.value) {
    //         setMiddleNameValid(false);
    //     } else {
    //         label.textContent = 'Middle name';
    //         input.classList.remove('error-input-border');
    //         label.classList.remove('error-label');
    //         setMiddleNameValid(true);
    //     }
    // };

    const handleDateOfBirthBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('createDoctorProfile-dateOfBirth-label');

        if (!input.value) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = 'Please, select the date';
        } else {
            label.textContent = 'Date';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
        }
    };

    const handleDateOfBirthChange = (e) => {
        const currentDate = new Date();
        const selectedDate = new Date(e.target.value);

        if (selectedDate <= currentDate) {
            setDateOfBirth(e.target.value);
        }
    };

    async function handleEmailBlur(event) {
        const input = event.target;
        const label = document.getElementById('createDoctorProfile-email-label');
        if (input.value === '') {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = "Please, enter the email";
            setEmailValid(false);
        } else if (!input.value.includes('@')) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = "You've entered an invalid email";
            setEmailValid(false);
        } else {
            label.textContent = 'Email';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            const isEmailAvailability = await EmailExistsAsync(email);
            if (!isEmailAvailability) {
                setEmailValid(true);
            } else {
                input.classList.add('error-input-border');
                label.classList.add('error-label');
                label.textContent = "User with this email already exists";
                setEmailValid(false);
            }
            setEmailValid(true);
        }
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleEmailInput = (event) => {
        const input = event.target;
        setEmail(input.value);
        if (input.value === '') {
            setEmailValid(false);
        } else if (!input.value.includes('@')) {
            setEmailValid(false);
        } else {
            const label = document.getElementById('createDoctorProfile-email-label');
            label.textContent = 'Email';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setEmailValid(true);
        }
    };

    const handleSpecializationChange = (e) => {
        setSelectedSpecialization(e.target.value);
        setFilterSpecialization(e.target.value);
    };

    const handleSpecializationBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('createDoctorProfile-specialization-label');

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

    const filteredSpecializations = specializations.filter(specialization =>
        specialization.specializationName.toLowerCase().includes(filterSpecialization.toLowerCase())
    );

    const handleListClick = (id, item, type) => {
        const input = document.getElementById(`createDoctorProfile-${type}-input`)
        const label = document.getElementById(`createDoctorProfile-specialization-label`);
        setSelectedSpecialization(item.specializationName);
        setSelectedSpecializationId(id);
        setFilterSpecialization('');

        input.classList.remove('error-input-border');
        label.classList.remove('error-label');
        label.textContent = `${type}`;
    };

    const handleCareerStartYearBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('createDoctorProfile-careerStartYear-label');

        if (!input.value) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = 'Please, select the year';

        } else {
            label.textContent = 'Date';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');

        }
    };

    const handleCareerStartYearChange = (e) => {
        const currentDate = new Date();
        const selectedDate = new Date(e.target.value);

        if (selectedDate <= currentDate) {
            setCareerStartYear(e.target.value);
        }
    };

    const handleOfficesChange = (event) => {
        setSelectedOfficeId(event.target.value);
        const label = document.getElementById('createDoctorProfile-office-label');
        const input = event.target;
        input.classList.remove('error-input-border');
        label.classList.remove('error-label');
        label.textContent = 'Office';
    }

    const handleOfficeBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('createDoctorProfile-office-label');

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

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
        const label = document.getElementById('createDoctorProfile-status-label');
        const input = event.target;
        input.classList.remove('error-input-border');
        label.classList.remove('error-label');
        label.textContent = 'Status';
    }

    const handleStatusBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('createDoctorProfile-status-label');

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


    const isFormValid = () => {
        return firstNameValid && lastNameValid && dateOfBirth && emailValid && selectedSpecializationId && officeValid && careerStartYear && selectedStatus;
    };

    async function toggleCreateDoctorProfileAsync() {
        var createDoctorRequest = new CreateDoctorModelRequest(firstName, lastName, middleName, 1, dateOfBirth, email, selectedSpecializationId, selectedOfficeId, careerStartYear, selectedStatus);
        await CreateDoctorFetchAsync(createDoctorRequest);
    }

    const updateForm = (progression) => {
        const newStage = currentStage + progression;
        if (newStage >= 0 && newStage < stages.length) {
            setCurrentStage(newStage);
        }
    };

    const handleCancelClick = () => {
        const confirmResult = window.confirm("Do you really want to cancel? Entered data will not be saved.");
        if (confirmResult) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <section className="createDoctorProfile-section">
                <h2>Main Title 2</h2>
                <button className="close-button" onClick={onClose}>X</button>
                <ul className="createDoctorProfile-stage-progress">
                    {stages.map((stage, index) => (
                        <li key={index} className={index === currentStage ? "createDoctorProfile-active-stage" : ""}>
                            {stage.title}
                        </li>
                    ))}
                </ul>
                <div className="createDoctorProfile-form-wrapper">
                    <div className="createDoctorProfile-form" style={{ transform: `translateX(-${currentStage * 100}%)` }}>
                        <div className='stage'>
                            <div className="upload-area__header">
                                <h1 className="upload-area__title">Upload your image</h1>
                                <div className="upload-area__paragraph">
                                    File should be an image
                                    <strong className="upload-area__tooltip">
                                        Like
                                        <span className="upload-area__tooltip-data">{imagesTypes.join(', .')}</span>
                                    </strong>
                                    <div className="drop-zoon__paragraph">or drop your file here or Click to browse</div>
                                </div>
                            </div>
                            <div
                                id="uploadArea"
                                className="upload-area"
                                style={{ backgroundImage: preview ? `url(${preview})` : 'none' }}
                                ref={dropZoonRef}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={handleButtonClick}>
                                <span className="drop-zoon__icon">
                                    <i className="bx bxs-file-image"></i>
                                </span>
                                <span id="loadingText" className={`drop-zoon__loading-text ${loading ? 'show' : ''}`}>Please Wait</span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    id="fileInput"
                                    className="drop-zoon__file-input"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <div id="fileDetails" className="upload-area__file-details file-details">
                                    <h3 className="file-details__title">Uploaded File</h3>
                                    <div id="uploadedFile" className="uploaded-file">
                                        <div className="uploaded-file__icon-container">
                                            <i className="bx bxs-file-blank uploaded-file__icon"></i>
                                            <span className="uploaded-file__icon-text">{fileType}</span>
                                        </div>
                                        <div id="uploadedFileInfo" className="uploaded-file__info">
                                            <span className="uploaded-file__name">{fileName}</span>
                                            <span className="uploaded-file__counter">{progress}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='stage'>
                            <div className="createDoctorProfile-inputs">
                                <div className="createDoctorProfile-input-wrapper">
                                    <input
                                        value={firstName}
                                        onChange={handleFirstNameChange}
                                        onBlur={handleFirstNameBlur}
                                        onInput={handleFirstNameInput}
                                        type="text"
                                        name=""
                                        id="createDoctorProfile-firstName-input"
                                        class="input default-input-border"
                                        placeholder=" "
                                        required />
                                    <label className="createDoctorProfile-input-label" id="createDoctorProfile-firstName-label">First name</label>
                                </div>
                                <div className="createDoctorProfile-input-wrapper">
                                    <input
                                        value={lastName}
                                        onChange={handleLastNameChange}
                                        onBlur={handleLastNameBlur}
                                        onInput={handleLastNameInput}
                                        type="text"
                                        name=""
                                        id="createDoctorProfile-lastName-input"
                                        class="input default-input-border"
                                        placeholder=" "
                                        required />
                                    <label className="createDoctorProfile-input-label" id="createDoctorProfile-lastName-label">Last name</label>
                                </div>
                                <div className="createDoctorProfile-input-wrapper">
                                    <input
                                        value={middleName}
                                        onChange={handleMiddleNameChange}
                                        // onBlur={handleMiddleNameBlur}
                                        // onInput={handleMiddleNameInput}
                                        type="text"
                                        name=""
                                        id="createDoctorProfile-middleName-input"
                                        class="input default-input-border"
                                        placeholder=" "
                                        required />
                                    <label className="createDoctorProfile-input-label" id="createDoctorProfile-middleName-label">Middle name</label>
                                </div>
                                <div className="createDoctorProfile-input-wrapper">
                                    <input
                                        value={dateOfBirth}
                                        onChange={handleDateOfBirthChange}
                                        onBlur={handleDateOfBirthBlur}
                                        // onInput={handleDateOfBirthInput}
                                        type="date"
                                        name=""
                                        id="createDoctorProfile-dateOfBirth-input"
                                        class="input default-input-border"
                                        placeholder=" "
                                        required />
                                    <label className="createDoctorProfile-input-label" id="createDoctorProfile-dateOfBirth-label">Date of birth</label>
                                </div>
                                <div className="createDoctorProfile-input-wrapper">
                                    <input
                                        value={email}
                                        onChange={handleEmailChange}
                                        onBlur={handleEmailBlur}
                                        onInput={handleEmailInput}
                                        type="email"
                                        name=""
                                        id="createDoctorProfile-email-input"
                                        class="input default-input-border"
                                        placeholder=" "
                                        required />
                                    <label className="createDoctorProfile-input-label" id="createDoctorProfile-email-label">Email</label>
                                </div>
                                <div className="createDoctorProfile-input-wrapper">
                                    <input
                                        id="createDoctorProfile-specialization-input"
                                        value={selectedSpecialization}
                                        onChange={handleSpecializationChange}
                                        onBlur={handleSpecializationBlur}
                                        className="input default-input-border"
                                        placeholder=" "
                                        required
                                    />
                                    <label className="createDoctorProfile-input-label" id="createDoctorProfile-specialization-label">Specialization</label>
                                    {filterSpecialization && (
                                        <div className="filtred-list">
                                            {filteredSpecializations.map(specialization => (
                                                <div key={specialization.id} onClick={() => handleListClick(specialization.id, specialization, 'specialization')}>
                                                    {specialization.specializationName}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="createDoctorProfile-input-wrapper">
                                    <select
                                        value={selectedOfficeId}
                                        onChange={handleOfficesChange}
                                        onBlur={handleOfficeBlur}
                                        className="input default-input-border custom-select"
                                        required
                                    >
                                        <option value="" disabled>Select an office</option>
                                        {offices.map(office => (
                                            <option key={office.id} value={office.id}>{office.address}</option>
                                        ))}
                                    </select>
                                    <label className="createDoctorProfile-input-label label-active" id="createDoctorProfile-office-label">Office</label>
                                </div>
                                <div className="createDoctorProfile-input-wrapper">
                                    <input
                                        value={careerStartYear}
                                        onChange={handleCareerStartYearChange}
                                        onBlur={handleCareerStartYearBlur}
                                        // onInput={handleCareerStartYearInput}
                                        type="date"
                                        name=""
                                        id="createDoctorProfile-careerStartYear-input"
                                        class="input default-input-border"
                                        placeholder=" "
                                        required />
                                    <label className="createDoctorProfile-input-label" id="createDoctorProfile-careerStartYear-label">Career start year</label>
                                </div>
                                <div className="createDoctorProfile-input-wrapper">
                                    <select
                                        value={selectedStatus}
                                        onChange={handleStatusChange}
                                        onBlur={handleStatusBlur}
                                        className="input default-input-border custom-select"
                                        required
                                    >
                                        <option value="" disabled>Select an Status</option>
                                        {statusOptions.map((status, index) => (
                                            <option key={index} value={status}>{status}</option>
                                        ))}
                                    </select>
                                    <label className="createDoctorProfile-input-label label-active" id="createDoctorProfile-status-label">Status</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="navigation-container">
                    {currentStage === 0 ? (
                        <button className="secondary-btn" onClick={handleCancelClick}>
                            Cancel
                        </button>
                    ) : (
                        <button className={`secondary-btn ${currentStage === 0 ? "hidden" : ""}`} onClick={() => updateForm(-1)}>
                            Prev
                        </button>
                    )}

                    {currentStage !== 1 ? (
                        <button className="primary-btn" onClick={() => updateForm(1)}>
                            Next Step
                        </button>
                    ) : (
                        <button
                            className={`primary-btn ${!isFormValid() ? 'disabled-primary-btn' : ''}`}
                            onClick={toggleCreateDoctorProfileAsync}
                            disabled={!isFormValid}
                        >
                            Confirm &#x27F6;
                        </button>
                    )}
                </div>
            </section>
        </div>
    );
};

export default CreateDoctorProfileModal;
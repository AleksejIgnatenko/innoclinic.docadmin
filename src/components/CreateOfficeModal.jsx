import React, { useState, useEffect, useRef } from 'react';
import './../styles/CreateOfficeModal.css';
import OfficeModelRequest from '../models/officeModels/OfficeModelRequest';
import CreateOfficeFetchAsync from '../api/Offices.API/CreateOfficeFetchAsync';
import ImageUploader from './ImageUploader';
import imageTypes from '../constants/ImageTypes';

const CreateOfficeModal = ({ onClose }) => {

    const [currentStage, setCurrentStage] = useState(0);
    const stages = [
        { title: "Stage 1" },
        { title: "Stage 2" },
    ];

    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [officeNumber, setOfficeNumber] = useState('');
    const [registryPhoneNumber, setRegistryPhoneNumber] = useState('');
    const [status, setStatus] = useState(false);

    const [cityValid, setCityValid] = useState(false);
    const [streetValid, setStreetValid] = useState(false);
    const [houseNumberValid, setHouseNumberValid] = useState(false);
    const [registryPhoneNumberValid, setRegistryPhoneNumberValid] = useState(false);

    const [file, setFile] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);
    const [imgLoading, setImgLoading] = useState(false);
    const [uploadProgressPercent, setUploadProgressPercent] = useState(0);
    const [imgFileName, setImgFileName] = useState('Project 1');
    const [imgFileType, setImgFileType] = useState('');

    const imgDropZoonRef = useRef(null);
    const fileInputRef = useRef(null);

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

    const handleDragOverImg = (e) => {
        e.preventDefault();
        imgDropZoonRef.current.classList.add('drop-zoon--over');
    };

    const handleDragLeaveImg = (e) => {
        imgDropZoonRef.current.classList.remove('drop-zoon--over');
    };

    const handleDropImg = (e) => {
        e.preventDefault();
        imgDropZoonRef.current.classList.remove('drop-zoon--over');
        const droppedFile = e.dataTransfer.files[0];
        if (validateFile(droppedFile)) {
            setFile(droppedFile);
            uploadFile(droppedFile);
        }
    };

    const handleButtonClickImg = () => {
        fileInputRef.current.click();
    };

    const handleChangeImg = (e) => {
        const selectedFile = e.target.files[0];
        if (validateFile(selectedFile)) {
            setFile(selectedFile);
            uploadFile(selectedFile);
        }
    };

    const validateFile = (file) => {
        const fileType = file.type;
        const fileSize = file.size;
        let isImage = imageTypes.filter((type) => fileType.indexOf(`image/${type}`) !== -1);

        if (isImage.length !== 0) {
            if (fileSize <= 2000000) {
                if (isImage[0] === 'jpeg') {
                    setImgFileType('jpg');
                } else {
                    setImgFileType(isImage[0]);
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

        setImgLoading(true);
        setImgPreview(null);
        setUploadProgressPercent(0);

        fileReader.onload = () => {
            setTimeout(() => {
                setImgLoading(false);
                setImgPreview(fileReader.result);
                progressMove();
            }, 600);
        };

        setImgFileName(file.name);
    };

    const progressMove = () => {
        let counter = 0;
        const intervalId = setInterval(() => {
            if (counter === 100) {
                clearInterval(intervalId);
            } else {
                counter += 10;
                setUploadProgressPercent(counter);
            }
        }, 100);
    };

    const handleCityBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('create-office-city-label');

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
            setCity(cleanedValue);
        } else if (cleanedValue.length > 1) {
            setCity(cleanedValue);
        }
    };

    const handleCityInput = (event) => {
        const input = event.target;
        const label = document.getElementById('create-office-city-label');

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
        const label = document.getElementById('create-office-street-label');

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
            setStreet(cleanedValue); 
        } else if (cleanedValue.length > 1) {
            setStreet(cleanedValue);
        }
    };

    const handleStreetInput = (event) => {
        const input = event.target;
        const label = document.getElementById('create-office-street-label');

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
        const label = document.getElementById('create-office-houseNumber-label');

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
            setHouseNumber(cleanedValue); 
        } else if (cleanedValue.length > 1) {
            setHouseNumber(cleanedValue); 
        }
    };
    
    const handleHouseNumberInput = (event) => {
        const input = event.target;
        const label = document.getElementById('create-office-houseNumber-label');

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
            setOfficeNumber(cleanedValue);
        } else if (cleanedValue.length > 1) {
            setOfficeNumber(cleanedValue); 
        }
    };

    const handleRegistryPhoneNumberBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('create-office-registryPhoneNumber-label');
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
            label.textContent = 'Registry phone mumber';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setRegistryPhoneNumberValid(true);
        }
    };

    const handleRegistryPhoneNumberChange = (event) => {
        setRegistryPhoneNumber(event.target.value);
    };

    const handleRegistryPhoneNumberInput = (event) => {
        const input = event.target;
        const label = document.getElementById('create-office-registryPhoneNumber-label');

        if (!input.value) {
            setRegistryPhoneNumberValid(false);
        } else {
            label.textContent = 'Registry phone number';
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
        setStatus(e.target.value === 'true');
    };

    const isFormValid = cityValid && streetValid && houseNumberValid && registryPhoneNumberValid;

    async function handleCreateOfficeAsync() {
        const createOfficeModel = new OfficeModelRequest(city + " " + street + " " + houseNumber + ", " + officeNumber, registryPhoneNumber, status);

        console.log(file);
        await CreateOfficeFetchAsync(createOfficeModel);
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
            <section className="create-office-section">
                <h2>Main Title 2</h2>
                <button className="close-button" onClick={onClose}>X</button>
                <ul className="create-office-stage-progress">
                    {stages.map((stage, index) => (
                        <li key={index} className={index === currentStage ? "create-office-active-stage" : ""}>
                            {stage.title}
                        </li>
                    ))}
                </ul>
                <div className="create-office-form-wrapper">
                    <div className="create-office-form" style={{ transform: `translateX(-${currentStage * 100}%)` }}>
                        <div className='stage'>
                            <ImageUploader
                                imgPreview={imgPreview}
                                imgLoading={imgLoading}
                                uploadProgressPercent={uploadProgressPercent}
                                imgFileName={imgFileName}
                                imgFileType={imgFileType}

                                fileInputRef={fileInputRef}

                                imgDropZoonRef={imgDropZoonRef}
                                handleDragOverImg={handleDragOverImg}
                                handleDragLeaveImg={handleDragLeaveImg}
                                handleDropImg={handleDropImg}
                                handleButtonClickImg={handleButtonClickImg}
                                handleChangeImg={handleChangeImg}
                            />
                        </div>
                        <div className='stage'>
                            <div className="create-office-inputs">
                                <div className="create-office-input-wrapper">
                                    <input
                                        value={city}
                                        onBlur={handleCityBlur}
                                        onChange={handleCityChange}
                                        onInput={handleCityInput}
                                        type="text"
                                        name=""
                                        id="create-office-city-input"
                                        class="input default-input-border"
                                        placeholder=" "
                                        required />
                                    <label className="create-office-input-label" id="create-office-city-label">City</label>
                                </div>
                                <div className="create-office-input-wrapper">
                                    <input
                                        value={street}
                                        onBlur={handleStreetBlur}
                                        onChange={handleStreetChange}
                                        onInput={handleStreetInput}
                                        type="text"
                                        name=""
                                        id="create-office-street-input"
                                        class="input default-input-border"
                                        placeholder=" "
                                        required />
                                    <label className="create-office-input-label" id="create-office-street-label">Street</label>
                                </div>
                                <div className="create-office-input-wrapper">
                                    <input
                                        value={houseNumber}
                                        onBlur={handleHouseNumberBlur}
                                        onChange={handleHouseNumberChange}
                                        onInput={handleHouseNumberInput}
                                        type="text"
                                        name=""
                                        id="create-office-houseNumber-input"
                                        class="input default-input-border"
                                        placeholder=" "
                                        required />
                                    <label className="create-office-input-label" id="create-office-houseNumber-label">House number</label>
                                </div>
                                <div className="create-office-input-wrapper">
                                    <input
                                        value={officeNumber}
                                        //onBlur={handleOfficeNumberBlur}
                                        onChange={handleOfficeNumberChange}
                                        //onInput={handleOfficeNumberInput}
                                        type="text"
                                        name=""
                                        id="create-office-officeNumber-input"
                                        class="input default-input-border"
                                        placeholder=" "
                                        required />
                                    <label className="create-office-input-label" id="create-office-officeNumber-label">Office number</label>
                                </div>
                                <div className="create-office-input-wrapper">
                                    <input
                                        value={registryPhoneNumber}
                                        onBlur={handleRegistryPhoneNumberBlur}
                                        onChange={handleRegistryPhoneNumberChange}
                                        onInput={handleRegistryPhoneNumberInput}
                                        onKeyDown={handleRegistryPhoneNumberKeyDown}
                                        type="tel"
                                        name=""
                                        id="create-office-registryPhoneNumber-input"
                                        class="input default-input-border"
                                        placeholder=" "
                                        required />
                                    <label className="create-office-input-label" id="create-office-registryPhoneNumber-label">Registry phone number (+375(xx)xxx-xx-xx)</label>
                                </div>
                                <div className="office-info-card-input-wrapper">
                                    <input
                                        type="radio"
                                        name="Status"
                                        value={true}
                                        checked={status === true}
                                        onChange={handleStatusChange}
                                        id="create-office-status-input-true"
                                        className="office-info-card-radio-input"
                                    />
                                    <label htmlFor="create-office-status-input-true" className="office-info-card-radio-label">Active</label>

                                    <input
                                        type="radio"
                                        name="Status"
                                        value={false}
                                        checked={status === false}
                                        onChange={handleStatusChange}
                                        id="create-office-status-input-false"
                                        className="office-info-card-radio-input"
                                    />
                                    <label htmlFor="create-office-status-input-false" className="office-info-card-radio-label">Inactive</label>

                                    <label className="office-info-card-input-label" id="office-info-card-isActive-label">Status</label>
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
                            className={`primary-btn ${!isFormValid ? 'disabled-primary-btn' : ''}`}
                            onClick={handleCreateOfficeAsync}
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

export default CreateOfficeModal;
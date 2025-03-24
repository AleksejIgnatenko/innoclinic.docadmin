import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/organisms/Loader";
import ProfileCard from "../components/organisms/ProfileCard";
import { IconBase } from "../components/atoms/IconBase";
import { InputWrapper } from "../components/molecules/InputWrapper";
import useOfficeForm from "../hooks/useOfficeForm";
import GetOfficeByIdFetchAsync from "../api/Offices.API/GetOfficeByIdFetchAsync";
import GetPhotoByNameAsync from "../api/Documents.API/GetPhotoByNameAsync";
import ImageUploader from "../components/organisms/ImageUploader";
import CheckboxWrapper from "../components/molecules/CheckboxWrapper";
import '../styles/pages/Office.css';
import OfficeModelRequest from "../models/officeModels/OfficeModelRequest";
import UpdatePhotoFetchAsync from "../api/Documents.API/UpdatePhotoFetchAsync";
import UpdateOfficeFetchAsync from "../api/Offices.API/UpdateOfficeFetchAsync";

function Office() {
    const { id } = useParams();

    const [office, setOffice] = useState(null);
    const [photo, setPhoto] = useState(null);

    const [editingPhoto, setEditingPhoto] = useState(null);
    const { formData, setFormData, errors, handleChange, handleBlur, handleRegistryPhoneNumberKeyDown, isFormValid } = useOfficeForm({
        id: '',
        city: '',
        street: '',
        houseNumber: '',
        officeNumber: '',
        photoId: '',
        registryPhoneNumber: '+',
        status: false,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                if (id) {
                    const fetchedOffice = await GetOfficeByIdFetchAsync(id);
                    setFormData(fetchedOffice);
                    setOffice(fetchedOffice);

                    const fetchedPhoto = await GetPhotoByNameAsync(fetchedOffice.photoId);
                    setPhoto(fetchedPhoto);
                    setEditingPhoto(fetchedPhoto);
                }
            } catch (error) {
                console.error('Error fetching office:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleEditClick = () => {
        if (isEditing) {
            setFormData(office);
        }
        setIsEditing(!isEditing);
    };

    const handleCheckboxChange = (e) => {
        const value = e.target.value === 'true';
        console.log(value);

        setFormData(prev => ({
            ...prev,
            status: value,
        }));
    };

    async function handleUpdate() {
        setIsEditing(false);

        if((editingPhoto instanceof Blob)) {
            const imageUrl = URL.createObjectURL(editingPhoto);
            setPhoto(imageUrl)
            
            await UpdatePhotoFetchAsync(editingPhoto, formData.photoId);
        }

        const updateOfficeModel = new OfficeModelRequest(formData.city, formData.street, formData.houseNumber, formData.officeNumber,
            formData.photoId, formData.registryPhoneNumber, formData.status);

        setOffice(updateOfficeModel)

        await UpdateOfficeFetchAsync(office.id, updateOfficeModel);
    }

    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && (
                <ProfileCard>
                    <div className="profile-icon-container">
                        {isEditing ? (
                            <>
                                <IconBase name={"bx-check"} onClick={handleUpdate} style={{ cursor: 'pointer' }} />
                                <IconBase name={"bx-x"} onClick={toggleEditClick} />
                            </>

                        ) : (
                            <IconBase name={"bx-pencil"} onClick={toggleEditClick} style={{ cursor: 'pointer' }} />
                        )}
                    </div>
                    {isEditing ? (
                        <div class="img-container">
                            <ImageUploader
                                photo={photo}
                                setPhoto={setEditingPhoto}
                            />
                        </div>
                    ) : (
                        <div class="img-container">
                            <img src={photo} alt="" />
                        </div>
                    )}

                    {isEditing ? (
                        <div>
                            <InputWrapper
                                type="text"
                                label="City"
                                id="city"
                                value={formData.city}
                                onBlur={handleBlur('city')}
                                onChange={handleChange('city')}
                                required
                            />
                            <InputWrapper
                                type="text"
                                label="Street"
                                id="street"
                                value={formData.street}
                                onBlur={handleBlur('street')}
                                onChange={handleChange('street')}
                                required
                            />
                            <InputWrapper
                                type="text"
                                label="House Number"
                                id="houseNumber"
                                value={formData.houseNumber}
                                onBlur={handleBlur('houseNumber')}
                                onChange={handleChange('houseNumber')}
                                required
                            />
                            <InputWrapper
                                type="text"
                                label="Office Number"
                                id="officeNumber"
                                value={formData.officeNumber}
                                onBlur={handleBlur('officeNumber')}
                                onChange={handleChange('officeNumber')}
                                required
                            />
                            <InputWrapper
                                type="phone"
                                label="Registry Phone Number"
                                id="registryPhoneNumber"
                                value={formData.registryPhoneNumber}
                                onBlur={handleBlur('registryPhoneNumber')}
                                onChange={handleChange('registryPhoneNumber')}
                                onKeyDown={handleRegistryPhoneNumberKeyDown}
                                required
                            />
                            <CheckboxWrapper
                                type="radio"
                                label="Status active"
                                id="statusActive"
                                value={true}
                                checked={formData.status === true}
                                onChange={handleCheckboxChange}
                                required
                            />
                            <CheckboxWrapper
                                type="radio"
                                label="Status inactive"
                                id="statusInactive"
                                value={false}
                                checked={formData.status === false}
                                onChange={handleCheckboxChange}
                                required
                            />
                        </div>) : (
                        <div className="profile-content">
                            {office ? (
                                <>
                                    <p>City: {office.city}</p>
                                    <p>Street: {office.street}</p>
                                    <p>House Number: {office.houseNumber}</p>
                                    <p>Office Number: {office.officeNumber}</p>
                                    <p>Registry Phone Number: {office.registryPhoneNumber}</p>
                                    <p>Status: {office.status ? "Active" : "Inactive"}</p>
                                </>
                            ) : (
                                <p>No office information available</p>
                            )}
                        </div>
                    )}
                </ProfileCard>
            )}
        </>
    );
}

export default Office;
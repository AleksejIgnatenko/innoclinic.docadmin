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

function Office() {
    const { id } = useParams();

    const [office, setOffice] = useState(null);
    const [photo, setPhoto] = useState(null);

    const [editingPhoto, setEditingPhoto] = useState(null);
    const { formData, setFormData, errors, handleChange, handleBlur, handleRegistryPhoneNumberKeyDown, isFormValid } = useOfficeForm({
        city: '',
        street: '',
        houseNumber: '',
        officeNumber: '',
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

    async function handleUpdateOffice() {
        // setIsEditing(false);

        // const updateDoctorModel = new UpdateDoctorModelRequest(
        //     formData.firstName,
        //     formData.lastName,
        //     formData.middleName,
        //     formData.cabinetNumber,
        //     formData.dateOfBirth,
        //     formData.specializationId,
        //     formData.officeId,
        //     formData.careerStartYear,
        //     formData.status
        // );

        // await UpdateDoctorFetchAsync(doctor.id, updateDoctorModel);
    }

    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && (
                <ProfileCard>
                    <div className="profile-icon-container">
                        {isEditing ? (
                            <>
                                <IconBase name={"bx-check"} onClick={handleUpdateOffice} style={{cursor: 'pointer'}} />
                                <IconBase name={"bx-x"} onClick={toggleEditClick} />
                            </>

                        ) : (
                            <IconBase name={"bx-pencil"} onClick={toggleEditClick} style={{cursor: 'pointer'}} />
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
                        <div class="profile-content">
                            <p>City: {formData.city}</p>
                            <p>Street: {formData.street}</p>
                            <p>House Number: {formData.middleName}</p>
                            <p>Office Number: {formData.officeNumber}</p>
                            <p>Registry Phone Number: {formData.registryPhoneNumber}</p>
                            <p>Status: {formData.status}</p>
                        </div>
                    )}
                </ProfileCard>
            )}
        </>
    );
}

export default Office;
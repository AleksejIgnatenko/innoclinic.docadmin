import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useReceptionistForm from "../hooks/useReceptionistForm";
import GetReceptionistByIdFetchAsync from "../api/Profiles.API/GetReceptionistByIdFetchAsync";
import GetPhotoByNameAsync from "../api/Documents.API/GetPhotoByIdAsync";
import Loader from "../components/organisms/Loader";
import ProfileCard from "../components/organisms/ProfileCard";
import { IconBase } from "../components/atoms/IconBase";
import ImageUploader from "../components/organisms/ImageUploader";
import { InputWrapper } from "../components/molecules/InputWrapper";
import { SelectWrapper } from "../components/molecules/SelectWrapper";
import workStatuses from "../enums/WorkStatuses";
import GetAllOfficesFetchAsync from "../api/Offices.API/GetAllOfficesFetchAsync";
import CreatePhotoFetchAsync from "../api/Documents.API/CreatePhotoFetchAsync";
import AddImageInAccountFetchAsync from "../api/Authorization.API/AddImageInAccountFetchAsync";
import UpdatePhotoFetchAsync from "../api/Documents.API/UpdatePhotoFetchAsync";
import UpdateReceptionistFetchAsync from "../api/Profiles.API/UpdateReceptionistFetchAsync";

function Receptionist() {
    const { id } = useParams();

    const [receptionist, setReceptionist] = useState(null);
    const [photo, setPhoto] = useState(null);

    const [editingPhoto, setEditingPhoto] = useState(null);
    const { formData, setFormData, errors, handleChange, handleBlur, handleRegistryPhoneNumberKeyDown, resetForm, isFormValid } = useReceptionistForm({
        firstName: '',
        lastName: '',
        middleName: '',
        status: '',
        officeId: '',
        photoId: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [offices, setOffices] = useState([]);
    const [officeOptions, setOfficeOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                if (id) {
                    const fetchedReceptionist = await GetReceptionistByIdFetchAsync(id);
                    setReceptionist(fetchedReceptionist);

                    const formattedReceptionist = formatReceptionist(fetchedReceptionist);
                    setFormData(formattedReceptionist);

                    const fetchedOffices = await GetAllOfficesFetchAsync();
                    setOffices(fetchedOffices);
                    const officeOptions = fetchedOffices.map(({ id, city, street, houseNumber, officeNumber }) => ({
                        id,
                        value: `${city} ${street} ${houseNumber} ${officeNumber}`
                    }))
                    setOfficeOptions(officeOptions);

                    if (fetchedReceptionist.account.photoId) {
                        const fetchedPhoto = await GetPhotoByNameAsync(fetchedReceptionist.account.photoId);
                        setPhoto(fetchedPhoto);
                        setEditingPhoto(fetchedPhoto);
                    }
                }
            } catch (error) {
                console.error('Error fetching receptionist:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

    const formatReceptionist = (receptionist) => {
        const {
            id,
            firstName,
            lastName,
            middleName,
            status,
            office,
            account,
        } = receptionist;

        return {
            id,
            firstName,
            lastName,
            middleName,
            status,
            officeId: office.id,
            photoId: account.photoId,
        };
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleEditClick = () => {
        if (isEditing) {
            setFormData(receptionist);
        }
        setIsEditing(!isEditing);
    };

    async function handleUpdate() {
        setIsEditing(false);

        if (!receptionist.photoId && editingPhoto) {
            const photoId = await CreatePhotoFetchAsync(editingPhoto);
            formData.photoId = photoId;

            await AddImageInAccountFetchAsync(receptionist.account.id, photoId);
        } else if ((editingPhoto instanceof Blob)) {
            const imageUrl = URL.createObjectURL(editingPhoto);
            setPhoto(imageUrl)

            await UpdatePhotoFetchAsync(editingPhoto, receptionist.photoId);
        }

        console.log(formData);

        await UpdateReceptionistFetchAsync(receptionist.id, formData);
    }

    return (
        <>
            <Toolbar pageTitle="Receptionist" />
            {isLoading ? <Loader /> : (
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
                                label="First Name"
                                id="firstName"
                                value={formData.firstName}
                                onBlur={handleBlur('firstName')}
                                onChange={handleChange('firstName')}
                                required
                            />
                            <InputWrapper
                                type="text"
                                label="Last Name"
                                id="lastName"
                                value={formData.lastName}
                                onBlur={handleBlur('lastName')}
                                onChange={handleChange('lastName')}
                                required
                            />
                            <InputWrapper
                                type="text"
                                label="Middle Name"
                                id="middleName"
                                value={formData.middleName}
                                onBlur={handleBlur('middleName')}
                                onChange={handleChange('middleName')}
                                required
                            />
                            <SelectWrapper
                                label="Office"
                                id="office"
                                value={formData.officeId}
                                onBlur={handleBlur('officeId')}
                                onChange={handleChange('officeId')}
                                required
                                placeholder={formData.officeId ? "" : "Select office"}
                                options={officeOptions}
                            />
                            <SelectWrapper
                                label="Status"
                                id="status"
                                value={formData.status}
                                onBlur={handleBlur('status')}
                                onChange={handleChange('status')}
                                required
                                placeholder={formData.status ? formData.status : "Выберите статус"}
                                options={workStatuses}
                            />
                        </div>) : (
                        <div className="profile-content">
                            {receptionist ? (
                                <>
                                    <p>First Name: {receptionist.firstName}</p>
                                    <p>Last Name: {receptionist.lastName}</p>
                                    <p>Middle Name: {receptionist.middleName}</p>
                                    <p>Office: {`${receptionist.office.city} ${receptionist.office.street} ${receptionist.office.houseNumber} ${receptionist.office.officeNumber}`}</p>
                                    <p>Status: {receptionist.status}</p>
                                </>
                            ) : (
                                <p>No receptionist information available</p>
                            )}
                        </div>
                    )}
                </ProfileCard>
            )}
        </>
    );
}

export default Receptionist;
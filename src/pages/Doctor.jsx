import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/organisms/Loader";
import ProfileCard from "../components/organisms/ProfileCard";
import { IconBase } from "../components/atoms/IconBase";
import useDoctorForm from "../hooks/useDoctorForm";
import { InputWrapper } from "../components/molecules/InputWrapper";
import { SelectWrapper } from "../components/molecules/SelectWrapper";
import workStatuses from "../enums/WorkStatuses";

import GetAllSpecializationFetchAsync from "../api/Services.API/GetAllSpecializationFetchAsync";
import GetAllOfficesFetchAsync from "../api/Offices.API/GetAllOfficesFetchAsync";
import GetDoctorByIdFetchAsync from "../api/Profiles.API/GetDoctorByIdFetchAsync";

import UpdateDoctorFetchAsync from "../api/Profiles.API/UpdateDoctorFetchAsync";
import GetPhotoByIdAsync from "../api/Documents.API/GetPhotoByIdAsync";
import ImageUploader from "../components/organisms/ImageUploader";
import UpdatePhotoFetchAsync from "../api/Documents.API/UpdatePhotoFetchAsync";
import CreatePhotoFetchAsync from "../api/Documents.API/CreatePhotoFetchAsync";
import Toolbar from "../components/organisms/Toolbar";
import GetDoctorByAccountIdFromTokenFetchAsync from "../api/Profiles.API/GetDoctorByAccountIdFromTokenFetchAsync";

function Doctor() {
    const { id } = useParams();

    const [doctor, setDoctor] = useState(null);
    const [specializations, setSpecializations] = useState([]);
    const [offices, setOffices] = useState([]);
    const [officeOptions, setOfficeOptions] = useState([]);

    const [photo, setPhoto] = useState(null);
    const [editingPhoto, setEditingPhoto] = useState(null);

    const [filteredSpecializations, setFilteredSpecializations] = useState([]);

    const [selectSpecializationName, setSelectSpecializationName] = useState('');

    const { formData, setFormData, errors, setErrors, handleChange, handleBlur, isFormValid } = useDoctorForm({
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: '',
        specializationId: '',
        officeId: '',
        cabinetNumber: '',
        careerStartYear: '',
        status: '',
        photoId: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        try {
            toggleLoader(true);
            errors.email = true;

            const fetchedSpecializations = await GetAllSpecializationFetchAsync();
            setSpecializations(fetchedSpecializations);

            const fetchedOffices = await GetAllOfficesFetchAsync();
            setOffices(fetchedOffices);

            const officeOptions = fetchedOffices.map(({ id, city, street, houseNumber, officeNumber }) => ({
                id,
                value: `${city} ${street} ${houseNumber} ${officeNumber}`
            }))
            setOfficeOptions(officeOptions);

            let fetchedDoctor;
            if (id) {
                fetchedDoctor = await GetDoctorByIdFetchAsync(id);
                setDoctor(fetchedDoctor);
            } else {
                fetchedDoctor = await GetDoctorByAccountIdFromTokenFetchAsync();
                setDoctor(fetchedDoctor);
            }

            const formattedDocto = formatDoctor(fetchedDoctor);
            setFormData(formattedDocto);

            setSelectSpecializationName(fetchedSpecializations.find(spec => spec.id === fetchedDoctor.specialization.id)?.specializationName || '');

            if (fetchedDoctor.account.photoId) {
                const fetchedPhoto = await GetPhotoByIdAsync(fetchedDoctor.account.photoId);
                setPhoto(fetchedPhoto);
                setEditingPhoto(fetchedPhoto);
            }

        } catch (error) {
            console.error('Error fetching doctor:', error);
        } finally {
            toggleLoader(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatDoctor = (doctor) => {
        const {
            id,
            firstName,
            lastName,
            middleName,
            dateOfBirth,
            email,
            specialization,
            office,
            cabinetNumber,
            careerStartYear,
            status,
            photoId
        } = doctor;

        return {
            id,
            firstName,
            lastName,
            middleName,
            dateOfBirth,
            email,
            specializationId: specialization.id,
            officeId: office.id,
            cabinetNumber,
            careerStartYear,
            status,
            photoId,
        };
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleEditClick = () => {
        if (isEditing) {
            const confirmCancel = window.confirm("Do you really want to cancel? Changes will not be saved.");
            if (!confirmCancel) {
                return;
            }
            setFormData(doctor);
        }
        setErrors({
            firstName: true,
            lastName: true,
            middleName: true,
            dateOfBirth: true,
            email: true,
            specializationId: true,
            officeId: true,
            careerStartYear: true,
            status: true,
            photoId: true,
        });
        setIsEditing(!isEditing);
    };

    const handleSpecializationSelect = (specialization) => {
        formData.specializationId = specialization.id;
        setFilteredSpecializations([]);
        setSelectSpecializationName(specialization.specializationName);
        errors.specializationId = true;
    };

    const handleSpecializationChange = (value) => {
        if (value === '') {
            setFilteredSpecializations([]);
        } else {
            const filtered = specializations.filter(spec => spec.specializationName.toLowerCase().includes(value.toLowerCase()));
            setFilteredSpecializations(filtered);
        }
        setSelectSpecializationName(value);
    };

    async function handleUpdate() {
        setIsEditing(false);

        let photoId = '';
        if (!doctor.account.photoId && editingPhoto) {
            photoId = await CreatePhotoFetchAsync(editingPhoto);

            setPhoto(editingPhoto);
        } else if ((editingPhoto instanceof Blob)) {
            const imageUrl = URL.createObjectURL(editingPhoto);
            setPhoto(imageUrl)

            await UpdatePhotoFetchAsync(editingPhoto, doctor.account.photoId);
        }

        const updateDoctorRequest = {
            firstName: formData.firstName, 
            lastName: formData.lastName, 
            middleName: formData.middleName,
            cabinetNumber: formData.cabinetNumber, 
            dateOfBirth: formData.dateOfBirth, 
            email: formData.email, 
            specializationId: formData.specializationId, 
            officeId: formData.officeId,
            careerStartYear: formData.careerStartYear, 
            status: formData.status, 
            photoId: doctor.account.photoId ? doctor.account.photoId : photoId,
        }

        await UpdateDoctorFetchAsync(doctor.id, updateDoctorRequest);
        fetchData();
    }

    return (
        <>
            <Toolbar pageTitle="Doctor" />
            {isLoading ? <Loader /> : (
                <ProfileCard>
                    <div className="profile-icon-container">
                        {isEditing ? (
                            <>
                                <IconBase
                                    name={"bx-check"}
                                    onClick={isFormValid ? handleUpdate : null}
                                    style={{ cursor: isFormValid ? 'pointer' : 'not-allowed' }}
                                    className={isFormValid ? '' : 'icon-invalid'}
                                />
                                <IconBase name={"bx-x"} onClick={toggleEditClick} />
                            </>

                        ) : (
                            <IconBase name={"bx-pencil"} onClick={toggleEditClick} />
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
                           <img src={photo} alt="" className={photo ? '' : 'img-area'} />
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
                                onBlur={handleBlur('middleName', false)}
                                onChange={handleChange('middleName', false)}
                                required
                            />
                            <InputWrapper
                                type="date"
                                label="Date Of Birth"
                                id="dateOfBirth"
                                value={formData.dateOfBirth}
                                onBlur={handleBlur('dateOfBirth')}
                                onChange={handleChange('dateOfBirth')}
                                required
                            />
                            <div>
                                <InputWrapper
                                    type="text"
                                    label="Specialization"
                                    id="specialization"
                                    value={selectSpecializationName}
                                    onChange={(e) => handleSpecializationChange(e.target.value)}
                                    onBlur={handleBlur('specialization')}
                                    required
                                />
                                {filteredSpecializations.length > 0 && (
                                    <div className="filtred-list">
                                        {filteredSpecializations.map(specialization => (
                                            <h5 key={specialization.id} onClick={() => handleSpecializationSelect(specialization)}>
                                                {specialization.specializationName}
                                            </h5>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <SelectWrapper
                                label="Office"
                                id="office"
                                value={formData.officeId}
                                onBlur={handleBlur('officeId')}
                                onChange={handleChange('officeId')}
                                required
                                placeholder={formData.officeId ? "" : "Выберите офис"}
                                options={officeOptions}
                            />
                            <InputWrapper
                                type="number"
                                label="Cabinet Number"
                                id="cabinetNumber"
                                value={formData.cabinetNumber}
                                onBlur={handleBlur('cabinetNumber')}
                                onChange={handleChange('cabinetNumber')}
                                required
                            />
                            <InputWrapper
                                type="date"
                                label="Career Start Year"
                                id="careerStartYear"
                                value={formData.careerStartYear}
                                onBlur={handleBlur('careerStartYear')}
                                onChange={handleChange('careerStartYear')}
                                required
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
                        <div class="profile-content">
                            <p>First name: {formData.firstName}</p>
                            <p>Last name: {formData.lastName}</p>
                            <p>Middle name: {formData.middleName}</p>
                            <p>Cabinet number: {formData.cabinetNumber}</p>
                            <p>Date of birth: {formData.dateOfBirth}</p>
                            <p>Specialization: {specializations.find(spec => spec.id === formData.specializationId)?.specializationName || ''}</p>
                            <p>Office: {offices.find(office => office.id === formData.officeId)?.city} {offices.find(office => office.id === formData.officeId)?.street} {offices.find(office => office.id === formData.officeId)?.houseNumber} {offices.find(office => office.id === formData.officeId)?.officeNumber}</p>
                            <p>Career start year: {formData.careerStartYear}</p>
                            <p>Status: {formData.status}</p>
                        </div>
                    )}
                </ProfileCard>
            )}
        </>
    );
}

export default Doctor;
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
import GetDoctorByAccountIdFromTokenFetchAsync from "../api/Profiles.API/GetDoctorByAccountIdFromTokenFetchAsync";
import UpdateDoctorModelRequest from "../models/doctorModels/UpdateDoctorModelRequest";
import UpdateDoctorFetchAsync from "../api/Profiles.API/UpdateDoctorFetchAsync";

function Doctor() {
    const { id } = useParams();

    const [doctor, setDoctor] = useState(null);
    const [specializations, setSpecializations] = useState([]);
    const [offices, setOffices] = useState([]);
    const [officeOptions, setOfficeOptions] = useState([]);

    const [filteredSpecializations, setFilteredSpecializations] = useState([]);

    const [selectSpecializationName, setSelectSpecializationName] = useState('');

    const { formData, errors, handleChange, handleBlur, resetForm, mapDoctorData, isFormValid } = useDoctorForm({
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: '',
        email: '',
        specializationId: '',
        officeId: '',
        careerStartYear: '',
        status: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
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
                    if (fetchedDoctor) {
                        mapDoctorData(fetchedDoctor);
                        setDoctor(fetchedDoctor);
                    }
                } else {
                    fetchedDoctor = await GetDoctorByAccountIdFromTokenFetchAsync();
                    if (fetchedDoctor) {
                        mapDoctorData(fetchedDoctor);
                        setDoctor(fetchedDoctor);
                    }
                }
                setSelectSpecializationName(fetchedSpecializations.find(spec => spec.id === fetchedDoctor.specialization.id)?.specializationName || '');

            } catch (error) {
                console.error('Error fetching doctor:', error);
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

    async function handleUpdateDoctor() {
        setIsEditing(false);
    
        const updateDoctorModel = new UpdateDoctorModelRequest(
            formData.firstName,
            formData.lastName,
            formData.middleName,
            formData.cabinetNumber,
            formData.dateOfBirth,
            formData.specializationId,
            formData.officeId,
            formData.careerStartYear,
            formData.status
        );
    
        await UpdateDoctorFetchAsync(doctor.id, updateDoctorModel);
    }

    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && (
                <ProfileCard>
                    <div className="profile-icon-container">
                        {isEditing ? (
                            <>
                                <IconBase name={"bx-check"} onClick={handleUpdateDoctor}/>
                                <IconBase name={"bx-x"} onClick={toggleEditClick} />
                            </>

                        ) : (
                            <IconBase name={"bx-pencil"} onClick={toggleEditClick} />
                        )}
                    </div>
                    <div class="profile-img">
                        <img src="https://th.bing.com/th/id/OIP.audMX4ZGbvT2_GJTx2c4GgAAAA?rs=1&pid=ImgDetMain" alt="" />
                    </div>
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
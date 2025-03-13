import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/organisms/Loader";
import ProfileCard from "../components/organisms/ProfileCard";
import { IconBase } from "../components/atoms/IconBase";
import useDoctorForm from "../hooks/useDoctorForm";
import { InputWrapper } from "../components/molecules/InputWrapper";
import { SelectWrapper } from "../components/molecules/SelectWrapper";
import workStatuses from "../enums/WorkStatuses";

function Doctor() {
    const { id } = useParams();

    const [doctor, setDoctor] = useState(null);
    const [specializations, setSpecializations] = useState([]);
    const [offices, setOffices] = useState([]);
    const [officeOptions, setOfficeOptions] = useState([]);

    const [filteredSpecializations, setFilteredSpecializations] = useState([]);

    const [selectSpecializationName, setSelectSpecializationName] = useState('');

    const { formData, errors, handleChange, handleBlur, resetForm, isFormValid } = useDoctorForm({
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

                const fetchedSpecializations = [
                    {
                        "id": "fb5d2407-8f2a-4b64-b65e-bf605da77140",
                        "specializationName": "postman",
                        "isActive": true
                    },
                    {
                        "id": "fb5d2407-8f2a-4b64-b65e-bf605da77141",
                        "specializationName": "postman1",
                        "isActive": true
                    },
                    {
                        "id": "fb5d2407-8f2a-4b64-b65e-bf605da77142",
                        "specializationName": "postman2",
                        "isActive": true
                    }
                ]
                setSpecializations(fetchedSpecializations);

                const fetchedOffices = [
                    {
                        "id": "eb2f16f7-b057-458b-832e-76bad03a178a",
                        "city": "Гомель",
                        "street": "пушкина",
                        "houseNumber": "3",
                        "officeNumber": "",
                        "longitude": "52.43014",
                        "latitude": "31.013527",
                        "photoId": "00000000-0000-0000-0000-000000000000",
                        "registryPhoneNumber": "+375(00)000-00-00",
                        "isActive": true
                    },
                    {
                        "id": "788b5223-8e80-4a30-8744-639e5e80e3ad",
                        "city": "Минск",
                        "street": "Победы",
                        "houseNumber": "1",
                        "officeNumber": "",
                        "longitude": "53.927103",
                        "latitude": "27.536687",
                        "photoId": "00000000-0000-0000-0000-000000000000",
                        "registryPhoneNumber": "+375(00)000-00-00",
                        "isActive": false
                    },
                    {
                        "id": "d324b5a6-4b90-4121-8270-4a18f17bd0ff",
                        "city": "Минск",
                        "street": "Победы",
                        "houseNumber": "1",
                        "officeNumber": "",
                        "longitude": "53.927103",
                        "latitude": "27.536687",
                        "photoId": "00000000-0000-0000-0000-000000000000",
                        "registryPhoneNumber": "+375(00)000-00-00",
                        "isActive": true
                    },
                    {
                        "id": "99601714-8256-489a-a33c-5ec08e1ffc1e",
                        "city": "Минск",
                        "street": "Победы",
                        "houseNumber": "2",
                        "officeNumber": "",
                        "longitude": "53.926913",
                        "latitude": "27.535717",
                        "photoId": "00000000-0000-0000-0000-000000000000",
                        "registryPhoneNumber": "+375(00)000-00-00",
                        "isActive": true
                    }
                ]
                setOffices(fetchedOffices);
                const officeOptions = fetchedOffices.map(({ id, city, street, houseNumber, officeNumber }) => ({
                    id,
                    value: `${city} ${street} ${houseNumber} ${officeNumber}`
                }))
                setOfficeOptions(officeOptions);

                formData.firstName = 'Иванов';
                formData.lastName = 'Ивано';
                formData.middleName = 'Иванович';
                formData.dateOfBirth = '2025-01-01';
                formData.email = 'ivanov@gmail.com';
                formData.specializationId = 'fb5d2407-8f2a-4b64-b65e-bf605da77140';
                formData.officeId = '99601714-8256-489a-a33c-5ec08e1ffc1e';
                formData.cabinetNumber = '1';
                formData.careerStartYear = '2025-01-01';
                formData.status = 'Sick Day';

                setSelectSpecializationName(specializations.find(spec => spec.id === formData.specializationId)?.specializationName || '');

                if (id) {
                    //const fetchDoctor = await GetDoctorByIdFetchAsync(id);
                    //setDoctor(fetchDoctor);

                } else {
                    //const fetchDoctor = await GetDoctorByAccountIdFromTokenFetchAsync();
                    //setDoctor(fetchDoctor);
                }

                //const fetchedSpecializations = await GetAllSpecializationFetchAsync();
                //setSpecializations(fetchedSpecializations);

                //const fetchedOffices = await GetAllOfficesFetchAsync();
                //setOffices(fetchedOffices);

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

    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && (
                <ProfileCard
                    doctor={doctor}
                    specializations={specializations}
                    offices={offices}
                >
                    <div className="profile-icon-container">
                        {isEditing ? (
                            <>
                                <IconBase name={"bx-check"} />
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
                            <InputWrapper
                                type="email"
                                label="Email"
                                id="email"
                                value={formData.email}
                                onBlur={handleBlur('email')}
                                onChange={handleChange('email')}
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
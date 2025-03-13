import { useEffect, useState } from "react";
import Toolbar from '../components/organisms/Toolbar';
import Loader from '../components/organisms/Loader';
import Table from '../components/organisms/Table';
import { ButtonBase } from '../components/atoms/ButtonBase';
import FormModal from "../components/organisms/FormModal";
import { InputWrapper } from "../components/molecules/InputWrapper";
import ImageUploader from "../components/organisms/ImageUploader";
import 'boxicons/css/boxicons.min.css';
import useDoctorForm from "../hooks/useDoctorForm";
import '../styles/pages/Doctors.css';
import { SelectWrapper } from "../components/molecules/SelectWrapper";
import workStatuses from "../enums/WorkStatuses";
import FilterModal from "../components/organisms/FilterModal";
import CheckboxWrapper from "../components/molecules/CheckboxWrapper";

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [editableDoctors, setEditableDoctors] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [offices, setOffices] = useState([]);
    const [officeOptions, setOfficeOptions] = useState([]);

    const [filteredSpecializations, setFilteredSpecializations] = useState([]);

    const [selectSpecializationName, setSelectSpecializationName] = useState('');

    const [image, setImage] = useState(null);

    const { formData, errors, handleChange, handleBlur, resetForm, isFormValid } = useDoctorForm({
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: '',
        email: '',
        specializationId: '',
        officeId: '',
        cabinetNumber: '',
        careerStartYear: '',
        status: '',
    });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [selectedOffices, setSelectedOffices] = useState([]);
    const [selectedSpecializations, setSelectedSpecializations] = useState([]);

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

                //const fetchedOffices = await GetAllOfficesFetchAsync();
                const fetchedDoctors =
                    [
                        {
                            "id": "3c0985c6-4ddb-40a2-a3b3-7bc1048952c7",
                            "firstName": "Иванов",
                            "lastName": "Иван",
                            "middleName": "Иванович",
                            "cabinetNumber": 1,
                            "dateOfBirth": "2025-01-01",
                            "account": {
                                "id": "0821e73d-0163-444c-899a-940bfdc2311b",
                                "email": "test@gmail.com",
                                "password": "$2a$10$qllL3oCqCK2V8I3J9SmInOdzmtVAA7bB/92C2sikVPsH36Dr2B.x.",
                                "phoneNumber": "",
                                "role": 1
                            },
                            "specialization": {
                                "id": "fb5d2407-8f2a-4b64-b65e-bf605da77140",
                                "specializationName": "postman",
                                "isActive": true
                            },
                            "office": {
                                "id": "eb2f16f7-b057-458b-832e-76bad03a178a",
                                "city": "Гомель",
                                "street": "пушкина",
                                "houseNumber": "3",
                                "officeNumber": "",
                                "photoId": "00000000-0000-0000-0000-000000000000",
                                "registryPhoneNumber": "+375(00)000-00-00",
                                "isActive": true
                            },
                            "careerStartYear": "2025-01-01",
                            "status": "At work"
                        },
                        {
                            "id": "e45d3e6c-9f7a-4d29-b5d3-9c3a2a7c2e0e",
                            "firstName": "Петров",
                            "lastName": "Петр",
                            "middleName": "Петрович",
                            "cabinetNumber": 2,
                            "dateOfBirth": "2024-05-15",
                            "account": {
                                "id": "d1234567-89ab-cdef-0123-456789abcdef",
                                "email": "petr@gmail.com",
                                "password": "$2a$10$qllL3oCqCK2V8I3J9SmInOdzmtVAA7bB/92C2sikVPsH36Dr2B.x.",
                                "phoneNumber": "+375(29)123-45-67",
                                "role": 2
                            },
                            "specialization": {
                                "id": "fa5d2407-8f2a-4b64-b65e-bf605da77141",
                                "specializationName": "developer",
                                "isActive": true
                            },
                            "office": {
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
                            "careerStartYear": "2023-09-01",
                            "status": "On leave"
                        },
                        {
                            "id": "c7b3d0f1-4e3b-4c8d-bf60-3e22f8c7f8c5",
                            "firstName": "Сидоров",
                            "lastName": "Сидор",
                            "middleName": "Сидорович",
                            "cabinetNumber": 3,
                            "dateOfBirth": "1990-08-20",
                            "account": {
                                "id": "c2345678-9abc-def0-1234-56789abcdef0",
                                "email": "sidor@gmail.com",
                                "password": "$2a$10$qllL3oCqCK2V8I3J9SmInOdzmtVAA7bB/92C2sikVPsH36Dr2B.x.",
                                "phoneNumber": "+375(33)765-43-21",
                                "role": 3
                            },
                            "specialization": {
                                "id": "fb5d2407-8f2a-4b64-b65e-bf605da77142",
                                "specializationName": "manager",
                                "isActive": true
                            },
                            "office": {
                                "id": "cb2f16f7-b057-458b-832e-76bad03a178c",
                                "city": "Брест",
                                "street": "Советская",
                                "houseNumber": "10",
                                "officeNumber": "202",
                                "photoId": "00000000-0000-0000-0000-000000000002",
                                "registryPhoneNumber": "+375(44)123-45-67",
                                "isActive": true
                            },
                            "careerStartYear": "2015-01-15",
                            "status": "At work"
                        }
                    ]
                setDoctors(fetchedDoctors);

                const formattedDoctors = formatDoctors(fetchedDoctors);
                setEditableDoctors(formattedDoctors);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filteredDoctors = doctors.filter(item => {
            return (
                item.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.middleName.toLowerCase().includes(lowerCaseSearchTerm)
            );
        })

        const formattedDoctors = formatDoctors(filteredDoctors);

        setEditableDoctors(formattedDoctors);
    }, [searchTerm, doctors]);

    const formatDoctors = (doctors) => {
        return doctors.map(({ id, firstName, lastName, middleName, specialization, status, dateOfBirth, office }) => ({
            id,
            fullName: `${firstName} ${lastName} ${middleName}`,
            specialization: specialization.specializationName,
            status,
            dateOfBirth,
            address: `${office.city} ${office.street} ${office.houseNumber} ${office.officeNumber}`,
        }));
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleAddModalClick = () => {
        setIsAddModalOpen((prev) => {
            const newState = !prev;
            if (!newState) {
                resetForm();
            }
            return newState;
        });
    };

    const toggleFilterModalClick = () => {
        setIsFilterModalOpen(!isFilterModalOpen);
    }

    const handleSpecializationChange = (value) => {
        if (value === '') {
            setFilteredSpecializations([]);
        } else {
            const filtered = specializations.filter(spec => spec.specializationName.toLowerCase().includes(value.toLowerCase()));
            setFilteredSpecializations(filtered);
        }
        setSelectSpecializationName(value);
    };

    const handleSpecializationSelect = (specialization) => {
        formData.specializationId = specialization.id;
        setFilteredSpecializations([]);
        setSelectSpecializationName(specialization.specializationName);
        errors.specializationId = true;
    };

    const handleFilterOfficeChange = (office) => {
        setSelectedOffices(prevSelectedOffices => {
            if (prevSelectedOffices.some(selectedOffice => selectedOffice.id === office.id)) {
                return prevSelectedOffices.filter(selectedOffice => selectedOffice.id !== office.id);
            } else {
                return [...prevSelectedOffices, office];
            }
        });
    };

    const handleFilterSpecializationChange = (specialization) => {
        setSelectedSpecializations(prevSelectedSpecializations => {
            if (prevSelectedSpecializations.some(selectedSpecialization => selectedSpecialization.id === specialization.id)) {
                return prevSelectedSpecializations.filter(selectedSpecialization => selectedSpecialization.id !== specialization.id);
            } else {
                return [...prevSelectedSpecializations, specialization];
            }
        });
    };

    const handleApplyFilter = () => {
        const filteredDoctors = doctors.filter(doctor =>
            selectedOffices.some(selectedOffice => selectedOffice.id === doctor.office.id) ||
            selectedSpecializations.some(selectedSpecialization => selectedSpecialization.id === doctor.specialization.id)
        );
        const formattedDoctors = formatDoctors(filteredDoctors);
        setEditableDoctors(formattedDoctors);
        setIsFilterModalOpen(!isFilterModalOpen);
    };

    const handleClearFilter = () => {
        const formattedDoctors = formatDoctors(doctors);
        setEditableDoctors(formattedDoctors);
        setSelectedOffices([]);
        setSelectedSpecializations([]);
        setIsFilterModalOpen(!isFilterModalOpen);
    }

    const handleAdd = (e) => {
        e.preventDefault();
        console.log(formData);
    }

    return (
        <>
            <Toolbar
                pageTitle="Doctors"
                setSearchTerm={setSearchTerm}
                showAddIcon={true}
                toggleCreateModalClick={toggleAddModalClick}
                showFilterIcon={true}
                toggleFilterModalClick={toggleFilterModalClick}
            />
            {isLoading ? (<Loader />
            ) : (
                <div className="page">
                    {doctors.length === 0 ? (
                        <p className="no-items">Doctors not found</p>
                    ) : (
                        <>
                            {editableDoctors.length === 0 && (
                                <p className="no-items">Nothing was found</p>
                            )}
                            {editableDoctors.length > 0 && (
                                <div className="table">
                                    <Table
                                        items={editableDoctors}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {isAddModalOpen && (
                        <FormModal title="Add doctor" onClose={toggleAddModalClick} onSubmit={handleAdd} showCloseButton={true}>
                            <div className="modal-inputs">
                                <ImageUploader
                                    setImage={setImage}
                                />
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
                            </div>
                            <div className="form-actions">
                                <ButtonBase type="submit" disabled={!isFormValid}>
                                    Confirm
                                </ButtonBase>
                                <ButtonBase variant="secondary" onClick={toggleAddModalClick}>
                                    Cancel
                                </ButtonBase>
                            </div>
                        </FormModal>
                    )}

                    {isFilterModalOpen && (
                        <FilterModal onClose={() => setIsFilterModalOpen(false)}>
                            <div className="filter-section">
                                <h2 className="filter-modal-title">Offices</h2>
                                <div className="filter-checkbox-container">
                                    {offices.map(office => (
                                        <div className="filter-checkbox-group" key={office.id}>
                                            <CheckboxWrapper
                                                id={office.id}
                                                name="office-address"
                                                value={office.address}
                                                checked={selectedOffices.some(selectedOffice => selectedOffice.id === office.id)}
                                                onChange={() => handleFilterOfficeChange(office)}
                                                label={office.city}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="filter-section">
                                <h2 className="filter-modal-title">Specializations</h2>
                                <div className="filter-checkbox-container">
                                    {specializations.map(specialization => (
                                        <div className="filter-checkbox-group" key={specialization.id}>
                                            <CheckboxWrapper
                                                id={specialization.id}
                                                name="specialization-name"
                                                value={specialization.specializationName}
                                                checked={selectedSpecializations.some(selectedSpecialization => selectedSpecialization.id === specialization.id)}
                                                onChange={() => handleFilterSpecializationChange(specialization)}
                                                label={specialization.specializationName}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="form-actions">
                                <ButtonBase type="button" onClick={handleApplyFilter}>
                                    Apply
                                </ButtonBase>
                                <ButtonBase type="button" variant="secondary" onClick={handleClearFilter}>
                                    Clear
                                </ButtonBase>
                            </div>
                        </FilterModal>
                    )}
                </div>
            )}
        </>
    );
} 
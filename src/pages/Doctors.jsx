import { useEffect, useRef, useState } from "react";
import Toolbar from '../components/organisms/Toolbar';
import Loader from '../components/organisms/Loader';
import Table from '../components/organisms/Table';
import { ButtonBase } from '../components/atoms/ButtonBase';
import FormModal from "../components/organisms/FormModal";
import { InputWrapper } from "../components/molecules/InputWrapper";
import ImageUploader from "../components/organisms/ImageUploader";
import 'boxicons/css/boxicons.min.css';
import useDoctorForm from "../hooks/useDoctorForm";

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [offices, setOffices] = useState([]);
    const [specializations, setSpecializations] = useState([]);

    const [editableDoctors, setEditableDoctors] = useState([]);

    const [image, setImage] = useState(null);

    const { formData, errors, handleChange, handleBlur, isFormValid } = useDoctorForm({
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

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

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
                        "id": "ab3f16f7-b057-458b-832e-76bad03a178b",
                        "city": "Минск",
                        "street": "Ленина",
                        "houseNumber": "5",
                        "officeNumber": "101",
                        "photoId": "00000000-0000-0000-0000-000000000001",
                        "registryPhoneNumber": "+375(29)987-65-43",
                        "isActive": true
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

                const formattedData = fetchedDoctors.map(({ id, firstName, lastName, middleName, specialization, status, dateOfBirth, office }) => ({
                    id,
                    fullName: `${firstName} ${lastName} ${middleName}`,
                    specialization: specialization.specializationName,
                    status,
                    dateOfBirth,
                    address: office.city + " " + office.street + " " + office.houseNumber + " " + office.officeNumber,
                }));

                setEditableDoctors(formattedData);
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
        const filtered = doctors.filter(item => {
            return (
                item.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.middleName.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }).map(({ id, firstName, lastName, middleName, specialization, status, dateOfBirth, office }) => ({
            id,
            fullName: `${firstName} ${lastName} ${middleName}`,
            specialization: specialization.specializationName,
            status,
            dateOfBirth,
            address: office.city + " " + office.street + " " + office.houseNumber + " " + office.officeNumber,
        }));

        setEditableDoctors(filtered);
    }, [searchTerm, doctors]);


    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleAddModal = () => {
        setIsAddModalOpen(!isAddModalOpen);
    };

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
                toggleCreateModalClick={toggleAddModal}
                showFilterIcon={true}
            />
            {isLoading && <Loader />}
            {!isLoading && (
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
                        <FormModal title="Add doctor" onClose={toggleAddModal} onSubmit={handleAdd} showCloseButton={true}>
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
                                <InputWrapper
                                    type="text"
                                    label="Specialization"
                                    id="specialization"
                                    value={formData.specialization}
                                    onBlur={handleBlur('specialization')}
                                    onChange={handleChange('specialization')}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Office"
                                    id="office"
                                    value={formData.office}
                                    onBlur={handleBlur('office')}
                                    onChange={handleChange('office')}
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
                                <InputWrapper
                                    type="text"
                                    label="Status"
                                    id="status"
                                    value={formData.status}
                                    onBlur={handleBlur('status')}
                                    onChange={handleChange('status')}
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <ButtonBase type="submit" disabled={!isFormValid}>
                                    Confirm
                                </ButtonBase>
                                <ButtonBase variant="secondary" onClick={toggleAddModal}>
                                    Cancel
                                </ButtonBase>
                            </div>
                        </FormModal>
                    )}
                </div>
            )}
        </>
    );
} 
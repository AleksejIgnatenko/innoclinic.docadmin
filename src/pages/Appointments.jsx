import { useEffect, useState } from "react";
import Toolbar from '../components/organisms/Toolbar';
import Loader from '../components/organisms/Loader';
import Table from '../components/organisms/Table';
import { ButtonBase } from '../components/atoms/ButtonBase';
import 'boxicons/css/boxicons.min.css';
import '../styles/pages/Doctors.css';
import FilterModal from "../components/organisms/FilterModal";
import CheckboxWrapper from "../components/molecules/CheckboxWrapper";
import Calendar from "../components/organisms/Calendar";

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [editableAppointments, setEditableAppointments] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [medicalServices, setMedicalServices] = useState([]);
    const [offices, setOffices] = useState([]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDoctors, setSelectedDoctors] = useState([]);
    const [selectedMedicalServices, setSelectedMedicalServices] = useState([]);
    const [selectedIsApproved, setSelectedIsApproved] = useState(null);
    const [selectedOffices, setSelectedOffices] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedAccounts = [
                    {
                      "id": "bf16e2e6-f8c2-4e1e-bd81-014af19ce0db",
                      "email": "aliaksei.ihnatsenka@innowise.com",
                      "password": "$2a$10$rWRYpm.fVldi0flL6dKPB.aVbOM4Qc1xfY7e4Q7hs3W7Tjc1OT41m",
                      "phoneNumber": "",
                      "role": "Doctor",
                      "isEmailVerified": true,
                      "photoId": "00000000-0000-0000-0000-000000000000",
                      "createBy": "Receptionist",
                      "createAt": "2025-03-13T07:00:54.1251673",
                      "updateBy": "",
                      "updateAt": "0001-01-01T00:00:00"
                    },
                    {
                      "id": "d7144e1d-2ab3-4153-8026-355dcebdcae6",
                      "email": "lehaignatenko989@gmail.com",
                      "password": "$2a$10$Rx6WPRhJjO4IutUIODYeF.VbS1Z0o8WPEqg27p23pkPkqSHgU3rei",
                      "phoneNumber": "+375(00)000-00-00",
                      "role": "Patient",
                      "isEmailVerified": true,
                      "photoId": "00000000-0000-0000-0000-000000000000",
                      "createBy": "Patient",
                      "createAt": "2025-03-13T06:54:25.5174084",
                      "updateBy": "",
                      "updateAt": "0001-01-01T00:00:00"
                    },
                    {
                      "id": "b3f51cf4-4a5d-483d-a72b-798243d938e2",
                      "email": "aliaksei.ihnatsenka@innowise.com",
                      "password": "$2a$10$NP3cGZ/43tkfkHCnbgVHpu7PPbE4Q3D3Vo/7Iw5Xoe8LREUf1xLEy",
                      "phoneNumber": "",
                      "role": "Doctor",
                      "isEmailVerified": true,
                      "photoId": "00000000-0000-0000-0000-000000000000",
                      "createBy": "Receptionist",
                      "createAt": "2025-03-13T07:01:02.9357652",
                      "updateBy": "",
                      "updateAt": "0001-01-01T00:00:00"
                    }
                  ]
                setAccounts(fetchedAccounts);

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

                const fetchedMedicalServices = [
                    {
                      "id": "0340c827-240e-4b2a-887a-dc10c836e7cf",
                      "serviceCategory": {
                        "id": "93f02090-1662-4ed9-9b67-4f875da5e7de",
                        "categoryName": "Diagnostics",
                        "timeSlotSize": 30
                      },
                      "serviceName": "MedicalService",
                      "price": 0,
                      "specialization": {
                        "id": "1ff979d9-c513-499e-ab57-96fbe954d2ad",
                        "specializationName": "Specialization",
                        "isActive": true
                      },
                      "isActive": true
                    }
                  ]
                setMedicalServices(fetchedMedicalServices);

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

                const fetchedAppointments = [
                    {
                      "id": "8918c0b3-194d-43bc-9d50-576af108e2fb",
                      "patient": {
                        "id": "371add01-a140-4a54-9d46-14c6dfe8376e",
                        "firstName": "Иванов",
                        "lastName": "Иван",
                        "middleName": "Иванович",
                        "accountId": "d7144e1d-2ab3-4153-8026-355dcebdcae6"
                      },
                      "doctor": {
                        "id": "e45d3e6c-9f7a-4d29-b5d3-9c3a2a7c2e0e",
                        "accountId": "b3f51cf4-4a5d-483d-a72b-798243d938e2",
                        "firstName": "Петров",
                        "lastName": "Петр",
                        "middleName": "Петрович",
                        "cabinetNumber": 1,
                        "status": "At work"
                      },
                      "medicalService": {
                        "id": "0340c827-240e-4b2a-887a-dc10c836e7cf",
                        "serviceName": "MedicalService",
                        "price": 0,
                        "isActive": true
                      },
                      "date": "2025-03-12",
                      "time": "08:00 - 08:30",
                      "isApproved": false
                    },
                    {
                        "id": "8918c0b3-194d-43bc-9d50-576af108e2fc",
                        "patient": {
                          "id": "371add01-a140-4a54-9d46-14c6dfe8376e",
                          "firstName": "Иванов",
                          "lastName": "Иван",
                          "middleName": "Иванович",
                          "accountId": "d7144e1d-2ab3-4153-8026-355dcebdcae6"
                        },
                        "doctor": {
                          "id": "3c0985c6-4ddb-40a2-a3b3-7bc1048952c7",
                          "accountId": "b3f51cf4-4a5d-483d-a72b-798243d938e2",
                          "firstName": "Иванов",
                          "lastName": "Иван",
                          "middleName": "Иванович",
                          "cabinetNumber": 1,
                          "status": "At work"
                        },
                        "medicalService": {
                          "id": "0340c827-240e-4b2a-887a-dc10c836e7cf",
                          "serviceName": "MedicalService",
                          "price": 0,
                          "isActive": true
                        },
                        "date": "2025-03-12",
                        "time": "08:00 - 08:30",
                        "isApproved": true
                      }
                  ]
                setAppointments(fetchedAppointments);

                const formattedAppointments = formatAppointments(fetchedAppointments);
                setEditableAppointments(formattedAppointments);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

    const formatAppointments = (appointments) => {
        return appointments.map(({ id, time, doctor, patient, medicalService, isApproved }) => ({
            id,
            time,
            doctorFullName: `${doctor.firstName} ${doctor.lastName} ${doctor.middleName}`,
            patientFullName: `${patient.firstName} ${patient.lastName} ${patient.middleName}`,
            patientPhoneNumber: accounts.phoneNumber,
            medicalServiceName: medicalService.serviceName,
            isApproved: isApproved ? 'Approved' : 'Not Approved',
        }));
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleAddModalClick = () => {
        setIsAddModalOpen(!isAddModalOpen);
    }

    const toggleFilterModalClick = () => {
        setIsFilterModalOpen(!isFilterModalOpen);
    }

    const toggleCalendarClick = () => {
        setIsCalendarOpen(!isCalendarOpen);
    }

    const handleSetSelectedDate = (date) => {
        setSelectedDate(date);
    }

    const handleFilterDoctorChange = (doctor) => {
        setSelectedDoctors(prevSelectedDoctors => {
            if (prevSelectedDoctors.some(selectedDoctor => selectedDoctor.id === doctor.id)) {
                return prevSelectedDoctors.filter(selectedDoctor => selectedDoctor.id !== doctor.id);
            } else {
                return [...prevSelectedDoctors, doctor];
            }
        });
    };

    const handleFilterMedicalServiceChange = (medicalService) => {
        setSelectedMedicalServices(prevSelectedMedicalServices => {
            if (prevSelectedMedicalServices.some(selectedMedicalService => selectedMedicalService.id === medicalService.id)) {
                return prevSelectedMedicalServices.filter(selectedMedicalService => selectedMedicalService.id !== medicalService.id);
            } else {
                return [...prevSelectedMedicalServices, medicalService];
            }
        });
    };

    const handleFilterIsApprovedChange = (status) => {
        setSelectedIsApproved(status);
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

    const handleApplyFilter = () => {
        let filteredAppointments = appointments;
    
        if (selectedDoctors.length > 0 || selectedMedicalServices.length > 0 || selectedIsApproved !== null || selectedOffices.length > 0) {
            const doctorsInSelectedOffice = doctors.filter(doctor =>
                selectedOffices.some(selectedOffice => selectedOffice.id === doctor.office.id)
            );
    
            filteredAppointments = appointments.filter(appointment =>
                (!selectedDoctors.length || selectedDoctors.some(selectedDoctor => selectedDoctor.id === appointment.doctor.id)) &&
                (!selectedMedicalServices.length || selectedMedicalServices.some(selectedMedicalService => selectedMedicalService.id === appointment.medicalService.id)) &&
                (selectedIsApproved === null || selectedIsApproved === appointment.isApproved) &&
                (!selectedOffices.length || doctorsInSelectedOffice.some(filteredDoctor => filteredDoctor.id === appointment.doctor.id))
            );
        }
    
        const formattedAppointments = formatAppointments(filteredAppointments);
        setEditableAppointments(formattedAppointments);
        setIsFilterModalOpen(!isFilterModalOpen);
    };

    const handleClearFilter = () => {
        const formattedAppointments = formatAppointments(appointments);
        setEditableAppointments(formattedAppointments);
        setSelectedDoctors([]);
        setSelectedMedicalServices([]);
        setSelectedIsApproved(null);
        setSelectedOffices([]);
        setIsFilterModalOpen(!isFilterModalOpen);
    }

    const handleApprove = (id) => {
        console.log(id);
    }

    const handleCancel = (id) => {
        console.log(id);
    }

    const handleEdit = (id) => {
        console.log(id);
    }

    return (
        <>
            <Toolbar
                pageTitle="Appointments"

                showAddIcon={true}
                toggleAddModalClick={toggleAddModalClick}

                showFilterIcon={true}
                toggleFilterModalClick={toggleFilterModalClick}

                showCalendarIcon={true}
                toggleCalendarClick={toggleCalendarClick}
            />
            {isLoading ? (<Loader />
            ) : (
                <>
                    <div className="page">
                        {appointments.length === 0 ? (
                            <p className="no-items">Appointments not found</p>
                    ) : (
                        <>
                            {editableAppointments.length === 0 && (
                                <p className="no-items">Nothing was found</p>
                            )}
                            {editableAppointments.length > 0 && (
                                <div className="table">
                                    <Table
                                        items={editableAppointments}
                                        isActions={true}
                                        handleApprove={handleApprove}
                                        handleCancel={handleCancel}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {isCalendarOpen && (
                        <Calendar onClose={toggleCalendarClick} handleSetSelectedDate={handleSetSelectedDate} currentDate={selectedDate}/>
                    )}

                    {isFilterModalOpen && (
                        <FilterModal onClose={() => setIsFilterModalOpen(false)}>
                            <div className="filter-section">
                                <h2 className="filter-modal-title">Doctors</h2>
                                <div className="filter-checkbox-container">
                                    {doctors.map(doctor => (
                                        <div className="filter-checkbox-group" key={doctor.id}>
                                            <CheckboxWrapper
                                                id={doctor.id}
                                                name="doctor-name"
                                                value={`${doctor.firstName} ${doctor.lastName} ${doctor.middleName}`}
                                                checked={selectedDoctors.some(selectedDoctor => selectedDoctor.id === doctor.id)}
                                                onChange={() => handleFilterDoctorChange(doctor)}
                                                label={`${doctor.firstName} ${doctor.lastName} ${doctor.middleName}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="filter-section">
                                <h2 className="filter-modal-title">Medical Services</h2>
                                <div className="filter-checkbox-container">
                                    {medicalServices.map(medicalService => (
                                        <div className="filter-checkbox-group" key={medicalService.id}>
                                            <CheckboxWrapper
                                                id={medicalService.id}
                                                name="medical-service-name"
                                                value={`${medicalService.serviceName}`}
                                                checked={selectedMedicalServices.some(selectedMedicalService => selectedMedicalService.id === medicalService.id)}
                                                onChange={() => handleFilterMedicalServiceChange(medicalService)}
                                                label={`${medicalService.serviceName}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="filter-section">
                                <h2 className="filter-modal-title">Status</h2>
                                <div className="filter-checkbox-container">
                                    <div className="filter-checkbox-group" key="approved-appointments">
                                        <CheckboxWrapper
                                            id="approved-appointments"
                                            name="approved-appointments"
                                            value={`approved-appointments`}
                                            checked={selectedIsApproved === true}
                                            onChange={() => handleFilterIsApprovedChange(true)}
                                            label={`Approved`}
                                        />
                                    </div>
                                    <div className="filter-checkbox-group" key="not-approved-appointments">
                                        <CheckboxWrapper
                                            id="not-approved-appointments"
                                            name="not-approved-appointments"
                                            value={`not-approved-appointments`}
                                            checked={selectedIsApproved === false}
                                            onChange={() => handleFilterIsApprovedChange(false)}
                                            label={`Not Approved`}
                                        />
                                    </div>
                                    <div className="filter-checkbox-group" key="all-appointments">
                                        <CheckboxWrapper
                                            id="all-appointments"
                                            name="all-appointments"
                                            value={`all-appointments`}
                                            checked={selectedIsApproved === null}
                                            onChange={() => handleFilterIsApprovedChange(null)}
                                            label={`All`}
                                        />
                                    </div>
                                </div>
                                <div className="filter-section">
                                    <h2 className="filter-modal-title">Offices</h2>
                                    <div className="filter-checkbox-container">
                                        {offices.map(office => (
                                            <div className="filter-checkbox-group" key={office.id}>
                                                <CheckboxWrapper
                                                id={office.id}
                                                name="office-name"
                                                value={`${office.city} ${office.street} ${office.houseNumber} ${office.officeNumber}`}
                                                checked={selectedOffices.some(selectedOffice => selectedOffice.id === office.id)}
                                                onChange={() => handleFilterOfficeChange(office)}
                                                label={`${office.city} ${office.street} ${office.houseNumber} ${office.officeNumber}`}
                                            />
                                        </div>
                                    ))}
                                </div>
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
                </>
            )}
        </>
    );
} 
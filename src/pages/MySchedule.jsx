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

export default function MySchedule() {
    const [appointments, setAppointments] = useState([]);
    const [editableAppointments, setEditableAppointments] = useState([]);
    
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());


    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

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
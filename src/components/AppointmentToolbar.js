import React, { useState } from 'react';
import './../styles/AppointmentToolbar.css';
import AppointmentFilterModal from './AppointmentFilterModal';

const AppointmentToolbar = ({
    pageTitle,
    setSearchTerm,
    appointments,
    filteredAppointments,
    setFilteredAppointments,
    office,
    doctors,
    medicalServices,
    selectedAddresses,
    setSelectedAddresses,
    selectedDoctor,
    setSelectedDoctor,
    selectedMedicalService,
    setSelectedMedicalService,
    selectedAppointmentStatus,
    setSelectedAppointmentStatus,
    showFilterIcon = false,
    showCalendarIcon = false,
    showAddIcon = false,
    onCalendarClick,
    showCreateAppointmentModal,
}) => { 
    const [showFilterModal, setFilterModal] = useState(false);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const toggleFilterModal = () => {
        setFilterModal(!showFilterModal);
    };

    return (
        <>
            {showFilterModal && (
                <AppointmentFilterModal
                    onClose={toggleFilterModal}
                    appointments={appointments}
                    filteredAppointments={filteredAppointments}
                    setFilteredAppointments={setFilteredAppointments}
                    fetchedDoctors={doctors}
                    fetchedMedicalServices={medicalServices}
                    fetchedOffices={office}
                    onFilterItems={setFilteredAppointments}
                    selectedAddresses={selectedAddresses}
                    setSelectedAddresses={setSelectedAddresses}
                    selectedDoctor={selectedDoctor}
                    setSelectedDoctor={setSelectedDoctor}
                    selectedMedicalService={selectedMedicalService}
                    setSelectedMedicalService={setSelectedMedicalService}
                    selectedAppointmentStatus={selectedAppointmentStatus}
                    setSelectedAppointmentStatus={setSelectedAppointmentStatus}
                />
            )}
            <div className='toolbar'>
                <h2 className='pageName'>{pageTitle}</h2>
                <div className="filter-search-container">
                    <div className="search-bar">
                        <i className='bx bx-search'></i>
                        <input
                            type="search"
                            placeholder="Search..."
                            onChange={handleSearchChange}
                        />
                    </div>
                    {showFilterIcon && (
                        <i className='bx bx-filter' onClick={toggleFilterModal}></i>
                    )}
                    {showCalendarIcon && (
                        <i className='bx bx-calendar' onClick={onCalendarClick}></i>
                    )}
                    {showAddIcon && (
                        <i className='bx bx-plus' onClick={showCreateAppointmentModal}></i>
                    )}
                </div>
            </div>
        </>
    );
};

export default AppointmentToolbar;
import React, { useState } from 'react';
import './../styles/DoctorToolbar.css';
import FilterDoctorModal from './FilterDoctorModal';

const DoctorToolbar = ({ 
    pageTitle, 
    setSearchTerm, 
    doctors, 
    offices,
    specializations,
    onFilterDoctors, 
    selectedAddresses, 
    setSelectedAddresses, 
    selectedSpecialization, 
    setSelectedSpecialization, 
    showCreateDoctorProfileModal,
    showFilterIcon = false, 
    showAddIcon = false,
    showCalendarIcon = false,
    onCalendarClick,
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
                <FilterDoctorModal
                    onClose={toggleFilterModal}
                    doctors={doctors} 
                    offices={offices}
                    specializations={specializations}
                    onFilterDoctors={onFilterDoctors} 
                    selectedAddresses={selectedAddresses}
                    setSelectedAddresses={setSelectedAddresses}
                    selectedSpecialization={selectedSpecialization}
                    setSelectedSpecialization={setSelectedSpecialization}
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
                    {showAddIcon && (
                        <i className='bx bx-plus' onClick={showCreateDoctorProfileModal}></i>
                    )}
                    {showCalendarIcon && (
                        <i className='bx bx-calendar' onClick={onCalendarClick}></i>
                    )}
                </div>
            </div>
        </>
    );
};

export default DoctorToolbar;
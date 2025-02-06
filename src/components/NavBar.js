import React, { useState } from 'react';
import './../styles/NavBar.css';
import FilterDoctorModal from './FilterDoctorModal';

const NavBar = ({ 
    pageTitle, 
    setSearchTerm, 
    doctors, 
    onFilterDoctors, 
    selectedAddresses, 
    setSelectedAddresses, 
    selectedSpecialization, 
    setSelectedSpecialization, 
}) => {
        
    const [showFilterDoctorModal, setFilterDoctorModal] = useState(false);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const toggleFilterDoctorModal = () => {
        setFilterDoctorModal(!showFilterDoctorModal);
    };

    return (
        <>
            {showFilterDoctorModal && (
                <FilterDoctorModal
                    onClose={toggleFilterDoctorModal}
                    doctors={doctors}
                    onFilterDoctors={onFilterDoctors}
                    selectedAddresses={selectedAddresses}
                    setSelectedAddresses={setSelectedAddresses}
                    selectedSpecialization={selectedSpecialization}
                    setSelectedSpecialization={setSelectedSpecialization}
                />
            )}
            <div className='nav-bar'>
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
                    <i className='bx bx-filter' onClick={toggleFilterDoctorModal}></i>
                </div>
            </div>
        </>
    );
};

export default NavBar;
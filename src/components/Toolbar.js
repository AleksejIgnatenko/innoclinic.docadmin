import React, { useState } from 'react';
import './../styles/Toolbar.css';
import FilterModal from './FilterModal';

const Toolbar = ({ 
    pageTitle, 
    setSearchTerm, 
    items, 
    onFilterItems, 
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
                <FilterModal
                    onClose={toggleFilterModal}
                    items={items} 
                    onFilterItems={onFilterItems} 
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

export default Toolbar;
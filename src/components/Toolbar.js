import React from 'react';
import './../styles/DoctorToolbar.css';

const Toolbar = ({
    pageTitle,
    setSearchTerm,

    showAddIcon = false,
    toggleCreateModalClick,

    showFilterIcon = false,
    toggleFilterModalClick,

    showCalendarIcon = false,
    toggleCalendarClick,
}) => {

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <>
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
                    {showAddIcon && (
                        <i className='bx bx-plus' onClick={toggleCreateModalClick}></i>
                    )}
                    {showFilterIcon && (
                        <i className='bx bx-filter' onClick={toggleFilterModalClick}></i>
                    )}
                    {showCalendarIcon && (
                        <i className='bx bx-calendar' onClick={toggleCalendarClick}></i>
                    )}
                </div>
            </div>
        </>
    );
};

export default Toolbar;
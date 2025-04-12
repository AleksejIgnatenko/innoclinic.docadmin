import React from 'react';
import '../../styles/organisms/Toolbar.css';
import { IconBase } from "../atoms/IconBase";
import { InputBase } from '../atoms/InputBase';
const Toolbar = ({
    pageTitle,
    
    showSearch = false,
    searchTerm,
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
                    {showSearch && (
                        <div className="search-bar">
                            <IconBase name="bx-search" />
                            <InputBase 
                                type="search"
                                placeholder="Search..."
                                onChange={handleSearchChange}
                                value={searchTerm}
                            />
                        </div>
                    )}
                    {showAddIcon && (
                        <IconBase name="bx-plus" onClick={toggleCreateModalClick}/>
                    )}
                    {showFilterIcon && (
                        <IconBase name="bx-filter" onClick={toggleFilterModalClick}/>
                    )}
                    {showCalendarIcon && (
                        <IconBase name="bx-calendar" onClick={toggleCalendarClick}/>
                    )}
                </div>
            </div>
        </>
    );
};

export default Toolbar;
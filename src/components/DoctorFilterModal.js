import React, { useEffect } from 'react';
import './../styles/DoctorFilterModal.css';

const DoctorFilterModal = ({ 
    onClose, 
    doctors, 
    onFilterDoctors, 
    selectedAddresses, 
    setselectedAddresses, 
    selectedSpecialization, 
    setSelectedSpecialization 
}) => {
    
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [onClose]);

    const handleAddressChange = (event) => {
        const value = event.target.value;
        setselectedAddresses(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
    };

    const handleSpecializationChange = (event) => {
        setSelectedSpecialization(event.target.value);
    };

    const applyFilters = () => {
        const filteredDoctors = doctors.filter(item =>
            (selectedAddresses.length === 0 || selectedAddresses.includes(item.office.address)) &&
            (selectedSpecialization === "" || item.specialization.specializationName === selectedSpecialization)
        );
        onFilterDoctors(filteredDoctors); 
        onClose();
    };

    const resetFilters = () => {
        setselectedAddresses([]); 
        setSelectedSpecialization(""); 
        onFilterDoctors(doctors); 
        onClose();
    };

    return (
        <div className="modal-overlay">
            <button className="close-button" onClick={onClose}>X</button>
            <div className="filter-container">
                <div className="filter-box">
                    <h2>Filter</h2>
                    <div className="filter-input-group">
                        <label>Office address</label>
                        <div className="filter-checkbox-group">
                            {[...new Set(doctors.map(i => i.office.address))].map(address => (
                                <label key={address}>
                                    <input
                                        type="checkbox"
                                        name="office-address"
                                        value={address}
                                        checked={selectedAddresses.includes(address)}
                                        onChange={handleAddressChange}
                                    />
                                    <span>{address}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="filter-input-group">
                        <label>Specialization</label>
                        <select value={selectedSpecialization} onChange={handleSpecializationChange}>
                            <option value="">All</option>
                            {[...new Set(doctors.map(i => i.specialization.specializationName))].map(spec => (
                                <option key={spec} value={spec}>{spec}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-buttons">
                        <button onClick={applyFilters} className="apply-filters">Apply Filters</button>
                        <button onClick={resetFilters} className="reset-filters">Reset Filters</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorFilterModal;
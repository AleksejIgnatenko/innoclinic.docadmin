import React, { useEffect } from 'react';
import './../styles/FilterDoctorModal.css';

const FilterDoctorModal = ({
    onClose,
    doctors,
    offices,
    specializations,
    onFilterDoctors,
    selectedAddresses,
    setSelectedAddresses,
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
        setSelectedAddresses(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
    };

    const handleSpecializationChange = (event) => {
        setSelectedSpecialization(event.target.value);
    };

    const applyFilters = () => {
        const filteredDoctors = doctors.filter(doctor =>
            (selectedAddresses.length === 0 || selectedAddresses.includes(doctor.office.address)) &&
            (selectedSpecialization === "" || doctor.specialization.specializationName === selectedSpecialization)
        );
        onFilterDoctors(filteredDoctors);
        onClose();
    };

    const resetFilters = () => {
        setSelectedAddresses([]);
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
                            {offices.map(office => (
                                <label key={office.id}>
                                    <input
                                        type="checkbox"
                                        name="office-address"
                                        value={office.address}
                                        checked={selectedAddresses.includes(office.address)}
                                        onChange={handleAddressChange}
                                    />
                                    <span>{office.address}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="filter-input-group">
                        <label>Specialization</label>
                        <select value={selectedSpecialization} onChange={handleSpecializationChange}>
                            <option value="">All</option>
                            {specializations.map(spec => (
                                <option key={spec.id} value={spec.specializationName}>{spec.specializationName}</option>
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

export default FilterDoctorModal;
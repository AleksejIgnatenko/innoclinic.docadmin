import React, { useEffect } from 'react';
import './../styles/AppointmentFilterModal.css';

const AppointmentFilterModal = ({ 
    onClose, 
    appointments, 
    fetchedDoctors,
    fetchedMedicalServices,
    fetchedOffices,
    setFilteredAppointments, 
    selectedAddresses, 
    setSelectedAddresses,
    selectedDoctor,
    setSelectedDoctor,
    selectedMedicalService,
    setSelectedMedicalService,
    selectedAppointmentStatus,
    setSelectedAppointmentStatus,
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

    const handleDoctorChange = (event) => {
        setSelectedDoctor(event.target.value);
    };

    const handleServiceChange = (event) => {
        setSelectedMedicalService(event.target.value);
    };

    const handleStatusChange = (event) => {
        setSelectedAppointmentStatus(event.target.value);
    };

    const applyFilters = () => {
        const filteredAppointments = appointments.filter(appointment => {
            const filteredDoctor = fetchedDoctors.find(d => d.id === appointment.doctor.id);
        
            const matchesAddress = selectedAddresses.length === 0 || 
                (filteredDoctor.office.address && selectedAddresses.includes(filteredDoctor.office.address));
            
            const matchesDoctor = selectedDoctor === "" || 
                (`${appointment.doctor.lastName} ${appointment.doctor.firstName}` === selectedDoctor);
        
            const matchesService = selectedMedicalService === "" || 
                appointment.medicalService.serviceName === selectedMedicalService;
            
            const matchesStatus = selectedAppointmentStatus === "" || 
                (selectedAppointmentStatus === "Approved" && appointment.isApproved) ||
                (selectedAppointmentStatus === "Not Approved" && !appointment.isApproved) ||
                (selectedAppointmentStatus === "All");
            
            return matchesAddress && matchesDoctor && matchesService && matchesStatus;
        });
        
        setFilteredAppointments(filteredAppointments); 
        onClose();
    };

    const resetFilters = () => {
        setSelectedAddresses([]); 
        setSelectedDoctor(""); 
        setSelectedMedicalService("");
        setSelectedAppointmentStatus(""); 
        setFilteredAppointments(appointments); 
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
                            {fetchedOffices && [...new Set(fetchedOffices.map(office => office.address))].map(address => (
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
                        <label>Doctor's Full Name</label>
                        <select value={selectedDoctor} onChange={handleDoctorChange}>
                            <option value="">All</option>
                            {fetchedDoctors && [...new Set(fetchedDoctors.map(doc => `${doc.lastName} ${doc.firstName}`))].map(docName => (
                                <option key={docName} value={docName}>{docName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-input-group">
                        <label>Service Name</label>
                        <select value={selectedMedicalService} onChange={handleServiceChange}>
                            <option value="">All</option>
                            {fetchedMedicalServices && [...new Set(fetchedMedicalServices.map(service => service.serviceName))].map(serviceName => (
                                <option key={serviceName} value={serviceName}>{serviceName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-input-group">
                        <label>Appointment Status</label>
                        <select value={selectedAppointmentStatus} onChange={handleStatusChange}>
                            <option value="">All</option>
                            <option value="Approved">Approved</option>
                            <option value="Not Approved">Not Approved</option>
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

export default AppointmentFilterModal;
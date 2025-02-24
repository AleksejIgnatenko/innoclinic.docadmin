import React, { useEffect } from 'react';
import './../styles/AppointmentFilterModal.css';

const AppointmentFilterModal = ({
    onClose,
    appointments,
    doctors,
    medicalServices,
    offices,

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
            const filteredDoctor = doctors.find(d => d.id === appointment.doctor.id);

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

        const formattedAppointments = filteredAppointments.map(({ time, doctor, patient, medicalService }) => {
            const patientAccount = filteredAppointments.find(account => account.id === patient.accountId);
            const patientsPhoneNumber = patientAccount ? patientAccount.phoneNumber : 'Phone number not found';

            return {
                time,
                fullNameOfTheDoctor: `${doctor.lastName} ${doctor.firstName} ${doctor.middleName}`,
                fullNameOfThePatient: `${patient.lastName} ${patient.firstName} ${patient.middleName}`,
                patientsPhoneNumber,
                medicalService: medicalService.serviceName,
            };
        });

        setFilteredAppointments(formattedAppointments);
        onClose();
    };

    const resetFilters = () => {
        setSelectedAddresses([]);
        setSelectedDoctor("");
        setSelectedMedicalService("");
        setSelectedAppointmentStatus("");
        
        const formattedAppointments = appointments.map(({ time, doctor, patient, medicalService }) => {
            const patientAccount = appointments.find(account => account.id === patient.accountId);
            const patientsPhoneNumber = patientAccount ? patientAccount.phoneNumber : 'Phone number not found';
      
            return {
              time,
              fullNameOfTheDoctor: `${doctor.lastName} ${doctor.firstName} ${doctor.middleName}`,
              fullNameOfThePatient: `${patient.lastName} ${patient.firstName} ${patient.middleName}`,
              patientsPhoneNumber,
              medicalService: medicalService.serviceName,
            };
          });
        setFilteredAppointments(formattedAppointments);
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
                            {offices && [...new Set(offices.map(office => office.address))].map(address => (
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
                            {doctors && [...new Set(doctors.map(doc => `${doc.lastName} ${doc.firstName}`))].map(docName => (
                                <option key={docName} value={docName}>{docName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-input-group">
                        <label>Service Name</label>
                        <select value={selectedMedicalService} onChange={handleServiceChange}>
                            <option value="">All</option>
                            {medicalServices && [...new Set(medicalServices.map(service => service.serviceName))].map(serviceName => (
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
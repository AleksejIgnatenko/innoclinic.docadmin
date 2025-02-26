import React, { useState, useEffect } from 'react';
import "./../styles/Doctors.css";
import Loader from '../components/Loader';
import GetAllDoctorsFetchAsync from '../api/Profiles.API/GetAllDoctorsFetchAsync';
import CreateDoctorProfileModal from '../components/CreateDoctorProfileModal';
import GetAllOfficesFetchAsync from '../api/Offices.API/GetAllOfficesFetchAsync';
import GetAllSpecializationFetchAsync from '../api/Services.API/GetAllSpecializationFetchAsync';
import { useNavigate } from 'react-router-dom';
import Toolbar from '../components/Toolbar';
import DoctorFilterModal from '../components/DoctorFilterModal';
import Table from '../components/Table';

function Doctors() {
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [offices, setOffices] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAddresses, setSelectedAddresses] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    
    const [showCreateDoctorProfileModal, setCreateDoctorProfileModal] = useState(false);
    const [showFilterDoctorModal, setShowFilterDoctorModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedDoctors = await GetAllDoctorsFetchAsync();
                setDoctors(fetchedDoctors);

                const formattedDoctors = fetchedDoctors.map(({ id, firstName, lastName, middleName, specialization, status, dateOfBirth, office }) => ({
                    id,
                    fullName: `${firstName} ${lastName} ${middleName}`,
                    specialization: specialization.specializationName,
                    status,
                    dateOfBirth,
                    address: office.city + " " + office.street + " " + office.houseNumber + " " + office.officeNumber,
                }));

                setFilteredDoctors(formattedDoctors);

                const fetchedOffices = await GetAllOfficesFetchAsync();
                setOffices(fetchedOffices);

                const fetchedSpecializations = await GetAllSpecializationFetchAsync();
                setSpecializations(fetchedSpecializations);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filtered = doctors.filter(doctor => {
            return (
                doctor.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
                doctor.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
                doctor.middleName.toLowerCase().includes(lowerCaseSearchTerm)
            );
        });

        const formattedDoctors = filtered.map(({ id, firstName, lastName, middleName, specialization, status, dateOfBirth, office }) => ({
            id,
            fullName: `${firstName} ${lastName} ${middleName}`,
            specialization: specialization.specializationName,
            status,
            dateOfBirth,
            address: office.city + " " + office.street + " " + office.houseNumber + " " + office.officeNumber,
        }));

        setFilteredDoctors(formattedDoctors);
    }, [searchTerm]);
    
    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleCreateDoctorProfileModal = () => {
        setCreateDoctorProfileModal(!showCreateDoctorProfileModal);
    };

    const toggleFilterDoctorModal = () => {
        setShowFilterDoctorModal(!showFilterDoctorModal);
      };

    const handleTableRowClick = (id) => {
        navigate(`/doctorProfile/${id}`);
    };

    return (
        <>
            {showCreateDoctorProfileModal && <CreateDoctorProfileModal onClose={toggleCreateDoctorProfileModal} />}

            {isLoading && <Loader />}
            
            <Toolbar 
                pageTitle={"Doctors"}
                setSearchTerm={setSearchTerm}

                showAddIcon={true}
                toggleCreateModalClick={toggleCreateDoctorProfileModal}

                showFilterIcon={true}
                toggleFilterModalClick={toggleFilterDoctorModal}
            />

            {showFilterDoctorModal && (
                <DoctorFilterModal
                    onClose={toggleFilterDoctorModal}
                    doctors={doctors} 
                    offices={offices}
                    specializations={specializations}

                    setFilteredDoctors={setFilteredDoctors}

                    selectedAddresses={selectedAddresses}
                    setSelectedAddresses={setSelectedAddresses}

                    selectedSpecialization={selectedSpecialization}
                    setSelectedSpecialization={setSelectedSpecialization}
                />
            )}

            <div className="doctors-container">
                {filteredDoctors.length > 0 ? (
                    <Table 
                        items={filteredDoctors} 
                        
                        useHandleRowClick={true}
                        handleRowClick={handleTableRowClick}
                    />
                ) : (
                    !isLoading && <p className="no-doctors-message">Nothing could be found.</p>
                )}
            </div>
        </>
    );
}

export default Doctors;
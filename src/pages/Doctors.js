import React, { useState, useEffect } from 'react';
import "./../styles/Doctors.css";
import Loader from '../components/Loader';
import GetAllDoctorsFetchAsync from '../api/Profiles.API/GetAllDoctorsFetchAsync';
import CreateDoctorProfileModal from '../components/CreateDoctorProfileModal';
import DoctorToolbar from '../components/DoctorToolbar';
import GetAllOfficesFetchAsync from '../api/Offices.API/GetAllOfficesFetchAsync';
import GetAllSpecializationFetchAsync from '../api/Services.API/GetAllSpecializationFetchAsync';
import DoctorTable from '../components/DoctorTable';
import { useNavigate } from 'react-router-dom';

function Doctors() {
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [offices, setOffices] = useState([]);
    const [specializations, setSpecializations] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateDoctorProfileModal, setCreateDoctorProfileModal] = useState(false);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectedAddresses, setSelectedAddresses] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedDoctors = await GetAllDoctorsFetchAsync();
                setDoctors(fetchedDoctors);
                setFilteredDoctors(fetchedDoctors);

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
            // const experience = doctor.careerStartYear ? new Date().getFullYear() - new Date(doctor.careerStartYear).getFullYear() + 1 : 0;
            return (
                doctor.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
                doctor.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
                doctor.middleName.toLowerCase().includes(lowerCaseSearchTerm) //||
                // doctor.specialization?.specializationName.toLowerCase().includes(lowerCaseSearchTerm) ||
                // experience.toString().includes(lowerCaseSearchTerm) ||
                // doctor.office?.address.toLowerCase().includes(lowerCaseSearchTerm)
            );
        });
        setFilteredDoctors(filtered);
    }, [searchTerm]);

    const handleFilterDoctors = (filtered) => {
        setFilteredDoctors(filtered);
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleCreateDoctorProfileModal = () => {
        setCreateDoctorProfileModal(!showCreateDoctorProfileModal);
    };

    const handleTableRowClick = (id) => {
        navigate(`/doctorProfile/${id}`);
    };

    return (
        <>
            {showCreateDoctorProfileModal && <CreateDoctorProfileModal onClose={toggleCreateDoctorProfileModal} />}
            {isLoading && <Loader />}
            <DoctorToolbar
                pageTitle={"Doctors"}
                setSearchTerm={setSearchTerm}
                doctors={doctors}
                offices={offices}
                specializations={specializations}
                onFilterDoctors={handleFilterDoctors}
                selectedAddresses={selectedAddresses}
                setSelectedAddresses={setSelectedAddresses}
                selectedSpecialization={selectedSpecialization}
                setSelectedSpecialization={setSelectedSpecialization}
                showCreateDoctorProfileModal={toggleCreateDoctorProfileModal}
                showAddIcon={true}
                showFilterIcon={true}
                showDoctorFilterModal={true}
            />
            <div className="doctors-container">
                {filteredDoctors.length > 0 ? (
                    <DoctorTable doctors={filteredDoctors} />
                ) : (
                    !isLoading && <p>Nothing could be found.</p>
                )}
            </div>
        </>
    );
}

export default Doctors;
import React, { useState, useEffect } from 'react';
import DoctorCard from "../components/DoctorCard";
import "./../styles/Doctors.css";
import Loader from '../components/Loader';
import GetAllDoctorsFetchAsync from '../api/Profiles.API/GetAllDoctorsFetchAsync';
import CreateDoctorProfileModal from '../components/CreateDoctorProfileModal';
import DoctorToolbar from '../components/DoctorToolbar';

function Doctors() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateDoctorProfileModal, setCreateDoctorProfileModal] = useState(false);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectedOffices, setselectedOffices] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);
                const fetchedDoctors = await GetAllDoctorsFetchAsync();
                setDoctors(fetchedDoctors);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

    const handleFilterDoctors = (filtered) => {
        setFilteredDoctors(filtered);
    };

    const displayedDoctors = filteredDoctors.length > 0 ? filteredDoctors : doctors.filter(doctor => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
            doctor.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
            doctor.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
            doctor.middleName.toLowerCase().includes(lowerCaseSearchTerm)
        );
    });

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleCreateDoctorProfileModal = () => {
        setCreateDoctorProfileModal(!showCreateDoctorProfileModal);
    };

    return (
        <>
            {showCreateDoctorProfileModal && <CreateDoctorProfileModal onClose={toggleCreateDoctorProfileModal} />}
            <div>
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        {doctors.length < 1 ? (
                            <p className='no-doctors-message'>There are no doctors available.</p>
                        ) : (
                            <>
                                <DoctorToolbar
                                    pageTitle={"Doctors"}
                                    setSearchTerm={setSearchTerm}
                                    items={doctors}
                                    onFilterItems={handleFilterDoctors}
                                    selectedOffices={selectedOffices}
                                    setselectedOffices={setselectedOffices}
                                    selectedSpecialization={selectedSpecialization}
                                    setSelectedSpecialization={setSelectedSpecialization}
                                    showCreateDoctorProfileModal={toggleCreateDoctorProfileModal}
                                    showAddIcon={true}
                                    showFilterIcon={true}
                                    showDoctorFilterModal={true}
                                />
                                <div className="doctors-container">
                                    {displayedDoctors.length > 0 ? (
                                        displayedDoctors.map((doctor) => (
                                            <DoctorCard
                                                key={doctor.id}
                                                name={`${doctor.firstName || ''} ${doctor.lastName || ''} ${doctor.middleName || ''}`}
                                                specialization={doctor.specialization?.specializationName || "Not found"}
                                                experience={doctor.careerStartYear ? new Date().getFullYear() - new Date(doctor.careerStartYear).getFullYear() + 1 : "N/A"}
                                                officeAddress={doctor.office?.address || "Not found"}
                                            />
                                        ))
                                    ) : (
                                        <p className='no-doctors-message'>Nothing could be found.</p>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default Doctors;
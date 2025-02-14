import React, { useState, useEffect } from 'react';
import "./../styles/DoctorProfile.css";
import Loader from '../components/Loader';
import DoctorProfileCard from '../components/DoctorProfileCard';
import GetDoctorByAccountIdFromTokenFetchAsync from '../api/Profiles.API/GetDoctorByAccountIdFromTokenFetchAsync';
import GetAllSpecializationFetchAsync from '../api/Services.API/GetAllSpecializationFetchAsync';
import GetAllOfficesFetchAsync from '../api/Offices.API/GetAllOfficesFetchAsync';
import { useParams } from 'react-router-dom';
import GetDoctorByIdFetchAsync from '../api/Profiles.API/GetDoctorByIdFetchAsync';

function DoctorProfile() {
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [specializations, setSpecializations] = useState([]);
    const [offices, setOffices] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                if (doctorId) {
                    const fetchDoctor = await GetDoctorByIdFetchAsync(doctorId);
                    setDoctor(fetchDoctor);
                } else {
                    const fetchDoctor = await GetDoctorByAccountIdFromTokenFetchAsync();
                    setDoctor(fetchDoctor);
                }

                const fetchedSpecializations = await GetAllSpecializationFetchAsync();
                setSpecializations(fetchedSpecializations);

                const fetchedOffices = await GetAllOfficesFetchAsync();
                setOffices(fetchedOffices);

            } catch (error) {
                console.error('Error fetching doctor:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && (
                <DoctorProfileCard
                    doctor={doctor}
                    specializations={specializations}
                    offices={offices}
                />
            )}
        </>
    );
}

export default DoctorProfile;
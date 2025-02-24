import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { useParams } from 'react-router-dom';
import OfficeInfoCard from '../components/OfficeInfoCard';
import GetOfficeByIdFetchAsync from '../api/Offices.API/GetOfficeByIdFetchAsync';
import "./../styles/OfficeInfo.css";
import CreateOfficeModal from '../components/CreateOfficeModal';

function OfficeInfo() {
    const { officeId } = useParams();
    const [office, setOffice] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                if (officeId) {
                    const fetchOffice = await GetOfficeByIdFetchAsync(officeId);
                    setOffice(fetchOffice);
                }
            } catch (error) {
                console.error('Error fetching office:', error);
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
            {isLoading &&
                <div className="loader-container">
                    <Loader />
                </div>
            }
            {!isLoading && (
                <OfficeInfoCard
                    office={office}
                />
            )}
        </>
    );
}

export default OfficeInfo;
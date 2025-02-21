import React, { useState, useEffect } from 'react';
import "./../styles/Offices.css";
import Loader from '../components/Loader';
import GetAllOfficesFetchAsync from '../api/Offices.API/GetAllOfficesFetchAsync';
import Toolbar from '../components/Toolbar';
import Table from '../components/Table';

function Offices() {
    const [offices, setOffices] = useState([]);
    const [filteredOffices, setFilteredOffices] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedOffices = await GetAllOfficesFetchAsync();
                setOffices(fetchedOffices);

                const formattedOffices = fetchedOffices.map(({ id, address, registryPhoneNumber, isActive }) => ({
                    id,
                    address,
                    status: isActive ? 'Active' : 'Inactive',
                    registryPhoneNumber,
                }));
                setFilteredOffices(formattedOffices);
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
        const filtered = offices.filter(office => {
            return (
                office.address.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }).map(({ address, registryPhoneNumber, isActive }) => ({
            address,
            status: isActive ? 'Active' : 'Inactive',
            registryPhoneNumber,
        }));

        setFilteredOffices(filtered);
    }, [searchTerm]);

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleCreateOfficeModalClick = () => {
        console.log("create modal click")
    }

    const toggleFilterOfficeModalClick = () => {
        console.log("filter modal click")
    }

    // const createOfficeModal = () => {
    //     
    // };

    return (
        <>
            {/* {showCreateDoctorProfileModal && <CreateDoctorProfileModal onClose={toggleCreateDoctorProfileModal} />} */}
            {isLoading && <Loader />}
            <Toolbar
                pageTitle={"Offices"}
                setSearchTerm={setSearchTerm}

                showAddIcon={true}
                toggleCreateModalClick={toggleCreateOfficeModalClick}

                showFilterIcon={true}
                toggleFilterModalClick={toggleFilterOfficeModalClick}
            />
            <div className="offices-container">
                {filteredOffices.length > 0 ? (
                    <Table items={filteredOffices} />
                ) : (
                    !isLoading && <p className="no-offices-message">Nothing could be found.</p>
                )}
            </div>
        </>
    );
}

export default Offices;
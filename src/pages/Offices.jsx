import React, { useState, useEffect } from 'react';
import "./../styles/Offices.css";
import Loader from '../components/Loader';
import GetAllOfficesFetchAsync from '../api/Offices.API/GetAllOfficesFetchAsync';
import Toolbar from '../components/Toolbar';
import Table from '../components/Table';
import { useNavigate } from 'react-router-dom';
import CreateOfficeModal from '../components/CreateOfficeModal';

function Offices() {
    const navigate = useNavigate();

    const [offices, setOffices] = useState([]);
    const [filteredOffices, setFilteredOffices] = useState([]);

    const [showCreateOfficeModal, setShowCreateOfficeModal] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedOffices = await GetAllOfficesFetchAsync();
                setOffices(fetchedOffices);

                const formattedOffices = fetchedOffices.map(({ id, city, street, houseNumber, officeNumber, registryPhoneNumber, isActive }) => ({
                    id,
                    address: city + " " + street + " " + houseNumber + " " + officeNumber,
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
                office.city.toLowerCase().includes(lowerCaseSearchTerm) ||
                office.street.toLowerCase().includes(lowerCaseSearchTerm) ||
                office.houseNumber.toString().includes(lowerCaseSearchTerm) ||
                office.officeNumber.toString().includes(lowerCaseSearchTerm)
            );
        }).map(({ id, city, street, houseNumber, officeNumber, registryPhoneNumber, isActive }) => ({
            id,
            address: city + " " + street + " " + houseNumber + " " + officeNumber,
            status: isActive ? 'Active' : 'Inactive',
            registryPhoneNumber,
        }));
    
        setFilteredOffices(filtered);
    }, [searchTerm]);

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleCreateOfficeModalClick = () => {
        setShowCreateOfficeModal(!showCreateOfficeModal)
    }

    const handleTableRowClick = (id) => {
        navigate(`/officeInfo/${id}`);
    };

    return (
        <>
            {showCreateOfficeModal && <CreateOfficeModal  onClose={toggleCreateOfficeModalClick} />}
            {isLoading && <Loader />}
            <Toolbar
                pageTitle={"Offices"}
                setSearchTerm={setSearchTerm}

                showAddIcon={true}
                toggleCreateModalClick={toggleCreateOfficeModalClick}
            />
            <div className="offices-container">
                {filteredOffices.length > 0 ? (
                    <Table 
                        items={filteredOffices} 

                        useHandleRowClick={true}
                        handleRowClick={handleTableRowClick}
                    />
                ) : (
                    !isLoading && <p className="no-offices-message">Nothing could be found.</p>
                )}
            </div>
        </>
    );
}

export default Offices;
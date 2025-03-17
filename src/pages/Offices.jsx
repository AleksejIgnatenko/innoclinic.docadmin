import { useEffect, useRef, useState } from "react";
import Toolbar from '../components/organisms/Toolbar';
import Loader from '../components/organisms/Loader';
import Table from '../components/organisms/Table';
import { ButtonBase } from '../components/atoms/ButtonBase';
import FormModal from "../components/organisms/FormModal";
import { InputWrapper } from "../components/molecules/InputWrapper";
import useOfficeForm from "../hooks/useOfficeForm";
import ImageUploader from "../components/organisms/ImageUploader";
import 'boxicons/css/boxicons.min.css';
import FieldNames from "../enums/FieldNames";
import GetAllOfficesFetchAsync from "../api/Offices.API/GetAllOfficesFetchAsync";
import { IconBase } from "../components/atoms/IconBase";

export default function Offices() {
    const [offices, setOffices] = useState([]);
    const [editableOffices, setEditableOffices] = useState([]);

    const [image, setImage] = useState(null);

    const { formData, errors, handleChange, handleBlur, handleRegistryPhoneNumberKeyDown, isFormValid } = useOfficeForm({
        city: '',
        street: '',
        houseNumber: '',
        officeNumber: '',
        registryPhoneNumber: '+',
        status: true,
    });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const columnNames = [
        'officeAddress',
        'status',
        'registryPhoneNumber',
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedOffices = await GetAllOfficesFetchAsync();
                setOffices(fetchedOffices);

                const formattedOffices = formatOffices(fetchedOffices);
                setEditableOffices(formattedOffices);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

    const formatOffices = (offices) => {
        return offices.map(({ id, city, street, houseNumber, officeNumber, registryPhoneNumber, isActive }) => ({
            id,
            officeAddress: city + " " + street + " " + houseNumber + " " + officeNumber,
            status: isActive ? 'Active' : 'Inactive',
            registryPhoneNumber,
        }));
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleAddModal = () => {
        setIsAddModalOpen(!isAddModalOpen);
    };

    const handleAdd = (e) => {
        e.preventDefault();
        console.log(formData);
    }

    return (
        <>
            <Toolbar
                pageTitle="Offices"
                setSearchTerm={setSearchTerm}
                showAddIcon={true}
                toggleCreateModalClick={toggleAddModal}
            />
            {isLoading ? (<Loader />
            ) : (
                <div className="page">
                    {offices.length === 0 ? (
                        <p className="no-items">Offices not found</p>
                    ) : (
                        <>
                            {editableOffices.length === 0 && (
                                <p className="no-items">Nothing was found</p>
                            )}
                            {editableOffices.length > 0 && (
                                <div className="table">
                                    <Table>
                                        <thead>
                                            <tr>
                                                {columnNames.map(columnName => (
                                                    <th key={columnName}>{FieldNames[columnName]}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {editableOffices.map(editableOffice => (
                                                <tr key={editableOffice.id}>
                                                    {columnNames.map(columnName => (
                                                        <td key={columnName}>{editableOffice[columnName]}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </>
                    )}

                    {isAddModalOpen && (
                        <FormModal title="Add office" onClose={toggleAddModal} onSubmit={handleAdd} showCloseButton={true}>
                            <div className="modal-inputs">
                                <ImageUploader
                                    setImage={setImage}
                                />
                                <InputWrapper
                                    type="text"
                                    label="City"
                                    id="city"
                                    value={formData.city}
                                    onBlur={handleBlur('city')}
                                    onChange={handleChange('city')}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Street"
                                    id="street"
                                    value={formData.street}
                                    onBlur={handleBlur('street')}
                                    onChange={handleChange('street')}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="House Number"
                                    id="houseNumber"
                                    value={formData.houseNumber}
                                    onBlur={handleBlur('houseNumber')}
                                    onChange={handleChange('houseNumber')}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Office Number"
                                    id="officeNumber"
                                    value={formData.officeNumber}
                                    onBlur={handleBlur('officeNumber')}
                                    onChange={handleChange('officeNumber')}
                                    required
                                />
                                <InputWrapper
                                    type="phone"
                                    label="Registry Phone Number"
                                    id="registryPhoneNumber"
                                    value={formData.registryPhoneNumber}
                                    onBlur={handleBlur('registryPhoneNumber')}
                                    onChange={handleChange('registryPhoneNumber')}
                                    onKeyDown={handleRegistryPhoneNumberKeyDown}
                                    required
                                />
                                <InputWrapper
                                    type="radio"
                                    label="Status active"
                                    id="registryPhoneNumber"
                                    value={true}
                                    checked={formData.status === true}
                                    onBlur={handleBlur('status')}
                                    onChange={handleChange('status')}
                                    required
                                />
                                <InputWrapper
                                    type="radio"
                                    label="Status inactive"
                                    id="registryPhoneNumber"
                                    value={false}
                                    checked={formData.status === false}
                                    onBlur={handleBlur('Status')}
                                    onChange={handleChange('status')}
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <ButtonBase type="submit" disabled={!isFormValid}>
                                    Confirm
                                </ButtonBase>
                                <ButtonBase variant="secondary" onClick={toggleAddModal}>
                                    Cancel
                                </ButtonBase>
                            </div>
                        </FormModal>
                    )}
                </div>
            )}
        </>
    );
} 
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
import CheckboxWrapper from "../components/molecules/CheckboxWrapper";
import OfficeModelRequest from "../models/officeModels/OfficeModelRequest";
import CreateOfficeFetchAsync from "../api/Offices.API/CreateOfficeFetchAsync";
import CreatePhotoFetchAsync from "../api/Documents.API/CreatePhotoFetchAsync";
import { useNavigate } from "react-router-dom";

export default function Offices() {
    const navigate = useNavigate();

    const [offices, setOffices] = useState([]);
    const [editableOffices, setEditableOffices] = useState([]);

    const [photo, setPhoto] = useState(null);

    const { formData, setFormData, errors, handleChange, handleBlur, handleRegistryPhoneNumberKeyDown, isFormValid } = useOfficeForm({
        city: '',
        street: '',
        houseNumber: '',
        officeNumber: '',
        photoId: '',
        registryPhoneNumber: '+',
        status: false,
    });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

    const handleCheckboxChange = (e) => {
        const value = e.target.value === 'true';

        setFormData(prev => ({
            ...prev,
            status: value,
        }));
    };

    async function handleAdd(e) {
        e.preventDefault();

        let photoId = ''
        if (photo) {
            photoId = await CreatePhotoFetchAsync(photo);
        }

        const createOfficeModel = new OfficeModelRequest(formData.city, formData.street, formData.houseNumber, formData.officeNumber,
            photoId, formData.registryPhoneNumber, formData.status);
        await CreateOfficeFetchAsync(createOfficeModel);
    }

    return (
        <>
            <Toolbar
                pageTitle="Offices"
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
                                                <tr key={editableOffice.id} onClick={() => navigate(`/office/${editableOffice.id}`)}
                                                    style={{ cursor: 'pointer' }}
                                                >
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
                                <div class="img-container">
                                    <ImageUploader
                                        setPhoto={setPhoto}
                                    />
                                </div>
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
                                <CheckboxWrapper
                                    type="radio"
                                    label="Status active"
                                    id="statusActive"
                                    value={true}
                                    checked={formData.status === true}
                                    onChange={handleCheckboxChange}
                                    required
                                />
                                <CheckboxWrapper
                                    type="radio"
                                    label="Status inactive"
                                    id="statusInactive"
                                    value={false}
                                    checked={formData.status === false}
                                    onChange={handleCheckboxChange}
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
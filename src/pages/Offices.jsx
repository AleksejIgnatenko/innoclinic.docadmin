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

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                //const fetchedOffices = await GetAllOfficesFetchAsync();
                const fetchedOffices = [
                    {
                        "id": "eb2f16f7-b057-458b-832e-76bad03a178a",
                        "city": "Гомель",
                        "street": "пушкина",
                        "houseNumber": "3",
                        "officeNumber": "",
                        "longitude": "52.43014",
                        "latitude": "31.013527",
                        "photoId": "00000000-0000-0000-0000-000000000000",
                        "registryPhoneNumber": "+375(00)000-00-00",
                        "isActive": true
                    },
                    {
                        "id": "788b5223-8e80-4a30-8744-639e5e80e3ad",
                        "city": "Минск",
                        "street": "Победы",
                        "houseNumber": "1",
                        "officeNumber": "",
                        "longitude": "53.927103",
                        "latitude": "27.536687",
                        "photoId": "00000000-0000-0000-0000-000000000000",
                        "registryPhoneNumber": "+375(00)000-00-00",
                        "isActive": false
                    },
                    {
                        "id": "d324b5a6-4b90-4121-8270-4a18f17bd0ff",
                        "city": "Минск",
                        "street": "Победы",
                        "houseNumber": "1",
                        "officeNumber": "",
                        "longitude": "53.927103",
                        "latitude": "27.536687",
                        "photoId": "00000000-0000-0000-0000-000000000000",
                        "registryPhoneNumber": "+375(00)000-00-00",
                        "isActive": true
                    },
                    {
                        "id": "99601714-8256-489a-a33c-5ec08e1ffc1e",
                        "city": "Минск",
                        "street": "Победы",
                        "houseNumber": "2",
                        "officeNumber": "",
                        "longitude": "53.926913",
                        "latitude": "27.535717",
                        "photoId": "00000000-0000-0000-0000-000000000000",
                        "registryPhoneNumber": "+375(00)000-00-00",
                        "isActive": true
                    }
                ]
                setOffices(fetchedOffices);

                const formattedOffices = fetchedOffices.map(({ id, city, street, houseNumber, officeNumber, registryPhoneNumber, isActive }) => ({
                    id,
                    address: city + " " + street + " " + houseNumber + " " + officeNumber,
                    status: isActive ? 'Active' : 'Inactive',
                    registryPhoneNumber,
                }));

                setEditableOffices(formattedOffices);
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
        const filtered = offices.filter(item => {
            return (
                item.city.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.street.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.houseNumber.toString().includes(lowerCaseSearchTerm) ||
                item.officeNumber.toString().includes(lowerCaseSearchTerm)
            );
        }).map(({ id, city, street, houseNumber, officeNumber, registryPhoneNumber, isActive }) => ({
            id,
            address: city + " " + street + " " + houseNumber + " " + officeNumber,
            status: isActive ? 'Active' : 'Inactive',
            registryPhoneNumber,
        }));

        setEditableOffices(filtered);
    }, [searchTerm, offices]);


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
                                    <Table
                                        items={editableOffices}
                                    />
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
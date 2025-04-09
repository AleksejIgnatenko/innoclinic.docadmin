import { useNavigate } from "react-router-dom";
import useReceptionistForm from "../hooks/useReceptionistForm";
import { useEffect, useState } from "react";
import GetAllOfficesFetchAsync from "../api/Offices.API/GetAllOfficesFetchAsync";
import GetAllReceptionistsFetchAsync from "../api/Profiles.API/GetAllReceptionistsFetchAsync";
import CreatePhotoFetchAsync from "../api/Documents.API/CreatePhotoFetchAsync";
import Toolbar from "../components/organisms/Toolbar";
import Loader from "../components/organisms/Loader";
import Table from "../components/organisms/Table";
import FieldNames from "../enums/FieldNames";
import FormModal from "../components/organisms/FormModal";
import ImageUploader from "../components/organisms/ImageUploader";
import { InputWrapper } from "../components/molecules/InputWrapper";
import { SelectWrapper } from "../components/molecules/SelectWrapper";
import { ButtonBase } from "../components/atoms/ButtonBase";
import workStatuses from "../enums/WorkStatuses";
import CreateReceptionistFetchAsync from "../api/Profiles.API/CreateReceptionistFetchAsync";
import { IconBase } from "../components/atoms/IconBase";
import DeleteReceptionistFetchAsync from "../api/Profiles.API/DeleteReceptionistFetchAsync";

export default function Receptionists() {
    const navigate = useNavigate();

    const [receptionists, setReceptionists] = useState([]);
    const [editableReceptionists, setEditableReceptionists] = useState([]);

    const [offices, setOffices] = useState([]);
    const [officeOptions, setOfficeOptions] = useState([]);

    const [photo, setPhoto] = useState(null);

    const { formData, setFormData, errors, handleChange, handleBlur, resetForm, isFormValid } = useReceptionistForm({
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        officeId: '',
        status: '',
    });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const columnNames = [
        'receptionistFullName',
        'address',
    ];

    const fetchData = async () => {
        try {
            toggleLoader(true);

            const fetchedReceptionists = await GetAllReceptionistsFetchAsync();
            setReceptionists(fetchedReceptionists);

            const formattedReceptionists = formatReceptionists(fetchedReceptionists);
            setEditableReceptionists(formattedReceptionists);

            const fetchedOffices = await GetAllOfficesFetchAsync();
            setOffices(fetchedOffices);
            const officeOptions = fetchedOffices.map(({ id, city, street, houseNumber, officeNumber }) => ({
                id,
                value: `${city} ${street} ${houseNumber} ${officeNumber}`
            }))
            setOfficeOptions(officeOptions);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            toggleLoader(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatReceptionists = (receptionists) => {
        return receptionists.map(({ id, firstName, lastName, middleName, office }) => ({
            id,
            receptionistFullName: `${firstName} ${lastName} ${middleName}`,
            address: `${office.city} ${office.street} ${office.houseNumber} ${office.officeNumber}`,
        }));
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleAddModal = () => {
        setIsAddModalOpen(!isAddModalOpen);
    };

    const toggleAddModalClick = () => {
        const confirmCancel = isAddModalOpen
            ? window.confirm("Do you really want to cancel? Entered data will not be saved.")
            : true;
    
        if (confirmCancel) {
            setIsAddModalOpen(prev => {
                const newState = !prev;
                if (!newState) {
                    resetForm();
                }
                return newState;
            });
        }
    };

    async function handleAdd(e) {
        e.preventDefault();

        let photoId = '';
        if (photo) {
            photoId = await CreatePhotoFetchAsync(photo);
        }

        const createReceptionistRequest = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            middleName: formData.middleName,
            email: formData.email,
            officeId: formData.officeId,
            status: formData.status,
            photoId: photoId
        }

        await CreateReceptionistFetchAsync(createReceptionistRequest);
        fetchData();
    }

    async function handleDelete(id) {
        const confirmCancel = window.confirm("Do you really want to delete this patient? This action cannot be undone.");

        if (confirmCancel) {
            await DeleteReceptionistFetchAsync(id);
        } 
    }

    return (
        <>
            <Toolbar
                pageTitle="Receptionists"
                setSearchTerm={setSearchTerm}
                showAddIcon={true}
                toggleCreateModalClick={toggleAddModal}
            />
            {isLoading ? (<Loader />
            ) : (
                <div className="page">
                    {receptionists.length === 0 ? (
                        <p className="no-items">Receptionists not found</p>
                    ) : (
                        <>
                            {editableReceptionists.length === 0 && (
                                <p className="no-items">Nothing was found</p>
                            )}
                            {editableReceptionists.length > 0 && (
                                <div className="table">
                                    <Table>
                                        <thead>
                                            <tr>
                                                {columnNames.map(columnName => (
                                                    <th key={columnName}>{FieldNames[columnName]}</th>
                                                ))}
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {editableReceptionists.map(editableReceptionist => (
                                                <tr key={editableReceptionist.id} onClick={() => navigate(`/receptionist/${editableReceptionist.id}`)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {columnNames.map(columnName => (
                                                        <td key={columnName}>{editableReceptionist[columnName]}</td>
                                                    ))}
                                                    <td>
                                                        <div className="table-actions">
                                                            <IconBase
                                                                name='bx-x-circle'
                                                                className='delete-icon'
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(editableReceptionist.id);
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </>
                    )}

                    {isAddModalOpen && (
                        <FormModal title="Add receptionist" onClose={toggleAddModalClick} onSubmit={handleAdd} showCloseButton={true}>
                            <div className="modal-inputs">
                                <div class="img-container">
                                    <ImageUploader
                                        setPhoto={setPhoto}
                                    />
                                </div>
                                <InputWrapper
                                    type="text"
                                    label="First Name"
                                    id="firstName"
                                    value={formData.firstName}
                                    onBlur={handleBlur('firstName')}
                                    onChange={handleChange('firstName')}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Last Name"
                                    id="lastName"
                                    value={formData.lastName}
                                    onBlur={handleBlur('lastName')}
                                    onChange={handleChange('lastName')}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Middle Name"
                                    id="middleName"
                                    value={formData.middleName}
                                    onBlur={handleBlur('middleName', false)}
                                    onChange={handleChange('middleName', false)}
                                    required
                                />
                                <InputWrapper
                                    type="email"
                                    label="Email"
                                    id="email"
                                    value={formData.email}
                                    onBlur={handleBlur('email')}
                                    onChange={handleChange('email')}
                                    required
                                />
                                <SelectWrapper
                                    label="Office"
                                    id="office"
                                    value={formData.officeId}
                                    onBlur={handleBlur('officeId')}
                                    onChange={handleChange('officeId')}
                                    required
                                    placeholder={formData.officeId ? "" : "Select office"}
                                    options={officeOptions}
                                />
                                <SelectWrapper
                                    label="Status"
                                    id="status"
                                    value={formData.status}
                                    onBlur={handleBlur('status')}
                                    onChange={handleChange('status')}
                                    required
                                    placeholder={formData.status ? formData.status : "Выберите статус"}
                                    options={workStatuses}
                                />
                            </div>
                            <div className="form-actions">
                                <ButtonBase type="submit" disabled={!isFormValid}>
                                    Confirm
                                </ButtonBase>
                                <ButtonBase variant="secondary" onClick={toggleAddModalClick}>
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
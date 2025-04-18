import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePatientForm from "../hooks/usePatientForm";
import Toolbar from "../components/organisms/Toolbar";
import Loader from "../components/organisms/Loader";
import Table from "../components/organisms/Table";
import FieldNames from "../enums/FieldNames";
import FormModal from "../components/organisms/FormModal";
import { InputWrapper } from "../components/molecules/InputWrapper";
import { ButtonBase } from "../components/atoms/ButtonBase";

import GetAllPatientsFetchAsync from "../api/Profiles.API/GetAllPatientsFetchAsync";
import { IconBase } from "../components/atoms/IconBase";
import CreatePatientFetchAsync from "../api/Profiles.API/CreatePatientFetchAsync";
import DeletePatientFetchAsync from "../api/Profiles.API/DeletePatientFetchAsync";

export default function Patients() {
    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);
    const [editablePatients, setEditablePatients] = useState([]);

    const { formData, setFormData, errors, handleChange, handleBlur, resetForm, isFormValid } = usePatientForm({
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: '',
    });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const columnNames = [
        'fullName',
        'patientPhoneNumber',
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedPatients = await GetAllPatientsFetchAsync()
                setPatients(fetchedPatients);
                console.log(fetchedPatients);

                const formattedPatients = formatPatients(fetchedPatients);
                setEditablePatients(formattedPatients);
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
        const filteredPatients = patients.filter(item => {
            return (
                item.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.middleName.toLowerCase().includes(lowerCaseSearchTerm)
            );
        })

        const formattedPatients = formatPatients(filteredPatients);

        setEditablePatients(formattedPatients);
    }, [searchTerm, patients]);

    const formatPatients = (patients) => {
        return patients.map(({ id, firstName, lastName, middleName, account }) => ({
            id,
            fullName: `${firstName} ${lastName} ${middleName}`,
            patientPhoneNumber: account ? (account.phoneNumber || "Phone number not found") : "Phone number not found",
        }));
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleAddModalClick = () => {
        const confirmCancel = isAddModalOpen ? window.confirm("Do you really want to cancel? Entered data will not be saved.") : true;

        if (confirmCancel) {
            setIsAddModalOpen((prev) => {
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

        await CreatePatientFetchAsync(formData);
    }

    async function handleDelete(id) {
        const confirmCancel = window.confirm("Do you really want to delete this patient? This action cannot be undone.");
    
        if (confirmCancel) {
            await DeletePatientFetchAsync(id);
        } 
    }

    return (
        <>
            <Toolbar
                pageTitle="Patients"
                showSearch={true}
                setSearchTerm={setSearchTerm}
                showAddIcon={true}
                toggleCreateModalClick={toggleAddModalClick}
            />
            {isLoading ? (<Loader />
            ) : (
                <div className="page">
                    {patients.length === 0 ? (
                        <p className="no-items">Patients not found</p>
                    ) : (
                        <>
                            {editablePatients.length === 0 && (
                                <p className="no-items">Nothing was found</p>
                            )}
                            {editablePatients.length > 0 && (
                                <div className="table">
                                    <Table>
                                        <thead>
                                            <tr>
                                                {columnNames.map(columnName => (
                                                    <th key={columnName}>
                                                        {FieldNames[columnName]}
                                                    </th>
                                                ))}
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {editablePatients.map(editablePatient => (
                                                <tr key={editablePatient.id} onClick={() => navigate(`/patient/${editablePatient.id}?tab=personal-information`)} style={{ cursor: 'pointer' }}>
                                                {columnNames.map(columnName => (
                                                    <td key={columnName}>{editablePatient[columnName]}</td>
                                                ))}
                                                <td>
                                                    <div className="table-actions">
                                                        <IconBase
                                                            name='bx-x-circle'
                                                            className='delete-icon'
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(editablePatient.id);
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
                        <FormModal title="Add patient" onClose={toggleAddModalClick} onSubmit={handleAdd} showCloseButton={true}>
                            <div className="modal-inputs">
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
                                    onBlur={handleBlur('middleName')}
                                    onChange={handleChange('middleName')}
                                    required
                                />
                                <InputWrapper
                                    type="date"
                                    label="Date Of Birth"
                                    id="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onBlur={handleBlur('dateOfBirth')}
                                    onChange={handleChange('dateOfBirth')}
                                    required
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
import { useEffect, useState } from "react";
import GetAllSpecializationFetchAsync from "../api/Services.API/GetAllSpecializationFetchAsync";
import FieldNames from "../enums/FieldNames";
import useSpecializationForm from "../hooks/useSpecializationForm";
import { useNavigate } from "react-router-dom";
import Toolbar from "../components/organisms/Toolbar";
import Loader from "../components/organisms/Loader";
import Table from "../components/organisms/Table";
import FormModal from "../components/organisms/FormModal";
import { InputWrapper } from "../components/molecules/InputWrapper";
import CheckboxWrapper from "../components/molecules/CheckboxWrapper";
import { ButtonBase } from "../components/atoms/ButtonBase";
import SpecializationModelRequest from "../models/specializationModels/SpecializationModelRequest";
import CreateSpecializationFetchAsync from "../api/Services.API/CreateSpecializationFetchAsync";


export default function Specializations() {
    const navigate = useNavigate();

    const [specializations, setSpecializations] = useState([]);
    const [editableSpecializations, setEditableSpecializations] = useState([]);

    const { formData, setFormData, errors, handleChange, handleBlur, resetForm, isFormValid } = useSpecializationForm({
        specializationName: '',
        isActive: false,
    });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const columnNames = [
        'specializationName',
        'isActive',
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedSpecializations = await GetAllSpecializationFetchAsync()
                setSpecializations(fetchedSpecializations);

                const formattedSpecializations = formatSpecializations(fetchedSpecializations);
                setEditableSpecializations(formattedSpecializations);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

    const formatSpecializations = (specializations) => {
        return specializations.map(({ id, specializationName, isActive }) => ({
            id,
            specializationName,
            isActive: isActive ? 'Active' : 'Inactive',
        }));
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleAddModalClick = () => {
        setIsAddModalOpen((prev) => {
            const newState = !prev;
            if (!newState) {
                resetForm();
            }
            return newState;
        });
    };

    const handleCheckboxChange = (e) => {
        const value = e.target.value === 'true';

        setFormData(prev => ({
            ...prev,
            isActive: value,
        }));
    };


    async function handleAdd(e) {
        e.preventDefault();

        const createSpecializationModel = new SpecializationModelRequest(formData.specializationName, formData.isActive);
        await CreateSpecializationFetchAsync(createSpecializationModel);
    }

    return (
        <>
            <Toolbar
                pageTitle="Specializations"
                showAddIcon={true}
                toggleCreateModalClick={toggleAddModalClick}
            />
            {isLoading ? (<Loader />
            ) : (
                <div className="page">
                    {specializations.length === 0 ? (
                        <p className="no-items">Specializations not found</p>
                    ) : (
                        <>
                            {editableSpecializations.length === 0 && (
                                <p className="no-items">Nothing was found</p>
                            )}
                            {editableSpecializations.length > 0 && (
                                <div className="table">
                                    <Table>
                                        <thead>
                                            <tr>
                                                {columnNames.map(columnName => (
                                                    <th key={columnName}>
                                                        {FieldNames[columnName]}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {editableSpecializations.map(editableSpecialization => (
                                                <tr key={editableSpecialization.id} onClick={() => navigate(`/specialization/${editableSpecialization.id}`)}
                                                    style={{cursor: 'pointer'}}
                                                >
                                                    {columnNames.map(columnName => (
                                                        <td key={columnName}>{editableSpecialization[columnName]}</td>
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
                        <FormModal title="Add specialization" onClose={toggleAddModalClick} onSubmit={handleAdd} showCloseButton={true}>
                            <div className="modal-inputs">
                                <InputWrapper
                                    type="text"
                                    label="Specialization Name"
                                    id="specializationName"
                                    value={formData.specializationName}
                                    onBlur={handleBlur('specializationName')}
                                    onChange={handleChange('specializationName')}
                                    required
                                />
                                <CheckboxWrapper
                                    type="radio"
                                    label="Status active"
                                    id="statusActive"
                                    value={true}
                                    checked={formData.isActive === true}
                                    onChange={handleCheckboxChange}
                                    required
                                />
                                <CheckboxWrapper
                                    type="radio"
                                    label="Status inactive"
                                    id="statusInactive"
                                    value={false}
                                    checked={formData.isActive === false}
                                    onChange={handleCheckboxChange}
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
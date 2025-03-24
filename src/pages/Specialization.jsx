import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSpecializationForm from "../hooks/useSpecializationForm";
import Loader from "../components/organisms/Loader";
import ProfileCard from "../components/organisms/ProfileCard";
import { IconBase } from "../components/atoms/IconBase";
import { InputWrapper } from "../components/molecules/InputWrapper";
import CheckboxWrapper from "../components/molecules/CheckboxWrapper";
import Table from "../components/organisms/Table";
import FieldNames from "../enums/FieldNames";
import GetSpecializationByIdAsync from "../api/Services.API/GetSpecializationByIdAsync";
import GetServicesBySpecializationIdFetchAsync from "../api/Services.API/GetServicesBySpecializationIdFetchAsync";
import SpecializationModelRequest from "../models/specializationModels/SpecializationModelRequest";
import UpdateSpecializationFetchAsync from "../api/Services.API/UpdateSpecializationFetchAsync";

function Specialization() {
    const { id } = useParams();

    const [specialization, setSpecialization] = useState(null);
    const [services, setServices] = useState([]);

    const { formData, setFormData, errors, handleChange, handleBlur, resetForm, isFormValid } = useSpecializationForm({
        specializationName: '',
        isActive: false,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const columnNames = [
        'serviceName',
        'price',
        'isActive',
        'categoryName',
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                if (id) {
                    const fetchedSpecialization = await GetSpecializationByIdAsync(id);
                    setFormData(fetchedSpecialization);
                    setSpecialization(fetchedSpecialization);

                    const fetchedServices = await GetServicesBySpecializationIdFetchAsync(fetchedSpecialization.id);
                    const formatedServices = formatServices(fetchedServices);
                    setServices(formatedServices);
                }
            } catch (error) {
                console.error('Error fetching specialization:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

    const formatServices = (services) => {
        return services.map(({ id, serviceName, price, isActive, serviceCategory }) => ({
            id,
            serviceName,
            price,
            isActive: isActive ? 'Active' : 'Inactive',
            categoryName: serviceCategory.categoryName,
        }));
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleEditClick = () => {
        if (isEditing) {
            setFormData(specialization);
        }
        setIsEditing(!isEditing);
    };

    const handleCheckboxChange = (e) => {
        const value = e.target.value === 'true';

        setFormData(prev => ({
            ...prev,
            isActive: value,
        }));
    };

    async function handleUpdate() {
        setIsEditing(false);

        const updateSpecializationModel = new SpecializationModelRequest(formData.specializationName, formData.isActive);

        setSpecialization(updateSpecializationModel)

        await UpdateSpecializationFetchAsync(specialization.id, updateSpecializationModel);
    }

    return (
        <>
            {isLoading ? <Loader /> : (
                <div>
                    <ProfileCard>
                        <div className="profile-icon-container">
                            {isEditing ? (
                                <>
                                    <IconBase name={"bx-check"} onClick={handleUpdate} style={{ cursor: 'pointer' }} />
                                    <IconBase name={"bx-x"} onClick={toggleEditClick} />
                                </>

                            ) : (
                                <IconBase name={"bx-pencil"} onClick={toggleEditClick} style={{ cursor: 'pointer' }} />
                            )}
                        </div>

                        {isEditing ? (
                            <div>
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
                            </div>) : (
                            <div className="profile-content">
                                {specialization ? (
                                    <>
                                        <p>Specialization Name: {specialization.specializationName}</p>
                                        <p>Status: {specialization.status ? "Active" : "Inactive"}</p>
                                    </>
                                ) : (
                                    <p>No specialization information available</p>
                                )}
                            </div>
                        )}
                    </ProfileCard>
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
                                {services.map(service => (
                                    <tr key={service.id}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {columnNames.map(columnName => (
                                            <td key={columnName}>{service[columnName]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
            )}
        </>
    );
}

export default Specialization;
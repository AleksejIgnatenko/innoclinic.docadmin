import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import useServiceForm from "../hooks/useServiceForm";
import FormModal from "../components/organisms/FormModal";
import CreateMedicalServiceAsync from "../api/Services.API/CreateMedicalServiceAsync";
import { SelectWrapper } from "../components/molecules/SelectWrapper";
import GetAllServiceCategoryFetchAsync from "../api/Services.API/GetAllServiceCategoryFetchAsync";
import GetAllSpecializationFetchAsync from "../api/Services.API/GetAllSpecializationFetchAsync";
import { ButtonBase } from "../components/atoms/ButtonBase";

function Specialization() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [specialization, setSpecialization] = useState(null);
    const [specializations, setSpecializations] = useState([]);
    const [services, setServices] = useState([]);
    const [category, setCategories] = useState([]);

    const [specializationOptions, setSpecializationOptions] = useState([]);
    const [categoryOptions, setcategoryOptions] = useState([]);

    const [isServiceAddModalOpen, setIsServiceAddModalOpen] = useState(false);

    const { formData, setFormData, errors, setErrors, handleChange, handleBlur, isFormValid } = useSpecializationForm({
        specializationName: '',
        isActive: false,
    });

    const { serviceFormData, setServiceFormData, serviceErrors, handleChangeService, handleBlurService, resetFormService, isServiceFormValid } = useServiceForm({
        serviceName: '',
        price: 0,
        serviceCategoryId: '',
        specializationId: '',
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

                    const fetchedSpecializations = await GetAllSpecializationFetchAsync()
                    setSpecializations(fetchedSpecializations);

                    const specializationOptions = fetchedSpecializations.map(({ id, specializationName }) => ({
                        id,
                        value: specializationName
                    }))
                    setSpecializationOptions(specializationOptions);

                    const fetchedServices = await GetServicesBySpecializationIdFetchAsync(fetchedSpecialization.id);
                    const formatedServices = formatServices(fetchedServices);
                    setServices(formatedServices);

                    const fetchedCategories = await GetAllServiceCategoryFetchAsync()
                    setCategories(fetchedCategories);

                    const categoryOptions = fetchedCategories.map(({ id, categoryName }) => ({
                        id,
                        value: categoryName
                    }))
                    setcategoryOptions(categoryOptions);
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
            const confirmCancel = window.confirm("Do you really want to cancel? Changes will not be saved.");
            if (!confirmCancel) {
                return;
            }
            setFormData(specialization);
        }
        setErrors({
            specializationName: true,
        });
        setIsEditing(!isEditing);
    };

    const toggleServiceAddModalClick = () => {
        setIsServiceAddModalOpen((prev) => {
            const newState = !prev;
            if (!newState) {
                resetFormService();
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

    const handleCheckboxChangeService = (e) => {
        const value = e.target.value === 'true';
        console.log(value);

        setServiceFormData(prev => ({
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

    async function handleAddService(e) {
        e.preventDefault();

        await CreateMedicalServiceAsync(serviceFormData);
    }

    return (
        <>
            <Toolbar pageTitle="Specialization" />
            {isLoading ? <Loader /> : (
                <div>
                    <ProfileCard>
                        <div className="profile-icon-container">
                            {isEditing ? (
                                <>
                                    <IconBase
                                        name={"bx-check"}
                                        onClick={isFormValid ? handleUpdate : null}
                                        style={{ cursor: isFormValid ? 'pointer' : 'not-allowed' }}
                                        className={isFormValid ? '' : 'icon-invalid'}
                                    />
                                    <IconBase name={"bx-x"} onClick={toggleEditClick} />
                                    <IconBase name={"bx-plus"} onClick={toggleServiceAddModalClick} />
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
                                    <tr key={service.id} onClick={() => navigate(`/service/${service.id}`)}
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

                    {isServiceAddModalOpen && (
                        <FormModal title="Add service" onClose={toggleServiceAddModalClick} onSubmit={handleAddService} showCloseButton={true}>
                            <div className="modal-inputs">
                                <InputWrapper
                                    type="text"
                                    label="Service Name"
                                    id="serviceName"
                                    value={serviceFormData.serviceName}
                                    onBlur={handleBlurService('serviceName')}
                                    onChange={handleChangeService('serviceName')}
                                    required
                                />
                                <InputWrapper
                                    type="number"
                                    label="Price"
                                    id="price"
                                    value={serviceFormData.price}
                                    onBlur={handleBlurService('price')}
                                    onChange={handleChangeService('price')}
                                    required
                                />
                                <SelectWrapper
                                    label="Category"
                                    id="category"
                                    value={serviceFormData.serviceCategoryId}
                                    onBlur={handleBlurService('serviceCategoryId')}
                                    onChange={handleChangeService('serviceCategoryId')}
                                    required
                                    placeholder={serviceFormData.serviceCategoryId ? "" : "Selecl category"}
                                    options={categoryOptions}
                                />
                                <SelectWrapper
                                    label="Specialization"
                                    id="specialization"
                                    value={serviceFormData.specializationId}
                                    onBlur={handleBlurService('specializationId')}
                                    onChange={handleChangeService('specializationId')}
                                    required
                                    placeholder={serviceFormData.specializationId ? "" : "Selecl specialization"}
                                    options={specializationOptions}
                                />
                                <CheckboxWrapper
                                    type="radio"
                                    label="Status active"
                                    id="statusServiceActive"
                                    value={true}
                                    checked={serviceFormData.isActive === true}
                                    onChange={handleCheckboxChangeService}
                                    required
                                />
                                <CheckboxWrapper
                                    type="radio"
                                    label="Status inactive"
                                    id="statusServiceInactive"
                                    value={false}
                                    checked={serviceFormData.isActive === false}
                                    onChange={handleCheckboxChangeService}
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <ButtonBase type="submit" disabled={!isServiceFormValid}>
                                    Confirm
                                </ButtonBase>
                                <ButtonBase variant="secondary" onClick={toggleServiceAddModalClick}>
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

export default Specialization;
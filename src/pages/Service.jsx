import { useEffect, useState } from "react";
import GetServiceByIdFetchAsync from "../api/Services.API/GetServiceByIdFetchAsync";
import useServiceForm from "../hooks/useServiceForm";
import { useParams } from "react-router-dom";
import Loader from "../components/organisms/Loader";
import ProfileCard from "../components/organisms/ProfileCard";
import { IconBase } from "../components/atoms/IconBase";
import { InputWrapper } from "../components/molecules/InputWrapper";
import { SelectWrapper } from "../components/molecules/SelectWrapper";
import GetAllServiceCategoryFetchAsync from "../api/Services.API/GetAllServiceCategoryFetchAsync";
import GetAllSpecializationFetchAsync from "../api/Services.API/GetAllSpecializationFetchAsync";
import CheckboxWrapper from "../components/molecules/CheckboxWrapper";
import UpdateMedicalServiceFetchAsync from "../api/Services.API/UpdateMedicalServiceFetchAsync";

function Service() {
    const { id } = useParams();

    const [service, setService] = useState(null);

    const [specializations, setSpecializations] = useState([]);
    const [category, setCategories] = useState([]);

    const [specializationOptions, setSpecializationOptions] = useState([]);
    const [categoryOptions, setcategoryOptions] = useState([]);

    const { serviceFormData, setServiceFormData, serviceErrors, handleChangeService, handleBlurService, resetFormService, isServiceFormValid } = useServiceForm({
        serviceName: '',
        price: 0,
        serviceCategoryId: '',
        specializationId: '',
        isActive: false,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                if (id) {
                    const fetchedService = await GetServiceByIdFetchAsync(id);
                    setService(fetchedService);

                    const formattedService = formatService(fetchedService);
                    setServiceFormData(formattedService);
                    console.log(formattedService);

                    const fetchedSpecializations = await GetAllSpecializationFetchAsync()
                    setSpecializations(fetchedSpecializations);

                    const specializationOptions = fetchedSpecializations.map(({ id, specializationName }) => ({
                        id,
                        value: specializationName
                    }))
                    setSpecializationOptions(specializationOptions);

                    const fetchedCategories = await GetAllServiceCategoryFetchAsync()
                    setCategories(fetchedCategories);

                    const categoryOptions = fetchedCategories.map(({ id, categoryName }) => ({
                        id,
                        value: categoryName
                    }))
                    setcategoryOptions(categoryOptions);
                }
            } catch (error) {
                console.error('Error fetching service:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

    const formatService = (service) => {
        const {
            id,
            serviceName,
            price,
            serviceCategory,
            specialization,
            isActive,
        } = service;
        return {
            id,
            serviceName,
            price,
            serviceCategoryId: serviceCategory.id,
            specializationId: specialization.id,
            isActive,
        };
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleEditClick = () => {
        if (isEditing) {
            setServiceFormData(service);
        }
        setIsEditing(!isEditing);
    };

    const handleCheckboxChangeService = (e) => {
        const value = e.target.value === 'true';

        setServiceFormData(prev => ({
            ...prev,
            isActive: value,
        }));
    };

    async function handleUpdate() {
        setIsEditing(false);

        await UpdateMedicalServiceFetchAsync(service.id, serviceFormData);
    }

    return (
        <>
            {isLoading ? <Loader /> : (
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
                        </div>) : (
                        <div className="profile-content">
                            {service ? (
                                <>
                                    <p>Service Name: {service.serviceName}</p>
                                    <p>Price: {service.price}</p>
                                    <p>Category Name: {service.serviceCategory.categoryName}</p>
                                    <p>Status: {service.isActive ? "Active" : "Inactive"}</p>
                                </>
                            ) : (
                                <p>No office information available</p>
                            )}
                        </div>
                    )}
                </ProfileCard>
            )}
        </>
    );
}

export default Service;
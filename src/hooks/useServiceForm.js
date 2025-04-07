import { useState } from 'react';
import FieldNames from '../enums/FieldNames';

const useServiceForm = (initialValues) => {
    const [serviceFormData, setServiceFormData] = useState(initialValues);
    const [serviceErrors, setServiceErrors] = useState({
        serviceCategoryId: false,
        serviceName: false,
        price: false,
        specializationId: false,
        isActive: true,
    });

    const updateInputState = (field, input, label) => {
        if (!input.value.trim()) {
            input.classList.add('error-input');
            label.classList.add('error-label');
            label.textContent = `Please, enter the ${FieldNames[field]}`;
            setServiceErrors(prev => ({
                ...prev,
                [field]: false
            }));
        } else {
            if (field === 'price') {
                const price = parseFloat(input.value);
                if (isNaN(price) || price <= 0) {
                    input.classList.add('error-input');
                    label.classList.add('error-label');
                    label.textContent = 'You entered an invalid price';
                    setServiceErrors(prev => ({
                        ...prev,
                        [field]: false
                    }));
                } else {
                    if (input && label) {
                        input.classList.remove('error-input');
                        label.classList.remove('error-label');
                        label.textContent = `${FieldNames[field]}`;
                    }
                    setServiceErrors(prev => ({
                        ...prev,
                        [field]: true
                    }));
                }
            } else {
                if (input && label) {
                    input.classList.remove('error-input');
                    label.classList.remove('error-label');
                    label.textContent = `${FieldNames[field]}`;
                }
                setServiceErrors(prev => ({
                    ...prev,
                    [field]: true
                }));
            }
        }
    };

    const handleChangeService = (field) => (e) => {
        const input = e.target;
        const label = document.querySelector(`label[for="${field}"]`);

        setServiceFormData(prev => ({
            ...prev,
            [field]: input.value
        }));

        updateInputState(field, input, label);
    };

    const handleBlurService = (field) => (event) => {
        const input = event.target;
        const label = document.querySelector(`label[for="${field}"]`);

        updateInputState(field, input, label);
    };

    const resetFormService = () => {
        setServiceFormData(initialValues);
        setServiceErrors({});
    };

    return {
        serviceFormData,
        setServiceFormData,
        serviceErrors,
        setServiceErrors,
        handleChangeService,
        handleBlurService,
        resetFormService,
        isServiceFormValid: Object.values(serviceErrors).every(value => value),
    };
};

export default useServiceForm;
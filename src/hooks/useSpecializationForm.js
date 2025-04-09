import { useState } from 'react';
import FieldNames from '../enums/FieldNames';

const useSpecializationForm = (initialValues) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({
        specializationName: false,
        isActive: true,
    });

    const updateInputState = (field, input, label) => {
        if (!input.value.trim()) {
            if (input && label) {
                input.classList.add('error-input');
                label.classList.add('error-label');
            }
            label.textContent = `Please, enter the ${FieldNames[field]}`;
            setErrors(prev => ({
                ...prev,
                [field]: false
            }));
        } else {
            if (input && label) {
                input.classList.remove('error-input');
                label.classList.remove('error-label');
                label.textContent = `${FieldNames[field]}`;
            }
            setErrors(prev => ({
                ...prev,
                [field]: true
            }));
        }
    };

    const handleChange = (field) => (e) => {
        const input = e.target;
        const label = document.querySelector(`label[for="${field}"]`);

        setFormData(prev => ({
            ...prev,
            [field]: input.value
        }));

        updateInputState(field, input, label);
    };

    const handleBlur = (field) => (event) => {
        const input = event.target;
        const label = document.querySelector(`label[for="${field}"]`);

        updateInputState(field, input, label);
    };

    const resetForm = () => {
        setFormData(initialValues);
        setErrors({
            specializationName: false,
            isActive: true,
        });
    };

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        handleChange,
        handleBlur,
        resetForm,
        isFormValid: Object.values(errors).every(value => value),
    };
};

export default useSpecializationForm;
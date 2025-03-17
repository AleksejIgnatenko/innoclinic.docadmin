import { useState, useEffect } from 'react';
import FieldNames from '../enums/FieldNames';

const usePatientForm = (initialValues) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        middleName: false,
        dateOfBirth: false,
        email: false,
        isLinkedToAccount: false,
    });

    const updateInputState = (field, input, label) => {
        if (!input.value.trim()) {
            if (input && label) {
                input.classList.add('error-input');
                label.classList.add('error-label');
                label.textContent = `Please, enter the ${FieldNames[field]}`;
            }
            setErrors(prev => ({
                ...prev,
                [field]: false
            }));
        } else if (field === 'email' && !input.value.includes('@')) {
            input.classList.add('error-input');
            label.classList.add('error-label');
            label.textContent = "You've entered an invalid email";
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
        setErrors({});
    };

    return {
        formData,
        errors,
        handleChange,
        handleBlur,
        resetForm,
        isFormValid: Object.values(errors).every(value => value),
    };
};

export default usePatientForm;
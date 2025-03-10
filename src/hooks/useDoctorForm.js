import { useState } from 'react';
import FieldNames from '../enums/FieldNames';

const useDoctorForm = (initialValues) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        middleName: false,
        dateOfBirth: false,
        email: false,
        specializationId: false,
        officeId: false,
        careerStartYear: false,
        status: false,
    });

    const updateInputState = (field, input, label) => {
        if (!input.value.trim()) {
            if (input && label) {
                input.classList.add('error-input');
                label.classList.add('error-label');

                label.textContent = `Please, enter the office’s ${FieldNames[field]}`;
            }
            setErrors(prev => ({
                ...prev,
                [field]: false
            }));
        } else {
            if (input && label) {
                input.classList.remove('error-input');
                label.classList.remove('error-label');

                label.textContent = `${field.charAt(0).toUpperCase() + field.slice(1)}`;
            }
            setErrors(prev => ({
                ...prev,
                [field]: true
            }));
        }
    };

    const handleChange = (field) => (e) => {
        const input = e.target;
        const label = document.querySelector(`label[for="${FieldNames[field]}"]`);

        setFormData(prev => ({
            ...prev,
            [field]: input.value
        }));

        updateInputState(field, input, label);
    };

    const handleBlur = (field) => (event) => {
        const input = event.target;
        const label = document.querySelector(`label[for="${FieldNames[field]}"]`);

        updateInputState(field, input, label);
    };

    return {
        formData,
        errors,
        handleChange,
        handleBlur,
        isFormValid: Object.values(errors).every(value => value),
    };
};

export default useDoctorForm;
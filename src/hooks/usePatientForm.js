import { useState } from 'react';
import FieldNames from '../enums/FieldNames';

const usePatientForm = (initialValues) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        phoneNumber: false,
        dateOfBirth: false,
    });

    const updateInputState = (field, input, label, validate) => {
        let currentDate;
        let inputDate;

        if (field === 'dateOfBirth') {
            currentDate = new Date();
            inputDate = new Date(input.value);
        }

        if (validate && !input.value.trim()) {
            if (input && label) {
                input.classList.add('error-input');
                label.classList.add('error-label');
                label.textContent = `Please, enter the ${FieldNames[field]}`;
            }
            setErrors(prev => ({
                ...prev,
                [field]: false
            }));
        } else if (validate && (field === 'dateOfBirth') && (inputDate > currentDate)) {
            input.classList.add('error-input');
            label.classList.add('error-label');

            label.textContent = "The date must be less than or equal to the current date.";

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

    const handleChange = (field, validate = true) => (e) => {
        const input = e.target;
        const label = document.querySelector(`label[for="${field}"]`);

        setFormData(prev => ({
            ...prev,
            [field]: input.value
        }));

        updateInputState(field, input, label, validate);
    };

    const handleBlur = (field, validate = true) => (event) => {
        const input = event.target;
        const label = document.querySelector(`label[for="${field}"]`);

        updateInputState(field, input, label, validate);
    };

    const handlePhoneNumberKeyDown = (event) => {
        const input = event.target;
    
        if (event.key === 'Backspace' && input.value === '+') {
            event.preventDefault();
        }
    };

    const resetForm = () => {
        setFormData(initialValues);
        setErrors({
            firstName: false,
            lastName: false,
            phoneNumber: false,
            dateOfBirth: false,
        });
    };

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        handleChange,
        handleBlur,
        handlePhoneNumberKeyDown,
        resetForm,
        isFormValid: Object.values(errors).every(value => value),
    };
};

export default usePatientForm;
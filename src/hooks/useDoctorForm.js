import { useState } from 'react';
import FieldNames from '../enums/FieldNames';

const useDoctorForm = (initialValues) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        middleName: true,
        dateOfBirth: false,
        email: false,
        specializationId: false,
        officeId: false,
        careerStartYear: false,
        status: false,
        photoId: true,
    });

    const updateInputState = (field, input, label) => {
        if (field !== 'middleName') {
            let currentDate;
            let inputDate;
            if(field === 'dateOfBirth' || field === 'careerStartYear'){
                currentDate = new Date();
                inputDate = new Date(input.value);
            }
            if (!input.value.trim()) {
                if (input && label) {
                    input.classList.add('error-input');
                    label.classList.add('error-label');
                }
                if (field === 'dateOfBirth') {
                    label.textContent = `Please, select the date`;
                } else {
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
            } else if ((field === 'dateOfBirth' || field === 'careerStartYear') && (inputDate > currentDate)) {
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
        setFormData,
        errors,
        setErrors,
        handleChange,
        handleBlur,
        resetForm,
        isFormValid: Object.values(errors).every(value => value),
    };
};

export default useDoctorForm;
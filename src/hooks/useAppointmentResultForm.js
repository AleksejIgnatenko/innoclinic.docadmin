import { useState } from 'react';
import FieldNames from '../enums/FieldNames';

const useAppointmentResultForm = (initialValues) => {
    const [appointmentResultFormData, setAppointmentResultFormData] = useState(initialValues);
    const [appointmentResultFormDataErrors, setAppointmentResultFormDataErrors] = useState({
        complaints: false,
        conclusion: false,
        recommendations: false,
        diagnosis: false,
    });

    const updateInputState = (field, input, label) => {
        if (!input.value.trim()) {
            if (input && label) {
                input.classList.add('error-input');
                label.classList.add('error-label');

                label.textContent = `Please, enter the office’s ${FieldNames[field]}`;
            }
            setAppointmentResultFormDataErrors(prev => ({
                ...prev,
                [field]: false
            }));
        } else {
            if (input && label) {
                input.classList.remove('error-input');
                label.classList.remove('error-label');

                label.textContent = `${FieldNames[field]}`;
            }
            setAppointmentResultFormDataErrors(prev => ({
                ...prev,
                [field]: true
            }));
        }
    };

    const handleChangeAppoimentResult = (field) => (e) => {
        const input = e.target;
        const label = document.querySelector(`label[for="${FieldNames[field]}"]`);

        setAppointmentResultFormData(prev => ({
            ...prev,
            [field]: input.value
        }));

        updateInputState(field, input, label);
    };

    const handleBlurAppoimentResult = (field) => (event) => {
        const input = event.target;
        const label = document.querySelector(`label[for="${FieldNames[field]}"]`);

        updateInputState(field, input, label);
    };

    return {
        appointmentResultFormData,
        setAppointmentResultFormData,
        setAppointmentResultFormDataErrors,
        appointmentResultFormDataErrors,
        handleChangeAppoimentResult,
        handleBlurAppoimentResult,
        isAppointmentResultFormValid: Object.values(appointmentResultFormDataErrors).every(value => value),
    };
};

export default useAppointmentResultForm;
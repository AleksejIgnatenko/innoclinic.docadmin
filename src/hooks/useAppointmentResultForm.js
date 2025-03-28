import { useState } from 'react';
import FieldNames from '../enums/FieldNames';

const useAppointmentResultForm = (initialValues) => {
  const [appointmentFormData, setAppointmentFormData] = useState(initialValues);
  const [appointmentErrors, setAppointmentErrors] = useState({
    complaints: false,
    conclusion: false,
    recommendations: false,
    appointmentId: false,
  });

  const updateInputState = (field, input, label) => {
    if (!input.value.trim()) {
      if (input && label) {
        input.classList.add('error-input');
        label.classList.add('error-label');

        label.textContent = `Please, enter the office’s ${FieldNames[field]}`;
      }
      setAppointmentErrors(prev => ({
        ...prev,
        [field]: false
      }));
    } else {
      if (input && label) {
        input.classList.remove('error-input');
        label.classList.remove('error-label');

        label.textContent = `${FieldNames[field]}`;
      }
      setAppointmentErrors(prev => ({
        ...prev,
        [field]: true
      }));
    }
  };

  const handleChangeAppointment = (field) => (e) => {
    const input = e.target;
    const label = document.querySelector(`label[for="${FieldNames[field]}"]`);

    setAppointmentFormData(prev => ({
      ...prev,
      [field]: input.value
    }));

    updateInputState(field, input, label);
  };

  const handleBlurAppointment = (field) => (event) => {
    const input = event.target;
    const label = document.querySelector(`label[for="${FieldNames[field]}"]`);

    updateInputState(field, input, label);
  };

  return {
    appointmentFormData,
    setAppointmentFormData,
    appointmentErrors,
    handleChangeAppointment,
    handleBlurAppointment,
    isAppointmentFormValid: Object.values(appointmentErrors).every(value => value),
  };
};

export default useAppointmentResultForm;
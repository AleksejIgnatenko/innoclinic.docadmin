import { useState } from 'react';
import FieldNames from '../enums/FieldNames';

const useAppointmentForm = (initialAppointmentValues) => {
  const [appointmentFormData, setAppointmentFormData] = useState(initialAppointmentValues);
  const [appointmentErrors, setAppointmentErrors] = useState({
    patientId: false,
    doctorId: false,
    medicalServiceId: false,
    date: false,
    time: false,
  });

  const updateAppointmentInputState = (field, input, label) => {
    let currentDate;
    let inputDate;

    if (field === 'date') {
      currentDate = new Date();
      inputDate = new Date(input.value);
    }

    if (!input.value.trim()) {
      if (input && label) {
        input.classList.add('error-input');
        label.classList.add('error-label');

        label.textContent = `Please, enter ${FieldNames[field]}`;
      }
      setAppointmentErrors(prev => ({
        ...prev,
        [field]: false
      }));
    } else if ((field === 'date') && (inputDate <= currentDate)) {
      input.classList.add('error-input');
      label.classList.add('error-label');
      label.textContent = "The date must be greater than the current date.";
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

  const handleAppointmentChange = (field) => (event) => {
    const input = event.target;
    const label = document.querySelector(`label[for="${field}"]`);

    setAppointmentFormData(prev => ({
      ...prev,
      [field]: input.value
    }));

    updateAppointmentInputState(field, input, label);
  };

  const handleAppointmentBlur = (field) => (event) => {
    const input = event.target;
    const label = document.querySelector(`label[for="${field}"]`);

    updateAppointmentInputState(field, input, label);
  };

  const resetAppointmentForm = () => {
    setAppointmentFormData(initialAppointmentValues);
    setAppointmentErrors({});
  };

  return {
    appointmentFormData,
    setAppointmentFormData,
    appointmentErrors,
    setAppointmentErrors,
    handleAppointmentChange,
    handleAppointmentBlur,
    resetAppointmentForm,
    isAppointmentFormValid: appointmentErrors.doctorId && appointmentErrors.medicalServiceId && appointmentErrors.date && appointmentErrors.time
  };
};

export default useAppointmentForm;
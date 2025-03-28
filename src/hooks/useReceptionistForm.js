import { useState } from 'react';
import FieldNames from '../enums/FieldNames';

const useReceptionistForm = (initialValues) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    middleName: true,
    email: false,
    officeId: false,
    status: false,
    photoId: true,
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

  const handleRegistryPhoneNumberKeyDown = (event) => {
    const input = event.target;

    if (event.key === 'Backspace' && input.value === '+') {
        event.preventDefault();
    }
  };

  const resetForm = () => {
    setFormData(initialValues);
    setErrors({});
};

  return {
    formData,
    setFormData,
    errors,
    handleChange,
    handleBlur,
    handleRegistryPhoneNumberKeyDown,
    resetForm,
    isFormValid: Object.values(errors).every(value => value),
  };
};

export default useReceptionistForm;
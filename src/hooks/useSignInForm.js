import { useState } from 'react';
import FieldNames from '../enums/FieldNames';

const useSignInForm = (initialValues) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({
    email: false,
    password: false
  });

  const updateInputState = (field, input, label) => {
    if (!input.value.trim()) {
      if (input && label) {
        input.classList.add('error-input');
        label.classList.add('error-label');

        label.textContent = `Please, enter the ${field}`;
      }
      setErrors(prev => ({
        ...prev,
        [field]: false
      }));
    } else if (field === 'password' && (input.value.length < 6 || input.value.length > 15)) {
      input.classList.add('error-input');
      label.classList.add('error-label');

      label.textContent = "The number of characters in the password must be from 6 to 15";

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

  return {
    formData,
    errors,
    handleChange,
    handleBlur,
    isFormValid: errors.email && errors.password
  };
};

export default useSignInForm;
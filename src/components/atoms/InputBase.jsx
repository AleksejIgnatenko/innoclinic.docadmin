import React from 'react';
import '../../styles/atoms/InputBase.css';

export const InputBase = ({
    type = 'text',
    value,
    checked,
    onBlur,
    onChange,
    onKeyDown,
    id,
    error,
    required,
    placeholder,
    fullWidth
}) => {
    return (
        <input
            type={type}
            id={id}
            value={value}
            checked={checked}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`input-base ${error ? 'error' : ''}`}
            style={fullWidth ? { width: '100%' } : {}}
        />
    );
};  
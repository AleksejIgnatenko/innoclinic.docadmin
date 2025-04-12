import React from 'react';
import '../../styles/atoms/SelectBase.css';

export const SelectBase = ({ options, value, onChange, id, error, required, placeholder, fullWidth }) => {
    return (
        <select
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            className={`select-base ${error ? 'error' : ''}`}
            style={fullWidth ? { width: '100%' } : {}}
        >
            <option value="" disabled hidden>{placeholder}</option>
            {options.map(option => (
                <option key={option.id} value={option.value}>
                    {option.displayValue}
                </option>
            ))}
        </select>
    );
};
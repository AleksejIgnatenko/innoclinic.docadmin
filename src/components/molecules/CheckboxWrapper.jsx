import React from 'react';
import CheckboxBase from '../atoms/CheckboxBase';
import '../../styles/molecules/CheckboxWrapper.css';

const CheckboxWrapper = ({ id, name, value, checked, onChange, label }) => {
    return (
        <div className="checkbox-wrapper">
            <CheckboxBase
                id={id}
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
            />
            <label htmlFor={id}> 
                {label}
            </label>
        </div>
    );
};

export default CheckboxWrapper;
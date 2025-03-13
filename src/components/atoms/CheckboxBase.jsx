import React from 'react';
import '../../styles/atoms/CheckboxBase.css';

const CheckboxBase = ({id, name, value, checked, onChange }) => {
    return (
        <input
            id={id}
            type="checkbox"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            className="checkbox-base"
        />
    );
};

export default CheckboxBase;
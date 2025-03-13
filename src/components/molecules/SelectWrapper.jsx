import React from 'react';
import '../../styles/molecules/SelectWrapper.css';
import { SelectBase } from '../atoms/SelectBase';
import { LabelBase } from '../atoms/LabelBase';

export const SelectWrapper = ({ 
    items,
    value,
    onBlur, 
    onChange,
    label,
    id,
    error,
    required,
    options,
    placeholder,
}) => {

    return (
        <div className={`select-wrapper`}>
            <SelectBase
                items={items}
                options={options}
                id={id}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                error={error}
                fullWidth
            />
            <LabelBase htmlFor={id} error={error}>
                {label}
            </LabelBase>
        </div>
    );
}; 
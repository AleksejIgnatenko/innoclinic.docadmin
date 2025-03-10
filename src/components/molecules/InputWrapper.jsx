import React from 'react';
import '../../styles/molecules/InputWrapper.css';
import { InputBase } from '../atoms/InputBase';
import { LabelBase } from '../atoms/LabelBase';

export const InputWrapper = ({ 
    type = 'text',
    value,
    checked,
    onBlur, 
    onChange,
    onKeyDown,
    label,
    id,
    error,
    required,
}) => {

    return (
        <div className={`input-wrapper`}>
            <InputBase
                type={type}
                id={id}
                value={value}
                checked={checked}
                onBlur={onBlur}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder=" "
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
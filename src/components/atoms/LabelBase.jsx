import React from 'react';
import '../../styles/atoms/LabelBase.css';

export const LabelBase = ({ htmlFor, error, children }) => {
    return (
        <label 
            htmlFor={htmlFor}
            className={`label ${error ? 'error-label' : ''}`}
        >
            {children}
        </label>
    );
}; 
import React from 'react';
import '../../styles/atoms/ButtonBase.css';

export const ButtonBase = ({
    type, 
    children, 
    variant = 'primary', 
    disabled = false, 
    onClick,
    className = '' 
}) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    
    return (
        <button 
            type={type}
            className={`${baseClass} ${variantClass} ${className} ${disabled ? 'btn-disabled' : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}; 
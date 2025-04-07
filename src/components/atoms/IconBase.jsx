import React from 'react';
import 'boxicons/css/boxicons.min.css';
import '../../styles/atoms/IconBase.css';

export const IconBase = ({ name, className = '', onClick }) => {
    return (
        <i 
            className={`bx ${name} ${className}`}
            onClick={onClick}
        />
    );
}; 
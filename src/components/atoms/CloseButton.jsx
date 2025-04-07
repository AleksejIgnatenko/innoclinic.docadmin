import React from 'react';
import '../../styles/atoms/CloseButton.css';

export const CloseButton = ({ onClick }) => {
    return (
        <button className="close-btn" onClick={onClick}>
            X
        </button>
    );
}; 
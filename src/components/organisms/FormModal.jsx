import React, { useEffect } from 'react';
import { CloseButton } from '../atoms/CloseButton';
import '../../styles/organisms/FormModal.css';

export default function FormModal({ children, onClose, onSubmit, title, showCloseButton }) {

    useEffect(() => {
        const handleEscapePress = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscapePress);

        return () => {
            document.removeEventListener('keydown', handleEscapePress);
        };
    }, [onClose]);

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-form">
                    <div className="modal-top-content">
                        <h2>{title}</h2>
                        {showCloseButton ? <CloseButton onClick={onClose} /> : null}
                    </div>
                    <form onSubmit={onSubmit}>
                        {children}
                    </form>
                </div>
            </div>
        </div>
    );
} 
import React, { useEffect } from 'react';
import { CloseButton } from '../atoms/CloseButton';
import '../../styles/organisms/FilterModal.css';

export default function FilterModal({ 
    children,
    onClose,
    handleSubmit,
}) {

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

    const handleOverlayClick = (e) => {
        if (e.target.className === 'modal-overlay') {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-container">
                <div className="modal-form">
                    <div className="modal-top-content">
                        <h2>Фильтрация</h2>
                        <CloseButton onClick={onClose} />
                    </div>
                    <form>
                        {children}
                    </form>
                </div>
            </div>
        </div>
    );
} 
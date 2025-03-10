import React, { useState, useEffect, useMemo } from 'react';
import { ButtonBase } from '../atoms/ButtonBase';
import { CloseButton } from '../atoms/CloseButton';
import '../../styles/organisms/FilterModal.css';

export default function FilterModal({ 
    onClose, 
    items, 
    filterFields,
    onApplySort,
    initialFilters = {}
}) {
    const [selectedFilters, setSelectedFilters] = useState(initialFilters);

    useEffect(() => {
        setSelectedFilters(initialFilters);
    }, [initialFilters]);

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

    const uniqueValues = useMemo(() => {
        const values = {};
        filterFields.forEach(field => {
            const uniqueSet = new Set(items.map(item => item[field.field]));
            values[field.field] = Array.from(uniqueSet).sort();
        });
        return values;
    }, [items, filterFields]);

    const handleFilterSelect = (e, field, value) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const filteredItems = items.filter(item => {
            return Object.entries(selectedFilters).every(([field, value]) => {
                return !value || item[field] === value;
            });
        });

        onApplySort(filteredItems, selectedFilters);
        onClose();
    };

    const handleClearFilters = () => {
        onApplySort(items, {});
        onClose();
    };

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
                    <form onSubmit={handleSubmit}>
                        {filterFields.map((field) => (
                            <div key={field.field} className="filter-section">
                                <h3>{field.label}</h3>
                                <div className="filter-values">
                                    <ButtonBase
                                        onClick={(e) => handleFilterSelect(e, field.field, null)}
                                        variant={!selectedFilters[field.field] ? 'primary' : 'secondary'}
                                        className="filter-button"
                                    >
                                        Все
                                    </ButtonBase>
                                    {uniqueValues[field.field]?.map((value) => (
                                        <ButtonBase
                                            key={value}
                                            onClick={(e) => handleFilterSelect(e, field.field, value)}
                                            variant={selectedFilters[field.field] === value ? 'primary' : 'secondary'}
                                            className="filter-button"
                                        >
                                            {value}
                                        </ButtonBase>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="form-actions">
                            <ButtonBase type="submit" >
                                Применить
                            </ButtonBase>
                            <ButtonBase type="button" variant="secondary" onClick={handleClearFilters}>
                                Очистить
                            </ButtonBase>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 
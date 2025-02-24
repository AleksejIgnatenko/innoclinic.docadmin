import React from 'react';
import "./../styles/Table.css";
import ColumnNamesEnum from '../enums/ColumnNamesEnum';

const Table = ({
    items,

    showApproveButton = false,
    handleApprove = () => {},

    showCancelButton = false,
    handleCancel = () => {},

    useHandleRowClick = false,
    handleRowClick = () => {},

    showAppointmentsResults = false,
}) => {
    const getUniqueKeys = (items) => {
        const keys = new Set();
        items.forEach(item => {
            Object.keys(item).forEach(key => {
                if (key !== 'id' && key !== 'patientId') { 
                    keys.add(key);
                }
            });
        });
        return Array.from(keys);
    };

    const uniqueKeys = getUniqueKeys(items);

    return (
        <div className="doctor-table-container">
            <table>
                <thead>
                    <tr>
                        {uniqueKeys.map((key) => (
                            <th key={key}>
                                {ColumnNamesEnum[key] || key.charAt(0).toUpperCase() + key.slice(1)}
                            </th>
                        ))}
                        {showAppointmentsResults && <th>Medical Results</th>}
                        {(showApproveButton || showCancelButton) && <th></th>}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr
                            id={item.id}
                            key={item.id}
                            onClick={useHandleRowClick ? () => handleRowClick(item.id) : null}
                            className={item.status && item.status === 'Approved' ? 'approved-appointment' : ''}

                        >
                            {uniqueKeys.map((key) => (
                                <td key={key} data-label={key} style={{cursor: useHandleRowClick ? 'pointer' : 'default'}}>
                                    {key === 'fullNameOfThePatient' && item.status === 'Approved' ? (
                                        <a href={`/patientProfile/${item.patientId}`}>
                                            {item[key] || "Not found"}
                                        </a>
                                    ) : (
                                        item[key] || "Not found"
                                    )}
                                </td>
                            ))}
                            {showAppointmentsResults && (
                                <td>
                                    {item.status === 'Approved' ? (
                                        <a href={`https://example.com/results/${item.id}`}>View Medical Results</a>
                                    ) : (
                                        "Results are not available"
                                    )}
                                </td>
                            )}
                            {(showApproveButton || showCancelButton) && (
                                <td>
                                    {showApproveButton && (
                                        <button
                                            className={`button-approve-style ${item.status === 'Approved' ? 'disabled-button-approve-style' : ''}`}
                                            disabled={item.isApproved}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleApprove(item.id);
                                            }}
                                            id="approve-button"
                                        >
                                            Approve
                                        </button>
                                    )}
                                    {showCancelButton && (
                                        <button
                                            className="button-cancel-style"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCancel(item.id);
                                            }}
                                            id="cancel-button"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
import React from 'react';
import '../../styles/organisms/Table.css';

const Table = ({children }) => {
    return (
        <div className="table-container">
            <table>
                {children}
            </table>
        </div>
    );
};

export default Table;
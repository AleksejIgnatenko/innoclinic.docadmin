import React from 'react';
import "./../styles/DoctorTable.css";
import { useNavigate } from 'react-router-dom';

const DoctorTable = ({ doctors }) => {
    const navigate = useNavigate();

    const handleRowClick = (id) => {
        navigate(`/doctorProfile/${id}`);
    };

    return (
        <div className="doctor-table-container">
            <table>
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Specialization</th>
                        <th>Status</th>
                        <th>Date of birth</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map((doctor) => (
                        <tr
                            key={doctor.id}
                            onClick={() => handleRowClick(doctor.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td data-label="full-name">
                                {`${doctor.firstName || ''} ${doctor.lastName || ''} ${doctor.middleName || ''}`}
                            </td>
                            <td data-label="specialization">
                                {doctor.specialization?.specializationName || "Not found"}
                            </td>
                            <td data-label="status">
                                {doctor.status || "Not found"}
                            </td>
                            <td data-label="dateOfBirth">
                                {doctor.dateOfBirth || "Not found"}
                            </td>
                            <td data-label="address">
                                {doctor.office?.address || "Not found"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DoctorTable;
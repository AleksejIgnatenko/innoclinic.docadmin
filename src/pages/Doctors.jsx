import { useEffect, useState } from "react";
import Toolbar from '../components/organisms/Toolbar';
import Loader from '../components/organisms/Loader';
import Table from '../components/organisms/Table';
import { ButtonBase } from '../components/atoms/ButtonBase';
import FormModal from "../components/organisms/FormModal";
import { InputWrapper } from "../components/molecules/InputWrapper";
import ImageUploader from "../components/organisms/ImageUploader";
import 'boxicons/css/boxicons.min.css';
import useDoctorForm from "../hooks/useDoctorForm";
import '../styles/pages/Doctors.css';
import { SelectWrapper } from "../components/molecules/SelectWrapper";
import workStatuses from "../enums/WorkStatuses";
import FilterModal from "../components/organisms/FilterModal";
import CheckboxWrapper from "../components/molecules/CheckboxWrapper";
import FieldNames from "../enums/FieldNames";
import { useNavigate, useLocation } from 'react-router-dom';

import GetAllSpecializationFetchAsync from "../api/Services.API/GetAllSpecializationFetchAsync";
import GetAllOfficesFetchAsync from "../api/Offices.API/GetAllOfficesFetchAsync";
import GetAllDoctorsFetchAsync from "../api/Profiles.API/GetAllDoctorsFetchAsync";
import CreateDoctorFetchAsync from "../api/Profiles.API/CreateDoctorFetchAsync";
import CreatePhotoFetchAsync from "../api/Documents.API/CreatePhotoFetchAsync";


export default function Doctors() {
    const navigate = useNavigate();
    const location = useLocation();

    const [photo, setPhoto] = useState(null);

    const [doctors, setDoctors] = useState([]);
    const [editableDoctors, setEditableDoctors] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [offices, setOffices] = useState([]);
    const [officeOptions, setOfficeOptions] = useState([]);

    const [filteredSpecializations, setFilteredSpecializations] = useState([]);

    const [selectSpecializationName, setSelectSpecializationName] = useState('');


    const { formData, setFormData, errors, handleChange, handleBlur, resetForm, isFormValid } = useDoctorForm({
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: '',
        email: '',
        specializationId: '',
        officeId: '',
        cabinetNumber: '',
        careerStartYear: '',
        status: '',
    });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [selectedOffices, setSelectedOffices] = useState([]);
    const [selectedSpecializations, setSelectedSpecializations] = useState([]);

    const columnNames = [
        'doctorFullName',
        'specialization',
        'status',
        'dateOfBirth',
        'address',
    ];

    const fetchData = async () => {
        try {
            toggleLoader(true);

            const fetchedSpecializations = await GetAllSpecializationFetchAsync()
            setSpecializations(fetchedSpecializations);

            const fetchedOffices = await GetAllOfficesFetchAsync();
            setOffices(fetchedOffices);
            const officeOptions = fetchedOffices.map(({ id, city, street, houseNumber, officeNumber }) => ({
                id,
                value: `${city} ${street} ${houseNumber} ${officeNumber}`
            }))
            setOfficeOptions(officeOptions);

            const fetchedDoctors = await GetAllDoctorsFetchAsync();
            setDoctors(fetchedDoctors);

            const formattedDoctors = formatDoctors(fetchedDoctors);
            setEditableDoctors(formattedDoctors);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            toggleLoader(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const modalParam = queryParams.get('modal');

        if (modalParam === 'create') {
            setIsAddModalOpen(true);
        } else if (modalParam === 'filter') {
            setIsFilterModalOpen(true);
        }
    }, [location.search]);

    useEffect(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filteredDoctors = doctors.filter(item => {
            return (
                item.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
                item.middleName.toLowerCase().includes(lowerCaseSearchTerm)
            );
        })

        const formattedDoctors = formatDoctors(filteredDoctors);

        setEditableDoctors(formattedDoctors);
    }, [searchTerm, doctors]);

    const formatDoctors = (doctors) => {
        return doctors.map(({ id, firstName, lastName, middleName, specialization, status, dateOfBirth, office }) => ({
            id,
            doctorFullName: `${firstName} ${lastName} ${middleName}`,
            specialization: specialization.specializationName,
            status,
            dateOfBirth,
            address: `${office.city} ${office.street} ${office.houseNumber} ${office.officeNumber}`,
        }));
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleAddModalClick = () => {
        const confirmCancel = isAddModalOpen 
            ? window.confirm("Do you really want to cancel? Entered data will not be saved.") 
            : true;
    
        if (confirmCancel) {
            const newModalState = !isAddModalOpen;
            const currentPath = location.pathname;
            const params = new URLSearchParams(location.search);
        
            if (newModalState) {
                params.set('modal', 'create');
            } else {
                params.delete('modal');
            }
        
            const updatedPath = `${currentPath}?${params.toString()}`;
            setIsAddModalOpen(newModalState);
            navigate(updatedPath);

            if (!newModalState) {
                resetForm();
            }
        }
    };

    const toggleFilterModalClick = () => {
        const newModalState = !isFilterModalOpen;
        const currentPath = location.pathname;
        const params = new URLSearchParams(location.search);
    
        if (newModalState) {
            params.set('modal', 'filter');
        } else {
            params.delete('modal');
        }
    
        const updatedPath = `${currentPath}?${params.toString()}`;
        setIsFilterModalOpen(newModalState);
        navigate(updatedPath);
    };

    const handleSpecializationChange = (value) => {
        if (value === '') {
            setFilteredSpecializations([]);
        } else {
            const filtered = specializations.filter(spec => spec.specializationName.toLowerCase().includes(value.toLowerCase()));
            setFilteredSpecializations(filtered);
        }
        setSelectSpecializationName(value);
    };

    const handleSpecializationSelect = (specialization) => {
        formData.specializationId = specialization.id;
        setFilteredSpecializations([]);
        setSelectSpecializationName(specialization.specializationName);
        errors.specializationId = true;
    };

    const handleFilterOfficeChange = (office) => {
        setSelectedOffices(prevSelectedOffices => {
            if (prevSelectedOffices.some(selectedOffice => selectedOffice.id === office.id)) {
                return prevSelectedOffices.filter(selectedOffice => selectedOffice.id !== office.id);
            } else {
                return [...prevSelectedOffices, office];
            }
        });
    };

    const handleFilterSpecializationChange = (specialization) => {
        setSelectedSpecializations(prevSelectedSpecializations => {
            if (prevSelectedSpecializations.some(selectedSpecialization => selectedSpecialization.id === specialization.id)) {
                return prevSelectedSpecializations.filter(selectedSpecialization => selectedSpecialization.id !== specialization.id);
            } else {
                return [...prevSelectedSpecializations, specialization];
            }
        });
    };

    const handleApplyFilter = () => {
        const filteredDoctors = doctors.filter(doctor =>
            selectedOffices.some(selectedOffice => selectedOffice.id === doctor.office.id) ||
            selectedSpecializations.some(selectedSpecialization => selectedSpecialization.id === doctor.specialization.id)
        );
        const formattedDoctors = formatDoctors(filteredDoctors);
        setEditableDoctors(formattedDoctors);
        setIsFilterModalOpen(!isFilterModalOpen);

        const currentPath = location.pathname;
        const params = new URLSearchParams(location.search);
        params.delete('modal');
        const updatedPath = `${currentPath}?${params.toString()}`;
        navigate(updatedPath);
    };

    const handleClearFilter = () => {
        const formattedDoctors = formatDoctors(doctors);
        setEditableDoctors(formattedDoctors);
        setSelectedOffices([]);
        setSelectedSpecializations([]);
        setIsFilterModalOpen(!isFilterModalOpen);

        const currentPath = location.pathname;
        const params = new URLSearchParams(location.search);
        params.delete('modal');
        const updatedPath = `${currentPath}?${params.toString()}`;
        navigate(updatedPath);
    }

    async function handleAdd(e) {
        e.preventDefault();

        let photoId = '';
        if (photo) {
            photoId = await CreatePhotoFetchAsync(photo);
        }

        const createDoctorRequest = {
            firstName: formData.firstName, 
            lastName: formData.lastName, 
            middleName: formData.middleName,
            cabinetNumber: formData.cabinetNumber, 
            dateOfBirth: formData.dateOfBirth, 
            email: formData.email, 
            specializationId: formData.specializationId, 
            officeId: formData.officeId,
            careerStartYear: formData.careerStartYear, 
            status: formData.status, 
            photoId: photoId,
        }

        await CreateDoctorFetchAsync(createDoctorRequest);
        fetchData();
    }

    return (
        <>
            <Toolbar
                pageTitle="Doctors"
                setSearchTerm={setSearchTerm}
                showAddIcon={true}
                toggleCreateModalClick={toggleAddModalClick}
                showFilterIcon={true}
                toggleFilterModalClick={toggleFilterModalClick}
            />
            {isLoading ? (<Loader />
            ) : (
                <div className="page">
                    {doctors.length === 0 ? (
                        <p className="no-items">Doctors not found</p>
                    ) : (
                        <>
                            {editableDoctors.length === 0 && (
                                <p className="no-items">Nothing was found</p>
                            )}
                            {editableDoctors.length > 0 && (
                                <div className="table">
                                    <Table>
                                        <thead>
                                            <tr>
                                                {columnNames.map(columnName => (
                                                    <th key={columnName}>
                                                        {FieldNames[columnName]}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {editableDoctors.map(editableDoctor => (
                                                <tr key={editableDoctor.id} onClick={() => navigate(`/doctor/${editableDoctor.id}`)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {columnNames.map(columnName => (
                                                        <td key={columnName}>{editableDoctor[columnName]}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </>
                    )}

                    {isAddModalOpen && (
                        <FormModal title="Add doctor" onClose={toggleAddModalClick} onSubmit={handleAdd} showCloseButton={true}>
                            <div className="modal-inputs">
                                <div class="img-container">
                                    <ImageUploader
                                        setPhoto={setPhoto}
                                    />
                                </div>
                                <InputWrapper
                                    type="text"
                                    label="First Name"
                                    id="firstName"
                                    value={formData.firstName}
                                    onBlur={handleBlur('firstName')}
                                    onChange={handleChange('firstName')}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Last Name"
                                    id="lastName"
                                    value={formData.lastName}
                                    onBlur={handleBlur('lastName')}
                                    onChange={handleChange('lastName')}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Middle Name"
                                    id="middleName"
                                    value={formData.middleName}
                                    onBlur={handleBlur('middleName', false)}
                                    onChange={handleChange('middleName', false)}
                                    required
                                />
                                <InputWrapper
                                    type="date"
                                    label="Date Of Birth"
                                    id="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onBlur={handleBlur('dateOfBirth')}
                                    onChange={handleChange('dateOfBirth')}
                                    required
                                />
                                <InputWrapper
                                    type="email"
                                    label="Email"
                                    id="email"
                                    value={formData.email}
                                    onBlur={handleBlur('email')}
                                    onChange={handleChange('email')}
                                    required
                                />
                                <div>
                                    <InputWrapper
                                        type="text"
                                        label="Specialization"
                                        id="specialization"
                                        value={selectSpecializationName}
                                        onChange={(e) => handleSpecializationChange(e.target.value)}
                                        onBlur={handleBlur('specialization')}
                                        required
                                    />
                                    {filteredSpecializations.length > 0 && (
                                        <div className="filtred-list">
                                            {filteredSpecializations.map(specialization => (
                                                <h5 key={specialization.id} onClick={() => handleSpecializationSelect(specialization)}>
                                                    {specialization.specializationName}
                                                </h5>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <SelectWrapper
                                    label="Office"
                                    id="office"
                                    value={formData.officeId}
                                    onBlur={handleBlur('officeId')}
                                    onChange={handleChange('officeId')}
                                    required
                                    placeholder={formData.officeId ? "" : "Select office"}
                                    options={officeOptions}
                                />
                                <InputWrapper
                                    type="number"
                                    label="Cabinet Number"
                                    id="cabinetNumber"
                                    value={formData.cabinetNumber}
                                    onBlur={handleBlur('cabinetNumber')}
                                    onChange={handleChange('cabinetNumber')}
                                    required
                                />
                                <InputWrapper
                                    type="date"
                                    label="Career Start Year"
                                    id="careerStartYear"
                                    value={formData.careerStartYear}
                                    onBlur={handleBlur('careerStartYear')}
                                    onChange={handleChange('careerStartYear')}
                                    required
                                />
                                <SelectWrapper
                                    label="Status"
                                    id="status"
                                    value={formData.status}
                                    onBlur={handleBlur('status')}
                                    onChange={handleChange('status')}
                                    required
                                    placeholder={formData.status ? formData.status : "Выберите статус"}
                                    options={workStatuses}
                                />
                            </div>
                            <div className="form-actions">
                                <ButtonBase type="submit" disabled={!isFormValid}>
                                    Confirm
                                </ButtonBase>
                                <ButtonBase variant="secondary" onClick={toggleAddModalClick}>
                                    Cancel
                                </ButtonBase>
                            </div>
                        </FormModal>
                    )}

                    {isFilterModalOpen && (
                        <FilterModal onClose={toggleFilterModalClick}>
                            <div className="filter-section">
                                <h2 className="filter-modal-title">Offices</h2>
                                <div className="filter-checkbox-container">
                                    {offices.length > 0 ? (
                                        offices.map(office => (
                                            <div className="filter-checkbox-group" key={office.id}>
                                                <CheckboxWrapper
                                                    id={office.id}
                                                    name="office-address"
                                                    value={office.address}
                                                    checked={selectedOffices.some(selectedOffice => selectedOffice.id === office.id)}
                                                    onChange={() => handleFilterOfficeChange(office)}
                                                    label={office.city}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p>Offices not found.</p>
                                    )}
                                </div>
                            </div>
                            <div className="filter-section">
                                <h2 className="filter-modal-title">Specializations</h2>
                                <div className="filter-checkbox-container">
                                    {specializations.length > 0 ? (
                                        specializations.map(specialization => (
                                            <div className="filter-checkbox-group" key={specialization.id}>
                                                <CheckboxWrapper
                                                    id={specialization.id}
                                                    name="specialization-name"
                                                    value={specialization.specializationName}
                                                    checked={selectedSpecializations.some(selectedSpecialization => selectedSpecialization.id === specialization.id)}
                                                    onChange={() => handleFilterSpecializationChange(specialization)}
                                                    label={specialization.specializationName}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p>Specializations not found.</p>
                                    )}
                                </div>
                            </div>
                            <div className="form-actions">
                                <ButtonBase type="button" onClick={handleApplyFilter}>
                                    Apply
                                </ButtonBase>
                                <ButtonBase type="button" variant="secondary" onClick={handleClearFilter}>
                                    Clear
                                </ButtonBase>
                            </div>
                        </FilterModal>
                    )}
                </div>
            )}
        </>
    );
} 
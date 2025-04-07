import { useParams } from "react-router-dom";
import GetAllAppointmentResultsByAppointmentIdFetchAsync from "../api/Appointments.API/GetAllAppointmentResultsByAppointmentIdFetchAsync";
import { useEffect, useState } from "react";
import GetAllDoctorsFetchAsync from "../api/Profiles.API/GetAllDoctorsFetchAsync";
import Toolbar from "../components/organisms/Toolbar";
import Loader from "../components/organisms/Loader";
import Table from "../components/organisms/Table";
import FieldNames from "../enums/FieldNames";
import { IconBase } from "../components/atoms/IconBase";
import GetPatientByIdFetchAsync from "../api/Profiles.API/GetPatientByIdFetchAsync";
import GetDoctorByAccountIdFromTokenFetchAsync from "../api/Profiles.API/GetDoctorByAccountIdFromTokenFetchAsync";
import useAppointmentResultForm from "../hooks/useAppointmentResultForm";
import FormModal from "../components/organisms/FormModal";
import { InputWrapper } from "../components/molecules/InputWrapper";
import { ButtonBase } from "../components/atoms/ButtonBase";
import UpdateAppointmentResultFetchAsync from "../api/Appointments.API/UpdateAppointmentResultFetchAsync";

export default function AppointmentResults() {
    const { appointmentId } = useParams();
    const { patientId } = useParams();

    const [patient, setPatient] = useState(null);
    const [doctor, setDoctor] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [appointmentResults, setAppointmentResults] = useState([]);
    const [editableAppointmentResults, setEditableAppointmentResults] = useState([]);

    const [isAppoimentResultUpdateModalOpen, setIsAppoimentResultUpdateModalOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const columnNames = [
        'date',
        'patientFullName',
        'dateOfBirth',
        'doctorFullName',
        'specialization',
        'medicalServiceName',
        'complaints',
        'conclusion',
        'diagnosis',
        'recommendations',
    ];

    const { appointmentResultFormData, setAppointmentResultFormData, appointmentResultFormDataErrors, setAppointmentResultFormDataErrors, handleChangeAppoimentResult, handleBlurAppoimentResult, isAppointmentResultFormValid } = useAppointmentResultForm({
        appointmentResultId: '',
        complaints: '',
        conclusion: '',
        recommendations: '',
        diagnosis: '',
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedAppointmentResults = await GetAllAppointmentResultsByAppointmentIdFetchAsync(appointmentId);
                setAppointmentResults(fetchedAppointmentResults);

                const fetchedPatient = await GetPatientByIdFetchAsync(patientId);
                setPatient(fetchedPatient);

                const fetchedDoctor = await GetDoctorByAccountIdFromTokenFetchAsync();
                setDoctor(fetchedDoctor);

                const fetchedDoctors = await GetAllDoctorsFetchAsync();
                setDoctors(fetchedDoctors);

                const formattedAppointmentResults = formatAppointmentResults(fetchedAppointmentResults, fetchedPatient, fetchedDoctors);
                setEditableAppointmentResults(formattedAppointmentResults);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

    const formatAppointmentResults = (appointmentResults, patient, doctors) => {
        return appointmentResults.map(({ id, appointment, complaints, conclusion, diagnosis, recommendations }) => ({
            id,
            doctorId: appointment.doctor.id,
            date: appointment.date,
            patientFullName: `${appointment.patient.firstName} ${appointment.patient.lastName} ${appointment.patient.middleName}`,
            dateOfBirth: patient.dateOfBirth,
            doctorFullName: `${appointment.doctor.firstName} ${appointment.doctor.lastName} ${appointment.doctor.middleName}`,
            specialization: doctors.find(doctor => doctor.id === appointment.doctor.id).specialization.specializationName,
            medicalServiceName: appointment.medicalService.serviceName,
            complaints,
            conclusion,
            diagnosis,
            recommendations,
        }));
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleUpdateAppointmentResultModal = (appointmentResultId) => (event) => {
        event.preventDefault();

        const selectedAppoimentResult = appointmentResults.find(appointmentResul => appointmentResul.id === appointmentResultId);
        
        const appoimentResult = {
            id: selectedAppoimentResult.id,
            appointmentId: selectedAppoimentResult.appointment.id,
            complaints: selectedAppoimentResult.complaints,
            conclusion: selectedAppoimentResult.conclusion,
            diagnosis: selectedAppoimentResult.diagnosis,
            recommendations: selectedAppoimentResult.recommendations,
        }

        setAppointmentResultFormDataErrors({
            complaints: true,
            conclusion: true,
            diagnosis: true,
            recommendations: true,
        });

        setAppointmentResultFormData(appoimentResult);

        setIsAppoimentResultUpdateModalOpen(!isAppoimentResultUpdateModalOpen);
    };

    async function handleUpdateAppointmentResult(e) {
        e.preventDefault();

        console.log(appointmentResultFormData);
        await UpdateAppointmentResultFetchAsync(appointmentResultFormData)
    }

    return (
        <>
            <Toolbar
                pageTitle="Appointment Results"
            />
            {isLoading ? (<Loader />
            ) : (
                <>
                    <div className="page">
                        {appointmentResults.length === 0 ? (
                            <p className="no-items">Appointment Results not found</p>
                        ) : (
                            <>
                                {editableAppointmentResults.length === 0 && (
                                    <p className="no-items">Nothing was found</p>
                                )}
                                {editableAppointmentResults.length > 0 && (
                                    <div className="table">
                                        <Table>
                                            <thead>
                                                <tr>
                                                    {columnNames.map(columnName => (
                                                        <th key={columnName}>{FieldNames[columnName]}</th>
                                                    ))}
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {editableAppointmentResults.map(appointmentResult => (
                                                    <tr key={appointmentResult.id}>
                                                        {columnNames.map(columnName => (
                                                            <td key={columnName}>{appointmentResult[columnName]}</td>
                                                        ))}
                                                        {appointmentResult.doctorId === doctor.id ? (
                                                            <td>
                                                                <IconBase
                                                                    name='bx-pencil'
                                                                    onClick={toggleUpdateAppointmentResultModal(appointmentResult.id)}
                                                                />
                                                            </td>
                                                        ) : <td></td>}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {isAppoimentResultUpdateModalOpen && (
                        <FormModal title="Add doctor" onClose={toggleUpdateAppointmentResultModal} onSubmit={handleUpdateAppointmentResult} showCloseButton={true}>
                            <div className="modal-inputs">
                                <InputWrapper
                                    type="text"
                                    label="Complaints"
                                    id="complaints"
                                    value={appointmentResultFormData.complaints}
                                    onBlur={handleBlurAppoimentResult('complaints')}
                                    onChange={handleChangeAppoimentResult('complaints')}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Conclusion"
                                    id="conclusion"
                                    value={appointmentResultFormData.conclusion}
                                    onBlur={handleBlurAppoimentResult('conclusion')}
                                    onChange={handleChangeAppoimentResult('conclusion')}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Recommendations"
                                    id="recommendations"
                                    value={appointmentResultFormData.recommendations}
                                    onBlur={handleBlurAppoimentResult('recommendations')}
                                    onChange={handleChangeAppoimentResult('recommendations')}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Diagnosis"
                                    id="diagnosis"
                                    value={appointmentResultFormData.diagnosis}
                                    onBlur={handleBlurAppoimentResult('diagnosis')}
                                    onChange={handleChangeAppoimentResult('diagnosis')}
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <ButtonBase type="submit" disabled={!isAppointmentResultFormValid}>
                                    Confirm
                                </ButtonBase>
                                <ButtonBase variant="secondary" onClick={toggleUpdateAppointmentResultModal}>
                                    Cancel
                                </ButtonBase>
                            </div>
                        </FormModal>
                    )}
                </>
            )}
        </>
    );
} 
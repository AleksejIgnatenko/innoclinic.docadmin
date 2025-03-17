import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import usePatientForm from "../hooks/usePatientForm";
import Loader from "../components/organisms/Loader";
import ProfileCard from "../components/organisms/ProfileCard";
import GetPatientByIdFetchAsync from "../api/Profiles.API/GetPatientByIdFetchAsync";

function Patient() {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { formData, errors, handleChange, handleBlur, resetForm, isFormValid, setFormData } = usePatientForm({
        firstName: '',
        lastName: '',
        middleName: '',
        isLinkedToAccount: false,
        dateOfBirth: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                // const fetchPatient = {
                //     "id": "371add01-a140-4a54-9d46-14c6dfe8376e",
                //     "firstName": "Иванов",
                //     "lastName": "Иван",
                //     "middleName": "Иванович",
                //     "isLinkedToAccount": true,
                //     "dateOfBirth": "2025-01-01",
                //     "account": {
                //         "id": "d7144e1d-2ab3-4153-8026-355dcebdcae6",
                //         "email": "lehaignatenko989@gmail.com",
                //         "password": "$2a$10$Rx6WPRhJjO4IutUIODYeF.VbS1Z0o8WPEqg27p23pkPkqSHgU3rei",
                //         "phoneNumber": "+375(00)000-00-00",
                //         "role": 0
                //     }
                // };
                const fetchPatient = await GetPatientByIdFetchAsync(id);
                setPatient(fetchPatient);
                formData.firstName = fetchPatient.firstName;
                formData.lastName = fetchPatient.lastName;
                formData.middleName = fetchPatient.middleName;
                formData.dateOfBirth = fetchPatient.dateOfBirth;

            } catch (error) {
                console.error('Error fetching patient:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, [setFormData]);

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <ProfileCard>
                    <div className="profile-img">
                        <img 
                            src="https://th.bing.com/th/id/OIP.audMX4ZGbvT2_GJTx2c4GgAAAA?rs=1&pid=ImgDetMain" 
                            alt="Profile" 
                        />
                    </div>
                    <div className="profile-content">
                        <p>First name: {formData.firstName}</p>
                        <p>Last name: {formData.lastName}</p>
                        <p>Middle name: {formData.middleName}</p>
                        <p>Date of birth: {formData.dateOfBirth}</p>
                    </div>
                </ProfileCard>
            )}
        </>
    );
}

export default Patient;
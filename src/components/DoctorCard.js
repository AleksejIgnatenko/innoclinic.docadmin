import './../styles/DoctorCard.css';

const DoctorCard = ({photo, name, specialization, experience, officeAddress}) => {
    console.log(photo);
    return (
        <div class="doctor-card">
            <div class="doctor-picture">
                <img src="https://th.bing.com/th/id/OIP.audMX4ZGbvT2_GJTx2c4GgAAAA?rs=1&pid=ImgDetMain" alt="Profile Picture" class="doctor-image" />
            </div>
            <div class="doctor-details">
                <span class="doctor-name">Full name: {name}</span>
                <span class="doctor-specialization">Specialization: {specialization}</span>
                <span class="doctor-experience">Experience: {experience}</span>
                <span class="doctor-office">Office address: {officeAddress}</span>
            </div>
            <div class="action-button">
                <button>viewing the recording</button>
            </div>
        </div>
    );
};

export default DoctorCard;
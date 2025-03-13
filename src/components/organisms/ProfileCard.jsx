import React from 'react';
import '../../styles/organisms/ProfileCard.css';

const ProfileCard = ({ children }) => {

    return (
        <div class="profile-container">
            {children}
        </div>
    );
};

export default ProfileCard;
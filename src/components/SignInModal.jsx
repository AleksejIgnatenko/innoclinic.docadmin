import './../styles/SignInModal.css';
import React, { useState, useEffect } from 'react';
import SignInModelRequest from '../models/accountModels/SignInModelRequest';
import SignInFetchAsync from '../api/Authorization.API/SignInFetchAsync';
import Toast from './Toast';

const SignInModal = ({ onClose, onOpenSignUp }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const [showToast, setShowToast] = useState(true);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    async function handleEmailBlur(event) {
        const input = event.target;
        const label = document.getElementById('sign-in-email-label');
        if (input.value === '') {
            input.classList.add('error-input-border');
            label.classList.add('sign-in-error-label');
            label.textContent = "Please, enter the email";
            setIsEmailValid(false);
        } else if (!input.value.includes('@')) {
            input.classList.add('error-input-border');
            label.classList.add('sign-in-error-label');
            label.textContent = "You've entered an invalid email";
            setIsEmailValid(false);
        } else {
            label.textContent = 'Email';
            input.classList.remove('error-input-border');
            label.classList.remove('sign-in-error-label');
            // const isEmailAvailability = await EmailExistsAsync(email);
            // if(isEmailAvailability) {
            //     setIsEmailValid(true);
            // } else {
            //     input.classList.add('error-input-border');
            //     label.classList.add('sign-in-error-label');
            //     label.textContent = "User with this email doesn’t exists";
            //     setIsEmailValid(false);
            // }
        }
    };

    const handlePasswordlBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('sign-in-password-label');
        if (input.value === '') {
            input.classList.add('error-input-border');
            label.classList.add('sign-in-error-label');
            label.textContent = "Please, enter the password";
            setIsPasswordValid(false);
        } else if ((5 > password.length) || (password.length > 16)) {
            input.classList.add('error-input-border');
            label.classList.add('sign-in-error-label');
            label.textContent = "The number of characters in the password must be from 6 to 15";
            setIsPasswordValid(false);
        }
        else {
            label.textContent = 'Password';
            input.classList.remove('error-input-border');
            label.classList.remove('sign-in-error-label');
            setIsPasswordValid(true);
        }
    };

    const handleEmailInput = (event) => {
        const input = event.target;
        setEmail(input.value);
        if (input.value === '') {
            setIsEmailValid(false);
        } else if (!input.value.includes('@')) {
            setIsEmailValid(false);
        } else {
            const label = document.getElementById('sign-in-email-label');
            label.textContent = 'Email';
            input.classList.remove('error-input-border');
            label.classList.remove('sign-in-error-label');
            setIsEmailValid(true);
        }
    };

    const handlePasswordlInput = (event) => {
        const input = event.target;
        setPassword(input.value);
        if (input.value === '') {
            setIsPasswordValid(false);
        } else if ((5 > password.length) || (password.length > 16)) {
            setIsPasswordValid(false);
        }
        else {
            const label = document.getElementById('sign-in-password-label');
            label.textContent = 'Password';
            input.classList.remove('error-input-border');
            label.classList.remove('sign-in-error-label');
            setIsPasswordValid(true);
        }
    };

    const isFormValid = isEmailValid && isPasswordValid;

    // async function handleSignInAsync() {
    //     const signInModel = new SignInModelRequest(email, password);
    //     if ((5 < password.length) && (password.length < 16)) {
    //         await SignInFetchAsync(signInModel)
    //     } else {
    //         const input = document.getElementById('sign-in-password-input');
    //         const label = document.getElementById('sign-in-password-label');
    //         if (input && label) { 
    //             input.classList.add('error-input-border');
    //             label.classList.add('sign-in-error-label');
    //             label.textContent = "Количество символов в пароле должно быть от 6 до 15";
    //         }
    //     }
    // }

    async function handleSignInAsync() {
        const signInModel = new SignInModelRequest(email, password);
        if (isFormValid) {
            // const response = await SignInFetchAsync(signInModel);
            // if (response.success) {
                setShowToast(true); 
                setTimeout(() => {
                    setShowToast(false);
                }, 5000);
            //}
        }
    }

    return (
        <div class="sign-in-container">
            {showToast && <Toast onClose={() => setShowToast(false)} />}
            <div class="sign-in-top-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Sign in</h2>
            </div>
            <div class="sign-in-inputs">
                <div class="sign-in-input-wrapper">
                    <input
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={handleEmailBlur}
                        onInput={handleEmailInput}
                        type="email"
                        name=""
                        id="sign-in-email-input"
                        class="input default-input-border"
                        placeholder=" "
                        required />
                    <label class="sign-in-input-label" id="sign-in-email-label">Email</label>
                </div>
                <div class="sign-in-input-wrapper">
                    <input
                        value={password}
                        onChange={handlePasswordChange}
                        onBlur={handlePasswordlBlur}
                        onInput={handlePasswordlInput}
                        type="password"
                        name=""
                        id="sign-in-password-input"
                        class="input default-input-border"
                        placeholder=" "
                        required />
                    <label class="sign-in-input-label" id="sign-in-password-label">Password</label>
                </div>
            </div>
            <div class="btn-group">
                <button
                    className={`sign-in-btn ${!isFormValid ? 'disabled-sign-in-btn' : ''}`}
                    onClick={handleSignInAsync}
                    disabled={!isFormValid}
                >
                    Sign in
                </button>
            </div>
        </div>
    );
};

export default SignInModal;
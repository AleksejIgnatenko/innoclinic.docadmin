import React, { useEffect } from 'react';
import './../styles/Toast.css';

const Toast = ({ onClose }) => {
    useEffect(() => {
        const toast = document.querySelector(".toast");
        const progress = document.querySelector(".progress");

        let timer1, timer2;

        toast.classList.add("active");
        progress.classList.add("active");

        timer1 = setTimeout(() => {
            toast.classList.remove("active");
        }, 5000);

        timer2 = setTimeout(() => {
            progress.classList.remove("active");
        }, 5300);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <div className="toast active">
            <div className="toast-content">
                <i className='bx bx-check check'></i> 
                <div className="message">
                    <span className="text text-1">Success</span>
                    <span className="text text-2">Your changes have been saved</span>
                </div>
            </div>
            <i className="bx bx-x close" onClick={onClose}></i> 
            <div className="progress active"></div>
        </div>
    );
};

export default Toast;
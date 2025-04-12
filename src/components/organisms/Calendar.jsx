import React, { useEffect } from 'react';
import '../../styles/organisms/Calendar.css';
import { CloseButton } from '../atoms/CloseButton';

const Calendar = ({ onClose, handleSetSelectedDate, currentDate }) => {
    useEffect(() => {
        const calendar = document.querySelector('.calendar-container');
        const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const isLeapYear = (year) => {
            return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        }

        const getFebDays = (year) => {
            return isLeapYear(year) ? 29 : 28;
        }

        const generateCalendar = (month, year) => {
            const calendar_days = calendar.querySelector('.calendar-days');
            const calendar_header_year = calendar.querySelector('#year');

            const days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            calendar_days.innerHTML = '';

            const curr_month = `${month_names[month]}`;
            const month_picker = calendar.querySelector('#month-picker');
            month_picker.innerHTML = curr_month;
            calendar_header_year.innerHTML = year;

            const first_day = new Date(year, month, 1);
            const currDate = new Date();

            for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
                const day = document.createElement('div');
                if (i >= first_day.getDay()) {
                    const dayNumber = i - first_day.getDay() + 1;
                    day.classList.add('calendar-day-hover');
                    day.innerHTML = dayNumber;
                    day.innerHTML += `<span></span><span></span><span></span><span></span>`;

                    day.onclick = () => {
                        const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                        handleSetSelectedDate(formattedDate);
                    };

                    // Highlight the selected date
                    const selectedDate = new Date(currentDate);
                    if (dayNumber === selectedDate.getDate() && year === selectedDate.getFullYear() && month === selectedDate.getMonth()) {
                        day.classList.add('selected-date');
                    }

                    // Highlight the current date
                    if (dayNumber === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
                        day.classList.add('curr-date');
                    }
                }
                calendar_days.appendChild(day);
            }
        }

        const month_list = calendar.querySelector('.month-list');
        month_list.innerHTML = '';

        month_names.forEach((e, index) => {
            const month = document.createElement('div');
            month.innerHTML = `<div data-month="${index}">${e}</div>`;
            month.querySelector('div').onclick = () => {
                month_list.classList.remove('show');
                curr_month.value = index;
                generateCalendar(index, curr_year.value);
            }
            month_list.appendChild(month);
        });

        const month_picker = calendar.querySelector('#month-picker');
        month_picker.onclick = () => {
            month_list.classList.add('show');
        }

        const currDate = new Date();
        const curr_month = { value: currDate.getMonth() };
        const curr_year = { value: currDate.getFullYear() };

        generateCalendar(curr_month.value, curr_year.value);

        const prevYearButton = document.querySelector('#prev-year');
        const nextYearButton = document.querySelector('#next-year');

        prevYearButton.onclick = () => {
            --curr_year.value;
            generateCalendar(curr_month.value, curr_year.value);
        }

        nextYearButton.onclick = () => {
            ++curr_year.value;
            generateCalendar(curr_month.value, curr_year.value);
        }

        return () => {
            month_picker.onclick = null;
            prevYearButton.onclick = null;
            nextYearButton.onclick = null;
            month_names.forEach((_, index) => {
                const monthButton = document.querySelector(`[data-month="${index}"]`);
                if (monthButton) {
                    monthButton.onclick = null;
                }
            });
        };
    }, [currentDate]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [onClose]);

    return (
        <div className="modal-overlay">
            <div className="calendar-modal-container">
                <div className="modal-form">
                    <CloseButton onClick={onClose} />
                    <div className="calendar-container">
                        <div className="calendar-header">
                            <span className="month-picker" id="month-picker"></span>
                            <div className="year-picker">
                                <span className="year-change" id="prev-year"><pre>&lt;</pre></span>
                                <span id="year"></span>
                                <span className="year-change" id="next-year"><pre>&gt;</pre></span>
                            </div>
                        </div>
                        <div className="calendar-body">
                            <div className="calendar-week-day">
                                <div>Sun</div>
                                <div>Mon</div>
                                <div>Tue</div>
                                <div>Wed</div>
                                <div>Thu</div>
                                <div>Fri</div>
                                <div>Sat</div>
                            </div>
                            <div className="calendar-days"></div>
                        </div>
                        <div className="month-list"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
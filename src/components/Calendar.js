import React, { useEffect } from 'react';
import './../styles/Calendar.css';

const Calendar = ({ onClose, setSelectedDate, onSelectDate }) => {
    useEffect(() => {
        let calendar = document.querySelector('.calendar-container');

        const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const isLeapYear = (year) => {
            return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        }

        const getFebDays = (year) => {
            return isLeapYear(year) ? 29 : 28;
        }

        const generateCalendar = (month, year) => {
            let calendar_days = calendar.querySelector('.calendar-days');
            let calendar_header_year = calendar.querySelector('#year');

            let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            calendar_days.innerHTML = '';

            let currDate = new Date();
            if (month == null) month = currDate.getMonth();
            if (year == null) year = currDate.getFullYear();

            let curr_month = `${month_names[month]}`;
            let month_picker = calendar.querySelector('#month-picker');
            month_picker.innerHTML = curr_month;
            calendar_header_year.innerHTML = year;

            let first_day = new Date(year, month, 1);

            for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
                let day = document.createElement('div');
                if (i >= first_day.getDay()) {
                    const dayNumber = i - first_day.getDay() + 1; 
                    day.classList.add('calendar-day-hover');
                    day.innerHTML = dayNumber;
                    day.innerHTML += `<span></span><span></span><span></span><span></span>`;
                    
                    day.onclick = () => {
                        const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                        setSelectedDate(formattedDate);
                        onSelectDate(formattedDate);
                        onClose();
                    };

                    if (dayNumber === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
                        day.classList.add('curr-date');
                    }
                }
                calendar_days.appendChild(day);
            }
        }

        let month_list = calendar.querySelector('.month-list');
        month_list.innerHTML = '';

        month_names.forEach((e, index) => {
            let month = document.createElement('div');
            month.innerHTML = `<div data-month="${index}">${e}</div>`;
            month.querySelector('div').onclick = () => {
                month_list.classList.remove('show');
                curr_month.value = index;
                generateCalendar(index, curr_year.value);
            }
            month_list.appendChild(month);
        });

        let month_picker = calendar.querySelector('#month-picker');
        month_picker.onclick = () => {
            month_list.classList.add('show');
        }

        let currDate = new Date();
        let curr_month = { value: currDate.getMonth() };
        let curr_year = { value: currDate.getFullYear() };

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
    }, []);

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
            <button className="close-button" onClick={onClose}>X</button>
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
    );
};

export default Calendar;
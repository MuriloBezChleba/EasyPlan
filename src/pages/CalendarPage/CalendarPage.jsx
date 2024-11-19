import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CalendarPage.css';

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleDayClick = (day) => {
    navigate(`/day/${currentMonth + 1}/${day}`); // Passando o mês e o dia
  };
  

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  };

  return (
    <div className="calendar-container">
      <h1>{months[currentMonth]} {currentYear}</h1>
      <div className="month-slide">
        <button onClick={goToPreviousMonth}>◀</button>
        <button onClick={goToNextMonth}>▶</button>
      </div>
      <div className="days-grid">
        {Array.from({ length: daysInMonth(currentMonth, currentYear) }, (_, i) => (
          <button
            key={i + 1}
            className="day-button"
            onClick={() => handleDayClick(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarPage;

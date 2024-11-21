// src/pages/CalendarPage/CalendarPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '../../context/AppointmentsContext';
import './CalendarPage.css';

const CalendarPage = () => {
  const { appointments } = useAppointments(); // Acessa os compromissos do contexto
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handleDayClick = (day) => {
    if (day) {  // Verificar se o dia não é nulo
      navigate(`/day/${currentMonth + 1}/${day}`);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prevYear => prevYear + 1);
    } else {
      setCurrentMonth(prevMonth => prevMonth + 1);
    }
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prevYear => prevYear - 1);
    } else {
      setCurrentMonth(prevMonth => prevMonth - 1);
    }
  };

  const totalDays = daysInMonth(currentMonth, currentYear);
  const startDay = firstDayOfMonth(currentMonth, currentYear);

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null); // Dias em branco antes do início do mês
  }
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="calendar-container">
      <h1>{months[currentMonth]} {currentYear}</h1>
      <div className="month-slide">
        <button onClick={goToPreviousMonth}>◀</button>
        <button onClick={goToNextMonth}>▶</button>
      </div>
      <div className="calendar-grid">
        {daysOfWeek.map((day) => (
          <div key={day} className="day-header">{day}</div>
        ))}
        
        {calendarDays.map((day, index) => {
          if (day === null) return null; // Ignorar valores null

          const dayKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          const hasAppointments = appointments[dayKey] && appointments[dayKey].length > 0;

          return (
            <div
              key={dayKey} // Usar dayKey como chave única
              className={`calendar-day ${hasAppointments ? 'has-appointments' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarPage;

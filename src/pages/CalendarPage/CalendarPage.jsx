import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '../../context/AppointmentsContext';
import Navbar from '../../components/Navbar';
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

  // Função para calcular o último dia do mês
  const lastDayOfMonth = (month, year) => new Date(year, month + 1, 0).getDay();

  // Função para calcular o primeiro dia do próximo mês
  const getNextMonthStartDay = (month, year) => {
    const lastDay = new Date(year, month + 1, 0).getDay(); // Último dia do mês atual
    return (lastDay + 1) % 7; // Primeiro dia do próximo mês
  };

  const handleDayClick = (day) => {
    if (day) {  // Verificar se o dia não é nulo
      navigate(`/day/${currentMonth + 1}/${day}`);
    }
  };

  const goToNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;

    // Ajusta para o próximo mês e ano, caso necessário
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    // Atualiza o mês e ano
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const goToPreviousMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;

    // Ajusta para o mês e ano anterior, caso necessário
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    // Atualiza o mês e ano
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const totalDays = daysInMonth(currentMonth, currentYear);
  const startDay = firstDayOfMonth(currentMonth, currentYear);

  // Determina o primeiro dia do próximo mês com base no último dia do mês atual
  const nextMonthStartDay = getNextMonthStartDay(currentMonth, currentYear);

  const calendarDays = [];

  // Adiciona os dias em branco antes do primeiro dia do mês
  for (let i = 0; i < startDay; i++) {
    calendarDays.push({ day: null, isCurrentMonth: false }); // Dias em branco antes do início do mês
  }

  // Adiciona os dias do mês atual
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push({ day: i, isCurrentMonth: true });
  }

  // Preenche o restante do grid com dias do próximo mês, caso o grid não esteja completo
  const remainingCells = 42 - calendarDays.length; // 42 células no total para completar o grid
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({ day: i, isCurrentMonth: false });
  }

  // Função para verificar se o dia tem compromissos
  const checkAppointments = (day) => {
    const dayKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return appointments.some((appointment) => {
      const appointmentDate = new Date(appointment.dataAtiv); // Ajuste dependendo do formato da data
      const appointmentDateString = appointmentDate.toISOString().split('T')[0];
      return appointmentDateString === dayKey;
    });
  };

  return (
    <div className="calendar-container">
      <Navbar/>
      <h1>{months[currentMonth]} {currentYear}</h1>
      <div className="month-slide">
        <button onClick={goToPreviousMonth}>◀</button>
        <button onClick={goToNextMonth}>▶</button>
      </div>
      <div className="calendar-grid">
        {daysOfWeek.map((day) => (
          <div key={day} className="day-header">{day}</div>
        ))}

        {calendarDays.map((item, index) => {
          const { day, isCurrentMonth } = item;
          if (day === null) return <div key={index} className="calendar-day empty" />; // Dia vazio para completar o grid

          const hasAppointments = checkAppointments(day);

          return (
            <div
              key={index}
              className={`calendar-day ${hasAppointments ? 'has-appointments' : ''} ${!isCurrentMonth ? 'not-current-month' : ''}`}
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import './CalendarPage.css';

const CalendarPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Hook para buscar compromissos sempre que selectedDate mudar
  useEffect(() => {
    const fetchMonthlyAppointments = async () => {
      setLoading(true);
      try {
        const monthKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
        const response = await axios.get(`/api/calendario/month/${monthKey}`);
        setAppointments(response.data);
      } catch (error) {
        console.error("Erro ao buscar compromissos mensais:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMonthlyAppointments();
  }, [currentMonth, currentYear]);
  

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const lastDayOfMonth = (month, year) => new Date(year, month + 1, 0).getDay();

  const getNextMonthStartDay = (month, year) => {
    const lastDay = new Date(year, month + 1, 0).getDay(); // Último dia do mês atual
    return (lastDay + 1) % 7; // Primeiro dia do próximo mês
  };

  const handleDayClick = (day) => {
    if (day) {
      const dateString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      setSelectedDate(dateString);
      navigate(`/day/${currentMonth + 1}/${day}`);
    }
  };

  const goToNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const goToPreviousMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const totalDays = daysInMonth(currentMonth, currentYear);
  const startDay = firstDayOfMonth(currentMonth, currentYear);

  const nextMonthStartDay = getNextMonthStartDay(currentMonth, currentYear);

  const calendarDays = [];

  // Adiciona os dias em branco antes do primeiro dia do mês
  for (let i = 0; i < startDay; i++) {
    calendarDays.push({ day: null, isCurrentMonth: false });
  }

  // Adiciona os dias do mês atual
  for (let i = 1; i <= totalDays; i++) {
    calendarDays.push({ day: i, isCurrentMonth: true });
  }

  // Não preenche mais com dias do próximo mês, apenas completa com células vazias
  const remainingCells = 42 - calendarDays.length;
  for (let i = 0; i < remainingCells; i++) {
    calendarDays.push({ day: null, isCurrentMonth: false });
  }

  // Função para verificar se o dia tem compromissos
  const checkAppointments = (day) => {
    const dayKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  
    return appointments.some((appointment) => {
      const appointmentDate = new Date(appointment.dataAtiv).toISOString().split('T')[0];
      return appointmentDate === dayKey;
    });
  };
  

  return (
    <div className="calendar-container">
      <Navbar />
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
          if (day === null) return <div key={index} className="calendar-day empty" />;
        
          const hasAppointments = checkAppointments(day);  // Verifica se o dia tem compromissos
          const isInteractive = isCurrentMonth;  // Se não for do mês atual, será desativado
        
          return (
            <div
              key={index}
              className={`calendar-day ${hasAppointments ? 'has-appointments' : ''} ${!isCurrentMonth ? 'not-current-month' : ''}`}
              onClick={isInteractive ? () => handleDayClick(day) : null}
            >
              {isCurrentMonth ? day : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarPage;

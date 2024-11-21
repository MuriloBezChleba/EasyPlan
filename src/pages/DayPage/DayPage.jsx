// src/pages/DayPage/DayPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DayPage.css'
import { useAppointments } from '../../context/AppointmentsContext'; // Importando o contexto

const DayPage = () => {
  const { month, day } = useParams(); // Pegando mês e dia da URL
  const { appointments, setAppointments } = useAppointments(); // Acessando os compromissos e o setter
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [currentAppointments, setCurrentAppointments] = useState([]);

  // Convertendo o mês e o dia para a chave do compromisso
  const dateKey = `${new Date().getFullYear()}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

  useEffect(() => {
    // Atualizando os compromissos para o dia específico
    if (appointments[dateKey]) {
      setCurrentAppointments(appointments[dateKey]);
    } else {
      setCurrentAppointments([]);
    }
  }, [appointments, dateKey]);

  // Função para adicionar um novo compromisso
  const handleAddAppointment = (e) => {
    e.preventDefault();

    if (!name || !time || !location) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    // Atualizando os compromissos do dia
    const newAppointment = {
      name,
      time,
      location,
      details,
    };

    const updatedAppointments = { ...appointments };
    if (!updatedAppointments[dateKey]) {
      updatedAppointments[dateKey] = [];
    }
    updatedAppointments[dateKey].push(newAppointment);

    setAppointments(updatedAppointments); // Atualizando o contexto
    setName('');
    setTime('');
    setLocation('');
    setDetails(''); // Limpando os campos após adicionar o compromisso
  };

  return (
// src/pages/DayPage/DayPage.jsx
  <div className="day-page-container"> {/* Corrigido para day-page-container */}
    <h1>Compromissos de {day}/{month}</h1>
    
    <div>
      <h2>Compromissos:</h2>
      {currentAppointments.length > 0 ? (
        <ul>
          {currentAppointments.map((app, index) => (
            <li key={index}>
              <strong>{app.name}</strong> ({app.time}) - {app.location}
              <div style={{ backgroundColor: '#f5f5f5', padding: '10px', marginTop: '5px' }}>
                {app.details}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Não há compromissos para este dia.</p>
      )}
    </div>
    
    <div>
      <h2>Adicionar Novo Compromisso</h2>
      <form onSubmit={handleAddAppointment}>
        <div>
          <label>
            Nome do Compromisso:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do compromisso"
              required
              className="input-field"
            />
          </label>
        </div>
        <div>
          <label>
            Horário:
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="input-field"
            />
          </label>
        </div>
        <div>
          <label>
            Local:
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Local do compromisso"
              required
              className="input-field"
            />
          </label>
        </div>
        <div>
          <label>
            Detalhes:
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Detalhes do compromisso"
              className="textarea-field"
            />
          </label>
        </div>
        <button type="submit" className="button">Adicionar Compromisso</button>
      </form>    </div>
  </div>

  );
};

export default DayPage;

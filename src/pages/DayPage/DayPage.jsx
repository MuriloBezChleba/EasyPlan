import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppointments } from '../../context/AppointmentsContext';

const DayPage = () => {
  const { month, day } = useParams();
  const { appointments, fetchAppointments, addAppointment, deleteAppointment } = useAppointments();

  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');

  const dateKey = `${new Date().getFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  useEffect(() => {
    fetchAppointments(dateKey);
  }, [dateKey]);

  const currentAppointments = appointments.filter((app) => {
    try {
      const appointmentDate = new Date(app.dataAtiv);
      const appointmentDateString = appointmentDate.toISOString().split('T')[0];
      return appointmentDateString === dateKey;
    } catch (error) {
      console.error('Erro ao processar data do compromisso:', error);
      return false;
    }
  });

  const handleAddAppointment = async (e) => {
    e.preventDefault();

    if (!name || !time || !location) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const newAppointment = { name, time, location, details, date: dateKey };
    try {
      await addAppointment(newAppointment);
      setName('');
      setTime('');
      setLocation('');
      setDetails('');
    } catch (error) {
      console.error('Erro ao adicionar compromisso:', error);
      alert('Erro ao adicionar compromisso');
    }
  };

  const handleDelete = (id) => {
    if (id) {
      deleteAppointment(id);
    } else {
      console.error('ID não fornecido');
    }
  };

  return (
    <div className="day-page-container">
      <h1>Compromissos de {day}/{month}</h1>
      <div>
        <h2>Compromissos:</h2>
        {currentAppointments.length > 0 ? (
          <ul>
            {currentAppointments.map((app) => (
              <li key={app.id}>
                <strong>{app.name}</strong> ({app.time}) - {app.location}
                <div>{app.details}</div>
                <button onClick={() => handleDelete(app.id)}>Deletar</button>
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
          <label>
            Nome do Compromisso:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do compromisso"
              required
            />
          </label>
          <label>
            Horário:
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </label>
          <label>
            Local:
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Local do compromisso"
              required
            />
          </label>
          <label>
            Detalhes:
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Detalhes do compromisso"
            />
          </label>
          <button type="submit">Adicionar Compromisso</button>
        </form>
      </div>
    </div>
  );
};

export default DayPage;

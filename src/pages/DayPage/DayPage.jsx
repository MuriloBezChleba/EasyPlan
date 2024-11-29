import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppointments } from '../../context/AppointmentsContext'; 
import './DayPage.css';
import Navbar from '../../components/Navbar';

const DayPage = () => {
  const { month, day } = useParams();
  const { appointments, fetchAppointments, addAppointment, deleteAppointment, loading, error } = useAppointments();

  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');

  // Formatação segura da data
  const formattedMonth = month?.padStart(2, '0');
  const formattedDay = day?.padStart(2, '0');
  const dateKey = `${new Date().getFullYear()}-${formattedMonth}-${formattedDay}`;

  useEffect(() => {
    if (!appointments.length) {  // Só chama o fetch se não houver compromissos carregados
      fetchAppointments(dateKey);
    }
  }, [dateKey, fetchAppointments, appointments.length]);  // A dependência de appointments.length ajuda a evitar chamadas redundantes
  

  // Filtra os compromissos com base na data correta
  // DayPage.jsx
  const currentAppointments = appointments.filter((app) => {
    const appointmentDateString = new Date(app.dataAtiv).toISOString().split('T')[0];
    return appointmentDateString === dateKey;
  });


  const handleDelete = (id) => {
    if (id) {
      deleteAppointment(id);
    } else {
      console.error('ID não fornecido');
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
  
    if (!name || !time || !location) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
  
    const newAppointment = { name, time, location, details, date: dateKey };
  
    const appointmentDate = new Date(newAppointment.date);
    if (isNaN(appointmentDate)) {
      alert('Data inválida. Tente novamente.');
      return;
    }
  
    try {
      await addAppointment(newAppointment);  // Adiciona o novo compromisso diretamente ao estado
      setName('');
      setTime('');
      setLocation('');
      setDetails('');
    } catch (error) {
      console.error('Erro ao adicionar compromisso:', error);
      alert('Erro ao adicionar compromisso');
    }
  };
  

  return (
    <div className="day-page-container">
      <Navbar />
      <h1>Compromissos de {day}/{month}</h1>

      {loading && <p>Carregando compromissos...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h2>Compromissos:</h2>
        {currentAppointments.length > 0 ? (
          <ul>
            {currentAppointments.map((app) => (
              <li key={app.id}>
                <strong>{app.name}</strong> ({app.time}) - {app.location}
                <div style={{ backgroundColor: '#f5f5f5', padding: '10px', marginTop: '5px' }}>
                  {app.details}
                </div>
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
          <div>
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
          </div>
          <div>
            <label>
              Horário:
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
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
              />
            </label>
          </div>
          <button type="submit">Adicionar Compromisso</button>
        </form>
      </div>
    </div>
  );
};

export default DayPage;

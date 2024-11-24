// DayPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppointments } from '../../context/AppointmentsContext'; // Importa o contexto
import axios from 'axios';

const DayPage = () => {
  const { month, day } = useParams();  // Pega mês e dia da URL
  const { appointments, fetchAppointments, addAppointment, deleteAppointment } = useAppointments(); // Desestruturação do contexto

  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');

  // Formatação da data para YYYY-MM-DD
  const dateKey = `${new Date().getFullYear()}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

  useEffect(() => {
    // Chama a função fetchAppointments e passa a data específica
    fetchAppointments(dateKey);

    // Log para verificar o que está sendo retornado
    
  }, [dateKey, fetchAppointments]);

  // Filtra os compromissos com base na data
  const currentAppointments = appointments.filter(app => {
    const appointmentDate = new Date(app.dataAtiv); // Usando o nome correto do campo de data
  
    // Verifica se a data é válida
    if (isNaN(appointmentDate)) {
      console.error(`Data inválida para o compromisso ${app.id}: ${app.dataAtiv}`);
      return false;  // Ignora compromissos com datas inválidas
    }
  
    const appointmentDateString = appointmentDate.toISOString().split('T')[0]; // Formata para 'YYYY-MM-DD'
    return appointmentDateString === dateKey;
  });
  
  

  const handleDelete = (id) => {
    if (id) {
      deleteAppointment(id); // Deleta compromisso
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

    try {
      // Envia o compromisso para o backend
      await addAppointment(newAppointment);  // Usando a função do contexto, que já lida com o POST
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
      <h1>Compromissos de {day}/{month}</h1>

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

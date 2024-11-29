import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Criação do contexto para compromissos
const AppointmentsContext = createContext();

// Função para acessar o contexto
export const useAppointments = () => {
  return useContext(AppointmentsContext);
};

// Componente que fornece o estado e funções para compromissos
export const AppointmentsProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para buscar compromissos do backend com base na data
  // fetchAppointments no contexto
  const fetchAppointments = async (monthKey) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/calendario/${monthKey}`);
      setAppointments(response.data);  // Carrega os compromissos para o mês
    } catch (error) {
      console.error('Erro ao buscar compromissos:', error);
      setError('Erro ao carregar compromissos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  

  
  
  

  // Função para adicionar um compromisso
  const addAppointment = async (newAppointment) => {
    try {
      const response = await axios.post('/api/calendario', newAppointment);
      setAppointments((prevAppointments) => [...prevAppointments, { ...response.data, dataAtiv: newAppointment.date }]);
    } catch (error) {
      console.error('Erro ao adicionar compromisso:', error);
      setError('Erro ao adicionar compromisso. Tente novamente.');
      throw error;
    }
  };
  
  

  // Função para deletar um compromisso
  const deleteAppointment = async (id) => {
    if (!id) {
      console.error('ID não fornecido para deletar compromisso');
      return;
    }

    try {
      await axios.delete(`/api/calendario/${id}`);
      setAppointments((prev) => prev.filter((app) => app.id !== id));
    } catch (error) {
      console.error('Erro ao deletar compromisso:', error);
      setError('Erro ao deletar compromisso. Tente novamente.');
    }
  };

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        fetchAppointments,
        addAppointment,
        deleteAppointment,
        loading,
        error,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
};

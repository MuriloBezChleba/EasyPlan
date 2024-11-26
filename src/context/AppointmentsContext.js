import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Criação do contexto para compromissos
const AppointmentsContext = createContext();

// Função para acessar o contexto
export const useAppointments = () => {
  return useContext(AppointmentsContext);
};

// Componente que vai fornecer o estado e funções para os compromissos
export const AppointmentsProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);  // Estado para controle de carregamento
  const [error, setError] = useState(null);  // Estado para controle de erro

  // Função para buscar compromissos do backend com base na data
  const fetchAppointments = async (dateKey) => {
    setLoading(true);
    setError(null);  // Reseta o erro sempre que começa uma nova requisição

    try {
      const response = await axios.get(`http://localhost:5000/api/calendario/${dateKey}`);
      setAppointments(response.data);  // Atualiza os compromissos com a data correta
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
      const response = await axios.post('http://localhost:5000/api/calendario', newAppointment);
      // Adiciona ao estado após o retorno do servidor, com o id gerado
      setAppointments((prev) => [...prev, { ...newAppointment, id: response.data.id }]);
    } catch (error) {
      console.error('Erro ao adicionar compromisso:', error);
      throw error;  // Lançando erro para o frontend capturar
    }
  };

  // Função para deletar um compromisso
  const deleteAppointment = async (id) => {
    if (!id) {
      console.error('ID não fornecido para deletar compromisso');
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/calendario/${id}`);
      setAppointments((prev) => prev.filter((app) => app.id !== id));  // Atualiza estado após exclusão
    } catch (error) {
      console.error('Erro ao deletar compromisso:', error);
    }
  };

  return (
    <AppointmentsContext.Provider value={{ appointments, fetchAppointments, addAppointment, deleteAppointment, loading, error }}>
      {children}
    </AppointmentsContext.Provider>
  );
};

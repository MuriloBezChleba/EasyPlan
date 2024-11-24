// src/context/AppointmentsContext.js
import React, { createContext, useState, useContext } from 'react';

// Criação do contexto
const AppointmentsContext = createContext();

// Provedor do contexto
export const AppointmentsProvider = ({ children }) => {
  // Estado que armazena os compromissos
  const [appointments, setAppointments] = useState({});

  return (
    <AppointmentsContext.Provider value={{ appointments, setAppointments }}>
      {children}
    </AppointmentsContext.Provider>
  );
};

// Hook para usar o contexto em outros componentes
export const useAppointments = () => useContext(AppointmentsContext);

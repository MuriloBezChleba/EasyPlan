import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CadastroPage from './pages/CadastroPage/CadastroPage';
import TimerPage from './pages/TimerPage/TimerPage';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import DayPage from './pages/DayPage/DayPage';
import AccountPage from './pages/AccountPage/AccountPage';
import Login from './pages/FirstPage/FirstPage';
import { AppointmentsProvider } from './context/AppointmentsContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se há token no localStorage
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Atualiza o estado com base no token
    setLoading(false); // Remove o estado de carregamento
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <AppointmentsProvider>
      <Routes>
        {/* Rota inicial */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/timer' : '/login'} />}
        />

        {/* Página de login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/timer" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        {/* Página de cadastro */}
        <Route path="/cadastro" element={<CadastroPage />} />

        {/* Rotas protegidas */}
        {isAuthenticated ? (
          <>
            <Route path="/timer" element={<TimerPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/day" element={<DayPage />} />
            <Route path="/conta" element={<AccountPage />} />
          </>
        ) : (
          // Redireciona qualquer rota não protegida para login
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </AppointmentsProvider>
  );
}

export default App;

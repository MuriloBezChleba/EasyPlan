import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CadastroPage from './pages/CadastroPage/CadastroPage';
import TimerPage from './pages/TimerPage/TimerPage';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import DayPage from './pages/DayPage/DayPage';
import AccountPage from './pages/AccountPage/AccountPage';
import Login from './pages/FirstPage/FirstPage';
import { AppointmentsProvider } from './context/AppointmentsContext';

function App() {
  return (
    <AppointmentsProvider>
      <Routes>
        {/* Página inicial de login */}
        <Route path="/" element={<Login />} />

        {/* Página de cadastro */}
        <Route path="/cadastro" element={<CadastroPage />} />

        {/* Páginas principais */}
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/day/:month/:day" element={<DayPage />} />
        <Route path="/conta" element={<AccountPage />} />

        {/* Rota padrão para páginas não encontradas */}
        <Route path="*" element={<Login />} />
      </Routes>
    </AppointmentsProvider>
  );
}

export default App;

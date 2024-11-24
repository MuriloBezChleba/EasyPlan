import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import FirstPage from './pages/FirstPage/FirstPage';
import CadastroPage from './pages/CadastroPage/CadastroPage';
import TimerPage from './pages/TimerPage/TimerPage';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import DayPage from './pages/DayPage/DayPage';
import AccountPage from './pages/AccountPage/AccountPage';
import { AppointmentsProvider } from './context/AppointmentsContext'; // Corrigido
import { useState } from 'react';
import Login from './pages/FirstPage/FirstPage'; // Ajuste o caminho conforme necessário

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token') !== null);

  return (
    <AppointmentsProvider>
      <Navbar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/day" element={<DayPage />} />
        <Route path="/conta" element={<AccountPage />} />
        <Route path="/" element={<FirstPage />} />
      </Routes>
    </AppointmentsProvider>
  );
}

export default App;

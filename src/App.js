import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import FirstPage from './pages/FirstPage/FirstPage';
import CadastroPage from './pages/CadastroPage/CadastroPage';
import TimerPage from './pages/TimerPage/TimerPage';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import DayPage from './pages/DayPage/DayPage';
import AccountPage from './pages/AccountPage/AccountPage';

function App() {
  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<FirstPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/day/:month/:day" element={<DayPage />} />
          <Route path="/conta" element={<AccountPage />} />
        </Routes>
      </main>
      <Navbar />
    </>
  );
}

export default App;

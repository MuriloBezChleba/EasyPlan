import { Route, Routes } from 'react-router-dom';
import './App.css';
import FirstPage from './pages/FirstPage/FirstPage.jsx';
import CadastroPage from './pages/CadastroPage/CadastroPage.jsx';
import TimerPage from './pages/TimerPage/TimerPage.jsx';  // Corrigido o caminho

function App() {
  return (
    <main>
      <Routes>
        <Route path='/' element={<FirstPage />} /> {/* Tela de entrada */}
        <Route path='/cadastro' element={<CadastroPage />} />
        <Route path='/timer' element={<TimerPage />} />
      </Routes>
    </main>
  );
}

export default App;

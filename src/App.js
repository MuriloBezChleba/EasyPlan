import { Route, Routes } from 'react-router-dom';
import './App.css';
import FirstPage from './pages/FirstPage/FirstPage.jsx';

function App() {
  return (
    <main>
      <Routes>
        <Route path='/' element={<FirstPage />} /> {/*tela de quando vc entra no app*/}
      </Routes>
    </main>
  );
}

export default App;

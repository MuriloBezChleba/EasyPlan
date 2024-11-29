import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './AccountPage.css';

const AccountPage = () => {
  const [activeOption, setActiveOption] = useState(null); // Controle do pop-up
  const [inputValue, setInputValue] = useState(''); // Controle do valor do input

  const handleOptionClick = (option) => {
    setActiveOption(option);
    setInputValue(''); // Reseta o input ao abrir
  };

  const handleSave = () => {
    alert(`${activeOption} atualizado para: ${inputValue}`);
    setActiveOption(null); // Fecha o pop-up
  };

  return (
    <div className="account-container">
      <Navbar/>
      <h1>Configurações da Conta</h1>
      <div className="options-container">
        <button onClick={() => handleOptionClick('Mudar Nome de Usuário')}>
          Mudar Nome de Usuário
        </button>
        <button onClick={() => handleOptionClick('Mudar Email')}>Mudar Email</button>
        <button onClick={() => handleOptionClick('Redefinir Senha')}>
          Redefinir Senha
        </button>
        <button onClick={() => handleOptionClick('Suporte')}>Suporte</button>
      </div>

      <div className="save-button-container">
        <NavLink to="/timer" className="save-button">
          Salvar e Continuar
        </NavLink>
      </div>

      {activeOption && (
        <div className="popup">
          <div className="popup-content">
            <h2>{activeOption}</h2>
            <input
              type="text"
              placeholder={`Digite o novo ${activeOption.toLowerCase()}`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleSave}>Salvar</button>
              <button onClick={() => setActiveOption(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;

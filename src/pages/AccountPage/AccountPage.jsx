import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import './AccountPage.css';

const AccountPage = () => {
  const [activeOption, setActiveOption] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const popupRef = useRef(null); // Referência para o popup

  const handleOptionClick = (option) => {
    setActiveOption(option);
    setInputValue('');
    setRating(0);
    setComment('');
    // Usando a referência para adicionar a classe 'show' ao popup
    if (popupRef.current) {
      popupRef.current.classList.add('show');
    }
  };

  const handleClosePopup = () => {
    if (popupRef.current) {
      popupRef.current.classList.remove('show');
    }
  };

  const handleStarClick = (star) => {
    setRating(star); // Atualiza a nota com base na estrela clicada
  };

  const handleSave = () => {
    let endpoint = '';
    let data = {};
  
    // Definindo o endpoint correto com base na opção ativa
    if (activeOption === 'Mudar Nome de Usuário') {
      endpoint = '/update-username';
      data = { idu: 1, nome: inputValue };  // Atualizando o nome de usuário
    } else if (activeOption === 'Mudar Email') {
      endpoint = '/update-email';
      data = { idu: 1, email: inputValue };  // Atualizando o email
    } else if (activeOption === 'Redefinir Senha') {
      endpoint = '/update-password';
      data = { idu: 1, senha: inputValue };  // Atualizando a senha
    } else if (activeOption === 'Suporte') {
      endpoint = '/feedback';
      data = { idu: 1, nota: rating, comentario: comment };  // Feedback
    }
  
    // Fazendo a requisição com o endpoint correto
    const method = activeOption === 'Suporte' ? 'post' : 'put'; // Usando POST para feedback
    axios[method](`http://localhost:5000${endpoint}`, data)
      .then((response) => {
        alert(`${activeOption} enviado com sucesso!`);
        setActiveOption(null);
        handleClosePopup(); // Fecha o popup após o envio
      })
      .catch((error) => {
        console.error('Erro ao enviar:', error);
        alert('Erro ao enviar a informação.');
      });
  };
  
  

  return (
    <main>
      <div className="account-container">
        <img src="Profile.svg" alt="profile" className='profile\' />
        <Navbar />
        <h1>Configurações da Conta</h1>
        <div className="options-container">
          <button onClick={() => handleOptionClick('Mudar Nome de Usuário')}>Mudar Nome de Usuário</button>
          <button onClick={() => handleOptionClick('Mudar Email')}>Mudar Email</button>
          <button onClick={() => handleOptionClick('Redefinir Senha')}>Redefinir Senha</button>
          <button onClick={() => handleOptionClick('Feedback')}>Feedback</button>
        </div>

        {activeOption && (
          <div className="popup" ref={popupRef}>
            <div className="popup-content">
              <h2>{activeOption}</h2>
              {activeOption === 'Suporte' ? (
                <>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${rating >= star ? 'filled' : ''}`}
                        onClick={() => handleStarClick(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <textarea
                    placeholder="Deixe seu comentário aqui..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </>
              ) : (
                <input
                  type="text"
                  placeholder={`Digite o novo ${activeOption.toLowerCase()}`}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              )}
              <div className="popup-buttons">
                <button onClick={handleSave}>Salvar</button>
                <button onClick={handleClosePopup}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AccountPage;

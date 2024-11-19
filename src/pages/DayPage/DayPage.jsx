import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DayPage.css';

const DayPage = () => {
  const { month, day } = useParams(); // Pega o mês e o dia da URL
  const navigate = useNavigate();

  return (
    <div className="day-container">
      <h1>Dia {day} de {month}</h1>
      <p>Detalhes sobre o dia selecionado...</p>
      <button className="back-button" onClick={() => navigate(-1)}>
        Voltar
      </button>
    </div>
  );
};

export default DayPage;

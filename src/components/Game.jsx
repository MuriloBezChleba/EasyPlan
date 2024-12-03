import React, { useState, useEffect, useRef } from 'react';
import './Game.css'; // Estilização do menu deslizante
import axios from 'axios';

const planets = [
  { id: 0, image: '/planetas/0.svg', requiredHours: 0 }, 
  { id: 1, image: '/planetas/1.svg', requiredHours: 2 },
  { id: 2, image: '/planetas/2.svg', requiredHours: 5 },
  { id: 3, image: '/planetas/3.svg', requiredHours: 10 },
  { id: 4, image: '/planetas/4.svg', requiredHours: 15 },
  { id: 5, image: '/planetas/5.svg', requiredHours: 20 },
  { id: 6, image: '/planetas/6.svg', requiredHours: 25 },
  { id: 7, image: '/planetas/7.svg', requiredHours: 50 },
  { id: 8, image: '/planetas/8.svg', requiredHours: 60 },
  { id: 9, image: '/planetas/9.svg', requiredHours: 80 },
];

const Game = ({ onSelectPlanet }) => {
  const [totalHours, setTotalHours] = useState(0);
  const [menuOpen, setMenuOpen] = useState(true); // Controlar se o menu está aberto
  const menuRef = useRef(null); // Referência para o menu

  useEffect(() => {
    // Fetch tempoTotal em minutos e converte para horas
    axios.get('http://localhost:5000/get-total-time')
      .then((response) => {
        const totalMinutes = response.data.tempoTotal || 0;
        setTotalHours(totalMinutes / 60);
      })
      .catch((error) => console.error('Erro ao buscar tempo total:', error));

    // Função para fechar o menu ao clicar fora
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false); // Fecha o menu se o clique for fora
      }
    };

    // Adiciona o evento de clique fora do menu
    document.addEventListener('mousedown', handleClickOutside);

    // Remove o evento quando o componente for desmontado
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`slide-menu ${menuOpen ? 'open' : 'closed'}`} ref={menuRef}>
      <h2>Selecione um Planeta</h2>
      <div className="planet-list">
        {planets.map((planet) => (
          <button
            key={planet.id}
            className={`planet-button ${totalHours >= planet.requiredHours ? '' : 'locked'}`}
            onClick={() => totalHours >= planet.requiredHours && onSelectPlanet(planet.id)}
            disabled={totalHours < planet.requiredHours}
            style={{
              backgroundImage: planet.id === null ? 'none' : `url(${planet.image})`, // Evitar erro para o primeiro planeta
              opacity: totalHours >= planet.requiredHours ? 1 : 0.5, // Diminuir a opacidade dos planetas bloqueados
            }}
          >
            {totalHours < planet.requiredHours && (
              <span className="locked-message">{planet.requiredHours}h</span> // Mensagem de bloqueio
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Game;

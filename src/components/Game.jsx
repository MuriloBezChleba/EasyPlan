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
  const [menuOpen, setMenuOpen] = useState(false); // Controla a abertura do menu
  const [selectedPlanetId, setSelectedPlanetId] = useState(null); // Definir o estado do planeta selecionado
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
    <div>
      {/* Este botão está sendo chamado com uma imagem */}
      <div
        className="large-ball"
        onClick={() => setMenuOpen(true)} // Abre o menu ao clicar na bola
      />
      
      {/* Menu deslizante com planetas */}
      <div className={`slide-menu ${menuOpen ? 'open' : 'closed'}`} ref={menuRef}>
        <h2>Selecione um Planeta</h2>
        <div className="planet-list">
          {planets.map((planet) => (
            <button
              key={planet.id}
              className={`planet-button ${totalHours >= planet.requiredHours ? '' : 'locked'}`}
              onClick={() => {
                if (totalHours >= planet.requiredHours) {
                  setSelectedPlanetId(planet.id); // Atualiza o planeta selecionado
                  onSelectPlanet(planet.id); // Executa a função do pai
                }
              }}
              disabled={totalHours < planet.requiredHours}
              style={{ backgroundImage: `url(${planet.image})` }}
            >
              {totalHours < planet.requiredHours && (
                <span className="locked-message">{planet.requiredHours}h</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;

import React, { useState, useEffect } from 'react';
import './TimerPage.css';
import Navbar from '../../components/Navbar';
import MoonImage from '../../images/lua.svg'; // Imagem da Lua
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Game from '../../components/Game';

const TimerPage = () => {
  const [time, setTime] = useState(0); // Tempo em segundos
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTime, setSelectedTime] = useState(25); // Tempo default de 25 minutos
  const [timerId, setTimerId] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // Novo estado para controle de inserção
  const [showMenu, setShowMenu] = useState(false); // Estado para controlar o menu do jogo
  const [selectedPlanetId, setSelectedPlanetId] = useState(1);
  const [hasStarted, setHasStarted] = useState(false); // Para controlar se o timer já foi iniciado
  const navigate = useNavigate();

  // Função para iniciar o timer
  const startTimer = () => {
    if (selectedTime <= 0 || isRunning) return; // Verifica se o timer já está rodando
    
    setIsRunning(true);
    setTime(selectedTime * 60); // Converte minutos para segundos
    setHasStarted(true);
  
    const id = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(id);
          setIsRunning(false);
          setHasStarted(false);
  
          if (!isSaving) {
            savePomodoro(selectedTime); // Chamada única ao terminar
          }
  
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  
    setTimerId(id); // Armazena o id do timer
  };

  // Função para parar o timer
  const stopTimer = () => {
    clearInterval(timerId);
    setIsRunning(false);
    setHasStarted(false);
    setSelectedTime(25); // Resetar o tempo selecionado para o valor default
  };

  // Função para salvar o tempo
  const savePomodoro = (tempoAtiv) => {
    if (isSaving) return;
  
    setIsSaving(true);
    const tempoAtivNum = Number(tempoAtiv);
    const dataAtual = new Date().toISOString().split('T')[0]; // Formata a data para o formato YYYY-MM-DD
  
    fetch('http://localhost:5000/save-pomodoro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tempoAtiv: tempoAtivNum, dataAtiv: dataAtual }), // Envia tempo e data
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Tempo total salvo:', data.totalTime);
        alert(`Tempo total acumulado: ${data.totalTime} minutos`);
      })
      .catch((error) => {
        console.error('Erro ao salvar o tempo:', error);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  // Função para atualizar o planeta selecionado
  const handlePlanetSelect = (planetId) => {
    setSelectedPlanetId(planetId);
    setShowMenu(false); // Fechar o menu após seleção
    axios.put('http://localhost:5000/update-planet', { idPlaneta: planetId })
    .catch((error) => console.error('Erro ao atualizar planeta:', error));
  };

  // Recupera o último planeta selecionado ao carregar a página
  useEffect(() => {
    axios.get('http://localhost:5000/get-last-pomodoro')
      .then((response) => {
        setSelectedPlanetId(response.data.idPlaneta || 0); // Aqui verifica se existe um valor de idPlaneta
      })
      .catch((error) => console.error('Erro ao buscar planeta:', error));
  }, []);

  return (
    <main>
      <div className="timer-container">
        <Navbar />
        <div className="timer">
          {/* Exibe o planeta grande apenas uma vez aqui */}
          {!showMenu && (
            <div
              className="large-ball"
              onClick={() => setShowMenu(true)} // Abre o menu do jogo ao clicar na bola
              style={{
                backgroundImage: `url(/planetas/${selectedPlanetId}.svg)` // Aplique a imagem do planeta com interpolação de string
              }}
            />
          )}

          {/* Exibe o Game component apenas quando showMenu for true */}
          {showMenu && <Game onSelectPlanet={handlePlanetSelect} />}

          <div className="orbit-container">
            {/* Trajetória (caminho da órbita) */}
            <div className="orbit-path"></div>

            {/* Esta parte do código será para exibir o planeta pequeno ou o movimento, não o grande */}
            <div
              className="small-ball"
              style={{
                backgroundImage: `url(${MoonImage})`,
                animationDuration: `${selectedTime * 60}s`,
                animationPlayState: isRunning ? 'running' : 'paused',
              }}
            />
          </div>
        </div>
            
        <div className="time-control">
          {!isRunning ? (
            <div className="time-selector">
              <label>Selecione o tempo (em minutos):</label>
              <input
                type="number"
                value={selectedTime}
                onChange={(e) => setSelectedTime(Number(e.target.value))}
                min="1"
              />
              <button onClick={startTimer} disabled={selectedTime <= 0}>
                Iniciar
              </button>
            </div>
          ) : (
            <div className="time-display">
              <span>
                {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}s
              </span>
              <button onClick={stopTimer}>Parar</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default TimerPage;

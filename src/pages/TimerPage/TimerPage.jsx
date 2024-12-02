import React, { useState, useEffect } from 'react';
import './TimerPage.css';
import Navbar from '../../components/Navbar';
import EarthImage from '../../images/terra.svg'; // Imagem da Terra
import MoonImage from '../../images/lua.svg'; // Imagem da Lua
import { useNavigate } from 'react-router-dom';

const TimerPage = () => {
  const [time, setTime] = useState(0); // Tempo em segundos
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTime, setSelectedTime] = useState(25); // Tempo default de 25 minutos
  const [timerId, setTimerId] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // Novo estado para controle de inserção
  const [hasStarted, setHasStarted] = useState(false); // Para controlar se o timer já foi iniciado
  const navigate = useNavigate();

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
;
    }, 1000);
  
    setTimerId(id); // Armazena o id do timer
  };

  const stopTimer = () => {
    clearInterval(timerId);
    setIsRunning(false);
    setHasStarted(false);
    setSelectedTime(25); // Resetar o tempo selecionado para o valor default
  };


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
  
  
  

  

  useEffect(() => {
    // Resetar o timer se o usuário mudar de página
    const handleBeforeUnload = () => {
      stopTimer();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="timer-container">
      <Navbar />
      <div className="timer">
        <div className="orbit-container">
          {/* Marca de onde a Lua começa */}
          <div className="orbit-start-marker"></div>

          {/* Trajetória (caminho da órbita) */}
          <div className="orbit-path"></div>

          {/* Bola maior com imagem (Terra) */}
          <div
            className="large-ball"
            style={{
              backgroundImage: `url(${EarthImage})`,
            }}
          >
            {/* Bola menor com imagem (Lua) */}
            <div
              className="small-ball"
              style={{
                backgroundImage: `url(${MoonImage})`,
                animationDuration: `${selectedTime * 60}s`, // Define o tempo da animação
                animationPlayState: isRunning ? 'running' : 'paused', // Controla o estado da animação
              }}
            />
          </div>
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
  );
};

export default TimerPage;

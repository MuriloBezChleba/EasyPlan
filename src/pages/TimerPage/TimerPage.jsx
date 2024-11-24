import React, { useState, useEffect } from 'react';
import './TimerPage.css'; // Importar o CSS

const TimerPage = () => {
  const [time, setTime] = useState(0); // Tempo em segundos
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTime, setSelectedTime] = useState(0); // Tempo selecionado pelo usuário
  const [timerId, setTimerId] = useState(null);

  const startTimer = () => {
    if (selectedTime === 0) return;

    setIsRunning(true);
    setTime(selectedTime);

    const id = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(id);
          setIsRunning(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    setTimerId(id);
  };

  const stopTimer = () => {
    clearInterval(timerId);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(timerId);
    setTime(0);
    setIsRunning(false);
  };

  return (
    <div className="timer-container">
      <div className="time-selector">
        <label>Selecione o tempo (em minutos):</label>
        <input
          type="number"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          disabled={isRunning}
        />
      </div>

      <div className="timer">
        <div className="orbit-container">
          {/* Círculo da trajetória */}
          <div className="orbit-path"></div>

          <div className="large-ball">
            <div
              className="small-ball"
              style={{
                animationDuration: `${selectedTime * 60}s`,
                animationPlayState: isRunning ? 'running' : 'paused',
              }}
            />
          </div>
        </div>

        <div className="time-display">
          {time}s
        </div>
      </div>

      <div className="controls">
        <button onClick={startTimer} disabled={isRunning}>
          Iniciar
        </button>
        <button onClick={stopTimer} disabled={!isRunning}>
          Parar
        </button>
        <button onClick={resetTimer}>
          Resetar
        </button>
      </div>
    </div>
  );
};

export default TimerPage;

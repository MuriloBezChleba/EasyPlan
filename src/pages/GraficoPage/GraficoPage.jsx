import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Navbar from '../../components/Navbar';
import { format } from 'date-fns';
import './GraficoPage.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraficoPage = () => {
  const [graficoData, setGraficoData] = useState({ days: [], timeData: [] });
  const [tempoData, setTempoData] = useState({ totalTempo: 0, tempoHoje: 0, tempoOntem: 0 });

  useEffect(() => {
    fetch('http://localhost:5000/api/grafico')
      .then(response => response.json())
      .then(data => {
        const formattedDays = data.days.map(day => format(new Date(day), 'dd/MM')); // Formata as datas para 'dia/mês'
        setGraficoData({ days: formattedDays, timeData: data.timeData });
      })
      .catch(error => console.error('Erro ao buscar dados para o gráfico:', error));
  
    fetch('http://localhost:5000/api/tempo')
      .then(response => response.json())
      .then(data => setTempoData(data))
      .catch(error => console.error('Erro ao buscar dados de tempo:', error));
  }, []);
  
  
  const formatarTempo = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return horas > 0 ? `${horas} horas` : `${mins} minutos`;
  };

  return (
    <div className="grafico-page">
      <Navbar />
      <h2>Gráfico de Tempo Utilizado nos Últimos 7 Dias</h2>

      {/* Gráfico de Linha */}
      <div className="grafico-container">
        <Line 
          data={{
            labels: graficoData.days,
            datasets: [{
              label: 'Tempo total de Timer (em minutos)',
              data: graficoData.timeData,
              borderColor: '#3498db',  // Alterando a cor para um tom de azul
              backgroundColor: 'rgba(52, 152, 219, 0.2)',  // Cor de fundo para a área abaixo da linha
              tension: 0.4,  // Aumentando a suavidade da linha
              pointBackgroundColor: '#3498db',  // Cor dos pontos
              pointBorderColor: '#fff',  // Cor das bordas dos pontos
              pointBorderWidth: 2,
            }],
          }}
          options={{
            responsive: true,
            scales: {
              x: { 
                title: { display: true, text: 'Data' }, 
                grid: { color: '#ddd' }  // Cor da grade do eixo X
              },
              y: { 
                title: { display: true, text: 'Tempo (minutos)' }, 
                min: 0,
                grid: { color: '#ddd' },  // Cor da grade do eixo Y
              },
            },
            plugins: {
              tooltip: {
                backgroundColor: '#333', // Cor de fundo do tooltip
                titleColor: '#fff', // Cor do título do tooltip
                bodyColor: '#fff', // Cor do texto do tooltip
              },
            },
          }}
        />
      </div>

      {/* Informações de Tempo */}
      <div className="tempo-containers">
        <div className="tempo-box">
          <h3>Tempo Total</h3>
          <p>{formatarTempo(tempoData.totalTempo)}</p>
        </div>
        <div className="tempo-box">
          <h3>Tempo Hoje</h3>
          <p>{formatarTempo(tempoData.tempoHoje)}</p>
        </div>
        <div className="tempo-box">
          <h3>Tempo Ontem</h3>
          <p>{formatarTempo(tempoData.tempoOntem)}</p>
        </div>
      </div>
    </div>
  );
};

export default GraficoPage;

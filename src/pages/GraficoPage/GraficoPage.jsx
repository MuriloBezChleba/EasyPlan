import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './GraficoPage.css';
import Navbar from '../../components/Navbar';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraficoPage = () => {
  const [graficoData, setGraficoData] = useState({ days: [], timeData: [] });

  useEffect(() => {
    // Fetch dos dados do gráfico dos últimos 7 dias
    fetch('http://localhost:5000/api/grafico')
      .then(response => response.json())
      .then(data => {
        console.log(data);  // Verifique se os dados estão sendo recebidos corretamente

        // Não modifica mais os valores de timeData
        setGraficoData({
          days: data.days,
          timeData: data.timeData,
        });
      })
      .catch(error => {
        console.error('Erro ao buscar dados para o gráfico:', error);
      });
  }, []);

  const data = {
    labels: graficoData.days, // Dias da semana
    datasets: [
      {
        label: 'Tempo total de Timer (em minutos)',
        data: graficoData.timeData, // Tempo total por dia
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Data',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Tempo (minutos)',
        },
        min: 0,
      },
    },
  };

  return (
    <div>
        <Navbar />
        <h2>Gráfico de Tempo Utilizado nos Últimos 7 Dias</h2>
        <Line data={data} options={options} />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
    </div>
  );
};

export default GraficoPage;

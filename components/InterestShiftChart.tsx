'use client';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

// Chart.jsの基本設定
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

export default function InterestShiftChart(interestShift: number[] ) {
    const data = {
        
        datasets: [{
            label: '',
            data: interestShift,
            fill: false,
            borderColor: '#AAAAAA',
            tension: 0.1
        }]
    };

    const options = {
        plugins: {
            legend: {
                display: false,
            },
            title:{
                display:true,
                text:"興味の推移"
            }
        },
        responsive: true,
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                suggestedMin: 1,
                suggestedMax: 5,
                ticks: {
                    stepSize: 1,
                },
            }
        }
    };

    return (
        <>
            <Line
                height={300}
                data={data}
                options={options}                
            />
        </>
    );
}

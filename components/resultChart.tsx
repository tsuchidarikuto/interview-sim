'use client';
import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js';

// Chart.jsの基本設定
ChartJS.register(Title, Tooltip, Legend,RadialLinearScale, PointElement, LineElement, Filler);
    
export default function ResultChart() {
    const data={
        labels: ['技術力','コミュニケーション力','チームワーク','論理的思考力','学習意欲','企業理解・志望動機'],
        datasets:[{
            label:'評価',
            data:[5,4,3,2,1,5],
        }]

    }
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Chart.js Bar Chart',
          },
        },
      }
    return(
        <div style={{height:'100%',width:'100%'}}>
        <Radar
            data={data}
            options={options}
        />
        </div>
    )
}
  
  
  
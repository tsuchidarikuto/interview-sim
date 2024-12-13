'use client';
import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler } from 'chart.js';

// Chart.jsの基本設定
ChartJS.register(Title, Tooltip, Legend,RadialLinearScale, PointElement, LineElement, Filler);

interface scoreTypes {
    technical:number,
    communication:number,
    teamwork:number,
    logicalThinking:number,
    learningDesire:number,
    companyUnderstanding:number,
}

export default function ResultChart(score:scoreTypes) {
    const data={
        labels: ['技術力','コミュニケーション力','チームワーク','論理的思考力','学習意欲','企業理解・志望動機'],
        datasets:[{
            label:'評価',
            data:[
                score.technical,
                score.communication,
                score.teamwork,
                score.logicalThinking,
                score.learningDesire,
                score.companyUnderstanding
            ],
        }]

    }
    const options = {
        responsive: true,
        scales: {
          r:{
            suggestedMin: 0,
            suggestedMax: 10,
          }
        }
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
  
  
  
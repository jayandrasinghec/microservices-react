import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const options = {
  rotation: 1 * Math.PI,
  circumference: 1 * Math.PI,
  title: {
    display: true,
    text: 'Issues By Severity'
  }
}

const data = {
  labels: [
    'Good',
    'Medium',
    'High'
  ],
  datasets: [{
    label: 'Issues By Severity',
    data: [103, 26, 23],
    backgroundColor: [
      'rgb(36, 188, 116)',
      'rgb(255, 180, 76)',
      'rgb(252, 100, 100)'
    ],
    hoverOffset: 4
  }]
};


const DoughnutChart = () => (
  <>
    <Doughnut data={data} options={options} />
  </>
);

export default DoughnutChart;

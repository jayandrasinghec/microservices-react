import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const StackedBarChart = (props) => {
  const { dashboardData } = props;

  const [name, setName] = useState([])
  const [good, setGood] = useState([])
  const [medium, setMedium] = useState([])
  const [high, setHigh] = useState([])

  useEffect(() => {
    constructDataArr()
  }, [dashboardData])

  const constructDataArr = () => {
    const nameArr = dashboardData.map(data => data.name)
    const goodArr = dashboardData.map(data => data.issues.Good)
    const medArr = dashboardData.map(data => data.issues.Medium)
    const hignArr = dashboardData.map(data => data.issues.High)
    setName(nameArr)
    setGood(goodArr)
    setMedium(medArr)
    setHigh(hignArr)
  }

  const options = {
    scales: {
      xAxes: [{
        stacked: true
      }],
      yAxes: [{
        stacked: true
      }]
    },
    title: {
      display: true,
      text: 'Issues By Service'
    }
  }
  
  const data = {
    labels: name,
    datasets: [
      {
        label: 'Good',
        data: good,
        backgroundColor: 'rgb(36, 188, 116)'
      },
      {
        label: 'Medium',
        data: medium,
        backgroundColor: 'rgb(255, 180, 76)'
      },
      {
        label: 'High',
        data: high,
        backgroundColor: 'rgb(252, 100, 100)'
      },
    ],
  };

  return (
    <>
      <Bar data={data} options={options} />
    </>
  )
}

export default StackedBarChart;

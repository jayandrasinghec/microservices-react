import React, { useEffect, useState } from 'react';
// import { QueryRenderer } from '@cubejs-client/react';
import { Bar } from 'react-chartjs-2';
import { CircularProgress } from '@material-ui/core';
import { callApi, getTenant } from '../../../../utils/api';

const COLORS_SERIES = ['#42E0FC', '#141446', '#7A77FF'];


export default function OEMChart(props) {

  const [newData, setNewdata] = useState([])
  const value = props.refreshInt


  const options = {
      scales: {
          xAxes: [{
              gridLines: {
                  display:false
              },
              stacked: true 
          }],
          yAxes: [{
              gridLines: {
                  display:false
              }   
          }]
      }
  }

  const body = {
    "json": {
        "collection": "user",
        "measures": [
            "status"
        ],
        "sort": {
            "count": -1,
            "status": -1
        }
    }
  }

  const downloadData = () => {
    callApi('/reportingsvc/v1/reports/executeAggregate?page=1', 'POST', body, props.token, true)
    .then(result => {
      const data = {
        labels: result.data && result.data.map(d => d.status),
        // datasets: result.data && result.data.map((d,k) => {
        //   return {
        //     label: d.status,
        //     data: [d.count],
        //     backgroundColor: COLORS_SERIES[k],
        //     fill: false
        //   }
        // })
        datasets: [{
          label: 'Users',
          data: result.data && result.data.map(d => d.count),
          backgroundColor: COLORS_SERIES
        }]
      }
      data !== newData && setNewdata(data)
    })
  }

  useEffect(() => {
    downloadData()
    const interval = setInterval(() => {
      downloadData()
    }, value * 1000)

    return () => clearInterval(interval)
  }, [])

  if(newData.length === 0) {
    return <div className='text-center'><CircularProgress /></div>
  }
  return <Bar data={newData} options={options} />;
}
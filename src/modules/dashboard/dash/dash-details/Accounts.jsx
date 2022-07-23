import React, { useEffect, useState } from 'react';
import { QueryRenderer } from '@cubejs-client/react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { CircularProgress } from '@material-ui/core';
import { callApi } from '../../../../utils/api';

const COLORS_SERIES = ['#141446', '#7A77FF','#42E0FC'];

export default function Accounts(props) {

  const [newData, setNewdata] = useState([])
  const value = props.refreshInt

  const options = {
    scales: {
        xAxes: [{
            gridLines: {
                display:false
            },
            // stacked: true 
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
        "collection": "audit_log",
        "time_dimensions": [
            {
                "dimension": "created_at",
                "granularity": "date"
            }
        ],
        "filters": {
            "and": [
                {
                    "action": "LOCK_USER"
                }
            ]
        }
    }
  }

  const downloadData = () => {
    callApi('/reportingsvc/v1/reports/executeAggregate?page=1&items=4', 'POST', body, props.token, true)
      .then(result => {
        // console.log("Accounts locked", result.data)
        const data = {
          labels: result.data && result.data.map(d => d.created_at),
          datasets : [{
            label: 'Accounts Locked',
            data: result.data && result.data.map(d => d.count),
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
          }]
        }
        setNewdata(data)
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
  return <Line data={newData} options={options} />;
}

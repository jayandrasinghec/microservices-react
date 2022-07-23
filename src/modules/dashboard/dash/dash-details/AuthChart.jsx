import React, { useEffect, useState } from 'react';
import { QueryRenderer } from '@cubejs-client/react';
import { Doughnut } from 'react-chartjs-2';
import { CircularProgress } from '@material-ui/core';
import { callApi } from '../../../../utils/api';

// const COLORS_SERIES = ['#00af54','#FF1B1C'];
const COLORS_SERIES = ['#4C6085','#43E0FA'];

export default function Accounts(props) {

  const [newData, setNewdata] = useState([])
  const value = props.refreshInt

  const options = {}

  const body = {
      "json": {
          "collection": "audit_log",
          "measures": [
              "result"
          ],
          "filters": {
              "and": [
                  {
                      "action": "LOGIN"
                  }
              ]
          }
      }
  }

  const downloadData = () => {
    callApi('/reportingsvc/v1/reports/executeAggregate', 'POST', body, props.token, true)
    .then(result => {
      // console.log("AUTH", result.data)
      const data = {
        labels: result.data && result.data.map(d => d.result),
        datasets : [{
          data: result.data && result.data.map(d => d.count),
          backgroundColor: COLORS_SERIES,
          // borderColor: COLORS_SERIES,
          // hoverBorderColor: COLORS_SERIES
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
  return <Doughnut data={newData} options={options} />;
}

import React from 'react'
import { makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

import './styles.css'
const useStyles = makeStyles({
  table: {
    minWidth: 200,
  },
});


function createData(name: string, message: string, date: string, time: string) {
  return { name, message, date, time };
}

const rows = [
  createData('G.James', 'Requested Slack', '08/17/2021', '11:59'),
  createData('R.Julia', 'Disabled by B.Terry', '08/17/2021', '19:44'),
  createData('W.Anna', 'Requested Photoshop', '08/18/2021', '12:59'),
  createData('Z.Anna', 'Requested Zeplin', '08/18/2021', '15:44'),

];
export default function NotificationCard() {
  const classes = useStyles();
  return (
    <div className="row" style={{ backgroundColor: "#F0F7FF" }}>
      <div className="col notification_card">
        <div className="row tittle">Notifications</div>
        {rows.map((row) => (<div className="row content">
          <div className="col-2 pl-0" >
            <span className="name">{row.name}</span>

          </div>
          <div className="col-6 text-left">
            <span className="message">{row.message}</span>
          </div>
          <div className="col-4 px-0">
            <span className="date">{row.date}</span> <span className="time">{row.time}</span>
          </div>

        </div>
        ))}

      </div>
    </div>
  )
}

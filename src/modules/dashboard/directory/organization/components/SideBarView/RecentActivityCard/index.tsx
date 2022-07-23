import { makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React from 'react'
import './styles.css';
import Paper from '@material-ui/core/Paper';
const useStyles = makeStyles({
  table: {
    minWidth: 200,
  },
});


function createData(Sname: string, Fname: string, status: string, date: string, time: string) {
  return { Sname, Fname, status, date, time };
}

const rows = [
  createData('B.Terry', 'Terry Baker', 'Login', '08/19/2021', '12:54'),
  createData('L.Jessica', 'Jessica Lambert', 'Login', '08/19/2021', '13:12'),
  createData('S.Alex', 'Alex Stanton', 'Login', '08/19/2021', '13:12'),
  createData('R.Julian', 'Julia Roberts', 'Logout', '08/19/2021', '13:13'),

];

export default function RecentActivityCard() {
  return (



    <div className="row" style={{ backgroundColor: "#F0F7FF" }}>
      <div className="col activity_card">
        <div className="row tittle">Recent Activity</div>
        {rows.map((row) => (<div className="row content">
          <div className="col-5 pl-0" >
            <span className="shortName">{row.Sname}</span> <br></br>
            <span className="fullName">{row.Fname}</span>
          </div>
          <div className="col-2 text-center">
            <span className="status">{row.status}</span>
          </div>
          <div className="col-5 text-right">
            <span className="date">{row.date}</span> <span className="time">{row.time}</span>
          </div>

        </div>
        ))}
        <span className="more">See all</span>
      </div>
    </div>

  )
}

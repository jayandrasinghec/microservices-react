import React from 'react'
import { Switch, Route, Redirect } from "react-router-dom"

import Header from './Header'
import Logs from '../administartion/submodules/Logs'


export default function Audit (props) {
  return (
    <div id="dash-dashboard" style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: 15 }}>
        <Header profile={props.profile} />
        <Logs/>
    </div>
  )
}
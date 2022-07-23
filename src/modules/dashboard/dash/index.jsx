import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from "react-router-dom"

import DashDetails from './dash-details/index'
import Header from './Header'
// import AppDetail from './app-details'
// import './style.sass'


export default function DashboardModule (props) {
  const [refreshInt, setRefreshInt] = useState(localStorage.getItem('refreshInt') || '300')

  return (
    <div id="dash-dashboard" style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: 15 }}>
      <Header profile={props.profile} refreshInt={refreshInt} setRefreshInt={setRefreshInt}/>

      <Switch>
        <Route exact={true} path="/dash/dashboard" component={() => <DashDetails refreshInt={refreshInt}/>} />
        {/* <Route path="/dash/applications/:id" component={AppDetail} /> */}
        <Redirect to="/dash/dashboard" />
      </Switch>
    </div>
  )
}
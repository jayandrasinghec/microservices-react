import React from 'react'
import { HashRouter as Router, Switch, Route, Redirect } from "react-router-dom"


import AuthenticationModule from './modules/authentication'
import DashboardModule from './modules/dashboard'
import DisplayXML from './modules/dashboard/application/app-details/DisplayXML.js'

import './styles/main.sass'
import AppModal from './components/AppModal'
import AppAlerts from './components/AppAlerts/index.jsx'
import Notifier from './modules/dashboard/administartion/submodules/MultiFactorAuth/actions/Notifier';

export default function App () {

  let isProd = process.env.NODE_ENV === 'production';

  return (
    <div id="app">
      <Notifier />
      <AppModal />
      <AppAlerts />
      <Router>
        <Switch>
          { !isProd && <Route path="/auth" component={AuthenticationModule} />}
          <Route path="/dash" component={DashboardModule} />
          <Route path="/xml" component={DisplayXML} />
          <Redirect to="/dash" />
        </Switch>
      </Router>
    </div>
  )
}

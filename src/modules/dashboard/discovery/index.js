import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Header from './components/Header';
import {isActiveForRoles} from '../../../utils/auth'
import Insight from './submodules/Insight';
import Overview from './submodules/Overview';
import Environments from './submodules/Environments';
import Scheduler from './submodules/Scheduler';
import Summary from './submodules/Summary';

const useStyles = makeStyles(() => ({
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    width: '100%', 
    padding: 15
  },
}))

export default function Discovery(props) {
  const classes = useStyles()
  return (
    <div id="dash-admin" className={classes.container}>
      <Header profile={props.profile} />
      <Switch>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) &&<Route exact={true} path="/dash/discovery/environment" component={Environments} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) &&<Route exact={true} path="/dash/discovery/scheduler" component={Scheduler} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) &&<Route exact={true} path="/dash/discovery/insight" component={Insight} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) &&<Route exact={true} path="/dash/discovery/overview" component={Overview} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) &&<Route exact={true} path="/dash/discovery/summary" component={Summary} /> }
        <Redirect to="/dash/discovery/environment" />
      </Switch>
    </div>
  )
}

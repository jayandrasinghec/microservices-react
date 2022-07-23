import React from 'react'
import { Switch, Route, Redirect } from "react-router-dom"

import AppList from './app-list/index'
import AppNew from './add-new/index'
import Header from './Header'
import AppDetail from './app-details'
import './style.sass'
import { makeStyles } from '@material-ui/core/styles';
import {isActiveForRoles} from '../../../utils/auth'
import CustomAttributes from './CustomAttributes'
import RadiusServers from './RadiusServers'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex', 
    flexDirection: 'column', 
    width: '100%', 
    padding: 15 
  },
}))


export default function ApplicationModule (props) {
  const classes = useStyles()
  return (
    <div id="dash-application" className={classes.container} >
      <Header profile={props.profile} />

      <Switch>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'APP_ADMIN']) &&<Route exact={true} path="/dash/apps/applications" component={AppList} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'APP_ADMIN']) && <Route exact={true} path="/dash/apps/customAttributes" component={p => <CustomAttributes {...p} />} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'APP_ADMIN']) && <Route exact={true} path="/dash/apps/radius-servers" component={p => <RadiusServers {...p} />} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN', 'APP_ADMIN']) && <Route exact={true} path="/dash/apps/applications/add" component={AppNew} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'APP_ADMIN']) && <Route path="/dash/apps/applications/:id" component={AppDetail} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY']) && <Redirect to="/dash/apps/applications" /> }
      </Switch>
    </div>
  )
}
import React from 'react'
import { Switch, Route, Redirect } from "react-router-dom";

import Header from './components/Header';
import WorkflowConfig from './submodules/WorkflowConfig';
import WorkflowList from './submodules/WorkflowList';
import {isActiveForRoles} from '../../../utils/auth'

export default function AdministrationModule(props) {
  return (
    <div id="dash-admin" style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: 15 }}>
      <Header profile={props.profile} />
      <Switch>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route exact={true} path="/dash/workflow/config" component={WorkflowConfig} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route exact={true} path="/dash/workflow/list" component={WorkflowList} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Redirect to="/dash/workflow/list" /> }
      </Switch>
    </div>
  )
}
import React from 'react'
import { Switch, Route, Redirect } from "react-router-dom"

import Header from './components/Header';
import MultiFactor from './submodules/MultiFactor';
import Masters from './submodules/Masters';
import NotificationTemplate from './submodules/Notification'
import {isActiveForRoles} from '../../../utils/auth'
import HookConfig from './submodules/HookConfig';
import DelegationAccess from './submodules/Delegation';


export default function SettingsModule(props) {
  return (
    <div id="dash-admin" style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: 15 }}>
      <Header profile={props.profile} />
      <Switch>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route path="/dash/settings/mfa" component={MultiFactor} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route path="/dash/settings/masters" component={Masters} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route path="/dash/settings/notification-templates" component={NotificationTemplate} />}
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route path="/dash/settings/delegation" component={DelegationAccess} />}
        {isActiveForRoles(['ORG_ADMIN']) && <Route path="/dash/settings/hook" component={HookConfig} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Redirect to="/dash/settings/masters" /> }
      </Switch>
    </div>
  )
}
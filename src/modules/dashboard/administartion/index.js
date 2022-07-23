import React from 'react'
import { Switch, Route, Redirect } from "react-router-dom";

import Header from './components/Header';
import AdminMFA from './submodules/MultiFactorAuth';
import AdminRules from './submodules/Rules';
import Logs from './submodules/Logs';
import SingleIDP from './submodules/SingleIDP'
import Passwordless from './submodules/Passwordless'
import Deprovision from './submodules/Deprovision'
import ListIDP from './submodules/ListIDP'
import AddIDP from './submodules/AddIDP'
import CommonSectionRulesConfig from './submodules/Rules/CommonSectionRulesConfig';
import AdminAdmins from './submodules/Admins';
import AddNew from './submodules/AddNew';
import AddNewAdmin from './submodules/AddNewAdmin';
import { makeStyles } from '@material-ui/core/styles';
import {isActiveForRoles} from '../../../utils/auth'
import SchedularScreen from './submodules/schedular';
const useStyles = makeStyles(() => ({
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    width: '100%', 
    padding: 15 
  }
}))
function Admin() {
  return(
    <Switch>
      {isActiveForRoles(['ORG_ADMIN', 'READ_ONLY']) && <Route exact={true} path="/dash/admin/admins/list" component={AdminAdmins} /> }
      {isActiveForRoles(['ORG_ADMIN']) && <Route exact={true} path="/dash/admin/admins/add" component={AddNewAdmin} /> }
      {isActiveForRoles(['ORG_ADMIN']) && <Route exact={true} path="/dash/admin/admins/add/:id" component={AddNew} /> }
      {isActiveForRoles(['ORG_ADMIN','READ_ONLY']) && <Redirect to="/dash/admin/admins/list" /> }
    </Switch>  
  )
}

export default function AdministrationModule(props) {
  const classes = useStyles()
  return (
    <div id="dash-admin" className={classes.container}>
      <Header profile={props.profile} />
      <Switch>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN', 'READ_ONLY']) && <Route exact={true} path="/dash/admin/mfa" component={AdminMFA} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN', 'READ_ONLY']) && <Route exact={true} path="/dash/admin/rules" component={AdminRules} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN', 'READ_ONLY']) && <Route exact={true} path="/dash/admin/passwordless" component={Passwordless} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN', 'READ_ONLY']) && <Route exact={true} path="/dash/admin/de-provision" component={Deprovision} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN', 'READ_ONLY']) && <Route exact={true} path="/dash/admin/idp" component={ListIDP} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN', 'READ_ONLY']) &&<Route exact={true} path="/dash/admin/logs" component={Logs} />}
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN', 'READ_ONLY']) && <Route  path="/dash/admin/schedular" component={SchedularScreen} /> }

        {isActiveForRoles(['ORG_ADMIN', 'READ_ONLY']) && <Route path="/dash/admin/admins" component={Admin} /> }
        {isActiveForRoles(['ORG_ADMIN']) && <Route path="/dash/admin/idp/add" component={AddIDP} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route path="/dash/admin/idp/:id" component={SingleIDP} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && <Route path="/dash/admin/rules/:id" component={CommonSectionRulesConfig} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN', 'READ_ONLY']) && <Redirect to="/dash/admin/idp" /> }
        
      </Switch>
    </div>
  )
}
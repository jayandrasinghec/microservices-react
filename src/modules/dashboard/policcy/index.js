import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom';

import Header from './components/Header';
import Password from './submodules/Policy/password';
import Authentication from './submodules/Policy/authentication';
import Attribute from './submodules/Policy/attribute';
import AddAuthPolicy from './submodules/AddPolicy/AuthPolicy'
import AddPasswordPolicy from './submodules/AddPolicy/PasswordPolicy';
import EditPasswordPolicy from './submodules/EditPolicy/password'
import EditAuthPolicy from './submodules/EditPolicy/authentication'
import ComingSoon from '../../../components/ComingSoon'
import { makeStyles } from '@material-ui/core/styles';
import {isActiveForRoles} from '../../../utils/auth'
import AuthenticationRule from './submodules/AuthRule';

const useStyles = makeStyles(() => ({
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    width: '100%', 
    padding: 15
  },
}))

export default function AdministrationModule(props) {
  const classes = useStyles()
  return (
    <div id="dash-admin" className={classes.container}>
      <Header profile={props.profile} />
      <Switch>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) &&<Route exact={true} path="/dash/policy/password" component={Password} /> }
        {/* <Route exact={true} path="/dash/policy/password/add" component={AddPasswordPolicy} /> */}
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) &&<Route exact={true} path="/dash/policy/password/:id" component={EditPasswordPolicy} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) &&<Route exact={true} path="/dash/policy/auth" component={Authentication} /> }
        {isActiveForRoles(['ORG_ADMIN']) &&<Route exact={true} path="/dash/policy/auth/add" component={AddAuthPolicy} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) &&<Route exact={true} path="/dash/policy/auth/:id" component={EditAuthPolicy} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) &&<Route exact={true} path="/dash/policy/auth-rule" component={AuthenticationRule} /> }
        {/* <Route exact={true} path="/dash/policy/attr" component={Attribute} />
        <Route exact={true} path="/dash/policy/attr/add" component={ComingSoon} /> */}
        <Redirect to="/dash/policy/password" />
      </Switch>
    </div>
  )
}

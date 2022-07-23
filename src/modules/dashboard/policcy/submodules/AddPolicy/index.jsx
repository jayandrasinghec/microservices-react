import React from 'react'
import { Switch, Route, Redirect } from "react-router-dom";
import PasswordPolicy from './PasswordPolicy';
import AuthPolicy from './AuthPolicy';


export default function AdministrationModule() {
  return (
    <Switch>
      <Route exact={true} path="/dash/policy/add/password" component={PasswordPolicy} />
      <Route exact={true} path="/dash/policy/add/auth" component={AuthPolicy} />

      <Redirect to="/dash/policy/add/password" />
    </Switch>
  )
}

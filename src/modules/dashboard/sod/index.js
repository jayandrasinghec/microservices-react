import React from 'react'
import { Switch, Route, Redirect } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import Header from './components/Header';
import { Entities } from './submodules/Entities';
import { isActiveForRoles } from '../../../utils/auth';
import ImportSummary from './submodules/Import/ImportSummary/ImportSummary';
import ImportFile from './submodules/Import/Import/ImportFile';
import Import from './submodules/Import/Import/Import';
import Policies from './submodules/Policies';

const useStyles = makeStyles(() => ({
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    width: '100%', 
    padding: 15 
  }
}))

export default function SodModule(props) {
  const classes = useStyles()
  return (
    <div id="dash-admin" className={classes.container}>
      <Header profile={props.profile} />
      <Switch>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN', 'READ_ONLY']) && <Route path="/dash/sod/entities" component={Entities} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN', 'READ_ONLY']) && <Route path="/dash/sod/import" component={Import} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN', 'READ_ONLY']) && <Route path="/dash/sod/policies" component={Policies} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN', 'READ_ONLY']) && <Redirect to="/dash/sod/entities" /> }
      </Switch>
    </div>
  )
}
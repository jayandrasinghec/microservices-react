import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import AppTabView from '../../../../../components/AppTabView';
import { Redirect, Route, Switch } from 'react-router-dom';
import { isActiveForRoles } from '../../../../../utils/auth';
import PoliciesPage from '../Policies/Policies/PoliciesPage';
import Rules from '../Policies/Rules/Rules';

const useStyles = makeStyles(theme => ({
  Nav: {
    display: 'flex',
    padding: '0px !important'
  },
}));

const Policies = () => {
  const classes = useStyles();

  return(
    <div id="dash-admin" style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: 15 }}>
      <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
        <Grid item xs={6} className={classes.Nav}>
          <AppTabView
            links={[
              {
                href: `/dash/sod/policies/policies`,
                name: 'Policies',
                roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
              },
              {
                href: `/dash/sod/policies/rules`,
                name: 'Rules',
                roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
              }
            ]}
          />
        </Grid>
      </Grid>
      <Switch>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route exact path='/dash/sod/policies/policies' component={PoliciesPage} />}
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route exact path='/dash/sod/policies/rules' component={Rules} />}
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Redirect to='/dash/sod/policies/policies'/>}
      </Switch>
    </div>
  );
}

export default Policies;

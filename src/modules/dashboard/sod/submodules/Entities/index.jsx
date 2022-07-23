import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

import AppTabView from '../../../../../components/AppTabView';
import { isActiveForRoles } from '../../../../../utils/auth';
import { Processes } from './Processes';
import { Tasks } from './Tasks';
import { BusinessRoles } from './BusinessRoles';
import { COSO } from './COSO';

const useStyles = makeStyles(theme => ({
  Nav: {
    display: 'flex',
    padding: '0px !important'
  },
}));

export const Entities = (props) => {
  const classes = useStyles();

  return (
    <div id="dash-admin" style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: 15 }}>
      <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
        <Grid item xs={6} className={classes.Nav}>
        <AppTabView
        links={[
            {
              href: `/dash/sod/entities/processes`,
              name: 'Processes',
              roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
            },
            {
              href: `/dash/sod/entities/tasks`,
              name: 'Tasks',
              roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
            },
            {
              href: `/dash/sod/entities/business-roles`,
              name: 'Business Roles',
              roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
            },
            // {
            //   href: `/dash/sod/entities/COSO`,
            //   name: 'COSO',
            //   roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
            // },
          ]}
          />
        </Grid>
      </Grid>
      <Switch>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route exact={true} path="/dash/sod/entities/processes" component={Processes} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route exact={true} path="/dash/sod/entities/tasks" component={Tasks} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route exact={true} path="/dash/sod/entities/business-roles" component={BusinessRoles} /> }
        {/* {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route exact={true} path="/dash/sod/entities/COSO" component={COSO} /> } */}
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Redirect to="/dash/sod/entities/processes" /> }
      </Switch>
    </div>
  )
}

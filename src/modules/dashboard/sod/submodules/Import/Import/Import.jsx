import React from 'react';
import ImportList from './ImportList';
import { Grid, makeStyles } from '@material-ui/core';
import { Switch, Route, Redirect } from 'react-router-dom';
import AppTabView from '../../../../../../components/AppTabView';
import { isActiveForRoles } from '../../../../../../utils/auth';
import ImportFile from './ImportFile';
import ImportSummary from '../ImportSummary/ImportSummary';

const useStyles = makeStyles(theme => ({
  Nav: {
    display: 'flex',
    padding: '0px !important'
  },
}));

const Import = () => {
  const classes = useStyles();

	return(
		<div id="dash-admin" style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: 15 }}>
      <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
        <Grid item xs={6} className={classes.Nav}>
        <AppTabView
        links={[
            {
              href: `/dash/sod/import/${'entities'}`,
              name: 'Entities',
              roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
            },
            {
              href: `/dash/sod/import/${'policies'}`,
              name: 'Policies',
              roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
            }
          ]}
          />
        </Grid>
      </Grid>
      <Switch>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route exact path="/dash/sod/import/:type" component={ImportList} />}
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route exact path="/dash/sod/import/:type" component={ImportList} />}
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route path="/dash/sod/import/:type/file" component={ImportFile} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route path="/dash/sod/import/:type/importSummary" component={ImportSummary} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Redirect to={'/dash/sod/import/entities'} />}
      </Switch>
    </div>
	);
}

export default Import;
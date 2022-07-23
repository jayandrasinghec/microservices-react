import React, {useState, useEffect} from 'react';
import Grid from "@material-ui/core/Grid";
import   './styles.css';

import {isActiveForRoles} from '../../../../../utils/auth';

import Schedularlist from './schedularlist';
import Archivelist from './archivelist';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route, Redirect } from "react-router-dom"

import AppTabView from '../../../../../components/AppTabView';
 interface Props {
   route: any;
   loading:any;
  }
  
const useStyles = makeStyles(() => ({
  Nav: {
    display: 'flex',
    padding: '0px !important'
    // marginTop: '12px'
  },
  icon: {
    marginRight: 5
  },
}))

const SchedularScreen: React.FC<Props> = Props => {
  const {  loading, route } = Props;
    const classes = useStyles()
  return (
    <div id="dash-admin" style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: 15 }}>
      <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
        <Grid item xs={6} className="navStyle">
        <AppTabView
        links={[
            {
              href: `/dash/admin/schedular/schedular_list`,
              name: 'Active / Planned Jobs',
              roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY'],
              
            },  
            {
              href: `/dash/admin/schedular/archives`,
              name: 'Historical',
              roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY'],
               }
          ]}
          />
        </Grid>
      </Grid>
      <Switch>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route exact={true} path="/dash/admin/schedular/schedular_list" component={Schedularlist} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route exact={true} path="/dash/admin/schedular/archives" component={Archivelist} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Redirect to="/dash/admin/schedular/schedular_list" /> }
       </Switch>
    </div>
  )
}

export default SchedularScreen;
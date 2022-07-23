import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route, Redirect } from "react-router-dom"
import { NavLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import GlobalIcon from '@material-ui/icons/Person';
import ZoneICon from '@material-ui/icons/Room';
import AppTabView from '../../../../../components/AppTabView';
import {isActiveForRoles} from '../../../../../utils/auth'

import Global from './Global';
import Zone from './Zone';
import '../../../../../FrontendDesigns/master-screen-settings/assets/css/settings.css';
// import Img1 from '../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/Shapesettings-gobal.png';
// import Img2 from '../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/Shapelocation.svg';

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

export default function SettingsModule() {
  const classes = useStyles()
  return (
    <div id="dash-admin" style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: 15 }}>
      <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
        <Grid item xs={6} className={classes.Nav}>
        <AppTabView
        links={[
            {
              href: `/dash/settings/masters/global`,
              name: 'Global',
              roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY'],
              icon: <GlobalIcon className={classes.icon} />
            },  
            {
              href: `/dash/settings/masters/zone`,
              name: 'Zone',
              roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY'],
              icon: <ZoneICon className={classes.icon} />
            }
          ]}
          />
        </Grid>
      </Grid>
      <Switch>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route exact={true} path="/dash/settings/masters/global" component={Global} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route exact={true} path="/dash/settings/masters/zone" component={Zone} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Redirect to="/dash/settings/masters/global" /> }
      </Switch>
    </div>
  )
}
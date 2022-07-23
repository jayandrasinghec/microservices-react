import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import AppTabView from '../../../../../components/AppTabView';

import ProfileHeader from '../../../../../components/ProfileHeader.jsx'

const useStyles = makeStyles((theme) => ({
  Nav: {
    display: 'flex',
    paddingBottom: '0px !important'
    // marginTop: '12px'
  },
  container: {
    margin: 0,
    width: '100%' 
  }
}))


export default function Header(props) {
  const classes = useStyles()

  return (
    <Grid container spacing={3} className={classes.container}>
      <Grid item xs={9} className={classes.Nav}>
      <AppTabView
          links={[
            {
              href: `/dash/sod/entities`,
              name: 'Entities',
              roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
            },
            {
              href: `/dash/sod/policies`,
              name: 'Policies',
              roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
            },
            {
              href: `/dash/sod/import`,
              name: 'Import',
              roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
            }
          ]}
        />
        
      </Grid>
      <Grid item xs={3} className={classes.Nav}>
        <ProfileHeader profile={props.profile} />
      </Grid>
    </Grid>
  )
}
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import { NavLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import AppTabView from '../../../../../components/AppTabView';

import ProfileHeader from '../../../../../components/ProfileHeader.jsx'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  Nav: {
    display: 'flex',
    paddingBottom: '0px !important'
    // marginTop: '12px'
  },
  activeLink: {
    borderBottom: '3px solid #1F4287',
    marginTop: '12px',
    marginBottom: 10,
    fontWeight: 'bold !important',
    color: '#363795 !important'
  },
  link: {
    marginTop: '12px',
    marginRight: '25px',
    marginLeft: '10px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    color: '#1F4287',
    textDecorationLine: 'none',
    '&:hover': {
      color: '#363795'
    }
  },
  bellicon: {
    marginTop: '0px',
    width: '19px',
    height: '24px'
  },
  small: {
    width: '25px',
    height: '26px',
    // marginTop: '5px',
    marginLeft: '10px'
  },
  search: {
    // marginLeft: '10px',
  },
  name: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    color: '#171717',
    // marginTop: '9px',
  },
  bulk: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    color: '#FFFFFF',
  },
  gridcontainer: { 
    margin: 0, 
    width: '100%' 
  },
}))


export default function Header(props) {
  const classes = useStyles()

  return (
    <Grid container spacing={3} className={classes.gridcontainer}>
      <Grid item xs={9} className={classes.Nav}>
      <AppTabView
        links={[
            {
              href: `/dash/policy/password`,
              name: 'Password Policy',
              roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
            },  
            {
              href: `/dash/policy/auth`,
              name: 'Authentication Policy',
              roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
            },
            {
              href: `/dash/policy/auth-rule`,
              name: 'Authentication Rule',
              roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
            }
          ]}
          /> 

        {/* <NavLink to="/dash/policy/password" activeClassName={classes.activeLink} className={classes.link}>Password Policy</NavLink>
        <NavLink to="/dash/policy/auth" activeClassName={classes.activeLink} className={classes.link}>Authentication Policy</NavLink> */}
      </Grid>
      <Grid item xs={3} className={classes.Nav}>
        <ProfileHeader profile={props.profile} />
      </Grid>
    </Grid>
  )
}
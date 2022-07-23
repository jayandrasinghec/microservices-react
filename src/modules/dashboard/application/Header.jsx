import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { NavLink } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import ProfileHeader from '../../../components/ProfileHeader'
import AppTabView from '../../../components/AppTabView'


const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  Nav: {
    display: 'flex',
    paddingBottom: '0px !important'
    // marginTop: '12px'
  },
  link: {
    marginTop: '12px',
    marginRight: '25px',
    marginLeft: '10px',
    fontStyle: 'normal',
    fontWeight: 'bold !important',
    fontSize: '18px',
    color: '#000000',
    textDecorationLine: 'none',
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


export default function Header (props) {
  const classes = useStyles()

  return (
    <Grid container spacing={3} className={classes.gridcontainer}>
      <Grid item xs={6} className={classes.Nav}>
        {/* <NavLink to="/dash/applications" className={classes.link}>Applications</NavLink> */}
        <AppTabView
          links={[
            {
              roles:['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'APP_ADMIN'],
              href: `/dash/apps/applications`,
              name: 'Applications',
            },
            {
              roles:['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'APP_ADMIN'],
              href: `/dash/apps/customAttributes`,
              name: 'Custom Attributes'
            },
            {
              roles:['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'APP_ADMIN'],
              href: `/dash/apps/radius-servers`,
              name: 'Radius Servers'
            },
          ]}
        />
      </Grid>
      <Grid item xs={6} className={classes.Nav}>
        <ProfileHeader profile={props.profile} />
      </Grid>
    </Grid>
  )
}
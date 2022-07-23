import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import AppTabView from '../../../../../components/AppTabView'
import { isActiveForRoles } from '../../../../../utils/auth'
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
  }
}))


export default function Header(props) {
  const classes = useStyles()

  const [header, setHeader] = React.useState([
    {
      href: `/dash/settings/mfa`,
      name: 'Multi-factor Authentication',
      roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
    },  
    {
      href: `/dash/settings/masters`,
      name: 'Masters',
      roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
    },
    {
      href: `/dash/settings/hook`,
      name: 'Hook Config',
      roles: ['ORG_ADMIN']
    },
    {
      href: `/dash/settings/delegation`,
      name: 'Delegation',
      roles: ['ORG_ADMIN', 'DOMAIN_ADMIN','READ_ONLY']
    }
  ]);
  React.useEffect(() => {
    if(isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN','READ_ONLY'])){
      setHeader([...header,{
        href: `/dash/settings/notification-templates`,
        name: 'Notification Templates'
      }])
    }
  }, [])

  return (
    <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
      <Grid item xs={8} className={classes.Nav}>
      <AppTabView
          links={header}
        />
        
        {/* <NavLink to="/dash/settings/mfa" activeClassName={classes.activeLink} className={classes.link}>Muti-factor Authentication</NavLink>
        <NavLink to="/dash/settings/masters" activeClassName={classes.activeLink} className={classes.link}>Masters</NavLink> */}
      </Grid>
      <Grid item xs={4} className={classes.Nav}>
        <ProfileHeader profile={props.profile} />
      </Grid>
    </Grid>
  )
}
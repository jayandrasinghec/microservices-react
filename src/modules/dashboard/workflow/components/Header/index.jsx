import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import ProfileHeader from '../../../../../components/ProfileHeader'
import AppTabView from '../../../../../components/AppTabView'

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

  return (
    <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
      <Grid item xs={6} className={classes.Nav}>
        <AppTabView
          links={[
            {
              href: "/dash/workflow/list",
              name: 'Workflow List',
              roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
            }, {
              href: "/dash/workflow/config",
              name: 'Workflow Configurations',
              roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
            }
          ]} />
      </Grid>
      <Grid item xs={6} className={classes.Nav}>
        <ProfileHeader profile={props.profile} />
      </Grid>
    </Grid>
  )
}
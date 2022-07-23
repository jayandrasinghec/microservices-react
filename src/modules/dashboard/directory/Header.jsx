import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import ProfileHeader from '../../../components/ProfileHeader'
import AppTabView from '../../../components/AppTabView'


const useStyles = makeStyles(() => ({
  root: {
    margin: 0, width: '100%'
  },
  Nav: {
    display: 'flex',
    paddingBottom: '0px !important'
  }
}))


export default function Header(props) {
  const classes = useStyles()

  return (
    <Grid container spacing={3} className={classes.root}>
      <Grid item xs={6} className={classes.Nav}>
        <AppTabView
          links={[
            {
              roles:['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY', 'HELP_DESK'],
              href: `/dash/directory/user`,
              name: 'Users',
            },
            {
              roles:['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY', 'HELP_DESK'],
              href: `/dash/directory/groups`,
              name: 'Groups'
            },
            {
              roles:['ORG_ADMIN','DOMAIN_ADMIN'],
              href: `/dash/directory/organization`,
              name: 'Organization'
            },
            // {
            //   href: `/dash/directory/orgs`,
            //   name: 'Organisation'
            // }
            {
              roles:['ORG_ADMIN','DOMAIN_ADMIN'],
              href: `/dash/directory/import`,
              name: 'Import'
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
import React from 'react';
import { NavLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  Nav: {
    display: 'flex',
    padding: '0px !important'
  },
  activeLink: {
    borderBottom: '3px solid #1F4287',
    marginTop: 0,
    marginBottom: 10,
    paddingBottom: 4,
    fontWeight: 'bold !important',
    color: '#363795 !important'
  },
  link: {
    marginTop: 0,
    marginRight: '25px',
    marginLeft: '0px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    color: '#1F4287',
    textDecorationLine: 'none',
    '&:hover': {
      color: '#363795'
    }
  },
  container: {
    margin: 0,
    width: '100%'
  }
}))


export default function NestedSections({ruleId, isAdaptive}) {
  const classes = useStyles()

  return (
    <Grid container spacing={3} className={classes.container}>
      <Grid item xs={6} className={classes.Nav}>
        <NavLink to={`/dash/admin/rules/${ruleId}/assignedto`} activeClassName={classes.activeLink} className={classes.link}>Assigned-To</NavLink>
  { !isAdaptive && <NavLink to={`/dash/admin/rules/${ruleId}/conditions`} activeClassName={classes.activeLink} className={classes.link}>Conditions</NavLink> }
        <NavLink to={`/dash/admin/rules/${ruleId}/action`} activeClassName={classes.activeLink} className={classes.link}>Action</NavLink>
      </Grid>
    </Grid>
  )
}
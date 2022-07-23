import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { NavLink } from 'react-router-dom'
import { Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip';
import ProfileHeader from '../../../components/ProfileHeader'


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
    // marginRight: '25px',
    marginLeft: '10px',
    fontStyle: 'normal',
    fontWeight: 'bold !important',
    fontSize: '25px',
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
  }
}))


export default function Header (props) {
  const classes = useStyles()

  return (
    <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
      <Grid item xs={8} className={classes.Nav}>
        {/* <NavLink to="/dash/report" className={classes.link}>{props.title ? props.title : "Reports"}</NavLink> */}
        <Typography className={classes.link} style={{ color: '#363795' }}>{props.title}</Typography>
        { props.title !== "Reports" && <Tooltip title={props.description} placement="top">
            <div className="mt-3 ml-2"><InfoIcon color="primary" /></div>
        </Tooltip> }
      </Grid>
      <Grid item xs={4} className={classes.Nav}>
        <ProfileHeader profile={props.profile} />
      </Grid>
    </Grid>
  )
}
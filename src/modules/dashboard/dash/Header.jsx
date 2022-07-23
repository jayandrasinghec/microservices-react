import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { NavLink } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import ProfileHeader from '../../../components/ProfileHeader'
import AppSelectInput from '../../../components/form/AppSelectInput'


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
  container: {
    margin: 0, 
    width: '100%' 
  },
  refresh: {
    "& .makeStyles-textField-27": {
      backgroundColor: '#E9EDF6 !important',
      "& .makeStyles-input-29": {
        height: '35px !important',
        marginTop: '6px !important',
        // "& .MuiSelect-select:focus": {
        //   backgroundColor: 'none !important'
        // }
      },
      "& .MuiOutlinedInput-root": {
        borderRadius: '15px !important',
        // "&:focus": {
        //   border: '1px solid #363795 !important'
        // }
      }
    }
  }
}))


export default function Header (props) {
  const classes = useStyles()

  return (
    <Grid container spacing={3} className={classes.container}>
      <Grid item xs={8} className={classes.Nav}>
        <NavLink to="/dash/dashboard" className={classes.link}>Dashboard</NavLink>
      </Grid>
      <Grid item xs={4} className={classes.Nav} justifyContent='flex-end'>
        <AppSelectInput
          // label='Refresh interval'
          className={classes.refresh + " ml-5"}
          onChange={(e) => {
            props.setRefreshInt(e.target.value) 
            localStorage.setItem('refreshInt', e.target.value)
          } }
          options={['30', '60', '300']}
          labels={['30 sec', '1 min', '5 min']}
          fullWidth
          // style={{ width: '100%' }}
          value={props.refreshInt}
        />
        <ProfileHeader profile={props.profile} />
      </Grid>
    </Grid>
  )
}

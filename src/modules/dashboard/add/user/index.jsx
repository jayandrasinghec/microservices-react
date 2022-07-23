import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Route } from "react-router-dom"

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import DashboardIcon from '@material-ui/icons/Dashboard'
import PersonIcon from '@material-ui/icons/Person'
import GroupIcon from '@material-ui/icons/GroupAdd'
import StepLabel from '@material-ui/core/StepLabel';
import AddUserInfo from './AddUserInfo'
import AddGroups from './AddGroupsContainer'
import AddThree from './AddApplications'

import './style.css'

const useStyles = makeStyles((theme) => ({
  stepper: {
    maxWidth: 700,
    margin: '0 auto',
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  root: {
    maxWidth: 800,
    width: '100%',
    margin: '0 auto',
    flexGrow: 1,
    // overflow: 'auto'
  },
  Nav: {
    display: 'flex',
    marginTop: '12px'
  },
  link: {
    marginTop: '12px',
    marginLeft: '35px',

    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    color: '#1F4287',
    textDecorationLine: 'none',
    '&:hover': {
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      color: '#363795'
    }
  },
  rightlinks: {
    marginTop: '12px',
  },
  rightlink: {
    marginTop: '5px',
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginTop: '12px',
    marginLeft: '10px',
  },
  heading: {
    textAlign: 'center'
  },
  stepper: {
    backgroundColor: 'transparent'
  },
  steplabel: {
    color: '#363793'
  }
}));


function getSteps() {
  // return ['User Info', 'Add Groups', 'Assign Apps'];
  return [
    {
      name: 'User Info',
      Icon: PersonIcon
    },
    {
      name: 'Add Groups',
      Icon: GroupIcon
    },
    {
      name: 'Assign Apps',
      Icon: DashboardIcon
    }
  ]
}



export default function HorizontalLinearStepper(props) {
  const classes = useStyles();

  const steps = getSteps();
  const activeStep = props.history.location.pathname.indexOf('/groups') >= 0 ? 1 :
    props.history.location.pathname.indexOf('/applications') >= 0 ? 2 : 0


  return (
    <div className={classes.root}>
      <h2 className={classes.heading}>Add New User</h2>

      <div className={classes.stepper}>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {steps.map(label => {
            const stepProps = {};
            const labelProps = {};

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}><label.Icon className={classes.steplabel} /> {label.name}</StepLabel>
              </Step>
            )
          })}
        </Stepper>

        <Route exact={true} path="/dash/directory/add/user" component={AddUserInfo} />
        <Route exact={true} path="/dash/directory/add/user/:id/groups" component={AddGroups} />
        <Route exact={true} path="/dash/directory/add/user/:id/applications" component={AddThree} />
      </div>
    </div>
  )
}

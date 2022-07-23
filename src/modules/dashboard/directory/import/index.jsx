import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Route } from "react-router-dom"

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import DashboardIcon from '@material-ui/icons/Dashboard'
import PersonIcon from '@material-ui/icons/Person'
import GroupIcon from '@material-ui/icons/GroupAdd'
import StepLabel from '@material-ui/core/StepLabel';


// import '../user/style.css'
import UploadFile from './UploadFile';
import ListInfo from './ListInfo';
import { Progress } from './Progress';

const useStyles = makeStyles((theme) => ({
  stepper: {
    maxWidth: '50vw',
    margin: '0 auto',
    width: '100%',
    backgroundColor: 'transparent'
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  root: {
    maxWidth: '77vw',
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
  steplabel: {
    color: '#363793'
  }
}));


function getSteps() {
  return [
    {
      name: 'Upload File',
      Icon: PersonIcon
    },
    {
      name: 'File Info',
      Icon: DashboardIcon
    },
    // {
    //   name: 'File Summary',
    //   Icon: GroupIcon
    // }
  ]
}



export default function ImportUsers(props) {
  const classes = useStyles();
  const [data, setData] = useState([])

  const steps = getSteps();
  const activeStep = props.history.location.pathname.indexOf('/info') >= 0 ? 1 : 0
    // props.history.location.pathname.indexOf('/summary') >= 0 ? 2 : 0

  const handleData = (childData) => {
    setData(childData)
  }

  return (
    <div className={classes.root}>
      <h2 className={classes.heading}>Import Users</h2>

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

      <Route exact={true} path="/dash/directory/import/users" component={p => <UploadFile handleData={handleData} data={data} {...p} />} />
      <Route exact={true} path="/dash/directory/import/users/:id/info" component={p => <ListInfo data={data} {...p} />} />
      <Route exact={true} path="/dash/directory/import/users/:id/status" component={p => <Progress {...p} />} />

    </div>
  )
}

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Link as Linking} from 'react-router-dom'

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Layout from '../layouts/DashboardLayout'
import Grid from '@material-ui/core/Grid'
import NotificationsIcon from '@material-ui/icons/Notifications';
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import IconButton from '@material-ui/core/IconButton';
import AddOne from '../modules/user/add/AddOne'
import AddTwo from '../modules/user/add/AddTwo'
import AddThree from '../modules/user/add/AddThree'


const useStyles = makeStyles((theme) => ({
  stepper: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  root:{
    flexGrow:1
  },
  Nav: {
    display:'flex',
    marginTop:'12px'
  },
  link: {
    marginTop:'12px',
    marginLeft:'35px',

    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    color: '#1F4287',
    '&:hover':{
      fontFamily:'Roboto',
      fontWeight:'bold',
      color:'#363795'
    }
  },
  rightlinks: {
    marginTop:'12px',
    marginLeft:'5px'
  },
  rightlinktwo: {
    marginTop:'5px',
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginTop:'12px',
    marginLeft:'10px',
  },
  linktwo: {
    marginTop:'12px',
    marginLeft:'50px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    color: '#1F4287',

    '&:hover':{
    fontFamily:'Roboto',
    fontWeight:'bold',
    color:'#363795'
    }
  },
  headtwo: {
    textAlign:'center'
  },
  rightlinkone: {
    marginTop:'5px',
    color:'#363793',
  },
  griditemone: {
    display:'flex',
    marginTop:'5px'
  },
  steppertwo: {
    backgroundColor:'transparent'
  },
}));

function getSteps() {
  return ['USER INFO', 'ASSIGN APPS', 'ADD GROUPS'];
}

function getStepContent(step) {
  switch (step) {
  case 0:
    return <AddOne />;
  case 1:
    return <AddTwo />;
  case 2:
    return <AddThree />;
  default:
    return 'Unknown step';
  }
}

export default function HorizontalLinearStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  const isStepOptional = (step) => {
  return step === 1;
  };

  const isStepSkipped = (step) => {
  return skipped.has(step);
  };

  const handleNext = () => {
  let newSkipped = skipped;
  if (isStepSkipped(activeStep)) {
    newSkipped = new Set(newSkipped.values());
    newSkipped.delete(activeStep);
  }

  setActiveStep((prevActiveStep) => prevActiveStep + 1);
  setSkipped(newSkipped);
  };

  const handleBack = () => {
  setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
  if (!isStepOptional(activeStep)) {
    throw new Error("You can't skip a step that isn't optional.");
  }

  setActiveStep((prevActiveStep) => prevActiveStep + 1);
  setSkipped((prevSkipped) => {
    const newSkipped = new Set(prevSkipped.values());
    newSkipped.add(activeStep);
    return newSkipped;
  });
  };

  const handleReset = () => {
  setActiveStep(0);
  };

  return (
    <Layout content={
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={3} className={classes.Nav}>
          <Link active className={classes.link}>User</Link>
          <Link className={classes.linktwo} >Groups</Link>
        </Grid>
        <Grid item xs={6}>
          <h2 className={classes.headtwo}>Add New User</h2>
        </Grid>
        <Grid item xs={3} className={classes.Nav} >
          <Grid item xs={3}></Grid>
          <Grid item xs={2}>
            <IconButton><NotificationsIcon className={classes.rightlinkone}/></IconButton>
          </Grid>
          <Grid item xs={5} className={classes.griditemone}>
            <Avatar alt="Remy Sharp" src="" className={classes.small}/>
            <p className={classes.rightlinks}>Nipul Singal</p>
          </Grid>
          <Grid item xs={1}>
            <IconButton><ArrowDropDownIcon className={classes.rightlinktwo}/></IconButton>
          </Grid>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <div className={classes.stepper}>
            <Stepper activeStep={activeStep} className={classes.steppertwo}>
              {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepOptional(index)) {
                labelProps.optional = <Typography variant="caption"></Typography>;
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
              })}
            </Stepper>
            <div>
              {activeStep === steps.length ? (
              <div>
                <Linking to="user_nav">
                <Button onClick={handleReset} className={classes.button}>
                Back to Users
                </Button>
                </Linking>
              </div>
              ) : (
              <div>
                <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                <div>
                <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                  Discard
                </Button>
            {isStepOptional(activeStep) && (
              <Button
              variant="contained"
              color="primary"
              onClick={handleSkip}
              className={classes.button}
              >
              Skip
              </Button>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              className={classes.button}
            >
              {activeStep === steps.length - 1 ? 'Save' : activeStep === steps.length - 2 ? 'Proceed' : 'Next'}
            </Button>
            </div>
          </div>
          )}
        </div>
      </div>
      </Grid>
      <Grid item xs={2}></Grid>
    </Grid>
    </div>
  } />
  );
}

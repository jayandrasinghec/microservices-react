import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CustomInputLabel from '../../../../../components/HOC/CustomInputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import EventIcon from '@material-ui/icons/Event';
import GreyBtn from '../../../../../components/HOC/GreyBtn';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { Route } from "react-router-dom"
import AddCampaignInfo from './NewCampaign/NewCampaign'
import AddScope from './NewCampaign/NewScope'
import AddStage from './NewCampaign/NewStageTest'
import Stage from './../../components/Stage'

const useStyles = makeStyles((theme) => ({
  cusStepper: {
    backgroundColor: 'transparent',
    '& .MuiStepLabel-label': {
      color: '#1f4287',
      fontWeight: 400,
    },
    '& .Mui-disabled .MuiSvgIcon-root': {
      fill: '#808080',
      border: '4px solid #808080',
      background: '#808080',
    },
    '& .MuiSvgIcon-root': {
      fill: '#fff',
      border: '4px solid #1f4287',
      borderRadius: 20,
      background: '#fff',
    },
    '& .MuiStepConnector-alternativeLabel': {
      left: 'calc(-50% + 12px)',
      right: 'calc(50% + 12px)',
    }
  },
  stepperContent: {
    padding: theme.spacing(4),
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  txtFieldGutter: {
    marginBottom: theme.spacing(3),
  },
  calendarIcon: {
    color: '#989898'
  },
  gutterZero: {
    paddingTop: '0px !important',
    paddingBottom: '0px !important',
  },
  btnDefault: {
    color: '#989898'
  },
  reviewValue: {
    marginTop: theme.spacing(2),
  },
  custRadioWrapper: {

    border: '1px solid #ccc',
    borderRadius: 8,
    margin: '8px 0px',

  }
}));

function getSteps() {
  return ['Campaign Details', 'Scope', 'Stages'];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return 'Select campaign settings...';
    case 1:
      return 'What is an ad group anyways?';
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Unknown stepIndex';
  }
}

export default function CreateCampaign(props) {
  const classes = useStyles();
  const steps = getSteps();
  const activeStep = props.history.location.pathname.indexOf('/scope') >= 0 ? 1 :
    props.history.location.pathname.indexOf('/stage') >= 0 ? 2 : 0


  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item xs={12}>
        <Stepper activeStep={activeStep} alternativeLabel className={classes.cusStepper}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel icon={<FiberManualRecordIcon />}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {/* <Route exact={true} path="/dash/governance/campaign/create" component={AddCampaignInfo} /> */}
        <Route exact={true} path="/dash/governance/campaign/create" component={p => <AddCampaignInfo {...p} type="create" />} />
        <Route exact={true} path="/dash/governance/campaign/create/:id/scope" component={AddScope} />
        <Route exact={true} path="/dash/governance/campaign/create/:id/stage" component={p => <AddStage {...p} type="create" />}/>
{/* <Route exact={true} path="/dash/governance/campaign/create/:id/stage/:stage" component={Stage} /> */}
      </Grid>
    </Grid>
  );
}

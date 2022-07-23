import React, { useEffect } from 'react';
import { Route } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import AddCampaignInfo from './NewCampaign/NewCampaign';
import AddScope from './NewCampaign/NewScope';
import AddStage from './NewCampaign/NewStageTest';
import { GetCampaignDetails, ClearCampaignDetails, GetCampaignStage, ClearCampaignStage, GetCampaignScope, clearCampaignScope } from '../../actions/CampaignActions';


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

export default function EditCampaign(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const campaign = useSelector((state) => state.campaignReducer.campaignDetails);
  const campaignScope = useSelector((state) => state.campaignReducer.campaignScope);
  const campaignStage = useSelector((state) => state.campaignReducer.campaignStage);
  const steps = getSteps();
  const id = props.match.params.id
  const activeStep = props.history.location.pathname.indexOf('/scope') >= 0 ? 1 :
    props.history.location.pathname.indexOf('/stage') >= 0 ? 2 : 0

  // Commented as needed to call api's when respective forms are loaded.
  // useEffect(() => {
  //   dispatch(GetCampaignDetails(id))
  //   dispatch(GetCampaignScope(id))
  //   dispatch(GetCampaignStage(id))
  //   return () => {
  //     dispatch(ClearCampaignDetails())
  //     dispatch(ClearCampaignStage())
  //     dispatch(clearCampaignScope())
  //   }
  // }, [])

  useEffect(() => {
    activeStep === 0 && dispatch(GetCampaignDetails(id))
    return () => {
      dispatch(ClearCampaignDetails())
    }
  }, [activeStep === 0])

  useEffect(() => {
    activeStep === 1 && dispatch(GetCampaignScope(id))
    return () => {
      dispatch(clearCampaignScope())
    }
  }, [activeStep === 1])

  useEffect(() => {
    activeStep === 2 && dispatch(GetCampaignStage(id))
    return () => {
      dispatch(ClearCampaignStage())
    }
  }, [activeStep === 2])


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
        <Route exact={true} path="/dash/governance/campaign/edit/:id" component={p => <AddCampaignInfo {...p} type='edit' campaign={campaign} id={id} />} />
        <Route exact={true} path="/dash/governance/campaign/edit/:id/scope" component={p => <AddScope {...p} type="edit" campaignScope={campaignScope} id={id} />} />
        <Route exact={true} path="/dash/governance/campaign/edit/:id/stage" component={p => <AddStage {...p} type="edit" campaignStage={campaignStage} id={id} />} />
      </Grid>
    </Grid>
  );
}

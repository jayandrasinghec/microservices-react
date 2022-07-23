import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Switch, Route, Redirect, useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { PostCampaignStage, PutCampaignStage, GetCampaignStage, ClearCampaignStage } from '../../../actions/CampaignActions';
import * as _ from 'underscore'
import clsx from 'clsx'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CustomInputLabel from '../../../../../../components/HOC/CustomInputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import EventIcon from '@material-ui/icons/Event';
import GreyBtn from '../../../../../../components/HOC/GreyBtn';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Link from '@material-ui/core/Link'
import Collapse from '@material-ui/core/Collapse';
import AppBar from '@material-ui/core/AppBar';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Stage from '../../../components/Stage'


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
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
  link: {
    paddingBottom: 5,
    marginTop: '10px',
    marginLeft: '30px',
    fontSize: 14,
    transition: 'all 0.1s ease',
    //fontWeight: 'bold !important',
    color: '#1F4287',
    textDecorationLine: 'none',
    '&:hover': {
      fontWeight: 'bold',
      color: '#363795',
      borderBottom: '3px solid #1F4287',
    },
    '&:active': {
      fontWeight: 'bold !important',
      borderBottom: '3px solid #363795 !important',
      color: '#363795',
    },
    cursor: 'pointer'
  },
  activeLink: {
    fontWeight: 'bold !important',
    borderBottom: '3px solid #1F4287',
    color: '#1F4287',
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

const defaultData = {
  stages: {
    "1":{
      "name":"",
      "description":"",
      "duration":"",
      "notifyBeforeDeadline":"",
      "notifyOnlyWhenNoDecision":false,
      "userId":"",
      "reportingManager":false
   }
  }
}


export default function CreateCampaign(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const campaignStage = props.campaignStage
  const id = props.match.params.id
  const editCampaignStages = campaignStage ? _.size(campaignStage) : null
  const [stage, setStage] = React.useState(editCampaignStages || 1)
  const [newData, setNewData] = React.useState(campaignStage || {})
  const currentStage = props.match.params.currentStage
  const type = props.type
  

  // const sentData = {
  //   stages: {
  //   }
  // }

  const handleChange = function handleChange (e) {
    setStage(e.target.value)
    let obj = {
      1: {}
    }

    if(e.target.value === 2){
      obj[2] = {}
    }else if(e.target.value === 3){
      obj[2] = {}
      obj[3] = {}
    }

    setNewData(obj)
  }
  
  // console.log(sentData)

  const handleNext = function handleNext(data) {
    if(type === 'edit'){
      const editData = data
      delete editData.userName
      dispatch(PutCampaignStage(editData, id, currentStage, history))
      return
    }else{

      newData[currentStage] = data

      if(currentStage < stage) {
        const nextStage = parseInt(currentStage) + 1;
        props.history.push(`/dash/governance/campaign/create/123/stage/${nextStage}`)
      }else{
        let sentData = {}
        sentData.stages = newData
        dispatch(PostCampaignStage(sentData, id, history)) 
    }
    // console.log(newData)
    }
  };
  const handleNextStage = function handleNext() {
    const nextStage = parseInt(currentStage) + 1
    props.history.push(`/dash/governance/campaign/edit/${id}/stage/${nextStage}`)
  };

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item xs={10}>
        <Paper className={classes.stepperContent}>
          <Grid container spacing={4}>
            {currentStage == 1 ? (
              <Grid item xs={6} >
              <CustomInputLabel>Select Total Stages</CustomInputLabel>
              <FormControl variant="outlined" className={classes.formControl} margin="dense" fullWidth>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  ariant="outlined"
                  fullWidth
                  value={stage}
                  onChange={handleChange}
                  // onChange={e => setStage(e.target.value)}
                >
                  <MenuItem value={1}>One</MenuItem>
                  <MenuItem value={2}>Two</MenuItem>
                  <MenuItem value={3}>Three</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            ) : (<></>)}
            <Grid item xs={12}>
              <Switch>
                <Route exact={true} path={`/dash/governance/campaign/create/${id}/stage/1`} component={p => <Stage {...p} data={newData} setNewData={setNewData} stages={stage} id={id} currentStage={1} handleNext={handleNext} />} />
                <Route exact={true} path={`/dash/governance/campaign/create/${id}/stage/2`} component={p => <Stage {...p} data={newData} setNewData={setNewData} stages={stage} id={id} currentStage={2} handleNext={handleNext} />} />
                <Route exact={true} path={`/dash/governance/campaign/create/${id}/stage/3`} component={p => <Stage {...p} data={newData} setNewData={setNewData} stages={stage} id={id} currentStage={3} handleNext={handleNext} />} />

                <Route exact={true} path={`/dash/governance/campaign/edit/${id}/stage/1`} component={p => <Stage {...p} data={newData[1] || {}} type="edit" stages={stage} id={id} currentStage={1} handleNext={handleNext} handleNextStage={handleNextStage} />} />
                <Route exact={true} path={`/dash/governance/campaign/edit/${id}/stage/2`} component={p => <Stage {...p} data={newData[2] || {}} type="edit" stages={stage} id={id} currentStage={2} handleNext={handleNext} handleNextStage={handleNextStage}/>} />
                <Route exact={true} path={`/dash/governance/campaign/edit/${id}/stage/3`} component={p => <Stage {...p} data={newData[3] || {}} type="edit" stages={stage} id={id} currentStage={3} handleNext={handleNext} handleNextStage={handleNextStage}/>} />
              </Switch>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

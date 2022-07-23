import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import GreyBtn from '../../../../../../components/HOC/GreyBtn';
// import FormControl from '@material-ui/core/FormControl';
// import Checkbox from '@material-ui/core/Checkbox';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem'
import InfoIcon from '@material-ui/icons/Info';
import parser from 'cron-parser'

import AppTextInput from '../../../../../../components/form/AppTextInput';
import { callApi } from '../../../../../../utils/api';
import CustomInputLabel from '../../../../../../components/HOC/CustomInputLabel';
import AppActiveUsersInput from '../../../../../../components/form/AppActiveUsersInput';
import CronExpressionHelperText from './CronExpressionHelperText';
import { PostCampaignDetails, PutCampaignDetails } from '../../../actions/CampaignActions';
import { isActiveForRoles } from '../../../../../../utils/auth';

const cron = require('cron-validator')

const useStyles = makeStyles((theme) => ({
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

const defaultData = {
  "completionPeriod": "",
  "description": "",
  // "frequency": "",
  "name": "",
  "notificationWaitingPeriod": "",
  // "repeatOccurance": false,
  "startDate": null,
  "cronExpression": null,
  "manager": null
}


export default function CreateCampaign(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const id = props.id;
  const campaign = props.campaign 
  
  const [campaignDetails, setCampaignDetails] = React.useState(campaign || defaultData)
  const [saving, setSaving] = React.useState(false)
  const [showHelp, setShowHelp] = React.useState(false)
  const [errors, _setErrors] = React.useState({})
  const [dateOrExp, setDateOrExp] = React.useState(campaignDetails.cronExpression ? "cronExp" : "startDate");
  const [cronParsed, setCronParsed] = React.useState(null)
  const [changed, setChanged] = React.useState(false);

  const change = e => {
    setChanged(true)
    setCampaignDetails({ ...campaignDetails, ...e })
  }
  const setError = e => _setErrors({ ...errors, ...e })

  const isValid = !Object.values(errors).some(e => e != null) && campaignDetails.name && campaignDetails.notificationWaitingPeriod && campaignDetails.completionPeriod && campaignDetails.manager && (campaignDetails.startDate || campaignDetails.cronExpression)

  const handleNext = function handleNext() {
    // setSaving(true)
    checkNotifyPeriod()
    id ? dispatch(PutCampaignDetails(campaignDetails, id, history, setSaving, setChanged)) : dispatch(PostCampaignDetails(campaignDetails, history, setSaving)) 
  };
  const handleNextUrl = function handleNext() {
    props.history.push(`/dash/governance/campaign/edit/${id}/scope`)
  };
  const handleBack = function handleBack() {
    props.history.push(`/dash/governance/campaign`)
  };
  const handleDiscard = function handleDiscard() {
    setCampaignDetails(defaultData)
  };

  const checkPeriod = () => {
    if ((campaignDetails.completionPeriod || '').length === 0) {
      setError({completionPeriod: 'Field is required'})
    } else if(campaignDetails.completionPeriod == 0) {
      setError({completionPeriod: 'Completion Period should be greater than 0 days'})
    } else if(campaignDetails.completionPeriod > 364) {
      setError({completionPeriod: 'Completion Period should be less than 365 days'})
    } else {
      setError({completionPeriod: null})
    }
  }
  const checkNotifyPeriod = () => {
    if ((campaignDetails.notificationWaitingPeriod || '').length === 0) {
      setError({notificationWaitingPeriod: 'Field is required'})
    } else if(parseInt(campaignDetails.notificationWaitingPeriod) >= parseInt(campaignDetails.completionPeriod)) {
      setError({notificationWaitingPeriod: 'Notification Waiting Period should be less than Completion Period'})
    } else {
      setError({notificationWaitingPeriod: null})
    }
  }
  const checkName = () => {
    if ((campaignDetails.name || '').length === 0) {
      setError({name: 'Name is required'})
    } else {
      setError({name: null})
    }
  }
  const checkDate = () => {
    if ((campaignDetails.startDate || '').length === 0) {
      setError({startDate: 'Start Date is required'})
    } else {
      setError({startDate: null})
    }
  }
  const checkFrequency = () => {
    if ((campaignDetails.frequency || '').length === 0) {
      setError({frequency: 'Frequency is required'})
    } else {
      setError({frequency: null})
    }
  }

  const radioChange = e => {
    let obj = campaignDetails;
    obj.startDate && delete obj.startDate
    obj.cronExpression && delete obj.cronExpression
    setDateOrExp(e.target.value)
    setCampaignDetails(obj)
  }

  const checkCron = (e) => {
    setCronParsed(null)
    if(campaignDetails.cronExpression){
      if(e.target.value){
        let interval = parser.parseExpression(e.target.value)
        let reqdata = {
          "expression": e.target.value,
          "startAfter": interval.next()
        }
        
          callApi('/igschedular/execution/next-n','post',reqdata)
          .then((res)=>{
              if(res.success){
                setCronParsed(interval.next().toString())
                setError({cronExpression: null})
              }
            }).catch(err=>{
              if(err.errorCode === "SCHEDULER.INVALID_CRON_EXPRESSION"){
                setError({cronExpression: 'Cron Expression is invalid'})
              }
            })
          }
            // if(!cron.isValidCron(e.target.value, { seconds: true, alias: true, allowBlankDay: true })){
            //   setError({cronExpression: 'Cron Expression is invalid'})
            // } else{
            //   let interval = parser.parseExpression(e.target.value)
            //   setCronParsed(interval.next().toString())
            //   setError({cronExpression: null})
            // }
    } else {
      setError({cronExpression: null})
    }
  }

  const startDateIsGreater = (date) => {
    const inputDate = new Date(date);
    const currentDate = new Date();

    return inputDate.setHours(0,0,0,0) >= currentDate.setHours(0,0,0,0)
  }

  const checkStartDate = () => {
    if ((campaignDetails.startDate || '').length === 0) {
      setError({startDate: 'Start Date is required'})
    } else if(!startDateIsGreater(campaignDetails && campaignDetails.startDate)){
      setError({startDate: 'Start Date should not be less than today.'})
    }  else {
      setError({startDate: null})
    }
  }

  const handleCronHelper = () => {
    // setShowHelp(!showHelp);
    setShowHelp(true);
    const cronHelperEl = document.getElementById("cron-helper")
    cronHelperEl && cronHelperEl.scrollIntoView({behavior: 'smooth'})
    setTimeout(() => {
      // window.scrollBy(0,300)
      window.scrollBy({top: 300, behavior: 'smooth'})
      }, 500);
  }

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item xs={10}>
        <Paper className={classes.stepperContent}>
          <Grid container spacing={4}>
            <Grid item xs={6} >
              <CustomInputLabel>Name<span className="text-danger ml-1">*</span></CustomInputLabel>
              <TextField 
                required
                value={campaignDetails.name}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                onChange={e => change({ name: e.target.value })}
                error={!!errors.name} onBlur={checkName} helperText={errors.name}
                id="outlined-basic"
                variant="outlined" 
                margin="dense" 
                fullWidth
              />
            </Grid>
            <Grid item xs={6} >
              {/* <CustomInputLabel>Starts on<span className="text-danger ml-1">*</span></CustomInputLabel>
              <TextField type="date" id="outlined-basic" variant="outlined" margin="dense" fullWidth className={classes.txtFieldGutter} value={campaignDetails.startDate} onChange={e => change({ startDate: e.target.value })} /> */}
              <CustomInputLabel>
                Certification completion period (in days)
                <span className="text-danger ml-1">*</span>
              </CustomInputLabel>
              <TextField 
                id="outlined-basic" 
                type="number" 
                autoComplete="off" 
                variant="outlined" 
                margin="dense" 
                fullWidth 
                value={campaignDetails.completionPeriod} 
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                onChange={e => change({ completionPeriod: e.target.value })} 
                error={!!errors.completionPeriod} 
                onBlur={checkPeriod} 
                helperText={errors.completionPeriod} 
              />
            </Grid>
            {/* <Grid item xs={6}>
              <CustomInputLabel>Starts on<span className="text-danger ml-1">*</span></CustomInputLabel>
                <TextField type="date" id="outlined-basic" variant="outlined" margin="dense" fullWidth className={classes.txtFieldGutter} value={campaignDetails.startDate} onChange={e => change({ startDate: e.target.value })} error={!!errors.startDate} onBlur={checkDate} helperText={errors.startDate} /> */}
              {/* <CustomInputLabel></CustomInputLabel>
              <RadioGroup row>
                <FormControlLabel
                  value="top"
                  control={<Radio color="primary" />}
                  label="Start Now"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="start"
                  control={<Radio color="primary" />}
                  label="Start Later"
                  labelPlacement="end"
                />
              </RadioGroup> */}
            {/* </Grid> */}
            <Grid item xs={6} >
              <CustomInputLabel>Description</CustomInputLabel>
              <TextField
                value={campaignDetails.description}
                onChange={e => change({ description: e.target.value })}
                id="outlined-multiline-static"
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                multiline
                rows={6}
                variant="outlined"
                fullWidth
                margin='dense'
              />
            </Grid>
            <Grid item xs={6} >
              {/* <CustomInputLabel>Starts on<span className="text-danger ml-1">*</span></CustomInputLabel>
              <TextField type="date" id="outlined-basic" variant="outlined" margin="dense" fullWidth className={classes.txtFieldGutter} value={campaignDetails.startDate} onChange={e => change({ startDate: e.target.value })} /> */}
              {/* <CustomInputLabel>Integer for notification<span className="text-danger ml-1">*</span></CustomInputLabel> */}
              <RadioGroup 
                row 
                aria-label="position" 
                name="position" 
                value={dateOrExp}
                onChange={radioChange}
              >
                <FormControlLabel 
                  value="startDate" 
                  control={<Radio color="primary" />} 
                  label="Start Date" 
                />
                <FormControlLabel 
                  value="cronExp" 
                  control={<Radio color="primary" />} 
                  label="Cron Expression" 
                />
                {dateOrExp === 'cronExp' &&
                  <FormControlLabel 
                    control={
                      <span 
                        title="Cron Expression Help" 
                        onClick={handleCronHelper}
                      >
                        <InfoIcon color="primary" />
                      </span>
                    }
                  />
                }
              </RadioGroup>
              {dateOrExp === 'startDate' && props.type === 'edit' &&
                <Grid item xs={12}>
                  <TextField 
                    type="date" 
                    id="outlined-basic" 
                    variant="outlined" 
                    margin="dense" 
                    fullWidth 
                    className={classes.txtFieldGutter} 
                    value={campaignDetails.startDate} 
                    disabled={!isActiveForRoles(['ORG_ADMIN'])}
                    onChange={e => change({ startDate: e.target.value })} 
                  />
                </Grid>              
              }
              {dateOrExp === 'startDate' && props.type === 'create' &&
                <Grid item xs={12}>
                  <TextField 
                    type="date" 
                    id="outlined-basic" 
                    variant="outlined" 
                    margin="dense" 
                    fullWidth 
                    className={classes.txtFieldGutter} 
                    value={campaignDetails.startDate} 
                    disabled={!isActiveForRoles(['ORG_ADMIN'])}
                    onChange={e => change({ startDate: e.target.value })} 
                    error={!!errors.startDate}
                    onBlur={checkStartDate}
                    helperText={errors.startDate}
                  />
                </Grid>              
              }
              {dateOrExp === 'cronExp' &&
                <Grid item xs={12}>
                  {/* <TextField 
                    // type="date" 
                    id="outlined-basic" 
                    variant="outlined" 
                    margin="dense" 
                    autoComplete="off"
                    fullWidth 
                    className={classes.txtFieldGutter} 
                    value={campaignDetails.cronExpression} 
                    onChange={e => change({ cronExpression: e.target.value })} 
                  /> */}
                  <AppTextInput 
                    value={campaignDetails.cronExpression}
                    disabled={!isActiveForRoles(['ORG_ADMIN'])}
                    onChange={e => change({ cronExpression: e.target.value })}
                    error={!!errors.cronExpression}
                    onBlur={e => checkCron(e)}
                    helperText={cronParsed ? cronParsed : errors.cronExpression}
                  />
                </Grid>
              }
            </Grid>
            <Grid item xs={6} >
              {/* <CustomInputLabel>Starts on<span className="text-danger ml-1">*</span></CustomInputLabel>
              <TextField type="date" id="outlined-basic" variant="outlined" margin="dense" fullWidth className={classes.txtFieldGutter} value={campaignDetails.startDate} onChange={e => change({ startDate: e.target.value })} /> */}
              <CustomInputLabel>
                Notify before
                <span className="text-danger ml-1">*</span>
              </CustomInputLabel>
              <TextField 
                id="outlined-basic" 
                type="number" 
                variant="outlined" 
                margin="dense" 
                fullWidth 
                autoComplete="off"
                value={campaignDetails.notificationWaitingPeriod} 
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                onChange={e => change({ notificationWaitingPeriod: e.target.value })} 
                error={!!errors.notificationWaitingPeriod}
                onBlur={checkNotifyPeriod} 
                helperText={errors.notificationWaitingPeriod} 
              />
            </Grid>
            {/* <Grid item xs={6} className={classes.gutterZero}>
              <FormControlLabel
                value="end"
                control={<Checkbox checked={campaignDetails.repeatOccurance} onChange={e => change({ repeatOccurance: e.target.checked })} color="primary" />}
                label="Repeat Occurence"
                required
                labelPlacement="end"
              />
            </Grid> */}
            {/* <Grid item xs={6} >
              <CustomInputLabel>Frequency in days</CustomInputLabel>
              <TextField id="outlined-basic" variant="outlined" margin="dense" fullWidth />
            </Grid> */}
            {/* <Grid item xs={6} >
              <CustomInputLabel>Frequency<span className="text-danger ml-1">*</span></CustomInputLabel>
              <FormControl variant="outlined" className={classes.formControl} margin="dense" fullWidth>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  ariant="outlined"
                  fullWidth
                  value={campaignDetails.frequency}
                  onChange={e => change({ frequency: e.target.value })}
                  error={!!errors.frequency} onBlur={checkFrequency} helperText={errors.frequency}
                >
                  <MenuItem value="WEEKLY">Weekly</MenuItem>
                  <MenuItem value="MONTHLY">Monthly</MenuItem>
                  <MenuItem value="QUARTERLY">Quaterly</MenuItem>
                  <MenuItem value="HALF_YEARLY">Half Yearly</MenuItem>
                  <MenuItem value="ANUALLY">Anually</MenuItem>

                </Select>
              </FormControl>
            </Grid> */}
            <Grid item xs={6} >
              <CustomInputLabel>
                Campaign Manager
                <span className="text-danger ml-1">*</span>
              </CustomInputLabel>
              <AppActiveUsersInput
                margin="dense"
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                value={campaignDetails.manager ? campaignDetails.manager : null}
                onGroupId={e => change({ manager: e })}
              />
            </Grid>

            <Grid item xs={12} id="cron-helper">
              {showHelp && (
                <CronExpressionHelperText />
              )}
            </Grid>
            
            {/* <Grid item xs={6} >
            </Grid> */}
            <Grid item xs={6} >
              <GreyBtn onClick={handleBack}>Back</GreyBtn>
              <GreyBtn onClick={handleDiscard}>Discard</GreyBtn>
            </Grid>
            
            <Grid item xs={6} container justify="flex-end">
            {props.type === 'edit' ? (
              <Button
                onClick={handleNextUrl}
                color="primary"
                variant="contained"
                disableElevation
                style={{ marginRight: 5 }}
                size="small">
                Next
              </Button>
            ) : (<></>)}
              <Button
                onClick={handleNext}
                color="primary"
                // disabled={!campaignDetails.name || !campaignDetails.notificationWaitingPeriod || !campaignDetails.completionPeriod || !campaignDetails.manager  || saving || (!campaignDetails.startDate && !campaignDetails.cronExpression) || errors.startDate}
                disabled={!isActiveForRoles(['ORG_ADMIN']) || !isValid || saving || !changed}
                variant="contained"
                disableElevation
                size="small">
                {props.type === 'edit' ? 'Update' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

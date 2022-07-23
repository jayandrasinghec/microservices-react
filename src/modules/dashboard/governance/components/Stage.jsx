import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { PostCampaignStage } from '../actions/CampaignActions';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CustomInputLabel from '../../../../components/HOC/CustomInputLabel';
import AppUserInput from '../../../../components/form/AppUserInput';
import AppGroupInput from '../../../../components/form/AppGroupInput';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import EventIcon from '@material-ui/icons/Event';
import GreyBtn from '../../../../components/HOC/GreyBtn';
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
import Button from '@material-ui/core/Button';
import AppActiveUsersInput from '../../../../components/form/AppActiveUsersInput';
import { isActiveForRoles } from '../../../../utils/auth';

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


export default function Stage(props) {
  const classes = useStyles();
  const history = useHistory()
  const [newData, setNewData] = React.useState(props.data || {})
  const [value, setValue] = React.useState(newData.userId !== "" ? 'user' : 'reportingManager')
  const val = props.value
  const [errors, _setErrors] = React.useState({})
  const [saving, setSaving] = React.useState(false)
  const [changed, setChanged] = React.useState(false);
  // const saving = React.useState(props.saving)
  const id = props.id
// console.log('newData', newData)
  // newData={
  //   1:{},
  //   2:{}
  // }
  // console.log(value)
  const handleNext = function handleNext() {
    setSaving(true)
    // if(!newData.notifyOnlyWhenNoDecision) newData.notifyOnlyWhenNoDecision = false
    props.handleNext(newData, props.currentStage)
  };
  const handlePrevUrl = function handleNext() {
    history.push(`/dash/governance/campaign/edit/${id}/scope`)
  };

  const change = e => {
    setNewData({ ...newData, ...e })
    setChanged(true)
  }
  const setError = e => _setErrors({ ...errors, ...e })

  // const isValid = !Object.values(errors).some(e => e != null) && newData.name && newData.duration && newData.notifyBeforeDeadline
  // && (newData.userId || newData.reportingManager)
  const isValid = !Object.values(errors).some(e => e != null) && newData.name && (newData.userId || newData.reportingManager)

  const checkName = () => {
    if ((newData.name || '').length === 0) {
      setError({name: 'Name is required'})
    } else if(!newData.name.match(/^(?! )[A-Za-z0-9 ]*(?<! )$/)) {
      setError({name: 'Please enter valid name'})
    } else if((newData.name || '').length > 30) {
      setError({name: 'Max 30 characters are allowed'})
    } else {
      setError({name: null})
    }
  }
  // const checkDuartion = () => {
  //   if ((newData.duration || '').length === 0) {
  //     setError({duration: 'Duration is required'})
  //   } else if(!newData.duration.match(/^[0-9._]*$/)) {
  //     setError({duration: 'Please enter valid duration'})
  //   }else {
  //     setError({duration: null})
  //   }
  // }
  // const checkNotify = () => {
  //   if ((newData.notifyBeforeDeadline || '').length === 0) {
  //     setError({notifyBeforeDeadline: 'Field is required'})
  //   } else if(!newData.notifyBeforeDeadline.match(/^[0-9._]*$/)) {
  //     setError({notifyBeforeDeadline: 'Please enter valid value (numeric)'})
  //   } else if(newData.notifyBeforeDeadline == 0) {
  //     setError({notifyBeforeDeadline: 'Value should be greater than 0'})
  //   }
  //   else {
  //     setError({notifyBeforeDeadline: null})
  //   }
  // }

  return (
    <div 
      role="tabpanel"
      hidden={val !== props.index}
      id={`wrapped-tabpanel-${props.index}`}
      aria-labelledby={`wrapped-tab-${props.index}`}
      >
      { val === props.index && (
      <Grid container spacing={4}>
        {/* <Grid item xs={12} >
          <h5>Stage {props.currentStage}</h5>
        </Grid> */}
        <Grid item xs={6} >
          <CustomInputLabel>Name <span style={{ color: 'red', fontSize: 14 }}>*</span></CustomInputLabel>
          <TextField 
            required 
            variant="outlined" 
            margin="dense" 
            fullWidth 
            value={newData.name} 
            disabled={!isActiveForRoles(['ORG_ADMIN'])}
            onChange={e => change({ name: e.target.value })} 
            error={!!errors.name} 
            onBlur={checkName} 
            helperText={errors.name} 
          />
        </Grid>
        <Grid item xs={6}>
        </Grid>
        <Grid item xs={6} >
          <CustomInputLabel>Description</CustomInputLabel>
          <TextField
            id="outlined-multiline-static"
            // label="Multiline"
            multiline
            rows={5}
            value={newData.description} 
            disabled={!isActiveForRoles(['ORG_ADMIN'])}
            onChange={e => change({ description: e.target.value })}
            variant="outlined"
            fullWidth
            margin='dense'
          />
        </Grid>
        {/* <Grid item xs={6} >
          <CustomInputLabel>Duration <span style={{ color: 'red', fontSize: 14 }}>*</span></CustomInputLabel>
          <TextField required variant="outlined" margin="dense" fullWidth className={classes.txtFieldGutter} value={newData.duration} onChange={e => change({ duration: e.target.value })} error={!!errors.duration} onBlur={checkDuartion} helperText={errors.duration} />
          <CustomInputLabel>Notify before deadline <span style={{ color: 'red', fontSize: 14 }}>*</span></CustomInputLabel>
          <TextField variant="outlined" margin="dense" fullWidth value={newData.notifyBeforeDeadline} onChange={e => change({ notifyBeforeDeadline: e.target.value })} error={!!errors.notifyBeforeDeadline} onBlur={checkNotify} helperText={errors.notifyBeforeDeadline} />
        </Grid>
        <Grid item xs={12} className={classes.gutterZero}>
          <FormControlLabel
            value="end"
            control={<Checkbox checked={newData.notifyOnlyWhenNoDecision} onChange={e => change({ notifyOnlyWhenNoDecision: e.target.checked })} color="primary" />}
            label="Notify only when no decision"
            labelPlacement="end"
          />
        </Grid> */}
        <Grid item xs={6}>
          <CustomInputLabel>Level one approver</CustomInputLabel>
          <RadioGroup 
            row
            aria-label="position"
            name="position"
            value={value}
            disabled={!isActiveForRoles(['ORG_ADMIN'])}
            onChange={(event) => {
              if(event.target.value === 'user'){
                newData.reportingManager = false
              }else{
                newData.userId = ""
                newData.reportingManager = true
              }
              setValue(event.target.value)
              setChanged(true)
            }}
          >
            <FormControlLabel
              value="user"
              control={<Radio color="primary" />}
              label="User"
              labelPlacement="end"
            />
            {/* <FormControlLabel
              value="group"
              control={<Radio color="primary" />}
              label="Group"
              labelPlacement="end"
            /> */}
            <FormControlLabel
              value="reportingManger"
              control={<Radio checked={newData.reportingManager} color="primary" />}
              // control={<Radio value={newData.reportingManager} onChange={e => change({reportingManager : e.target.value})} color="primary" />}
              label="Reporting Manager"
              labelPlacement="end"
            />
          </RadioGroup>

          {/* <FormControlLabel
            control={<Radio value={newData.reportingManager} onChange={e => change({reportingManager : e.target.value})} color="primary" />}
            label="Reporting Manager"
            labelPlacement="end"
          /> */}
          {value == 'user' ? (
            <div style={{marginTop: '10px'}}>
            <CustomInputLabel>Users<span style={{ color: 'red', fontSize: 14 }}>*</span></CustomInputLabel>
            <AppActiveUsersInput
              resource={newData.userId}
              value={newData.userId ? newData.userId : null}
              disabled={!isActiveForRoles(['ORG_ADMIN'])}
              onGroupId={e => change({ userId: e })} 
            />
            </div>
          ) : (
            // <AppGroupInput
            //   resource={newData.groupId}
            //   value={newData.groupId ? newData.groupId : null}
            //   onGroupId={e => change({ groupId: e })} />
            <></>
          )}
        </Grid>
        {/* <Grid item xs={6}>
        </Grid> */}
        {/* <Grid item xs={6} >
          <CustomInputLabel>Default reviewer reference</CustomInputLabel>
          <TextField variant="outlined" margin="dense" fullWidth />
        </Grid>
        <Grid item xs={6}>
          <CustomInputLabel>Stop review on</CustomInputLabel>
          <Typography className={classes.reviewValue}> default </Typography>
        </Grid> */}

        <Grid item xs={6}>
          {props.type === 'edit' ? (
            <GreyBtn onClick={handlePrevUrl}>Previous</GreyBtn>
          ) : (<></>)}
          <GreyBtn on>Discard</GreyBtn>
        </Grid>

          <Grid item xs={6} container justify="flex-end">
            <Button 
              disabled={!isActiveForRoles(['ORG_ADMIN']) || !isValid || saving || !changed} 
              onClick={handleNext} 
              color="primary" 
              variant="contained" 
              disableElevation 
              size="small"
            >
              {props.currentStage < props.stages ? 'Next' : 'Submit'}
            </Button>        
          </Grid>
      </Grid>
      )}
    </div>
  );
}

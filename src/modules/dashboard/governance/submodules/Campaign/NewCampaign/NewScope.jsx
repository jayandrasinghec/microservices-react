import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import GreyBtn from '../../../../../../components/HOC/GreyBtn';
import AppMultiUserInput from '../../../../../../components/form/AppMultiUserInput';
import { PostCampaignScope } from '../../../actions/CampaignActions';
import CustomInputLabel from '../../../../../../components/HOC/CustomInputLabel';
import { isActiveForRoles } from '../../../../../../utils/auth';


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
  "allUsers": true,
  "applications": null,
  "excludeUsers": [],
  "groups": null,
  "userTypes": null,
  "users": null
}


export default function CreateCampaign(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const id = props.match.params.id
  const campaignScope = props.campaignScope;

  const [newData, setNewData] = React.useState(campaignScope || defaultData)
  const [value, setValue] = React.useState(campaignScope && (campaignScope.groups) ? 'groups' : campaignScope && (campaignScope.applications) ? 'applications' : campaignScope && (campaignScope.userTypes) ? 'userTypes' : 'users')
  const [saving, setSaving] = React.useState(false)
  const [changed, setChanged] = React.useState(false);

  // const [value, setValue] = React.useState('users')

  const handleNext = () => {
    let obj = newData
    if (!obj.allUsers && obj[value] && value !== 'userTypes') obj[value] = obj[value].map(element => element.id)
    obj['excludeUsers'] = obj['excludeUsers'] ? obj['excludeUsers'].map(o => o.id) : null
    dispatch(PostCampaignScope(obj, id, history, props.type, setSaving, setChanged))
  };
  const handleNextUrl = function handleNext() {
    props.history.push(`/dash/governance/campaign/edit/${id}/stage`)
  };
  const handlePrevUrl = function handleNext() {
    props.history.push(`/dash/governance/campaign/edit/${id}`)
  };

  // const handleBack = function handleBack() {
  //   props.history.push(`/dash/governance/campaign/create`)
  // };

  // const isValid = newData.allUsers === true ? true : ((newData.users || newData.groups || newData.applications || newData.userTypes) && (newData.users !== Array(0) || newData.groups != Array(0) || newData.applications != Array(0) || newData.userTypes != Array(0)))
  const isValid = newData.allUsers || (newData.groups && newData.groups.length > 0) || (newData.users && newData.users.length > 0) || (newData.applications && newData.applications.length > 0) || (newData.userTypes && newData.userTypes.length > 0)

  const radioChange = e => {
    let obj = {}
    obj['allUsers'] = e.target.value === 'allusers'
    obj['excludeUsers'] = newData.excludeUsers
    setNewData(obj)
    setChanged(true)
  }


  // useEffect(() => {
  //   dispatch(GetCampaignScope(id))

  //   return () => {
  //       dispatch(clearCampaignScope())
  //   }
  // }, [])
    
  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item xs={10}>
        <Paper className={classes.stepperContent}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <CustomInputLabel>Who does this rule apply to</CustomInputLabel>
          <RadioGroup
            value={newData.allUsers ? 'allusers' : 'notAll'}
            // onChange={e =>  ? change({ allUsers: true }) : change({ allUsers: false })}
            onChange={radioChange}
          >
            <FormControlLabel
              value={'allusers'}
              control={<Radio color="primary" />}
              label="All Users"
              labelPlacement="end"
              className={classes.custRadioWrapper}
            />
            <FormControlLabel
              value={'notAll'}
              control={<Radio color="primary" />}
              label="To specific organization's Groups, Users, User Type & applications"
              labelPlacement="end"
              className={classes.custRadioWrapper}
            />
          </RadioGroup>
        </Grid>
        {newData.allUsers ? <></> : 
        <>
        <Grid item xs={12}>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="position"
            name="position"
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              let obj = {}
              obj.allUsers = newData.allUsers
              obj.excludeUsers = newData.excludeUsers
              obj[event.target.value] = []
              setNewData(obj)
              setChanged(true)
            }}
          >
            <FormControlLabel
              value="users"
              control={
                <Radio color="primary" classes={{ root: classes.radio }} />
              }
              label="Users"
              className={classes.formlabel}
            />
            <FormControlLabel
              value="groups"
              control={
                <Radio color="primary" classes={{ root: classes.radio }} />
              }
              label="Groups"
              className={classes.formlabel}
            />
            <FormControlLabel
              value="applications"
              control={
                <Radio color="primary" classes={{ root: classes.radio }} />
              }
              label="Applications"
              className={classes.formlabel}
            />
            <FormControlLabel
              value="userTypes"
              control={
                <Radio color="primary" classes={{ root: classes.radio }} />
              }
              label="User Types"
              className={classes.formlabel}
            />
          </RadioGroup>
        </FormControl>
        </Grid>
        {/* <Grid item xs={12}>
          <CustomInputLabel>Applications</CustomInputLabel>
          <TextField id="outlined-basic" variant="outlined" margin="dense" fullWidth />
        </Grid>

        <Grid item xs={12}>
          <CustomInputLabel>Groups</CustomInputLabel>
          <TextField id="outlined-basic" variant="outlined" margin="dense" fullWidth />
        </Grid> */}

        <Grid item xs={12}>
          <CustomInputLabel>{value === 'users' ? 'Users' : value === 'groups' ? 'Groups' : value === 'applications' ? 'Applications' : 'User Types'}</CustomInputLabel>
          {/* <TextField id="outlined-basic" variant="outlined" margin="dense" fullWidth /> */}
          {value === 'users' ? 
            <AppMultiUserInput
              type='users'
              resource={newData.users}
              value={newData.users ? newData.users : []}
              disabled={!isActiveForRoles(['ORG_ADMIN'])}
              v={value}
              onGroupId={e => {
                setNewData({ ...newData, users: e })
                setChanged(true)
              }}
            />
            : value === 'groups' ? 
            <AppMultiUserInput
              type='groups'
              resource={newData.groups}
              value={newData.groups ? newData.groups : []}
              disabled={!isActiveForRoles(['ORG_ADMIN'])}
              v={value}
              onGroupId={e => {
                setNewData({ ...newData, groups: e })
                setChanged(true)
              }} 
            />
            : value === 'applications' ?
            <AppMultiUserInput
              type='applications'
              resource={newData.applications}
              value={newData.applications ? newData.applications : []}
              disabled={!isActiveForRoles(['ORG_ADMIN'])}
              v={value}
              onGroupId={e => {
                setNewData({ ...newData, applications: e })
                setChanged(true)
              }} 
            />
            :
            <AppMultiUserInput
              type='userType'
              resource={newData.userTypes}
              value={newData.userTypes ? newData.userTypes : []}
              disabled={!isActiveForRoles(['ORG_ADMIN'])}
              v={value}
              onGroupId={e => {
                setNewData({ ...newData, userTypes: e })
                setChanged(true)
              }}
            />
          }        
        </Grid>

        {/* <Grid item xs={12}>
          <CustomInputLabel>Exclusion User</CustomInputLabel>
          <AppMultiUserInput
            type='users'
            resource={newData.excludeUsers}
            value={newData.excludeUsers ? newData.excludeUsers : null}
            onGroupId={e => setNewData({ ...newData, excludeUsers: e })} />
        </Grid> */}
        </>
        }
        <Grid item xs={12}>
          <CustomInputLabel>Exclusion User</CustomInputLabel>
          <AppMultiUserInput
            type='users'
            resource='excludeUser'
            value={newData.excludeUsers ? newData.excludeUsers : []}
            disabled={!isActiveForRoles(['ORG_ADMIN'])}
            onGroupId={e => {
              setNewData({ ...newData, excludeUsers: e })
              setChanged(true)
            }} 
          />
        </Grid>
        <Grid item xs={6}>
          {props.type === 'edit' ? (
            <GreyBtn onClick={handlePrevUrl}>Previous</GreyBtn>
          ) : (<></>)}
          {/* <GreyBtn onClick={handleBack}>Previous</GreyBtn> */}
          <GreyBtn>Discard</GreyBtn>
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
            disabled={!isActiveForRoles(['ORG_ADMIN']) || !isValid || saving || !changed}
            onClick={() => handleNext()} 
            color="primary" 
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

import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CustomInputLabel from '../../../../../components/HOC/CustomInputLabel';
import AppMultiUserInput from '../../../../../components/form/AppMultiUserInput';
import GreyBtn from '../../../../../components/HOC/GreyBtn';
import { PostRuleAssignedToAction } from './actions/administrationRuleActions';
import { isActiveForRoles } from '../../../../../utils/auth';

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


// const defaultData = {
//   // "id": props.ruleId,
//   // "id": ruleData.id,
//   "forEveryOne": true,
//   "attachedGroupIDs": [],
//   "attachedUserIDs": [],
//   "excludedUserIDs": []
// }

export default function AssignedTo(props) {
  const {ruleData, ruleId} = props;
  // const {ruleData} = useSelector(state => state.adminRuleReducer.ruleDetailsById || {});

  const usersArr = ruleData && ruleData.attachedUserIDs && ruleData.attachedUserIDs.map((item) => {
    item.displayName = item.name
    return item
  })

  const exUsersArr = ruleData && ruleData.excludedUserIDs && ruleData.excludedUserIDs.map((item) => {
    item.displayName = item.name
    return item
  })

  const newRuleData = {
    // "id": ruleData ? ruleData.id : '',
    "id": ruleId ? ruleId : '',
    "forEveryOne": ruleData ? ruleData['forEveryOne'] : true,
    "attachedGroupIDs": ruleData ? ruleData['attachedGroupIDs'] : [],
    "attachedUserIDs": usersArr && usersArr.length > 0 ? usersArr : [],
    "excludedUserIDs": exUsersArr ? exUsersArr : []
  }
  const classes = useStyles();
  // const [newData, setNewData] = React.useState(newRuleData || defaultData)
  const [newData, setNewData] = React.useState(newRuleData)
  const [saving, setSaving] = React.useState(true)
  const dispatch = useDispatch();

  const radioChange = e => {
    let obj = {}
    obj['forEveryOne'] = e.target.value === 'allusers'
    // if(e.target.value === 'allusers'){
      obj['attachedGroupIDs'] = []
      obj['attachedUserIDs'] = []
    // }
    obj['excludedUserIDs'] = newData.excludedUserIDs
    obj['id'] = newData.id
    setNewData(obj)
    setSaving(false)
  }

  const handleSubmit = () => {
    let postData = {...newData};
    // if(!newData.forEveryOne) {
      postData.id = ruleData.id
      postData.attachedGroupIDs = postData.attachedGroupIDs.map((ele) => ele.id)
      postData.attachedUserIDs = postData.attachedUserIDs.map((ele) => ele.id)
      postData.excludedUserIDs = postData.excludedUserIDs.map((ele) => ele.id)
    // }
    dispatch(PostRuleAssignedToAction(postData, ruleData.id))
    setSaving(true)
  }
    
  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item xs={12}>
        <Paper className={classes.stepperContent}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <CustomInputLabel>Who does this rule apply to</CustomInputLabel>
              <RadioGroup
                value={newData.forEveryOne ? 'allusers' : 'notAll'}
                // onChange={e =>  ? change({ allUsers: true }) : change({ allUsers: false })}
                onChange={radioChange}
              >
                <FormControlLabel
                  value={'allusers'}
                  disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                  control={<Radio color="primary" />}
                  label="All Users"
                  labelPlacement="end"
                  className={classes.custRadioWrapper}
                />
                <FormControlLabel
                  value={'notAll'}
                  disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                  control={<Radio color="primary" />}
                  label="To specific organization groups, and users applications"
                  labelPlacement="end"
                  className={classes.custRadioWrapper}
                />
              </RadioGroup>
            </Grid>
            {
              newData.allUsers ? <></> : 
              <>
                <Grid item xs={12}>
                  <CustomInputLabel>Groups</CustomInputLabel>
                  <AppMultiUserInput
                    type='groups'
                    disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || newData.forEveryOne === true ? true : false}
                    resource={newData.attachedGroupIDs}
                    value={newData.attachedGroupIDs ? newData.attachedGroupIDs : []}
                    // v={value}
                    onGroupId={e => {
                      setNewData({ ...newData, attachedGroupIDs: e })
                      setSaving(false)
                    }} 
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomInputLabel>Users</CustomInputLabel>
                  <AppMultiUserInput
                    type='users'
                    disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || newData.forEveryOne === true ? true : false}
                    resource={newData.attachedUserIDs}
                    value={newData.attachedUserIDs ? newData.attachedUserIDs : []}
                    // v={value}
                    onGroupId={e => {
                      setNewData({ ...newData, attachedUserIDs: e })
                      setSaving(false)
                    }} 
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomInputLabel>Exclusion</CustomInputLabel>
                  <CustomInputLabel>Users</CustomInputLabel>
                  <AppMultiUserInput
                    type='users'
                    disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                    resource={newData.excludedUserIDs}
                    value={newData.excludedUserIDs ? newData.excludedUserIDs : []}
                    // v={value}
                    onGroupId={e => {
                      setNewData({ ...newData, excludedUserIDs: e })
                      setSaving(false)
                    }} 
                  />
                </Grid>
              </>
            }
            <Grid container spacing={2}>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <GreyBtn>Discard</GreyBtn>
              </Grid>
              <Grid 
                item xs={6} 
                sm={6} 
                md={6} 
                lg={6} 
                container 
                direction="row" 
                justify="flex-end"
              >
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSubmit} 
                  size="small" 
                  disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || saving} 
                  disableElevation
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
      </Paper>
      </Grid>
    </Grid>
  );
}

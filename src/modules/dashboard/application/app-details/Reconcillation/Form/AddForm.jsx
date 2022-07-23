/* eslint-disable react/display-name */
import React from 'react';
import { Link as Linking } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import AppTextInput from '../../../../../../components/form/AppTextInput';
import AppSelectInput from '../../../../../../components/form/AppSelectInput';
import AppMasterInput from '../../../../../../components/form/AppMasterInput';
import AppUserInput from '../../../../../../components/form/AppUserInput';
import AppGroupInput from '../../../../../../components/form/AppGroupInput';
import AppCheckbox from '../../../../../../components/form/AppCheckbox';
import { makeStyles } from '@material-ui/core/styles';
import {isActiveForRoles} from '../../../../../../utils/auth'
import { callApi } from '../../../../../../utils/api'
import { showWarning } from '../../../../../../utils/notifications'

import validator from 'validator'
import parser from 'cron-parser'
import { CircularProgress } from '@material-ui/core';
const cron = require('cron-validator')

const useStyles = makeStyles(() => ({
  container: {
    
  },
  divone: {
    marginRight: 20,
    marginLeft: 10,
    borderRadius: '10px',
    flex: 1,
    overflowY: 'auto'
  },
  paperone: {
    padding: 25,
    marginBottom: 20,
    marginTop: 20,
    border: 'none',
    boxShadow: 'none'
  },
  papertwo: {
    padding: 25,
    marginBottom: 20,
    marginTop: 20,
    border: 'none',
    boxShadow: 'none'
  },
  flexdiv: {
    display: 'flex'
  },
  button: {
    float: 'right',
    borderRadius: '8px',
    marginRight: 20
  },
}))

const options = {
  status: [
    {type: 'ACTIVE'},
    {type: 'INACTIVE'},
    // {type: 'DELETE'},
  ],
  type: [
    {type: 'USER'},
    // {type: 'GROUP'},
    // {type: 'ROLE'}
  ],
  conditions: [
    {type: 'IGNORE'},
    {type: 'UPDATE'},
    {type: 'DEPROVISION'},
    {type: 'UNLINK'},
    {type: 'LINK'},
    {type: 'UNASSIGN'},
    {type: 'ASSIGN'},
    {type: 'PROVISION'},
  ],
}

export default function AddForm(props) {
  const { newMaster, setNewMaster, onSubmit, saving, setTable, runNow, run, action } = props

  const [modes, setModes] = React.useState([])
  const [rules, setRules] = React.useState([])
  const [operations, setOperations] = React.useState([])
  const [syncField, setSyncField] = React.useState([])
  const [sourceAttr, setSourceAttr] = React.useState([])
  const [cronParsed, setCronParsed] = React.useState()
  const [loading, setLoading] = React.useState(true)

  const [errors, _setErrors] = React.useState({})
  const classes = useStyles()
  const change = e => setNewMaster({ ...newMaster, ...e })
  const setError = e => _setErrors({ ...errors, ...e })

  const toggle = (s) => {
    let obj = newMaster.idmSearchQueryFilter
    let statuses = obj.status || []

    const newStatus1 = [...statuses, s]
    const newStatus2 = statuses.filter(s2 => s2 !== s)

    
    if (statuses.indexOf(s) >= 0) {
      obj.status = newStatus2
    }
    else{
      obj.status = newStatus1
    }
    change({ idmSearchQueryFilter: obj })
  }

  const downloadData = () => {
    callApi(`/provsrvc/reconOperation/getReconciliationMode`)
      .then(e => {
        if (e.success) {
          setModes(e.data ? e.data : [])
        } else {
          showWarning('Modes not found.')
        } 
      })
    callApi(`/provsrvc/reconOperation/getReconciliationOperations`)
      .then(e => {
        if (e.success) {
          setOperations(e.data ? e.data : [])
        } 
      })
    callApi(`/provsrvc/reconOperation/getReconciliationRules/${props.type}`)
      .then(e => {
        if (e.success) {
          setRules(e.data ? e.data : [])
        } 
      })
    callApi(`/provsrvc/policyAttributeTenant/findAllByAppId/${props.app.id}`)
      .then(e => {
        if (e.success) {
          setSourceAttr(e.data ? e.data : [])
        } 
      })

    // callApi(`/provsrvc/policyAttribute/findAllByAppId/internal`)
    callApi(`/provsrvc/policyAttributeMaster/findAllByAppId/internal`)
      .then(e => {
        if (e.success) {
          setSyncField(e.data ? e.data : [])
          setLoading(false)
        } 
      })
  }
  React.useEffect(() => downloadData(), [])


  const isValid = !Object.values(errors).some(e => e != null) && Object.keys(newMaster.reconConditions).length === rules.length && newMaster.name && newMaster.reconMode && newMaster.idmRepositoryField && newMaster.status && newMaster.sourceAttributeName && newMaster.type && (!newMaster.scheduler.markActive || newMaster.scheduler.markActive && newMaster.scheduler.start && (newMaster.scheduler.cronExpression && newMaster.scheduler.cronExpression.length > 0))

  const checkName = () => {
    if ((newMaster.name || '').length === 0) {
      setError({name: 'Field is required'})
    }  else {
      setError({name: null})
    }
  }

  const checkMode = () => {
    if ((newMaster.reconMode || '').length === 0) {
      setError({reconMode: 'Field is required'})
    }  else {
      setError({reconMode: null})
    }
  }
  const checkSyncField = () => {
    if ((newMaster.idmRepositoryField || '').length === 0) {
      setError({idmRepositoryField: 'Field is required'})
    }  else {
      setError({idmRepositoryField: null})
    }
  }
  const checkStatus = () => {
    if ((newMaster.status || '').length === 0) {
      setError({status: 'Field is required'})
    }  else {
      setError({status: null})
    }
  }
  const checkSource = () => {
    if ((newMaster.sourceAttributeName || '').length === 0) {
      setError({sourceAttributeName: 'Field is required'})
    }  else {
      setError({sourceAttributeName: null})
    }
  }
  const checkType = () => {
    if ((newMaster.type || '').length === 0) {
      setError({type: 'Field is required'})
    }  else {
      setError({type: null})
    }
  }
  const checkReconCondition = (data, label) => {
    if(data === undefined || data === ''){
      setError({[label]: 'Field is required'})
    } else {
      setError({[label]: null})
    }
  }
  const checkEmail = () => {
    if(newMaster.idmSearchQueryFilter.email) {
      if(!validator.isEmail(newMaster.idmSearchQueryFilter.email)) {
        setError({email: 'Please enter valid email address'})
      } else if((newMaster.email || '').length > 50) {
        setError({email: 'Max 50 characters are allowed'})
      } else {
        setError({email: null})
      }
    } else {
      setError({email: null})
    }
  }
  const checkMobile = () => {
    if(newMaster.idmSearchQueryFilter.mobile) {
      if(!validator.isMobilePhone(newMaster.idmSearchQueryFilter.mobile, ['en-IN'])) {
        setError({mobile: 'Mobile Number is invalid'})
      } else {
        setError({mobile: null})
      }
    } else {
      setError({mobile: null})
    }
  }
  const checkCron = (cronExpr) => {
    if(cronExpr){
      let interval = parser.parseExpression(cronExpr)
      let reqdata = {
        "expression": cronExpr,
        "startAfter": interval.next()
      }
      
        callApi('/igschedular/execution/next-n','post',reqdata)
        .then((res)=>{
            if(res.success){
              let options = {
                currentDate: newMaster.scheduler.start,
              };
              let interval = parser.parseExpression(cronExpr, options)
              setCronParsed(interval.next().toString())
              setError({cronExpression: null})
            }
          }).catch(err=>{
            if(err.errorCode === "SCHEDULER.INVALID_CRON_EXPRESSION"){
              setError({cronExpression: 'Cron Expression is invalid'})
            }
          })
        }
}
  const changeFeq = (e) => {
    setCronParsed(null)
    if(!newMaster.scheduler.cronExpression || !newMaster.scheduler.cronExpression.length) {
      setError({cronExpression: 'Field is requried'})
    }else if(newMaster.scheduler.cronExpression){
      checkCron(e.target.value)
      // if(!cron.isValidCron(e.target.value, { seconds: true, alias: true, allowBlankDay: true })){
      //   setError({cronExpression: 'Cron Expression is invalid'})
      // } else{
      //   let options = {
      //     currentDate: newMaster.scheduler.start,
      //   };
      //   // let interval = parser.parseExpression(e.target.value)
      //   let interval = parser.parseExpression(e.target.value, options)
      //   setCronParsed(interval.next().toString())
      //   setError({cronExpression: null})
      // }
    } else {
      setError({cronExpression: null})
    }
  }

  const changeStartDate = (e) => {
    if(newMaster.scheduler.markActive) {
      // if(!validator.isAfter(newMaster.scheduler.start)) {
      //   setError({startDate: 'Invalid Date'})
      // }
      if ((newMaster.scheduler.start || '').length === 0) {
        setError({start: 'Field is required'})
      } else if (new Date(newMaster.scheduler.start) < new Date().setHours(0,0,0,0)) {
        setError({start: 'Invalid Start Date.'})
      } else {
        setError({start: null})
        if(newMaster.scheduler.cronExpression && newMaster.scheduler.cronExpression.length) {
          checkCron(newMaster.scheduler.cronExpression)
          // if(!cron.isValidCron(newMaster.scheduler.cronExpression, { seconds: true, alias: true, allowBlankDay: true })){
          //   setError({cronExpression: 'Cron Expression is invalid'})
          // } else{
          //   let options = {
          //     currentDate: newMaster.scheduler.start,
          //   };
          //   // let interval = parser.parseExpression(e.target.value)
          //   let interval = parser.parseExpression(newMaster.scheduler.cronExpression, options)
          //   setCronParsed(interval.next().toString())
          //   setError({cronExpression: null})
          // }
        }
      }
    } else {
      setError({start: null})
    }
  }

  const showValue = {
    TARGET_EXTSTS_IDM_EXISTS: 'User exists in Cymmetri & Target System',
    TARGET_EXTSTS_IDM_NOT_EXISTS: 'User exists in Target System & does not exist in Cymmetri',
    TARGET_DELETED_IDM_EXISTS: 'User does not exist in Target System & exists in Cymmetri',
    IDM_EXTSTS_TARGET_EXISTS: 'User exists in Cymmetri & Target System',
    IDM_EXTSTS_TARGET_NOT_EXISTS: 'User does not exist in Target System & exists in Cymmetri',
    IDM_DELETED_TARGET_EXISTS: 'User exists in Target System & does not exist in Cymmetri'
  }
  
  return (
    <div className={classes.container}>
      <div className={classes.divone}>
        <Paper variant="outlined" elevation={3} className={classes.paperone} >
          {loading ? <Grid container justify="center"><CircularProgress color="inherit" /></Grid> :
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              {props.type === 'PUSH' ? (
                <AppTextInput required label="Name"
                  value={newMaster.name}
                  error={!!errors.name}
                  onBlur={checkName}
                  helperText={errors.name}
                  onChange={e => change({ name: e.target.value })}
                />
              ) : (
                // <AppSelectInput required label="Name"
                //   value={newMaster.name}
                //   error={!!errors.name}
                //   onBlur={checkName}
                //   helperText={errors.name}
                //   onChange={e => change({ name: e.target.value })}
                //   options={modes.map(o => o)}
                // />
                <AppTextInput required label="Name"
                  value={newMaster.name}
                  error={!!errors.name}
                  onBlur={checkName}
                  helperText={errors.name}
                  onChange={e => change({ name: e.target.value })}
                />
              )}
              
            </Grid>
            <Grid item xs={12} md={4}>
              {props.type === 'PUSH' ? (
                <AppTextInput required label="Modes"
                  value={newMaster.reconMode}
                  error={!!errors.reconMode}
                  onBlur={checkMode}
                  helperText={errors.reconMode}
                />
              ) : (
                <AppTextInput required label="Modes"
                  value={newMaster.reconMode}
                  error={!!errors.reconMode}
                  onBlur={checkMode}
                  helperText={errors.reconMode}
                />
                // <AppSelectInput required label="Modes"
                //   value={newMaster.reconMode}
                //   error={!!errors.reconMode}
                //   onBlur={checkMode}
                //   helperText={errors.reconMode}
                //   onChange={e => change({ reconMode: e.target.value })}
                //   options={modes.map(o => o)}
                // />
              )}
              
            </Grid>
            {/* <Grid item xs={12} md={4}>
              <AppTextInput label="Frequency"
                value={newMaster.frequency}
                onChange={e => change({ frequency: e.target.value })}
                error={!!errors.frequency}
                onBlur={e => changeFeq(e)}
                helperText={cronParsed ? cronParsed : errors.frequency}
              />
            </Grid> */}
            <Grid item xs={6} md={4}>
              <AppSelectInput required label="Sync Field"
                placeholder="login"
                value={newMaster.idmRepositoryField}
                error={!!errors.idmRepositoryField}
                onBlur={checkSyncField}
                helperText={errors.idmRepositoryField}
                onChange={e => change({ idmRepositoryField: e.target.value })}
                options={syncField.map(o => o.policy_attr)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppSelectInput required label="Source Attributes"
                value={newMaster.sourceAttributeName}
                placeholder="sAMAccountName"
                error={!!errors.sourceAttributeName}
                onBlur={checkSource}
                helperText={errors.sourceAttributeName}
                onChange={e => change({ sourceAttributeName: e.target.value })}
                options={sourceAttr.map(o => o.policy_attr)}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <AppSelectInput required label="Status"
                value={newMaster.status}
                error={!!errors.status}
                onBlur={checkStatus}
                helperText={errors.status}
                onChange={e => change({ status: e.target.value })}
                options={options.status.map(o => o.type)}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <AppSelectInput required label="Type"
                value={newMaster.type}
                error={!!errors.type}
                onBlur={checkType}
                helperText={errors.type}
                onChange={e => change({ type: e.target.value })}
                options={options.type.map(o => o.type)}
              />
            </Grid>
          </Grid>}
        </Paper>

        <Paper variant="outlined" elevation={3} className={classes.paperone} >
          <Grid container spacing={3}>
            <Grid item xs={10}>
              <div className='mt-2'>
                Scheduler
              </div>
            </Grid>
            <Grid item xs={2}>
              <AppCheckbox label="" 
                value={newMaster.scheduler.markActive}
                switchLabel={newMaster.scheduler.markActive ? 'Active' : 'Inactive'}
                onChange={e => {
                  const obj = newMaster.scheduler
                  if(e) {
                    obj['markActive'] = e
                  }else {
                    obj['markActive'] = e
                    // obj['start'] = null
                    obj['cronExpression'] = null
                    setCronParsed(null)
                    setError({cronExpression: null, start: null})
                  }
                  change({ scheduler: obj })
                }}
              />
            </Grid>
            {
              newMaster.scheduler.markActive && 
              <>
              <Grid item xs={12} md={6}>
                <AppTextInput 
                    required
                    id="datetime-local"
                    label="Start Date"
                    type="datetime-local"
                    // defaultValue="2017-05-24T10:30"
                    value={newMaster.scheduler.start}
                    onChange={e => {
                      const obj = newMaster.scheduler
                      obj['start'] = e.target.value
                      change({ scheduler: obj })
                    }}
                    error={!!errors.start}
                    onBlur={e => changeStartDate(e)}
                    helperText={errors.start}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <AppTextInput label="Cron Expression"
                    required
                    value={newMaster.scheduler.cronExpression}
                    // onChange={e => change({ cronExpression: e.target.value })}
                    onChange={e => {
                      const obj = newMaster.scheduler
                      obj['cronExpression'] = e.target.value
                      change({ scheduler: obj })
                    }}
                    error={!!errors.cronExpression}
                    onBlur={e => changeFeq(e)}
                    helperText={cronParsed ? cronParsed : errors.cronExpression}
                />
              </Grid>
              </>
            }   
          </Grid>
        </Paper>
        
        <Paper variant="outlined" elevation={3} className={classes.paperone} >
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <AppTextInput label="Search Query Filter" placeholder="enter filter criteria"
                value={newMaster.targetSystemSearchQueryFilter}
                onChange={e => change({ targetSystemSearchQueryFilter: e.target.value })}
              />
            </Grid>
          </Grid>
        </Paper>

        {props.type === 'PUSH' ? (<>
        <div>Search & Add Filter Criteria</div>
        <Paper variant="outlined" elevation={3} className={classes.paperone} >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <AppMasterInput label="Department" 
                masterType="department"
                value={newMaster.idmSearchQueryFilter.department}
                onChange={e => {
                  const obj = newMaster.idmSearchQueryFilter
                  obj.department = e.target.value
                  change({ idmSearchQueryFilter: obj })
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppMasterInput label="Designation" 
                masterType="designation"
                value={newMaster.idmSearchQueryFilter.designation}
                onChange={e => {
                  const obj = newMaster.idmSearchQueryFilter
                  obj.designation = e.target.value
                  change({ idmSearchQueryFilter: obj })
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppMasterInput label="User Type" 
                masterType="userType"
                value={newMaster.idmSearchQueryFilter.userType}
                onChange={e => {
                  const obj = newMaster.idmSearchQueryFilter
                  obj.userType = e.target.value
                  change({ idmSearchQueryFilter: obj })
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppMasterInput label="Location" 
                masterType="country"
                value={newMaster.idmSearchQueryFilter.location}
                onChange={e => {
                  const obj = newMaster.idmSearchQueryFilter
                  obj.location = e.target.value
                  change({ idmSearchQueryFilter: obj })
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppUserInput label="Reporting Manager" 
                resource={newMaster.idmSearchQueryFilter.reportingManager}
                value={newMaster.idmSearchQueryFilter.reportingManager ? newMaster.idmSearchQueryFilter.reportingManager : null}
                onGroupId={e => {
                  const obj = newMaster.idmSearchQueryFilter
                  obj.reportingManager = e
                  change({ idmSearchQueryFilter: obj })
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppGroupInput label="Group" 
                resource={newMaster.idmSearchQueryFilter.group}
                value={newMaster.idmSearchQueryFilter.group ? newMaster.idmSearchQueryFilter.group : null}
                onGroupId={e => {
                  const obj = newMaster.idmSearchQueryFilter
                  obj.group = e
                  change({ idmSearchQueryFilter: obj })
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppTextInput label="Email" 
                value={newMaster.idmSearchQueryFilter.email}
                error={!!errors.email}
                onBlur={checkEmail}
                helperText={errors.email}
                onChange={e => {
                  const obj = newMaster.idmSearchQueryFilter
                  obj.email = e.target.value
                  change({ idmSearchQueryFilter: obj })
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppTextInput label="Mobile" 
                value={newMaster.idmSearchQueryFilter.mobile}
                error={!!errors.mobile}
                onBlur={checkMobile}
                helperText={errors.mobile}
                onChange={e => {
                  const obj = newMaster.idmSearchQueryFilter
                  obj.mobile = e.target.value
                  change({ idmSearchQueryFilter: obj })
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppCheckbox label="Account Status" 
                value={newMaster.idmSearchQueryFilter.locked}
                switchLabel={newMaster.idmSearchQueryFilter.locked ? 'Locked' : 'Unlocked'}
                onChange={e => {
                  const obj = newMaster.idmSearchQueryFilter
                  obj.locked = Boolean(e)
                  change({ idmSearchQueryFilter: obj })
                }}
              />
            </Grid>
            <Grid item xs ={12}><div>User Status</div></Grid>
            <Grid item xs={12} md={2}>
              <div className="custom-checkbox">
                <input type="checkbox" name="user" id="fitlerActive" checked={newMaster.idmSearchQueryFilter.status.indexOf('ACTIVE') >= 0} onChange={() => toggle('ACTIVE')} defaultChecked /> <label htmlFor="fitlerActive">Active</label>
              </div>
            </Grid>
            <Grid item xs={12} md={2}>
              <div className="custom-checkbox">
                <input type="checkbox" name="user" id="fitlerInActive" checked={newMaster.idmSearchQueryFilter.status.indexOf('INACTIVE') >= 0} onChange={() => toggle('INACTIVE')} defaultChecked /> <label htmlFor="fitlerInActive">Inactive</label>
              </div>
            </Grid>
          </Grid>
        </Paper>
      
        </>) : (<></>)}

        <div>Conditions</div>

        <Paper variant="outlined" elevation={3} className={classes.paperone} >
          <Grid container spacing={3}>

            {rules.map((rule) => (
              <Grid item xs={12} md={6}>
                <AppSelectInput 
                  label={showValue[rule]}
                  required
                  onBlur={() => checkReconCondition(newMaster.reconConditions[rule], rule)}
                  error={!!errors[rule]}
                  helperText={errors[rule]}
                  value={newMaster.reconConditions[rule]}
                  // onChange={e => change({ TARGET_EXTSTS_IDM_EXISTS: e.target.value })}
                  onChange={e => {
                    const obj = newMaster.reconConditions
                    obj[rule] = e.target.value
                    change({ reconConditions: obj })
                  }}
                  options={operations.map(o => o)}
                />
              </Grid>
            ))}
            
          </Grid>
        </Paper>

        <div className={classes.flexdiv}>
          <Grid item xs={8}>
            {/* <Linking to={props.type === 'PULL' ? `/dash/applications/${props.app.id}/reconciliation/pull` : `/dash/applications/${props.app.id}/reconciliation/push`}>
              <Button>
                Discard
              </Button>
            </Linking> */}
            <Button onClick={() => setTable(true)}>
              Discard
            </Button>
          </Grid>
          {isActiveForRoles(['ORG_ADMIN']) && <Grid item xs={4}>
            <Button disabled={!isValid || saving}
              onClick={onSubmit} variant="contained" className={classes.button}
              color="primary"
            >
              {!saving ? 'Save' : 'Saving'}
            </Button>
            {
              action && action === "Edit" &&
              <Button disabled={run || !isValid}
                onClick={runNow} variant="contained" className={classes.button}
                color="primary"
              >
                {!run ? 'Run Now' : 'Running'}
              </Button>
            }
          </Grid>}
        </div>
        {/* </Grid> */}
      </div>
    </div>
  )
}

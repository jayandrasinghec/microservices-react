import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import { Button, Modal, Paper } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'
import InfoIcon from '@material-ui/icons/Info';
import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver'

import { callApi } from '../../../../../utils/api';
import { showSuccess } from '../../../../../utils/notifications';
import {isActiveForRoles} from '../../../../../utils/auth'
import CardViewWrapper from "../../../../../components/HOC/CardViewWrapper";
import ScrollWrapper from "../../../../../components/HOC/ScrollWrapper";
import AppSelectInput from "../../../../../components/form/AppSelectInput";
import AppTextInput from "../../../../../components/form/AppTextInput";
import AppMultiUserInput from "../../../../../components/form/AppMultiUserInput";
import FullScreen from '../../../../../assets/full-screen-white.svg'
import AppCheckbox from '../../../../../components/form/AppCheckbox';
import ConfirmationModal from './ConfirmationModal';
// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/theme-tomorrow";
// import "ace-builds/src-noconflict/ext-language_tools"

import validator from 'validator'
import parser from 'cron-parser'
import { getISODatetime } from '../../../../../utils/helper';
import CronExpressionHelperText from '../../../governance/submodules/Campaign/NewCampaign/CronExpressionHelperText';

const cron = require('cron-validator')

const useStyles = makeStyles(() => ({
  // toggleTitle: {
  //   padding: '0px 20px 35px 0px'
  // },
  button: {
    float: 'right',
    borderRadius: '8px',
  },
  scriptEditor: {
    position: 'relative'
  },
  expandEditor: {
    position: 'absolute',
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    top: 15,
    right: 20,
    opacity: 0,
    '&:hover': {
      opacity: 1
    }
  },
  paperone: {
    padding: 25,
    marginBottom: 20,
    marginTop: 20,
    border: 'none',
    boxShadow: 'none',
    backgroundColor: '#fff'
  },
}))


export default function Deprovision() {
  const classes = useStyles()
  const [deprovisionDetails, setDeprovisionDetails] = React.useState({})
  const [checked, setChecked] = React.useState(false)
  const [ruleType, setRuleType] = React.useState('')
  const [grace, setGrace] = React.useState('')
  const [applications, setApplications] = React.useState([])
  const [script, setScript] = React.useState('')
  const [ruleTypeOptions, setRuleTypeOptions] = React.useState([])
  const [allocationSize, setAllocationSize] = React.useState('')
  const [cronExpression, setCronExpression] = React.useState('')
  const [startDate, setStartDate] = React.useState('')
  const [scheduler, setScheduler] = React.useState(false)
  const [cronParsed, setCronParsed] = React.useState()
  const [open, setOpen] = React.useState(false)
  const [openDeproModal, setOpenDeproModal] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [errors, _setErrors] = React.useState({})
  const [saving, setSaving] = React.useState(false)
  const [showHelp, setShowHelp] = React.useState(false)
  const setError = e => _setErrors({ ...errors, ...e })

  const handleModalOpen = () => { setOpen(true); };
  const handleModalClose = () => { setOpen(false); };

  const handleCronHelper = () => {
    setShowHelp(true);
    const cronHelperEl = document.getElementById("cron-helper")
    cronHelperEl && cronHelperEl.scrollIntoView({behavior: 'smooth'})
    setTimeout(() => {
      window.scrollBy({top: 300, behavior: 'smooth'})
      }, 500);
  }

  const constAppArr = (applist) => {
    let apps = []
    applist && applist.map(v => {
      let obj = {}
      obj.appName = v.label
      obj.id = v.value
      apps.push(obj)
    })
    return apps
  }

  const handleStatus = (data) => {
    callApi(`/rulesrvc/rule/deprovision/${data}`, 'PUT')
      .then(e => {
        if (e.success) {
          setChecked(data)
          showSuccess('Status updated successfully.')
        }
      })
  }

  const handleChange = (e) => {
    setRuleType(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    const appIds = applications.length > 0 ? applications.map(app => app.id) : []
    let data = {
      "ruleType": ruleType,
      "gracePeriod": grace,
      "applicationIds": appIds ,
      "script": '',
      "processAllocationSize": allocationSize
    }

    if(ruleType === 'SCRIPT_RULE') {
      data.script = script
    }

    if(scheduler) {
      let obj = {
        "cronExpression": cronExpression,
        "startDate": new Date(startDate).toISOString()
      }
      data.deprovisionSchedulerDTO = obj
    }else {
      data.deprovisionSchedulerDTO = null
    }

    callApi(`/rulesrvc/rule/deprovision`, 'PUT', data)
      .then(e => {
        setSaving(false);
        if (e.success) {
          const app = constAppArr(e.data.deprovisionSettingsDTO.applicationList)
          setDeprovisionDetails(e.data.deprovisionSettingsDTO)
          setChecked(e.data.deprovisionSettingsDTO.status)
          setRuleType(e.data.deprovisionSettingsDTO.ruleType);
          setGrace(e.data.deprovisionSettingsDTO.gracePeriod)
          setApplications(app)
          setScript(e.data.deprovisionSettingsDTO.script)
          setAllocationSize(e.data.deprovisionSettingsDTO.processAllocationSize)
          if(e.data.deprovisionSchedulerDTO) {
            setScheduler(true)
            let startDate = getISODatetime(e.data.deprovisionSchedulerDTO.startDate)
            setStartDate(startDate)
            // setStartDate(e.data.deprovisionSchedulerDTO.startDate)
            setCronExpression(e.data.deprovisionSchedulerDTO.cronExpression)
          }else{
            setScheduler(false)
            setStartDate(null)
            setCronExpression(null)
          }
          showSuccess('Updated successfully.')
        }
      })
      .catch(err => setSaving(false))

  }

  const getDeprovision = () => {
    callApi(`/rulesrvc/rule/deprovision`, 'GET')
      .then(e => {
        if (e.success) {
          const app = constAppArr(e.data.deprovisionSettingsDTO.applicationList)
          setDeprovisionDetails(e.data.deprovisionSettingsDTO)
          setChecked(e.data.deprovisionSettingsDTO.status)
          setRuleType(e.data.deprovisionSettingsDTO.ruleType);
          setGrace(e.data.deprovisionSettingsDTO.gracePeriod)
          setApplications(app)
          setScript(e.data.deprovisionSettingsDTO.script)
          setAllocationSize(e.data.deprovisionSettingsDTO.processAllocationSize)
          if(e.data.deprovisionSchedulerDTO) {
            setScheduler(true)
            let startDate = getISODatetime(e.data.deprovisionSchedulerDTO.startDate)
            setStartDate(startDate)
            // setStartDate(e.data.deprovisionSchedulerDTO.startDate)
            setCronExpression(e.data.deprovisionSchedulerDTO.cronExpression)
          }else{
            setScheduler(false)
            setStartDate(null)
            setCronExpression(null)
          }
        }
      })
  }
  
  const getRuleType = () => {
    callApi(`/rulesrvc/rule/deprovision/getRuleType`, 'GET')
      .then(e => {
        if (e.success) {
          setRuleTypeOptions(e.data)
        }
      })
  }

  const handleRunDeprov = () => {
    setLoading(true)
    callApi(`/rulesrvc/rule/deprovision/run`, 'GET')    
      .then(e => {
        setLoading(false)
        if (e.success) {
          showSuccess("Deprovision run successfully")
          setOpenDeproModal(false)
        }
      })
      .catch(err => setLoading(false))
  }

  const isValid = !Object.values(errors).some(e => e != null) && parseInt(grace) > 0 && parseInt(allocationSize) > 0 && (!scheduler || scheduler && startDate && cronExpression)

  const checkAllocationSize = () => {
    if (allocationSize.length === 0) {
      setError({allocationSize: 'Field is required'})
    }else if(parseInt(allocationSize) < 1 ){
      setError({allocationSize: 'Value should be greater than 0'})
    }else {
      setError({allocationSize: null})
    }
  }

  const checkGrace = () => {
    if (grace.length === 0) {
      setError({grace: 'Field is required'})
    }else if(parseInt(grace) < 1 ){
      setError({grace: 'Value should be greater than 0'})
    } else {
      setError({grace: null})
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
                  currentDate: startDate.length ? startDate : undefined,
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

  const valdateStartDate = (e) => {
    if(scheduler) {
      // if(!validator.isAfter(newMaster.scheduler.start)) {
      //   setError({startDate: 'Invalid Date'})
      // }
      if ((startDate || '').length === 0) {
        setError({startDate: 'Field is required'})
      } else {
        setError({startDate: null})
        if(cronExpression && cronExpression.length) {
          checkCron(cronExpression)
          // if(!cron.isValidCron(cronExpression, { seconds: true, alias: true, allowBlankDay: true })){
          //   setError({cronExpression: 'Cron Expression is invalid'})
          // } else{
            // let options = {
            //   currentDate: startDate.length ? startDate : undefined,
            // };
            // let interval = parser.parseExpression(cronExpression, options)
            // setCronParsed(interval.next().toString())
            // setError({cronExpression: null})
          // }
        }
      } 
    } else {
      setError({startDate: null})
    }
  }

  const validateCronExp = (e) => {
    setCronParsed(null)
    if(scheduler){
      checkCron(e.target.value)
      // if(!cron.isValidCron(e.target.value, { seconds: true, alias: true, allowBlankDay: true })){
      //   setError({cronExpression: 'Cron Expression is invalid'})
      // } else{
      //   let options = {
      //     currentDate: startDate.length ? startDate : undefined
      //   }
      //   let interval = parser.parseExpression(e.target.value, options)
      //   setCronParsed(interval.next().toString())
      //   setError({cronExpression: null})
      // }
    } else {
      setError({cronExpression: null})
    }
  }

  useEffect(() => {
    getDeprovision()
    getRuleType()
  }, [])

  const ModalBody = (
    <div className="settings-add-new-global-modal" id="centralModalSm1" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document" style={{overflowy: 'initial !important'}}>
        <div className="modal-content p-2">
          <div className="modal-header pb-1">
            <h4 className="modal-title w-100 pb-2" id="myModalLabel">Script Editor</h4>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true"><CloseIcon style={{ cursor: 'pointer' }} onClick={handleModalClose} /></span>
            </button>
          </div>
          <div className="modal-body p-0" style={{ backgroundColor: '#E9EDF6', height: '73vh', overflowY: 'auto' }}>
            <AceEditor
              mode={"java"}
              theme="twilight"
              onChange={(newValue) => setScript(newValue)}
              value={script}
              height="100%"
              width="100%"
              fontSize={14}
              wrapEnabled={true}
              readOnly={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
              enableBasicAutocompletion
              enableLiveAutocompletion
              name="UNIQUE_ID_OF_DIV"
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true
              }}
            />
          </div>
          <div className="modal-footer py-2">
            <button type="button" className="btn btn-left btn-sm ml-auto" onClick={handleModalClose}>Close</button>
            {/* <a href="JavaScript:void(0)" className="primary-btn-view">UPDATE</a> */}
          </div>
        </div>
      </div>
    </div>
  )


  return (
    <>
      <ScrollWrapper>
        <Grid container>
          <Grid item xs={12}>
            <CardViewWrapper>
              {/* <div style={{ float: 'right' }}>
                <span style={{ marginRight: 10 }}>Status</span> */}
                <Grid item xs={12} className={classes.toggleTitle}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="toggleCA"
                        color="primary"
                        checked={checked}
                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                        onChange={(e) => handleStatus(e.target.checked)}
                      />
                    }
                    label="Status"
                    labelPlacement="start"
                    // style={{ float: 'right'}}
                  />
                  <Button
                    variant="contained" 
                    className={classes.button}
                    color="primary"
                    disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || !checked || ruleType === 'SCRIPT_RULE'}
                    onClick={() => setOpenDeproModal(true)}
                  >
                    Run Deprovisioning
                  </Button>
                </Grid>
              {/* </div> */}

              { checked && <Grid container spacing={3}>
                <Grid item xs={12}>
                  <div style={{ fontSize: 18 }}>De-provision configuration</div>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3} alignItems="center" alignContent="center">
                    <Grid item xs={12} lg={3}>De-provision based on user's</Grid>
                    <Grid item xs={12} lg={3}>
                      <AppSelectInput
                        value={ruleType}
                        // onChange={e => setRuleType(e.target.value)}
                        onChange={handleChange}
                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                        // options={options.map(o => o.type)}
                        options={ruleTypeOptions.map(opt => opt.value)}
                        labels={ruleTypeOptions.map(opt => opt.label)}
                        // labels={['End Date', 'Status', 'Script Rule']}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                
                {/* { ruleType === 'END_DATE' ? (<> */}
                  <Grid item xs={12}>
                    <Grid container spacing={3} alignItems="center" alignContent="center">
                      <Grid item xs={12} lg={3}>Grace Period <span className="text-danger">*</span></Grid>
                      <Grid item xs={12} lg={3}>
                        <AppTextInput
                          value={grace}
                          type="number"
                          onChange={e => setGrace(e.target.value)}
                          disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                          error={!!errors.grace}
                          onBlur={e => checkGrace()}
                          helperText={errors.grace}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={3} alignItems="center" alignContent="center">
                      <Grid item xs={12} lg={3}>Exclusion Applications</Grid>
                      <Grid item xs={12} lg={5}>
                        <AppMultiUserInput
                          type='applications'
                          resource={applications}
                          value={applications ? applications : []}
                          disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                          v="applications"
                          onGroupId={e => setApplications(e)}
                        />
                      </Grid>
                      {/* {ruleType === 'SCRIPT_RULE' && (
                        <Grid item xs={12} lg={4}>
                          <Button
                            variant="contained" 
                            className={classes.button}
                            color="primary"
                            disabled={script === '' ? true : false}
                          >
                            Test Script Configuration
                          </Button>
                        </Grid>
                      )} */}
                    </Grid>
                  </Grid>
                {/* </>) : ruleType === 'SCRIPT_RULE' ? (<>
                  <Grid item xs={12}>
                    <Grid container spacing={3} alignItems="center" alignContent="center">
                      <Grid item xs={12} lg={3}>Grace Period</Grid>
                      <Grid item xs={12} lg={2}>
                        <AppTextInput
                          value={grace}
                          type="number"
                          onChange={e => setGrace(e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </Grid> */}
                  {ruleType === 'SCRIPT_RULE' ? (<>
                  <Grid item xs={12}>
                    <Grid container spacing={3} alignItems="center" alignContent="center">
                      <Grid item xs={12} lg={3}>Script</Grid>
                      <Grid item xs={12} lg={9} className={classes.scriptEditor}>
                        {/* <AppTextInput
                          value={script}
                          type="text"
                          onChange={e => setScript(e.target.value)}
                        /> */}
                        <AceEditor
                          mode={"java"}
                          theme="twilight"
                          onChange={(newValue) => setScript(newValue)}
                          value={script}
                          height="200px"
                          width="100%"
                          fontSize={14}
                          wrapEnabled={true}
                          enableBasicAutocompletion
                          enableLiveAutocompletion
                          readOnly={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                          name="UNIQUE_ID_OF_DIV"
                          editorProps={{ $blockScrolling: true }}
                          setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true
                          }}
                        />
                        <img src={FullScreen} className={classes.expandEditor} onClick={handleModalOpen} />
                      </Grid>
                    </Grid>
                  </Grid>
                </>) : (
                  <></>
                )}
                <Grid item xs={12}>
                  <Grid container spacing={3} alignItems="center" alignContent="center">
                    <Grid item xs={12} lg={3}>Process Allocation Size <span className="text-danger">*</span></Grid>
                    <Grid item xs={12} lg={3}>
                      <AppTextInput 
                        // label="Process Allocation Size"
                        type="number"
                        value={allocationSize}
                        onChange={e => setAllocationSize(e.target.value)}
                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                        error={!!errors.allocationSize}
                        onBlur={e => checkAllocationSize()}
                        helperText={errors.allocationSize}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Paper variant="outlined" elevation={3} className={classes.paperone} >
                    <Grid container spacing={3}>
                      <Grid item xs={10}>
                        <div className='mt-2'>
                          Scheduler
                        </div>
                      </Grid>
                      <Grid item xs={2}>
                        <AppCheckbox label="" 
                          value={scheduler}
                          switchLabel={scheduler ? 'Active' : 'Inactive'}
                          onChange={e => {
                            setScheduler(e)
                            setStartDate(e ? '' : null)
                            setCronExpression(e ? '' : null)
                            setCronParsed(null)
                            setError({startDate: null, cronExpression: null})
                          }}
                          disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                        />
                      </Grid>
                      {
                        scheduler && (
                          <>
                            <Grid item xs={12} md={6}>
                              <AppTextInput 
                                required
                                id="datetime-local"
                                label="Next Execution Date"
                                type="datetime-local"
                                // defaultValue="2017-05-24T10:30"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                error={!!errors.start}
                                onBlur={e => valdateStartDate(e)}
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                helperText={errors.start}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <AppTextInput 
                                // required
                                label={
                                  <>
                                    <span>Cron Expression{' '}
                                      <span className="text-danger">*</span>
                                    </span>
                                    <span 
                                      title="Cron Expression Help" 
                                      onClick={handleCronHelper}
                                    >
                                      <InfoIcon color="primary" />
                                    </span>
                                  </> 
                                }
                                value={cronExpression}
                                onChange={e => setCronExpression(e.target.value)}
                                error={!!errors.cronExpression}
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                onBlur={e => validateCronExp(e)}
                                helperText={cronParsed ? cronParsed : errors.cronExpression}
                              />
                            </Grid>
                            <Grid item xs={12} id="cron-helper">
                              {showHelp && (
                                <CronExpressionHelperText />
                              )}
                            </Grid>
                          </>
                        )
                      }   
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || !isValid || saving}
                    variant="contained" 
                    className={classes.button}
                    color="primary"
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>}
              {!checked && (
                <>
                  <Grid container justify="center" className="text-center p-5">
                    <Grid item xs={12} sm={12} md={6}>
                      <Typography variant="h5" component="h1">
                        Deprovisioning is not enabled.
                      </Typography>
                    </Grid>
                  </Grid>
                </>
              )}
            </CardViewWrapper>
          </Grid>
        </Grid>
      </ScrollWrapper>
      <Modal open={open} onClose={handleModalClose}>
        {ModalBody}
      </Modal>
      <ConfirmationModal
        open={openDeproModal}
        saving={loading}
        onClose={() => setOpenDeproModal(false)}
        confirmDepro={() => handleRunDeprov()}
      />
    </> 
  )
}

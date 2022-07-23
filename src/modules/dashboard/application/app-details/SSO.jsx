import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { CircularProgress } from '@material-ui/core'
import Modal from '@material-ui/core/Modal'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Switch from '@material-ui/core/Switch';
import ChipInput from 'material-ui-chip-input';

import { callApi } from '../../../../utils/api'
import AdvanceSettings from './advance-settings'
import SAMLSettings from './SAMLSettings'
import APISettings from './APISettings'
import { getAuthToken } from '../../../../utils/auth';
import { showSuccess, showError } from '../../../../utils/notifications'
import AppTextInput from '../../../../components/form/AppTextInput'
import {isActiveForRoles} from '../../../../utils/auth'
import OpenIdSettings from './OpenIdSettings';
import { ReverseProxySettings } from './ReverseProxySettings';


const useStyles = makeStyles(() => ({
  button: {
    borderBottomColor: "rgb(236, 217, 220)",
    display: "inline-block",
    borderRadius: "10px",
    backgroundColor: "white",
    marginTop: "20px",
    width: "750px",
    left: "5%",
    boxSizing: "border-box",
    boxShadow: "0px 2px 4px #eff2f7",
    border: "1px solid #ececec"
  },
  circularprog: { 
    display: 'flex', 
    width: '100%', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  container: { 
      display: 'flex', 
      flex: 1, 
      flexDirection: 'column', 
      width: '100%', 
      overflow: 'hidden'
  },
  containerone: { 
      flex: 1, 
      overflow: 'auto', 
      marginBottom: 15, 
      marginTop: 15, 
      width: '100%' 
  },
  divone: { 
      flex: 1, 
      overflow: 'auto', 
      padding: '0px 15px' 
  },
  divtwo: { 
      backgroundColor:'white', 
      borderRadius: '10px', 
      overflow: 'hidden', 
      padding: 15 
  },
  divthree: { 
      flex: 1, 
      overflowX: 'hidden' 
  },
  headertwo: { 
      color: 'black', 
      overflow: 'hidden', 
      fontSize: '18px' 
  },
  paraone: { 
      overflow: 'hidden', 
      fontSize: '15px' 
  },
  a: {
      color: '#072d94'
  },
  paratwo: { 
      position: 'relative', 
      textDecorationColor: 'black', 
      overflowX: 'hidden', 
      marginRight: '20px' 
  },
  divfour: { 
      border: 'none', 
      textAlign: 'left', 
      borderBottom: '0px solid #fff', 
      background: 'transparent', 
      outline: 'none', 
      color: 'black', 
      height: '42px', 
      alignItems: 'center', 
      display: 'flex', 
  },
  radio: { 
      display: 'inline', 
      borderRadius: '50%', 
      width: 18, 
      height: 18, 
      marginLeft: 8, 
      background: '#ececec' 
  },
  label: { 
      fontSize: 16, 
      marginLeft: 8 
  },
  divfive: { 
      backgroundColor: '#F1E09A', 
      padding: '15px', 
      maxWidth: 300
  },
  divsix:{ 
      fontSize: 14, 
      marginTop: '10px' 
  },
  button2 :{
    width: '300px'
  },
  saveButton: { 
    borderRadius: '8px' 
  },
  labels: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5
  },
  textField: {
    backgroundColor: '#F7F7F7',
  },
  helperText: {
    background: '#F7F7F7',
    margin: '3px 10px',
    paddingLeft: '5px'
  },
  buttondiv: {
    display: 'flex',
    alignItems: 'center',
    margin: '35px 10px 10px'
  },
}))

export default function UserLayout(props) {
  const defaultSSOConfig = {
    "applicationId": props.app.id,
    "enabled": false,
    "ssoType": null,
    "applicationUrl": "",
    "reverseProxyConfig": null
  }

  const defaultReverseProxy = {
    "host": "",
    "port": 20,
    "scheme": "HTTP",
    "loginUrl": "",
    "observeUrls": [],
    "domain": ""
  }

  const classes = useStyles()
  const [data, setData] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [advance, setAdvance] = React.useState(false)
  const [showReverseProxyFields, setShowReverseProxyFields] = React.useState(false)
  const [configSSO, setConfigSSO] = React.useState(defaultSSOConfig)
  const [reverseProxy, setReverseProxy] = React.useState(defaultReverseProxy)
  const [saving, setSaving] = React.useState(false)
  const [changed, setChanged] = React.useState(false)
  const [errors, _setErrors] = React.useState({})

  const setError = e => _setErrors({ ...errors, ...e })
  const handleModalOpen = () => { setOpen(true); };
  const handleModalClose = () => { setOpen(false); };

  useEffect(() => {
    if(configSSO.reverseProxyConfig){
      setShowReverseProxyFields(true)
      setReverseProxy(configSSO.reverseProxyConfig)
    }
  }, [configSSO.reverseProxyConfig])


  const ModalBody = (
    <div className="settings-add-new-global-modal" id="centralModalSm1" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document" style={{overflowy: 'initial !important'}}>
        <div className="modal-content p-2">
          <div className="modal-header pb-1">
            <h4 className="modal-title w-100" id="myModalLabel">SAML Attribute Mapper</h4>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true"><CloseIcon style={{ cursor: 'pointer' }} onClick={handleModalClose} /></span>
            </button>
          </div>
          <div className="modal-body p-0" style={{ backgroundColor: '#E9EDF6', height: '65vh', overflowY: 'auto' }}>
              <AdvanceSettings app={props.app}/>
          </div>
          <div className="modal-footer pt-1">
            <button type="button" className="btn btn-left btn-sm ml-auto" onClick={handleModalClose}>Close</button>
            {/* <a href="JavaScript:void(0)" className="primary-btn-view">UPDATE</a> */}
          </div>
        </div>
      </div>
    </div>
  )
  const downloadData = () => {
    callApi(`/provsrvc/applicationTenant/getSsoById/${props.app.id}`)
      .then(response => setData(response.data))
      .catch(error => {})
  }

  const getSSOConfig = () => {
    callApi(`/sso-config/${props.app.id}`)
      .then(response => {
        setConfigSSO(response.data)
      })
      .catch(error => {})
  }

  React.useEffect(() => {
    getSSOConfig()
    downloadData()
  }, [])

  const onDownloadClick = () => {
    let token = getAuthToken()
    fetch("/samlsrvc/metadata",{
        method:'GET',
        Accept:'application/xml',
        headers:{
            "Authorization": `Bearer ${token}`,
            "Accept":'application/xml',
        }
    })
    .then(response => response.text())
    .then(res => {
      if(res !== ''){
        localStorage.setItem('xmlData',res)
        window.open('/admin/#/xml','_blank')
      } else {
        showError('Metadata fetch failed.')
      }
    })
    // .then(response => response.blob())
    // .then(blob => {
    //     var url = window.URL.createObjectURL(blob);
    //     var a = document.createElement('a');
    //     a.href = url;
    //     a.download = "config.xml";
    //     document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
    //     a.click();    
    //     a.remove();  //after
    // })
}

const saveSSOConfig = (obj) => {
  setSaving(true);
  obj['applicationId'] = props.app.id;
  callApi(`/sso-config/save`, 'PUT', obj)
    .then(response => {
      if (response.success) {
        showSuccess('Updated Successfully!')
        setConfigSSO(response.data)
        setSaving(false)
        setChanged(false)
    }
    })
    .catch(error => {
      setSaving(false)
    })
}

  const handleChange = (e) => {
    if(e.target.name === 'enabled') {
      setConfigSSO({...configSSO, [e.target.name]: e.target.checked})
    }else {
      setChanged(true)
      setConfigSSO({...configSSO, [e.target.name]: e.target.value})
    }
  }

  const handleReverseProxyChange = (e) => {
    setChanged(true)
    if(e.target.name === 'scheme') {
      if(e.target.checked === true) {
        setReverseProxy({...reverseProxy, [e.target.name]: 'HTTPS'})
      } else {
        setReverseProxy({...reverseProxy, [e.target.name]: 'HTTP'})
      }
    } else {
      setReverseProxy({...reverseProxy, [e.target.name]: e.target.value})
    }
  }

  const checkField = (e) => {
    setError({ [e.target.name]: (reverseProxy[e.target.name] || '').length > 1 ? null : `Field is required'`})
  }

  const checkChipInput = (e) => {
    setError({ observeUrls: (reverseProxy.observeUrls || '').length > 1 ? null : `Field is required'`})
  }

  const signOnMethods = [];

  for (const key in data.signOnMethods) {
    const obj = data.signOnMethods[key];
    signOnMethods.push(obj);
  }

  if (!data) return (
    <div className={classes.circularprog}>
      <CircularProgress color="secondary" />
    </div>
  )

  return (
    <div className={classes.container}>
      <Grid container spacing={3} className={classes.containerone}>
        <Grid item xs={12}>
          <div className={classes.divone}>
            <div className={classes.divtwo}>
              <div className="card1" className={classes.divthree}>
                <div className="row">
                  <div className="col-9 col-md-9">
                    <h2 className={classes.headertwo} className="head2">Sign On Methods</h2>
                  </div>
                  <div className="col-3 col-md-3" style={{textAlign: 'end'}}>
                    <FormControlLabel
                      labelPlacement="top"
                      label="Enable SSO"
                      control={
                        <Switch
                          checked={configSSO.enabled}
                          disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                          onChange={(e) => saveSSOConfig({...configSSO, enabled: e.target.checked})}
                          name="enabled"
                          color="primary"
                        />
                      }
                    />
                  </div>
                </div>
                { configSSO.enabled &&
                  <>
                  <Grid item xs={8} className="my-3">
                    <AppTextInput
                      label="Application URL"
                      value={configSSO.applicationUrl}
                      disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                      name="applicationUrl"
                      // onBlur={(e) => saveSSOConfig({...configSSO, applicationUrl:e.target.value})}
                      onChange={handleChange}
                    />
                  </Grid>
                  { (configSSO.ssoType && configSSO.ssoType !== 'REVERSEPROXY') &&
                    <div className="accordion mb-3" id="accordionExample">
                      <div className="settings-table-card row" id="headingOne">
                        <div className="" onClick={() => { setShowReverseProxyFields(!showReverseProxyFields) }} style={{color: '#363795', cursor: 'pointer'}}
                        >
                          <span>Reverse Proxy Config</span>
                          {/* <span className="float-right">{ advance ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/> }</span> */}
                        </div>
                      </div>
                      <Collapse in={showReverseProxyFields}>
                        <div id="collapseOne" className="collapse show">
                          { showReverseProxyFields && (
                            <>
                              <Grid container spacing={3,2}>
                                <Grid item xs={6}>
                                  <AppTextInput
                                    label="Host"
                                    required
                                    value={reverseProxy.host}
                                    disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                    name="host"
                                    onChange={handleReverseProxyChange}
                                    error={!!errors.host}
                                    onBlur={checkField}
                                    helperText={errors.host}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <AppTextInput
                                    label="Port"
                                    required
                                    value={reverseProxy.port}
                                    type="number"
                                    disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                    name="port"
                                    onChange={handleReverseProxyChange}
                                    error={!!errors.port}
                                    onBlur={checkField}
                                    helperText={errors.port}
                                  />
                                </Grid>
                              </Grid>
                              <Grid container spacing={3,2}> 
                                <Grid item xs={6}>
                                  <AppTextInput
                                    label="Login Url"
                                    required
                                    value={reverseProxy.loginUrl}
                                    disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                    name="loginUrl"
                                    onChange={handleReverseProxyChange}
                                    error={!!errors.loginUrl}
                                    onBlur={checkField}
                                    helperText={errors.loginUrl}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <AppTextInput
                                    label="Domain"
                                    required
                                    value={reverseProxy.domain}
                                    disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                    name="domain"
                                    onChange={handleReverseProxyChange}
                                    error={!!errors.domain}
                                    onBlur={checkField}
                                    helperText={errors.domain}
                                  />
                                </Grid>
                              </Grid>
                              <Grid container spacing={3,2}>
                                <Grid item xs={6}>
                                  <div className={classes.labels}>Observe URLs <span className="text-danger">*</span></div>
                                  <ChipInput
                                    defaultValue={reverseProxy.observeUrls}
                                    fullWidth
                                    onChange={(chips) => {
                                      reverseProxy.observeUrls = chips
                                      setChanged(true)
                                    }}
                                    variant="outlined"
                                    className={classes.textField}
                                    fullWidth variant="outlined"
                                    FormHelperTextProps={{ className: classes.helperText}}
                                    error={!!errors.observeUrls}
                                    onBlur={checkChipInput}
                                    helperText={errors.observeUrls}
                                  />
                                </Grid>
                                <Grid item xs={6} style={{ marginTop: '2.5rem'}} >
                                  <FormControlLabel
                                    labelPlacement="right"
                                    label={reverseProxy.scheme}
                                    control={
                                      <Switch
                                        checked={reverseProxy.scheme === "HTTPS" ? true : false}
                                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                        name="scheme"
                                        color="primary"
                                        onChange={handleReverseProxyChange}
                                      />
                                    }
                                  />
                                </Grid>
                              </Grid>
                            </>
                          )}
                        </div>
                      </Collapse>
                    </div>
                  }
                  {/* <div className={classes.buttondiv}> */}
                    <Button
                      type="submit"
                      // onClick={onSave}
                      onClick={() => saveSSOConfig({...configSSO, ['reverseProxyConfig']: showReverseProxyFields ? reverseProxy : null})}
                      variant="contained"
                      disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || saving || !changed}
                      style={{ marginBottom: 20, borderRadius: '8px'}}
                      color="primary"
                    >
                      {saving ? 'Saving' : 'Save'}
                    </Button>
                  {/* </div> */}
                {/* <p className="arrange"className={classes.paraone}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an known printer took a galley of type and scrambled it to make type specimen book. It
                has survived not only five centuries, but also the leap into electronic typesetting, remaining unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages Versions of the Lorem ipsum text
                  have been used in typesetting at least since the 1960s, when it was popularized by advertisements for Letraset transfer sheets.</p> */}
                <p className="arrange1" className={classes.paraone}>
                  You can map application's attribute with Cymmetri attribute's.
                </p>
                <p className="radio1"className={classes.paratwo}>
                  {/* {signOnMethods.map((u,key) => {
                    return(
                      <button key={key} className={classes.button}>
                        <div className={classes.divfour}>
                          <input type="radio" name={u.label} defaultValue={u.label} className={classes.radio} checked={u.value.status} />
                          <label style={{ fontSize: 16, marginLeft: 8 }}>{data.signOnMethods != null ? (data.signOnMethods.SWA != null ? data.signOnMethods.SWA.label : null) : null}</label>
                          <label className={classes.label}>{u.label}</label>
                        </div>
                      </button>
                    )
                  })} */}
                  <FormControl component="fieldset" className="ml-2">
                    {/* <RadioGroup aria-label="gender" name="ssoType" value={configSSO.ssoType} onChange={(e) => saveSSOConfig({ssoType: e.target.value })}> */}
                    <RadioGroup aria-label="gender" name="ssoType" value={configSSO.ssoType} onChange={(e) => saveSSOConfig({...configSSO, ssoType: e.target.value })}>
                      <FormControlLabel value="SAML" control={<Radio color='primary'/>} label="SAML 2.0" disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}/>
                      <FormControlLabel value="OPENID" control={<Radio color='primary'/>} label="OpenID/OAuth" disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}/>
                      <FormControlLabel value="API" control={<Radio color='primary'/>} label="API-based SSO" disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}/>
                      <FormControlLabel value="REVERSEPROXY" control={<Radio color='primary'/>} label="Reverse Proxy" disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}/>
                    </RadioGroup>
                  </FormControl>
                </p></>
                }
                {/* {change ? <div className="my-3 text-right">
                  <Button variant="contained" className={classes.saveButton} onClick={saveSSOConfig} color="primary">Save</Button>
                </div> : null} */}
                { configSSO.enabled &&
                <>
                { (configSSO.ssoType && configSSO.ssoType === 'SAML') &&
                  <>
                  <p><span>To start mapping please click here </span> <span onClick={handleModalOpen} className="mt-2" style={{color: '#363795', cursor: 'pointer'}}>Config Profile Mapping</span></p>
                  <div className="accordion cym-custom-scroll " id="accordionExample">
                    <div className="settings-table-card row" id="headingOne">
                      <div className="" onClick={() => { setAdvance(!advance) }} style={{color: '#363795', cursor: 'pointer'}}
                      >
                        <span>Advanced Sign On Settings (SAML)</span>
                        {/* <span className="float-right">{ advance ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/> }</span> */}
                      </div>
                    </div>
                    <Collapse in={advance}>
                      <div id="collapseOne" className="collapse show">
                        { advance && <SAMLSettings app={props.app} onDownloadClick={onDownloadClick}/> }
                      </div>
                    </Collapse>
                  </div>
                  </>
                }
                { (configSSO.ssoType && configSSO.ssoType === 'API') &&
                  <div className="accordion cym-custom-scroll " id="accordionExample">
                    <div className="settings-table-card row" id="headingOne">
                      <div className="" onClick={() => { setAdvance(!advance) }} style={{color: '#363795', cursor: 'pointer'}}
                      >
                        <span>Advanced Sign On Settings (API)</span>
                        {/* <span className="float-right">{ advance ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/> }</span> */}
                      </div>
                    </div>
                    <Collapse in={advance}>
                      <div id="collapseOne" className="collapse show">
                        { advance && <APISettings app={props.app} onDownloadClick={onDownloadClick}/> }
                      </div>
                    </Collapse>
                  </div>
                }
                { (configSSO.ssoType && configSSO.ssoType === 'OPENID') &&
                  <div className="accordion cym-custom-scroll " id="accordionExample">
                    <div className="settings-table-card row" id="headingOne">
                      <div className="" onClick={() => { setAdvance(!advance) }} style={{color: '#363795', cursor: 'pointer'}}
                      >
                        <span>Advanced Sign On Settings (OPENID)</span>
                        {/* <span className="float-right">{ advance ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/> }</span> */}
                      </div>
                    </div>
                    <Collapse in={advance}>
                      <div id="collapseOne" className="collapse show">
                        { advance && <OpenIdSettings app={props.app} onDownloadClick={onDownloadClick}/> }
                      </div>
                    </Collapse>
                  </div>
                }
                { (configSSO.ssoType && configSSO.ssoType === 'REVERSEPROXY') &&
                  <div className="accordion cym-custom-scroll " id="accordionExample">
                    <div className="settings-table-card row" id="headingOne">
                      <div className="" onClick={() => { setAdvance(!advance) }} style={{color: '#363795', cursor: 'pointer'}}
                      >
                        <span>Advanced Sign On Settings (Reverse Proxy)</span>
                        {/* <span className="float-right">{ advance ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/> }</span> */}
                      </div>
                    </div>
                    <Collapse in={advance}>
                      <div id="collapseOne" className="collapse show">
                        {/* { advance && <h5>Reverse Proxy form</h5> } */}
                        { advance && <ReverseProxySettings app={props.app} onDownloadClick={onDownloadClick} /> }
                      </div>
                    </Collapse>
                  </div>
                }
                </> }
              </div>
            </div>
          </div> 
        </Grid>
        {/* <Grid item xs={4}>
          <div>
                <Button
                  onClick = { onDownloadClick }
                  variant="contained"
                  className={classes.button2}
                  color="primary">
                      View Metadata
                </Button>
          </div>
        </Grid> */}
      </Grid>
      <Modal open={open} onClose={handleModalClose}>
        {ModalBody}
      </Modal>
    </div>
  )
}
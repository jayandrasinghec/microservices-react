import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import Collapse from '@material-ui/core/Collapse';
import ChipInput from 'material-ui-chip-input';
import { CircularProgress, FormControlLabel, Switch } from '@material-ui/core'
import { callApi } from '../../../../utils/api'

import { showSuccess } from '../../../../utils/notifications'
import AppTextInput from '../../../../components/form/AppTextInput'
// import AppCheckbox from '../../../../components/form/AppCheckbox'
import checked from '../add-new/checked.png'
import unchecked from '../add-new/unchecked.png'
import {isActiveForRoles} from '../../../../utils/auth'


const useStyles = makeStyles(() => ({
  button: {
    borderBottomColor: "rgb(236, 217, 220)",
    display: "inline-block",
    borderRadius: "10px",
    backgroundColor: "white",
    top: "0%",
    width: "750px",
    left: "5%",
    boxSizing: "border-box",
    boxShadow: "0px 2px 4px #eff2f7",
    border: "1px solid #ececec"
  },
  clickedLink: {
    textDecorationLine: 'none',
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#363795',
    marginTop: '20px',
    marginLeft: '20px',
    fontSize: '18px',
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
  checkbox: {
    width: 15,
    height: 15,
    color: 'rgb(153,204,102)',
    marginRight: '5px'
  },
  label: {
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
  }
}))



export default function UserLayout(props) {
  const classes = useStyles()
  const [data, setData] = React.useState([])
  const [saving, setSaving] = React.useState(false)

  const [user, setUser] = React.useState(true);
  const [server, setServer] = React.useState(false);
  const [operate, setOperate] = React.useState(false);
  const [provision, setProvision] = React.useState(props.app.provisionEnable || false);
  const [textChips, setTextChips] = React.useState([]);

  const connectorUserConfig = [];
  const connectorServerConfig = [];
  const operations = [];

  const handleUserClick = () => { setUser(true); setServer(false); setOperate(false) }
  const handleServerClick = () => { setUser(false); setServer(true); setOperate(false) }
  const handleOperateClick = () => { setUser(false); setServer(false); setOperate(true) }

  const downloadUsers = () => {
    callApi(`/provsrvc/applicationTenant/getProvisioningById/${props.app.id}`)
      .then(response => setData(response.data))
      .catch(error => {})
  }

  const handleToggle = (e) => {
    let body = {}
    body.applicationId = props.app.id
    body.provisionEnable = e
    callApi(`/provsrvc/applicationTenant/toggleProvisioning`, 'PUT', body)
      .then(res => {
        if(res.success) {
          setProvision(res.data.provisionEnable)
        }
      })
      .catch(error => {})
  }

  React.useEffect(() => {
    if(provision){
      downloadUsers()
    }
  }, [provision])

  for (const key in data.connectorUserConfig) {
    const obj = data.connectorUserConfig[key];
    connectorUserConfig.push(obj);
  }

  for (const key in data.connectorServerConfig) {
    const obj = data.connectorServerConfig[key];
    connectorServerConfig.push(obj);
  }

  for (const key in data.operations) {
    const obj = data.operations[key];
    operations.push(obj);
  }

  const Checkbox = (props) => {
    if (props.checked) return <img src={checked} className={classes.checkbox} />
    return <img src={unchecked} className={classes.checkbox} />
  }

  if (!data) return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress color="secondary" />
    </div>
  )
  const onClick = () => {
    setData.connectorUserConfig = connectorUserConfig
    setData.connectorServerConfig = connectorServerConfig
    setData.operations = operations
    setSaving(true)
    callApi(`/provsrvc/applicationTenant/updateProvisioning/${props.app.id}`, 'PUT', data)
      .then(response => {
        setSaving(false) 
        setData(response.data)
        showSuccess('Provisions has been updated!')
      })
      .catch(() => setSaving(false))
  }

  const handleTestConfiguration = () => {
    callApi(`/provsrvc/provisioning/appTest/${props.app.id}`)
      .then(response => {
        if(response.success) {
          showSuccess('Provision Configuration successful.')
        }
      })
      .catch((error) => {})
  }

  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'row', width: '100%', overflow: 'hidden' }}>
      <Grid container spacing={3} style={{ flex: 1, overflow: 'auto', marginBottom: 15, marginTop: 15, width: '100%' }}>
        <Grid item md={12} xs={12}>
          <div style={{ padding: '0px 15px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '10px', paddingTop: 10 }}>
            <Grid container justify='space-between' className='p-2 pt-2'>
              <Grid item xs={6}>
                <h2 className="head2 pl-3">Application Provisioning</h2>
              </Grid>
              <Grid item xs={6}>
                <Grid container direction="row" justify='flex-end'>
                  <Grid item xs={5}>
                    <Button
                      variant="outlined"
                      className="mb-4 mr-4"
                      disabled={isActiveForRoles(['READ_ONLY']) || !provision}
                      color="primary"
                      onClick={handleTestConfiguration}
                    >
                      Test Configuration
                    </Button>
                  </Grid>
                  <Grid item xs={5}>
                    <FormControlLabel
                      labelPlacement="top"
                      label="Enable Provisioning"
                      control={
                        <Switch
                          checked={provision}
                          onChange={(e) => handleToggle(e.target.checked)}
                          name="enabled"
                          color="primary"
                          disabled={isActiveForRoles(['READ_ONLY'])}
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            { provision && <>

              <Grid item xs={12} className="mb-3">
                <Link onClick={handleUserClick} style={{color:'#1F4287'}} className={clsx(classes.link, user && classes.activeLink)}>User Configurations</Link>
                <Link onClick={handleServerClick} style={{color:'#1F4287'}} className={clsx(classes.link, server && classes.activeLink)}>Server Configurations</Link>
                <Link onClick={handleOperateClick} style={{color:'#1F4287'}} className={clsx(classes.link, operate && classes.activeLink)}>Operations</Link>
              </Grid>

              <Collapse in={user}>
              {
                operations.length === 0 ? 
                <Grid item xs={12} style={{ textAlign : 'center'}}>
                  <div className='p-4'>
                    NO DATA
                  </div>
                </Grid> :
                <Grid container spacing={3} className="p-4">
                  {connectorUserConfig.map((u, key) => {
                    return (
                      u.dataType !== "ArrayList<String>" ? 
                      <Grid key={key} item md={6} sm={12} xs={12}>
                        <AppTextInput
                          style={{ width: '100%' }}
                          key={key}
                          label={u.label}
                          defaultValue={u.value}
                          onChange={e => u.value = e.target.value}
                          helperText={u.description}
                          disabled={isActiveForRoles(['READ_ONLY'])}
                          variant="outlined"
                          fullWidth
                        />
                      </Grid> : 
                      <Grid item md={6} sm={12} xs={12}>
                        <div className={classes.label}>{u.label}</div>
                        <ChipInput
                          defaultValue={u.value}
                          fullWidth
                          key={key}
                          onChange={(chips) => u.value = chips}
                          variant="outlined"
                          className={classes.textField}
                          fullWidth variant="outlined"
                          helperText={u.description}
                          FormHelperTextProps={{ className: classes.helperText}}
                        />
                      </Grid>
                    )
                  })}
                </Grid>
              }
              </Collapse>
              <Collapse in={server}>
              {
                operations.length === 0 ? 
                <Grid item xs={12} style={{ textAlign : 'center'}}>
                  <div className='p-4'>
                    NO DATA
                  </div>
                </Grid> :
                <Grid container spacing={3} className="p-4">
                  {connectorServerConfig.map((u, key) => {
                    return (
                      u.dataType !== "ArrayList<String>" ?
                      <Grid key={key} item md={6} sm={12} xs={12}>
                        <AppTextInput
                          style={{ width: '100%' }}
                          key={key}
                          label={u.label}
                          defaultValue={u.value}
                          onChange={e => u.value = e.target.value}
                          helperText={u.description}
                          disabled={isActiveForRoles(['READ_ONLY'])}
                          variant="outlined"
                          fullWidth
                        />
                      </Grid> :
                      <Grid item md={6} sm={12} xs={12}>
                        <div className={classes.label}>{u.label}</div>
                        <ChipInput
                          defaultValue={u.value}
                          fullWidth
                          key={key}
                          onChange={(chips) => u.value = chips}
                          variant="outlined"
                          className={classes.textField}
                          fullWidth variant="outlined"
                          helperText={u.description}
                          FormHelperTextProps={{ className: classes.helperText}}
                        />
                      </Grid>
                    )
                  })}
                </Grid>
              }
              </Collapse>
              <Collapse in={operate}>
              {
                operations.length === 0 ? 
                <Grid item xs={12} style={{ textAlign : 'center'}}>
                  <div className='p-4'>
                    NO DATA
                  </div>
                </Grid> :
                operations.map((u, key) => {
                  return (
                    <Grid key={key} item xs={12} style={{ display: 'flex', flexDirection: 'row', margin: 25 }}>
                      <div key={key} style={{ display: 'flex' }}>
                        <div className="custom-checkbox" style={{ display: 'flex' }}>
                          <Checkbox name={u.label} className={classes.checkbox} checked={!u.value} />
                          {/* <input type="checkbox" name={u.label} id={u.label} defaultChecked={u.value} onChange={e => u.value = e} /> <label htmlFor={u.label} /> */}
                          <span style={{ marginTop: -5 }}>{u.label}</span>
                        </div>
                        {/* <AppCheckbox
                          name={u.label}
                          defaultChecked={u.value}
                          label={u.label}
                          onChange={e => u.value = e} /> */}
                      </div>
                    </Grid>
                  )
                })
              }
              </Collapse>
              { operations.length !== 0 && <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','APP_ADMIN']) && <Button variant="contained" className="mb-4 mr-4" color="primary" onClick={onClick} disabled={saving} ><span>Save</span></Button> }
              </Grid> }
              </> }
            </div>
          </div>
        </Grid>
        {/* <Grid item md={4} xs={4} style={{ paddingTop: 0, marginLeft:'15px'}}>
          <Paper style={{backgroundColor:'#F1E09A',padding:'15px'}}>
              <div>? Help</div>
              <div style={{fontSize :'12px',marginTop:'10px'}}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. At architecto consequatur ea eveniet fugiat labore esse quae sunt soluta tempore. Debitis quia sint aliquid ea similique, a ipsum reprehenderit? Illo.</div>
          </Paper>
        </Grid> */}
      </Grid>
    </div>
  )
}
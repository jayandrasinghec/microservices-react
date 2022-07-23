import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ChipInput from 'material-ui-chip-input';
import { Button, FormControlLabel, Grid, Switch } from '@material-ui/core';

import { callApi } from '../../../../../utils/api';
import { isActiveForRoles } from '../../../../../utils/auth';
import AppTextInput from '../../../../../components/form/AppTextInput';
import AppSelectInput from '../../../../../components/form/AppSelectInput';
import { AddParameters } from './AddParameters';
import { showSuccess } from '../../../../../utils/notifications';


const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flex: 1,
  },
  gridcontainer: {
    overflowY: 'auto',
    marginBottom: 15,
    marginTop: 15,
    marginLeft: '15px',
    marginRight: '15px',
    width: '100%' ,
    backgroundColor: '#EEF1F8',
    borderRadius: '10px',
  },
  griditemone: {
    paddingTop: 0,
    margin: '0px'
  },
  griditemtwo:{
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '30px',
  },
  buttondiv: {
    display: 'flex',
    alignItems: 'center',
    margin: '35px 10px 10px'
  },
  button: {
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
}))

export const ReverseProxySettings = (props) => {
  const { app } = props;
  const classes = useStyles();

  const defaultConfig = {
    "applicationId": app ? app.id : '',
    "domain": "",
    "observeUrls": [],
    "loginUrl": "",
    "port": 20,
    "scheme": "HTTP",
    "host": "",
    "requestMethod": "",
    "parameters": []
  };

  const requestMethodOptions = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'TRACE'];

  const [config, setConfig] = React.useState(defaultConfig);
  const [saving, setSaving] = React.useState(false);

    const downloadReverseProxyData = () => {
      callApi(`/sso-config/reverse-proxy-config/admin/application/${app.id}`)
        .then(response => {
          if(response.data){
            setConfig(response.data)
          }
        })
        .catch(error => {})
    }

    
    React.useEffect(() => {
        downloadReverseProxyData()
    }, [])

    const onSave = () => {
      setSaving(true);
      callApi(`/sso-config/reverse-proxy-config`, 'PUT', config)
        .then(e => {
          if (e.success) {
            showSuccess('Updated Successfully!')
            setConfig(e.data)
            setSaving(false)
          }
        })
        .catch(error => { 
          setSaving(false) 
        }) 
    }

    const handleReverseProxyChange = (e) => {
      if(e.target.name === 'scheme') {
        if(e.target.checked === true) {
          setConfig({...config, [e.target.name]: 'HTTPS'})
        } else {
          setConfig({...config, [e.target.name]: 'HTTP'})
        }
      } else {
        setConfig({...config, [e.target.name]: e.target.value})
      }
    }

  return (
    <>
      <div className={classes.container}>
        <Grid container spacing={3} className={classes.gridcontainer + " justify-content-around"}>
          <Grid item xs={12} md={12} className={classes.griditemone}>
              <Grid className={classes.griditemtwo}>
                  <Grid item xs={12} className="my-3">
                    <AppTextInput
                      label="Host"
                      value={config.host}
                      disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                      name="host"
                      onChange={handleReverseProxyChange}
                    />
                  </Grid>
                  <Grid item xs={12} className="my-3">
                    <AppTextInput
                      label="Port"
                      value={config.port}
                      type="number"
                      disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                      name="port"
                      onChange={handleReverseProxyChange}
                    />
                  </Grid>
                  <Grid item xs={12} className="my-3">
                    <AppTextInput
                      label="Login Url"
                      value={config.loginUrl}
                      disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                      name="loginUrl"
                      onChange={handleReverseProxyChange}
                    />
                  </Grid>
                  <Grid item xs={12} className="my-3">
                    <AppTextInput
                      label="Sub-Domain"
                      value={config.domain}
                      disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                      name="domain"
                      onChange={handleReverseProxyChange}
                    />
                  </Grid>
                  <Grid item xs={12} className="my-3">
                    <div className={classes.labels}>Observe URLs</div>
                    <ChipInput
                      defaultValue={config.observeUrls}
                      fullWidth
                      onChange={(chips) => config.observeUrls = chips}
                      variant="outlined"
                      className={classes.textField}
                      fullWidth variant="outlined"
                      FormHelperTextProps={{ className: classes.helperText}}
                    />
                  </Grid>
                  <Grid item xs={12} className="my-3">
                    <FormControlLabel
                      labelPlacement="right"
                      label={config.scheme}
                      control={
                        <Switch
                          checked={config.scheme === "HTTPS" ? true : false}
                          disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                          name="scheme"
                          color="primary"
                          onChange={handleReverseProxyChange}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} className="my-3">
                    <AppSelectInput
                      label="Request Method"
                      value={config.requestMethod}
                      name="requestMethod"
                      // onChange={e => change({ canonicalizationMethod: e.target.value })}
                      onChange={handleReverseProxyChange}
                      options={requestMethodOptions.map(o => o)}
                      disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                    />
                  </Grid>
                  <Grid item xs={12} className="my-3">
                    <AddParameters config={config} setConfig={setConfig} />
                  </Grid>
                  <div className={classes.buttondiv}>
                    <Button
                      type="submit"
                      onClick={onSave}
                      variant="contained"
                      disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || saving}
                      className={classes.button}
                      color="primary"
                    >
                      {saving ? 'Saving' : 'Save'}
                    </Button>
                  </div>
              </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  )
}

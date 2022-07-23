import React, { useEffect, useState } from 'react';
import { Link as Linking } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormControlLabel, Grid, Paper, Switch, Typography } from '@material-ui/core';

import AppSelectInput from '../../../../../components/form/AppSelectInput';
import AppTextInput from '../../../../../components/form/AppTextInput';
import CardViewWrapper from '../../../../../components/HOC/CardViewWrapper';
import { isActiveForRoles } from '../../../../../utils/auth';
import { callApi } from '../../../../../utils/api';
import { showSuccess } from '../../../../../utils/notifications';
import FilterConditions from './FilterConditions';

const useStyles = makeStyles(theme => ({
  button: {
    float: 'right',
    borderRadius: '8px',
    marginRight: 20
  },
  papertwo: {
    padding: 25,
    // marginBottom: 20,
    // marginTop: 20,
    border: 'none',
    boxShadow: 'none'
  },
}));

const defaultConditionsQuery = {
  condition: 'AND',
  rules: []
}

const EditAuthRule = (props) => {
  const { editData, mode, setOpenEdit, ids, downloadRuleList, setMode } = props;
  const classes = useStyles();
  const [query, setQuery] = useState(editData.condition || defaultConditionsQuery)
  const [newData, setNewData] = useState(editData);
  const [saving, setSaving] = useState(false);
  const [providerOptions, setProviderOptions] = useState([]);
  const [errors, _setErrors] = useState({})
  const [changed, setChanged] = useState(false)

  const setError = e => _setErrors({ ...errors, ...e })

  const validateQuery = () => {
    let invalidQuery = false;
    const checkQuery = (data) => {
      data.length > 0 && data.forEach((rule) => {
        if(!rule.condition && (!rule.key || !rule.operator)){
          invalidQuery = true;
        }else if (rule.condition && rule.rules.length){
          checkQuery(rule.rules)
        }
      })
    }
    checkQuery(query.rules)
    return invalidQuery;
  }

  const isValid = !Object.values(errors).some(e => e != null) && newData.name && (newData.resultSet && newData.resultSet[0].authProvider)

  const checkFields = (key) => {
    if(!(newData.resultSet[0][key]).toString().length) {
      setError({ [key] : `This field is required.` })
    } else if(newData.resultSet[0][key] && newData.resultSet[0][key] <= 0) {
      setError({ [key] : `Value should be greater than 0.` })
    } else {
      setError({ [key] : null })
    }
  }

  const checkName = () => {
    if(!newData.name) {
      setError({ name : `This field is required.` })
    } else{
      setError({ name : null })
    }
  }

  const checkRToken = () => {
    if(!(newData.resultSet[0].refreshTokenExpiryMinutes).toString().length) {
      setError({ refreshTokenExpiryMinutes : `This field is required.` })
    } else if(parseInt(newData.resultSet[0].refreshTokenExpiryMinutes) <= 0 || parseInt(newData.resultSet[0].refreshTokenExpiryMinutes) <= parseInt(newData.resultSet[0].tokenExpiryMinutes)) {
      setError({ refreshTokenExpiryMinutes : `Refresh Token Value should be greater than token expiry minutes` })
    }else {
      setError({ refreshTokenExpiryMinutes : null, tokenExpiryMinutes : null })
    }
  }

  const checkTokenExpiry = () => {
    if(!(newData.resultSet[0].tokenExpiryMinutes).toString().length) {
      setError({ tokenExpiryMinutes : `This field is required.` })
    } else if( parseInt(newData.resultSet[0].tokenExpiryMinutes) <=0 || parseInt(newData.resultSet[0].tokenExpiryMinutes) >= parseInt(newData.resultSet[0].refreshTokenExpiryMinutes)) {
      setError({ tokenExpiryMinutes : `Token expiry Value should be greater than 0 and less than refresh token expiry minutes` });
    } else {
      setError({ tokenExpiryMinutes : null, refreshTokenExpiryMinutes: null });
    }
  }

  const getProviderOptions = () => {
    callApi(`/authsrvc/AuthenticationProvider/activeList`, 'GET')
      .then(e => {
        if (e.success) {
          let dropdownData = [];
          e.data && e.data.map((opt => {
            let obj = {}
            obj.label = opt.name
            obj.value = opt.id
            dropdownData.push(obj)
          }))
          setProviderOptions(dropdownData)
        } 
      })
  }

  useEffect(() => {
    getProviderOptions()
  }, [])

  const change = e => {
    setChanged(true)
    setNewData({ ...newData, ...e })
  }

  const updateQuery = (data) => {
    setChanged(true)
    setQuery(data)
  }  

  const handleSaveRule = () => {
    setSaving(true)
    if(mode === 'add') {
      let obj = {...newData}
      obj.condition = query
      callApi(`/rulesrvc/ruleEngine`, 'POST', obj)
      .then(e => {
        setSaving(false)
        if (e.success){
          setNewData(e.data)
          showSuccess('Rule Added Successfully!')
          setOpenEdit(true)
          setMode("edit")
          setChanged(false)
        }
      })
      .catch(() => setSaving(false))
    } else {
      let obj = {...newData}
      obj.condition = query
      callApi(`/rulesrvc/ruleEngine/${newData.id}`, 'PUT', obj)
      .then(e => {
        setSaving(false)
        setChanged(false)
        if (e.success){
          setNewData(e.data)
          showSuccess('Rule Updated Successfully!')
        }
      })
      .catch(() => setSaving(false))
    }
  }

  const disableBtn = saving || !isValid || !changed || validateQuery()

  return (
    <>
      <CardViewWrapper>
        <Grid item xs={12} style={{ marginBottom: '16px'}}>
          <Linking to="/dash/policy/auth-rule">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="small"
              disableElevation
            >
              Back To Rule List
            </Button>
          </Linking>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}><h5>{mode === 'edit' ? 'Edit Rule' : 'Add Rule'}</h5></Grid>
          <Grid item xs={12}>
            <Grid container spacing={3} alignItems="center" alignContent="center">
              <Grid item xs={12} lg={3}>Name <span className="text-danger">*</span></Grid>
              <Grid item xs={12} lg={6}>
                <AppTextInput
                  value={newData.name}
                  disabled={mode === 'edit' || !isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                  onChange={e => change({ name: e.target.value })}
                  error={!!errors.name}
                  onBlur={() => checkName()}
                  helperText={errors.name}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3} alignItems="center" alignContent="center">
              <Grid item xs={12} lg={3}>Description</Grid>
              <Grid item xs={12} lg={6}>
                <AppTextInput
                  value={newData.description}
                  disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                  onChange={e => change({ description: e.target.value })}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3} alignItems="center" alignContent="center">
              <Grid item xs={12} lg={3}>Provider <span className="text-danger">*</span></Grid>
              <Grid item xs={12} lg={6}>
                <AppSelectInput
                  value={newData && newData.resultSet ? newData.resultSet[0].authProvider : ''}
                  disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                  onChange={e => change({ resultSet: [{ ...newData.resultSet[0], authProvider: e.target.value}] })}
                  options={providerOptions.map(opt => opt.value)}
                  labels={providerOptions.map(opt => opt.label)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3} alignItems="center" alignContent="center">
              <Grid item xs={12} lg={3}>Active</Grid>
              <Grid item xs={12} lg={6}>
                <FormControlLabel
                  control={
                    <Switch
                      name="active"
                      color="primary"
                      checked={newData.active}
                      disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                      onChange={(e) => change({ active: e.target.checked })}
                    />
                  }
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Paper variant="outlined" elevation={3} className={classes.papertwo} >
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <AppTextInput
                    label="Auth Failed Count"
                    type="number"
                    required
                    value={newData && newData.resultSet ? newData.resultSet[0].authFailedCount : ''}
                    onChange={e => change({ resultSet: [{ ...newData.resultSet[0], authFailedCount: e.target.value}] })}
                    disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                    error={!!errors.authFailedCount}
                    onBlur={() => checkFields('authFailedCount')}
                    helperText={errors.authFailedCount}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <AppTextInput
                    type="number"
                    required
                    value={newData && newData.resultSet ? newData.resultSet[0].unlockAfterMinutes : ''}
                    onChange={e => change({ resultSet: [{ ...newData.resultSet[0], unlockAfterMinutes: e.target.value}] })}
                    disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                    label="Unlock After Minutes"
                    error={!!errors.unlockAfterMinutes}
                    onBlur={() => checkFields('unlockAfterMinutes')}
                    helperText={errors.unlockAfterMinutes}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <AppTextInput
                    type="number"
                    required
                    value={newData && newData.resultSet ? newData.resultSet[0].tokenExpiryMinutes : ''}
                    onChange={e => change({ resultSet: [{ ...newData.resultSet[0], tokenExpiryMinutes: e.target.value}] })}
                    disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                    label="Token Expiry Minutes"
                    error={!!errors.tokenExpiryMinutes}
                    onBlur={() => checkTokenExpiry()}
                    helperText={errors.tokenExpiryMinutes}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <AppTextInput
                    type="number"
                    value={newData && newData.resultSet ? newData.resultSet[0].refreshTokenExpiryMinutes : ''}
                    required
                    onChange={e => change({ resultSet: [{ ...newData.resultSet[0], refreshTokenExpiryMinutes: e.target.value}] })}
                    label="Refresh Token Expiry Minutes"
                    disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                    error={!!errors.refreshTokenExpiryMinutes}
                    onBlur={checkRToken}
                    helperText={errors.refreshTokenExpiryMinutes}
                    />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper variant="outlined" elevation={3} className={classes.papertwo} >
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <AppTextInput
                    type="number"
                    label="Mobile Max Device Limit"
                    value={newData && newData.resultSet ? newData.resultSet[0].mobileMaxDeviceLimit : ''}
                    onChange={e => change({ resultSet: [{ ...newData.resultSet[0], mobileMaxDeviceLimit: e.target.value}] })}
                    disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <AppTextInput
                    type="number"
                    label="Mobile Refresh Token Expiry Minutes"
                    value={newData && newData.resultSet ? newData.resultSet[0].mobileRefreshTokenExpiryMinutes : ''}
                    onChange={e => change({ resultSet: [{ ...newData.resultSet[0], mobileRefreshTokenExpiryMinutes: e.target.value}] })}
                    disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <AppTextInput
                    type="number"
                    label="Mobile Token Expiry Minutes"
                    value={newData && newData.resultSet ? newData.resultSet[0].mobileTokenExpiryMinutes : ''}
                    onChange={e => change({ resultSet: [{ ...newData.resultSet[0], mobileTokenExpiryMinutes: e.target.value}] })}
                    disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper variant="outlined" elevation={3} className={classes.papertwo} >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6">Conditions</Typography>
                  <br />
                  <FilterConditions query={query} setQuery={updateQuery}/>
                </Grid>
              </Grid>
            </Paper>
          </Grid> 
        </Grid>
        <div style={{display: 'flex', marginTop: '24px'}}>
          <Grid item xs={8}>
            <Linking to="/dash/policy/auth-rule">
            <Button>
              Discard
            </Button>
            </Linking>
          </Grid>
          {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && <Grid item xs={4}>
            <Button 
              className={classes.button} 
              onClick={handleSaveRule} 
              disabled={disableBtn}
              variant="contained" 
              color="primary"
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Grid>}
        </div>
      </CardViewWrapper>
    </>
  )
}

export default EditAuthRule

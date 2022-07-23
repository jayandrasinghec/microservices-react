/* eslint-disable react/display-name */
import React from 'react';
import { Link as Linking } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import AppCheckbox from '../../../../../components/form/AppCheckbox';
import AppTextInput from '../../../../../components/form/AppTextInput';
import AuthPolicyIDPList from './AuthPolicyIDPList'
import { makeStyles } from '@material-ui/core/styles';
import {isActiveForRoles} from '../../../../../utils/auth'

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 400,
    overflow: 'hidden',
    flex: 1
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

const defaultData = {
  "active": false,
  "authFailedCount": 3,
  "authenticationList": [],
  // "description": "Description",
  "isDefault": false,
  // "name": "Name",
  "tokenExpiryMinutes": 100,
  "unlockAfterMinutes": 60,
  "refreshTokenExpiryMinutes" : 1000,
  "mobileMaxDeviceLimit": null,
  "mobileRefreshTokenExpiryMinutes": null,
  "mobileTokenExpiryMinutes": null,
}

export default function AuthPolicyForm(props) {
  const { newData = defaultData, setNewData, onSubmit, saving } = props
  const [errors, _setErrors] = React.useState({})
  const classes = useStyles()
  const change = e => setNewData({ ...newData, ...e })
  const setError = e => _setErrors({ ...errors, ...e })

  const isValid = !Object.values(errors).some(e => e != null) && newData.name && newData.description && newData.authenticationList.length > 0 && newData.tokenExpiryMinutes < newData.refreshTokenExpiryMinutes

  const checkCname = () => setError({ name: (newData.name || '').length > 1 ? null : 'Policy name is required' })
  const checkDes = () => setError({ description: (newData.description || '').length > 1 ? null : 'Description is required' })
  // const checkRToken = () => setError({ refreshTokenExpiryMinutes: (newData.refreshTokenExpiryMinutes > newData.tokenExpiryMinutes) ? null : 'Refresh Token Value should be greater than token expiry minutes' })

  const checkRToken = () => {
    if(!(newData.refreshTokenExpiryMinutes).toString().length) {
      setError({ refreshTokenExpiryMinutes : `This field is required.` })
    } else if(parseInt(newData.refreshTokenExpiryMinutes) <= 0 || parseInt(newData.refreshTokenExpiryMinutes) <= parseInt(newData.tokenExpiryMinutes)) {
      setError({ refreshTokenExpiryMinutes : `Refresh Token Value should be greater than token expiry minutes` })
    }else {
      setError({ refreshTokenExpiryMinutes : null, tokenExpiryMinutes : null })
    }
  }

  const checkTokenExpiry = () => {
    if(!(newData.tokenExpiryMinutes).toString().length) {
      setError({ tokenExpiryMinutes : `This field is required.` })
    } else if( parseInt(newData.tokenExpiryMinutes) <=0 || parseInt(newData.tokenExpiryMinutes) >= parseInt(newData.refreshTokenExpiryMinutes)) {
      setError({ tokenExpiryMinutes : `Token expiry Value should be greater than 0 and less than refresh token expiry minutes` });
    } else {
      setError({ tokenExpiryMinutes : null, refreshTokenExpiryMinutes: null });
    }
  }

  const checkFields = (key) => {
    if(!(newData[key]).toString().length) {
      setError({ [key] : `This field is required.` })
    } else if(newData[key] && newData[key] <= 0) {
      setError({ [key] : `Value should be greater than 0.` })
    } else {
      setError({ [key] : null })
    }
  }
  return (
    <div className={classes.container}>
      <div className={classes.divone}>
        {/* <Grid item xs={12}> */}
        <Paper variant="outlined" elevation={3} className={classes.paperone} >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <AppTextInput
                required
                value={newData.name}
                error={!!errors.name}
                onBlur={checkCname}
                helperText={errors.name}
                onChange={e => change({ name: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                label="Policy Name" />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppTextInput
                required
                value={newData.description}
                error={!!errors.description}
                onBlur={checkDes}
                helperText={errors.description}
                onChange={e => change({ description: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                label="Description" />
            </Grid>
            <Grid item xs={6} md={2} lg={2}>
              <AppCheckbox
                value={newData.active} onChange={e => change({ active: Boolean(e) })}
                switchLabel={newData.active ? 'Active' : 'Inactive'}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                label="Status" />
            </Grid>
            <Grid item xs={6} md={2} lg={2}>
              <AppCheckbox
                value={newData.isDefault} onChange={e => change({ isDefault: Boolean(e) })}
                switchLabel={newData.isDefault ? 'True' : 'False'}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                label="Default" />
            </Grid>
          </Grid>
        </Paper>

        <AuthPolicyIDPList newData={newData} setNewData={setNewData} />

        <Paper variant="outlined" elevation={3} className={classes.papertwo} >
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <AppTextInput
                label="Auth Failed Count"
                type="number"
                error={!!errors.authFailedCount}
                onBlur={() => checkFields('authFailedCount')}
                helperText={errors.authFailedCount}
                required
                value={newData.authFailedCount}
                onChange={e => setNewData({ ...newData, authFailedCount: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                defaultValue="6" />
            </Grid>
            <Grid item xs={12} md={3}>
              <AppTextInput
                type="number"
                error={!!errors.unlockAfterMinutes}
                onBlur={() => checkFields('unlockAfterMinutes')}
                helperText={errors.unlockAfterMinutes}
                required
                value={newData.unlockAfterMinutes}
                onChange={e => setNewData({ ...newData, unlockAfterMinutes: e.target.value })}
                label="Unlock After Minutes"
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                defaultValue="1" />
            </Grid>
            <Grid item xs={12} md={3}>
              <AppTextInput
                type="number"
                error={!!errors.tokenExpiryMinutes}
                // onBlur={() => checkFields('tokenExpiryMinutes')}
                onBlur={() => checkTokenExpiry()}
                helperText={errors.tokenExpiryMinutes}
                required
                value={newData.tokenExpiryMinutes}
                onChange={e => setNewData({ ...newData, tokenExpiryMinutes: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                label="Token Expiry Minutes"
                />
            </Grid>
            <Grid item xs={12} md={3}>
              <AppTextInput
                type="number"
                value={newData.refreshTokenExpiryMinutes}
                error={!!errors.refreshTokenExpiryMinutes}
                required
                onBlur={checkRToken}
                helperText={errors.refreshTokenExpiryMinutes}
                onChange={e => setNewData({ ...newData, refreshTokenExpiryMinutes: e.target.value })}
                label="Refresh Token Expiry Minutes"
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                />
            </Grid>
          </Grid>
        </Paper>
        <Paper variant="outlined" elevation={3} className={classes.papertwo} >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <AppTextInput
                type="number"
                label="Mobile Max Device Limit"
                value={newData.mobileMaxDeviceLimit}
                onChange={e => setNewData({ ...newData, mobileMaxDeviceLimit: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppTextInput
                type="number"
                label="Mobile Refresh Token Expiry Minutes"
                value={newData.mobileRefreshTokenExpiryMinutes}
                onChange={e => setNewData({ ...newData, mobileRefreshTokenExpiryMinutes: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppTextInput
                type="number"
                label="Mobile Token Expiry Minutes"
                value={newData.mobileTokenExpiryMinutes}
                onChange={e => setNewData({ ...newData, mobileTokenExpiryMinutes: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
              />
            </Grid>
          </Grid>
        </Paper>
        <div className={classes.flexdiv}>
          <Grid item xs={8}>
            <Linking to="/dash/policy">
              <Button>
                Discard
              </Button>
            </Linking>
          </Grid>
          {isActiveForRoles(['ORG_ADMIN']) && <Grid item xs={4}>
            <Button disabled={!isValid || saving}
              onClick={onSubmit} variant="contained" className={classes.button}
              color="primary">
              {!saving ? 'Save' : 'Saving'}
            </Button>
          </Grid>}
        </div>
        {/* </Grid> */}
      </div>
    </div>
  )
}

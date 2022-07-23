/* eslint-disable react/display-name */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { Link as Linking } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import InputAdornment from '@material-ui/core/InputAdornment'

import AppCheckbox from '../../../../../components/form/AppCheckbox';
import AppTextInput from '../../../../../components/form/AppTextInput';
import AppSelectInput from '../../../../../components/form/AppSelectInput';
import {isActiveForRoles} from '../../../../../utils/auth'
import AppSelectInputValue from '../../../../../components/form/AppSelectInputValue';

const useStyles = makeStyles(() => ({
  textField: {
    backgroundColor: '#F7F7F7',
  },
  label: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5
  },
  input: {
    height: 40
  },
  maincontainer: { display: 'flex',
    flexDirection: 'column',
    height: 400,
    overflow: 'hidden',
    flex: 1 
  },
  containerone: { 
    marginRight: 20,
    marginLeft: 10,
    borderRadius: '10px',
    flex: 1,
    overflowY: 'auto' 
  },
  paper: {
    padding: 25,
    marginBottom: 20,
    marginRight: 10,
    marginTop: 20,
    border: 'none',
    boxShadow: 'none' 
  },
  inputspan: { 
    color: '#383793',
    fontWeight: 'bold'
  },
  flex: { 
    display: 'flex' 
  },
  button: { 
    float: 'right', 
    borderRadius: '8px',
    marginRight: 20
 }
}))


export default function Form(props) {
  const classes = useStyles();
  const { newData, setNewData, onSubmit, saving, setSaving, handleTest } = props
  const [errors, _setErrors] = React.useState({})
  // const [status, setStatus] = React.useState(true)

  const drop = [
    {
      type: "ACTIVE_DIRECTORY"
    },
    {
      type: "Open LDAP"
    },
    {
      type: "Cymmetri Authentication"
    },
  ]

  const auth = [
    {
      type: "simple"
    },
  ]

  const protocol = [
    {
      type: "plain"
    },
  ]
  const change = e => setNewData({ ...newData, ...e })
  const setError = e => _setErrors({ ...errors, ...e })


  const isValid = newData.name && newData.description // && newData.id

  const checkCname = () => setError({ name: (newData.name || '').length > 1 ? null : 'Console Display name is required' })
  const checkDes = () => setError({ description: (newData.description || '').length > 1 ? null : 'Description is required' })
  // const checkID = () => setError({ id: (newData.id || '').length > 1 ? null : 'ID is required' })

  return (
    <div className={classes.maincontainer}>
      <div className={classes.containerone}>
        {/* <Grid item xs={12}> */}
        <Paper variant="outlined" elevation={3} className={classes.paper} >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <AppTextInput
                required
                value={newData.name}
                error={!!errors.name}
                onBlur={checkCname}
                helperText={errors.name}
                onChange={e => change({ name: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                label="Console Display Name" />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <AppSelectInputValue
                required
                label="Type"               
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                labels={drop.map(o => o.type)}
                value={newData.type}
                onChange={e => change({ type: e.target.value })}
                // options={drop.map(o => o.type)}
                options={["ACTIVE_DIRECTORY", "LDAP", "CYMMETRI"]}
              />
            </Grid>
            <Grid item xs={6} md={6} lg={4}>
              <AppCheckbox
                value={newData.active}
                onChange={e => change({ active: Boolean(e) })}
                switchLabel={newData.active ? 'Active' : 'Inactive'}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                label="Status" />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <AppTextInput
                required
                // multiline
                value={newData.description}
                error={!!errors.description}
                onBlur={checkDes}
                helperText={errors.description}
                onChange={e => change({ description: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                label="Description" />
            </Grid>
            {/* <Grid item xs={12} md={6} lg={4}>
              <AppSelectInput
                label="Protocol"
                value={newData.protocol} 
                onChange={e => change({ protocol: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                options={protocol.map(o => o.type)} />
            </Grid> */}
          </Grid>
        </Paper>
       {(newData && newData.type!=='CYMMETRI') && <Paper variant="outlined" elevation={3} className={classes.paper} >
          <Grid container spacing={3}>
            {/* <Grid item xs={12} md={6} lg={4}>
              <AppSelectInput
                label="Vendor"
                value={newData.vendor} onChange={e => change({ vendor: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                options={drop.map(o => o.type)} />
            </Grid> */}
            {/* <Grid item xs={12} md={6} lg={4}>
              <AppTextInput
                required
                value={newData.id}
                error={!!errors.id}
                onBlur={checkID}
                helperText={errors.id}
                onChange={e => change({ id: e.target.value })}
                label="ID" />
            </Grid> */}
            {/* <Grid item xs={12} lg={4}></Grid> */}
            {/* <Grid item xs={12} md={6} lg={4}>
              <AppTextInput
                value={newData.principalAttribute}
                placeholder="SamAccountName"
                onChange={e => change({ principalAttribute: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                label="Username LDAP Attribute" />
            </Grid> */}
            <Grid item xs={12} md={6} lg={6}>
              <div className={classes.label}>Adapter Service Domain</div>
              <TextField
                // value={newData.serverConnectionUrl}
                value={newData.adapterServiceDomain}
                className={classes.textField}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                // placeholder="ldaps://EC2AMAZ-4C9GMVI.cymmetri.in:636"
                onChange={e => change({ adapterServiceDomain: e.target.value })}
                fullWidth variant="outlined"
                InputProps={{
                  className: classes.input,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <div className={classes.label}>Adapter Service Secret</div>
              <TextField
                value={newData.adapterServiceSecret}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                // className={classes.textField}
                multiline
                rowsMax={3}
                // placeholder="ldaps://EC2AMAZ-4C9GMVI.cymmetri.in:636"
                onChange={e => change({ adapterServiceSecret: e.target.value })}
                fullWidth
                variant="outlined"
                // InputProps={{
                //   className: classes.input,
                // }}
              />
            </Grid>
          </Grid>
        </Paper>}
        {/* <Paper variant="outlined" elevation={3} className={classes.paper} >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <AppTextInput
                value={newData.bindUser}
                placeholder="test1@cymmetri.in"
                onChange={e => change({ bindUser: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                label="Users DN" />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <AppSelectInput
                label="Authentication Type"
                value={newData.authentication} 
                onChange={e => change({ authentication: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                options={auth.map(o => o.type)} />
            </Grid>
            <Grid item xs={12} lg={4}></Grid>
            <Grid item xs={12} md={6} lg={4}>
              <AppTextInput
                value={newData.baseDN}
                placeholder="DC=cymmetri,DC=in"
                onChange={e => change({ baseDN: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                label="Bind DN" />
            </Grid>
            <Grid item xs={6} md={6} lg={4}>
              <div className={classes.label}>Bind Credential</div>
              <TextField
                placeholder="Underw0rlD1"
                value={newData.bindPassword}
                className={classes.textField}
                onChange={e => change({ bindPassword: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                fullWidth variant="outlined"
                InputProps={{
                  className: classes.input,
                  endAdornment: (
                    <InputAdornment position="end" onClick={handleTest} disablePointerEvents={!isActiveForRoles(['ORG_ADMIN'])}>
                      <span className={classes.inputspan}>Test Authentication</span>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
        </Paper> */}
        {(newData && newData.type!=='CYMMETRI')&& <Paper variant="outlined" elevation={3} className={classes.paper} >
          <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
              <AppTextInput
                value={newData.baseDN}
                placeholder="DC=cymmetri,DC=in"
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                onChange={e => change({ baseDN: e.target.value })}
                label="Base DN" />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <AppTextInput
                placeholder="(&(objectClass=user)(SamAccountName=?))"
                value={newData.searchFilter}
                onChange={e => change({ searchFilter: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                label="Search Scope" />
            </Grid>
            {/* <Grid item xs={6} md={6} lg={4}>
              <AppCheckbox
                value={newData.isConnectionPooled} onChange={e => change({ isConnectionPooled: Boolean(e) })}
                switchLabel={newData.isConnectionPooled ? 'Enabled' : 'Disabled'}
                label="Connection Pooling" />
            </Grid> */}
          </Grid>
        </Paper>}
        {/* </Grid> */}
        {/* <Grid item xs={12}> */}
        {/* <Paper variant="outlined" elevation={3} className={classes.paper} >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <AppTextInput
                value={newData.connectionTimeout}
                type="number"
                min={0}
                onChange={e => change({ connectionTimeout: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                label="Connection Timeout" />
            </Grid> */}
            {/* <Grid item xs={6} md={6} lg={4}>
              <AppCheckbox
                value={newData.maxConnectionPooled} onChange={e => change({ maxConnectionPooled: Boolean(e) })}
                switchLabel={newData.maxConnectionPooled ? 'Enabled' : 'Disabled'}
                label="Max Connection Pooling" />
            </Grid>
            <Grid item xs={6} md={6} lg={4}>
              <AppCheckbox
                value={newData.minConnectionPooled} onChange={e => change({ minConnectionPooled: Boolean(e) })}
                switchLabel={newData.minConnectionPooled ? 'Enabled' : 'Disabled'}
                label="Min Connection Pooling" />
            </Grid> */}
          {/* </Grid>
        </Paper> */}
        <div className={classes.flex}>
          <Grid item xs={8}>
            <Linking to="/dash/admin/idp">
              <Button>
                Discard
            </Button>
            </Linking>
          </Grid>
          {isActiveForRoles(['ORG_ADMIN']) && <Grid item xs={4}>
            <Button disabled={!isValid || saving}
              onClick={() => {setSaving(false);onSubmit()}} variant="contained" className={classes.button}
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

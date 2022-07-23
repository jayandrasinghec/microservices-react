/* eslint-disable react/display-name */
import React from 'react';
import { Link as Linking } from '../../../../administartion/submodules/ListIDP/node_modules/react-router-dom'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import { callApi } from '../../../../../../utils/api'
import { showSuccess } from '../../../../../../utils/notifications'
import AppCheckbox from '../../../../../../components/form/AppCheckbox';
import AppTextInput from '../../../../../../components/form/AppTextInput';
import AppSelectInput from '../../../../../../components/form/AppSelectInput';
import { makeStyles } from '@material-ui/core/styles';

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
  paper: {
    padding: 25,
    marginBottom: 20,
    marginTop: 20,
    border: 'none',
    boxShadow: 'none'
  },
  span: {
    marginBottom: 15
  },
  divtwo: {
    margin: '10px 10px'
  },
  divthree: {
    display: 'flex',
    margin: 10
  },
  flexdiv: {
    display: 'flex',
  },
  button: {
    float: 'right',
    borderRadius: '8px',
    marginRight: 20
  },
}))


const defaultData = {
  // "name":"password policy name2",
  // "description":"description",
  "isDefault": true,
  "active": false
}

export default function Global(props) {

  const [newData, setNewData] = React.useState(defaultData)
  const [errors, _setErrors] = React.useState({})
  const [saving, setSaving] = React.useState(false)
  const classes = useStyles()
  const drop = [
    {
      type: "Select 1"
    },
    {
      type: "Select 2"
    },
    {
      type: "Select 3"
    },
  ]

  const change = e => setNewData({ ...newData, ...e })
  const setError = e => _setErrors({ ...errors, ...e })

  const onSubmit = () => {
    setSaving(true)
    callApi(`/authsrvc/passwordPolicy/createPolicy`, 'POST', newData)
      .then(e => {

        setSaving(false)
        if (e.success) {

          showSuccess('Policy Created Successfully!')
          props.history.push(`/dash/policy/password`)
        }
      })
      .catch(setSaving(false))
  }

  const isValid = newData.name && newData.description

  const checkCname = () => setError({ name: (newData.name || '').length > 1 ? null : 'Policy name is required' })
  const checkDes = () => setError({ description: (newData.description || '').length > 1 ? null : 'Description is required' })

  return (
    <div className={classes.container}>
    <div className={classes.divone}>
      {/* <Grid item xs={12}> */}
        <Paper variant="outlined" elevation={3} className={classes.paper} >
        <Grid container spacing={3}>
            <Grid item xs={12} md={4} lg={5}>
              <AppTextInput
                required
                value={newData.name}
                error={!!errors.name}
                onBlur={checkCname}
                helperText={errors.name}
                onChange={e => change({ name: e.target.value })}
                label="Policy Name" />
            </Grid>
            <Grid item xs={12} md={4} lg={5}>
              <AppTextInput
                required
                value={newData.description}
                error={!!errors.description}
                onBlur={checkDes}
                helperText={errors.description}
                onChange={e => change({ description: e.target.value })}
                label="Description" />
            </Grid>
            <Grid item xs={6} md={2} lg={2}>
              <AppCheckbox
              value={newData.active} onChange={e => change({ active: Boolean(e) })}
              switchLabel={newData.active ? 'Active' : 'Inactive'}
              label="Status" />
            </Grid>
            {/* <Grid item xs={6} md={2} lg={1}>
              <img src={Delete} style={{ alignItems: 'center', marginTop: 30, cursor: 'pointer' }} />
            </Grid> */}
          </Grid>
        </Paper>
      {/* </Grid> */}
      <Paper variant="outlined" elevation={3} className={classes.paper} >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className={classes.divgrid}>Password Policy Composition ?</div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="custom-checkbox" style={{ display: 'flex' }}>
              <input type="checkbox" name={1} id={1} /> <label htmlFor={1} />
              <span>Automatically login when the user lands on login page</span>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="custom-checkbox" style={{ display: 'flex' }}>
              <input type="checkbox" name={1} id={1} /> <label htmlFor={1} />
              <span className={classes.span}>Password Type</span>
            </div>
            <AppSelectInput
              label=""
              options={drop.map(o => o.type)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="custom-checkbox" style={{ display: 'flex' }}>
              <input type="checkbox" name={1} id={1} /> <label htmlFor={1} />
              <span>Limit the repetion of same character</span>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="custom-checkbox" style={{ display: 'flex' }}>
              <input type="checkbox" name={1} id={1} /> <label htmlFor={1} />
              <span>Lowercase characteristics (min - max)</span>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="custom-checkbox" style={{ display: 'flex' }}>
              <input type="checkbox" name={1} id={1} /> <label htmlFor={1} />
              <span>Minimum number of words in the phrase</span>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="custom-checkbox" style={{ display: 'flex' }}>
              <input type="checkbox" name={1} id={1} /> <label htmlFor={1} />
              <span>Non- alpha numeric symbols (min - max)</span>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="custom-checkbox" style={{ display: 'flex' }}>
              <input type="checkbox" name={1} id={1} /> <label htmlFor={1} />
              <span className={classes.span}>Numeric characteristics (min - max) amount</span>
            </div>
            <div className={classes.flexdiv}>
              <div className={classes.divtwo}>From</div>
              <AppSelectInput
                label=""
                options={drop.map(o => o.type)} />
              <div className={classes.divtwo}>To</div>
              <AppSelectInput
                label=""
                options={drop.map(o => o.type)} />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="custom-checkbox" style={{ display: 'flex' }}>
              <input type="checkbox" name={1} id={1} /> <label htmlFor={1} />
              <span className={classes.span}>Sword history versions</span>
            </div>
            <div className={classes.flexdiv}>
              <div className={classes.divtwo}>Version</div>
              <AppTextInput
                label=""
                defaultValue="6" />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="custom-checkbox" style={{ display: 'flex' }}>
              <input type="checkbox" name={1} id={1} /> <label htmlFor={1} />
              <span>Password Equals Password</span>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="custom-checkbox" style={{ display: 'flex' }}>
              <input type="checkbox" name={1} id={1} /> <label htmlFor={1} />
              <span className={classes.span}>Password Length</span>
            </div>
            <div className={classes.flexdiv}>
              <div className={classes.divtwo}>From</div>
              <AppSelectInput
                label=""
                options={drop.map(o => o.type)} />
              <div className={classes.divtwo}>To</div>
              <AppSelectInput
                label=""
                options={drop.map(o => o.type)} />
            </div>
            <div className="custom-checkbox" style={{ display: 'flex', margin: 20 }}>
              <input type="checkbox" name={1} id={1} /> <label htmlFor={1} />
              <span className={classes.span}>Password which equals to LoginID</span>
            </div>
            <div className="custom-checkbox" style={{ display: 'flex', margin: 20 }}>
              <input type="checkbox" name={1} id={1} /> <label htmlFor={1} />
              <span className={classes.span}>Reject password which equals to First or Last name</span>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="custom-checkbox" style={{ display: 'flex' }}>
              <input type="checkbox" name={1} id={1} /> <label htmlFor={1} />
              <span className={classes.span}>Characters are not allowed in the password</span>
            </div>
            <div className={classes.divthree}>
              <AppTextInput
                label=""
                defaultValue="<>" />
            </div>
            <div className="custom-checkbox" style={{ display: 'flex', margin: 20 }}>
              <input type="checkbox" name={1} id={1} /> <label htmlFor={1} />
              <span className={classes.span}>Words are not allowed in a password</span>
            </div>
            <div className="custom-checkbox" style={{ display: 'flex', margin: 20 }}>
              <input type="checkbox" name={1} id={1} /> <label htmlFor={1} />
              <span className={classes.span}>Repetitions of same words in the phrase</span>
            </div>
          </Grid>
          <Grid item xs={12} md={12}>
            <div className="custom-checkbox" style={{ display: 'flex' }}>
              <input type="checkbox" name={1} id={1} /> <label htmlFor={1} />
              <span>Uppercase characters ( min - max ) amount</span>
            </div>
          </Grid>
        </Grid>
      </Paper>
      {/* <Grid item xs={12}> */}
        <div className={classes.flexdiv}>
        <Grid item xs={8}>
          <Linking to="/dash/policy">
          <Button>
            Discard
          </Button>
          </Linking>
        </Grid>
        <Grid item xs={4}>
          <Button disabled={!isValid || saving}
            onClick={onSubmit} variant="contained" className={classes.button}
            color="primary">
            {!saving ? 'Save' : 'Saving'}
          </Button>
        </Grid>
        </div>
      {/* </Grid> */}
    </div>
  </div>
  )
}



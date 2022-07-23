import React from 'react'
import jwt from 'jsonwebtoken'
import {Link, useHistory} from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import InputAdornment from '@material-ui/core/InputAdornment'
import {IconButton} from '@material-ui/core';

import VpnKeyIcon from '@material-ui/icons/VpnKey'
import VisibilityIcon from '@material-ui/icons/Visibility'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import MaterialDesignIcon from '@mdi/react'
import { mdiGoogle, mdiFacebook } from '@mdi/js'
import { callLoginApi, callApi, callMasterApi, getTenant } from '../../utils/api'
import { encrypt } from '../../utils/encrypt'
import { decideToken } from './_decide'
import { makeStyles } from '@material-ui/core/styles';
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

const useStyles = makeStyles(() => ({
  marginzero: {
    margin: 0 ,
  },
  iconcolor: {
    color: '#ddd'
  },
  griditemone: {
    padding: 0 ,
    display: 'flex',
    alignItems: 'center'
  },
  span: {
    color: '#A0A0A0',
    fontSize: 14
  },
  griditemtwo: {
    paddingTop: 0
  },
  button: {
    marginTop: 10 ,
    float: 'right'
  },
  pone: {
    color: '#363793',
    paddingTop: '5px',
    fontSize: 14
  },
  ptwo: {
    color: '#363793',
    paddingTop: '5px',
    fontSize: 14 ,
    textAlign: 'right'
  },
}))

const defaultFormValues = {
  login: '',
}

export default function Login(props) {
  const [agree, setAgree] = React.useState(false)
  const history = useHistory()
  const handleChange = (event) => setAgree(event.target.checked)
  const [form, _setForm] = React.useState(defaultFormValues)
  const [errors, _setErrors] = React.useState({})
  const [isLoading, setLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const classes = useStyles()
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const setForm = e => _setForm({ ...form, ...e })
  const setError = e => _setErrors({ ...errors, ...e })

  const checkEmail = () => setError({ email: (form.login || '') ? null : 'Please enter a valid login id' })
  const isValid = !Object.values(errors).some(e => e != null) && form.login


  const submitRegistrationForm = () => {
    setLoading(true)

    const data = {
      principal: form.login,
      tenant: getTenant()
    }

    // history.push(`/auth/login/password-mail?login=${form.login}`)
    callMasterApi(`/authsrvc/forgotPassword/pub/emailPasswordResetLink`, 'POST', data)
      .then( e => {
        setLoading(false)
        if (e.success) {
          props.history.push(`/auth/login/password-mail?login=${form.login}`)
          // decideToken(props, e.data.token, e.data.refreshToken)
        }
      })
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
  }

  const onKeyD = (event) => {
    if (event.key === 'Enter' && isValid) {
      event.preventDefault();
      event.stopPropagation();
      submitRegistrationForm();
    }
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h2 className={classes.marginzero}>Forgot Password</h2>
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={form.login}
            error={!!errors.login}
            onBlur={checkEmail}
            helperText={errors.login}
            onKeyDown={(e) => onKeyD(e)}
            onChange={e => setForm({ login: e.target.value })}
            onKeyDown={(e) => onKeyD(e)}
            className="text-field" id="email" label="Username or Login"
            variant="outlined" placeholder="abcd1234" fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon className={classes.iconcolor} />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} className={classes.griditemtwo}>
          <Button
            variant="contained"
            className={classes.button}
            color="primary" onClick={submitRegistrationForm}
            disabled={!isValid || isLoading}>{!isLoading ? 'Next' : 'Loading...'}</Button>
        </Grid>
      </Grid>
    </div>
  )
}
import React from 'react'
import jwt from 'jsonwebtoken'
import {Link} from 'react-router-dom'
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
import { callLoginApi, callApi } from '../../utils/api'
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
  password: ''
  // tenantid: "cryptocontrol1",
}

export default function Login(props) {
  const [agree, setAgree] = React.useState(false)
  const handleChange = (event) => setAgree(event.target.checked)
  const [form, _setForm] = React.useState(defaultFormValues)
  const [errors, _setErrors] = React.useState({})
  const [isLoading, setLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const classes = useStyles()
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const submitRegistrationForm = async () => {

    let data = {
      ...form,
      password: encrypt(form.login, form.password),
    }

    const neoeyed = window.neoEYED.dumpBehavior("login", form.login);
    setLoading(true)

    if ( neoeyed ) data = { ...data, behavior: neoeyed }

    await localStorage.setItem('user', form.login)
    callLoginApi(`/authsrvc/auth/token`, 'POST', data)
      .then(async e => {
        setLoading(false)
        if (e.success) decideToken(props, e.data.token, e.data.refreshToken)
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

  const setForm = e => _setForm({ ...form, ...e })
  const setError = e => _setErrors({ ...errors, ...e })

  const checkPass = () => setError({ password: (form.password || '') ? null : 'Password is required/invalid' })
  const checkEmail = () => setError({ email: (form.login || '') ? null : 'Please enter a valid email/username' })
  const isValid = !Object.values(errors).some(e => e != null) && form.login && form.password

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h2 className={classes.marginzero}>Sign In</h2>
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={form.login}
            error={!!errors.login}
            onBlur={checkEmail}
            helperText={errors.login}
            onChange={e => setForm({ login: e.target.value })}
            className="text-field" id="email" label="Username"
            variant="outlined" placeholder="jon@mail.com" fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon className={classes.iconcolor} />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            value={form.password}
            error={!!errors.password}
            onBlur={checkPass}
            helperText={errors.password}
            onKeyDown={(e) => onKeyD(e)}
            onChange={e => setForm({ password: e.target.value })}
            // onKeyDown={submitRegistrationForm}
            onKeyDown={(e) => onKeyD(e) }
            className="text-field" id="password" label="Password"
            variant="outlined" placeholder="Password" fullWidth
            type={showPassword ? "text" : "password"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyIcon className={classes.iconcolor} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityIcon className={classes.iconcolor}/> : <VisibilityOffIcon className={classes.iconcolor}/>}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={6} className={classes.griditemone}>
          <Checkbox
            checked={agree}
            onChange={handleChange}
            defaultChecked
            color="primary"
            inputProps={{ 'aria-label': 'secondary checkbox' }} />
          <span className={classes.span}>Remember me</span>
        </Grid>
        <Grid item xs={6} className={classes.griditemtwo}>
          <Button
            variant="contained"
            className={classes.button}
            color="primary" onClick={submitRegistrationForm}
            disabled={!isValid || isLoading}>{!isLoading ? 'Login' : 'Loading...'}</Button>
        </Grid>
        <Grid item xs={6} className={classes.griditemtwo}>
          <p className={classes.pone}>
            Need login help?
          </p>
        </Grid>
        <Grid item xs={6} className={classes.griditemtwo}>
          <Link to='/auth/login/forgot-password'>
            <p className={classes.ptwo}>
              Forgot password?
            </p>
          </Link>
        </Grid>
      </Grid>
    </div>
  )
}
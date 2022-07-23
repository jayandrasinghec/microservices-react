import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { callApi, callMasterApi } from '../../utils/api'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import validator from 'validator'
import { showSuccess } from '../../utils/notifications';
import { encrypt } from '../../utils/encrypt';

export default function SignUpPassword (props) {
  const [form, _setForm] = React.useState({
    token: props.match.params.token,
  })

  const [errors, _setErrors] = React.useState({})
  const [isLoading, setLoading] = React.useState(false)
  const [verify, setVerify] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  const setForm = e => _setForm({ ...form, ...e })
  const setError = e => _setErrors({ ...errors, ...e })

  const validatePassword = pass => {
    return pass.length > 8 && !!pass.match(/[A-Z]/) && !!pass.match(/[a-z]/)
      && !!pass.match(/[0-9]/)
  }

  const checkPass = () => setError({ password: validatePassword(form.password || '') ? null : 'Password is required/invalid' })
  const checkCPass = () => setError({ confirmPassword: validatePassword(form.confirmPassword || '') && form.password === form.confirmPassword ? null : 'Password should be the same' })
  const checkEmail = () => setError({ login: validator.isAlphanumeric(form.login || '') ? null : 'LoginID is required and it should be AlphaNumeric' })
  const isValid = !Object.values(errors).some(e => e != null) && validatePassword(form.password || '') && validatePassword(form.confirmPassword || '') && form.password === form.confirmPassword && verify


  const verifyToken = () => {
    callApi(`/regsrvc/confirm-account?token=${form.token}`, 'GET')
      .then(e => {
        if (e.success) {
        showSuccess('User Verification by Email Succesfully','MAILSENT')
        setVerify(true)
      }})
  }

  React.useEffect(() => verifyToken(), [])

  const submitRegistrationForm = () => {
    if (!isValid) return
    const data = {
      ...form,
      password: encrypt(form.login, form.password),
      confirmPassword: encrypt(form.login, form.confirmPassword)
    }
    setLoading(true)
    callMasterApi(`/regsrvc/completeSignUp`, 'POST', data)
      .then(e => {
        setLoading(false)
        if (e.success) props.history.push(`/auth/login`)
      })
      .catch(() => {
        alert('Server Error')
        setLoading(false)
      })
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
      <h2 style={{ margin: 0 }}>Setup password</h2>
      <p className="small_text" >Password requires atleast 8 characters, a lowercase character, an
      uppercase character, a number, no parts of your username. <br /><br />
      Your password cannot be any of your last 4 passwords.</p>

      <TextField
        error={!!errors.login}
        onBlur={checkEmail}
        onChange={e => setForm({ login: e.target.value })}
        helperText={errors.login}
        style={{ marginTop: 15 }}
        className="text-field" id="email" label="Login ID" placeholder="Login ID"
        variant="outlined" fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircleIcon style={{ color: '#ddd' }} />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        error={!!errors.password}
        onBlur={checkPass}
        helperText={errors.password}
        type="password"
        style={{ marginTop: 15 }}
        onChange={e => setForm({ password: e.target.value })}
        className="text-field" id="password" label="Create Password" placeholder="Create Password"
        variant="outlined" fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <VpnKeyIcon style={{ color: '#ddd' }} />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        error={!!errors.confirmPassword}
        onBlur={checkCPass}
        onChange={e => setForm({ confirmPassword: e.target.value })}
        helperText={errors.confirmPassword}
        onKeyDown={(e) => onKeyD(e)}
        type="password"
        style={{ marginTop: 15 }}
        onKeyDown={(e) => onKeyD(e) }
        className="text-field" id="password" label="Repeat Password" placeholder="Repeat Password"
        variant="outlined" fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <VpnKeyIcon style={{ color: '#ddd' }} />
            </InputAdornment>
          ),
        }}
      />
      <Button
        variant="contained"
        style={{ marginTop: 10 }}
        color="primary" onClick={submitRegistrationForm}
        disabled={!isValid || isLoading}>{ !verify ? 'Contact Administrator' : (!isLoading ? 'Finish' : 'Loading...')}</Button>
    </div>

  )
}
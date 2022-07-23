import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { callApi } from '../../utils/api'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import { decideToken } from './_decide'
import { encrypt } from '../../utils/encrypt';
import { getAuthToken } from '../../utils/auth';


export default function SignUpPasswordReset (props) {
  const [form, _setForm] = React.useState({})

  const [errors, _setErrors] = React.useState({})
  const [isLoading, setLoading] = React.useState(false)

  const setForm = e => _setForm({ ...form, ...e })
  const setError = e => _setErrors({ ...errors, ...e })

  const validatePassword = pass => {
    return pass.length > 8 && !!pass.match(/[A-Z]/) && !!pass.match(/[a-z]/)
      && !!pass.match(/[0-9]/)
  }

  const checkPass = () => setError({ oldPassword: form.oldPassword ? null : 'Password is required/invalid' })
  const checkCPass = () => setError({ newPassword: validatePassword(form.newPassword || '') && form.oldPassword !== form.newPassword ? null : 'Password is required/invalid' })
  const checkCNPass = () => setError({ confirmPassword: validatePassword(form.confirmPassword || '') && form.newPassword === form.confirmPassword ? null : 'Password should be the same' })

  const isValid = !Object.values(errors).some(e => e != null) &&
    validatePassword(form.newPassword || '') && form.oldPassword && validatePassword(form.confirmPassword || '') &&
    form.oldPassword !== form.newPassword && form.newPassword === form.confirmPassword

  const submitRegistrationForm = async () => {
    // if (!isValid) return
    const data = {
      newPassword: encrypt(localStorage.getItem('user'), form.newPassword),
      currentPassword: encrypt(localStorage.getItem('user'), form.oldPassword),
      userId: localStorage.getItem('user')
    }

    setLoading(true)

    const token = getAuthToken()

    return callApi(`/authsrvc/auth/loginFlow`, 'POST', data, token)
      .then(e => {
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

  return (
    <div>
      <h2 style={{ margin: 0 }}>Reset password</h2>
      <p className="small_text" >Password requires atleast 8 characters, a lowercase character, an
      uppercase character, a number, no parts of your username. <br /><br />
      Your password cannot be any of your last 4 passwords.</p>

      <TextField
        error={!!errors.oldPassword}
        onBlur={checkPass}
        helperText={errors.oldPassword}
        type="password"
        style={{ marginTop: 105 }}
        onChange={e => setForm({ oldPassword: e.target.value })}
        className="text-field" id="password" label="Current Password" placeholder="Current Password"
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
        error={!!errors.newPassword}
        onBlur={checkCPass}
        onChange={e => setForm({ newPassword: e.target.value })}
        helperText={errors.newPassword}
        type="password"
        style={{ marginTop: 15 }}
        className="text-field" id="password" label="New Password" placeholder="New Password"
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
        onBlur={checkCNPass}
        onChange={e => setForm({ confirmPassword: e.target.value })}
        helperText={errors.confirmPassword}
        type="password"
        onKeyDown={(e) => onKeyD(e)}
        style={{ marginTop: 15 }}
        onKeyDown={(e) => onKeyD(e) }
        className="text-field" id="password" label="Confirm Password" placeholder="Confirm Password"
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
        disabled={!isValid || isLoading}>{ (!isLoading ? 'Reset Password' : 'Loading...')}</Button>
    </div>

  )
}
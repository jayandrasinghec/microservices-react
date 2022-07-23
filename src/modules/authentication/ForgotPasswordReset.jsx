import React from 'react'
import jwt from 'jsonwebtoken'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import { callApi, getTenant } from '../../utils/api'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import { decideToken } from './_decide'
import { encrypt } from '../../utils/encrypt';
import { showSuccess } from '../../utils/notifications';
import { getAuthToken } from '../../utils/auth';


export default function SignUpPasswordReset (props) {
  const [form, _setForm] = React.useState({})
  const [errors, _setErrors] = React.useState({})
  const [isLoading, setLoading] = React.useState(false)
  const token = props.match.params.token

  const jwtPayload = jwt.decode(token)

  if (!token) {
    setLoading(true)
  }

  const setForm = e => _setForm({ ...form, ...e })
  const setError = e => _setErrors({ ...errors, ...e })

  const validatePassword = pass => {
    return pass.length > 8 && !!pass.match(/[A-Z]/) && !!pass.match(/[a-z]/)
      && !!pass.match(/[0-9]/)
  }

  const checkPass = () => setError({ newPassword: validatePassword(form.newPassword || '') ? null : 'Password is required/invalid' })
  const checkCPass = () => setError({ confirmPassword: validatePassword(form.confirmPassword || '') && form.newPassword === form.confirmPassword ? null : 'Password should be the same' })


  const isValid = !Object.values(errors).some(e => e != null) &&
    validatePassword(form.newPassword || '') && validatePassword(form.confirmPassword || '') && form.newPassword === form.confirmPassword

  const submitRegistrationForm = async () => {
    const data = {
      password: encrypt(jwtPayload.sub, form.newPassword),
    }

    setLoading(true)
    return callApi(`/authsrvc/forgotPassword/setNewPassword`, 'POST', data, token)
      .then(e => {
        setLoading(false)
        if (e.success) {
          showSuccess('Password Updated Succesfully, Login Again!','PASSWORDUPDATED')
          props.history.push('/auth')
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

  if(token && jwtPayload && jwtPayload.sub && jwtPayload.tenantId && jwtPayload.tenantId === getTenant()){
    return (
      <div>
        <span> {token && jwtPayload && jwtPayload.sub && jwtPayload.tenantId && jwtPayload.tenantId === getTenant() ? null : 'Link expired / Invalid Link'} </span>
        <h2 style={{ margin: 0 }}>Reset password</h2>
        <p className="small_text" >Password requires atleast 8 characters, a lowercase character, an
        uppercase character, a number, no parts of your username. <br /><br />
        Your password cannot be any of your last 4 passwords.</p>

        <TextField
          type="text"
          style={{ marginTop: '5vh' }}
          className="text-field" id="password" label="Login ID"
          value={jwtPayload.sub}
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
          onBlur={checkPass}
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
          onBlur={checkCPass}
          onChange={e => setForm({ confirmPassword: e.target.value })}
          helperText={errors.confirmPassword}
          onKeyDown={(e) => onKeyD(e)}
          type="password"
          style={{ marginTop: 15 }}
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
  }else{
    return(
      <h2 style={{ margin: 0 }}>Invalid Link / Link Expired</h2>
    )
  }

}
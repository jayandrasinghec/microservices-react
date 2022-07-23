import React from 'react'
import jwt from 'jsonwebtoken'
import { callApi } from '../../utils/api'
import { TextField } from '@material-ui/core'
import { decideToken } from './_decide'
import Button from '@material-ui/core/Button';
import validator from 'validator'
import { getAuthToken } from '../../utils/auth'
// import OtpInput from 'react-otp-input';

// const defaultOtp = {
//   Otp:''
// }

export default function SignUpTY(props) {
  const [value, setValue] = React.useState('')

  const [token, setToken] = React.useState('')
  const type = React.useState(props.match.params.id)
  const body = type[0] === 'cymmetri' ? 'totpAuthentication' : 'googleAuthentication'
  const [saving, setSaving] = React.useState(false)
  // const [newOtp, setNewOtp] = React.useState(defaultOtp)
  const [errors, _setErrors] = React.useState({})

  const getQRCode = async () => {
    const token = getAuthToken()
    callApi(`/mfasrvc/${body}/generateQrCode`, 'POST', {}, token)
      .then(e => {
        if (e.success) setToken(e.data.totpSecretQrCode)
      })
  }

  React.useEffect(() => { getQRCode() }, [])

  const change = val => {
    setValue(val)
  }

  // const change = e => {setNewOtp({ ...newOtp, ...e })
  // }

  const setError = e => _setErrors({ ...errors, ...e })

  const checkOtp = () => setError({ Otp: validator.isNumeric(value) ? null : 'OTP is Invalid' })

  const isValid = value && !errors.Otp

  const checkTOTP = async () => {
    setSaving(true)
    const token = getAuthToken()
    const jwtPayload = jwt.decode(token)

    const flow = (jwtPayload.roles.length > 0 && jwtPayload.roles.indexOf('PRE_MFA') >= 0) ? "mfaFlow" : "loginFlow"

    return callApi(`/authsrvc/auth/${flow}`, 'POST', { otp: value }, token)
      .then(e => {
        setSaving(false)
        if (e.success) decideToken(props, e.data.token, e.data.refreshToken)
      })
      .catch(() => setSaving(false))
  }

  // const change = val => {
  //   setValue(val)
  // }

  const onKeyD = (event) => {
    if (event.key === 'Enter' && isValid) {
      event.preventDefault();
      event.stopPropagation();
      checkTOTP();
    }
  }

  return (
    <div style={{ textAlign: 'center', alignItems: 'center' }}>
      <h2 style={{margin:'0px 0px 10px 0px',}}>Authorize your mobile app</h2>
      <p className="medium_text" style={{ marginBottom: '0px', textAlign: 'center' }}>Launch your authenticator application on your mobile, select add account and scan the below QR code to authorize your mobile app</p>
      <div>
         {/* <QR value={token} size={240} /> */}
                <img
          alt="qr code"
          src={token} style={{
          width: '240px',
          height: '240px',
        }} />
      <p className="medium_text" style={{ marginBottom: '10px' }}>Enter the access code that displayed on your authenticator app.</p>
      {/* <div style={{ marginBottom: '10px',display:'flex', justifyContent:'center',}}>
        <OtpInput
          value={value}
          onChange={change}
          numInputs={6}
          inputStyle={ipstyle}
          separator={<span>-</span>}
        />
      </div> */}
      <TextField className="text-field" id="bookmark" value={value} type="number"
        onChange={(e) => change(e.target.value)}
        onBlur={checkOtp}
        helperText={errors.Otp}
        error={errors.Otp}
        onKeyDown={(e) => onKeyD(e)}
        // min={0}
        // onChange={(e) => change(e.target.value)}
        variant="outlined" fullWidth placeholder="Enter Access Code" style={{ marginBottom: '20px' }} InputProps={{
          startAdornment: (
            <div>
              {/* <InputAdornment position="start">
                <img src={VerifyKey} />
              </InputAdornment>
              <Divider orientation="vertical" flexItem /> */}
            </div>
          ),
        }} />

        <Button
        disabled={!isValid || saving }
        onClick={checkTOTP} variant="contained"
        style={{ float: 'right', borderRadius: '8px', }}
        color="primary"
        >{!saving ? 'Verify' : 'Verifying'}</Button>
      </div>
    </div>
  )
}
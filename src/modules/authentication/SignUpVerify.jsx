import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider'
import InputAdornment from '@material-ui/core/InputAdornment';
import VerifyKey from '../../assets/VerifyKey.png'
import { callApi } from '../../utils/api';
import { decideToken } from './_decide'
import validator from 'validator'
// import OtpInput from 'react-otp-input';

const defaultOtp = {
  Otp: ''
}
export default function SignUpTY(props) {
  const [value, setValue] = React.useState()
  const [saving, setSaving] = React.useState(false)
  const [newOtp, setNewOtp] = React.useState(defaultOtp)
  const [errors, _setErrors] = React.useState({})

  const change = e => setNewOtp({ ...newOtp, ...e })
  const setError = e => _setErrors({ ...errors, ...e })
  const isValid = newOtp.Otp
  const checkOtp = () => setError({ Otp: validator.isNumeric(newOtp.Otp) ? null : 'OTP is Invalid' })

  const checkTOTP = async () => {
    setSaving(true)
    return callApi(`/authsrvc/auth/loginFlow`, 'POST', {
      mfaType: props.match.params.id,
      otp: newOtp.Otp
    })
      .then(e => {
        setSaving(false)
        if (e.success) decideToken(props, e.data.token, e.data.refreshToken)
      })
      .catch(() => setSaving(false))
  }

  // const change = val => {
  //   setValue(val)
  //   console.log(val)
  // }

  React.useEffect(() => {
    if (props.match.params.id === 'SMSAuthenticator') {
      callApi('/authsrvc/auth/sendSmsOtp', 'POST', {
        // mobileNo: "+919819254358",
        reSend: false
      })
    }
  }, [])

  let text = 'Enter the access code that displayed on your authenticator app.'
  if (props.match.params.id === 'SMSAuthenticator') {
    text = 'Enter the access code that was sent to your registered number.'
  }

  const onKeyD = (event) => {
    if (event.key === 'Enter' && isValid) {
      event.preventDefault();
      event.stopPropagation();
      checkTOTP();
    }
  }

  return (
    <div>
      <h2>Verify</h2>
      <p className="medium_text" style={{ marginBottom: '50px' }}>{text}</p>
      {/* <div style={{ marginBottom: '30px', marginRight:'30px', display:'flex', justifyContent:'center',}}>
        <OtpInput
          value={value}
          onChange={change}
          numInputs={6}
          inputStyle={ipstyle}
          separator={<span>-</span>}
        />
      </div> */}
      <TextField className="text-field" id="bookmark" value={newOtp.Otp}
        onChange={(e) => change({ Otp: e.target.value })}
        onBlur={checkOtp}
        helperText={errors.Otp}
        error={!!errors.Otp}
        onKeyDown={(e) => onKeyD(e)}
        // numInputs={6}
        // min={0}
        // max={999999}
        variant="outlined" fullWidth placeholder="Enter Access Code" style={{ marginBottom: '30px' }} InputProps={{
          startAdornment: (
            <div>
              {/* <InputAdornment position="start">
                <img src={VerifyKey} />
              </InputAdornment>
              <Divider orientation="vertical" flexItem /> */}
            </div>
          ),
        }} />

      <Button disabled={!isValid || saving} onClick={checkTOTP}
        variant="contained"
        color="primary"
        style={{ float: 'right', borderRadius: '8px', marginTop: '20px', }}>
        {!saving ? 'Verify' : 'Verifying'}
      </Button>
    </div>
  )
}
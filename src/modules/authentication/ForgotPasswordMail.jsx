import React from 'react'
import ThanksYouLogo from '../../assets/ThanksYouLogo.png'
import { getQueryString } from '../../utils/url'

export default function SignUpTY(props) {
  const login = getQueryString(props.location, 'login')

  return (
    <div style={{ textAlign: 'center', }}>
      <img src={ThanksYouLogo} style={{ width: '64px', height: '64px' }} />

      <h6>A forgot password email has been sent to email registered with the account having LoginId {login}, follow the link in
        email to reset your password</h6>
      <p style={{ color: '#8392A7' }} className="medium_text">Did not receive the mail yet? check your spam</p>
    </div>
  )
}
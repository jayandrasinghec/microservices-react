import React from 'react'
import { Link } from 'react-router-dom';
// import Grid from '@material-ui/core/Grid'
// import Paper from '@material-ui/core/Paper';

// import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
// import LogoCCIO from '../../assets/LogoCCIO.png'
import LogGAuth from '../../assets/google-authenticator.png'
import LogoSMS from '../../assets/sms.png'
import LogoSecretQ from '../../assets/faq.png'
import { callApi } from '../../utils/api';
import LogoNoSpace from '../../FrontendDesigns/master-screen-settings/assets/img/icons/logo-nospace.svg'
import '../../FrontendDesigns/master-screen-settings/assets/css/main.css'
import '../../FrontendDesigns/master-screen-settings/assets/css/nice-select.css'
import '../../FrontendDesigns/master-screen-settings/assets/css/react-sign-up.css'

export default function SignUpAuth() {
  const [mfa, setMFA] = React.useState([])
  const [link, setLink] = React.useState()

  const verifyToken = () => {
    callApi(`/authsrvc/auth/registeredFactorsByRule`, 'GET')
      .then(e => {
        if (e.success) {
          // showSuccess('User Verification by Email Succesfully')
          // setVerify(true)
          setMFA(e.data)

        }
      })
  }

  React.useEffect(() => { verifyToken() }, [])

  // mfa.map(m => {
  //   {m === 'SecretQuestions' ? setLink('/auth/signup/security-questions') : setLink('/auth/signup/verify')}
  // })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1, maxHeight: '80vh' }}>
      <h3 className="mb-2">Verify multifactor authentication</h3>
      <p className="font-small mb-3">Your company requires multifactor authentication to add an additional layer of security when signinng into your account</p>
      {/* <br /> */}

      {
        mfa.map(m => {
          return (
            m === 'SecretQuestions' ? (
              <Link
                key={m}
                to="/auth/signup/security-questions/verify" style={{ textDecoration: 'none' }}>
                <div className="card mb-4">
                  <a href="javascript:void(0);" className="p-4 authication-card">
                    <img src={LogoSecretQ} alt="logo" className="mr-3" />
                    <p className="mb-0">{m} <br />
                      <span>Enter code from mobile app</span></p>
                  </a>
                </div>
              </Link>
            ) : m === 'GoogleAuthenticator' ? (
              <Link
                key={m}
                to="/auth/signup/verify/GoogleAuthenticator" style={{ textDecoration: 'none' }}>
                <div className="card mb-4">
                  <a href="javascript:void(0);" className="p-4 authication-card">
                    <img src={LogGAuth} alt="logo" className="mr-3" />
                    <p className="mb-0">{m} <br />
                      <span>Enter code from mobile app</span></p>
                  </a>
                </div>
              </Link>
            ) : m === 'SMSAuthenticator' ? (
              <Link
                key={m}
                to="/auth/signup/verify/SMSAuthenticator" style={{ textDecoration: 'none' }}>
                <div className="card mb-4">
                  <a href="javascript:void(0);" className="p-4 authication-card">
                    <img src={LogoSMS} alt="logo" className="mr-3" />
                    <p className="mb-0">{m} <br />
                      <span>Enter code received via SMS</span></p>
                  </a>
                </div>
              </Link>
            ) : (
                    <Link
                      key={m}
                      to={`/auth/signup/verify/${m}`} style={{ textDecoration: 'none' }}>
                      <div className="card mb-4">
                        <a href="javascript:void(0);" className="p-4 authication-card">
                          <img src={LogoNoSpace} alt="logo" className="mr-3" />
                          <p className="mb-0">{m} <br />
                            <span>Enter code from mobile app</span></p>
                        </a>
                      </div>
                    </Link>
                  )
          )
        })
      }
      <br />
    </div>
  )
}
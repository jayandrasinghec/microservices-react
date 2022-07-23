import React from 'react'
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import LogoCCIO from '../../assets/LogoCCIO.png'
import LogoNoSpace from '../../FrontendDesigns/master-screen-settings/assets/img/icons/logo-nospace.svg'
import '../../FrontendDesigns/master-screen-settings/assets/css/main.css'
import '../../FrontendDesigns/master-screen-settings/assets/css/nice-select.css'
import '../../FrontendDesigns/master-screen-settings/assets/css/react-sign-up.css'

export default function SignUpAuth() {
  return (
    <div>
      <h3 className="mb-2">Setup multifactor authentication</h3>
      <p className="font-small mb-3">Your company requires multifactor authentication to add an additional layer of security when signinng into your account</p>
      {/* <br/> */}
        <Link to='/auth/signup/auth/cymmetri' style={{ textDecoration: 'none' }}>
          <div className="card mb-4">
          <a href="javascript:void(0);" className="p-4 authication-card">
            <img src={LogoNoSpace} alt="logo" className="mr-3"/>
            <p className="mb-0">Cymmetri Authenticator <br/>
              <span>Enter single-use code from mobile app</span></p>
            </a>
        </div> 
        </Link>
      <br />
    </div>
  )
}
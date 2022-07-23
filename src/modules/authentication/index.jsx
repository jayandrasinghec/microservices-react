import React from 'react'
import { Switch, Route, Redirect } from "react-router-dom"

import LogoCYMM from '../../assets/LogoCYMM.png'
import HumanLogo from '../../assets/HumanLogo.png'
import Hidden from '@material-ui/core/Hidden'
import Login from './Login'
import SignUp from './SignUpMain'
import SignUpAuth from './SignUpAuth'
import SignUpMultiAuth from './SignUpMultiAuth'
import SignUpPassword from './SignUpPassword'
import SignUpQR from './SignUpQR'
import SignUpTY from './SignUpTY'
import SignUpVerify from './SignUpVerify'
import SignUpQuestions from './SignUpQuestions'
import SignUpQuestionsVerify from './SignUpQuestionsVerify'
import SignUpPasswordReset from './SignUpPasswordReset'
import SignUpMultiAuthVerify from './SignUpMultiAuthVerify'
import ForgotPasswordID from './ForgotPasswordID'
import ForgotPasswordMail from './ForgotPasswordMail'
import ForgotPasswordReset from './ForgotPasswordReset'

import './style.sass'


export default function AuthModule() {
  return (
    <div className="signup-container" style={{ display: 'flex', width: '100%' }}>
      <div style={{ backgroundColor: '#E9EDF6', flex: 1 }}>
        <Hidden only={['sm', 'xs']}>
          <div className="signup-left" style={{ display: 'flex', flexDirection: 'column' }}>
            <img src={LogoCYMM} style={{ width: '140px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <img src={HumanLogo} style={{ maxWidth: 400, width: '100%', maxHeight: 'calc(100% - 20px)', }} />
            </div>
          </div>
        </Hidden>
      </div>
      <div style={{ background: '#363793', flex: 1 }}>
        <div className="top-links">
          <a href="#help">Help <i className="fa fa-question-circle"></i> </a>
        </div>
        <div className="signup-right">
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <Switch>
              <Route exact={true} path="/auth/signup" component={SignUp} />
              <Route exact={true} path="/auth/signup/password/:token" component={SignUpPassword} />
              <Route exact={true} path="/auth/signup/thank_you" component={SignUpTY} />
              <Route exact={true} path="/auth/signup/auth/:id" component={SignUpAuth} />
              <Route exact={true} path="/auth/signup/multiauth-setup" component={SignUpMultiAuth} />
              <Route exact={true} path="/auth/signup/multiauth-verify" component={SignUpMultiAuthVerify} />
              <Route exact={true} path="/auth/signup/verify/:id" component={SignUpVerify} />
              <Route exact={true} path="/auth/signup/security-questions" component={SignUpQuestions} />
              <Route exact={true} path="/auth/signup/security-questions/verify" component={SignUpQuestionsVerify} />
              <Route exact={true} path="/auth/signup/reset-password" component={SignUpPasswordReset} />

              <Route exact={true} path="/auth/signup/authorize/:id" component={SignUpQR} />
              <Route exact={true} path="/auth/login" component={Login} />
              <Route exact={true} path="/auth/login/password-mail" component={ForgotPasswordMail} />
              <Route exact={true} path="/auth/login/new-password/:token" component={ForgotPasswordReset} />
              <Route exact={true} path="/auth/login/forgot-password" component={ForgotPasswordID} />
              <Redirect to="/auth/login" />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  )
}
import jwt from 'jsonwebtoken'
import { callApi } from '../../utils/api'
import { showSuccess } from '../../utils/notifications'
import { store } from '../../index'
import { setUser, setRefreshToken, setAuthToken } from './authActions'


export const decideToken = async (props, jwtTokenData, refreshToken) => {
  if (!jwtTokenData) {
    return
  }

  const jwtPayload = jwt.decode(jwtTokenData)

  store.dispatch(setAuthToken(jwtTokenData))
  if (refreshToken) await store.dispatch(setRefreshToken(refreshToken))

  if (jwtPayload.nextAction === "CymmetriAuthenticator") {
    return props.history.push('/auth/signup/multiauth-setup')
  }

  if (jwtPayload.nextAction === "GoogleAuthenticator") {
    return props.history.push('/auth/signup/auth/google')
  }

  if (jwtPayload.nextAction === "SMSAuthenticator") {
    return props.history.push('/auth/signup/verify/SMSAuthenticator')
  }

  if (jwtPayload.nextAction === "VERIFY_MFA") {
    return props.history.push('/auth/signup/multiauth-verify')
  }

  if (jwtPayload.nextAction === "SecretQuestions") {
    return props.history.push('/auth/signup/security-questions')
  }

  if (jwtPayload.nextAction === "CHANGE_PASSWORD") {
    return props.history.push('/auth/signup/reset-password')
  }

  // pre mfa login cehck
  if (jwtPayload.roles.length > 0 && jwtPayload.roles.indexOf('PRE_MFA') >= 0) {
    // recursive fn
    return callApi(`/authsrvc/auth/mfaFlow`, 'POST', {}, jwtTokenData)
      .then(e => {
        if (e.success) decideToken(props, e.data.token, e.data.refreshToken)
      })
  }

  // pre auth token
  if (jwtPayload.prevAction === 'PRE_AUTH_TOKEN') {
    return callApi(`/authsrvc/auth/loginFlow`, 'POST', {}, jwtTokenData)
      .then(e => {
        if (e.success) decideToken(props, e.data.token, e.data.refreshToken)
      })
  }

  if (jwtPayload.roles.length > 0 && jwtPayload.roles.indexOf('PRE_AUTH') === -1) {
    // return callApi(`/authsrvc/auth/pub/refreshToken`, 'POST', {
    //   accessToken: jwtTokenData,
    //   refreshToken: refreshToken,
    // }, jwtTokenData)
    //   .then(e => { if (e.success) {
    //     decideToken(props, e.data.token, e.data.refreshToken)
    //     showSuccess("Welcome! You are logged in", 'success')
    //     localStorage.setItem('userJson', JSON.stringify(jwtPayload))
    //     return props.history.push('/dash')
    //   }})
    showSuccess("Welcome! You are logged in", 'LOGGEDIN')
    localStorage.setItem('logout',false);
    store.dispatch(setUser(jwtPayload))
    return props.history.push('/dash')
  }

  alert("unkown action in the token")
}
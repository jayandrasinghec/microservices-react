/* eslint-disable react/display-name */
import React from 'react';
// import { Link as Linking } from 'react-router-dom'
// import Button from '@material-ui/core/Button';
// import Grid from '@material-ui/core/Grid'
// import Paper from '@material-ui/core/Paper'

import { callApi } from '../../../../../../utils/api'
import { showSuccess } from '../../../../../../utils/notifications'
import AuthPolicyForm from '../../../components/AuthPolicyForm'

const defaultData = {
  "active": false,
  "authFailedCount": 3,
  "authenticationList": [],
  // "description": "Description",
  "isDefault": false,
  // "name": "Name",
  "tokenExpiryMinutes": 100,
  "unlockAfterMinutes": 60,
  "refreshTokenExpiryMinutes": 1000,
  "mobileMaxDeviceLimit": null,
  "mobileRefreshTokenExpiryMinutes": null,
  "mobileTokenExpiryMinutes": null,
}

export default function Global(props) {
  const [newData, setNewData] = React.useState(defaultData)

  // const [errors, _setErrors] = React.useState({})
  const [saving, setSaving] = React.useState(false)


  const onSubmit = () => {
    setSaving(true)
    callApi(`/authsrvc/AuthenticationPolicy/create`, 'POST', newData)
      .then(e => {

        setSaving(false)
        if (e.success) {

          showSuccess('Policy Created Successfully!')
          props.history.push(`/dash/policy/auth`)
        }
      })
      .catch(() => setSaving(false))
  }

  return (
    <AuthPolicyForm {...props} newData={newData} setNewData={setNewData} onSubmit={onSubmit} saving={saving} />
  )
}

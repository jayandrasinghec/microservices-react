/* eslint-disable react/display-name */
import React from 'react';

import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications'
import AuthPolicyForm from '../../components/AuthPolicyForm';

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
}


export default function Global(props) {
  const [newData, setNewData] = React.useState(defaultData)
  const [saving, setSaving] = React.useState(false)

  const onSubmit = () => {
    setSaving(true)
    callApi(`/authsrvc/AuthenticationPolicy/modify`, 'POST', newData)
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('Policy Saved Successfully!')
          props.history.goBack()
        }
      })
      .catch(() => setSaving(false))
  }

  const download = () => {
    setSaving(true)

    callApi(`/authsrvc/AuthenticationPolicy/listByPage?name=password%20policy%20name&pageNo=0&size=10&order=descending&sortBy=created'`, 'GET')
      .then(e => {
        setSaving(false)
        if (e.success) {
          setNewData(e.data.content.find(d => d.id === props.match.params.id))
        }
      })
      .catch(() => setSaving(false))
  }

  React.useEffect(() => download(), [])

  return (
    <AuthPolicyForm {...props}
      onSubmit={onSubmit} saving={saving}
      newData={newData} setNewData={setNewData} />
  )
}



import React from 'react'

import Form from './Form'
import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications'


const defaultData = {
  // "id": "AD_AUTH1",
  // "name": "AD Authenticatotion",
  // "description": "AD Authenticatotion",
  "​type​": "ACTIVE_DIRECTORY",
  "serverConnectionUrl": "",
  "searchFilter": "",
  "principalAttribute": "",
  "bindUser": "",
  "bindPassword": "",
  "baseDN": "",
  "​vendor​": "ACTIVE_DIRECTORY",
  "isConnectionPooled": null,
  "maxConnectionPooled": null,
  "minConnectionPooled": null,
  "connectionTimeout": null,
  active: false,
  protocol: 'plain',
  authentication: 'simple'
}

export default function Global(props) {
  const [newData, setNewData] = React.useState(defaultData)
  const [saving, setSaving] = React.useState(false)

  const onSubmit = () => {
    setSaving(true)
    callApi(`/authsrvc/AuthenticationProvider/create`, 'POST', newData)
      .then(e => {

        setSaving(false)
        if (e.success) {

          showSuccess('IDP Created Successfully!')
          props.history.push(`/dash/admin/idp`)
        }
      })
      .catch(() => {
        setSaving(false)
        return(
          <Form
            {...props}
            onSubmit={onSubmit} saving={saving}
            newData={newData} setNewData={setNewData} />
        )
      })
  }

  const handleTest = () => {

    const data = {
      authentication: newData.authentication,
      bindPassword: newData.bindPassword,
      bindUser: newData.bindUser,
      protocol: newData.protocol,
      serverConnectionUrl: newData.serverConnectionUrl
    }

    callApi(`/authsrvc/AuthenticationProvider/testConnection`, 'POST', data)
    .then(e => {
      if (e.success) {

        showSuccess('Authentication tested Successfully!')
      }
    })
  }

  return (
    <Form
      {...props}
      onSubmit={onSubmit} handleTest={handleTest} saving={saving} setSaving={setSaving}
      newData={newData} setNewData={setNewData} />
  )
}

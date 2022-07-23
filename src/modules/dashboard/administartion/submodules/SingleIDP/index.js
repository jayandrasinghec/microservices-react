import React from 'react';

import Form from '../AddIDP/Form'
import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications'


const defaultData = {
  // "id": "AD_AUTH1",
  // "name": "AD Authenticatotion",
  // "description": "AD Authenticatotion",
  "​type​": "ACTIVE_DIRECTORY",
  "serverConnectionUrl": "ldaps://EC2AMAZ-4C9GMVI.cymmetri.in:636",
  "searchFilter": "(&(objectClass=user)(SamAccountName=?))",
  "principalAttribute": "SamAccountName",
  "bindUser": "test1@cymmetri.in",
  "bindPassword": "Underw0rlD1",
  "baseDN": "DC=cymmetri,DC=in",
  "​vendor​": "ACTIVE_DIRECTORY",
  "isConnectionPooled": null,
  "maxConnectionPooled": null,
  "minConnectionPooled": null,
  "connectionTimeout": null,
  active: false,
  protocol: 'plain',
  authentication: 'simple'
}

export default function SingleIDP(props) {
  const [newData, setNewData] = React.useState(defaultData)
  const [saving, setSaving] = React.useState(false)

  const onSubmit = () => {
    setSaving(true)

    callApi(`/authsrvc/AuthenticationProvider/modify`, 'POST', newData)
      .then(e => {

        setSaving(false)
        if (e.success) {

          showSuccess('IDP Saved Successfully!')
          props.history.goBack()
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

  const download = () => {
    setSaving(true)

    callApi(`/authsrvc/AuthenticationProvider/listByPage?pageNo=0&size=10&sortBy=name&order=ASC`, 'GET')
      .then(e => {

        setSaving(false)
        if (e.success) {
          const arr = e.data && e.data.content ? e.data.content : []
          setNewData(arr.find(a => a.id === props.match.params.id))
        }
      })
      .catch(() => {
        setSaving(false)
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

  React.useEffect(() => download(), [])

  return (
    <Form
      {...props}
      onSubmit={onSubmit} handleTest={handleTest} saving={saving} setSaving={setSaving}
      newData={newData} setNewData={setNewData} />
  )
}
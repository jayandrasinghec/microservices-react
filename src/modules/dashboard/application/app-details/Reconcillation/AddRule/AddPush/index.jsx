/* eslint-disable react/display-name */
import React from 'react';
import { callApi } from '../../../../../../../utils/api'
import { showSuccess } from '../../../../../../../utils/notifications'
import AddForm from '../../Form/AddForm'



export default function AddPush(props) {
  const defaultData = {
    name: '',
    applicationId: props.app.id,
    reconMode: 'FILTERED_RECONCILIATION',
    idmSearchQueryFilter: {
      locked: false,
      status: [],
      },
    reconConditions: {},
    scheduler: {
      markActive: false
    }
  }

  const [newMaster, setNewMaster] = React.useState(defaultData)
  const [saving, setSaving] = React.useState(false)
  const {setTable} = props

  const onSubmit = () => {
    setSaving(true)
    let obj = newMaster
    if(obj.scheduler.start && obj.scheduler.start.length) {
      let startDate = obj.scheduler.start
      obj.scheduler.start = new Date(startDate).toISOString()
    }
    callApi(`/provsrvc/reconciliation/push`, 'POST', newMaster)
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('Push Created Successfully!')
          setTable(true)
          props.downloadData()
        }
      })
      .catch(() => setSaving(false))
  }

  return (
    <AddForm {...props} newMaster={newMaster} app={props.app} setTable={setTable} type="PUSH" setNewMaster={setNewMaster} onSubmit={onSubmit} saving={saving} />
  )
}

/* eslint-disable react/display-name */
import React from 'react';
import { callApi } from '../../../../../../../utils/api'
import { getISODatetime } from '../../../../../../../utils/helper';
import { showSuccess } from '../../../../../../../utils/notifications'
import AddForm from '../../Form/AddForm'
import ViewForm from '../../Form/ViewForm'



export default function EditPush(props) {
  const defaultData = {
    "applicationId": props.app.id,
    "name": "",
    "frequency": "",
    "idmRepositoryField": "",
    "idmSearchQueryFilter": {
      "department": "",
      "designation": "",
      "email": "",
      "group": "",
      "location": "",
      "locked": false,
      "mobile": null,
      "reportingManager": "",
      "status": [],
      "userType": ""
      },
    "sourceAttributeName": "",
    "status": "",
    "type": "",
    "reconMode": "FILTERED_RECONCILIATION",
    "reconConditions": {
      "IDM_DELETED_TARGET_EXISTS": "",
      "IDM_EXTSTS_TARGET_EXISTS": "",
      "IDM_EXTSTS_TARGET_NOT_EXISTS": ""
    },
    "scheduler": {
      "markActive": false
    }
  }

  const [newMaster, setNewMaster] = React.useState(defaultData)
  const [saving, setSaving] = React.useState(false)
  const [run, setRun] = React.useState(false)

  const {rowId, setTable} = props

  const downloadData = () => {
    callApi(`/provsrvc/reconciliation/push/${rowId} `, 'GET')
      .then(e => {
        if (e.success) {
          let obj = e.data ? e.data.reconciliationPush : defaultData;
            obj.scheduler = {
              "cronExpression": e.data.scheduledTask ? e.data.scheduledTask.cronExpression : '',
              "start": e.data.scheduledTask && e.data.scheduledTask.plannedStart ? getISODatetime(e.data.scheduledTask.plannedStart) : '',
              "markActive": e.data.scheduledTask.status === "ACTIVE" ? true : false
            }
          setNewMaster(e.data ? obj : defaultData)
          // setNewMaster(e.data ? e.data.reconciliationPush : defaultData)
        } 
      })
  }

  const runNow = () => {
    setRun(true)
    const body = {
      "reconciliationId": rowId,
      "reconType": "PUSH"
    }
    callApi(`/provsrvc/reconciliation/userReconciliation`, 'POST', body)
      .then(e => {
        setRun(false)
        if (e.success) {
          showSuccess('Reconciliation Started.')
          // setTable(true)
          // props.downloadData()
        }
      })
      .catch(() => setRun(false))
  }

  const onSubmit = () => {
    setSaving(true)
    let obj = newMaster
    if(obj.scheduler.start && obj.scheduler.start.length) {
      let startDate = obj.scheduler.start
      obj.scheduler.start = new Date(startDate).toISOString()
    }
    callApi(`/provsrvc/reconciliation/push/${rowId}`, 'PUT', obj)
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('Push Updated Successfully!')
          setTable(true)
          props.downloadData()
        }
      })
      .catch(() => setSaving(false))
  }

  React.useEffect(() => downloadData(), [])

  if(props.type === 'VIEW')
    return (
      <ViewForm
        {...props}
        newMaster={newMaster}
        setTable={setTable}
        app={props.app}
        type="PUSH"
        runNow={runNow}
        run={run}
        action="Edit"
      />
    )
  else
    return (
      <AddForm
        {...props}
        newMaster={newMaster}
        app={props.app}
        setTable={setTable}
        app={props.app}
        type="PUSH"
        setNewMaster={setNewMaster}
        onSubmit={onSubmit}
        saving={saving}
        runNow={runNow}
        run={run}
        action="Edit"
      />
    )
}

/* eslint-disable react/display-name */
import React from 'react';
import { callApi } from '../../../../../../../utils/api'
import { getISODatetime } from '../../../../../../../utils/helper';
import { showSuccess } from '../../../../../../../utils/notifications'
import AddForm from '../../Form/AddForm'
import ViewForm from '../../Form/ViewForm'


export default function EditPull(props) {

  const defaultData = {
    "applicationId": props.app.id,
    "name":"",
    "frequency": "",
    "idmRepositoryField": "",
    "sourceAttributeName": "",
    "status": "",
    "type": "",
    "reconMode": "",
    "reconConditions": {
      "TARGET_EXTSTS_IDM_NOT_EXISTS": "",
      "TARGET_EXTSTS_IDM_EXISTS": "",
      "TARGET_DELETED_IDM_EXISTS": ""
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
    callApi(`/provsrvc/reconciliation/pull/${rowId} `, 'GET')
      .then(e => {
        if (e.success) {
          let obj = e.data ? e.data.reconciliationPull : defaultData;
          obj.scheduler = {
            "cronExpression": e.data.scheduledTask ? e.data.scheduledTask.cronExpression : '',
            "start": e.data.scheduledTask && e.data.scheduledTask.plannedStart ? getISODatetime(e.data.scheduledTask.plannedStart) : '',
            "markActive": e.data.scheduledTask.status === "ACTIVE" ? true : false
          }
          // setNewMaster(e.data ? e.data.reconciliationPull : defaultData)
          setNewMaster(e.data ? obj : defaultData)
        } 
      })
  }

  const runNow = () => {
    setRun(true)
    const body = {
      "reconciliationId": rowId,
      "reconType": "PULL"
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
    callApi(`/provsrvc/reconciliation/pull/${rowId}`, 'PUT', obj)
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('Pull Updated Successfully!')
          setTable(true)
          props.downloadData()
        }
      })
      .catch(() => setSaving(false))
  }
  
  React.useEffect(() => downloadData(), [])

  return (
    <>
      {props.type === 'VIEW' ? (
        <ViewForm
          {...props}
          setTable={setTable}
          newMaster={newMaster}
          app={props.app}
          type="PULL"
          runNow={runNow}
          run={run}
          action="Edit"
        />
      ) : props.type === 'EDIT' ? (
        <AddForm
          {...props}
          setTable={setTable}
          app={props.app}
          newMaster={newMaster}
          app={props.app}
          type="PULL"
          setNewMaster={setNewMaster}
          onSubmit={onSubmit}
          saving={saving}
          runNow={runNow}
          run={run}
          action="Edit"
        />
      ) : (<></>)}
    </>
  )
}

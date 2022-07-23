/* eslint-disable react/display-name */
import React from 'react';

import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications'
import PasswordPolicyForm from '../../components/PasswordPolicyForm';

const defaultData = {
  // "name":"password policy name2",
  // "description":"description",
  "isDefault": true,
  "active": false
}

const defaultComposition = {
  // randomGenerationDefaultValue:true,
  // passwordLengthFrom:6,
  // passwordLengthTo:12,
  // numericCharactersAmountFrom:7,
  // numericCharactersAmountTo:8,
  // alphaCharactersAmountFrom:6,
  // alphaCharactersAmountTo:11,
  // passwordHistoryVersion:3,
  // rejectPasswordEqualsPassword: true,
  // rejectPasswordWhichEqualsToLoginId:true,
  // rejectPasswordWhichEqualsToFirstOrLastName: true,
  // charactersNotAllowedInPassword:"$",
  // upperCaseCharactersAmountFrom:6,
  // upperCaseCharactersAmountTo:7,
  // lowerCaseCharactersAmountFrom: 9,
  // lowerCaseCharactersAmountTo: 10
}
const defaultChange = {
}
const defaultReset = {
}
const defaultNoti = {
}

export default function Global(props) {
  const [newData, setNewData] = React.useState(defaultData)
  const [newComposition, setNewComposition] = React.useState(defaultComposition)
  const [newChange, setNewChange] = React.useState(defaultChange)
  const [newReset, setNewReset] = React.useState(defaultReset)
  const [newNoti, setNewNoti] = React.useState(defaultNoti)
  const [saving, setSaving] = React.useState(false)

  // const onSubmit = () => {
  //   setSaving(true)
  //   callApi(`/authsrvc/passwordPolicy/savePolicy/${props.match.params.id}`, 'POST', newData)
  //     .then(e => {
  //       if (e.success) {
  //         showSuccess('Policy Saved Successfully!')
  //       }
  //     })
  //   callApi(`/authsrvc/passwordPolicy/savePasswordNotifications/${props.match.params.id}`, 'POST', newNoti)
  //     .then(e => {
  //       setSaving(false)
  //       if (e.success) {
  //         showSuccess('Reset Saved Successfully!')
  //         props.history.goBack()
  //       }
  //     })
  //     .catch(setSaving(false))

  // }

  const download = () => {
    setSaving(true)

    callApi(`/authsrvc/passwordPolicy/getPolicy/${props.match.params.id}`, 'GET')
      .then(e => {
        setSaving(false)
        if (e.success) {
          setNewData(e.data)
        }
      })
      .catch(() => setSaving(false))
  }
  const downloadComp = () => {
    setSaving(true)

    callApi(`/authsrvc/passwordPolicy/getPasswordCompositionRule/${props.match.params.id}`, 'GET')
      .then(e => {
        setSaving(false)
        if (e.success) {
          setNewComposition(e.data)
        }
      })
      .catch(() => setSaving(false))

    callApi(`/authsrvc/passwordPolicy/getPasswordChangeRule/${props.match.params.id}`, 'GET')
      .then(e => {
        setSaving(false)
        if (e.success) {
          setNewChange(e.data)
        }
      })
      .catch(() => setSaving(false))

    // callApi(`/authsrvc/passwordPolicy/getPasswordResetParameters/${props.match.params.id}`, 'GET')
    //   .then(e => {
    //     setSaving(false)
    //     if (e.success) {
    //       setNewReset(e.data)
    //     }
    //   })
    //   .catch(setSaving(false))

    // callApi(`/authsrvc/passwordPolicy/getPasswordNotifications/${props.match.params.id}`, 'GET')
    //   .then(e => {
    //     setSaving(false)
    //     if (e.success) {
    //       setNewNoti(e.data)
    //     }
    //   })
    //   .catch(setSaving(false))


  }
  React.useEffect(() => download(), [])
  React.useEffect(() => downloadComp(), [])

  return (
    <PasswordPolicyForm {...props}
      // onSubmit={onSubmit}
      // saving={saving}
      history={props.history}
      newData={newData} setNewData={setNewData}
      newComposition={newComposition} setNewComposition={setNewComposition}
      newChange={newChange} setNewChange={setNewChange}
      // newReset={newReset} setNewReset={setNewReset}
      // newNoti={newNoti} setNewNoti={setNewNoti}
    />
  )
}



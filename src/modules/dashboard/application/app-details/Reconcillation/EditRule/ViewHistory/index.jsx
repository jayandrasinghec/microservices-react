/* eslint-disable react/display-name */
import React from 'react';
import ViewHistory from '../../Form/ViewHistory'



export default function AddPull(props) {
  const {app, rowData, setTable} = props;
  const defaultData = {
    applicationId: props.app.id, 
    reconConditions:{}
  }

  const [newMaster, setNewMaster] = React.useState(defaultData)
  // const {rowId, setTable} = props

  return (
    <ViewHistory {...props} setTable={setTable} rowData={rowData} newMaster={newMaster} app={app} />
  )
}

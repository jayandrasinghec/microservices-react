/* eslint-disable react/display-name */

import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility'

import Delete from '../../../../../FrontendDesigns/new/assets/img/icons/Delete.svg'
import Edit from '../../../../../FrontendDesigns/new/assets/img/icons/edit.svg'
import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications'
import ActiveStatusChip from '../../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../../components/HOC/InactiveStatusChip';
import AddRoleButton from './AddRoleButton'
import EditRoleButton from './EditRoleButton'
import DeleteModal from '../../../../../components/DeleteModal';
import AppMaterialTable from '../../../../../components/AppMaterialTable';
import {isActiveForRoles} from '../../../../../utils/auth'


export default function Role(props) {
  const [data, setData] = React.useState([])
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editRow, setEditRow] = React.useState(false);
  const [name, setName] = React.useState("");
  const [ids, setIds] = React.useState("");
  const [saving, setSaving] = React.useState(false)

  const handleModalOpen = (name, id) => {
    setOpen(true);
    setName(name);
    setIds(id);
  };
  const handleModalClose = () => {
    setOpen(false);
    setName("");
    setIds("");
  };

  const downloadData = () => {
    callApi(`/provsrvc/applicationRole/findByApplicationId/${props.app.id}`, 'GET')
      .then(e => {

        if (e.success) {
          setData(e.data && e.data ? e.data : [])
        }
      })
  }

  React.useEffect(() => downloadData(), [])

  const deleteApp = () => {
    setSaving(true)
    callApi(`/provsrvc/applicationRole/delete/${ids}`, 'DELETE')
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('Deleted Successfully!')
          downloadData()
          handleModalClose()
        }
      })
      .catch(() => {
        setSaving(false)
      })
  }

  const columns = [
    { title: 'Role Id', field: 'roleId', cellStyle: { fontWeight: '700', border: 'none' } },
    { title: 'Name', field: 'roleName' },
    { title: 'Description', field: 'roleDescreption' },
    { title: 'COSO Type', field: 'cosoType'},
    {
      title: 'Status',
      field: 'active',
      render: rowData => {
        return rowData.active === true ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip>
      }
    },
  ]


  return (
    <AppMaterialTable
      columns={data.length > 0 ? columns : []}
      data={data}
      actions={[
        {
          icon: () => isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','APP_ADMIN']) && ( <AddRoleButton app={props.app} data={data} onAdd={downloadData} /> ),
          isFreeAction: true,
        },
        {
          // icon: () => isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','APP_ADMIN']) && ( <img src={Edit} alt="" title /> ),
          icon: () => isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : <img src={Edit} alt="" title /> ,
          tooltip: 'Edit Role',
          // hidden: !isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN','APP_ADMIN']),
          onClick: (event, rowData) => {
            setEditRow(rowData)
            setEditOpen(true)
            // handleClick(rowData.id)
          }
        },
        {
          icon: () => isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','APP_ADMIN']) && (
            <img src={Delete} alt="" title />
          ),
          hidden: !isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN','APP_ADMIN']),
          tooltip: 'Delete Role',
          onClick: (event, rowData) => handleModalOpen(rowData.roleName, rowData.id)
        }
      ]}
      body={
        <>
        {open ? (<DeleteModal saving={saving} open={open} onClose={handleModalClose} name={name} onDelete={deleteApp} />) : (<></>)}
        <EditRoleButton open={editOpen} app={props.app} row={editRow} onUpdate={() => {
          setEditOpen(false)
          downloadData()
        }} />
        </>
      }
    />
  )
}

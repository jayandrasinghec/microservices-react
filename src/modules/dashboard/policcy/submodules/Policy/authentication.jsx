/* eslint-disable react/display-name */
import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility'

import Plus from '../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/plus.svg';
import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications'
import ActiveStatusChip from '../../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../../components/HOC/InactiveStatusChip';
import { Link } from 'react-router-dom';
import Delete from '../../../../../FrontendDesigns/new/assets/img/icons/Delete.svg'
import Edit from '../../../../../FrontendDesigns/new/assets/img/icons/edit.svg'
import AppMaterialTable from '../../../../../components/AppMaterialTable';
import DeleteModal from '../../../../../components/DeleteModal';
import {isActiveForRoles} from '../../../../../utils/auth'
import { TablePagination } from '@material-ui/core'
import CustomPagination from '../../../../../components/CustomPagination';

const defaultQuery = {
  name: "password policy name",
  order: "descending",
  pageNo: 0,
  size: 10,
  sortBy: "created"
}

export default function Global(props) {

  const [query, _setQuery] = React.useState(defaultQuery)
  const [data, setData] = React.useState([])
  const [totalUsers, setTotalUsers] = React.useState(0)
  const [open, setOpen] = React.useState(false);
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
    callApi(`/authsrvc/AuthenticationPolicy/listByPage?name=${query.name}&pageNo=${query.pageNo}&size=${query.size}&order=${query.order}&sortBy=${query.sortBy}`, 'GET')
      .then(e => {

        if (e.success){
          setData(e.data && e.data.content ? e.data.content : [])
          setTotalUsers(e.data ? e.data.totalElements : 0)
        } 
      })
  }

  React.useEffect(() => downloadData(), [query])

  const deleteApp = () => {
    setSaving(true)
    callApi(`/authsrvc/AuthenticationPolicy/delete/${ids}`, 'POST')
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('Deleted Successfully!')
          downloadData()
          handleModalClose()
        }
      })
      .catch(() => setSaving(false))
  }

  const handleChangePage = (event, newPage) => _setQuery({ ...query, pageNo: newPage })
  const handleChangeRowsPerPage = (event) => {
    _setQuery({ ...query, pageNo: 0, size: parseInt(event, 10) })
  }

  const columns = [
    { title: 'Policy', field: 'name', cellStyle: { fontWeight: '700', border: 'none' } },
    { title: 'Description', field: 'description' },
    // { title: 'Type', field: 'type' },
    {
      title: 'Status',
      field: 'active',
      render: rowData => {
        return rowData.active === true ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip>
      }
    },
    // { title: 'Created by', field: 'createdBy' },

  ]

  return (
    <>
    <AppMaterialTable
      columns={data.length > 0 ? columns : []}
      data={data}
      actions={[
        {
          icon: () => isActiveForRoles(['ORG_ADMIN']) && (
            <div>
              <Link to="/dash/policy/auth/add">
                <div style={{ cursor: 'pointer' }} className="primary-btn-view">
                  <img src={Plus} alt="" title /> Add Policy
                </div>
              </Link>
            </div>
          ),
          isFreeAction: true,
        },
        {
          icon: () => (
            !isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : <img src={Edit} alt="" title />
          ),
          tooltip: !isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']) ? 'View Policy' : 'Edit Policy',
          // hidden: !isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']),
          onClick: (event, rowData) => props.history.push(`/dash/policy/auth/${rowData.id}`)
        },
        {
          icon: () => (
            <img src={Delete} alt="" title />
          ),
          hidden: !isActiveForRoles(['ORG_ADMIN']),
          tooltip: 'Delete Policy',
          onClick: (event, rowData) => handleModalOpen(rowData.name, rowData.id)
        }
      ]}
      body={
        <>
          {open ? (<DeleteModal saving={saving} open={open} onClose={handleModalClose} name={name} onDelete={deleteApp} />) : (<></>)}
        </>
      }
    />
    {/* <TablePagination
        component="div"
        // rowsPerPageOptions={[12, 24, 60, 120]}
        count={totalUsers}
        page={query.pageNo}
        onChangePage={handleChangePage}
        rowsPerPage={query.size}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
       <CustomPagination              
              count={Math.ceil(totalUsers / query.size)}  
              totalCount = {totalUsers}            
              page={query.pageNo}
              onChangePage={handleChangePage}
              rowsPerPage={query.size}
              onChangeRowsPerPage={handleChangeRowsPerPage}
        />
    </>
  )
}

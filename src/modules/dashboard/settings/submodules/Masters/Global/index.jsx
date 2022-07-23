/* eslint-disable react/display-name */
import React from 'react'
import Modal from '@material-ui/core/Modal'
import MenuItem from '@material-ui/core/MenuItem'
import VisibilityIcon from '@material-ui/icons/Visibility'

import Plus from '../../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/plus.svg'
import { callApi } from '../../../../../../utils/api'
import { showSuccess } from '../../../../../../utils/notifications'
import AppCheckbox from '../../../../../../components/form/AppCheckbox'
import AppTextInput from '../../../../../../components/form/AppTextInput'
import AppSelectInput from '../../../../../../components/form/AppSelectInput'
import ActiveStatusChip from '../../../../../../components/HOC/ActiveStatusChip'
import InactiveStatusChip from '../../../../../../components/HOC/InactiveStatusChip'
import AddNewModal from '../../../../../../components/AddNewComponent'
import DropDown from '../../../../../../components/DropDownComponent'
import AppMaterialTable from '../../../../../../components/AppMaterialTable';
import Edit from '../../../../../../FrontendDesigns/new/assets/img/icons/edit.svg'
import {isActiveForRoles} from '../../../../../../utils/auth'
import { TablePagination } from '@material-ui/core'
import CustomPagination from '../../../../../../components/CustomPagination'


const defaultFilters = {
  "filter": {
    "type": ""
  },
  "keyword": "",
  "pageNumber": "0",
  "pageSize": "10",
  "sortDirection": "ASC",
  "sortOn": []
}

const defaultTypes = {
  "filter": {
    // "active": "null",
    "name": "",
    "value": ""
  },
  "keyword": "",
  "pageNumber": 0,
  "pageSize": 10,
  "sortDirection": "ASC",
  "sortOn": []
}

const defaultMaster = {
  type: "UserType",
  name:"",
  value:"",
  status:false
}

export default function Global() {

  const [filters, setFilters] = React.useState(defaultFilters)
  const [types, setTypes] = React.useState(defaultTypes)
  const [newMaster, setNewMaster] = React.useState(defaultMaster)
  const [edit, setEdit] = React.useState(false)
  const [drop, _setDrop] = React.useState([])
  const [query, _setQuery] = React.useState("")
  const [data, setData] = React.useState([])
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false)
  const [errors, _setErrors] = React.useState({})
  const [totalUsers, setTotalUsers] = React.useState(0)

  const handleModalOpen = () => {
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
    setEdit(false);
    setNewMaster(defaultMaster);
    _setErrors({})
  };

  React.useEffect(() => {
    callApi(`/utilsrvc/metatype/list`, 'POST', filters)
      .then(e => {if (e.success){
        let dropdownData = [];
        e.data && e.data.content.map((opt => {
          // if(opt.visible || opt.type === 'UserType') {
          if(opt.visible) {
            dropdownData.push(opt)
          }
        }))
        _setDrop(e.data ? dropdownData : [])
        // _setDrop(e.data ? e.data.content : [])
      }})
  }, [])

  const downloadData = (type = query) => {
    const field = type
    callApi(`/utilsrvc/meta/list/${field}`, 'POST', types)
      .then(e => {

        if (e.success) {
          setData(e.data ? e.data.content : [])
          setTotalUsers(e.data ? e.data.totalElements : 0)
        } 
      })
  }

  // React.useEffect(() => downloadData("usertype"), [types])
  React.useEffect(() => {
    if (drop && drop.length > 0) {
      let typeName = query === '' ? drop[0]["type"] : query
      _setQuery(typeName)
      downloadData(typeName)
    }
  }, [types, drop])

  const change = e => setNewMaster({ ...newMaster, ...e })

  const isValid = newMaster.name && newMaster.value

  const onSubmit = () => {
    setSaving(true)
    callApi(`/utilsrvc/meta/${newMaster.type}`, 'POST', newMaster)
      .then(e => {
        setSaving(false)
        if (e.success) {
          handleModalClose()
          downloadData()
          showSuccess(`Master ${newMaster.id ? 'Updated' : 'Added'} Successfully!`)
          if(newMaster.id){
            if(newMaster.active === true){
              callApi(`/utilsrvc/meta/activate/${newMaster.type}/${newMaster.id}`, 'PUT')
                .then(e => {
                  if (e.success) {
                    showSuccess('Activated Successfully!')
                    downloadData()
                  }
                })
            }else{
              callApi(`/utilsrvc/meta/deactivate/${newMaster.type}/${newMaster.id}`, 'PUT')
                .then(e => {
                  if (e.success) {
                    showSuccess('Deactivated Successfully!')
                    downloadData()
                  }
                })
            }
          }
        }
      })
      .catch(() => setSaving(false))
  }

  const handleChangePage = (event, newPage) => {
    setTypes({ ...types, pageNumber: newPage })
  }
  const handleChangeRowsPerPage = (event) => {
    setTypes({ ...types, pageNumber: 0, pageSize: parseInt(event, 10) })
  }

  const setError = e => _setErrors({ ...errors, ...e })
  const checkName = () => setError({ name: (newMaster.name || '').length > 1 ? null : 'Name/Key is required' })
  const checkValue = () => setError({ value: (newMaster.value || '').length > 1 ? null : 'Value is required' })

  const body = (
    <AddNewModal
      title={edit ? "Edit Global Masters" : "Add New Global Masters"}
      onClose={handleModalClose}
      disabled={!isValid || saving}
      hidden={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
      saving={saving}
      onSubmit={onSubmit}
      body={
        <form>
          <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center mb-3">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
              <AppTextInput
                required
                error={!!errors.name}
                onBlur={checkName}
                helperText={errors.name}
                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || edit}
                value={newMaster.name}
                onChange={e => change({ name: e.target.value })}
                label="Name / Key" />
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto">
              <AppCheckbox
                value={newMaster.active} disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])} onChange={e => change({ active: Boolean(e) })}
                switchLabel={newMaster.active ? 'Active' : 'In-active'}
                label="Status" />
            </div>
          </div>
          <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
              <AppTextInput
                required
                error={!!errors.value}
                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                onBlur={checkValue}
                helperText={errors.value}
                value={newMaster.value}
                onChange={e => change({ value: e.target.value })}
                label="Value" />
            </div>
            {!newMaster.id ? <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto">
              <AppSelectInput
                label="Type"
                value={newMaster.type}
                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                onChange={e => change({ type: e.target.value })}
                options={drop.map(o => o.type)} />
            </div> : <></>}
          </div>
        </form>
      }
    />
  )

  const columns = [
    { title: 'Name', field: 'name', cellStyle: { fontWeight: '700', border: 'none' } },
    { title: 'Value', field: 'value' },
    { title: 'Type', field: 'type' },
    {
      title: 'Status',
      field: 'active',
      render: rowData => {
        return rowData.active === true ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip>
      }
    },
    { title: 'Created By', field: 'createdBy' },

    // {
    //   title: 'Actions', field: 'active',
    //   render: u => {

    //     const onActivate = () => {
    //       callApi(`/utilsrvc/meta/activate/${u.type}/${u.id}`, 'PUT')
    //         .then(e => {
    //           if (e.success) {
    //             showSuccess('Activated Successfully!')
    //             downloadData()
    //           }
    //         })
    //     }
    //     const onDeActivate = () => {
    //       callApi(`/utilsrvc/meta/deactivate/${u.type}/${u.id}`, 'PUT')
    //         .then(e => {
    //           if (e.success) {
    //             showSuccess('Deactivated Successfully!')
    //             downloadData()
    //           }
    //         })
    //     }

    //     return (
    //       <div style={{ display: 'flex' }}>
    //         {/* {u.active ? (
    //           <div onClick={onDeActivate} style={{ color: 'blue', cursor: 'pointer' }}>{u.active ? "Deactivate" : "Activate"}</div>
    //         ) : (
    //             <div onClick={onActivate} style={{ color: 'blue', cursor: 'pointer' }}>{u.active ? "Deactivate" : "Activate"}</div>
    //           )} */}
    //         <div onClick= {() => {setNewMaster(u);handleModalOpen();}}><img src={Edit} alt="" title style={{ cursor: 'pointer' }} /></div>
    //       </div>
    //     )
    //   }
    // }
  ]

  return (
    <>
    <AppMaterialTable
      columns={data.length > 0 ? columns : []}
      data={data}
      actions={[
        {
          icon: () => isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && (
            <div style={{ display: 'flex' }}>
              <DropDown title={query} options={drop} body={
                drop.map(o => {
                  return (
                    <MenuItem key={o.type} onClick={e => { _setQuery(o.type); downloadData(o.type) }}>
                      <div style={{ display: 'flex' }}>
                        <span style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '12px', lineHeight: '20px', color: '#8998AC;', marginLeft: '0px' }}>{o.type}</span>
                      </div>
                    </MenuItem>
                  )
                })
              }/>
              {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && <div onClick={handleModalOpen} style={{ cursor: 'pointer' }} className="primary-btn-view">
                <img src={Plus} alt="" title /> ADD NEW
              </div>}
            </div>
          ),
          isFreeAction: true,
        },
        {
          icon: () => /* isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && */ (
            isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : <img src={Edit} alt="" title />
          ),
          tooltip: 'Edit Masters',
          // hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
          onClick: (event, rowData) => {setNewMaster(rowData);setEdit(true);handleModalOpen();}
        },
      ]}
      body={
        <>
        <Modal open={open} onClose={handleModalClose}>
          {body}
        </Modal>
        </>
      }
    />
    {/* <TablePagination
      component="div"
      // rowsPerPageOptions={[12, 24, 60, 120]}
      count={totalUsers}
      page={types.pageNumber}
      onChangePage={handleChangePage}
      rowsPerPage={types.pageSize}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    /> */}
      <CustomPagination
        count={Math.ceil(totalUsers / types.pageSize)}
        totalCount = {totalUsers}
        page={types.pageNumber}
        onChangePage={handleChangePage}
        rowsPerPage={types.pageSize}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  )
}



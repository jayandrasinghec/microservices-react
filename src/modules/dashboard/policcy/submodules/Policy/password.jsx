/* eslint-disable react/display-name */
import React from 'react';
import { useHistory } from "react-router-dom";
import VisibilityIcon from '@material-ui/icons/Visibility'

import Plus from '../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/plus.svg';
import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications'
import ActiveStatusChip from '../../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../../components/HOC/InactiveStatusChip';
import Modal from '@material-ui/core/Modal';
import Delete from '../../../../../FrontendDesigns/new/assets/img/icons/Delete.svg'
import Edit from '../../../../../FrontendDesigns/new/assets/img/icons/edit.svg'
import AddNewModal from '../../../../../components/AddNewComponent'
import AppMaterialTable from '../../../../../components/AppMaterialTable';

import '../../../../../FrontendDesigns/master-screen-settings/assets/css/settings.css';
import '../../../../../FrontendDesigns/master-screen-settings/assets/css/nice-select.css';

import AppCheckbox from '../../../../../components/form/AppCheckbox';
import AppTextInput from '../../../../../components/form/AppTextInput';
// import AppSelectInput from '../../../../../../components/form/AppSelectInput';
import DeleteModal from '../../../../../components/DeleteModal';
import {isActiveForRoles} from '../../../../../utils/auth'
import { TablePagination } from '@material-ui/core'
import CustomPagination from '../../../../../components/CustomPagination';
import AppSelectInput from '../../../../../components/form/AppSelectInput';


const defaultData = {
  "name":"",
  "description":"",
  "isDefault": false,
  "active": false,
  "conditionalAttrType": "USER",
  "conditionalAttrName": "userType",
  "conditionalAttrValue": "Vendor"
}

const defaultQuery = {
  name: "",
  order: "descending",
  pageNo: 0,
  size: 10,
  sortBy: "created"
}

const defaultFilter = {
  "filter": {
    "name": "",
    "isDefault":null,
    "conditionalAttrType": null,
   "conditionalAttrName":"",
    "conditionalAttrValue":""
  },
  "keyword": "string",
  "pageNumber": 0,
  "pageSize": 10,
  "sortDirection": "ASC",
  "sortOn": [
    "id"
  ]
}

export default function Password(props) {
  const [query, _setQuery] = React.useState(defaultQuery)
  const [data, setData] = React.useState([])
  const [totalUsers, setTotalUsers] = React.useState(0)

  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [ids, setIds] = React.useState("");
  const history = useHistory();
  const [addopen, addsetOpen] = React.useState(false);

  const [newData, setNewData] = React.useState(defaultData)
  const [errors, _setErrors] = React.useState({})
  const [saving, setSaving] = React.useState(false)
  const [conditionalAttrValueOptions, setConditionalAttrValueOptions] = React.useState([])
  const [filters, setFilters] = React.useState(defaultFilter);

  const change = e => setNewData({ ...newData, ...e })
  const setError = e => _setErrors({ ...errors, ...e })

  const isValid = newData.name && newData.description

  const checkCname = () => setError({ name: (newData.name || '').length > 1 ? null : 'Policy name is required' })
  const checkDes = () => setError({ description: (newData.description || '').length > 1 ? null : 'Description is required' })

  const conditionalAttrTypeOptions = [{label: 'User', value: 'USER'}]
  const conditionalAttrNameOptions = [{label: 'UserType', value: 'userType'}]

  const addhandleModalOpen = () => {
    addsetOpen(true);
    setNewData(defaultData);
  };

  const addhandleModalClose = () => {
    addsetOpen(false);
  };

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

  const handleChangePage = (event, newPage) => _setQuery({ ...query, pageNo: newPage })
  const handleChangeRowsPerPage = (event) => {
    _setQuery({ ...query, pageNo: 0, size: parseInt(event, 10) })
  }

  const downloadData = () => {
    callApi(`/authsrvc/passwordPolicy/search?name=${query.name}&pageNo=${query.pageNo}&size=${query.size}&order=${query.order}&sortBy=${query.sortBy}`, 'GET')
      .then(e => {
        if (e.success){
          setData(e.data && e.data.content ? e.data.content : [])
          setTotalUsers(e.data ? e.data.totalElements : 0)
        } 
      })
  }

  const getConditionalAttrValueOptions = () => {
    callApi(`/utilsrvc/meta/list/userType`, 'GET')
      .then(e => { 
        if (e.success) {
          setConditionalAttrValueOptions(e.data)
        }
      })
  }

  const getSearchResult = () => {
    callApi(`/authsrvc/passwordPolicy/policySearch`, 'POST', filters)
      .then(e => {
        if (e.success) {
          setData(e.data ? e.data.content : [])
          setTotalUsers(e.data ? e.data.totalElements : 0)
        }
      })
  }

  React.useEffect(() => downloadData(), [query])
  React.useEffect(() => getConditionalAttrValueOptions(), [])
  React.useEffect(() => getSearchResult(), [filters])

  const onSubmit = () => {
    setSaving(true)
    callApi(`/authsrvc/passwordPolicy/createPolicy`, 'POST', newData)
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('Policy Created Successfully!')
          addhandleModalClose()
          // downloadData()
          history.push(`/dash/policy/password/${e.data.id}`)

        }
      })
      .catch(() => setSaving(false))
  }

  const deleteApp = () => {
    setSaving(true)
    callApi(`/authsrvc/passwordPolicy/delete/${ids}`, 'DELETE')
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

  const addbody = (
    <AddNewModal
      title="Add Password Policy"
      onClose={addhandleModalClose}
      disabled={!isValid || saving}
      onSubmit={onSubmit}
      saving={saving}
      body={
        <form>
          <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center mb-3">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
              <AppTextInput
                required
                value={newData.name}
                error={!!errors.name}
                onBlur={checkCname}
                helperText={errors.name}
                onChange={e => change({ name: e.target.value })}
                label="Policy Name" 
              />
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto">
              <AppTextInput
                required
                value={newData.description}
                error={!!errors.description}
                onBlur={checkDes}
                helperText={errors.description}
                onChange={e => change({ description: e.target.value })}
                label="Description" 
              />
            </div>
          </div>
          <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center mb-3">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto pl-0">
              <AppSelectInput
                value={newData.conditionalAttrType}
                onChange={e => change({ conditionalAttrType: e.target.value })}
                label="Conditinal Attribute Type"
                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                options={conditionalAttrTypeOptions.map(opt => opt.value)}
                labels={conditionalAttrTypeOptions.map(opt => opt.label)} 
              />
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto">
              <AppSelectInput
                value={newData.conditionalAttrName}
                onChange={e => change({ conditionalAttrName: e.target.value })}
                label="Conditinal Attribute Name"
                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                options={conditionalAttrNameOptions.map(opt => opt.value)}
                labels={conditionalAttrNameOptions.map(opt => opt.label)} 
              />
            </div>
          </div>
          <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto pl-0">
              <AppSelectInput
                value={newData.conditionalAttrValue}
                onChange={e => change({ conditionalAttrValue: e.target.value })}
                label="Conditinal Attribute Value"
                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                options={conditionalAttrValueOptions.map(opt => opt.value)}
                labels={conditionalAttrValueOptions.map(opt => opt.name)} 
              />
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto">
              <AppCheckbox
                value={newData.active} onChange={e => change({ active: Boolean(e) })}
                switchLabel={newData.active ? 'Active' : 'Inactive'}
                label="Status" 
              />
            </div>
            {/* <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto">
              <AppSelectInput
                label="Type"
                value={newMaster.type} onChange={e => change({ type: e.target.value })}
                options={drop.map(o => o.type)} />
            </div> */}
          </div>
        </form>
      }
    />
  )


  const columns = [
    { title: 'Policy', field: 'name', cellStyle: { fontWeight: '700', border: 'none' } },
    { title: 'Description', field: 'description' },
    { title: 'Attribute Type', field: 'conditionalAttrType', render: rowData => { return rowData.conditionalAttrType ?  rowData.conditionalAttrType : '--'} },
    { title: 'Attribute Name', field: 'conditionalAttrName', render: rowData => { return rowData.conditionalAttrName ?  rowData.conditionalAttrName : '--'} },
    { title: 'Attribute Value', field: 'conditionalAttrValue', render: rowData => { return rowData.conditionalAttrValue ?  rowData.conditionalAttrValue : '--'} },
    // { title: 'Type', field: 'type' },
    {
      title: 'Status',
      field: 'active',
      render: rowData => {
        return rowData.active === true ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip>
      }
    },
    { title: 'Created by', field: 'createdBy' },
  ]

  const handleClick = (id) => {
    history.push(`/dash/policy/password/${id}`)
  }
  return (
    <>
    <AppMaterialTable
      columns={data.length > 0 ? columns : []}
      data={data}
      onSearchChange = {text => {
        console.log('text', text);
        let obj = filters.filter;
        obj.name = text
        setFilters({...filters, filter:obj})
      }}
      actions={[
        {
          icon: () => isActiveForRoles(['ORG_ADMIN']) && (
            <div>
              {/* <Linking to="/dash/policy/password/add"> */}
              <div onClick={addhandleModalOpen} style={{ cursor: 'pointer' }} className="primary-btn-view">
                <img src={Plus} alt="" title /> Add Policy
                </div>
              {/* </Linking> */}
            </div>
          ),
          hidden:!isActiveForRoles(['ORG_ADMIN']),
          isFreeAction: true,
        },
        {
          icon: () => (
            !isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : <img src={Edit} alt="" title />
          ),
          tooltip: !isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']) ? 'View Policy' : 'Edit Policy',
          onClick: (event, rowData) => handleClick(rowData.id)
        },
        rowData => ({
          icon: () => (
            <img src={Delete} alt="" title />
          ),
          tooltip: 'Delete Policy',
          onClick: (event, rowData) => handleModalOpen(rowData.name, rowData.id),
          hidden: rowData.isDefault || !isActiveForRoles(['ORG_ADMIN']),
        })
      ]}
      body={
        <>
          {open ? (<DeleteModal saving={saving} open={open} onClose={handleModalClose} name={name} onDelete={deleteApp} />) : (<></>)}
          <Modal open={addopen} onClose={addhandleModalClose}>
            {addbody}
          </Modal>
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









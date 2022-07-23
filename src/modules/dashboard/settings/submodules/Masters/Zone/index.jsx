/* eslint-disable react/display-name */
import React from 'react';
import Modal from '@material-ui/core/Modal'
import VisibilityIcon from '@material-ui/icons/Visibility'
// import { TablePagination } from '@material-ui/core'

import Delete from '../../../../../../FrontendDesigns/new/assets/img/icons/Delete.svg'
import '../../../../../../FrontendDesigns/master-screen-settings/assets/css/settings.css';
import '../../../../../../FrontendDesigns/master-screen-settings/assets/css/nice-select.css';
import Plus from '../../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/plus.svg';
import { callApi } from '../../../../../../utils/api'
import { showSuccess } from '../../../../../../utils/notifications'
import AppCheckbox from '../../../../../../components/form/AppCheckbox';
import AppTextInput from '../../../../../../components/form/AppTextInput';
import ActiveStatusChip from '../../../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../../../components/HOC/InactiveStatusChip';
import AddNewModal from '../../../../../../components/AddNewComponent'
import DeleteModal from '../../../../../../components/DeleteModal';
import AppMaterialTable from '../../../../../../components/AppMaterialTable';
import Edit from '../../../../../../FrontendDesigns/new/assets/img/icons/edit.svg'
import {isActiveForRoles} from '../../../../../../utils/auth'
import CustomPagination from '../../../../../../components/CustomPagination';


const defaultMaster = {
  // "cidr": "192.168.1.0/24",
  // "gatewayIp": "192.168.1.1",
  "ipRange": {
    // "higherHostId": 70,
    // "higherNetworkId": 3,
    // "lowerHostId": 0,
    // "lowerNetworkId": 1,
    // "netmaskId": 192.168
  },
  // "name": "Mfa Zone4",
  // "proxyIp": "192.168.1.1",
  "active": false
}

const defaultQuery = {
  name: "",
  order: "descending",
  pageNo: 0,
  size: 10,
  sortBy: "created"
}

export default function Zone() {

  const [newMaster, setNewMaster] = React.useState(defaultMaster)
  const [ipRange2, setIpRange] = React.useState(newMaster.ipRange)
  const [errors, _setErrors] = React.useState([])
  const [query, _setQuery] = React.useState(defaultQuery)
  const [data, setData] = React.useState([])
  const [totalUsers, setTotalUsers] = React.useState(0)
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false)
  const [edit, setEdit] = React.useState(false)
  const [changed, setChanged] = React.useState(false)

  const [deleteModal, setDeleteModal] = React.useState(false);
  const [name, setName] = React.useState("");
  const [ids, setIds] = React.useState("");

  const handleDeleteModalOpen = (name, id) => {
    setDeleteModal(true);
    setName(name);
    setIds(id);
  };
  const handleDeleteModalClose = () => {
    setDeleteModal(false);
    setName("");
    setIds("");
  };

  const handleModalOpen = () => {
    setOpen(true);
    // setNewMaster(defaultMaster)
  };
  const handleModalClose = () => {
    setOpen(false);
    setNewMaster(defaultMaster);
    setIpRange(newMaster.ipRange)
    _setErrors({})
    setChanged(false)
  };

  const downloadData = () => {
    callApi(`/rulesrvc/zone/zoneListByNameAndPage?name=${query.name}&pageNo=${query.pageNo}&size=${query.size}&order=${query.order}&sortBy=${query.sortBy}`, 'GET')
      .then(e => {

        if (e.success) {
          setData(e.data && e.data.content ? e.data.content : [])
          setTotalUsers(e.data ? e.data.totalElements : 0)
        }
      })
  }

  React.useEffect(() => downloadData(), [query])

  const change = (e) => {
    setNewMaster({ ...newMaster, ...e })
    setChanged(true)
  }
  const changeIP = (e) => {
    setIpRange({ ...ipRange2, ...e })
    setChanged(true)
  }
  const handleChangePage = (event, newPage) => _setQuery({ ...query, pageNo: newPage })
  const handleChangeRowsPerPage = (event) => {
    _setQuery({ ...query, pageNo: 0, size: parseInt(event, 10) })
  }
  const isValid = !Object.values(errors).some(e => e != null) && newMaster.name && newMaster.gatewayIp && newMaster.proxyIp && newMaster.cidr

  const onSubmit = () => {
    newMaster.ipRange = ipRange2
    setSaving(true)
    if(edit){
      callApi(`/rulesrvc/zone/update`, 'POST', newMaster)
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('Master Zone Updated Successfully!')
          handleModalClose()
          downloadData()
          setChanged(false)
        }
      })
      .catch((err) => {
        setSaving(false)
        setChanged(false)
      })
    }else{
    callApi(`/rulesrvc/zone/create`, 'POST', newMaster)
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('Master Zone Added Successfully!')
          handleModalClose()
          downloadData()
        }
      })
      .catch(() => setSaving(false))
    }
  }
  const setError = e => _setErrors({ ...errors, ...e })
  const checkName = () => setError({ name: (newMaster.name || '').length > 1 ? null : 'Name is required' })
  const checkGatewayIp = () => setError({ gatewayIp: (newMaster.gatewayIp || '').length > 1 ? null : 'Gateway IP is required' })
  const checkProxyIp = () => setError({ proxyIp: (newMaster.proxyIp || '').length > 1 ? null : 'Proxy IP is required' })
  const checkCidr = () => setError({ cidr: (newMaster.cidr || '').length > 1 ? null : 'CIDR is required' })
  const lNetwork = () => setError({ lowerNetworkId: (ipRange2.lowerNetworkId <= ipRange2.higherNetworkId) || !ipRange2.higherNetworkId ? null : 'Lower Network Id is invalid' })
  const hNetwork = () => setError({ higherNetworkId: (ipRange2.higherNetworkId >= ipRange2.lowerNetworkId) || !ipRange2.lowerNetworkId ? null : 'Higher Network Id is invalid' })
  const lHost = () => setError({ lowerHostId: (ipRange2.lowerHostId || '') < 255 ? null : 'Invalid data' })
  const hHost = () => setError({ higherHostId: (ipRange2.higherHostId || '') < 255 ? null : 'Invalid data' })

  const body = (
    <AddNewModal
      title={edit ? "Edit Zone Masters" : "Add New Zone Masters"}
      onClose={handleModalClose}
      disabled={!isValid || saving || !changed}
      hidden={!isActiveForRoles(['ORG_ADMIN'])}
      onSubmit={onSubmit}
      saving={saving}
      body={
        <form>
          <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center mb-3">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
              <AppTextInput
                required
                error={!!errors.name}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                onBlur={checkName}
                helperText={errors.name}
                value={newMaster.name} onChange={e => change({ name: e.target.value })}
                label="Name" />
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto">
              <AppCheckbox
                value={newMaster.active} onChange={e => change({ active: Boolean(e) })}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                switchLabel={newMaster.active ? 'Active' : 'In-active'}
                label="Status" />
            </div>
          </div>
          <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center mb-3">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
              <AppTextInput
                required
                error={!!errors.gatewayIp}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                onBlur={checkGatewayIp}
                helperText={errors.gatewayIp}
                value={newMaster.gatewayIp} onChange={e => change({ gatewayIp: e.target.value })}
                label="Gateway IPs" />
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto">
              <AppTextInput
                required
                error={!!errors.proxyIp}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                onBlur={checkProxyIp}
                helperText={errors.proxyIp}
                value={newMaster.proxyIp} onChange={e => change({ proxyIp: e.target.value })}
                label="Proxy IPs" />
            </div>
          </div>
          <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
              <span>IP Range</span>
              <AppTextInput
                value={ipRange2.netmaskId} onChange={e => changeIP({ netmaskId: e.target.value })}
                placeholder="192.168"
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                label="Network" />
            </div>

            <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto mt-4">
              <AppTextInput
                required
                error={!!errors.cidr}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                onBlur={checkCidr}
                helperText={errors.cidr}
                label="CIDR"
                value={newMaster.cidr} onChange={e => change({ cidr: e.target.value })} />
            </div>
          </div>
          <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 pl-0" style={{ display: 'flex' }}>
              <AppTextInput
                value={ipRange2.lowerNetworkId} onChange={e => changeIP({ lowerNetworkId: e.target.value })}
                placeholder="12"
                error={!!errors.lowerNetworkId}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                onBlur={lNetwork}
                helperText={errors.lowerNetworkId}
                label="Lower Network Id" />
              <AppTextInput
                className="ml-3"
                value={ipRange2.lowerHostId} onChange={e => changeIP({ lowerHostId: e.target.value })}
                placeholder="16"
                error={!!errors.lowerHostId}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                onBlur={lHost}
                helperText={errors.lowerHostId}
                label="Lower Host Id" />
              </div>
              <div className="col-12 col-sm-12 col-md-12 col-lg-12 pl-0" style={{ display: 'flex' }}>
              <AppTextInput
                value={ipRange2.higherNetworkId} onChange={e => changeIP({ higherNetworkId: e.target.value })}
                placeholder="45"
                error={!!errors.higherNetworkId}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                onBlur={hNetwork}
                helperText={errors.higherNetworkId}
                label="Higher Network Id" />
              <AppTextInput
                className="ml-3"
                error={!!errors.higherHostId}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                onBlur={hHost}
                helperText={errors.higherHostId}
                value={ipRange2.higherHostId} onChange={e => changeIP({ higherHostId: e.target.value })}
                placeholder="16"
                label="Higher Host Id" />
              </div>
            </div>
          </div>
        </form>
      }
    />
  )

  const deleteApp = () => {
    setSaving(true)
    callApi(`/rulesrvc/zone/delete/${ids}`, 'DELETE')
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('Deleted Successfully!')
          handleDeleteModalClose()
          downloadData()
        }
      })
      .catch(() => setSaving(false))
  }


  const columns = [
    { title: 'Zone Name', field: 'name', cellStyle: { fontWeight: '700', border: 'none' } },
    { title: 'Gateway IP', field: 'gatewayIp' },
    {
      title: 'Status',
      field: 'active',
      render: rowData => {
        return rowData.active === true ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip>
      }
    },
    { title: 'Created By', field: 'createdBy' },
  ]

  return (
    <>
      <AppMaterialTable
      columns={data.length > 0 ? columns : []}
      data={data}
      actions={
        [
        {
          icon: () => isActiveForRoles(['ORG_ADMIN']) && (
            <div onClick={() => {setEdit(false);handleModalOpen()}} style={{ cursor: 'pointer' }} className="primary-btn-view">
              <img src={Plus} alt="" title /> ADD NEW
            </div>
          ),
          isFreeAction: true,
        },
        {
          icon: () => /* isActiveForRoles(['ORG_ADMIN']) && */ (
            isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : <img src={Edit} alt="" title />
          ),
          tooltip: 'Edit Zone',
          // hidden: !isActiveForRoles(['ORG_ADMIN']),
          onClick: (event, rowData) => {
            setNewMaster(rowData);
            setIpRange(rowData.ipRange);
            handleModalOpen();
            setEdit(true);
          }
        },
        {
          icon: () => <img src={Delete} alt="" title />,
          hidden: !isActiveForRoles(['ORG_ADMIN']),
          tooltip: 'Delete Zone',
          onClick: (event, rowData) => handleDeleteModalOpen(rowData.name, rowData.id)
        }
      ]
    }
      body={
        <>
          <Modal open={open} onClose={handleModalClose}>
            {body}
          </Modal>
          {deleteModal ? (<DeleteModal saving={saving} open={deleteModal} onClose={handleDeleteModalClose} name={name} onDelete={deleteApp} />) : (<></>)}
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



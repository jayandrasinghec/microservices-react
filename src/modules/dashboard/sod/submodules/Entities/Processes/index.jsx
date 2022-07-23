import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Modal } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddIcon from "@material-ui/icons/Add";
import Avatar from "@material-ui/core/Avatar";

import { getAuthToken, isActiveForRoles } from '../../../../../../utils/auth';
import ActiveStatusChip from '../../../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../../../components/HOC/InactiveStatusChip';
import AddNewModal from '../../../../../../components/AddNewComponent';
import AddProcessForm from '../../../components/Entities/AddProcessForm/AddProcessForm';
import CustomPagination from '../../../../../../components/CustomPagination';
import CustomMaterialTable from '../../../../../../components/CustomMaterialTable';
import { callApi, search } from '../../../../../../utils/api';
import { showError, showSuccess } from '../../../../../../utils/notifications';
import { EditProcess } from './EditProcess';

const useStyles = makeStyles((theme) => ({
  button: {
    float: 'right',
    borderRadius: '8px',
    marginRight: 20
  },
  rulesSearchAdd: {
    float: "right",
  },
  tableAddIcon: {
    height: 32,
  },
  editDeleteIcon: {
    "& img": {
      width: "16px",
      height: "16px",
    },
  },
}))

const defaultProcess = {
  name: '', 
  description: '', 
  active: false
}

const defaultQuery = {
  "filter": {
    "active": null,
    "name": "",
    "taskId": ""
  },
  "keyword": "",
  "pageSize": 10,
  "pageNumber": 0,
  "sortDirection": "ASC",
  "sortOn": [
      "id"
  ]
}

export const Processes = (props) => {
  const classes = useStyles();

  const [addOpen, setAddOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [newData, setNewData] = useState(defaultProcess)
  const [errors, _setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [totalProcesses, setTotalProcesses] = useState(0);
  const [processData, setProcessData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, _setQuery] = useState(defaultQuery);

  useEffect(() => {
    downloadProcessData()
  }, [query])

  const downloadProcessData = () => {
    setLoading(true)
    callApi(`/sod/process/list`, 'POST', query)
      .then(e => {
        setLoading(false)
        if (e.success) {
          setProcessData(e.data ? e.data.content : [])
          setTotalProcesses(e.data ? e.data.totalElements : 0)
        } 
      })
      .catch(() => setLoading(false))
  }

  const setError = e => _setErrors({ ...errors, ...e })

  const isValid = !Object.values(errors).some(e => e != null) && newData.name

  const checkCname = () => setError({ name: (newData.name || '').trim().length > 0 ? null : 'Process name is required' })
  
  const columns = [
    { title: "Process Name", field: "name" },
    { title: "Process Description", field: "description" },
    {
      title: 'Status',
      field: 'active',
      render: rowData => {
        return rowData.active === true ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip>
      }
    },
  ]

  const handleAddModalOpen = () => {
    setAddOpen(true);
  }

  const handleCloseAddModal = () => {
    setAddOpen(false);
    _setErrors({});
    setNewData(defaultQuery);
  }

  const handleEdit = (data) => {
    setOpenEdit(true);
    setNewData(data)
  }

  const handleSubmit = () => {
    setSaving(true);
    callApi(`/sod/process`, 'POST', newData, getAuthToken(), true)
      .then(e => {
        if (e.success) {
          setNewData(e.data ? e.data : defaultProcess);
          setOpenEdit(true);
          downloadProcessData();
          setSaving(false);
          handleCloseAddModal();
          showSuccess("Process Added successfully");
        } 
      })
      .catch((e) => {
        setSaving(false)
        if (e.errorCode === 'SODSRVC.ALREADY_EXISTS') {
          showError('Process Already Exists')
        } else {
          const value = search(e.errorCode);
          const message = value ? value : e.errorCode
          showError(message)
        }
      })
  }

  const change = e => setNewData({ ...newData, ...e })

  const handleChangePage = (event, newPage) => {
    _setQuery({ ...query, pageNumber: newPage })
  }

  const handleChangeRowsPerPage = (event) => { 
    _setQuery({ ...query, pageNumber: 0, pageSize: parseInt(event, 10) })
  }

  return (
    <>
    {!openEdit && (
      <>
        <CustomMaterialTable
          columns={processData.length > 0 ? columns : []}
          data={processData}
          isLoading={loading}
          actions={
            [
              {
                icon: () => (
                  <span>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      disableElevation
                      disableFocusRipple
                      disableRipple
                      className={classes.tableAddIcon}
                    >
                      Add Process
                    </Button>
                  </span>
                ),
                isFreeAction: true,
                hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
                onClick: () => handleAddModalOpen(),
              },
              {
                icon: () => (
                  isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : 
                  <Avatar
                    src={require("../../../../../../assets/Edit.png")}
                    className={classes.editDeleteIcon}
                  />
                ),
                tooltip: isActiveForRoles(['READ_ONLY']) ? "View Process" : "Edit Process",
                hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']),
                onClick: (event, rowData) => handleEdit(rowData)
              },
            ]
          }
          body={
            <Modal open={addOpen} onClose={handleCloseAddModal}>
              <AddNewModal
                title='Add New Process Definition - SoD'
                onClose={handleCloseAddModal}
                disabled={!isValid || saving}
                onSubmit={handleSubmit}
                saving={saving}
                body={
                  <AddProcessForm
                    newData={newData}
                    errors={errors}
                    checkCname={checkCname}
                    change={change} 
                  />
                }
              />
            </Modal>
          }
        />
        <CustomPagination              
          count={Math.ceil(totalProcesses / query.pageSize)}
          totalCount = {totalProcesses}
          page={query.pageNumber}
          onChangePage={handleChangePage}
          rowsPerPage={query.pageSize}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </>
    )}
    {openEdit && (
      <EditProcess openEdit={openEdit} data={newData} />
    )}
    </>
  )
}

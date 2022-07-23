import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Modal } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddIcon from "@material-ui/icons/Add";
import Avatar from "@material-ui/core/Avatar";

import { getAuthToken, isActiveForRoles } from '../../../../../../utils/auth';
import ActiveStatusChip from '../../../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../../../components/HOC/InactiveStatusChip';
import AppTextInput from '../../../../../../components/form/AppTextInput';
import AppSelectInput from '../../../../../../components/form/AppSelectInput';
import AddNewModal from '../../../../../../components/AddNewComponent';
import AppCheckbox from '../../../../../../components/form/AppCheckbox';
import CustomPagination from '../../../../../../components/CustomPagination';
import CustomMaterialTable from '../../../../../../components/CustomMaterialTable';
import { EditTask } from './EditTask';
import { callApi, search } from '../../../../../../utils/api';
import { showError, showSuccess } from '../../../../../../utils/notifications';

const useStyles = makeStyles(theme => ({
  button: {
    float: 'right',
    borderRadius: '8px',
    marginRight: 20
  },
  item: {
    marginBottom: theme.spacing(2)
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
}));

const defaultTask = {
  active: false,
  description: "",
  name: "",
  riskLevel: ""
}

const defaultQuery = {
  "filter": {
      "active": null,
      "businessRoleId": "",
      "name": "",
      "processId": "",
  },
  "keyword": "",
  "pageSize": 10,
  "pageNumber": 0,
  "sortDirection": "ASC",
  "sortOn": [
      "id"
  ]
}

export const Tasks = (props) => {
  const classes = useStyles();

  const [addOpen, setAddOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [newData, setNewData] = useState(defaultTask);
  const [errors, _setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskData, setTaskData] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [query, _setQuery] = React.useState(defaultQuery);

  const setError = e => _setErrors({ ...errors, ...e })

  const isValid = !Object.values(errors).some(e => e != null) && newData.name && newData.riskLevel && newData.riskLevel !== ''

  const checkName = () => setError({ name: (newData.name || '').trim().length > 0 ? null : 'Task name is required' })
  const checkRiskLevel = () => setError({ riskLevel: (newData.riskLevel || '').length > 1 ? null : 'Task risk level is required' })

  const options = ['HIGH', 'MEDIUM', 'LOW']

  useEffect(() => {
    downloadTaskData()
  }, [query])

  const downloadTaskData = () => {
    setLoading(true)
    callApi(`/sod/task/list`, 'POST', query)
      .then(e => {
        setLoading(false)
        if (e.success) {
          setTaskData(e.data ? e.data.content : [])
          setTotalTasks(e.data ? e.data.totalElements : 0)
        } 
      })
      .catch(() => setLoading(false))
  }

  const columns = [
    { title: "Task Name", field: "name" },
    { title: "Task Description", field: "description" },
    { title: "Risk Score", field: "riskLevel" },
    {
      title: 'Status',
      field: 'active',
      render: rowData => {
        return rowData.active === true ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip>
      }
    },
  ]

  const change = e => setNewData({ ...newData, ...e })

  const handleAddModalOpen = () => {
    setAddOpen(true);
  }

  const handleAddModalClose = () => {
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
    callApi(`/sod/task`, 'POST', newData, getAuthToken(), true)
      .then(e => {
        if (e.success) {
          setNewData(e.data ? e.data : defaultTask);
          setOpenEdit(true);
          // setNewData(defaultTask)
          downloadTaskData();
          setSaving(false);
          handleAddModalClose();
          showSuccess("Task Added successfully");
        } 
      })
      .catch((e) => {
        setSaving(false)
        if (e.errorCode === 'SODSRVC.ALREADY_EXISTS') {
          showError('Task Already Exists')
        } else {
          const value = search(e.errorCode);
          const message = value ? value : e.errorCode
          showError(message)
        }
      })
  }

  const handleChangePage = (event, newPage) => {
    _setQuery({ ...query, pageNumber: newPage })
  }

  const handleChangeRowsPerPage = (event) => { 
    _setQuery({ ...query, pageNumber: 0, pageSize: parseInt(event, 10) })
  }

  const modalBody = (
    <Grid container spacing={16}>
      <Grid item xs={12} className={classes.item}>
        <AppTextInput
          required
          value={newData.name}
          error={!!errors.name}
          onBlur={checkName}
          helperText={errors.name}
          onChange={e => change({ name: e.target.value })}
          label="Task Name" />
      </Grid>
      <Grid item xs={12} className={classes.item}>
        <AppTextInput
          value={newData.description}
          onChange={e => change({ description: e.target.value })}
          label="Task Description"
          multiline
          rows={3}
        />
      </Grid>
      <Grid item xs={12} className={classes.item}>
        <AppCheckbox
          value={newData.active} 
          onChange={e => change({ active: Boolean(e) })}
          switchLabel={newData.active === true ? 'Active' : 'Inactive'}
          label="Status" 
        />
      </Grid>
      <Grid item xs={12} className={classes.item}>
        <AppSelectInput
          value={newData.riskLevel}
          required
          label="Risk Score"
          onChange={e => change({ riskLevel: e.target.value })}
          options={options.map(opt => opt)}
          error={!!errors.riskLevel}
          helperText={errors.riskLevel}
          onBlur={checkRiskLevel}
          // labels={options.map(opt => opt.label)}
        />
      </Grid>
    </Grid>
  )

  return (
    <>
      {!openEdit && (
        <>
          <CustomMaterialTable
            columns={taskData.length > 0 ? columns : []}
            data={taskData}
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
                        Add Task
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
                  tooltip: isActiveForRoles(['READ_ONLY']) ? "View Task" : "Edit Task",
                  hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']),
                  onClick: (event, rowData) => handleEdit(rowData)
                },
              ]
            }
            body={
              <Modal open={addOpen} onClose={handleAddModalClose}>
                <AddNewModal
                  title='Add New Task Definition - SoD'
                  onClose={handleAddModalClose}
                  disabled={!isValid || saving}
                  onSubmit={handleSubmit}
                  saving={saving}
                  body={modalBody}
                />
              </Modal>
            }
          />
          <CustomPagination              
            count={Math.ceil(totalTasks / query.pageSize)}
            totalCount = {totalTasks}
            page={query.pageNumber}
            onChangePage={handleChangePage}
            rowsPerPage={query.pageSize}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </>
      )}
      {openEdit && (
        <EditTask openEdit={openEdit} data={newData} errors={errors} checkRiskLevel={checkRiskLevel} />
      )}
    </>  
  )
}

import React, { useEffect, useState } from 'react';
import { Link as Linking } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormControlLabel, Grid, Switch } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddIcon from "@material-ui/icons/Add";
import Avatar from "@material-ui/core/Avatar";

import { isActiveForRoles } from '../../../../../../utils/auth';
import ActiveStatusChip from '../../../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../../../components/HOC/InactiveStatusChip';
import AppTextInput from '../../../../../../components/form/AppTextInput';
import DeleteModal from '../../../../../../components/DeleteModal';
import EditWarningModal from '../../../../../../components/EditWarningModal';
import CustomPagination from '../../../../../../components/CustomPagination';
import CustomMaterialTable from '../../../../../../components/CustomMaterialTable';
import CardViewWrapper from '../../../../../../components/HOC/CardViewWrapper';
import AppSelectInput from '../../../../../../components/form/AppSelectInput';
import { callApi } from '../../../../../../utils/api';
import { showSuccess } from '../../../../../../utils/notifications';
import { AsyncAutoComplete } from '../../../../administartion/components/AsyncAutocomplete';

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

export const EditProcess = (props) => {
  const { data, openEdit } = props;
  const classes = useStyles();

  const [openDelete, setOpenDelete] = useState(false);
  const [newData, setNewData] = useState(data);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [ids, setIds] = useState('');
  const [task, setTask] = useState(null);
  const [taskList, setTaskList] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [linkedTaskData, setLinkedTaskData] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultQuery = {
    "filter": {
      "active": null,
      "businessRoleId": "",
      "name": "",
      "processId": newData.id ? newData.id : "",
    },
    "keyword": "",
    "pageSize": 10,
    "pageNumber": 0,
    "sortDirection": "ASC",
    "sortOn": [
        "id"
    ]
  }

  const defaultTaskListQuery = {
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

  const [query, _setQuery] = useState(defaultQuery);
  const [taskListquery, _setTaskListQuery] = useState(defaultTaskListQuery);

  useEffect(() => {
    downloadLinkedTaskData()
  }, [query])

  const downloadLinkedTaskData = () => {
    setLoading(true)
    callApi(`/sod/task/list`, 'POST', query)
      .then(e => {
        setLoading(false)
        if (e.success) {
          setLinkedTaskData(e.data ? e.data.content : [])
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

  const confirmStatus = () => {
    setNewData({...newData, active: !newData.active})
    setOpenEditModal(false);
    setChanged(true);
  }

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  }

  const handleProcessEdit = () => {
    setSaving(true);
    callApi(`/sod/process/${newData.id}`, 'PUT', newData)
      .then(e => {
        if (e.success) {
          setNewData(e.data)
          setSaving(false);
          showSuccess("Process Updated Successfully.");
        } 
      })
      .catch(() => setSaving(false))
  }

  const handleDeleteModalOpen = (name, id) => {
    setOpenDelete(true);
    setName(name);
    setIds(id);
  }

  const handleDeleteModalclose = () =>{
    setOpenDelete(false);
    setName('');
    setIds('');
  } 

  const handleDelete = () => {
    const data = {
      "processId": newData.id,
      "taskId": ids
    }
    setSaving(true);
    callApi(`/sod/process/removeTask`, 'PUT', data)
      .then(e => {
        if (e.success) {
          setSaving(false);
          setOpenDelete(false);
          downloadLinkedTaskData();
          showSuccess("Linked Task Deleted Successfully.");
        } 
      })
      .catch(() => setSaving(false))
  }

  const handleAddTask = () => {
    const data = {
      "processId": newData.id,
      "taskId": task.id
    }
    setSaving(true);
    callApi(`/sod/process/addTask`, 'PUT', data)
      .then(e => {
        if (e.success) {
          setSaving(false);
          setTask(null);
          downloadLinkedTaskData();
          showSuccess("Task Linked Successfully.");
        } 
      })
      .catch(() => setSaving(false))
  }

  const getLinkedTaskData = (value, success, error) => {
    let obj = taskListquery;
    obj.filter.name = value;
    callApi(`/sod/task/list`, 'POST', obj)
    .then(e => {
      if (e.success) {
        setTaskList(e.data ? e.data.content : [])
        success(e.data ? e.data.content : [])
      } 
    })
  }

  const change = e => {
    setNewData({ ...newData, ...e })
    setChanged(true)
  }

  const handleChangePage = (event, newPage) => {
    _setQuery({ ...query, pageNumber: newPage })
  }

  const handleChangeRowsPerPage = (event) => { 
    _setQuery({ ...query, pageNumber: 0, pageSize: parseInt(event, 10) })
  }

  const des =  newData.active ? 
    'The action cannot be performed as the process has active task linked to it. Please unlink the task before marking inactive.' :
    'The action cannot be performed as the process has active task linked to it. Please unlink the task before marking active.'

  return (
    <>
      <Grid container>
        <Grid item xs={12} spacing={3,2} style={{ margin: '16px 16px 0px'}}>
          <Linking to="/dash/sod/entities/processes">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="small"
              disableElevation
            >
              Back To Process List
            </Button>
          </Linking>
        </Grid>
        <Grid item xs={12}>
          <CardViewWrapper>
            <Grid container spacing={2}>
              <Grid item xs={12}><h5>Edit Process</h5></Grid>
              <Grid item xs={12}>
                <Grid container spacing={3} alignItems="center" alignContent="center">
                  <Grid item xs={12} lg={3}>Name <span className="text-danger">*</span></Grid>
                  <Grid item xs={12} lg={6}>
                    <AppTextInput
                      disabled={openEdit}
                      value={newData.name}
                      onChange={e => change({ name: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3} alignContent="center">
                  <Grid item xs={12} lg={3}>Description</Grid>
                  <Grid item xs={12} lg={6}>
                    <AppTextInput
                      value={newData.description}
                      onChange={e => change({ description: e.target.value })}
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3} alignItems="center" alignContent="center">
                  <Grid item xs={12} lg={3}>Status</Grid>
                  <Grid item xs={12} lg={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="status"
                          color="primary"
                          checked={newData.active}
                          disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                          // onChange={(e) => handleEditStatus(e.target.checked)}
                          onChange={(e) => setOpenEditModal(true)}
                        />
                      }
                    />
                    <EditWarningModal 
                      title={ newData.active ? `Mark Process Inactive - ${newData.name}` : `Mark Process Active - ${newData.name}`}
                      // des='The action cannot be performed as the process has active task linked to it. 
                      //   Please unlink the task before marking inactive.'
                      des={des}
                      open={openEditModal} 
                      confirm={confirmStatus}
                      close={handleCloseEditModal}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <div style={{display: 'flex', marginTop: '16px'}}>
              <Grid item xs={8}>
                <Linking to="/dash/sod/entities/processes">
                <Button>
                  Discard
                </Button>
                </Linking>
              </Grid>
              {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && <Grid item xs={4}>
                <Button 
                  className={classes.button} 
                  onClick={handleProcessEdit} 
                  disabled={saving || !changed}
                  variant="contained" 
                  color="primary"
                >
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </Grid>}
            </div>
          </CardViewWrapper>
        </Grid>
        <Grid item xs={12}>
          <CardViewWrapper>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h5>Link Task</h5>
                <Grid container justify="space-between" className="pt-3">
                  <Grid item xs={6}>
                    <AsyncAutoComplete
                      label=""
                      value={task}
                      style={{ maxWidth: 300 }}
                      disabled={isActiveForRoles(['READ_ONLY'])}
                      getOptionLabel={(option, allOptions) => {
                        if (typeof option === "object") {
                          return option.name;
                        } else {
                          return '';
                        }
                      }}
                      api={(value, success, error) => {
                        getLinkedTaskData(value, success, error)
                      }}
                      onLoadApiCall={true}
                      onChange={(event, newValue, reason) => {
                        if(newValue){
                          setTask(newValue)
                        }

                        if(reason === 'clear') {
                          setTask(null)
                        }          
                      }}
                      isSetOptions={true}
                      allOptions={taskList}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      disabled={!task}
                      disableElevation
                      disableFocusRipple
                      disableRipple
                      onClick={handleAddTask}
                      style={{ float: 'right', marginTop: 4 }}
                    >
                      Link Task Definition
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardViewWrapper>
          <CustomMaterialTable
            columns={linkedTaskData.length > 0 ? columns : []}
            data={linkedTaskData}
            isLoading={loading}
            title='Linked Task'
            actions={
              [
                {
                  icon: () => (
                    isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : 
                    <Avatar
                      src={require("../../../../../../assets/Delete.png")}
                      className={classes.editDeleteIcon}
                    />
                  ),
                  tooltip: "Delete",
                  hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
                  onClick: (event, rowData) => handleDeleteModalOpen(rowData.name, rowData.id)
                },
              ]
            }
            body={
              <DeleteModal 
                saving={saving} 
                open={openDelete} 
                onClose={handleDeleteModalclose} 
                onDelete={handleDelete}
                name={name}
                desc='Are you sure you want to remove linked task. 
                  Warning! This action cannot be undone.' 
              /> 
            }
          />
          <Grid item xs={12} spacing={3,2} style={{margin: 16}}>
            <CustomPagination              
              count={Math.ceil(totalTasks / query.pageSize)}
              totalCount = {totalTasks}
              page={query.pageNumber}
              onChangePage={handleChangePage}
              rowsPerPage={query.pageSize}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

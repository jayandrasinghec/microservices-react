import React, { useEffect, useState } from 'react';
import { Link as Linking } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormControlLabel, Grid, Switch } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddIcon from "@material-ui/icons/Add";
import Avatar from "@material-ui/core/Avatar";

import { isActiveForRoles } from '../../../../../../utils/auth';
import ActiveStatusChip from '../../../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../../../components/HOC/InactiveStatusChip';
import AppTextInput from '../../../../../../components/form/AppTextInput';
import AppSelectInput from '../../../../../../components/form/AppSelectInput';
import EditWarningModal from '../../../../../../components/EditWarningModal';
import DeleteModal from '../../../../../../components/DeleteModal';
import CustomPagination from '../../../../../../components/CustomPagination';
import CustomMaterialTable from '../../../../../../components/CustomMaterialTable';
import CardViewWrapper from '../../../../../../components/HOC/CardViewWrapper';
import { callApi } from '../../../../../../utils/api';
import { showSuccess } from '../../../../../../utils/notifications';
import { AsyncAutoComplete } from '../../../../administartion/components/AsyncAutocomplete';
import { errors } from '../../../../../../utils/error';

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


export const EditTask = (props) => {
  const { data, openEdit, errors, setError } = props;
  const classes = useStyles();

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [newData, setNewData] = useState(data);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [ids, setIds] = useState('');
  const [businessRole, setBusinessRole] = useState(null);
  const [businessRoleList, setBusinessRoleList] = useState([]);
  const [linkedBusinessRoleData, setLinkedBusinessRoleData] = useState([]);
  const [total, setTotal] = useState(0);
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultQuery = {
    "filter": {
      "active": null,
      "name": "",
      "taskId": newData.id ? newData.id : ""
    },
    "keyword": "",
    "pageSize": 10,
    "pageNumber": 0,
    "sortDirection": "ASC",
    "sortOn": [
      "id"
    ]
  }

  const defaultBusinessRoleListQuery = {
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


  const [query, _setQuery] = React.useState(defaultQuery);
  const [businessRoleListQuery, _setProcessListQuery] = useState(defaultBusinessRoleListQuery);

  useEffect(() => {
    downloadLinkedBusinessRoleData()
  }, [query])

  const downloadLinkedBusinessRoleData = () => {
    setLoading(true)
    callApi(`/sod/businessRole/list`, 'POST', query)
      .then(e => {
        setLoading(false)
        if (e.success) {
          setLinkedBusinessRoleData(e.data ? e.data.content : [])
          setTotal(e.data ? e.data.totalElements : 0)
        } 
      })
      .catch(() => setLoading(false))
  }

  const options = ['HIGH', 'MEDIUM', 'LOW']

  const columns = [
    { title: "Business Role Name", field: "name" },
    { title: "Business Role Description", field: "description" },
    {
      title: 'Status',
      field: 'active',
      render: rowData => {
        return rowData.active === true ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip>
      }
    },
  ]

  const change = e => {
    setNewData({ ...newData, ...e })
    setChanged(true)
  }

  const isValid = newData.name && newData.riskLevel && newData.riskLevel !== ''

  const checkName = () => setError({ name: (newData.name || '').length > 1 ? null : 'Task name is required' })
  const checkRiskLevel = () => setError({ riskLevel: (newData.riskLevel || '').length > 1 ? null : 'Task risk level is required' })

  const confirmStatus = () => {
    setNewData({...newData, active: !newData.active})
    setOpenEditModal(false);
    setChanged(true);
  }

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  }

  const handleTaskEdit = () => {
    setSaving(true);
    callApi(`/sod/task/${newData.id}`, 'PUT', newData)
      .then(e => {
        if (e.success) {
          setNewData(e.data)
          setSaving(false);
          setChanged(false);
          showSuccess("Task Updated Successfully.");
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
      "taskId": newData.id,
      "businessRoleId": ids
    }
    setSaving(true);
    callApi(`/sod/task/removeBusinessRole`, 'PUT', data)
      .then(e => {
        if (e.success) {
          setSaving(false);
          setOpenDelete(false);
          downloadLinkedBusinessRoleData();
          showSuccess("Linked Business Role Deleted Successfully.");
        } 
      })
      .catch(() => setSaving(false))
  }

  const handleAddBusinessRole = () => {
    const data = {
      "taskId": newData.id,
      "businessRoleId": businessRole.id
    }
    setSaving(true);
    callApi(`/sod/task/addBusinessRole`, 'PUT', data)
      .then(e => {
        if (e.success) {
          setSaving(false);
          setBusinessRole(null);
          downloadLinkedBusinessRoleData();
          showSuccess("Business Role Linked Successfully.");
        } 
      })
      .catch(() => setSaving(false))
  }

  const getBusinessRoleData = (value, success, error) => {
    let obj = businessRoleListQuery;
    obj.filter.name = value;
    callApi(`/sod/businessRole/list`, 'POST', obj)
    .then(e => {
      if (e.success) {
        setBusinessRoleList(e.data ? e.data.content : [])
        success(e.data ? e.data.content : [])
      } 
    })
  }

  const handleChangePage = (event, newPage) => {
    _setQuery({ ...query, pageNumber: newPage })
  }

  const handleChangeRowsPerPage = (event) => { 
    _setQuery({ ...query, pageNumber: 0, pageSize: parseInt(event, 10) })
  }

  const des =  newData.active ? 
    'The action cannot be performed as the task has active process linked to it. Please unlink the process before marking inactive.' :
    'The action cannot be performed as the task has active process linked to it. Please unlink the process before marking active.'

  return (
    <>
      <Grid container>
        <Grid item xs={12} spacing={3,2} style={{ margin: '16px 16px 0px'}}>
          <Linking to="/dash/sod/entities/tasks">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="small"
              disableElevation
            >
              Back To Task List
            </Button>
          </Linking>
        </Grid>
        <Grid item xs={12}>
          <CardViewWrapper>
            <Grid container spacing={2}>
              <Grid item xs={12}><h5>Edit Task - SoD</h5></Grid>
              <Grid item xs={12}>
                <Grid container spacing={3} alignItems="center" alignContent="center">
                  <Grid item xs={12} lg={3}>Name <span className="text-danger">*</span></Grid>
                  <Grid item xs={12} lg={6}>
                    <AppTextInput
                      value={newData.name}
                      disabled={openEdit}
                      onChange={e => change({ name: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3} alignItems="center" alignContent="center">
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
                          onChange={(e) => setOpenEditModal(true)}
                        />
                      }
                    />
                  </Grid>
                  <EditWarningModal
                    title='Changing process status to inactive'
                    // des='The action cannot be performed as the process has active task linked to it. 
                    //   Please unlink the task before marking inactive.'
                    des={des}
                    open={openEditModal} 
                    confirm={confirmStatus}
                    close={handleCloseEditModal}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3} alignItems="center" alignContent="center">
                  <Grid item xs={12} lg={3}>Risk Score <span className="text-danger">*</span></Grid>
                  <Grid item xs={12} lg={6}>
                    <AppSelectInput
                      value={newData.riskLevel}
                      onChange={e => change({ riskLevel: e.target.value })}
                      options={options.map(opt => opt)}
                      error={!!errors.riskLevel}
                      helperText={errors.riskLevel}
                      onBlur={checkRiskLevel}
                      // labels={options.map(opt => opt.label)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <div style={{display: 'flex', marginTop: '24px'}}>
              <Grid item xs={8}>
                <Linking to="/dash/sod/entities/tasks">
                <Button>
                  Discard
                </Button>
                </Linking>
              </Grid>
              {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && <Grid item xs={4}>
                <Button 
                  className={classes.button} 
                  onClick={handleTaskEdit} 
                  disabled={saving || !changed || !isValid}
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
                <h5>Link Business Role</h5>
                <Grid container justify="space-between" className="pt-3">
                  <Grid item xs={6}>
                    <AsyncAutoComplete
                      label=""
                      value={businessRole}
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
                        getBusinessRoleData(value, success, error)
                      }}
                      onLoadApiCall={true}
                      onChange={(event, newValue, reason) => {
                        if(newValue){
                          setBusinessRole(newValue)
                        }

                        if(reason === 'clear') {
                          setBusinessRole(null)
                        }          
                      }}
                      isSetOptions={true}
                      allOptions={businessRoleList}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!businessRole}
                      startIcon={<AddIcon />}
                      disableElevation
                      disableFocusRipple
                      disableRipple
                      onClick={handleAddBusinessRole}
                      style={{ float: 'right', marginTop: 4 }}
                    >
                      Link Business Role Definition
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardViewWrapper>
          <CustomMaterialTable
            columns={linkedBusinessRoleData.length > 0 ? columns : []}
            data={linkedBusinessRoleData}
            title='Linked Business Role'
            isLoading={loading}
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
                desc='Are you sure you want to remove linked business role. 
                  Warning! This action cannot be undone.' 
              /> 
            }
          />
          <Grid item xs={12} spacing={3,2} style={{margin: 16}}>
            <CustomPagination              
              count={Math.ceil(total / query.pageSize)}
              totalCount = {total}
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
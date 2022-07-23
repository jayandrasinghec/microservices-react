import React, { useEffect, useState } from 'react';
import { Link as Linking } from 'react-router-dom'
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { Grid, makeStyles, Button, Tab, FormControlLabel, Switch, Modal } from '@material-ui/core';
import AddIcon from "@material-ui/icons/Add";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Avatar from "@material-ui/core/Avatar";

import ActiveStatusChip from '../../../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../../../components/HOC/InactiveStatusChip';
import { getAuthToken, isActiveForRoles } from '../../../../../../utils/auth';
import CustomPagination from '../../../../../../components/CustomPagination';
import AppTextInput from '../../../../../../components/form/AppTextInput';
import { SodTasks } from './SoDTasks';
import { ApplicationRoles } from './ApplicationRoles';
import CardViewWrapper from '../../../../../../components/HOC/CardViewWrapper';
import CustomMaterialTable from '../../../../../../components/CustomMaterialTable';
import { callApi, search } from '../../../../../../utils/api';
import { showError, showSuccess } from '../../../../../../utils/notifications';
import EditWarningModal from '../../../../../../components/EditWarningModal';
import AddBusinessRoleForm from '../../../components/Entities/AddBusinessRoleForm/AddBusinessRoleForm';
import AddNewModal from '../../../../../../components/AddNewComponent';

const useStyles = makeStyles(theme => ({
  button: {
    borderRadius: '8px',
    marginRight: 20
  },
  tabs: {
    padding: 0
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

const defaultRole = {
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


export const BusinessRoles = (props) => {
  const classes = useStyles();
  
  const [newData, setNewData] = useState(defaultRole);
  const [query, _setQuery] = React.useState(defaultQuery);
  const [errors, _setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openAddBusinessRoleModal, setOpenAddBusinessRoleModal] = useState(false);
  const [openBusinessRoleEdit, setOpenBusinessRoleEdit] = useState(false);
  const [tabValue, setTabValue] = useState("1");
  const [total, setTotal] = useState(0);
  const [businessRoleData, setBusinessRoleData] = useState([]);
  const [changed, setChanged] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    downloadBusinessRoleData()
  }, [query])

  const downloadBusinessRoleData = () => {
    setLoading(true)
    callApi(`/sod/businessRole/list`, 'POST', query)
      .then(e => {
        setLoading(false)
        if (e.success) {
          setBusinessRoleData(e.data ? e.data.content : [])
          setTotal(e.data ? e.data.totalElements : 0)
        } 
      })
      .catch(() => setLoading(false))
  }

  const handleTabChange = (e, val) => {
    setTabValue(val)
  }

  const setError = e => _setErrors({ ...errors, ...e });

  const isValid = !Object.values(errors).some(e => e != null) && newData.name;

  const checkCname = () => setError({ name: (newData.name || '').trim().length > 0 ? null : 'Business role name is required' });
  
  const change = e => {
    setNewData({ ...newData, ...e })
    setChanged(true)
  }
  
  const columns = [
    { title: 'Business Role Name', field: 'name' },
    { title: 'Business Role Description', field: 'description' },
    { title: 'Status', field: 'active',
      render: rowData => rowData.active === true ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip> },
  ]

  const handleAddClick = () => {
    setOpenAddBusinessRoleModal(true);
  }

  const handleCloseBusinessRoleModal = () => {
    setOpenAddBusinessRoleModal(false);
    _setErrors({});
    setNewData(defaultQuery);
  }

  const handleEditClick = (data) => {
    setOpenBusinessRoleEdit(true);
    setNewData(data);
  }

  const handleCancel = () => {
    setOpenBusinessRoleEdit(false);
    _setErrors({});
  }

  const handleAddSubmit = () => {
    setSaving(true);
    callApi(`/sod/businessRole`, 'POST', newData, getAuthToken(), true)
      .then(e => {
        if (e.success) {
          setNewData(e.data ? e.data : defaultRole);
          setOpenBusinessRoleEdit(true); 
          downloadBusinessRoleData();
          setSaving(false);
          setChanged(false);
          showSuccess("Business Role Added successfully");
        } 
      })
      .catch((e) => {
        setSaving(false)
        if (e.errorCode === 'SODSRVC.ALREADY_EXISTS') {
          showError('Business Role Already Exists')
        } else {
          const value = search(e.errorCode);
          const message = value ? value : e.errorCode
          showError(message)
        }
      })
  }

  const handleEditSubmit = () => {
    setSaving(true);
    callApi(`/sod//businessRole/${newData.id}`, 'PUT', newData)
      .then(e => {
        if (e.success) {
          setNewData(e.data)
          setSaving(false);
          setChanged(false);
          showSuccess("Business Role Updated Successfully.");
        } 
      })
      .catch(() => setSaving(false))
  }

  const handleChangePage = (event, newPage) => {
    _setQuery({ ...query, pageNumber: newPage })
  }

  const handleChangeRowsPerPage = (event) => { 
    _setQuery({ ...query, pageNumber: 0, pageSize: parseInt(event, 10) })
  }

  const confirmStatus = () => {
    setNewData({...newData, active: !newData.active})
    setChanged(true);
    setOpenEditModal(false);
  }

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  }

  const des =  newData.active ? 
    'The action cannot be performed as the business role has active task linked to it. Please unlink the task before marking inactive.' :
    'The action cannot be performed as the business role has active task linked to it. Please unlink the task before marking active.'

  return (
   <> 
    {!openBusinessRoleEdit && <>
      <CustomMaterialTable
        columns={businessRoleData.length > 0 ? columns : []}
        data={businessRoleData}
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
                    Add Business Role
                  </Button>
                </span>
              ),
              isFreeAction: true,
              hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
              onClick: () => handleAddClick(),
            },
            {
              icon: () => (
                isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : 
                <Avatar
                  src={require("../../../../../../assets/Edit.png")}
                  className={classes.editDeleteIcon}
                />
              ),
              tooltip: isActiveForRoles(['READ_ONLY']) ? "View Business Role" : "Edit Business Role",
              hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']),
              onClick: (event, rowData) => handleEditClick(rowData)
            },
          ]
        }
        body={
          <Modal open={openAddBusinessRoleModal} onClose={handleCloseBusinessRoleModal}>
            <AddNewModal
              title='Add New Business Role - SoD'
              onClose={handleCloseBusinessRoleModal}
              disabled={!isValid || saving}
              onSubmit={handleAddSubmit}
              saving={saving}
              body={
                <AddBusinessRoleForm
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
        count={Math.ceil(total / query.pageSize)}
        totalCount = {total}
        page={query.pageNumber}
        onChangePage={handleChangePage}
        rowsPerPage={query.pageSize}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>}
    {openBusinessRoleEdit && 
    <Grid container>
      <Grid item xs={12} spacing={3,2} style={{ margin: '16px 16px 0px'}}>
        <Linking to="/dash/sod/entities/business-roles">
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="small"
            disableElevation
          >
            Back To Business Roles List
          </Button>
        </Linking>
      </Grid>
      <Grid item xs={12}>
        <CardViewWrapper>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h5>Edit Business Role</h5>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} alignContent='center' alignItems='center'>
                <Grid item xs={12}>
                  <Grid container spacing={3} alignContent="center" alignItems='center'>
                    <Grid item xs={12} lg={3}>
                      Business Role Name <span className='text-danger'>*</span>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <AppTextInput
                        value={newData.name}
                        disabled={openBusinessRoleEdit}
                        error={!!errors.name}
                        onBlur={checkCname}
                        helperText={errors.name}
                        onChange={e => change({ name: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3} alignContent="center" alignItems='center'>
                    <Grid item xs={12} lg={3}>
                      Business Role Description
                    </Grid>
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
                  <Grid container spacing={3} alignContent="center" alignItems='center'>
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
                      <EditWarningModal 
                        title={ newData.active ? `Mark Business Role Inactive - ${newData.name}` : `Mark Business Role Active - ${newData.name}`}
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
              <Grid container justify='space-between' style={{ marginTop: '24px' }}>
                <Grid item >
                  <Button onClick={handleCancel}>Discard</Button>
                </Grid>
                {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && <Grid item>
                  <Button 
                    className={classes.button} 
                    disabled={!changed || saving} 
                    variant="contained" 
                    color="primary"
                    onClick={handleEditSubmit}
                  >
                    {!saving ? 'Save' : 'Saving'}
                  </Button>
                </Grid>}
              </Grid>
            </Grid>
          </Grid>
        </CardViewWrapper>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <TabContext value={tabValue} >
            <Grid item xs={12}>
              <CardViewWrapper>
                <TabList onChange={handleTabChange} textColor='primary' indicatorColor='primary' aria-label="simple tabs example">
                  <Tab label="SoD Tasks" value="1" />
                  <Tab label="Application Roles" value="2" />
                </TabList>
              </CardViewWrapper>
            </Grid>
            <Grid item xs={12}>
              <TabPanel className={classes.tabs} value="1" ><SodTasks data={newData} /></TabPanel>
              <TabPanel className={classes.tabs} value="2"><ApplicationRoles data={newData} /></TabPanel>
            </Grid>
          </TabContext>
        </Grid>
      </Grid>
    </Grid>}
  </>
  )
}
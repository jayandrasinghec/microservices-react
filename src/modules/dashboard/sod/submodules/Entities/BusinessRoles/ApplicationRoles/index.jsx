import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import AddIcon from "@material-ui/icons/Add";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Avatar from "@material-ui/core/Avatar";

import DeleteModal from '../../../../../../../components/DeleteModal';
import { isActiveForRoles } from '../../../../../../../utils/auth';
import AppSelectInput from '../../../../../../../components/form/AppSelectInput';
import CustomPagination from '../../../../../../../components/CustomPagination';
import CustomMaterialTable from '../../../../../../../components/CustomMaterialTable';
import CardViewWrapper from '../../../../../../../components/HOC/CardViewWrapper';
import { AsyncAutoComplete } from '../../../../../administartion/components/AsyncAutocomplete';
import { callApi } from '../../../../../../../utils/api';
import { showSuccess } from '../../../../../../../utils/notifications';

const useStyles = makeStyles(theme => ({
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


export const ApplicationRoles = (props) => {
  const { data } = props;
  const classes = useStyles();

  const [saving, setSaving] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [newData, setNewData] = useState(data);
  const [name, setName] = useState('');
  const [ids, setIds] = useState('');
  const [appId, setAppId] = useState('');
  const [total, setTotal] = useState(0);
  const [app, setApp] = useState(null);
  const [appList, setAppList] = useState([]);
  const [appRole, setAppRole] = useState(null);
  const [appRoleList, setAppRoleList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [linkedAppRoleData, setLinkedAppRoleData] = useState([]);

  const defaultQuery = {
    "filter": {
      "active": null,
      "businessRoleId": newData.id ? newData.id : "",
      "cosoType": "",
      "roleName": ""
    },
    "keyword": "",
    "pageNumber": 0,
    "pageSize": 10,
    "sortDirection": "ASC",
    "sortOn": [
      "id"
    ]
  }

  const defaultAppListQuery = {
    displayName: "",
    order: "asc",
    pageNo: 0,
    size: 10,
    sortBy: "displayName",
    tag: ""
  }

  const [query, _setQuery] = React.useState(defaultQuery);
  const [appListquery, _setAppListQuery] = useState(defaultAppListQuery);

  useEffect(() => {
    app && getAppRoleData()
  }, [app])

  useEffect(() => {
    downloadLinkedAppRoleData()
  }, [query])

  const downloadLinkedAppRoleData = () => {
    setLoading(true)
    callApi(`/provsrvc/applicationRole/list`, 'POST', query)
      .then(e => {
        setLoading(false)
        if (e.success) {
          setLinkedAppRoleData(e.data ? e.data.content : [])
          setTotal(e.data ? e.data.totalElements : 0)
        } 
      })
      .catch(() => setLoading(false))
  }

  const columns = [
    { title: 'Linked Applcation Roles', field: 'roleName' },
  ];

  const handleDeleteModalOpen = (name, id, appId) => {
    setOpenDelete(true);
    setName(name);
    setIds(id);
    setAppId(appId);
  }

  const handleDeleteModalclose = () =>{
    setOpenDelete(false);
    setName('');
    setIds('');
  } 

  const handleDelete = () => {
    const data = {
      "businessRoleId": newData.id,
      "applicationId": appId,
      "applicationRoleId": ids
    }
    setSaving(true);
    callApi(`/sod/businessRole/removeAppRole`, 'PUT', data)
      .then(e => {
        if (e.success) {
          setSaving(false);
          setOpenDelete(false);
          downloadLinkedAppRoleData();
          showSuccess("Linked App Role Deleted Successfully.");
        } 
      })
      .catch(() => setSaving(false))
  }

  const getAppData = (value, success, error) => {
    let obj = appListquery;
    obj.displayName = value;
    callApi(`/provsrvc/applicationTenant/applicationListByPage`, 'POST', obj)
    .then(e => {
      if (e.success) {
        setAppList(e.data && e.data.content ? e.data.content : [])
        success(e.data && e.data.content ? e.data.content : [])
      } 
    })
  }

  const getAppRoleData = (value, success, error) => {
    callApi(`/provsrvc/applicationRole/findByApplicationId/${app.id}`, 'GET')
      .then(e => {
        if (e.success) {
          setAppRoleList(e.data ? e.data : [])
          success && success(e.data ? e.data : [])
        } 
      })
  }

  const handleAddTask = () => {
    const data = {
      "applicationId": app.id,
      "applicationRoleId": appRole,
      "businessRoleId": newData.id
    }
    setSaving(true);
    callApi(`/sod/businessRole/addAppRole`, 'PUT', data)
      .then(e => {
        if (e.success) {
          setSaving(false);
          setApp(null);
          setAppRole(null);
          downloadLinkedAppRoleData();
          showSuccess("App Role Linked Successfully.");
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

  return (
    <>
      <CardViewWrapper>
        <h5>Link Application Role to Business Role - SoD</h5>
        <Grid container justify="space-between" className="pt-3">
          <Grid item xs={4}>
            <AsyncAutoComplete
              label="Application"
              value={app}
              style={{ maxWidth: 300 }}
              disabled={isActiveForRoles(['READ_ONLY'])}
              getOptionLabel={(option, allOptions) => {
                if (typeof option === "object") {
                  return option.appName;
                } else {
                  return '';
                }
              }}
              api={(value, success, error) => {
                getAppData(value, success, error)
              }}
              onLoadApiCall={true}
              onChange={(event, newValue, reason) => {
                if(newValue){
                  setApp(newValue)
                }

                if(reason === 'clear') {
                  setApp(null)
                }          
              }}
              isSetOptions={true}
              allOptions={appList}
            />
          </Grid>
          { app ?
            <Grid item xs={4}>
              {/* <AsyncAutoComplete
                label="Application Role"
                value={appRole}
                style={{ maxWidth: 300 }}
                disabled={isActiveForRoles(['READ_ONLY']) || !app}
                getOptionLabel={(option, allOptions) => {
                  if (typeof option === "object") {
                    return option.roleName;
                  } else {
                    return '';
                  }
                }}
                api={(value, success, error) => {
                  getAppRoleData(value, success, error)
                }}
                onChangeApiCall={false}
                onLoadApiCall={true}
                onChange={(event, newValue, reason) => {
                  if(newValue){
                    setAppRole(newValue)
                  }

                  if(reason === 'clear') {
                    setAppRole(null)
                  }          
                }}
                isSetOptions={true}
                allOptions={appRoleList}
              /> */}
              <AppSelectInput
                style={{ maxWidth: 300 }}
                label="Application Role"
                value={appRole}
                onChange={e => setAppRole(e.target.value)}
                labels={appRoleList.map(role => role.roleName)}
                options={appRoleList.map(role => role.id)}
              />
            </Grid> : null
          }
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              disabled={!appRole}
              disableElevation
              disableFocusRipple
              disableRipple
              onClick={handleAddTask}
              style={{ float: 'right', marginTop: 30 }}
            >
              Link Application Role
            </Button>
          </Grid>
        </Grid>
      </CardViewWrapper>
      <CustomMaterialTable
        columns={linkedAppRoleData.length > 0 ? columns : []}
        data={linkedAppRoleData}
        isLoading={loading}
        title='Linked Application Roles to Business Role - SoD'
        actions={
          [
            {
              icon: () => (
                isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : 
                <Avatar
                  src={require("../../../../../../../assets/Delete.png")}
                  className={classes.editDeleteIcon}
                />
              ),
              tooltip: "Delete",
              hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
              onClick: (event, rowData) =>
                handleDeleteModalOpen(rowData.name, rowData.id, rowData.applicationId)
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
            desc='Are you sure you want to remove linked process. 
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
    </>
  )
}

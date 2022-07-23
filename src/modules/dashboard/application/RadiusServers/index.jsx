import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Button, Grid, Modal } from "@material-ui/core";
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddIcon from "@material-ui/icons/Add";

import AddNewModal from '../../../../components/AddNewComponent';
import AppSelectInput from "../../../../components/form/AppSelectInput";
import AppTextInput from "../../../../components/form/AppTextInput";
import CustomMaterialTable from "../../../../components/CustomMaterialTable";
import { isActiveForRoles } from "../../../../utils/auth";
import { callApi } from "../../../../utils/api";
import { showError, showSuccess } from "../../../../utils/notifications";
import CustomPagination from "../../../../components/CustomPagination";

const useStyles = makeStyles(theme => ({
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

const defaultData = {
  "radius_server_ip":"",
  "radius_http_port":"",
  "domain": "https",
  "base_url": "",
  "tenant": ""
}

const dummyData = [
  {radius_server_ip: '127.0.0.1', radius_http_port: '3001', domain: 'https', base_url: 'cymmetri.in', tenant: 'mdrona1'},
  {radius_server_ip: '127.0.0.2', radius_http_port: '3002', domain: 'http', base_url: 'unotech.in', tenant: 'mdrona2'},
  {radius_server_ip: '127.0.0.3', radius_http_port: '3003', domain: 'https', base_url: 'redhat.in', tenant: 'mdrona3'},
  {radius_server_ip: '127.0.0.4', radius_http_port: '3004', domain: 'http', base_url: 'cymm.in', tenant: 'mdrona4'},
]

export default function RadiusServers(props) {
  const classes = useStyles();

  const [addOpen, setAddOpen] = useState(false);
  const [mode, setMode] = useState("Add");
  const [newData, setNewData] = useState(defaultData);
  const [errors, _setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [configFilter, setConfigFilter] = useState({
    limit: 5,
    page: 0
})

  const columns = [
    { title: "Radius IP", field: "radius_server_ip" },
    { title: "Radius HTTP Port", field: "radius_http_port" },
    { title: "Domain", field: "domain" },
    { title: "Base URL", field: "base_url" },
    { title: "Tenant", field: "tenant" },
  ]

  const options = [
    {label: 'HTTP', value: 'http'},
    {label: 'HTTPS', value: 'https'}
  ]

  const downloadData = () => {
    setLoading(true)
    callApi(`/radiussrvc/listConfigs?limit=${configFilter.limit}&page=${configFilter.page+1}`)
      .then(e => {
        setLoading(false)
        if (e.success) {
          setData(e.data ? e.data.elements : [])
          setTotal(e.data ? e.data.totalElements : 0)
        } 
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    downloadData()
  }, [configFilter])

  const isValid = !Object.values(errors).some(e => e != null) && newData.radius_server_ip && newData.radius_http_port && newData.domain && newData.base_url && newData.tenant

  const setError = e => _setErrors({ ...errors, ...e })

  const change = e => {
    setChanged(true)
    setNewData({ ...newData, ...e })
  }
  
  const checkFields = (e) => {
    if(!(newData[e.target.name]).toString().length) {
      setError({ [e.target.name] : `This field is required.` })
    } else {
      setError({ [e.target.name] : null })
    }
  }

  const handleAddModalOpen = () => {
    setAddOpen(true);
  }

  const handleAddModalClose = () => {
    setAddOpen(false);
    setNewData(defaultData);
    setChanged(false)
    _setErrors({})
  }

  const handleEdit = (data) => {
    setMode("Edit")
    setNewData(data)
    handleAddModalOpen()
  }

  const handleSubmit = () => {
    setSaving(true);
    if(newData.id) {
      callApi(`/radiussrvc/updateConfig/${newData.id}`, 'PUT', newData)
      .then(e => {
        setNewData(defaultData);
        setSaving(false);
        handleAddModalClose();
        downloadData();
        showSuccess("Config Updated Successfully.");
      })
      .catch((err) => {
        setSaving(false)
      })
    } else {
      setSaving(false)
      callApi(`/radiussrvc/createConfig`, 'POST', newData)
      .then(e => {
        setNewData(defaultData);
        setSaving(false);
        handleAddModalClose();
        downloadData();
        showSuccess("Config Added Successfully.");
      })
      .catch((err) => {
        setSaving(false)
      })
    }
    
  }

  const handlePush = (data) => {
    callApi(`/radiussrvc/pushConfig/${data.id}`, 'POST')
      .then(e => {
        if(e.success) {
          showSuccess("Configuration Pushed Successfully.")
        } else {
          showError("Some error occured.")
        }
      })
      .catch((err) => {})
  }

  const handleChangePage = (event, newPage) => {
    setConfigFilter({ ...configFilter, page: newPage });
  }
  const handleChangeRowsPerPage = (event) => {
    setConfigFilter({ ...configFilter,page: 0, limit: parseInt(event, 10) });
  }

  const modalBody = (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6} className={classes.item}>
          <AppTextInput
            required
            name="radius_server_ip"
            value={newData.radius_server_ip}
            error={!!errors.radius_server_ip}
            onBlur={checkFields}
            helperText={errors.radius_server_ip}
            onChange={e => change({ radius_server_ip: e.target.value })}
            label="Radius Server IP" />
        </Grid>
        <Grid item xs={6} className={classes.item}>
          <AppTextInput
            required
            type="number"
            name="radius_http_port"
            value={newData.radius_http_port}
            error={!!errors.radius_http_port}
            onBlur={checkFields}
            helperText={errors.radius_http_port}
            onChange={e => change({ radius_http_port: e.target.value })}
            label="Radius HTTP Port"
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={6} className={classes.item}>
          <AppSelectInput
            required
            name="domain"
            value={newData.domain}
            label="Domain"
            onChange={e => change({ domain: e.target.value })}
            options={options.map(opt => opt.value)}
            labels={options.map(opt => opt.label)}
            error={!!errors.domain}
            onBlur={checkFields}
            helperText={errors.domain}
          />
        </Grid>
        <Grid item xs={6} className={classes.item}>
          <AppTextInput
            required
            name="base_url"
            value={newData.base_url}
            error={!!errors.base_url}
            onBlur={checkFields}
            helperText={errors.base_url}
            onChange={e => change({ base_url: e.target.value })}
            label="Base URL"
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={6} className={classes.item}>
          <AppTextInput
            required
            name="tenant"
            value={newData.tenant}
            error={!!errors.tenant}
            onBlur={checkFields}
            helperText={errors.tenant}
            onChange={e => change({ tenant: e.target.value })}
            label="Tenant"
          />
        </Grid>
      </Grid>
    </>
  )

  return (
    <>
      <CustomMaterialTable
        columns={data.length > 0 ? columns : []}
        data={data}
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
                    Add New
                  </Button>
                </span>
              ),
              isFreeAction: true,
              hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
              onClick: () => {handleAddModalOpen(); setMode("Add"); },
            },
            {
              icon: () => (
                isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : 
                <Avatar
                  src={require("../../../../assets/Edit.png")}
                  className={classes.editDeleteIcon}
                />
              ),
              tooltip: "Edit",
              hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
              onClick: (event, rowData) => handleEdit(rowData)
            },
            {
              icon: () => (
                isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : 
                <Avatar
                  src={require("../../../../assets/push.png")}
                  className={classes.editDeleteIcon}
                />
              ),
              tooltip: "Push",
              hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
              onClick: (event, rowData) => handlePush(rowData)
            }
          ]
        }
        body={
          <Modal open={addOpen} onClose={handleAddModalClose}>
            <AddNewModal
              title={`${mode} Radius Proxy Server Config`}
              onClose={handleAddModalClose}
              disabled={!isValid || saving || !changed}
              onSubmit={handleSubmit}
              saving={saving}
              body={modalBody}
            />
          </Modal>
        }
      />
      <CustomPagination
        count={Math.ceil(total / configFilter.limit)}
        totalCount = {total}
        page={configFilter.page}
        onChangePage={handleChangePage}
        rowsPerPage={configFilter.limit}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
}

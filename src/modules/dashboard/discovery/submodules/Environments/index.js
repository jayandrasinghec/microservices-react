/* eslint-disable react/display-name */
import React, { useState } from 'react'
import Modal from '@material-ui/core/Modal'
import MenuItem from '@material-ui/core/MenuItem'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
 
import Plus from './../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/plus.svg'
import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications'
import AppCheckbox from '../../../../../components/form/AppCheckbox'
// import AppCheckbox from '../../../../../components/form/AppTextInput'
import AppTextInput from '../../../../../components/form/AppTextInput'
import AppSelectInput from '../../../../../components/form/AppSelectInput'
import ActiveStatusChip from '../../../../../components/HOC/ActiveStatusChip'
import InactiveStatusChip from '../../../../../components/HOC/InactiveStatusChip'
import AddNewModal from '../../../../../components/AddNewComponent'
import DropDown from '../../../../../components/DropDownComponent'
import AppMaterialTable from '../../../../../components/AppMaterialTable';
import Edit from './../../../../../FrontendDesigns/new/assets/img/icons/edit.svg'
import {isActiveForRoles} from '../../../../../utils/auth'
import CustomPagination from '../../../../../components/CustomPagination'
import { Button, Grid, IconButton, InputAdornment, makeStyles } from '@material-ui/core'
import { FormatListBulletedRounded, Visibility, VisibilityOff } from '@material-ui/icons'
import CardViewWrapper from '../../../../../components/HOC/CardViewWrapper'
import AppTextInputProps from '../../../../../components/form/AppTextInputProps'

const useStyles = makeStyles(theme => ({
  button: {
    borderRadius: '8px',
    marginRight: 20,
    color: '#fff'
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
  input: {
    height: 40
  },
}));

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

const defaultNewData = {
  'env_type': '',
  'env_name': '',
  'active': false,
  "config_objects": {}
}

export default function Environment() {
  const classes = useStyles()
  const [newMaster, setNewMaster] = useState(defaultMaster)

  const [newData, setNewData] = useState(defaultNewData);
  const [newCred, setNewCred] = useState('');
  const [envFilter, setEnvFilter] = useState({
      type: 'All',
      limit: 10,
      page: 0
  })
  const [typeOptions, setTypeOptions] = useState(['All', 'AD', 'AWS', 'Azure']);
  const [data, setData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0)
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [credSaving, setCredSaving] = useState(false);
  const [errors, _setErrors] = useState({});
  const [credError, setCredError] = useState('');
  const [showPassword, setShowPassword] = React.useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleModalOpen = () => {
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
    setEdit(false);
    setNewData(defaultNewData);
    setNewCred('')
    _setErrors({})
  };

  const downloadData = () => {
    callApi(`/iddiscsrvc/envconfig/?${envFilter.type === 'All' ? '' : `type=${envFilter.type}&`}limit=${envFilter.limit}&page=${envFilter.page + 1}`)
      .then(e => {
        if (e.code == 200 ) {
          setData(e.data && e.message !== 'Empty list returned' ? e.data : [])
          setTotalUsers(e.data ? e.count : 0)
        } 
      })
  }

  const downloadEnvById = (id) => {
    callApi(`/iddiscsrvc/envconfig/${id}`)
      .then(e => {
        if (e && e.code == 200 && e.data[0]) {
          let obj = e.data[0];
          if(obj.env_type === 'AWS' && obj.config_objects.aws_secret_key) {
            setNewCred(obj.config_objects.aws_secret_key);
            delete obj.config_objects.aws_secret_key
          }else if(obj.env_type === 'AD' && obj.config_objects.ad_password) {
            setNewCred(obj.config_objects.ad_password);
            delete obj.config_objects.ad_password;
          }
          setNewData(obj)
        } 
      })
  }

  React.useEffect(() => downloadData(), [envFilter])

  const onSubmit = () => {
    setSaving(true)
    callApi(`/iddiscsrvc/envconfig/${edit ? newData.id : ''}`, edit ? 'PUT' : 'POST', newData)
      .then(res => {
        setSaving(false)
        if(res && res.code == 200) {
          downloadData();
          showSuccess(`Environment ${edit ? 'updated' : 'added'} successfully!`);
          handleModalClose()
        }
      })
      .catch(err => {
        setSaving(false);
        handleModalClose();
      })
  }

  const onCredSubmit = () => {
    setCredSaving(true)
    let body = {
      'credential': newCred
    }
    callApi(`/iddiscsrvc/envconfig/updateCredential/${newData.id}?type=${newData.env_type}`, 'PUT', body)
      .then(res => {
        setCredSaving(false)
        if(res && res.code == 200) {
          downloadData(); 
          showSuccess(`Environment ${edit ? 'updated' : 'added'} successfully!`);
        }
        handleModalClose()
      })
      .catch(err => {
        setCredSaving(false);
        handleModalClose();
      })
  }

  const handleChangePage = (event, newPage) => {
    setEnvFilter({ ...envFilter, page: newPage });
  }
  const handleChangeRowsPerPage = (event) => {
    setEnvFilter({ ...envFilter,page: 0, limit: parseInt(event, 10) });
  }

  const change = e => setNewData({ ...newData, ...e })
  // Validations
  const setError = e => _setErrors({ ...errors, ...e })
  const checkValue = (e) => {
    if((e.target.value).length == 0) {
      setError({ [e.target.name]: 'This field is required' })
    }else{
      setError({ [e.target.name]: null })
    }
  }
  const isValid = !Object.values(errors).some((e) => e != null) && newData.env_type && newData.env_name && (
    (newData.env_type === 'AD' && newData.config_objects.Domain_Controller_Address && newData.config_objects.Admin_User && newData.config_objects.Domain) ||
    (newData.env_type === 'AWS' && newData.config_objects.aws_profile_name && newData.config_objects.aws_access_key_id && newData.config_objects.region && newData.config_objects.output) ||
    (newData.env_type === 'Azure' && newData.config_objects.cloudName && newData.config_objects.tenantId && newData.config_objects.id && newData.config_objects.name && (newData.config_objects.user && newData.config_objects.user.name))
    )

  const columns = [
    { title: 'Name', field: 'env_name', cellStyle: { fontWeight: '700', border: 'none' } },
    { title: 'Type', field: 'env_type' },
    {
      title: 'Status',
      field: 'active',
      render: rowData => {
        return rowData.active === true ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip>
      }
    }
  ]

  return (
    <>
    { !open && 
    <Grid>
      <AppMaterialTable
        columns={data.length > 0 ? columns : []}
        data={data}
        actions={[
          {
            icon: () => isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && (
              <div style={{ display: 'flex' }}>
                <DropDown title={envFilter.type} options={typeOptions} body={
                  typeOptions.map(type => {
                    return (
                      <MenuItem key={type} onClick={e => { setEnvFilter({ ...envFilter, type: type }) }}>
                        <div style={{ display: 'flex' }}>
                          <span style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '12px', lineHeight: '20px', color: '#8998AC', marginLeft: '0px' }}>{type}</span>
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
            onClick: (event, rowData) => { 
              setEdit(true);
              handleModalOpen();
              downloadEnvById(rowData.id)
            }
          },
        ]}
      />
      <CustomPagination
        count={Math.ceil(totalUsers / envFilter.limit)}
        totalCount = {totalUsers}
        page={envFilter.page}
        onChangePage={handleChangePage}
        rowsPerPage={envFilter.limit}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Grid> }
    { open && 
    <Grid container>
      <Grid item xs={12} spacing={3,2} style={{ margin: '16px 16px 0px'}}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="small"
            disableElevation
            onClick={handleModalClose}
          >
            Back to enviroment list
          </Button>
      </Grid>
      <Grid item xs={12}>
        <CardViewWrapper>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h5>{edit ? "Edit Environment" : "Add Environment"}</h5>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12}>
                    <AppSelectInput
                        label="Type"
                        name="env_type"
                        required
                        value={newData.env_type}
                        disabled={edit || !isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                        error={!!errors.env_type}
                        onBlur={checkValue}
                        helperText={errors.env_type}
                        // onChange={e => change({ env_type: e.target.value, config_objects: {} })}
                        onChange={e => setNewData({ env_type: e.target.value, config_objects: {}, env_name: '', active: false }, _setErrors({}))}
                        options={['AD', 'AWS', 'Azure']} 
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <AppTextInput
                        required
                        name="env_name"
                        error={!!errors.env_name}
                        helperText={errors.env_name}
                        onBlur={checkValue}
                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                        value={newData.env_name}
                        onChange={e => change({ env_name: e.target.value })}
                        // onChange={e => setNewData({ ...newData, env_name: e.target.value })}
                        label="Name" 
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6} justify="center" alignContent="center">
                    <AppCheckbox
                        value={newData.active}
                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])} 
                        // onChange={e => change({ active: Boolean(e) })}
                        onChange={e => change({ active: !newData.active })}
                        switchLabel={newData.active ? 'Active' : 'In-active'}
                        label="Status" 
                    />
                </Grid>
                { newData.env_type === 'AWS' && <>
                <Grid item xs={12} sm={6} md={6}>
                    <AppTextInput
                        required
                        error={!!errors.aws_profile_name}
                        name="aws_profile_name"
                        onBlur={checkValue}
                        helperText={errors.aws_profile_name}
                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                        value={newData.config_objects.aws_profile_name}
                        onChange={e => change({ config_objects: { ...newData.config_objects, aws_profile_name: e.target.value} })}
                        label="Profile Name" 
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <AppTextInput
                        required
                        error={!!errors.aws_access_key_id}
                        name="aws_access_key_id"
                        onBlur={checkValue}
                        helperText={errors.aws_access_key_id}
                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                        value={newData.config_objects.aws_access_key_id}
                        // onChange={e => change({ accessKey: e.target.value })}
                        onChange={e => change({ config_objects: { ...newData.config_objects, aws_access_key_id: e.target.value} })}
                        label="Access key" 
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <AppTextInput
                        required
                        error={!!errors.region}
                        name="region"
                        onBlur={checkValue}
                        helperText={errors.region}
                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                        value={newData.config_objects.region}
                        // onChange={e => change({ region: e.target.value })}
                        onChange={e => change({ config_objects: { ...newData.config_objects, region: e.target.value} })}
                        label="Region" 
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <AppTextInput
                        required
                        error={!!errors.output}
                        name="output"
                        onBlur={checkValue}
                        helperText={errors.output}
                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                        value={newData.config_objects.output}
                        // onChange={e => change({ output: e.target.value })}
                        onChange={e => change({ config_objects: { ...newData.config_objects, output: e.target.value} })}
                        label="Output" 
                    />
                </Grid> </>
                }
                { newData.env_type === 'AD' && <>
                  <Grid item xs={12} sm={6} md={6}>
                    <AppTextInput
                      required
                      error={!!errors.Domain_Controller_Address}
                      name="Domain_Controller_Address"
                      onBlur={checkValue}
                      helperText={errors.Domain_Controller_Address}
                      disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                      value={newData.config_objects.Domain_Controller_Address}
                      // onChange={e => change({ domainConAddress: e.target.value })}
                      onChange={e => change({ config_objects: { ...newData.config_objects, Domain_Controller_Address: e.target.value} })}
                      label="Domain Controller Address" 
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <AppTextInput
                      required
                      error={!!errors.Domain}
                      name="Domain"
                      onBlur={checkValue}
                      helperText={errors.Domain}
                      disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                      value={newData.config_objects.Domain}
                      // onChange={e => change({ domain: e.target.value })}
                      onChange={e => change({ config_objects: { ...newData.config_objects, Domain: e.target.value} })}
                      label="Domain" 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <AppTextInput
                      required
                      error={!!errors.Admin_User}
                      name="Admin_User"
                      onBlur={checkValue}
                      helperText={errors.Admin_User}
                      disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                      value={newData.config_objects.Admin_User}
                      // onChange={e => change({ Admin_User: e.target.value })}
                      onChange={e => change({ config_objects: { ...newData.config_objects, Admin_User: e.target.value} })}
                      label="Admin User" 
                    />
                  </Grid> </>
                }
                { newData.env_type === 'Azure' && <>
                  <Grid item xs={12} sm={6} md={6}>
                    <AppTextInput
                      required
                      error={!!errors.cloudName}
                      name="cloudName"
                      onBlur={checkValue}
                      helperText={errors.cloudName}
                      disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                      value={newData.config_objects.cloudName}
                      // onChange={e => change({ cloudName: e.target.value })}
                      onChange={e => change({ config_objects: { ...newData.config_objects, cloudName: e.target.value} })}
                      label="Cloud Name" 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <AppTextInput
                        required
                        error={!!errors.tenantId}
                        name="tenantId"
                        onBlur={checkValue}
                        helperText={errors.tenantId}
                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                        value={newData.config_objects.tenantId}
                        onChange={e => change({ config_objects: { ...newData.config_objects, tenantId: e.target.value} })}
                        // onChange={e => change({ tenantId: e.target.value })}
                        label="Tenant ID" 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <AppTextInput
                        required
                        error={!!errors.id}
                        name="id"
                        onBlur={checkValue}
                        helperText={errors.id}
                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                        value={newData.config_objects.id}
                        onChange={e => change({ config_objects: { ...newData.config_objects, id: e.target.value} })}
                        // onChange={e => change({ id: e.target.value })}
                        label="ID" 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <AppCheckbox
                      value={newData.config_objects.isDefault}
                      disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])} 
                      onChange={e => change({ config_objects: { ...newData.config_objects, isDefault: e} })}
                      // onChange={e => change({ isDefault: Boolean(e) })}
                      switchLabel={newData.config_objects.isDefault ? 'True' : 'False'}
                      label="isDefault" 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <AppTextInput
                        required
                        error={!!errors.name}
                        name="name"
                        onBlur={checkValue}
                        helperText={errors.name}
                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                        value={newData.config_objects.name}
                        onChange={e => change({ config_objects: { ...newData.config_objects, name: e.target.value} })}
                        // onChange={e => change({ name: e.target.value })}
                        label="Name" 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <AppTextInput
                        required
                        error={!!errors.user}
                        name="user"
                        onBlur={checkValue}
                        helperText={errors.user}
                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                        value={newData.config_objects && newData.config_objects.user && newData.config_objects.user.name ? newData.config_objects.user.name : ''}
                        onChange={e => change({ config_objects: { ...newData.config_objects, user: { name: e.target.value }} })}
                        // onChange={e => change({ userName: e.target.value })}
                        label="User Name" 
                    />
                  </Grid>
                </> }
              </Grid>
              <Grid container justify='space-between' style={{ marginTop: '24px' }}>
                <Grid item >
                  <Button onClick={() => handleModalClose()}>Discard</Button>
                </Grid>
                {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && <Grid item>
                  <Button 
                    className={classes.button} 
                    disabled={saving || !isValid} 
                    variant="contained" 
                    color="primary"
                    onClick={onSubmit}
                  >
                    {!saving ? 'Save' : 'Saving'}
                  </Button>
                </Grid>}
              </Grid>
            </Grid>
          </Grid>
        </CardViewWrapper>
      </Grid>
      { edit && (newData.env_type === 'AWS' || newData.env_type === 'AD') &&
      <Grid item xs={12}>
        <CardViewWrapper>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {/* <h5>{edit ? "Secret Key" : "Add Environment"}</h5> */}
              <h5>Credentials</h5>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              {/* <AppTextInput */}
                <AppTextInputProps
                  required
                  error={!!credError}
                  onBlur={(e) => setCredError((e.target.value).length > 0 ? null : 'This field is required')}
                  name="cred"
                  helperText={credError}
                  autoComplete="off"
                  type={showPassword ? "text" : "password"}   
                  disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                  value={newCred}
                  onChange={e => setNewCred(e.target.value)}
                  // onChange={e => change({ name: e.target.value })}
                  label="Secret Key" 
                  InputProps={{
                    className: classes.input,
                    endAdornment: <InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                  }}
              />
            </Grid>
            {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && 
              <Grid item xs={12}>
                <Button 
                  className={classes.button + ' float-right'} 
                  disabled={credError || credSaving || !newCred} 
                  variant="contained" 
                  color="primary"
                  onClick={onCredSubmit}
                >
                  {!credSaving ? 'Save' : 'Saving'}
                </Button>
              </Grid>}
          </Grid>
        </CardViewWrapper>
      </Grid> }
    </Grid> }
    </>
  )
}



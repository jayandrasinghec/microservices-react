import React, { useState, useEffect } from 'react';
import { Button, Avatar, makeStyles, Modal, Grid, TextField } from '@material-ui/core';
import { Add, Visibility } from "@material-ui/icons";
import CustomMaterialTable from '../../../../../../components/CustomMaterialTable';
import { isActiveForRoles, getAuthToken } from '../../../../../../utils/auth';
import ActiveStatusChip from '../../../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../../../components/HOC/InactiveStatusChip';
import CustomPagination from '../../../../../../components/CustomPagination';
import AddNewModal from '../../../../../../components/AddNewComponent';
import CardViewWrapper from '../../../../../../components/HOC/CardViewWrapper';
import AppCheckbox from '../../../../../../components/form/AppCheckbox';
import AppTextInput from '../../../../../../components/form/AppTextInput';
import AppSelectInput from '../../../../../../components/form/AppSelectInput';
import DeleteModal from '../../../../../../components/DeleteModal';
import RuleForm from '../../../components/Policies/RuleForm/RuleForm';
import AppMaterialTable from '../../../../../../components/AppMaterialTable';
import { callApi, search } from '../../../../../../utils/api';
import { showSuccess, showError } from '../../../../../../utils/notifications';
import { AsyncAutoComplete } from '../../../../administartion/components/AsyncAutocomplete';
import { useHistory } from 'react-router';
import EditWarningModal from '../../../../../../components/EditWarningModal';
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  cardViewWrapper: {
    padding: theme.spacing(3, 2),
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
  },
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

const defaultRule = {
  name: '', 
  description: '',
  entityType1: 'Business Role A',
  entityType2: 'Business Role B',
  entityValue1: '',
  entityValue2: '',
  active: false
}

const defaultRuleQuery = {
  filter: {
    policyId : "",
    name : "",
    active: null
  },
  keyword: "",
  pageNumber: 0,
  pageSize: 10,
  sortDirection: "ASC",
  sortOn: [
    "id"
  ]
}

const defaultPolicyQuery = {
  filter: {
    ruleId : "",
    name :"",
    active: null
  },
  keyword: "",
  pageNumber: 0,
  pageSize: 10,
  sortDirection: "ASC",
  sortOn: [
    "id"
  ]
}

const defaultBusinessRoleQuery = {
  filter: {
    active: null,
    from: "",
    to: ""
  },
  keyword: "",
  pageNumber: 0,
  pageSize: 10,
  sortDirection: "ASC",
  sortOn: [
    "id"
  ]
}

const Rules = () => {
  const classes = useStyles();
  const history = useHistory();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditScreen, setOpenEditScreen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [newData, setNewData] = useState(defaultRule);
  const [rulesData, setRulesData] = useState([]);
  const [policiesData, setPoliciesData] = useState([]);
  const [errors, _setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [totalRules, setTotalRules] = useState(0);
  const [totalPolicies, setTotalPolicies] = useState(0);
  const [query, _setQuery] = useState(defaultRuleQuery);
  const [policyQuery, setPolicyQuery] = useState(defaultPolicyQuery);
  const [businessRoleQuery, setBusinessRoleQuery] = useState(defaultBusinessRoleQuery);
  const [roleList, setRoleList] = useState([]);
  const [policiesList, setPoliciesList] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [openEditWarningModal, setOpenEditWarningModal] = useState(false);
  
  const setError = e => _setErrors({ ...errors, ...e })

  const isValid = !Object.values(errors).some(e => e != null) && newData.name && newData.entityValue1 && newData.entityValue2 && newData.entityValue1 !== '' && newData.entityValue2 !== '' && 
    newData.entityValue1 !== newData.entityValue2 && roleList.find(role => role.name === newData.entityValue1) && roleList.find(role => role.name === newData.entityValue2);

  const checkRuleName = () => setError({ name: (newData.name || '').trim().length > 0 ? null : 'Rule name is required' })
  const checkRuleRole1 = () => setError({ entityValue1: (newData.entityValue1 || '').length > 1 && roleList.find(role => role.name === newData.entityValue1) ? null : 'Business Role A is required' })
  const checkRuleRole2 = () => setError({ entityValue2: (newData.entityValue2 || '').length > 1 && roleList.find(role => role.name === newData.entityValue2) ? null : 'Business Role B is required' })

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  }

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    _setErrors({});
    setNewData(defaultRule);
  }

  const handleOpenEditRule = (data) => {
    setNewData(data)
    setPolicyQuery({ ...policyQuery, filter: { ...policyQuery.filter, ruleId: data.id, active: true }});
    setOpenEditScreen(true);
  }

  const loadBusinessRoleList = () => {  
    callApi(`/sod/businessRole/list`, 'POST', businessRoleQuery)
      .then(res => {
        if (res.success) {
          setRoleList(res.data && res.data.content ? res.data.content : []);
        }
      })
  }
  
  useEffect(() => {
    loadBusinessRoleList();
  }, [])

  const loadRulesData = () => {
    setLoading(true);
    callApi(`/sod/rule/list`, 'POST', query)
      .then(res => {
        if(res.success){
          setRulesData(res.data && res.data.content ? res.data.content : []);
          setTotalRules(res.data && res.data.totalElements ? res.data.totalElements : 0);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    loadRulesData();
  }, [query]);

  const handleRuleSubmit = () => {
    setSaving(true);
    callApi(`/sod/rule`, 'POST', newData, getAuthToken(), true)
      .then(res => {
        if(res.success){
          setNewData(res.data ? res.data : defaultRule)
          handleOpenEditRule(res.data);
          loadRulesData();
          setOpenAddModal(false);
          showSuccess('Rule created sucessfully.');
        }
        setSaving(false);
      })
      .catch((e) => {
        setSaving(false);
        if (e.errorCode === 'SODSRVC.ALREADY_EXISTS') {
          showError('Rule Already Exists');
        } else {
          const value = search(e.errorCode);
          const message = value ? value : e.errorCode;
          showError(message);
        }
      });
  }

  const handleEditRule = () => {
    setSaving(true);
    callApi(`/sod/rule/${newData.id}`, 'PUT', newData)
      .then(res => {
        if (res.success) {
          setNewData(res.data);
          setSaving(false);
          showSuccess("Rule Updated Successfully.");
        } 
      })
      .catch(() => setSaving(false))
  }

  const loadPoliciesList = (value, success, error) => {
    let policyObj = defaultPolicyQuery;
    policyObj.filter.name = value;
    callApi(`/sod/policy/list`, 'POST', policyObj)
      .then(res => {
        if(res.success){
          setPoliciesList(res.data && res.data.content ? res.data.content : []);
          success(res.data ? res.data.content : [])
        }
      })
  }

  const loadPoliciesData = () => {
    setLoading(true);
    callApi(`/sod/policy/list`, 'POST', policyQuery)
      .then(res => {
        if(res.success){
          setPoliciesData(res.data && res.data.content ? res.data.content : []);
          setTotalPolicies(res.data && res.data.totalElements ? res.data.totalElements : 0);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  }

  useEffect(() => {
    loadPoliciesData();
  }, [policyQuery]);

  const handlePolicyLink = () => {
    const policyData = {
      ruleId: newData.id,
      policyId: selectedPolicy.id
    }
    setSaving(true);
    callApi(`/sod/policy/addRule`, 'PUT', policyData)
      .then(res => {
        if(res.success){
          setSelectedPolicy(null);
          loadPoliciesData();
          showSuccess('Policy linked successfully.');
        }
        setSaving(false);
      }).catch(() => setSaving(false));
  }

  const handleDeletePolicyLink = () => {
    const policyData = {
      ruleId: newData.id,
      policyId: id
    }
    setSaving(true);
    callApi(`/sod/policy/removeRule`, 'PUT', policyData)
      .then(res => {
        if(res.success){
          handleCloseDeleteModal();
          loadPoliciesData();
          showSuccess('Linked policy deleted successfully.');
        }
        setSaving(false);
      }).catch(() => setSaving(false));
  }

  const handleCloseEditRule = () => {
    setOpenEditScreen(false);
    _setErrors({});
    setNewData(defaultRule);
  }

  const confirmStatus = () => {
    setNewData({...newData, active: !newData.active})
    setOpenEditWarningModal(false);
  }

  const handleOpenDeleteModal = (name, id) => {
    setOpenDeleteModal(true);
    setName(name);
    setId(id);
  }

  const handleCloseDeleteModal = () =>{
    setOpenDeleteModal(false);
    setName('');
    setId('');
  } 

  const handleFormchange = e => setNewData({ ...newData, ...e })

  const handleChangeRulesPage = (event, newPage) => {
    _setQuery({ ...query, pageNumber: newPage });
  }

  const handleChangeRowsPerRulesPage = (event) => { 
    _setQuery({ ...query, pageNumber: 0, pageSize: parseInt(event, 10) });
  }

  const handleChangePoliciesPage = (event, newPage) => {
    setPolicyQuery({ ...policyQuery, pageNumber: newPage });
  }

  const handleChangeRowsPerPoliciesPage = (event) => { 
    setPolicyQuery({ ...policyQuery, pageNumber: 0, pageSize: parseInt(event, 10) });
  }

  const rulesColumns=[
    { title: 'Rule Name', field: 'name' },
    { title: 'Business Role A', field: 'entityValue1' },
    { title: 'Business Role B', field: 'entityValue2' },
    {
      title: 'Status',
      field: 'active',
      render: rowData => {
        return rowData.active === true ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip>
      }
    }
  ];

  const policiesColumns=[
    { title: 'Policy Name', field: 'name' },
    { title: 'Policy Description', field: 'description' },
    { title: 'Policy Owner', field: 'owner' },
    {
      title: 'Status',
      field: 'active',
      render: rowData => {
        return rowData.active === true ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip>
      }
    }
  ];

  const matchedColumns = [
    { title: 'user', field: 'user' },
    { title: 'Business Role A', field: 'role1' },
    { title: 'Business Role B', field: 'role2' },
  ]

  const data3 =[
    { user: 'John Doe', role1: 'Developer', role2: 'Business Analyst' },
    { user: 'Mark Twain', role1: 'Developer', role2: 'Business Analyst' }
  ]
  return(
    <>
      {!openEditScreen && <>
        <CustomMaterialTable
          columns={rulesData.length > 0 ? rulesColumns : []}
          data={rulesData}
          isLoading={loading}
          onSearchChange={(key) => {
            _setQuery({ ...query, keyword: key });
          }}
          actions={[
            {
              icon: () => (
                <span>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    disableElevation
                    disableFocusRipple
                    disableRipple
                    className={classes.tableAddIcon}
                  >
                    Add Rule
                  </Button>
                </span>
              ),
              isFreeAction: true,
              hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
              onClick: () => handleOpenAddModal(),
            },
            {
              icon: () => (
                isActiveForRoles(['READ_ONLY']) ? <Visibility style={{ color: '#ddd' }}/> : 
                <Avatar
                  src={require("../../../../../../assets/Edit.png")}
                  className={classes.editDeleteIcon}
                />
              ),
              tooltip: isActiveForRoles(['READ_ONLY']) ? "View Rule" : "Edit Rule",
              hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']),
              onClick: (event, rowData) => handleOpenEditRule(rowData)
            },
          ]}
          body={
            <Modal open={openAddModal} onClose={handleCloseAddModal} style={{ overflowY: 'auto' }}>
              <AddNewModal
                title='Create SOD Rule'
                onClose={handleCloseAddModal}
                disabled={!isValid || saving}
                onSubmit={handleRuleSubmit}
                saving={saving}
                body={<>
                  <RuleForm
                    newData={newData}
                    errors={errors}
                    checkRuleName={checkRuleName}
                    checkRuleRole1={checkRuleRole1}
                    checkRuleRole2={checkRuleRole2}
                    change={handleFormchange}
                    roleList={roleList}
                    setNewData={setNewData}
                    setBusinessRoleQuery={setBusinessRoleQuery}
                    businessRoleQuery={businessRoleQuery}
                    loadBusinessRoleList={loadBusinessRoleList}
                  />
                  <AppMaterialTable
                    title='Matched Criteria Results'
                    columns={data3.length > 0 ? matchedColumns : []}
                    data={data3}
                  />
                </>}
              />
            </Modal>
          }
        />
        <CustomPagination 
          count={Math.ceil(totalRules / query.pageSize)}
          totalCount = {totalRules}
          page={query.pageNumber}
          onChangePage={handleChangeRulesPage}
          rowsPerPage={query.pageSize}
          onChangeRowsPerPage={handleChangeRowsPerRulesPage}
        />
      </>}
      {openEditScreen && (
        <Grid container>
          <Grid item xs={12} spacing={3,2} style={{ margin: '16px 16px 0px'}}>
            <Button
              variant='contained'
              color='primary'
              size='small'
              onClick={() => history.push('/dash/sod/policies/rules')}>
              Back to Rules list
            </Button>
          </Grid>
        <Grid item xs={12}>
          <CardViewWrapper>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <h5>Edit Rule</h5>
              </Grid>
              <Grid item xs={12}>
              <Grid container spacing={2} alignContent='center' alignItems='center'>
                <Grid item xs={12}>
                  <Grid container spacing={3} alignContent="center" alignItems='center'>
                    <Grid item xs={12} lg={3}>
                      Rule Name <span className='text-danger'>*</span>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <AppTextInput
                        value={newData.name}
                        error={!!errors.name}
                        disabled={openEditScreen}
                        onBlur={checkRuleName}
                        helperText={errors.name}
                        onChange={e => handleFormchange({ name: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3} alignContent="center" alignItems='center'>
                    <Grid item xs={12} lg={3}>
                      Business Role A <span className='text-danger'>*</span>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <Autocomplete
                        options={roleList}
                        onFocus={loadBusinessRoleList}
                        value={newData.entityValue1}
                        onChange={(event, newValue, reason) => {
                          setBusinessRoleQuery({ ...businessRoleQuery, keyword: event.target.value})
                          if (newValue && newValue.name) {
                            setBusinessRoleQuery({ ...businessRoleQuery, keyword: newValue.name });
                            setNewData({ ...newData, entityValue1: newValue.name })
                          }
                          if(reason === 'clear') {
                            setBusinessRoleQuery({ ...businessRoleQuery, keyword: "" });
                            setNewData({ ...newData, entityValue1: "" });  
                          }
                        }}
                        getOptionSelected={(o, v) => o.name === v}
                        autoHighlight
                        filterOptions={(options, state) => {
                          const res = options.filter((o) => {
                            const name = `${o.name}`.toLowerCase()
                            return name.includes(state.inputValue.toLowerCase())
                          })
                          return res
                        }}
                        getOptionLabel={(option) => {
                          const role = roleList.find(r => r.name === option || r.name === newData.entityValue1)
                          if (!role) return ''
                          return `${role.name}`
                        }}
                        renderOption={(option) => (
                          <React.Fragment>
                            {option.name !== newData.entityValue2 ? option.name : null}
                          </React.Fragment>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            fullWidth
                            onBlur={checkRuleRole1}
                            error={!!errors.entityValue1}
                            helperText={errors.entityValue1}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3} alignContent="center" alignItems='center'>
                    <Grid item xs={12} lg={3}>
                      Business Role B <span className='text-danger'>*</span>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <Autocomplete
                        options={roleList}
                        onFocus={loadBusinessRoleList}
                        value={newData.entityValue2}
                        onChange={(event, newValue, reason) => {
                          setBusinessRoleQuery({ ...businessRoleQuery, keyword: event.target.value})
                          if (newValue && newValue.name) {
                            setBusinessRoleQuery({ ...businessRoleQuery, keyword: newValue.name });
                            setNewData({ ...newData, entityValue2: newValue.name })
                          }
                          if(reason === 'clear') {
                            setBusinessRoleQuery({ ...businessRoleQuery, keyword: "" });
                            setNewData({ ...newData, entityValue2: "" });  
                          }
                        }}
                        getOptionSelected={(o, v) => o.name === v}
                        autoHighlight
                        filterOptions={(options, state) => {
                          const res = options.filter((o) => {
                            const name = `${o.name}`.toLowerCase()
                            return name.includes(state.inputValue.toLowerCase())
                          })
                          return res
                        }}
                        getOptionLabel={(option) => {
                          const role = roleList.find(r => r.name === option || r.name === newData.entityValue2)
                          if (!role) return ''
                          return `${role.name}`
                        }}
                        renderOption={(option) => (
                          <React.Fragment>
                            {option.name !== newData.entityValue1 ? option.name : null}
                          </React.Fragment>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            fullWidth
                            onBlur={checkRuleRole2}
                            error={!!errors.entityValue2}
                            helperText={errors.entityValue2}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3} alignContent="center" alignItems='center'>
                    <Grid item xs={12} lg={3}>
                      Status <span className='text-danger'>*</span>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <AppCheckbox
                        value={newData.active} onChange={() => setOpenEditWarningModal(true)}
                        switchLabel={newData.active === true ? 'Active' : 'Inactive'} 
                      />
                    </Grid>
                    <EditWarningModal
                      title={`Changing rule status - ${newData.name}`}
                      des='The action cannot be performed as the rule has active policy linked to it. 
                        Please unlink the policy before marking inactive.'
                      open={openEditWarningModal} 
                      confirm={confirmStatus}
                      close={() => setOpenEditWarningModal(false)}
                    />
                  </Grid>
                </Grid>
                <Grid container justify='space-between' style={{ marginTop: '24px' }}>
                  <Grid item>
                    <Button onClick={handleCloseEditRule}>Discard</Button>
                  </Grid>
                  {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && <Grid item>
                    <Button className={classes.button} disabled={!isValid || saving} variant="contained" color="primary" onClick={handleEditRule}>{!saving ? 'Save' : 'Saving'}</Button>
                  </Grid>}
                </Grid>
              </Grid>
              </Grid>
            </Grid>
          </CardViewWrapper>
        </Grid>
        <Grid item xs={12}>
          <CardViewWrapper>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h5>Link New Policy</h5>
                <Grid container justify="space-between" alignItems='center' className="pt-3">
                  <Grid item style={{ display: 'flex', justifyContent: 'space-between', alignItems:'center', width: '65%' }}>
                    <span>Search Policy</span>
                    <AsyncAutoComplete 
                      style={{ minWidth: '65%' }}
                      value={selectedPolicy}
                      disabled={isActiveForRoles(['READ_ONLY'])} 
                      getOptionLabel={(option, allOptions) => {
                        if(typeof option === "object"){
                          return option.name;
                        } else{
                          return '';
                        }
                      }}
                      api={(value, success, error) => {
                        loadPoliciesList(value, success, error);
                      }}
                      onLoadApiCall={true}
                      onChange={(event, newValue, reason) => {
                        if(newValue){
                          setSelectedPolicy(newValue)
                        }
                        if(reason === 'clear') {
                          setSelectedPolicy(null)
                        }          
                      }}
                      isSetOptions={true}
                      allOptions={policiesList}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Add />}
                      disableElevation
                      disableFocusRipple
                      disableRipple
                      style={{ display: 'inline-block'}}
                      disabled={!selectedPolicy}
                      onClick={handlePolicyLink}
                    >
                      Link Policy
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardViewWrapper>
        </Grid>
        <Grid item xs={12}>
          <CardViewWrapper>
            <Grid container spacing={2}>
              <CustomMaterialTable
                columns={policiesData.length > 0 ? policiesColumns : []}
                data={policiesData}
                title='Linked Policies'
                isLoading={loading}
                onSearchChange={(key) => {
                  setPolicyQuery({ ...policyQuery, keyword: key });
                }}
                actions={
                  [
                    {
                      icon: () => (
                        isActiveForRoles(['READ_ONLY']) ? <Visibility style={{ color: '#ddd' }}/> : 
                        <Avatar
                          src={require("../../../../../../assets/Delete.png")}
                          className={classes.editDeleteIcon}
                        />
                      ),
                      tooltip: "Delete",
                      hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
                      onClick: (event, rowData) => handleOpenDeleteModal(rowData.name, rowData.id)
                    },
                  ]
                }
                body={
                  <DeleteModal 
                    saving={saving} 
                    open={openDeleteModal} 
                    onClose={handleCloseDeleteModal} 
                    onDelete={handleDeletePolicyLink}
                    name={name}
                    desc={`Are you sure you want to remove linked policy - ${name}. 
                      Warning! This action cannot be undone.`} 
                  /> 
                }
              />
              <Grid item xs={12}>
                <CustomPagination              
                  count={Math.ceil(totalPolicies / policyQuery.pageSize)}
                  totalCount = {totalPolicies}
                  page={policyQuery.pageNumber}
                  onChangePage={handleChangePoliciesPage}
                  rowsPerPage={policyQuery.pageSize}
                  onChangeRowsPerPage={handleChangeRowsPerPoliciesPage}
                />
              </Grid>
            </Grid>
          </CardViewWrapper>
        </Grid>
        </Grid>
      )}
    </>
  );
}

export default Rules;
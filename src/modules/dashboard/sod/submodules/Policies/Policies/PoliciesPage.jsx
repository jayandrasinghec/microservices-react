import React, { useEffect, useState } from 'react';
import { Button, Avatar, makeStyles, Modal, Grid, TextField } from '@material-ui/core';
import { Add, Visibility } from "@material-ui/icons";
import CustomMaterialTable from '../../../../../../components/CustomMaterialTable';
import { isActiveForRoles, getAuthToken } from '../../../../../../utils/auth';
import ActiveStatusChip from '../../../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../../../components/HOC/InactiveStatusChip';
import CustomPagination from '../../../../../../components/CustomPagination';
import AddNewModal from '../../../../../../components/AddNewComponent';
import PolicyForm from '../../../components/Policies/PolicyForm/PolicyForm';
import CardViewWrapper from '../../../../../../components/HOC/CardViewWrapper';
import AppCheckbox from '../../../../../../components/form/AppCheckbox';
import AppTextInput from '../../../../../../components/form/AppTextInput';
import DeleteModal from '../../../../../../components/DeleteModal';
import { callApi, search} from '../../../../../../utils/api';
import { showSuccess, showError } from '../../../../../../utils/notifications';
import { AsyncAutoComplete } from '../../../../administartion/components/AsyncAutocomplete';
import EditWarningModal from '../../../../../../components/EditWarningModal';
import { useHistory } from 'react-router';
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

const defaultPolicy = {
  name: '', 
  description: '', 
  owner: '',
  active: false
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

const defaultOwnerQuery = {
  direction: "ASC",
  filters: {
    department: "",
    designation: "",
    location: "",
    locked: false,
    status: [],
  },
  keyword: '',
  pageNumber: 0,
  pageSize: 12,
  sort: "FIRST_NAME"
}

const Rules = () => {
  const classes = useStyles();
  const history = useHistory();

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditScreen, setOpenEditScreen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [policiesData, setPoliciesData] = useState([]);
  const [rulesData, setRulesData] = useState([]);
  const [newData, setNewData] = useState(defaultPolicy);
  const [errors, _setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [totalPolicies, setTotalPolicies] = useState(0);
  const [totalRules, setTotalRules] = useState(0);
  const [query, _setQuery] = useState(defaultPolicyQuery);
  const [ruleQuery, setRuleQuery] = useState(defaultRuleQuery);
  const [ownerQuery, setOwnerQuery] = useState(defaultOwnerQuery);
  const [ownerList, setOwnerList] = useState([]);
  const [ruleList, setRuleList] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [openEditWarningModal, setOpenEditWarningModal] = useState(false);

  const setError = e => _setErrors({ ...errors, ...e })

  const isValid = !Object.values(errors).some(e => e != null) && newData.name && newData.owner && newData.owner !== '' && ownerList.find(owner => owner.displayName === newData.owner);

  const checkPolicyName = () => setError({ name: (newData.name || '').trim().length > 0 ? null : 'Policy name is required' })
  const checkPolicyOwner = () => setError({ owner: (newData.owner || '').length > 1 && ownerList.find(owner => owner.displayName === newData.owner) ? null : 'Policy owner is required' })

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  }

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    _setErrors({});
    setNewData(defaultPolicy);
  }

  const loadPolicyOwnerList = () => {
    callApi(`/usersrvc/api/user/directory/list`, 'POST', ownerQuery)
      .then(res => {
        if (res.success) {
          setOwnerList(res.data && res.data.elements ? res.data.elements : [])
        }
      })
  }

  useEffect(() => {
    loadPolicyOwnerList();
  }, [])

  const loadPoliciesData = () => {
    setLoading(true);
    callApi(`/sod/policy/list`, 'POST', query)
      .then(res => {
        if(res.success){
          setPoliciesData(res.data && res.data.content ? res.data.content : []);
          setTotalPolicies(res.data && res.data.totalElements ? res.data.totalElements : 0);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    loadPoliciesData();
  }, [query]);

  const handlePolicySubmit = () => {
    setSaving(true);
    callApi(`/sod/policy`, 'POST', newData, getAuthToken(), true)
      .then(res => {
        if(res.success){
          setNewData(res.data ? res.data : defaultPolicy)
          handleOpenEditPolicy(res.data);
          loadPoliciesData();
          setOpenAddModal(false);
          showSuccess('Policy created sucessfully.');
        }
        setSaving(false);
      })
      .catch((e) => {
        setSaving(false);
        if (e.errorCode === 'SODSRVC.ALREADY_EXISTS') {
          showError('Policy Already Exists');
        } else {
          const value = search(e.errorCode);
          const message = value ? value : e.errorCode;
          showError(message);
        }
      });
  }

  const handleEditPolicy = () => {
    setSaving(true);
    callApi(`/sod/policy/${newData.id}`, 'PUT', newData)
      .then(res => {
        if (res.success) {
          setNewData(res.data);
          setSaving(false);
          showSuccess("Policy Updated Successfully.");
        } 
      })
      .catch(() => setSaving(false))
  }

  const loadRulesList = (value, success, error) => {
    let ruleObj = defaultRuleQuery;
    ruleObj.filter.name = value;
    callApi(`/sod/rule/list`, 'POST', ruleObj)
      .then(res => {
        if(res.success){
          setRuleList(res.data && res.data.content ? res.data.content : []);
          success(res.data ? res.data.content : [])
        }
      })
  }

  const loadRulesData = () => {
    setLoading(true);
    callApi(`/sod/rule/list`, 'POST', ruleQuery)
      .then(res => {
        if(res.success){
          setRulesData(res.data && res.data.content ? res.data.content : []);
          setTotalRules(res.data && res.data.totalElements ? res.data.totalElements : 0);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  }

  useEffect(() => {
    loadRulesData();
  }, [ruleQuery]);

  const handleRuleLink = () => {
    const ruleData = {
      policyId: newData.id,
      ruleId: selectedRule.id
    }
    setSaving(true);
    callApi(`/sod/policy/addRule`, 'PUT', ruleData)
      .then(res => {
        if(res.success){
          setSelectedRule(null);
          loadRulesData();
          showSuccess('Rule linked successfully.');
        }
        setSaving(false);
      }).catch(() => setSaving(false));
  }

  const handleDeleteRuleLink = () => {
    const ruleData = {
      policyId: newData.id,
      ruleId: id
    }
    setSaving(true);
    callApi(`/sod/policy/removeRule`, 'PUT', ruleData)
      .then(res => {
        if(res.success){
          handleCloseDeleteModal();
          loadRulesData();
          showSuccess('Linked rule deleted successfully.');
        }
        setSaving(false);
      }).catch(() => setSaving(false));
  }

  const handleOpenEditPolicy = (data) => {
    setNewData(data);
    setRuleQuery({ ...ruleQuery, filter: { ...ruleQuery.filter, policyId: data.id, active: true }});
    setOpenEditScreen(true);
  }

  const handleCloseEditPolicy = () => {
    setOpenEditScreen(false);
    _setErrors({});
    setNewData(defaultPolicy);
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

  const handleChangePoliciesPage = (event, newPage) => {
    _setQuery({ ...query, pageNumber: newPage });
  }

  const handleChangeRowsPerPoliciesPage = (event) => { 
    _setQuery({ ...query, pageNumber: 0, pageSize: parseInt(event, 10) });
  }

  const handleChangeRulesPage = (event, newPage) => {
    setRuleQuery({ ...ruleQuery, pageNumber: newPage });
  }

  const handleChangeRowsPerRulesPage = (event) => { 
    setRuleQuery({ ...ruleQuery, pageNumber: 0, pageSize: parseInt(event, 10) });
  }

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

  return(
    <>
      {!openEditScreen && <>
        <CustomMaterialTable
          columns={policiesData.length > 0 ? policiesColumns : []}
          data={policiesData}
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
                    Add Policy
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
              tooltip: isActiveForRoles(['READ_ONLY']) ? "View Policy" : "Edit Policy",
              hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']),
              onClick: (event, rowData) => handleOpenEditPolicy(rowData)
            },
          ]}
          body={
            <Modal open={openAddModal} onClose={handleCloseAddModal}>
              <AddNewModal
                title='Create SOD Policy'
                onClose={handleCloseAddModal}
                disabled={!isValid || saving}
                onSubmit={handlePolicySubmit}
                saving={saving}
                body={
                  <PolicyForm
                    newData={newData}
                    errors={errors}
                    checkPolicyName={checkPolicyName}
                    checkPolicyOwner={checkPolicyOwner}
                    change={handleFormchange} 
                    ownerList={ownerList}
                    setNewData={setNewData}
                    setOwnerQuery={setOwnerQuery}
                    ownerQuery={ownerQuery}
                    loadPolicyOwnerList={loadPolicyOwnerList}
                  />
                }
              />
            </Modal>
          }
        />
        <CustomPagination 
          count={Math.ceil(totalPolicies / query.pageSize)}
          totalCount = {totalPolicies}
          page={query.pageNumber}
          onChangePage={handleChangePoliciesPage}
          rowsPerPage={query.pageSize}
          onChangeRowsPerPage={handleChangeRowsPerPoliciesPage}
        />
      </>}
      {openEditScreen && (
        <Grid container>
          <Grid item xs={12} spacing={3,2} style={{ margin: '16px 16px 0px'}}>
            <Button
              variant='contained'
              color='primary'
              size='small'
              onClick={() => history.push('/dash/sod/policies/policies')}>
              Back to policies list
            </Button>
          </Grid>
        <Grid item xs={12}>
          <CardViewWrapper>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <h5>Edit Policy</h5>
              </Grid>
              <Grid item xs={12}>
              <Grid container spacing={2} alignContent='center' alignItems='center'>
                <Grid item xs={12}>
                  <Grid container spacing={3} alignContent="center" alignItems='center'>
                    <Grid item xs={12} lg={3}>
                      Policy Name <span className='text-danger'>*</span>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <AppTextInput
                        value={newData.name}
                        error={!!errors.name}
                        disabled={openEditScreen}
                        onBlur={checkPolicyName}
                        helperText={errors.name}
                        onChange={e => handleFormchange({ name: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3} alignContent="center" alignItems='center'>
                    <Grid item xs={12} lg={3}>
                      Policy Description
                    </Grid>
                    <Grid item xs={12} lg={6}>
                    <AppTextInput
                      value={newData.description}
                      onChange={e => handleFormchange({ description: e.target.value })}
                      multiline
                      rows={3} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3} alignContent="center" alignItems='center'>
                    <Grid item xs={12} lg={3}>
                      Policy Owner <span className='text-danger'>*</span>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <Autocomplete
                        options={ownerList}
                        value={newData.owner}
                        onChange={(event, newValue, reason) => {
                          setOwnerQuery({ ...ownerQuery, keyword: event.target.value})
                          if (newValue && newValue.displayName) {
                            setOwnerQuery({ ...ownerQuery, keyword: newValue.displayName });
                            setNewData({ ...newData, owner: newValue.displayName })
                          }
                          if(reason === 'clear') {
                            setOwnerQuery({ ...ownerQuery, keyword: "" });
                            setNewData({ ...newData, owner: "" });  
                          }
                        }}
                        getOptionSelected={(o, v) => o.displayName === v}
                        autoHighlight
                        filterOptions={(options, state) => {
                          const res = options.filter((o) => {
                            const name = `${o.displayName}`.toLowerCase()
                            return name.includes(state.inputValue.toLowerCase())
                          })
                          return res
                        }}
                        getOptionLabel={(option) => {
                          const user = ownerList.find(u => u.displayName === option || u.displayName === newData.owner)
                          if (!user) return ''
                          return `${user.displayName}`
                        }}
                        renderOption={(option) => (
                          <React.Fragment>
                            {option.displayName}
                          </React.Fragment>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            size="small"
                            className={classes.textField}
                            fullWidth
                            onBlur={checkPolicyOwner}
                            error={!!errors.owner}
                            helperText={errors.owner}
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
                      title={`Changing policy status - ${newData.name}`}
                      des='The action cannot be performed as the policy has active rule linked to it. 
                        Please unlink the rule before marking inactive.'
                      open={openEditWarningModal} 
                      confirm={confirmStatus}
                      close={() => setOpenEditWarningModal(false)}
                    />
                  </Grid>
                </Grid>
                <Grid container justify='space-between' style={{ marginTop: '24px' }}>
                  <Grid item>
                    <Button onClick={handleCloseEditPolicy}>Discard</Button>
                  </Grid>
                  {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && <Grid item>
                    <Button className={classes.button} disabled={!isValid || saving} variant="contained" color="primary" onClick={handleEditPolicy}>{!saving ? 'Save' : 'Saving'}</Button>
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
                <h5>Link existing Rule</h5>
                <Grid container justify="space-between" alignItems='center' className="pt-3">
                  <Grid item style={{ display: 'flex', justifyContent: 'space-between', alignItems:'center', width: '65%' }}>
                    <span>Search Rule</span>
                    <AsyncAutoComplete
                      style={{ minWidth: '65%' }}
                      value={selectedRule}
                      disabled={isActiveForRoles(['READ_ONLY'])} 
                      getOptionLabel={(option, allOptions) => {
                        if(typeof option === "object"){
                          return option.name;
                        } else{
                          return '';
                        }
                      }}
                      api={(value, success, error) => {
                        loadRulesList(value, success, error);
                      }}
                      onLoadApiCall={true}
                      onChange={(event, newValue, reason) => {
                        if(newValue){
                          setSelectedRule(newValue)
                        }
                        if(reason === 'clear') {
                          setSelectedRule(null)
                        }          
                      }}
                      isSetOptions={true}
                      allOptions={ruleList}
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
                      disabled={!selectedRule}
                      onClick={handleRuleLink}
                    >
                      Link Rule
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
                columns={rulesData.length > 0 ? rulesColumns : []}
                data={rulesData}
                title='Linked Rules'
                isLoading={loading}
                onSearchChange={(key) => {
                  setRuleQuery({ ...ruleQuery, keyword: key });
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
                    onDelete={handleDeleteRuleLink}
                    name={name}
                    desc={`Are you sure you want to remove linked Rule - ${name}. 
                      Warning! This action cannot be undone.`} 
                  /> 
                }
              />
              <Grid item xs={12}>
                <CustomPagination              
                  count={Math.ceil(totalRules / query.pageSize)}
                  totalCount = {totalRules}
                  page={query.pageNumber}
                  onChangePage={handleChangeRulesPage}
                  rowsPerPage={query.pageSize}
                  onChangeRowsPerPage={handleChangeRowsPerRulesPage}
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
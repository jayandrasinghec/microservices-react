/* eslint-disable react/display-name */
import React, { useState } from 'react'
import Modal from '@material-ui/core/Modal'
import MenuItem from '@material-ui/core/MenuItem'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
 
import Plus from './../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/plus.svg'
import { callApi } from '../../../../../utils/api'
import { showError, showSuccess } from '../../../../../utils/notifications'
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
import { Button, Grid, InputAdornment, makeStyles } from '@material-ui/core'
import { FormatListBulletedRounded } from '@material-ui/icons'
import CardViewWrapper from '../../../../../components/HOC/CardViewWrapper'
import { getFormatedDate } from '../../../../../utils/helper'
import { AsyncAutoCompleteNoValue } from '../../../../../components/AsyncAutoCompleteNovalue'
import { EnvSearchableDropdown } from '../../components/EnvSearchableDropdown'

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

const defaultMaster = {
  type: "UserType",
  name:"",
  value:"",
  status:false
}

const defaultNewData = {
    active: false,
    cron_config: '',
    env_id: '',
    job_type: '',
    // next_run_date: '',
    scheduler_name: ''
}

export default function Scheduler() {
    const classes = useStyles()
    const [newMaster, setNewMaster] = useState(defaultMaster)

    const [newData, setNewData] = useState(defaultNewData);
    const [schedulerFilter, setSchedulerFilter] = useState({
        type: 'All',
        limit: 10,
        page: 0
    })
    const [jobTypeOptions, setjobTypeOptions] = useState(['All', 'Fetch Logs', 'Fetch Data', 'Generate Report']);
    //   const [jobTypeOptions, setjobTypeOptions] = useState(['All', 'Fetch Logs']);
    const [data, setData] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0)
    const [envOptions, setEnvOptions] = useState([])
    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, _setErrors] = useState({});

    const handleModalOpen = () => {
        setOpen(true);
    };
    const handleModalClose = () => {
        setOpen(false);
        setEdit(false);
        setNewData(defaultNewData);
        _setErrors({})
    };

    const downloadData = () => {
        callApi(`/iddiscsrvc/schedulerconfig/?${schedulerFilter.type === 'All' ? '' : `job_type=${schedulerFilter.type}&`}limit=${schedulerFilter.limit}&page=${schedulerFilter.page + 1}`)
        .then(e => {
            if (e.code == 200 ) {
            setData(e.data && e.message !== 'Empty list returned' ? e.data : [])
            setTotalUsers(e.data ? e.count : 0)
            } 
        })
    }

    const downloadSchedulerById = (id) => {
        callApi(`/iddiscsrvc/schedulerconfig/${id}`)
        .then(e => {
            if (e && e.code == 200) {
                let obj = e.data[0]
                obj.next_run_date = e.data[0]['next_run_date'] ? getFormatedDate(e.data[0]['next_run_date'], 'DD/MM/YYYY HH:mm:ss') : '--';
                setNewData(e.data ? obj : {})
            } 
        })
    }

    React.useEffect(() => downloadData(), [schedulerFilter])

    const change = e => setNewData({ ...newData, ...e })

    const onSubmit = () => {
        setSaving(true)
        let obj = newData;
        edit && delete obj.next_run_date
        callApi(`/iddiscsrvc/schedulerconfig/${edit ? newData.id : ''}`, edit ? 'PUT' : 'POST', newData)
        .then(res => {
            setSaving(false)
            if(res.code == 200) {
                downloadData();
                showSuccess(`Scheduler ${edit ? 'updated' : 'added'} successfully!`);
                handleModalClose()
            }else if(res.code == 401) {
                showError(res.message)
            }
        })
        .catch(err => {
            setSaving(false);
            handleModalClose();
        })
    }

    const getEnvList = (value, success, error) => {
        callApi(`/iddiscsrvc/envconfig/getNames?name=${value}`)
        .then(e => {
        if (e.data) {
            setEnvOptions(e.data ? e.data[0] : [])
            success(e.data ? e.data[0] : [])    
        } 
        })
    }

    const handleChangePage = (event, newPage) => {
        setSchedulerFilter({ ...schedulerFilter, page: newPage });
    }
    const handleChangeRowsPerPage = (event) => {
        setSchedulerFilter({ ...schedulerFilter,page: 0, limit: parseInt(event, 10) });
    }

    const setError = e => _setErrors({ ...errors, ...e })
    const isValid = !Object.values(errors).some((e) => e != null) && newData.scheduler_name && newData.env_id && newData.cron_config && newData.job_type
    const checkValue = (e) => {
        if((e.target.value).length == 0) {
          setError({ [e.target.name]: 'This field is required' })
        }else{
          setError({ [e.target.name]: null })
        }
      }


    const columns = [
        { title: 'Name', field: 'scheduler_name', cellStyle: { fontWeight: '700', border: 'none' } },
        { title: 'Env ID', field: 'id' },
        { title: 'Cron Config', field: 'cron_config' },
        { title: 'Next Run Date', field: 'next_run_date', render: row =>  <span>{ row.next_run_date ? getFormatedDate(row.next_run_date, 'DD/MM/YYYY HH:mm:ss') : '--'}</span> },
        { title: 'Job Type', field: 'job_type' },
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
                    <DropDown title={schedulerFilter.type} options={jobTypeOptions} body={
                    jobTypeOptions.map(type => {
                        return (
                        <MenuItem key={type} onClick={e => { setSchedulerFilter({ ...schedulerFilter, type: type }) }}>
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
                downloadSchedulerById(rowData.id)
                }
            },
            ]}
        />
        <CustomPagination
            count={Math.ceil(totalUsers / schedulerFilter.limit)}
            totalCount = {totalUsers}
            page={schedulerFilter.page}
            onChangePage={handleChangePage}
            rowsPerPage={schedulerFilter.limit}
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
                <h5>{edit ? "Edit Scheduler" : "Add Scheduler"}</h5>
                </Grid>
                <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={6}>
                        <AppTextInput
                            required
                            name="scheduler_name"
                            error={!!errors.scheduler_name}
                            onBlur={checkValue}
                            helperText={errors.scheduler_name}
                            disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                            value={newData.scheduler_name}
                            onChange={e => change({ scheduler_name: e.target.value })}
                            label="Scheduler Name" 
                        />
                    </Grid>                    
                    <Grid item xs={12} sm={6} md={6}>
                        <EnvSearchableDropdown
                            label="Environment ID"
                            required
                            value={newData.env_id}
                            disabled={isActiveForRoles(['READ_ONLY'])}
                            getOptionLabel={(option, allOptions) => {
                                if (typeof option === "object") {
                                    return option.env_name;
                                } else {
                                    return '';
                                }
                            }}
                            api={(value, success, error) => {
                                getEnvList(value, success, error)
                            }}
                            onLoadApiCall={true}
                            onChange={(event, newValue, reason) => {
                                if(newValue){
                                // setTask(newValue)
                                change({ env_id: newValue.id })
                                }

                                if(reason === 'clear') {
                                // setTask(null)
                                change({ env_id: null })
                                }          
                            }}
                            error={!!errors.env_id}
                            onBlur={(e) => checkValue(e)}
                            helperText={errors.env_id}
                            name="env_id"
                            onChangeApiCall={false}
                            isSetOptions={true}
                            allOptions={envOptions}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <AppTextInput
                            required
                            error={!!errors.cron_config}
                            onBlur={checkValue}
                            name="cron_config"
                            helperText={errors.cron_config}
                            disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                            value={newData.cron_config}
                            onChange={e => change({ cron_config: e.target.value })}
                            // onChange={e => setNewData({ ...newData, cron_config: e.target.value })}
                            label="Cron config" 
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <AppSelectInput
                            required
                            value={newData.job_type}
                            name="job_type"
                            disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                            error={!!errors.job_type}
                            onBlur={checkValue}
                            helperText={errors.job_type}
                            onChange={e => change({ job_type: e.target.value })}
                            // onChange={e => setNewData({ ...newData, type: e.target.value })}
                            options={['Fetch Logs', 'Fetch Data', 'Generate Report']} 
                            label="Job Type"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} justify="center" alignContent="center">
                        <AppCheckbox
                            value={newData.active}
                            disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])} 
                            onChange={e => change({ active: !newData.active })}
                            switchLabel={newData.active ? 'Active' : 'In-active'}
                            label="Status" 
                        />
                    </Grid>
                    { edit && 
                        <Grid item xs={12} sm={6} md={6}>
                            <AppTextInput
                                disabled
                                value={newData.next_run_date}
                                label="Next Run Date" 
                            />
                    </Grid> }
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
        </Grid> }
        </>
    )
}



import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import {useHistory} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Typography from '@material-ui/core/Typography';
// import { TablePagination } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import TuneIcon from '@material-ui/icons/Tune';

import { clearCampaignHistoryDetails, GetCampaignHistoryDetails, PostCampaignAssignmentHistoryList, clearCampaignAssignmentHistoryList, PostCampaignHistorySummary, clearCampaignHistorySummary, clearCampaignHistoryAssignments } from '../../actions/CampaignActions';
import CardViewWrapper from "../../../../../components/HOC/CardViewWrapper"
import CustomPagination from '../../../../../components/CustomPagination';
import { getFormatedDate } from '../../../../../utils/helper';
import CustomInputLabel from '../../../../../components/HOC/CustomInputLabel';
import AppUserDropdown from '../../../../../components/form/AppUserDropdown';
import { ReactComponent as FilterBy } from '../../../../../assets/funnel.svg';


const useStyles = makeStyles({
  ruleTable: {
    paddingBottom: "0px !important",
    marginBottom: '-16px',
    '& .MuiToolbar-gutters': {
      padding: "0px !important",
      '& .MuiTextField-root': {
        border: "1px solid #ccc",
        borderRadius: "4px",
        paddingLeft: "8px",
        '& .MuiInput-underline:before': {
          display: "none",
        },
        '& .MuiInput-underline:after': {
          display: "none",
        }
      },

      '& .MuiIconButton-root:hover': {
        background: "transparent",
        '& .MuiTouchRipple-root': {
          display: "none"
        }
      }
    },

    '& table': {
      borderCollapse: "separate",
      borderSpacing: "0 15px",
    },
    '& th ': {
      padding: "0px 16px !important",
    },
    '& td ': {
      borderBottom: 0,
    },
    '& .MuiPaper-root': {
      boxShadow: "none",
      background: "transparent"
    },
    '& .MuiTablePagination-caption': {
      display: "unset !important",
      position: "absolute",
      color: "#a9b2c3",
    },
    '& .MuiTableCell-footer': {
      borderBottom: '0px',
      '& .MuiTablePagination-selectRoot': {
        background: "#282a73",
        borderRadius: "20px",
        color: "#fff",
        '& svg': {
          color: "#fff"
        }
      },
      '& .MuiButton-contained.Mui-disabled': {
        background: "transparent",
      }
    },
  },
  rulesSearchAdd: {
    float: 'right',
  },
  tableAddIcon: {
    height: 32,
  },
  custSelect: {
    background: '#f6f6f7',
    padding: '8px 4px',
    borderRadius: 4,
    fontSize: 12,
    border: '1px solid #ccc'
  },
  infoBox: {
    margin: 16,
    padding: 16,
  },
  statsTitle: {
    color: '#8392a7',
    fontSize: 14,
  },
  custGrid: {
    width: "20%",
  },
  certifyTitle: {
    color: '#1F4287',
    fontWeight: 600
  },
  botGutter: {
    marginBottom: 24
  },
  toolbarCust: {
    display: 'flex',
    padding: 16,
    '& .MuiSelect-select': {
      paddingTop: 4,
      paddingBottom: 4,
      fontSize: 12,
      lineHeight: 1.2,
    },
    '&  .MuiOutlinedInput-adornedStart': {
      paddingLeft: 4,
      marginRight: 8,
    }
  },
  custSvg: {
    width: 16,
    padding: 2,
    marginTop: 2
  },
  Nav: {
    display: 'flex',
    paddingBottom: '0px !important'
    // marginTop: '12px'
  },
  container: {
    margin: 0,
    width: '100%' 
  },
  tuneicon: {
    color: '#363793',
  },
});

const defaultVal = {
    "pageNumber": 0,
    "pageSize": 10,
    "sortDirection": "DESC",
    "sortOn": [
      "updatedAt"
    ]
  }

export default function CampaignHistoryDetails(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const id = props.match.params.id
  const campaign = useSelector((state) => state.campaignReducer.historySummary && state.campaignReducer.historySummary.content[0]) || {};
  const assignmentList = useSelector((state) => state.campaignReducer.historyAssignments && state.campaignReducer.historyAssignments) || [];
  const defFilter = {
    "filter": {
      "applicationId": "",
      "assigneeId": "",
      "campaignExecutionId": campaign.executionId,
      "status": null,
      "userId": ""
    },
    "keyword": "",
    "pageNumber": 0,
    "pageSize": 10,
    "sortDirection": "ASC",
    "sortOn": [
      "id"
    ]
  }
  const [filters, setFilters] = useState(defFilter);
  const [value, setValue] = useState('userId');
  const [dropdownVal, setDropdownVal] = useState(null);
  const [enableFilters, setEnableFilter] = useState(false)
  // const [filters, setFilters] = useState(defaultVal);
  // const campaign = useSelector((state) => state.campaignReducer.campaignHistoryDetails) || {};
  // const assignmentList = useSelector((state) => state.campaignReducer.assignmentHistoryList) || {};

  const handleDropdownChange = (name, dropValue) => {
    let obj = filters.filter
    if(value === 'applicationId'){
        setDropdownVal(dropValue && dropValue.appName)
    }else {
        setDropdownVal(dropValue && dropValue.displayName)
    }
    obj[name] = dropValue && dropValue.id
    setFilters({...filters, pageNumber: 0, filter: obj})

  }

  const statusColorCode = (color, status) => (
    <>
      <FiberManualRecordIcon htmlColor={color} />
      {status && (<span style={{marginRight: '10px'}}>{status}</span>)}
    </>
  )

  const columns = [
      {
        title: 'User Name', field: 'user.userName', cellStyle: { color: '#1F4287', fontWeight: 600 }, render: rowData => <span> { rowData.user.userName || '--'} </span>
      },
      { title: 'Target', field: 'user.applications.appName', cellStyle: { color: '#1F4287', fontWeight: 600 }, render: rowData => <span> { rowData.user.applications.appName || '--'} </span> },
      { title: 'Manager', field: 'user.managerName', render: rowData => <span> { rowData.user.managerName || '--'} </span> },
      // { title: 'Reviewers', field: 'reviewers' },
      { title: 'Assignee', field: 'assigneeName', render: rowData => <span> {rowData.assigneeName || '--'} </span> },
      { title: 'Reviewed at', field: 'updatedAt', render: rowData => <span> { getFormatedDate(rowData.updatedAt, 'DD/MM/YYYY HH:mm:ss') || '--'} </span> },
      { title: 'Stage', field: 'stage', render: rowData => <span> { rowData.stage || '--'} </span> },
      { title: 'Status', field: 'status', render: rowData => <span>{rowData.user.applications.assignedRoles.status === 'PENDING_APPROVAL' ? statusColorCode('yellow', '') : rowData.user.applications.assignedRoles.status === 'APPROVED' ? statusColorCode('green', '') : statusColorCode('red', '')}</span>}
      // { title: 'Remedied at', field: 'remediedAt' },
      // {
      //   title: 'Comments', field: 'comments', render: rowData => (
      //     <>
      //       <select className={classes.custSelect}>
      //         <option>Select a value</option>
      //       </select>
      //     </>
      //   )
      // },
    ]

  const handleChangePage = (event, newPage) => {
    setFilters({ ...filters, pageNumber: newPage })
  }

  const handleChangeRowsPerPage = (event) => {
    setFilters({ ...filters, pageNumber: 0, pageSize: parseInt(event, 10) })
  }

  const handleFilterClick = () => {
    setEnableFilter(!enableFilters)
  }

  // useEffect(() => {
  //   dispatch(GetCampaignHistoryDetails(id))
    
  //   return () => {
  //       dispatch(clearCampaignHistoryDetails())
  //   }
  // }, [])

  useEffect(() => {
    // dispatch(PostCampaignAssignmentHistoryList(filters, id))
    dispatch(PostCampaignHistorySummary({
      "filter": {
          "campaignId": "",
          "campaignExecutionId": id
      },
      "keyword": "",
      "pageNumber": 0,
      "pageSize": 10,
      "sortDirection": "ASC",
      "sortOn": [
          "startDate"
      ]
  }, filters))
    
    return () => {
        // dispatch(clearCampaignAssignmentHistoryList())
        dispatch(clearCampaignHistorySummary())
        dispatch(clearCampaignHistoryAssignments())
    }
  }, [filters])

  return (
    <div style={{ overflow: 'auto', height: 'min-content' }}>
      <Grid container>

        <Grid item xs={12}>
          <Paper elevation={0} className={classes.infoBox}>

            <Grid container className={classes.botGutter}>
              <Grid item xs={3}>
                <Typography gutterBottom className={classes.statsTitle}>
                  {/* Certify User Role Assignment */}
                  Campaign Name
                </Typography>
                <Typography gutterBottom className={classes.certifyTitle}>
                { campaign.name || '--' }
                </Typography>
              </Grid>
              {/* <Grid item xs={2}>
                <Typography gutterBottom className={classes.statsTitle}>
                  Owner
                </Typography>
                <Typography gutterBottom>
                  <b>Administrator</b>
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography gutterBottom className={classes.statsTitle}>
                  Created By
                </Typography>
                <Typography gutterBottom>
                  <b>{campaign.createdBy || '--'}</b>
                </Typography>
              </Grid> */}
              <Grid item xs={2}>
                <Typography gutterBottom className={classes.statsTitle}>
                  Iteration
                </Typography>
                <Typography gutterBottom>
                  <b>{campaign.iteration || '--'}</b>
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography gutterBottom className={classes.statsTitle}>
                  Total Assignments
                </Typography>
                <Typography gutterBottom>
                  <b>{campaign.totalAssignments || '--'}</b>
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography gutterBottom className={classes.statsTitle}>
                  Start Date
                </Typography>
                <Typography gutterBottom>
                <b>{campaign.startDate || '--'}</b>
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography gutterBottom className={classes.statsTitle}>
                  End Date
                </Typography>
                <Typography gutterBottom>
                  <b>{campaign.endDate || '--'}</b>
                </Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={3}>
                <Typography gutterBottom className={classes.statsTitle}>
                  Description
                </Typography>
                <Typography gutterBottom>
                  <b>{campaign.description ? campaign.description : '--'}</b>
                </Typography>
              </Grid>
              {/* <Grid item xs={2}>
                <Typography gutterBottom className={classes.statsTitle}>
                  No of Stages
                </Typography>
                <Typography gutterBottom>
                  <b>{campaign.totalStages || '--'}</b>
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography gutterBottom className={classes.statsTitle}>
                  Frequency
                </Typography>
                <Typography gutterBottom>
                  <b>{campaign.frequency || '--'}</b>
                </Typography>
              </Grid> */}
              <Grid item xs={2}>
                <Typography gutterBottom className={classes.statsTitle}>
                  Pending Assignments
                </Typography>
                <Typography gutterBottom>
                  <b>{campaign.pendingAssignments || '--'}</b>
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography gutterBottom className={classes.statsTitle}>
                  Approved Assignments
                </Typography>
                <Typography gutterBottom>
                  <b>{campaign.approvedAssignments || '--'}</b>
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography gutterBottom className={classes.statsTitle}>
                  Rejected Assignments
                </Typography>
                <Typography gutterBottom>
                  <b>{campaign.rejectedAssignments || '--'}</b>
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography gutterBottom className={classes.statsTitle}>
                  End Mode
                </Typography>
                <Typography gutterBottom>
                <b>{campaign.endMode || '--'}</b>
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {/* 
        <Grid item xs={12}>
          <Paper elevation={0} className={classes.infoBox}>
            <Grid container>
              <Grid item xs={12}>
                <Typography gutterBottom>
                  Statistics (Items | Remedied)
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item className={classes.custGrid}>
                <Typography gutterBottom className={classes.statsTitle}>
                  Accept
                </Typography>
                <Typography gutterBottom>
                  <b>20</b>
                </Typography>
              </Grid>
              <Grid item className={classes.custGrid}>
                <Typography gutterBottom className={classes.statsTitle}>
                  Revoke
                </Typography>
                <Typography gutterBottom>
                  <b>20</b>
                </Typography>
              </Grid>
              <Grid item className={classes.custGrid}>
                <Typography gutterBottom className={classes.statsTitle}>
                  Reduce
                </Typography>
                <Typography gutterBottom>
                  <b>20 | 20</b>
                </Typography>
              </Grid>
              <Grid item className={classes.custGrid}>
                <Typography gutterBottom className={classes.statsTitle}>
                  No. of Decision
                </Typography>
                <Typography gutterBottom>
                  <b>20</b>
                </Typography>
              </Grid>
              <Grid item className={classes.custGrid}>
                <Typography gutterBottom className={classes.statsTitle}>
                  No. of Resonse
                </Typography>
                <Typography gutterBottom>
                  <b>20</b>
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid> */}

        <Grid item xs={12}>
          <CardViewWrapper>
            <Grid
              container
              direction="row"
              spacing={3}
              justify="space-between"
              alignItems="center"
            >
              <Grid item xs={6}>
                <Button 
                  onClick={handleFilterClick} 
                  startIcon={
                    <TuneIcon className={classes.tuneicon} />
                  } 
                  className={classes.tuneicon} 
                >
                  Filters
                </Button>
              </Grid>
              <Grid item xs={6} className="text-right" >
                {statusColorCode('green', 'Approved')}
                {statusColorCode('yellow', 'Pending Approval')}
                {statusColorCode('red', 'Rejected')}
              </Grid>
            </Grid>
            {enableFilters && (
              <Grid item xs={12}>
                <Paper elevation={0} className={classes.infoBox}>
                  <div className={classes.toolbarCust}>
                    <Grid container>
                      <Grid item xs={4}>
                        <CustomInputLabel>Status</CustomInputLabel>
                        <Select
                          variant="outlined"
                          value={filters.filter.status === null ? 'ALL' : filters.filter.status}
                          onChange={e => {
                            let obj = filters.filter
                            obj.status = e.target.value === 'ALL' ? null : e.target.value
                            setFilters({...filters, pageNumber: 0, filter: obj})
                          }}
                          startAdornment={
                            <InputAdornment position="start">
                              <FilterBy className={classes.custSvg} />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value="ALL">All</MenuItem>
                          <MenuItem value='PENDING_APPROVAL'>Pending Approval</MenuItem>
                          <MenuItem value='APPROVED'>Approved</MenuItem>
                          <MenuItem value='REJECTED'>Rejected</MenuItem>
                        </Select>
                      </Grid>
                      <Grid item xs={4}>
                        <CustomInputLabel>Filters</CustomInputLabel>
                        <Select
                          variant="outlined"
                          // margin="dense"
                          value={value}
                          onChange={e => {
                            setValue(e.target.value)
                            setDropdownVal([])
                            let obj = {}
                            obj[e.target.value] = ""
                            obj['assigneeId'] = filters.filter.assigneeId
                            obj['campaignExecutionId'] = filters.filter.campaignExecutionId
                            obj['status'] = filters.filter.status
                            setFilters({...filters, filter: obj})
                          }}
                          startAdornment={
                            <InputAdornment position="start">
                              <FilterBy className={classes.custSvg} />
                            </InputAdornment>
                          }
                        >
                          <MenuItem value={'userId'}>Users</MenuItem>
                          <MenuItem value={'applicationId'}>Applications</MenuItem>
                        </Select>
                      </Grid> 
                      <Grid item xs={4}>
                        {
                          value === 'userId' ? (
                            <AppUserDropdown
                              type='users'
                              placeholder='Select Users'
                              resource={filters.filter.users}
                              value={dropdownVal}
                              v={value}
                              onGroupId={e => handleDropdownChange('userId', e)}
                            />
                          ) : value === 'applicationId' ? (
                            <AppUserDropdown
                              type='applications'
                              placeholder='Select Applications'
                              resource={filters.filter.applications}
                              value={dropdownVal}
                              v={value}
                              onGroupId={e => handleDropdownChange('applicationId', e)}
                            />
                          ) : null
                        }
                      </Grid>    
                    </Grid>
                  </div>
                </Paper>
              </Grid>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} className={classes.ruleTable}>
                <MaterialTable
                  columns={columns}
                  data={assignmentList.content}
                  options={{
                    toolbar: false,
                    rowStyle: {
                      backgroundColor: '#fff',
                    },
                    cellStyle: {
                      borderBottom: 'none',
                    },
                    headerStyle: {
                      backgroundColor: 'transparent',
                      borderBottom: 'none',
                      color: '#666667',
                    },
                    paging: false,
                    // paginationType: 'stepped',
                    draggable: true,
                  }}
                  // localization={{
                  //   pagination: {
                  //     labelRowsPerPage: '',
                  //     labelDisplayedRows: 'Displaying {from}-{to} of {count} records'
                  //   }
                  // }}
                />
              </Grid>
              <Grid item xs={12}>
                {/* <TablePagination
                  // className={classes.pagination}
                  component="div"
                  rowsPerPageOptions={[5, 10, 20, 30]}
                  count={assignmentList ? assignmentList.totalElements : 0}
                  page={filters.pageNumber}
                  onChangePage={handleChangePage}
                  rowsPerPage={filters.pageSize}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                /> */}
                <CustomPagination    
                    rowsPerPageOption={[5, 10, 20, 30]}   
                    totalCount = {assignmentList.totalElements}                 
                    count={assignmentList ? Math.ceil(assignmentList.totalElements /filters.pageSize)  : 0}
                    page={filters.pageNumber}
                    onChangePage={handleChangePage}
                    rowsPerPage={filters.pageSize}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                  />
              </Grid>
            </Grid>
          </CardViewWrapper>
        </Grid>

      </Grid>
    </div >
  );
}

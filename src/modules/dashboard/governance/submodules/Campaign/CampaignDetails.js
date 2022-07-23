import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import {useHistory} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { ClearCampaignDetails, GetCampaignDetails, PostCampaignAssignmentList, clearCampaignAssignmentList, PostCampaignActiveSummary, clearCampaignActiveSummary, clearCampaignActiveAssignments } from '../../actions/CampaignActions';
import { makeStyles } from '@material-ui/core/styles';
import CardViewWrapper from "../../../../../components/HOC/CardViewWrapper"
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { TablePagination } from '@material-ui/core';
import { getFormatedDate } from '../../../../../utils/helper';
import CustomPagination from '../../../../../components/CustomPagination';


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
  }
});

const defaultVal = {
    "pageNumber": 0,
    "pageSize": 10,
    "sortDirection": "DESC",
    "sortOn": [
      "updatedAt"
    ]
  }

export default function CampaignDetails(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const id = props.match.params.id;
  // const campaign = useSelector((state) => state.campaignReducer.campaignDetails) || {};
  const campaign = useSelector((state) => state.campaignReducer.activeSummary && state.campaignReducer.activeSummary.content[0]) || {};
  // const assignmentList = useSelector((state) => state.campaignReducer.assignmentList) || {};
  const assignmentList = useSelector((state) => state.campaignReducer.activeAssignments && state.campaignReducer.activeAssignments) || [];
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
  // const [filters, setFilters] = useState(defaultVal);
  const [filters, setFilters] = useState(defFilter);
  console.log('campaign',campaign)
  console.log('assignmentList',assignmentList)

  const statusColorCode = (color, status) => (
    <>
        <FiberManualRecordIcon htmlColor={color} />
        {status && (<span style={{marginRight: '10px'}}>{status}</span>)}
    </>
  )

  const [state, setState] = useState({
    columns: [
      {
        title: 'User Name', field: 'user.userName', cellStyle: { color: '#1F4287', fontWeight: 600 }, render: rowData => <span> {rowData.user.userName || '--'} </span>
      },
      { title: 'Target', field: 'user.applications.appName', cellStyle: { color: '#1F4287', fontWeight: 600 }, render: rowData => <span> {rowData.user.applications.appName || '--'} </span> },
      { title: 'Manager', field: 'user.managerName', render: rowData => <span> {rowData.user.managerName || '--'} </span> },
      // { title: 'Reviewers', field: 'reviewers' },
      { title: 'Assignee', field: 'assigneeName', render: rowData => <span> {rowData.assigneeName || '--'} </span> },
      { title: 'Reviewed at', field: 'updatedAt', render: rowData => <span> {getFormatedDate(rowData.updatedAt) || '--'} </span> },
      { title: 'Stage', field: 'stage', render: rowData => <span> {rowData.stage || '--'} </span> },
      // { title: 'Status', field: 'status', render: rowData => <span> {rowData.status || '--'} </span> },
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
    ],
    data: [
      { userName: 'Mehmet', target: 'Baran', manager: 'Baran', reviewers: 1, reviewedBy: 'created', reviewedAt: 1, stage: 2, remediedAt: 4, },
      { userName: 'Mehmet', target: 'Baran', manager: 'Baran', reviewers: 1, reviewedBy: 'created', reviewedAt: 1, stage: 2, remediedAt: 4, },
      { userName: 'Mehmet', target: 'Baran', manager: 'Baran', reviewers: 1, reviewedBy: 'created', reviewedAt: 1, stage: 2, remediedAt: 4, },
      { userName: 'Mehmet', target: 'Baran', manager: 'Baran', reviewers: 1, reviewedBy: 'created', reviewedAt: 1, stage: 2, remediedAt: 4, },
      { userName: 'Mehmet', target: 'Baran', manager: 'Baran', reviewers: 1, reviewedBy: 'created', reviewedAt: 1, stage: 2, remediedAt: 4, },
    ],
  });

  const handleChangePage = (event, newPage) => {
    setFilters({ ...filters, pageNumber: newPage })
  }

  const handleChangeRowsPerPage = (event) => {
    setFilters({ ...filters, pageNumber: 0, pageSize: parseInt(event, 10) })
  }

  useEffect(() => {
    dispatch(GetCampaignDetails(id))
    
    return () => {
        dispatch(ClearCampaignDetails())
    }
  }, [])

  useEffect(() => {
    // dispatch(PostCampaignAssignmentList(filters, id))
    dispatch(PostCampaignActiveSummary({
      "filter": {
          "campaignId": id,
          "campaignExecutionId": ""
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
        // dispatch(clearCampaignAssignmentList())
        dispatch(clearCampaignActiveSummary())
        dispatch(clearCampaignActiveAssignments())
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
                  {campaign.name || '--'}
                </Typography>
              </Grid>
              {/* <Grid item xs={2}>
                <Typography gutterBottom className={classes.statsTitle}>
                  Owner
                </Typography>
                <Typography gutterBottom>
                  <b>Administrator</b>
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
              {/* <Grid item xs={2}>
                <Typography gutterBottom className={classes.statsTitle}>
                  Created By
                </Typography>
                <Typography gutterBottom>
                  <b>{campaign.createdBy || '--'}</b>
                </Typography>
              </Grid> */}
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
                  Planned End Date
                </Typography>
                <Typography gutterBottom>
                  <b>{campaign.plannedEnd || '--'}</b>
                </Typography>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={3}>
                <Typography gutterBottom className={classes.statsTitle}>
                  Description
                </Typography>
                <Typography gutterBottom>
                  <b>{campaign.description || '--'}</b>
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
                  Status
                </Typography>
                <Typography gutterBottom>
                  <b>{campaign.status || '--'}</b>
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
              justify="flex-end"
              alignItems="center"
            >
              {statusColorCode('green', 'Approved')}
              {statusColorCode('yellow', 'Pending Approval')}
              {statusColorCode('red', 'Rejected')}
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} className={classes.ruleTable}>
                <MaterialTable
                  columns={state.columns}
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

import React, { useState, useEffect } from 'react';
import {useHistory} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import PublishIcon from '@material-ui/icons/Publish';
import StopIcon from '@material-ui/icons/Stop';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { IconButton, MenuItem, TablePagination } from '@material-ui/core';
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import AddIcon from '@material-ui/icons/Add';
import VisibilityIcon from '@material-ui/icons/Visibility'

import { GetAllCampaignList, PutCampaignPublish } from '../../actions/CampaignActions';
import CardViewWrapper from "../../../../../components/HOC/CardViewWrapper"
import DropDown from '../../../../../components/DropDownComponent'
import { isActiveForRoles } from '../../../../../utils/auth';
import ConfirmationModal from './ConfirmationModal';
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
      '& .MuiIconButton-root': {
        '&:hover': {
          backgroundColor: 'transparent'
        },
      },

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
  startBtn: {
    color: '#282a73',
    paddingLeft: '0px',
    paddingRight: '0px'
  },
  moreIcon: {
    '& img': {
      width: "fit-content !important",
      height: "unset !important",
      objectFit: "unset !important"
    }
  },
  table: {
    backgroundColor: "#eef1f8",
    borderRadius: 8,
    margin:16,
  },
});

const defaultVal = {
    "filter": {
      "name": "",
      "status": null
    },
    "pageNumber": 0,
    "pageSize": 10,
    "sortDirection": "DESC",
    "sortOn": [
      "updatedAt"
    ]
  }

export default function CampaignList() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const campaignData = useSelector((state) => state.campaignReducer.campaigns);
  const loading = useSelector((state) => state.campaignReducer.loading);
  const [filters, setFilters] = useState(defaultVal);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [modalData, setModalData] = useState(null);
  
  const drop = [
    {
      key : null,
      label : 'Select Option'
    },
    {
      key : 'DRAFT',
      label : 'DRAFT'
    },
    {
      key : 'PUBLISHED',
      label : 'PUBLISHED'
    }
  ]
  const [state, setState] = React.useState({
    columns: [
      { title: 'Name', field: 'name', cellStyle: { color: '#1F4287', fontWeight: 600 }, render: rowData => <span> {rowData.name || '--'} </span> },
      // eslint-disable-next-line react/display-name
      { title: 'Description', field: 'description', render: rowData => <span> {rowData.description || '--'} </span>},
      { title: 'Status', field: 'status', render: rowData => <span> {rowData.status || '--'} </span>},
      { title: 'Campaign Manager', field: 'managerName', render: rowData => <span> {rowData.managerName || '--'} </span>},
      { title: 'No. of Stages', field: 'totalStages', render: rowData => <span> {rowData.totalStages || '--'} </span> },
    ],
  });

  const onClickHandler = function onClickHandler() {
      history.push('/dash/governance/campaign/details')
  }

  const addNewHandler = function addNewHandler() {
    history.push('/dash/governance/campaign/create')
  }

  const handleChangePage = (event, newPage) => {
    setFilters({ ...filters, pageNumber: newPage })
  }

  const handleChangeRowsPerPage = (event) => {
    setFilters({ ...filters, pageNumber: 0, pageSize: parseInt(event, 10) })
  }

  useEffect(() => {
    dispatch(GetAllCampaignList(filters))
  }, [filters])

  return (
    <div style={{ overflow: 'auto', height: 'min-content' }}>
      <Grid container>
        <Grid item xs={12}>
          <CardViewWrapper>
            <Grid container spacing={2}>
              <Grid item xs={12} className={classes.ruleTable}>
                <MaterialTable
                  title="Campaign List"
                  columns={state.columns}
                  data={campaignData ? campaignData.content : []}
                  onSearchChange = {text => {
                    let obj = filters.filter;
                    obj.name = text
                    setFilters({...filters, filter:obj})
                  }}
                  onOrderChange={(orderedColumnId, orderDirection) => {
                    console.log('orderedColumnId',orderedColumnId)
                    console.log('orderDirection',orderDirection)
                  }}
                  options={{
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
                    draggable: true,
                    actionsColumnIndex: -1
                  }}
                  onRowClick={(event, rowData) => rowData.running && history.push(`/dash/governance/campaign/details/${rowData.id}`)}
                  actions={[
                    {
                      icon: () => isActiveForRoles(['ORG_ADMIN']) && (
                        <div style={{ display: 'flex' }}>
                          <DropDown title={filters.filter.status || 'Sort' } options={drop} body={
                            drop.map((o,k) => {
                              return (
                                <MenuItem
                                  key={k}
                                  value={filters.filter.status}
                                  onClick={() => { 
                                    let obj = filters.filter
                                    obj.status = o.key
                                    setFilters({ ...filters, filter: obj }) 
                                  }}
                                >
                                  <div style={{ display: 'flex' }}>
                                    <span style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '12px', lineHeight: '20px', color: '#8998AC', marginLeft: '0px' }}>{o.label}</span>
                                  </div>
                                </MenuItem>
                              )
                            })
                          }/>
                        </div>
                      ),
                      isFreeAction: true,
                    },
                    {
                      icon: () => isActiveForRoles(['ORG_ADMIN']) && (<span>
                        <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<AddIcon />} 
                        disableElevation 
                        disableFocusRipple 
                        disableRipple 
                        className={classes.tableAddIcon}
                        onClick={addNewHandler}
                        >
                          ADD New
                        </Button></span>), 
                      isFreeAction: true,
                    },
                    rowData => ({
                      icon: () => (
                        <IconButton
                          disabled={!isActiveForRoles(['ORG_ADMIN']) || rowData.status !== 'DRAFT'}
                          className={classes.startBtn}
                        >
                          <PublishIcon />
                        </IconButton>
                      ),
                      tooltip: 'Publish',
                      disabled: !isActiveForRoles(['ORG_ADMIN']) || rowData.status !== 'DRAFT',
                      onClick: (event, rowData) => dispatch(PutCampaignPublish(rowData.id, filters))
                    }),
                    rowData => ({
                      icon: () => (
                        rowData.running ? (
                          <IconButton
                            disabled={ !isActiveForRoles(['ORG_ADMIN']) || rowData.executionStatus === null || rowData.executionStatus === 'STARTED' || rowData.executionStatus === 'COMPLETED' || rowData.executionStatus === 'ABORTED' || loading }
                            className={classes.startBtn}
                          >
                            <StopIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            disabled={!isActiveForRoles(['ORG_ADMIN']) || rowData.status === 'DRAFT' || loading}
                            className={classes.startBtn}
                          >
                            <PlayCircleFilledWhiteIcon />
                          </IconButton>
                        ) 
                      ),
                      // tooltip: rowData.running ? 'Stop' : 'Start',
                      tooltip: (rowData.status === 'PUBLISHED' && rowData.executionStatus === null) ? 'Campaign Stopped' : (rowData.status === 'DRAFT' && rowData.executionStatus === null) ? 'Campaign Not Running' : rowData.executionStatus === 'STARTED' ? 'Campaign Start Initiated & Processing' : rowData.executionStatus === 'RUNNING' ? 'Campaign Running' : rowData.executionStatus === 'COMPLETED' ? 'Campaign Stop Initiated & Processing' : rowData.executionStatus === 'ABORTED' ? 'Campaign Abort Initiated & Processing' : null,
                      // disabled: !isActiveForRoles(['ORG_ADMIN']),
                      disabled: !isActiveForRoles(['ORG_ADMIN']) || rowData.status === 'DRAFT',
                      onClick: (event, rowData) => {
                        setModalData(rowData)
                        setShowConfirmation(true)
                      }
                    }),
                    rowData => ({
                      icon: () => (
                        !isActiveForRoles(['ORG_ADMIN']) ? (
                          <IconButton
                            disabled={rowData.running || loading}
                            className={classes.startBtn}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            disabled={rowData.running || loading}
                            className={classes.startBtn}
                          >
                            <EditIcon />
                          </IconButton>
                        )
                        
                      ),
                      tooltip: !isActiveForRoles(['ORG_ADMIN']) ? 'View Campaign' : 'Edit Campaign',
                      disabled: rowData.running,
                      onClick: (event, rowData) => history.push(`/dash/governance/campaign/edit/${rowData.id}`)
                    }),
                  ]}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomPagination    
                  rowsPerPageOption={[5, 10, 20, 30]}  
                  totalCount = {campaignData ? campaignData.totalElements : undefined}                  
                  count={campaignData ? Math.ceil(campaignData.totalElements /filters.pageSize)  : 0}
                  page={filters.pageNumber}
                  onChangePage={handleChangePage}
                  rowsPerPage={filters.pageSize}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </Grid>
            </Grid>
            <ConfirmationModal 
              open={showConfirmation} 
              modalData={modalData} 
              setModalData={setModalData} 
              filters={filters}
              onClose={() => {
                setShowConfirmation(false)
                setModalData(null)
              }} 
              name={modalData && modalData.running ? 'Stop' :'Start'} 
            />
          </CardViewWrapper>
        </Grid>
      </Grid>
    </div>
  );
}

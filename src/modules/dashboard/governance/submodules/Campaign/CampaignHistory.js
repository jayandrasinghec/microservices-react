import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';
import CardViewWrapper from "../../../../../components/HOC/CardViewWrapper"
import DropDown from '../../../../../components/DropDownComponent'
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { PostCampaignHistoryList, clearCampaignHistory } from '../../actions/CampaignActions';
import { MenuItem, TablePagination } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { isActiveForRoles } from '../../../../../utils/auth';
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
  "filter": {
    "name": "",
    "campaignId": "",
    "revisionId": "",
    "historyId":"",
    "executionId":""
  },
  "keyword": "",
  "pageNumber": 0,
  "pageSize": 10,   
  "sortDirection": "DESC",
  "sortOn": [
    "updatedAt"
  ]
}

export default function CampaignHistory() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const campaignData = useSelector((state) => state.campaignReducer.campaignHistory);
  const history = useHistory();
  const [filters , setFilters] = useState(defaultVal)
  // const drop = ['CREATED', 'COMPLETED','STARTED','RUNNING']
  const drop = [
    {
      key : null,
      label : 'Select Option'
    },
    {
      key : 'ACTIVE',
      label : 'ACTIVE'
    },
    {
      key : 'ARCHIVED',
      label : 'ARCHIVED'
    }
  ]
  // const [state, setState] = React.useState({
  //   columns: [
  //     {
  //       title: 'User Name', field: 'userName', cellStyle: { color: '#1F4287', fontWeight: 600 },
  //     },
  //     { title: 'Target', field: 'target', cellStyle: { color: '#1F4287', fontWeight: 600 } },
  //     { title: 'Manager', field: 'manager' },
  //     { title: 'Reviewers', field: 'reviewers' },
  //     { title: 'Reviewed by', field: 'reviewedBy' },
  //     { title: 'Reviewed at', field: 'reviewedAt' },
  //     { title: 'Stage', field: 'stage' },
  //     { title: 'Remedied at', field: 'remediedAt' },
  //     {
  //       title: 'Comments', field: 'comments', render: rowData => (
  //         <>
  //           <select className={classes.custSelect}>
  //             <option>Select a value</option>
  //           </select>
  //         </>
  //       )
  //     },
  //   ],
  //   data: [
  //     { userName: 'Mehmet', target: 'Baran', manager: 'Baran', reviewers: 1, reviewedBy: 'created', reviewedAt: 1, stage: 2, remediedAt: 4, },
  //     { userName: 'Mehmet', target: 'Baran', manager: 'Baran', reviewers: 1, reviewedBy: 'created', reviewedAt: 1, stage: 2, remediedAt: 4, },
  //     { userName: 'Mehmet', target: 'Baran', manager: 'Baran', reviewers: 1, reviewedBy: 'created', reviewedAt: 1, stage: 2, remediedAt: 4, },
  //     { userName: 'Mehmet', target: 'Baran', manager: 'Baran', reviewers: 1, reviewedBy: 'created', reviewedAt: 1, stage: 2, remediedAt: 4, },
  //     { userName: 'Mehmet', target: 'Baran', manager: 'Baran', reviewers: 1, reviewedBy: 'created', reviewedAt: 1, stage: 2, remediedAt: 4, },
  //   ],
  // });
  const columns = [
      {
        title: 'Name', field: 'name', cellStyle: { color: '#1F4287', fontWeight: 600 }, render: rowData => <span> {rowData.name || '--'} </span>
      },
      // eslint-disable-next-line react/display-name
      // { title: 'Description', field: 'description', render: rowData => <span> {rowData.description || 'No Description'} </span>},
      { title: 'Description', field: 'description', render: rowData => <span> {rowData.description || '--'} </span>},
      {
        title: 'Iteration', field: 'iteration', cellStyle: { color: '#1F4287', fontWeight: 600 }, render: rowData => <span> {rowData.iteration || '--'} </span>
      },
      { title: 'Start Date', field: 'startDate', render: rowData => <span> {getFormatedDate(rowData.startDate) || '--'} </span> },
      // { title: 'State', field: 'state' },
      // { title: 'Stage', field: 'stage' },
      // { title: 'Esc.Level', field: 'escLevel' },
      { title: 'End Date', field: 'endDate', render: rowData => <span> {getFormatedDate(rowData.endDate) || '--'} </span> },
      { title: 'Total Stages', field: 'totalStages', render: rowData => <span> {rowData.totalStages || '--'} </span> },

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

  useEffect(() => {
    dispatch(PostCampaignHistoryList(filters))
    // return () => {
    //     dispatch(clearCampaignHistory())
    // }
  }, [filters])

  return (
    <div style={{ overflow: 'auto', height: 'min-content' }}>
      <Grid container>
        <Grid item xs={12}>
          <CardViewWrapper>
            <Grid container spacing={2}>
              <Grid item xs={12} className={classes.ruleTable}>
                <MaterialTable
                  title="History List"
                  columns={columns}
                  data={campaignData ? campaignData.content : []}
                  options={{
                    // toolbar: false,
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
                  onSearchChange = {text => {
                    let obj = filters.filter;
                    obj.name = text
                    setFilters({...filters, filter:obj})
                  }}
                  onRowClick={(event, rowData) => history.push(`/dash/governance/history/details/${rowData.id}`) }
                  // actions={[
                  //   {
                  //     icon: () => isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && (
                  //       <div style={{ display: 'flex' }}>
                  //         <DropDown title={filters.filter.status} options={drop}  body={
                  //           drop.map((o,k) => {
                  //             return (
                  //               <MenuItem
                  //                 key={k}
                  //                 onClick={e => { 
                  //                           let obj = filters.filter
                  //                           obj.status = o.key
                  //                           setFilters({ ...filters, filter: obj }) 
                  //                         }}
                  //               >
                  //                 <div style={{ display: 'flex' }}>
                  //                   <span style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '12px', lineHeight: '20px', color: '#8998AC;', marginLeft: '0px' }}>{o.label}</span>
                  //                 </div>
                  //               </MenuItem>
                  //             )
                  //           })
                  //         }/>
                  //       </div>
                  //     ),
                  //     isFreeAction: true,
                  //   }
                  // ]}
                  
                />
              </Grid>
              <Grid item xs={12}>
                {/* <TablePagination
                  // className={classes.pagination}
                  component="div"
                  rowsPerPageOptions={[5, 10, 20, 30]}
                  count={campaignData ? campaignData.totalElements : 0}
                  page={filters.pageNumber}
                  onChangePage={handleChangePage}
                  rowsPerPage={filters.pageSize}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                /> */}
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
          </CardViewWrapper>
        </Grid>

      </Grid>

    </div >
  );
}

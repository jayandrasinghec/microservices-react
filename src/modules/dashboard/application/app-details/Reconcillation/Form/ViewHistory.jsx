/* eslint-disable react/display-name */
import React from 'react';
import { Link as Linking } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import AppTextInput from '../../../../../../components/form/AppTextInput';
import AppSelectInput from '../../../../../../components/form/AppSelectInput';
import { makeStyles } from '@material-ui/core/styles';
import {isActiveForRoles} from '../../../../../../utils/auth'
import UserFilterCard from '../../../../directory/user-list/UserFilterCard'
import AppMaterialTable from '../../../../../../components/AppMaterialTable';
import { getFormatedDate } from '../../../../../../utils/helper';
import { callApi } from '../../../../../../utils/api';
import { TablePagination, Tooltip } from '@material-ui/core';
import CustomPagination from '../../../../../../components/CustomPagination';

const useStyles = makeStyles(() => ({
  container: {
    
  },
  divone: {
    marginRight: 20,
    marginLeft: 10,
    borderRadius: '10px',
    flex: 1,
    overflowY: 'auto'
  },
  paperone: {
    padding: 25,
    marginBottom: 20,
    marginTop: 20,
    border: 'none',
    boxShadow: 'none'
  },
  papertwo: {
    padding: 25,
    marginBottom: 20,
    marginTop: 20,
    border: 'none',
    boxShadow: 'none'
  },
  flexdiv: {
    display: 'flex'
  },
  button: {
    float: 'right',
    borderRadius: '8px',
    marginRight: 20
  },
  toolTipFont: {
    fontSize: '15px'
  },
  tabView: {
    fontWeight: 'bold', 
    fontSize: '16px',
    cursor: 'pointer',
    paddingBottom: '5px'
  },
  active: {
    color: '#363795',
    borderBottom: '3px solid #363795',
  }
}))


export default function AuthPolicyForm(props) {
  const classes = useStyles()
  const { newMaster, setTable, rowData } = props
  const [type, setType] = React.useState('success')
  const defaultFilters = {
    "filter": {
      "reconciliationId": rowData && rowData.reconciliationId,
      "batchId": rowData && rowData.batchId,
      "reconSuccess": true
    },
    "keyword": "",
    "pageNumber": 0,
    "pageSize": 10,
    "sortDirection": "ASC",
    "sortOn": [
      "id"
    ]
  }
  
  const [filters, _setFilters] = React.useState(defaultFilters)
  const [data, setData] = React.useState([])
  const [total, setTotal] = React.useState(0)

  const trimmedString = (data) => {
    if (data && data.length > 15){
      return `${data.substring(0, 15)}...`
    } else {
      return data
    }
  }
  
  // const [data, setData] = React.useState([
  //   {
  //     modes:'Full Reconciliation',
  //     frequency:'Daily',
  //     type:'User',
  //     state:'Active',
  //     updatedAt:'20-10-2020 13:29:29'
  //   }
  // ])
  const [data2, setData2] = React.useState([
    {
      name:'Nipul Singal',
      login:'nipul',
      createdBy:'nipul',
      createdAt:'20-10-2020 13:29:29'
    }
  ])
  // const columns = [
  //   { title: 'Modes', field: 'modes' },
  //   { title: 'Frequency', field: 'frequency' },
  //   { title: 'Type', field: 'type' },
  //   { title: 'Sync State', field: 'state' },
  //   { title: 'Last run', field: 'updatedAt' },
  // ]
  // const columns2 = [
  //   { title: 'Name', field: 'name' },
  //   { title: 'Login', field: 'login' },
  //   { title: 'Created By', field: 'createdBy' },
  //   { title: 'Created At', field: 'createdAt' },
  // ]

  const columns = [
    { title: 'Login', field: 'data.login', render: rowData => <span> {rowData.data.login || '--'} </span> },
    { title: 'Primary Status', field: 'primaryStatus', render: rowData => <span> {rowData.primaryStatus || '--'} </span> },
    { title: 'Failure Reason', field: 'failureReason', cellStyle: { maxWidth: '220px' }, render: rowData => <Tooltip title={<span className={classes.toolTipFont}>{rowData.failureReason}</span>} placement="top"><span> {trimmedString(rowData.failureReason) || '--'} </span></Tooltip> },
    // { title: 'Delta Type', field: 'deltaType', render: rowData => <span> {rowData.deltaType || '--'} </span> },
    { title: 'Operation', field: 'reconOperation', render: rowData => <span> {rowData.reconOperation || '--'} </span> },
    { title: 'Updated At', field: 'updatedDateTime', render: rowData => <span> {getFormatedDate(rowData.updatedDateTime, 'DD-MM-YYYY HH:mm:ss') || '--'} </span> },
  ]
  

  const downloadData = () => {
    callApi(`/provsrvc/reconciliation/history/detail`, 'POST', filters)
      .then(e => {
        if (e.success) {
          setData(e.data ? e.data.content : [])
          setTotal(e.data ? e.data.totalElements : 0)
        } 
      })
  }

  React.useEffect(() => downloadData(), [filters])

  const handleChangePage = (event, newPage) => _setFilters({ ...filters, pageNumber: newPage })
  const handleChangeRowsPerPage = (event) => {
    _setFilters({ ...filters, pageNumber: 0, pageSize: parseInt(event, 10) })
  }

  console.log(props.type)

  return (
    <div className={classes.container}>
      <div className={classes.divone}>
        <Paper variant="outlined" elevation={3} className={classes.paperone} >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <AppTextInput 
                label="Modes"
                value={rowData.reconMode}
                disabled
              />
            </Grid>
            {/* <Grid item xs={12} md={4}>
              <AppTextInput label="Frequency"
                value={newMaster.frequency}
              />
            </Grid> */}
            <Grid item xs={6} md={4}>
              <AppTextInput 
                label="Sync Field"
                value={rowData.reconciliationName}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppTextInput 
                label="Source Attributes"
                value={rowData.reconType}
                disabled
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <AppTextInput 
                label="Job Completion Time"
                value={getFormatedDate(rowData.updatedDateTime, 'DD-MM-YYYY HH:mm:ss')}
                disabled
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper variant="outlined" elevation={3} className={classes.paperone} >
          <Grid container spacing={3}>
            <Grid item xs={12}>Summary</Grid>
            <Grid item xs={12}>{`${rowData.sucessCount} records synced.`}</Grid>
            <Grid item xs={12}>{`${rowData.failCount} record error.`}</Grid>
          </Grid>
        </Paper>

        <Grid item xs={12}>
          <span
            onClick={() => {
              setType('success')
              _setFilters({...filters, filter : {...filters.filter, reconSuccess: true }})
            }}
            className={type === 'success' ? `${classes.tabView} ${classes.active} ml-3 mr-4 ` : `${classes.tabView} ml-3 mr-4`}
          >
            Success
          </span>
          <span
            onClick={() => {
              setType('error')
              _setFilters({...filters, filter : {...filters.filter, reconSuccess: false }})
            }}
            className={type === 'error' ? `${classes.tabView} ${classes.active}` : classes.tabView}
          >
            Error
          </span>
        </Grid>

        <AppMaterialTable
          columns={type === 'success' ? (data.length > 0 ? columns : []) : (data.length > 0 ? columns : [])}
          data={type === 'success' ? data : data}
          options={{
            toolbar: false,
            search: false,
            paging: false,
            draggable: true,
            
          }}
        />
        {/* <TablePagination
          component="div"
          // rowsPerPageOptions={[12, 24, 60, 120]}
          count={total}
          page={filters.pageNumber}
          onChangePage={handleChangePage}
          rowsPerPage={filters.pageSize}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        /> */}

      <CustomPagination             
                    count={Math.ceil(total / filters.pageSize)}
                    totalCount = {total}
                    page={filters.pageNumber}
                    onChangePage={handleChangePage}
                    rowsPerPage={filters.pageSize}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
              />

        <div className={classes.flexdiv}>
          <Grid item xs={8}>
            <Button onClick={() => setTable(true)}>
              Back
            </Button>
          </Grid>
        </div>
      </div>
    </div>
  )
}

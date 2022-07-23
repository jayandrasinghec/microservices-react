/* eslint-disable react/display-name */
import React from 'react'
import Modal from '@material-ui/core/Modal'
import Plus from '../../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/plus.svg'
import { callApi } from '../../../../../../utils/api'
import { showSuccess } from '../../../../../../utils/notifications'
import AppCheckbox from '../../../../../../components/form/AppCheckbox'
import AppTextInput from '../../../../../../components/form/AppTextInput'
import AppSelectInput from '../../../../../../components/form/AppSelectInput'
import ActiveStatusChip from '../../../../../../components/HOC/ActiveStatusChip'
import InactiveStatusChip from '../../../../../../components/HOC/InactiveStatusChip'
import AppMaterialTable from '../../../../../../components/AppMaterialTable';
import Edit from '../../../../../../FrontendDesigns/new/assets/img/icons/edit.svg'
import {isActiveForRoles} from '../../../../../../utils/auth'
import { TablePagination } from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import ViewHistory from '../EditRule/ViewHistory'
import { getFormatedDate } from '../../../../../../utils/helper'
import CustomPagination from '../../../../../../components/CustomPagination'

export default function History(props) {
  const {app, table, setTable} = props
  const [addEditView, setAddEditView] = React.useState()
  const [rowData, setRowData] = React.useState(null)
  const defaultFilters = {
    "filter": {
      "applicationId": app && app.id
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

  // const [data, setData] = React.useState([
  //   {
  //     modes:'Full Reconciliation',
  //     frequency:'Daily',
  //     type:'User',
  //     state:'Active',
  //     updatedAt:'20-10-2020 13:29:29'
  //   }
  // ])
  const [data, setData] = React.useState([])
  const [total, setTotal] = React.useState(0)

  const downloadData = () => {
    // const field = type
    // callApi(`/utilsrvc/meta/list/${field}`, 'POST', types)
    //   .then(e => {

    //     if (e.success) {
    //       setData(e.data ? e.data.content : [])
    //     } 
    //   })

    callApi(`/provsrvc/reconciliation/history/list`, 'POST', filters)
      .then(e => {
        if (e.success) {
          setData(e.data ? e.data.content : [])
          setTotal(e.data ? e.data.totalElements : 0)
        } 
      })
  }

  const handleChangePage = (event, newPage) => _setFilters({ ...filters, pageNumber: newPage })
  const handleChangeRowsPerPage = (event) => {
    _setFilters({ ...filters, pageNumber: 0, pageSize: parseInt(event, 10) })
  }

  React.useEffect(() => downloadData(), [filters])

  const columns = [
    { title: 'Name', field: 'reconciliationName', render: rowData => <span> {rowData.reconciliationName || '--'} </span> },
    { title: 'Modes', field: 'reconMode' },
    // { title: 'Frequency', field: 'frequency' },
    { title: 'Type', field: 'reconType' },
    { title: 'Sync State', field: 'syncStatus' },
    { title: 'Start Datetime', field: 'startDateTime', render: rowData => <span> {getFormatedDate(rowData.startDateTime) || '--'} </span> }
  ]

  return (
    <>
    {table === true ? (
      <>
        <AppMaterialTable
          columns={data.length > 0 ? columns : []}
          data={data}
          actions={[
            {
              icon: () => (
                <VisibilityIcon style={{ color: '#ddd' }}/>
              ),
              tooltip: 'View Row',
              onClick: (event, rowData) => { 
                setTable(false) 
                setRowData(rowData)
                setAddEditView('VIEW-ROW')
              }          
            },
          ]}
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
      </>
    ) : (
      addEditView === 'VIEW-ROW' ? 
        ( <ViewHistory app={app} setTable={setTable} rowData={rowData} type="VIEW"/> ) : (<></>)
    )}
    
    </>
  )
}



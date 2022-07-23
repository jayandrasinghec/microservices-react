/* eslint-disable react/display-name */
import React from 'react';
import { useHistory } from "react-router-dom";
import { callApi, getTenant } from '../../../utils/api'
import AppMaterialTable from '../../../components/AppMaterialTable';
import ScrollWrapper from "../../../components/HOC/ScrollWrapper";
import Header from './Header'
import { reportListData } from './ReportListData'
import { Grid } from '@material-ui/core';
import CustomPagination from '../../../components/CustomPagination';
import moment from 'moment';
import { getFormatedDate } from '../../../utils/helper';

const defaultData = {
  // "name":"password policy name2",
  // "description":"description",
  "isDefault": false,
  "active": false
}

export default function ReportList(props) {
  const defaultQuery = {
    order: "ASC",
    page: 1,
    items: 10,
    sortBy: "title",
    keyword: "",
    // sort: { title: 'asc' }
  }

  const [data, setData] = React.useState([])
  const [totalData, setTotalData] = React.useState(0)
  const [query, _setQuery] = React.useState(defaultQuery)
  const history = useHistory();

  const handleChangePage = (event, newPage) => { 
    _setQuery({ ...query, page: newPage + 1 })
  }
 
  const handleChangeRowsPerPage = (event) => {
    _setQuery({ ...query, page: 1, items: parseInt(event, 10) })
  }

  const createReports = () => {
    const headers = {
      'Accept': 'application/json',
      'tenant': getTenant(),
    }
    if (process.env.NODE_ENV === 'development') headers['clientip'] = '0.0.0.0'
    headers['content-type'] = 'application/json'
    const method = 'POST';
    const body = { data: reportListData.newRowData };

    fetch(`/reportingsvc/v1/reports/createMulti`, {
      headers,
      method,
      body: JSON.stringify(body),
    })
    .then(res => res.json())
    .then(res => {
      downloadData()
    })
  }

  const downloadData = () => {
    const body = query
    callApi(`/reportingsvc/v1/reports/list?page=${query.page}&items=${query.items}`, 'POST', body )
      .then(e => {
        if (e.success) {
          setData(e.data ? e.data : [])
          setTotalData(e.totalElements ? e.totalElements : 0)
        } else {
          if (e.error && e.error === 'COLLECTION_NOT_FOUND') createReports()
        }
      })
  }

  React.useEffect(() => downloadData(), [query])

  const columns = [
    // { title: 'Sr No.', field: 'id', cellStyle: { fontWeight: '700', border: 'none' } },
    { title: 'Report', field: 'title', cellStyle: { fontWeight: '700', border: 'none' } },
    { title: 'Created by', field: 'createdBy' },
    { title: 'Created at', field: 'createdAt', render: (data) => {
      return data && getFormatedDate(data.createdAt, 'DD/MM/YYYY HH:mm')} 
    },
  ]

  const handleClick = (route) => {
    history.push(`/dash/report/${route}`)
  }
  return (
    <div style={{ overflow: 'scroll', height: '100%' }}>
      <Grid container>
      <Header title="Reports" profile={props.profile} />
      <Grid item xs={12}>
      <ScrollWrapper>
          <AppMaterialTable
            columns={columns}
            data={data}
            // data={reportListData.rowData}
            onRowClick={
              (event, rowData) => {
                handleClick(rowData.route)
              }
            }
            onSearchChange={(key) => {
              _setQuery({...query, keyword: key})
            }}
            // onOrderChange={(orderedColumnId, orderDirection) => {
            //   let obj = {}
            //   if (columns[orderedColumnId]) {
            //     obj[[columns[orderedColumnId].field]] = orderDirection
            //   }
            //   _setQuery({...query, sort: obj})
            // }}
            options={{
              paging:false,
              paginationType: 'stepped',
              draggable: false,
              actionsColumnIndex: -1
          }}
          />
          <CustomPagination 
            count={Math.ceil(totalData/query.items)}
            totalCount = {totalData}
            page={query.page}
            onChangePage={handleChangePage}
            rowsPerPage={query.items}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </ScrollWrapper>
      </Grid>
      <div style={{ width: '100% !important', overflow: 'auto', height: '100%'}}>
        
      </div>
      </Grid>
    </div>
    
  )
}









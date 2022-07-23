import React, { useEffect, useState } from 'react';
import Header from './Header';
import { Button, Grid, TablePagination } from '@material-ui/core';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import {AgGridReact} from '@ag-grid-community/react';
import {LicenseManager} from "@ag-grid-enterprise/core";
import {AllModules} from '@ag-grid-enterprise/all-modules';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Data from './AuditLogReport/AuditData.json'
import { callApi } from '../../../utils/api';
import { setItem } from 'localforage';
import ScrollWrapper from '../../../components/HOC/ScrollWrapper';
import CardViewWrapper from '../../../components/HOC/CardViewWrapper';
import CustomPagination from '../../../components/CustomPagination';
// LicenseManager.setLicenseKey("For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-17_October_2020_[v2]_MTYwMjg4OTIwMDAwMA==10b84bf5b7eb0b92c717b40e1ae8f8ab");

export default function TestReport(props) {
  const [newData, setNewdata] = useState([]) 
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState(10);

  let defaultColDef = {
    flex: 1,
    sortable: true,
    resizable: true,
    filter: true,
    enablePivot: true
  }

  const handleChangePage = (event, newPage) => {
    // setFilters({ ...filters, pageNumber: newPage }) 
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    // setFilters({ ...filters, pageNumber: 0, pageSize: parseInt(event.target.value, 10) })
    setItems(parseInt(event, 10))
    setPage(0)
  }

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  }
  
  const downloadAsCSV = () => {
    gridApi.exportDataAsCsv();
  }

  const downloadAsExcel = () => {
    gridApi.exportDataAsExcel();
  }

  const body = {
    "json": {
        "collection": "audit_log",
        "join": [
            {
                "collection": "user",
                "localColumn": "source_id",
                "foreignColumn": "_id",
                "joinCollectionAlias": "joinTableOne",
                "isLeftJoin": false
            }
        ],
        "measures": [
            {
                "userId": "source_id"
            }
        ],
        "dimensions": [
            {
                "userName": "joinTableOne.displayName",
                "email": "joinTableOne.email",
                "lastLogin": "joinTableOne.provisionedApps.CYMMETRI.login.lastLoginTime",
                "userStatus": "joinTableOne.status",
                "accountStatus": "joinTableOne.provisionedApps.CYMMETRI.login.status",
                "department": "joinTableOne.department",
                "designation": "joinTableOne.designation"
            }
        ],
        "sort": {
            "count": -1
        }
    }
  }

  const columns = [
    { "headerName": "User Name", "field": "userName", "floatingFilter": true, "enableRowGroup": true},
    { "headerName": "Email", "field": "email"},
    { "headerName": "Last login", "field": "lastLogin"},
    { "headerName": "User Status", "field": "userStatus"},
    { "headerName": "Account Status", "field": "accountStatus"},
    { "headerName": "Count", "field": "count"}
  ]

  const downloadData = () => {
    callApi(`/reportingsvc/v1/reports/executeAggregate?page=${page + 1}&items=${items}`, 'POST', body)
        .then(result => {
            console.log("Report", result.data)
            setNewdata(result.data.length > 0 ? result.data : [])
        })
    }

  useEffect(() => {
    downloadData()
  }, [page, items])

  return (
    <div style={{ overflow: 'auto', height: '100%' }}>
            <Grid container>
                <Header profile={props.profile} title="Test Report"/>

                <Grid item xs={12}>
                    <CardViewWrapper>
                        <Grid container spacing={2}>
                        <div className="col-md-12 text-right">
                           <Button className="mx-2" onClick={downloadAsCSV} startIcon={<GetAppOutlinedIcon style={{ color: '#363793' }} />} style={{ color: '#363793' }}>
                           Download as CSV
                           </Button>
                           <Button className="mx-2" onClick={downloadAsExcel} startIcon={<GetAppOutlinedIcon style={{ color: '#363793' }} />} style={{ color: '#363793' }}>
                           Download as Excel
                           </Button>
                        </div>
                            <div id="myGrid" className="ag-theme-alpine mt-3" style={ {height: '65vh', width: '100%'} }>
                            <AgGridReact
                              modules={AllModules}
                              columnDefs={columns}
                              rowData={newData}
                              // columnDefs={Data.columnDefs}
                              // rowData={Data.rowData}
                              defaultColDef={defaultColDef}
                              // pagination
                              paginationPageSize={10}
                              autoGroupColumnDef={{ minWidth: 250 }}
                              rowGroupPanelShow="always"
                              pivotPanelShow="always"
                              pivotColumnGroupTotals="after"
                              pivotRowTotals="before"
                              sideBar={true}
                              onGridReady={onGridReady}
                            />
                            </div>
                            <Grid item xs={12} justify={"flex-end"}>
                                {/* <TablePagination
                                    // className={classes.pagination}
                                    component="div"
                                    rowsPerPageOptions={[5, 10, 20, 30]}
                                    // count={assignmentList ? assignmentList.totalElements : 0}
                                    count={'More'}
                                    page={page}
                                    onChangePage={handleChangePage}
                                    rowsPerPage={items}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                /> */}
                                <CustomPagination
                                    rowsPerPageOption={[5, 10, 20, 30]}
                                    count={'More'}
                                    page={page}
                                    onChangePage={handleChangePage}
                                    rowsPerPage={items}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            </Grid>
                        </Grid>
                    </CardViewWrapper>
                </Grid>
            </Grid>
        </div>
  )
}

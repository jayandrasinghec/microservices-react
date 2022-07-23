import React from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import Header from '../Header'
import Data from './data.json';
import {AgGridReact} from '@ag-grid-community/react';
import {AllModules} from '@ag-grid-enterprise/all-modules';
import {LicenseManager} from "@ag-grid-enterprise/core";

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

LicenseManager.setLicenseKey("For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-17_October_2020_[v2]_MTYwMjg4OTIwMDAwMA==10b84bf5b7eb0b92c717b40e1ae8f8ab");

export default function UserAppReportGrid(props) {

  let columnDefs = [
    {headerName:"Unique User",field:"user",floatingFilter: true, enablePivot: true, cellClass: 'userCellBackground', cellStyle: function(params) {
      if(params.data !== undefined) {
        let userType = params.data.type;
        let background
        userType === "generic" ?  background = "#eee" : background = "#fff";

        return {background: background};
      }
    }},
    {headerName:"A",field:"a",cellRenderer: renderIconFunc},
    {headerName:"Ber",field:"ber",cellRenderer: renderIconFunc},
    {headerName:"Car",field:"car",cellRenderer: renderIconFunc},
    {headerName:"Co",field:"co",cellRenderer: renderIconFunc},
    {headerName:"Col",field:"col",cellRenderer: renderIconFunc},
    {headerName:"Con",field:"con",cellRenderer: renderIconFunc},
    {headerName:"De",field:"de",cellRenderer: renderIconFunc},
    {headerName:"Ke",field:"ke",cellRenderer: renderIconFunc},
    {headerName:"Kno",field:"kno",cellRenderer: renderIconFunc},
    {headerName:"Lon",field:"lon",cellRenderer: renderIconFunc},
    {headerName:"Nas",field:"nas",cellRenderer: renderIconFunc},
    {headerName:"Ne",field:"ne",cellRenderer: renderIconFunc},
    {headerName:"New",field:"new",cellRenderer: renderIconFunc},
    {headerName:"Port",field:"port",cellRenderer: renderIconFunc},
    {headerName:"Prov",field:"prov",cellRenderer: renderIconFunc},
    {headerName:"Sacr",field:"sacr",cellRenderer: renderIconFunc},
    {headerName:"San",field:"san",cellRenderer: renderIconFunc},
    {headerName:"Sea",field:"sea",cellRenderer: renderIconFunc},
    {headerName:"Sev",field:"sev",cellRenderer: renderIconFunc},
    {headerName:"Sig",field:"sig",cellRenderer: renderIconFunc},
    {headerName:"Sto",field:"sto",cellRenderer: renderIconFunc},
    {headerName:"Van",field:"van",cellRenderer: renderIconFunc}
  ]
  
  let defaultColDef = {
    // flex: 1,
    enableValue: true,
    enableRowGroup: true,
    enablePivot: true,
    sortable: true,
    resizable: true,
    filter: true,
  }

  let gridApi;
  let gridColumnApi;
  const onGridReady = (params) => {
    gridApi = params.api;
    gridColumnApi = params.columnApi;
  }
  
  const downloadAsCSV = () => {
    gridApi.exportDataAsCsv();
  }

  const downloadAsExcel = () => {
    gridApi.exportDataAsExcel();
  }

  return (

    <div id="dash-directory" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: 15 }}>
      <Header profile={props.profile} title="GC.041A Control"/>
      <div>
        {/* <Typography variant="h6" gutterBottom>
          GC.041A Control
        </Typography> */}
        <Grid item xs={12}>
          <div className="ag-theme-alpine mt-3" style={ {height: '65vh', width: 'auto'} }>
          <div className="col-md-12 text-right">
            <Button className="mb-2 mx-2" onClick={downloadAsCSV} startIcon={<GetAppOutlinedIcon style={{ color: '#363793' }} />} style={{ color: '#363793' }}>Download as CSV</Button>
            <Button className="mb-2 mx-2" onClick={downloadAsExcel} startIcon={<GetAppOutlinedIcon style={{ color: '#363793' }} />} style={{ color: '#363793' }}>Download as Excel</Button>
          </div>
          <AgGridReact
            modules={AllModules}
            pagination
            paginationPageSize={10}
            columnDefs={columnDefs}
            rowData={Data.rowData}
            sideBar={true}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={{ minWidth: 250 }}
            rowGroupPanelShow="always"
            pivotPanelShow="always"
            pivotColumnGroupTotals="after"
            pivotRowTotals="before"
            onGridReady={onGridReady}
          />
          </div>
        </Grid>
      </div>
    </div>
  )
};

const renderIconFunc = (params) => {
  let icon;

  icon = params.value ? '<img src="https://image.flaticon.com/icons/svg/390/390973.svg" witdh="15px" height="15px" alt="true" title />' : '<img src="https://image.flaticon.com/icons/svg/594/594864.svg" witdh="15px" height="15px" alt="true" title />';

return icon;
}
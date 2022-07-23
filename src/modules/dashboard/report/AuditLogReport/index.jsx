import React from 'react';
import Header from '../Header';
import { Button } from '@material-ui/core';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import {AgGridReact} from '@ag-grid-community/react';
import {LicenseManager} from "@ag-grid-enterprise/core";
import {AllModules} from '@ag-grid-enterprise/all-modules';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Data from './AuditData.json'
LicenseManager.setLicenseKey("For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-17_October_2020_[v2]_MTYwMjg4OTIwMDAwMA==10b84bf5b7eb0b92c717b40e1ae8f8ab");

export default function AuditReport(props) {

  let defaultColDef = {
    flex: 1,
    sortable: true,
    resizable: true,
    filter: true,
    enablePivot: true
  }

  let gridApi;
  let gridColumnApi;
  const onGridReady = (params) => {
    gridApi = params.api;
    gridColumnApi = params.columnApi;
  }
  console.log('gridApi', gridApi)
  const downloadAsCSV = () => {
    gridApi.exportDataAsCsv();
  }

  const downloadAsExcel = () => {
    gridApi.exportDataAsExcel();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: 15,  }}>
      <Header profile={props.profile} title="Audit Log Report"/>
      <div className="ag-theme-alpine mt-3" style={ {height: '65vh', width: '100%'} }>
        <div className="col-md-12 text-right">
          <Button className="mb-2 mx-2" onClick={downloadAsCSV} startIcon={<GetAppOutlinedIcon style={{ color: '#363793' }} />} style={{ color: '#363793' }}>
            Download as CSV
          </Button>
          <Button className="mb-2 mx-2" onClick={downloadAsExcel} startIcon={<GetAppOutlinedIcon style={{ color: '#363793' }} />} style={{ color: '#363793' }}>
            Download as Excel
          </Button>
        </div>
          <AgGridReact
            modules={AllModules}
            columnDefs={Data.columnDefs}
            rowData={Data.rowData}
            defaultColDef={defaultColDef}
            pagination
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
    </div>
  )
}

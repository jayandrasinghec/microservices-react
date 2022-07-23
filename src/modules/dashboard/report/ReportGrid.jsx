'use strict';

import React, { useState, useEffect } from 'react';
import { AgGridReact, AgGridColumn } from '@ag-grid-community/react';
import { ServerSideRowModelModule } from '@ag-grid-enterprise/server-side-row-model';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-material.css';
import './ag-grid.css'
// import '@ag-grid-community/core/dist/styles/ag-theme-alpine-dark.css';
import { callApi } from '../../../utils/api';
 
import Header from './Header';
import { Button, Grid, makeStyles, TablePagination } from '@material-ui/core';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import {LicenseManager} from "@ag-grid-enterprise/core";
import {AllModules} from '@ag-grid-enterprise/all-modules';

// import 'ag-grid-community/dist/styles/ag-grid.css';
// import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
// import Data from './AuditLogReport/AuditData.json'
import CardViewWrapper from '../../../components/HOC/CardViewWrapper';
import { reportFilters, sortAndFilterReports } from '../../../utils/reportHelper';
// LicenseManager.setLicenseKey("For_Trialing_ag-Grid_Only-Not_For_Real_Development_Or_Production_Projects-Valid_Until-17_October_2020_[v2]_MTYwMjg4OTIwMDAwMA==10b84bf5b7eb0b92c717b40e1ae8f8ab");

const CustomLoadingOverlay = (data) => {
    return (
        <div
            className="ag-custom-loading-cell"
            style={{ paddingLeft: '10px', lineHeight: '25px' }}
        >
            <i className="fas fa-spinner fa-pulse"></i>{' '}
            <span> {data.loadingMessage}</span>
        </div>
    );
};

const CustomNoRowsOverlay = (data) => {
    return (
        <div
            // className="ag-overlay-loading-center"
            // style={{ backgroundColor: 'lightcoral', height: '9%' }}
        >
            <h5><i className="far fa-frown"> {data.noRowsMessageFunc()}</i></h5>
        </div>
    );
};

export default function Users(props) {
    const { columnDefs, body, mappings, defaultFilters, defaultDatetimeFilters, title, description } = props
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [page, setPage] = useState(0);
    const [items, setItems] = useState(10);
    const postBody = body

    const onGridReady = (params) => {   
        setGridApi(params.api);
        setGridColumnApi(params.columnApi); 

        const datasource = {
            getRows(params) {
                // params.api.showLoadingOverlay();

                // Construct object to sort/filter report
                let updatedBody = sortAndFilterReports(postBody, mappings, params, defaultFilters, defaultDatetimeFilters)
                
                // Fetch data
                callApi(`/reportingsvc/v1/reports/executeAggregate?page=${params.request.endRow/items}&items=${items}`, 'POST', updatedBody)
                    .then(result => {
                        if(result.data.length > 0) {
                            params.api.hideOverlay();
                        }else {
                            params.api.showNoRowsOverlay();
                        }
                        let currentLastRow = result.data.length < items && params.request.startRow + result.data.length
                        // params.successCallback(result.data, result.maxItems);
                        params.successCallback(result.data, currentLastRow);
                    })
                .catch(error => {
                    console.error(error);
                    params.failCallback();
                })
            }
        };
        // register datasource with the grid
        params.api.setServerSideDatasource(datasource);
    };

    const downloadAsCSV = () => {
        gridApi.exportDataAsCsv();
    }

    const downloadAsExcel = () => {
        gridApi.exportDataAsExcel();
    }

    let defaultColDef = {
        flex: 1,
        sortable: true,
        resizable: true,
        filter: true,
        // buttons: ['reset', 'apply'],
        // enablePivot: true
    }
    
    let sideBar = {
        toolPanels: [
            {
                id: 'columns',
                labelDefault: 'Columns',
                labelKey: 'columns',
                iconKey: 'columns',
                toolPanel: 'agColumnsToolPanel',
                toolPanelParams: {
                    suppressRowGroups: true,
                    suppressValues: true,
                    suppressPivotMode: true,
                    suppressPivots: true
                }
            },
            {
                id: 'filters',
                labelDefault: 'Filters',
                labelKey: 'filters',
                iconKey: 'filter',
                toolPanel: 'agFiltersToolPanel',
            }
        ]
    }

    useEffect(() => {

    }, [page, items])
    
    return (
        <div style={{ overflow: 'auto', height: '100%' }}>
            <Grid container>
                <Header profile={props.profile} title={title} description={description}/>
                <Grid item xs={12}>
                    <CardViewWrapper>
                        <Grid container spacing={2}>
                        {/* <div className="col-md-12 text-right">
                           <Button className="mx-2" onClick={downloadAsCSV} startIcon={<GetAppOutlinedIcon style={{ color: '#363793' }} />} style={{ color: '#363793' }}>
                           Download as CSV
                           </Button>
                           <Button className="mx-2" onClick={downloadAsExcel} startIcon={<GetAppOutlinedIcon style={{ color: '#363793' }} />} style={{ color: '#363793' }}>
                           Download as Excel
                           </Button>
                        </div> */}
                            <div id="myGrid" className="ag-theme-material mt-3 mx-2" style={ {height: '90vh', width: '100%'} }>
                                <AgGridReact
                                    modules={AllModules}
                                    defaultColDef={defaultColDef}
                                    pagination
                                    columnDefs={columnDefs}
                                    autoGroupColumnDef={{ minWidth: 250 }}
                                    // rowGroupPanelShow="always"
                                    // pivotPanelShow="always"
                                    // pivotColumnGroupTotals="after"
                                    // pivotRowTotals="before"
                                    sideBar={sideBar}
                                    frameworkComponents={{
                                        customLoadingOverlay: CustomLoadingOverlay,
                                        customNoRowsOverlay: CustomNoRowsOverlay,
                                    }}
                                    loadingOverlayComponent={'customLoadingOverlay'}
                                    loadingOverlayComponentParams={{
                                        loadingMessage: 'One moment please...',
                                    }}
                                    noRowsOverlayComponent={'customNoRowsOverlay'}
                                    noRowsOverlayComponentParams={{
                                        noRowsMessageFunc: function () {
                                            return 'No Data Available';
                                        },
                                    }}
                                    rowModelType={'serverSide'}
                                    role
                                    onGridReady={onGridReady}
                                    enableRangeSelection={true}
                                    paginationPageSize={items}
                                    cacheBlockSize={items}
                                />
                            </div>
                        </Grid>
                    </CardViewWrapper>
                </Grid>
            </Grid>
        </div>
        )
    }

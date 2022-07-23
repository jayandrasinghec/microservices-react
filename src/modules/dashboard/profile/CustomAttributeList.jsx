import React from 'react';
import { Grid, makeStyles, Tooltip } from '@material-ui/core';
import MaterialTable from 'material-table';
import { copyText, getFormatedDate, trimmedString } from '../../../utils/helper';


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      overflow: 'auto',
      minHeight: '20px'
    },
    ruleTable: {      
      maxWidth: '940px',
      "@media (min-width:1440px)":{
        maxWidth: '960px',
      },
      "@media (min-width:1920px)":{
        maxWidth: '1920px',
      },
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
        overflowX: 'none',
        border: '1px solid #ddd',
        // borderCollapse: "separate",
        borderSpacing: "0",
      },
      '& th ': {
        padding: "16px !important",
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
    toolTipFont: {
        fontSize: '15px'
    }
  }));

const attributeData =  [
    {
      'name': 'ObjectCategory',
      'value': 'CN=Person,CN=Schema,CN=Configuration,DC=cymmetri,DC=in',
      'createdBy': 'User 1',
      'updatedBy': 'user 2',
      'createdOn': '',
      'updatedOn': ''
    },
    {
      'name': 'GUID',
      'value': '2e7f08d6-706a-40fc-aa22-e945e620e0a4',
      'createdBy': 'John Doe',
      'updatedBy': 'John Doe',
      'createdOn': '',
      'updatedOn': ''
    }
  ]

export default function CustomAttributeList({ attributes }) {
    const classes = useStyles()

    const attributesColumns = [
        { title: 'Name', field: 'name', cellStyle: { fontWeight: '700', border: 'none' } },
        { title: 'Value', field: 'value' },
        { title: 'Created By', field: 'createdBy', render: rowData => <span> {rowData.createdBy || '--'} </span> },
        { title: 'Created On', field: 'createdOn', render: rowData => <span> { getFormatedDate(rowData.created, 'DD/MM/YYYY HH:mm:ss') || '--'} </span> },
        { title: 'Created By Ref Type', field: 'createdByRefType', render: rowData => <span> {rowData.createdByRefType || '--'} </span> },
        { title: 'Updated By', field: 'updatedBy', render: rowData => <span> {rowData.updatedBy || '--'} </span> },
        { title: 'Updated By Ref Type', field: 'updatedByRefType', render: rowData => <span> {rowData.updatedByRefType || '--'} </span> },
        // { title: 'Updated By', field: 'updatedBy', render: row =>  <span>{ moment.utc(row['performedAt']).tz('Asia/Kolkata').format('DD/MM/YYYY HH:mm:ss')}</span> },
        { title: 'Updated On', field: 'updatedOn', render: rowData => <span> {getFormatedDate(rowData.updatedOn, 'DD/MM/YYYY HH:mm:ss') || '--'} </span> },
    ]

    return (
        <div className={classes.root}>
          <Grid container justify='center'>
            <Grid item className={classes.ruleTable}>
                <MaterialTable
                    title=""
                    columns={attributesColumns}
                    // data={attributeData}
                    data={attributes}
                    // isLoading={loading}
                    options={{
                      paging: false,
                      // toolbar: false,
                      rowStyle: {
                        border: '1px solid #ddd',
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
                      doubleHorizontalScroll: true,
                      paginationType: 'stepped',
                      draggable: true,
                      actionsColumnIndex: -1
                    }}
                    localization={{
                      pagination: {
                        labelRowsPerPage: '',
                        labelDisplayedRows: 'Displaying {from}-{to} of {count} records'
                      }
                    }}
                />
            </Grid>
          </Grid>
        </div>
    )
}
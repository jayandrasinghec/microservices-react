/* eslint-disable react/display-name */
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom"
import Box from '@material-ui/core/Box'
import { Link as Linking } from 'react-router-dom'
import ActiveStatusChip from '../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../components/HOC/InactiveStatusChip';
import MaterialTable from 'material-table';
import Grid from '@material-ui/core/Grid';
import { isActiveForRoles } from '../../../../utils/auth'
import { Button, TablePagination } from '@material-ui/core'
import { callApi } from '../../../../utils/api';
import { getFormatedDate } from '../../../../utils/helper';
import PlayForWorkIcon from '@material-ui/icons/PlayForWork';
import CustomPagination from '../../../../components/CustomPagination';



const useStyles = makeStyles(theme => ({
  ruleTable: {
    // paddingBottom: "0px !important",
    // marginBottom: '-16px',
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
      // overflowX: 'none',
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
  rulesSearchAdd: {
    float: 'right',
  },
  tableAddIcon: {
    height: 32,
  },
  editDeleteIcon: {
    '& img': {
      width: "16px",
      height: "16px",
    }
  },
  cardViewWrapper: {
    padding: theme.spacing(3, 2),
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
  },
  displayflex: {
    display: 'flex'
  },
  pointer: {
    cursor: 'pointer'
  },
  tuneicon: {
    color: '#363793',
  }
}));

export default function ImportList(props) {
  const classes = useStyles();
  const defaultQuery = {
    pageNo: 0,
    pageSize: 10
  }

  const [rowData, setRowData] = React.useState([])
  const [query, _setQuery] = React.useState(defaultQuery)
  const [totalData, setTotalData] = React.useState(0)
  const history = useHistory();


  const getAllLots = () => {
    callApi(`/usersrvc/import/users/getAllLots`, 'POST', query)
      .then(res => {
        if(res.success) {
          let row = res.data.content.map((item) => {
            let obj = {}
            obj.id = item.id;
            obj.fileName = item.fileName;
            obj.status = item.status;
            obj.createdBy = item.createdBy;
            obj.created = item.created;

            return obj;
          })
          setRowData(row)
          setTotalData(res.data.totalElements)
        }
      })
      .catch(err => {})
  }

  useEffect(
    () => getAllLots(), [query.pageNo,query.pageSize]
  )

  const handleChangePage = (event, newPage) => _setQuery({ ...query, pageNo: newPage })
  const handleChangeRowsPerPage = (event) => {
    _setQuery({ ...query, pageNo: 0, pageSize: parseInt(event, 10) })
  }

  const columns = [
    { title: 'File Name', field: 'fileName', cellStyle: { fontWeight: '700', border: 'none' } },
    { title: 'Status', field: 'status' },
    { title: 'Created By', field: 'createdBy' },
    { title: 'Created At', field: 'created', render: row =>  <span>{ getFormatedDate(row['created'])}</span>}
  ]

  const handleClick = (id, newRowData) => {
    // history.push({pathname: `/dash/directory/import/${id}`, state: {rowData: newRowData}})
    history.push({pathname: `/dash/directory/import/${id}/created`, state: {rowData: newRowData}})
  }

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Box className={classes.cardViewWrapper}>
            <Grid container spacing={2}>
              <Grid item xs={12} className={classes.ruleTable}>
                <MaterialTable
                  title=""
                  columns={columns}
                  data={rowData}
                  // isLoading={loading}
                  options={{
                    paging: false,
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
                    paginationType: 'stepped',
                    draggable: true,
                    actionsColumnIndex: -1
                  }}
                  onRowClick={(event, rowData) => {
                    handleClick(rowData.id, rowData)}
                  }
                  localization={{
                    pagination: {
                      labelRowsPerPage: '',
                      labelDisplayedRows: 'Displaying {from}-{to} of {count} records'
                    }
                  }}
                  actions={[
                    {
                      icon: () => <Button
                                    onClick={() => history.push('/dash/directory/import/users')}
                                    className={classes.tuneicon}
                                    startIcon={<PlayForWorkIcon/>}
                                  >
                                    Import
                                  </Button>,
                      isFreeAction: true,
                    }
                  ]}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      {/* <TablePagination
        component="div"
        // rowsPerPageOptions={[12, 24, 60, 120]}
        count={totalData}
        page={query.pageNo}
        onChangePage={handleChangePage}
        rowsPerPage={query.pageSize}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
       <CustomPagination
                   count={Math.ceil(totalData / query.pageSize)}    
                   totalCount = {totalData}               
                   page={query.pageNo}
                   onChangePage={handleChangePage}
                   rowsPerPage={query.pageSize}
                   onChangeRowsPerPage={handleChangeRowsPerPage}
              />
    </>
  )
}

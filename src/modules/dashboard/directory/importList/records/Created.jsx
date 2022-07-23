import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom"
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid';
// import { TablePagination } from '@material-ui/core'

import { callApi } from '../../../../../utils/api';
import { getFormatedDate } from '../../../../../utils/helper';
import CustomPagination from '../../../../../components/CustomPagination';
import CustomMaterialTable from '../../../../../components/CustomMaterialTable';


const useStyles = makeStyles(theme => ({
  cardViewWrapper: {
    padding: theme.spacing(3, 2),
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
  },
}));


export const Created = (props) => {
  const classes = useStyles();
  const defaultQuery = {
    id: props.match.params.id,
    status: "CREATED",
    pageNo: 0,
    pageSize: 10
  }

  const [rowData, setRowData] = React.useState([])
  const [query, _setQuery] = React.useState(defaultQuery)
  const [totalData, setTotalData] = React.useState(0)
  const [loading, setLoading] = React.useState(false);
  const history = useHistory();

  const getCreatedImportedRecords = () => {
    setLoading(true)
    callApi(`/usersrvc/import/users/getImportedRecords`, 'POST', query)
      .then(res => {
        setLoading(false)
        if(res.success) {
          let row = res.data.content.map((item) => {
            let obj = {}
            obj.name = item.record.displayName;
            obj.login = item.record.login;
            obj.createdBy = item.createdBy;
            obj.created = item.created;

            return obj;
          })
          setRowData(row)
          setTotalData(res.data.totalElements)
        }
      })
      .catch(err => {setLoading(false)})
  }

  useEffect(
    () => getCreatedImportedRecords(), [query.pageNo,query.pageSize]
  )

  const handleChangePage = (event, newPage) => _setQuery({ ...query, pageNo: newPage })
  const handleChangeRowsPerPage = (event) => {
    _setQuery({ ...query, pageNo: 0, pageSize: parseInt(event, 10) })
  }

  const columns = [
    { title: 'Name', field: 'name', cellStyle: { fontWeight: '700', border: 'none' } },
    { title: 'Login', field: 'login', render: rowData => <span>{rowData.login ? rowData.login : '--'}</span> },
    { title: 'Created By', field: 'createdBy', render: rowData => <span>{rowData.createdBy ? rowData.createdBy : '--'}</span> },
    { title: 'Created At', field: 'created', render: row =>  <span>{ getFormatedDate(row['created'])}</span>}
  ]

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Box className={classes.cardViewWrapper}>
            <Grid container spacing={2}>
              <p style={{paddingLeft: 15, marginBottom: 0}}>
                {props.data.created} records created.
              </p>
              <CustomMaterialTable 
                columns={rowData.length > 0 ? columns : []}
                data={rowData}
                isLoading={loading}
                options={{
                  paging: false,
                  toolbar: false,
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
              />
            </Grid>
            <CustomPagination
              count={Math.ceil(totalData / query.pageSize)} 
              totalCount = {totalData}    
              page={query.pageNo}
              onChangePage={handleChangePage}
              rowsPerPage={query.pageSize}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
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
    </>
  )
}

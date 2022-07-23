import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import LogListCard from './LogListCard'
import LogFilterCard from './LogFilterCard'
import TuneIcon from '@material-ui/icons/Tune';
import { callApi } from '../../../../../utils/api'
import {isActiveForRoles} from '../../../../../utils/auth'
import EmptyScreen from '../../../../../components/EmptyScreen'
import { TablePagination } from '@material-ui/core'
import MaterialTable from 'material-table';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import LogModal from './LogModal'
import '../../../../../FrontendDesigns/new/assets/css/main.css'
import '../../../../../FrontendDesigns/new/assets/css/users.css'
import CustomPagination from '../../../../../components/CustomPagination'
import { getFormatedDate } from '../../../../../utils/helper'

const useStyles = makeStyles((theme) => ({
  container: { 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    width: '100%', 
    overflow: 'hidden' 
  },
  gridcontainer: { 
    margin: 0, 
    marginBottom: 15,
    marginTop: 5,
    width: '100%' 
  },
  griditemone: { 
    paddingTop: 0 
  },
  griditemtwo: { 
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-end', 
    paddingTop: 0 ,
    paddingBottom: '0 !important'
  },
  tuneicon: { 
    color: '#363793', 
  },
  togglebutton: { 
    marginLeft: 15 
  },
  addicon: { 
    fontSize: 14 
  },
  table: {
    // padding: theme.spacing(3,2),
    padding: '10px',
    backgroundColor: "#eef1f8",
    borderRadius: 8,
    margin:'0 16',
  },
  ruleTable: {
    paddingBottom: "0px !important",
    paddingTop: "0px !important",
    marginBottom: '-16px',
    '& .MuiToolbar-gutters':{
      padding: "0px !important",
      '& .MuiTextField-root':{
        border: "1px solid #ccc",
        borderRadius: "4px",
        paddingLeft:"8px",
        '& .MuiInput-underline:before':{
          display:"none",
        },
        '& .MuiInput-underline:after':{
          display:"none",
        }
      },
      
      '& .MuiIconButton-root:hover': {
        background:"transparent",
        '& .MuiTouchRipple-root': {
          display:"none"
        }
      }
    },
  
    '& table': {
      borderCollapse: "separate",
      borderSpacing: "0 15px",
    },
    '& th ': {
      padding: "0px 16px !important",
    },
    '& td ': {
      borderBottom:0,
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
  tableAddIcon:{
    height:32,
  },
  editDeleteIcon: {
    '& img': {
        width: "16px",
        height: "16px",
    }
  }
}))

const defaultQuery = {
	"filter": {
		"action": "",
		"result": "",
		"sourceId": "",
		"sourceType": "",
		"requestorId": "",
		"from": "",
		"to": ""
	},
	"keyword": "",
	"pageNumber": 0,
	"pageSize": 10,
	"sortDirection": "DESC",
	"sortOn": [
		"performedAt"
	]
}

function Logs(props) {
  const [query, _setQuery] = React.useState(defaultQuery)
  const classes = useStyles()
  const [enableFilters, setEnableFilter] = React.useState(false)
  const [logs, setLogs] = React.useState([])
  const [totalLogs, setTotalLogs] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  const [modalData, setModalData] = React.useState({})
  const [saving, setSaving] = React.useState(false)
  const [chunk,setChunk] = React.useState([])

  const downloadlogs = (change={}) => {
    setSaving(true)
    callApi(`/utilsrvc/log/list`, 'POST', {...query,...change})
      .then(e => {
        setSaving(false)
        if (e.success) {
          setLogs(e.data ? e.data.content : [])
          // setTotalLogs(e.data ? e.data.content.length : 0)
          setTotalLogs(e.data.totalElements)
        }
      })
      .catch(err => setSaving(false))
  }

  const downloadlogDetails = (id) => {
    callApi(`/utilsrvc/log/id/${id}`, 'GET')
      .then(e => {
        if (e.success) {
          setModalData(e.data)
          // setTotalLogs(e.data ? e.data.content.length : 0)
          // setTotalLogs(e.data.totalElements)
        }
      })
  }

  React.useEffect(() => downloadlogs(), [query.pageNumber,query.pageSize])

  const setQuery = e => {
    _setQuery({ ...query, ...e })
  }
  
  const handleFilterClick = () => setEnableFilter(!enableFilters)

  const handleChangePage = (event, newPage) => {
    _setQuery({ ...query, pageNumber: newPage })
    // downloadlogs()
  }

  const handleChangeRowsPerPage = (event) => {
    _setQuery({ ...query, pageNumber: 0, pageSize: parseInt(event, 10) })
    // _setQuery({ ...query, pageNumber: 0, pageSize: parseInt(event, 10) })
    
    // _setQuery({ ...query, pageNumber: 0, pageSize: totalLogs })
    // downloadlogs()
  }

  const handleModalOpen = (event, rowData) => {
    setOpen(true);
    // setModalData(rowData)
    downloadlogDetails(rowData.id)
  };

  const handleModalClose = () => {
    setOpen(false);
  };

  const columns = [
    { title: 'Info', field: 'description'},
    { title: 'Actor', field: 'requestorId' },
    // { title: 'Target', field: 'sourceId' },
    { title: 'Time', field: 'performedAt', render: row =>  <span>{ getFormatedDate(row.performedAt, 'DD/MM/YYYY HH:mm:ss') }</span>}
  ];

  const renderLogs = () => {
    return (
      <div style={{height:'min-content'}}>
        <Grid container>
          <Grid item xs={12}>
            <Box className={classes.table}>
              <Grid container spacing={2}>
                <Grid item xs={12} className={classes.ruleTable}>
                  <MaterialTable
                    title="Audit Log"
                    columns={columns}
                    data={logs}
                    options={{
                      rowStyle: {
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
                      paging: false,
                      // sorting:false,
                      // pageSize: totalLogs,
                      // pageSizeOptions: [10,25,50,100],
                      // paginationType: 'stepped',
                      draggable: true,
                      actionsColumnIndex: -1,
                      search:false,
                      toolbar: false
                    }}
                    // localization={{
                    //   pagination: {
                    //     labelRowsPerPage: '',
                    //     labelDisplayedRows: 'Displaying {from}-{to} of {count} records'
                    //   }
                    // }}
                    // onChangePage={handleChangePage}
                    // onChangeRowsPerPage={handleChangeRowsPerPage}
                    onRowClick={(event, rowData) => handleModalOpen(event, rowData)}
                    // components={{ 
                    //   Pagination: props => (
                    //     <TablePagination
                    //     {...props}
                    //       // component="div"
                    //       // rowsPerPageOptions={[12, 24, 60, 120]}
                    //       count={totalLogs}
                    //       page={query.pageNumber}
                    //       onChangePage={handleChangePage}
                    //       rowsPerPage={query.pageSize}
                    //       onChangeRowsPerPage={handleChangeRowsPerPage}
                    //     />
                    //   ) 
                    // }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </div>
    )
  }

  return (
    <div className={classes.container}>
      <Grid container spacing={3} className={classes.gridcontainer}>
        <Grid item md={12} xs={12} className={classes.griditemtwo}>
          <Button onClick={handleFilterClick} startIcon={<TuneIcon className={classes.tuneicon} />} className={classes.tuneicon} >Filters</Button>
        </Grid>

        {enableFilters && (<Grid item xs={12}>
          <LogFilterCard
            downloadlogs={downloadlogs}
            query={query}
            setQuery={setQuery}
            saving={saving}
            defaultQuery={defaultQuery} />
        </Grid>
        )}
      </Grid>

      <div style={{ flex: 1, overflow: 'hidden', }}>
        {logs.length === 0 ? <EmptyScreen /> : renderLogs()}
      </div>

      {/* <TablePagination
        component="div"
        // rowsPerPageOptions={[12, 24, 60, 120]}
        count={totalLogs}
        page={query.pageNumber}
        onChangePage={handleChangePage}
        rowsPerPage={query.pageSize}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
      {/* <CustomPagination 
      data={logs}
      setChunk={setChunk}          
    /> */}
<CustomPagination       
        count={Math.ceil(totalLogs / query.pageSize)}
        totalCount = {totalLogs}
        page={query.pageNumber}
        onChangePage={handleChangePage}
        rowsPerPage={query.pageSize}
        onChangeRowsPerPage={handleChangeRowsPerPage}
    />
      <LogModal open={open} handleModalClose={handleModalClose} modalData={modalData} />
    </div>
  )
}
export default Logs;
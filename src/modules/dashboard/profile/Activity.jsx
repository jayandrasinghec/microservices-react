import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import Button from '@material-ui/core/Button'
import { TablePagination } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import { Link as Linking } from 'react-router-dom'
import { callApi } from '../../../utils/api'
import ActivityCard from '../../../components/ActivityCard'
import EmptyScreen from '../../../components/EmptyScreen'
import SearchField from '../../../components/AppSearchField'
import SearchIcon from '@material-ui/icons/Search';
import DropDown from '../../../components/DropDownComponent'
import MenuItem from '@material-ui/core/MenuItem'
import CustomPagination from '../../../components/CustomPagination'

const drop = [
  {type: 'ASC'}, {type: 'DESC'}
]

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  Nav: {
    display: 'flex',
    paddingBottom: '10px !important',
    // marginTop: '12px',
    // display: 'flex', 
    alignItems: 'center', 
    marginTop: '5px', 
    justifyContent: 'flex-end', 
    paddingRight: '20px',
  },
  link: {
    marginTop: '20px',
    marginLeft: '20px',

    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    color: '#1F4287',
    textDecorationLine: 'none',
    '&:hover': {

      fontWeight: 'bold',
      color: '#363795',
      textDecorationLine: 'none',
    }
  },
  clickedLink: {
    textDecorationLine: 'none',
    fontStyle: 'normal',

    fontWeight: 'bold',
    // color: '#363795',
    // marginTop: '20px',
    marginLeft: '20px',
    // fontSize: '18px',
    marginTop: '10px', 
    fontSize: 16, 
    padding: '10px 0', 
    color: 'black',
  },
  bellicon: {
    marginTop: '0px',
    width: '19px',
    height: '24px'
  },
  small: {
    width: '25px',
    height: '26px',
    // marginTop: '5px',
    marginLeft: '10px'
  },
  search: {
    // marginLeft: '10px',
  },
  bulk: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    color: '#FFFFFF',
  },
  name: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#1F4287',
  },
  designation: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    color: '#8392A7'
  },
  ephone: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '13px',
    lineHeight: '15px',
    color: '#171717',
    marginLeft: '7px',
    marginTop: '5px'
  },
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    overflow: 'hidden', 
    marginLeft: '10px', 
    marginTop: '10px', 
    marginRight: '10px', 
    backgroundColor: '#EEF1F8', 
    flex: 1, 
    borderRadius: '10px', 
  },
  divone: { 
    position: 'absolute', 
    top: 15, 
    right: 15, 
    display: 'flex', 
    flexDirection: 'column' 
  },
  closeicon: { 
    color: '#666', 
    marginBottom: 15 
  },
  divtwo: { 
    margin: 10 
  },
  arrowdropdownicon: { 
    color: 'white' 
  },
  button: { 
    marginRight: '20px', 
    borderRadius: '15px', 
    backgroundColor: '#8392A7' 
  },
  divlist: {
    flex: 1, 
    overflow: 'auto',
  },
}))

const defaultFilters = {
  "filter": {
    "action": "",
    "from": "",
    "requestorId": "",
    "result": "",
    // "sourceId": props.user.id,
    "sourceType": "USER",
    "targetId": "",
    "targetType": "",
    "to": "",
    "type": ""
  },
  "keyword": "",
  "pageNumber": 0,
  "pageSize": 10,
  "sortDirection": "ASC",
  "sortOn": ["performedAt"]
}

export default function UserLayout(props) {
  const classes = useStyles()
  const [filters, _setFilters] = React.useState(defaultFilters)
  const [data, setData] = React.useState([])
  const [totalData, setTotalData] = React.useState(0)
  const [searchField, setSearchField] = React.useState(false);

  const downloadData = () => {
    filters.filter.sourceId = props.user.id
    callApi(`/utilsrvc/log/list`, 'POST', filters)
      .then(e => {
        if (e.success) {
          setData(e.data ? e.data.content : [])
          setTotalData(e.data.totalElements)
        }
      })
  }

  React.useEffect(() => downloadData(), [filters])

  const setSearchQuery = e => _setFilters({ ...filters, keyword: e })
  const setSortQuery = e => _setFilters({ ...filters, sortDirection: e })
  const handleChangePage = (event, newPage) => _setFilters({ ...filters, pageNumber: newPage })
  const handleChangeRowsPerPage = e => _setFilters({ ...filters, pageNumber: 0, pageSize: parseInt(e, 10) })

  return (
    <div className={classes.container}>
      <div className={classes.divone}>
        <Linking to="/dash/directory/user">
          <CloseIcon className={classes.closeicon} />
        </Linking>
      </div>
      <Grid container spacing={3} >
        <Grid item xs={3}>
          <div className={classes.clickedLink}>Activity</div>
        </Grid>

        <Grid item xs={9} className={classes.Nav}>
          {/* <div className={classes.divtwo} style={{ marginRight: 20 }}>
            {!searchField ? (
              <SearchIcon style={{ color: "#353795" }} onClick={() => setSearchField(true)} />
            ) : (
            <SearchField
              onBlur={downloadData}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search" />
            )}
          </div> */}
          <DropDown title={filters.sortDirection || "Sort"} options={drop} body={
            drop.map(o => {
              return (
                <MenuItem key={o.type} value={filters.sortDirection} onClick={() => setSortQuery(o.type)}>
                  <div className={classes.displayflex} >
                    <span className={classes.span}>{o.type}</span>
                  </div>
                </MenuItem>
              )
            })
          } />           
        </Grid>
      </Grid>

      <div className={classes.divlist}>
        {data.length === 0 ? <EmptyScreen /> : data.map(u => <ActivityCard key={u.id} data={u} history={props.history} />)}
      </div>

      {/* <TablePagination
        component="div"
        count={totalData}
        page={filters.pageNumber}
        onChangePage={handleChangePage}
        rowsPerPage={filters.pageSize}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
      <CustomPagination              
              count={Math.ceil(totalData / filters.pageSize)}
              totalCount = {totalData}
              page={filters.pageNumber}
              onChangePage={handleChangePage}
              rowsPerPage={filters.pageSize}
              onChangeRowsPerPage={handleChangeRowsPerPage}
        />
    </div>
  )
}
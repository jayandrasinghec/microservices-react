import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link as Linking } from '../../administartion/submodules/ListIDP/node_modules/react-router-dom'
import Grid from '@material-ui/core/Grid'
import SearchField from '../SearchField'
import ListAltIcon from '../../../../FrontendDesigns/new/assets/img/icons/row.svg'
import DashboardIcon from '../../../../FrontendDesigns/new/assets/img/icons/column.svg'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import FilterListIcon from '@material-ui/icons/FilterList'
import Pagination from '@material-ui/lab/Pagination'
import UserListCard from '../../../../components/UserListCard'
import UserGridCard from '../../../../components/UserGridCard'
import UserFilterCard from '../../../../components/UserFilterCard'
import { callApi } from '../../../../utils/api'

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'


const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  Nav: {
    display: 'flex',
    paddingBottom: '10px !important'
    // marginTop: '12px'
  },
  link: {
    marginTop: '12px',
    marginRight: '25px',
    marginLeft: '10px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    color: '#1F4287',
    textDecorationLine: 'none',
    '&:hover': {
      fontWeight: 'bold',
      color: '#363795'
    }
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
  name: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    color: '#171717',
    // marginTop: '9px',
  },
  bulk: {

    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    color: '#FFFFFF',
  },
  container: { 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    width: '100%', 
    overflow: 'hidden' 
  },
  gridcontainerone: { 
    margin: 0, 
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
    paddingTop: 0 
  },
  button: { 
    marginLeft: 15 
  },
  gridcontainertwo: { 
    margin: 0, 
    width: '100%' 
  },

  addicon: { 
    fontSize: 14 
  },
  divlist: { 
    flex: 1, 
  },
  pagination: { 
    marginLeft: 30 , 
    marginBottom: 15 
  },
}))


const defaultFilters = {
  direction: "ASC",
  filters: {
    // department: "Sales",
    // designation: "Executive",
    // email: "email@test.com",
    // group: "5ebd52974ba32c7bc4f860b7",
    // location: "Mumbai",
    // mobile: 123456789,
    // reportingManager: "5ebd52974ba32c7bc4f860b7",
    // status: [
    //   "REGISTERED"
    // ],
    // userType: "Vendor"
  },
  pageNumber: 0,
  pageSize: 10,
  sort: "FIRST_NAME"
}

export default function UserLayout(props) {
  const classes = useStyles()
  const [filters, _setFilters] = React.useState(defaultFilters)

  const [enableFilters, setEnableFilter] = React.useState(false)
  const [users, setUsers] = React.useState([])
  const [view, setView] = React.useState('list')

  const downloadUsers = () => {
    callApi(`/usersrvc/api/user/list`, 'POST', filters)
      .then(e => { if (e.success) setUsers(e.data ? e.data.elements : []) })
  }
  React.useEffect(() => downloadUsers(), [])

  const setSearchQuery = e => _setFilters({ ...filters, keyword: e })
  const setFilters = e => _setFilters({ ...filters, filters: { ...filters, ...e } })

  const handleFilterClick = () => setEnableFilter(!enableFilters)

  return (
    <div className={classes.container}>
      <Grid container spacing={3} className={classes.gridcontainerone}>
        <Grid item md={6} xs={12} className={classes.griditemone}>
          <SearchField
            onBlur={downloadUsers}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by Name and Email" />
        </Grid>
        <Grid item md={6} xs={12} className={classes.griditemtwo}>
          <Button onClick={handleFilterClick} startIcon={<FilterListIcon />}>Filters</Button>

          <ToggleButtonGroup size="small" className={classes.button} value={view} exclusive onChange={(e, v) => setView(v)}>
            <ToggleButton value="grid">
              <img src={DashboardIcon} />
            </ToggleButton>
            <ToggleButton value="list">
              <img src={ListAltIcon} />
            </ToggleButton>
          </ToggleButtonGroup>

          <Linking to="/dash/user/add">
            <Button variant="contained" color="primary" className={classes.button} startIcon={<AddIcon />} ><span className={classes.bulk}>New User</span></Button>
          </Linking>
        </Grid>

        {enableFilters && (<Grid item xs={12}><UserFilterCard filters={filters.filters} onUpdate={downloadUsers} setFilters={setFilters} /></Grid>)}
      </Grid>

      <div className={classes.divlist}>

        {
          view === 'list' ? users.map(u => <UserListCard key={u.id} user={u} history={props.history} />) : (
            <Grid container spacing={3}  className={classes.gridcontainertwo}>
              {
                users.map(u => {
                  const navigate = () => props.history.push(`/dash/directory/user/${u.id}`)
                  return (
                    <Grid key={u.id} item xs={12} md={4} lg={3} onClick={navigate}>
                      <UserGridCard user={u} />
                    </Grid>
                  )
                })
              }
            </Grid>
          )
        }
      </div>
      <Pagination count={1} color="primary" showFirstButton showLastButton className={classes.pagination} />
    </div>
  )
}
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link as Linking } from '../../administartion/submodules/ListIDP/node_modules/react-router-dom'
import Grid from '@material-ui/core/Grid'
import ListAltIcon from '@material-ui/icons/ListAlt'
import DashboardIcon from '@material-ui/icons/Dashboard'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import UserListCard from '../../../../components/UserListCard'
import UserGridCard from '../../../../components/UserGridCard-old'
import UserFilterCard from './UserFilterCard'
import TuneIcon from '@material-ui/icons/Tune';
import { callApi } from '../../../../utils/api'

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import EmptyScreen from '../../../../components/EmptyScreen'
import { TablePagination } from '@material-ui/core'
import SearchField from '../../../../components/AppSearchField'

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
  }
}))


const defaultQuery = {
  direction: "ASC",
  filters: {
    // department: "Sales",
    // designation: "Executive",
    // email: "email@test.com",
    // group: "5ebd52974ba32c7bc4f860b7",
    // location: "Mumbai",
    // mobile: 123456789,
    // reportingManager: "5ebd52974ba32c7bc4f860b7",
    status: [
      // "REGISTERED"
    ],
    // userType: "Vendor"
  },
  pageNumber: 0,
  pageSize: 12,
  sort: "FIRST_NAME"
}

export default function UserLayout(props) {
  const classes = useStyles()
  const [query, _setQuery] = React.useState(defaultQuery)

  const [enableFilters, setEnableFilter] = React.useState(false)
  const [users, setUsers] = React.useState([])
  const [totalUsers, setTotalUsers] = React.useState(0)
  const [view, setView] = React.useState('grid')

  const downloadUsers = (f = query) => {
    callApi(`/usersrvc/api/user/list`, 'POST', f)
      .then(e => {
        if (e.success) {

          setUsers(e.data ? e.data.elements : [])
          setTotalUsers(e.data ? e.data.totalElements : 0)
        }
      })
  }

  React.useEffect(() => { downloadUsers() }, [query])

  const setQuery = e => {

    _setQuery({ ...query, ...e })
  }
  const setSearchQuery = e => {
    _setQuery({ ...query, keyword: e });
  }

  const handleFilterClick = () => setEnableFilter(!enableFilters)
  const handleChangePage = (event, newPage) => _setQuery({ ...query, pageNumber: newPage })
  const handleChangeRowsPerPage = (event) => {
    _setQuery({ ...query, pageNumber: 0, pageSize: parseInt(event.target.value, 10) })
  }

  const renderUsers = () => {
    if (view === 'list') return users.map(u => {
      return(
        <UserListCard
        onClick={() => props.history.push(`/dash/directory/user/${u.id}`)}
        key={u.id} user={u} history={props.history} />
      )
    })

    return (
      <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
        {
          users.map(u => {
            const navigate = () => props.history.push(`/dash/directory/user/${u.id}`)
            return (
              <Grid key={u.id} item xs={12} md={4} lg={3}>
                <UserGridCard user={u} onClick={navigate} />
              </Grid>
            )
          })
        }
      </Grid>
    )
  }

  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
      <Grid container spacing={3} style={{ margin: 0, marginBottom: 15, marginTop: 5, width: '100%' }}>
        <Grid item md={6} xs={12} style={{ paddingTop: 0 }}>
          <SearchField
            // onBlur={downloadUsers}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by employee ID, Name, Designation" />
          {/* <Autocomplete
            options={users}
            value={filters.keyword}
            onChange={(event, newValue) => {
              if(newValue){
                setSearchQuery(newValue.firstName)
                // downloadUsers()
              }
            }}
            classes={{
              option: classes.option,
            }}
            autoHighlight
            getOptionLabel={(option) => option.firstName + ' ' + option.lastName}
            renderOption={(option) => (
              <React.Fragment>
                {option.firstName} {option.lastName}
              </React.Fragment>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search by employee ID, Name, Designation"
                fullWidth
                variant="outlined"
                size="small"
                style={{ border: 0, backgroundColor: 'white' }}
                inputProps={{
                  ...params.inputProps,
                  style: { border: 0, padding: 15 }
                }}
              />
            )}
          /> */}
        </Grid>
        <Grid item md={6} xs={12} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingTop: 0 }}>
          <Button onClick={handleFilterClick} startIcon={<TuneIcon style={{ color: '#363793' }} />} style={{ color: '#363793' }}>Filters</Button>

          <ToggleButtonGroup size="small" style={{ marginLeft: 15 }} value={view} exclusive onChange={(e, v) => setView(v)}>
            <ToggleButton value="grid">
              <DashboardIcon />
            </ToggleButton>
            <ToggleButton value="list">
              <ListAltIcon />
            </ToggleButton>
          </ToggleButtonGroup>

          <Linking to="/dash/directory/add/user">
            <Button variant="contained" color="primary" style={{ marginLeft: 15 }} startIcon={<AddIcon />} ><span className={classes.bulk}>New User</span></Button>
          </Linking>
        </Grid>

        {enableFilters && (<Grid item xs={12}>
          <UserFilterCard
            query={query}
            setQuery={setQuery}
            defaultQuery={defaultQuery} />
        </Grid>
        )}
      </Grid>

      <div style={{ flex: 1, overflow: 'auto', }}>
        {users.length === 0 ? <EmptyScreen /> : renderUsers()}
      </div>

      <TablePagination
        component="div"
        rowsPerPageOptions={[12, 24, 60, 120]}
        count={totalUsers}
        page={query.pageNumber}
        onChangePage={handleChangePage}
        rowsPerPage={query.pageSize}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      {/* <Pagination count={1} color="primary" showFirstButton showLastButton style={{ marginLeft: 30, marginBottom: 15 }} /> */}
    </div>
  )
}
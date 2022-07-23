import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link as Linking } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import ListAltIcon from '../../../../FrontendDesigns/new/assets/img/icons/row.svg'
import DashboardIcon from '../../../../FrontendDesigns/new/assets/img/icons/column.svg'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import UserListCard from '../../../../components/UserListCard'
import UserGridCard from '../../../../components/UserGridCard'
import UserFilterCard from './UserFilterCard'
import TuneIcon from '@material-ui/icons/Tune';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import { callApi } from '../../../../utils/api'
import {isActiveForRoles} from '../../../../utils/auth'

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import EmptyScreen from '../../../../components/EmptyScreen'
import { TablePagination, Menu, MenuItem } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PlayForWorkIcon from '@material-ui/icons/PlayForWork';
import SearchField from '../../../../components/AppSearchField'

import '../../../../FrontendDesigns/new/assets/css/main.css'
import '../../../../FrontendDesigns/new/assets/css/users.css'
import CustomPagination from '../../../../components/CustomPagination'

const useStyles = makeStyles(() => ({
  row:{
    marginLeft: '0px !important',
    marginRight: '0px !important'
  },
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
    paddingTop: 0
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
  importButton: {
    borderRadius: '20px',
    marginRight: 10
  }
}))


const defaultQuery = {
  direction: "ASC",
  filters: {
    department: "",
    designation: "",
    // email: "email@test.com",
    // group: "5ebd52974ba32c7bc4f860b7",
    location: "",
    locked: false,
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
  const [query, _setQuery] = React.useState(defaultQuery)
  const classes = useStyles()
  const [enableFilters, setEnableFilter] = React.useState(false)
  const [users, setUsers] = React.useState([])
  const [totalUsers, setTotalUsers] = React.useState(0)
  const [view, setView] = React.useState('grid')
  const [anchorEl, setAnchorEl] = React.useState(null);

  const downloadUsers = (f = query) => {  
    callApi(`/usersrvc/api/user/directory/list`, 'POST', f)
      .then(e => {
        if (e.success) {

          setUsers(e.data ? e.data.elements : [])
          setTotalUsers(e.data ? e.data.totalElements : 0)
        }
      })
  }

  React.useEffect(() => downloadUsers(), [query])

  const setQuery = e => {

    _setQuery({ ...query, ...e })
  }
  const setSearchQuery = e => {
    _setQuery({ ...query, keyword: e , pageNumber: 0  });
  }
  const handleFilterClick = () => setEnableFilter(!enableFilters)
  const handleChangePage = (event, newPage) => {
    console.log(event, newPage);
    _setQuery({ ...query, pageNumber: newPage })
  }
  const handleChangeRowsPerPage = (event) => {
    _setQuery({ ...query, pageNumber: 0, pageSize: parseInt(event, 10) })
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleImport = () => {
    // setAnchorEl(null);
    props.history.push(`/dash/directory/import/users`)
  };
  const renderUsers = () => {
    if (view === 'list') return (
      <div className="user-cards-table mt-0" >
        {
          users.map(u => {
            return (
              <UserListCard
                onClick={() => isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY','HELP_DESK']) && props.history.push(`/dash/directory/user/${u.id}`)}
                key={u.id} user={u} history={props.history} onUpdate={downloadUsers}/>
            )
          })
        }
      </div>
    )

    return (
      <div className="user-card-layout mt-0 container-fluid">
        <div className={classes.row+' row'}>
          {
            users.map(u => {
              const navigate = () => props.history.push(`/dash/directory/user/${u.id}`)
              return (
                // <Grid key={u.id} item xs={12} sm={6} md={4} lg={3}>
                <UserGridCard user={u} onClick={isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY','HELP_DESK']) && navigate} onUpdate={downloadUsers} />
                // </Grid>
              )
            })
          }
        </div>
      </div>
    )
  }

  return (
    <div className={classes.container}>
      <Grid container spacing={3} className={classes.gridcontainer}>
        <Grid item md={6} xs={12} className={classes.griditemone}>
          <SearchField
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by Name and Email" />

        </Grid>
        <Grid item md={6} xs={12} className={classes.griditemtwo}>
          {/* <Button 
            aria-controls="simple-menu" 
            color="primary"
            variant="contained"
            // variant="outlined"
            className={classes.importButton}
            aria-haspopup="true" 
            onClick={handleClick}
            endIcon={<ExpandMoreIcon />}
          >
            Bulk Actions
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleImport}>Import Users</MenuItem>
          </Menu> */}

          {/* <Button onClick={handleImport} startIcon={<PlayForWorkIcon className={classes.tuneicon} />} className={classes.tuneicon} >Import</Button> */}

          <Button onClick={handleFilterClick} startIcon={<TuneIcon className={classes.tuneicon} />} className={classes.tuneicon} >Filters</Button>

          <ToggleButtonGroup size="small" className={classes.togglebutton} value={view} exclusive onChange={(e, v) => setView(v)}>
            <ToggleButton value="grid">
              <img src={DashboardIcon} />
            </ToggleButton>
            <ToggleButton value="list">
              <img src={ListAltIcon} />
            </ToggleButton>
          </ToggleButtonGroup>

          {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && (
            <>
              <Linking to="/dash/directory/add/user">
                <div style={{ cursor: 'pointer' }} className="primary-btn-view ml-2">
                  <AddIcon className={classes.addicon} /> ADD NEW
                </div>
              </Linking>
            </>
          )}
        </Grid>

        {enableFilters && (<Grid item xs={12}>
          <UserFilterCard
            query={query}
            setQuery={setQuery}
            defaultQuery={defaultQuery} />
        </Grid>
        )}
      </Grid>

      {/* <div style={{ flex: 1, overflow: 'auto', }}> */}
      {users.length === 0 ? <EmptyScreen /> : renderUsers()}
      {/* </div> */}

      {/* <TablePagination
        component="div"
        rowsPerPageOptions={[10, 12, 25, 50, 100]}
        count={totalUsers}
        page={query.pageNumber}
        onChangePage={handleChangePage}
        rowsPerPage={query.pageSize}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
      <CustomPagination              
              count={Math.ceil(totalUsers / query.pageSize)} 
              totalCount = {totalUsers}             
              rowsPerPageOption={[10, 12, 25, 50, 100]}              
              page={query.pageNumber}
              onChangePage={handleChangePage}
              rowsPerPage={query.pageSize}
              onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      {/* <Pagination count={1} color="primary" showFirstButton showLastButton style={{ marginLeft: 30, marginBottom: 15 }} /> */}
    </div>
  )
}
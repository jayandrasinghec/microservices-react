import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { callApi } from '../../../../../utils/api'
import UserListCard from './UserList'
import GroupListCard from './GroupList'
import AddUser from './AddUser'
import ModalAssignGroup from './AddGroup'
import EmptyScreen from '../../../../../components/EmptyScreen'
import SearchField from '../../../../../components/AppSearchField'
import { TablePagination } from '@material-ui/core'
import AppModal from '../../../../../components/AppModal'
import { isActiveForRoles } from '../../../../../utils/auth'
import CustomPagination from '../../../../../components/CustomPagination'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
  },
  Nav: {
    display: 'flex',
    paddingBottom: '10px !important'
    // marginTop: '12px'
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
    marginTop: 0, 
    marginRight: 5, 
    fontSize: 16, 
    padding: '10px 0', 
    alignItems: 'center', 
    display: 'flex', 
    color: 'black', 
    fontWeight: 'bold',
    color: '#363795',
    marginTop: '20px',
    marginLeft: '20px',
    fontSize: '18px',
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
  paper: {
    position: 'fixed',
    width: 600,
    backgroundColor: 'white',
    borderRadius: '20px',
  },
  button: {
    width: '150px',
    height: '32px',
    padding: 5,
    margin: 15
  },
  container: { 
    display: 'flex', 
    flexDirection: 'row',
    overflow: 'hidden', 
    width: '100%', 
    marginLeft: '10px', 
    marginTop: '10px',
    marginRight: '10px', 
    flex: 1 
  },
  containerone: { 
    display: 'flex', 
    flexDirection: 'row', 
    overflow: 'hidden', 
    alignItems: 'center' 
  },
  gridone: { 
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    overflow: 'auto', 
    marginRight: 20, 
    marginLeft: 10, 
    backgroundColor: '#EEF1F8', 
    borderRadius: '10px', 
  },
  searchfielddiv: { 
    margin: 10 
  },
  assign: { 
    flex: 1 
  },
  userlist: { 
    flex: 1, 
    overflow: 'auto' 
  },
  gridtwo: { 
    flex: 1, 
    display: 'flex',
    overflow: 'auto', 
    marginRight: 30, 
    backgroundColor: '#EEF1F8', 
    borderRadius: '10px', 
    flexDirection: 'column', 
  },
  assignbutton: { 
    display: 'flex', 
    alignItems: 'center' 
  },
  grouplist: { 
    flex: 1, 
    overflow: 'auto', 
    paddingLeft: 15, 
    paddingRight: 15, 
    verticalAlign: 'center'
  },
}))



export default function UserLayout(props) {
  const classes = useStyles()

  const defaultFilters = {
    "filter": {
      "applicationId": props.app.id,
      // "firstName": "string",
      // "lastName": "string"
    },
    "pageNumber": 0,
    "pageSize": 10,
    "sortDirection": "ASC",
    "sortOn": [
      "id"
    ]
  }

  const [filters, _setFilters] = React.useState(defaultFilters)
  const [users, setUsers] = React.useState([])
  const [groups, setGroups] = React.useState([])
  const [app] = React.useState(props.app)
  const [totalUsers, setTotalUsers] = React.useState(0)
  const [open, setOpen] = React.useState(false);
  const [group, setOpenGroup] = React.useState(false);

  const handleUserModalOpen = () => {
    setOpen(true);
  };
  const handleUserModalClose = () => {
    setOpen(false);
  };
  const handleGroupModalOpen = () => {
    setOpenGroup(true);
  };
  const handleGroupModalClose = () => {
    setOpenGroup(false);
  };

  const downloadUsersData = () => {
    callApi(`/usersrvc/api/user/listByApplication`, 'POST', filters)
      .then(e => {
        if (e.success) {
          setUsers(e.data ? e.data.content : [])
          setTotalUsers(e.data.totalElements)
        }
      })
  }

  React.useEffect(downloadUsersData, [filters])

  const downloadGroupsData = () => {
    callApi(`/usersrvc/api/group/listByApplication/${props.app.id}`, 'GET')
      .then(response => setGroups(response.data))
      .catch(error => {})
  }

  React.useEffect(downloadGroupsData, [])

  const handleChangePage = (event, newPage) => _setFilters({ ...filters, pageNumber: newPage })
  const handleChangeRowsPerPage = e => _setFilters({ ...filters, pageNumber: 0, pageSize: parseInt(e, 10) })
  const setSearchQuery = e => { _setFilters({ ...filters, keywoard: e }); }

  return (
    <div className={classes.container}>
      <Grid item xs={6} className={classes.gridone}>
        <div className={classes.containerone}>
          <div className={classes.clickedLink}>Users</div>
          <div className={classes.searchfielddiv}>
            {/* <SearchField
              onBlur={downloadGroupsData}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by user name" /> */}
          </div>
          <div className={classes.assign} />
          {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN']) && (
            <div onClick={handleUserModalOpen} className="primary-btn-view" style={{ cursor: 'pointer' }}>Assign New</div>
          )}
        </div>

        <div className={classes.userlist}>
          {users.length === 0 ? <EmptyScreen /> : users.map(u => <UserListCard key={u.id} user={u} onUpdate={downloadUsersData} app={app} />)}
          {/* {groups.length === 0 ? <EmptyScreen /> : groups.map(u => <GroupListCard key={u.id} group={u} onUpdate={downloadGroupsData} history={props.history} app={app} />)} */}
        </div>
        {/* <TablePagination
          component="div"
          count={totalUsers}
          page={filters.pageNumber}
          onChangePage={handleChangePage}
          rowsPerPage={filters.pageSize}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        /> */}
         <CustomPagination             
              count={Math.ceil(totalUsers / filters.pageSize)}
              totalCount = {totalUsers}
              page={filters.pageNumber}
              onChangePage={handleChangePage}
              rowsPerPage={filters.pageSize}
              onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <AppModal
          open={open}
          onClose={handleUserModalClose} title="Assign User">
          <AddUser app={app} assignedUsers={users} onUpdate={downloadUsersData} />
        </AppModal>
      </Grid>
      <Grid item xs={6} className={classes.gridtwo} >
        <div className={classes.containerone}>
          <div className={classes.clickedLink}>Groups</div>
          <div className={classes.searchfielddiv}>
            {/* <SearchField
              onBlur={downloadGroupsData}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by group name" /> */}
          </div>
          <div className={classes.assign} />
          {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN']) && (
            <div className={classes.assignbutton}>
              <div onClick={handleGroupModalOpen} className="primary-btn-view" style={{ cursor: 'pointer' }}>Assign New</div>
            </div>
          )}
        </div>
        <div className={classes.grouplist}>
          {groups.length === 0 ? <EmptyScreen /> : groups.map(u => <GroupListCard key={u.id} group={u} app={app} />)}
        </div>
        <AppModal
          open={group}
          onClose={handleGroupModalClose} title="Assign a Group">
          <ModalAssignGroup app={app} assignedGroups={groups} onUpdate={downloadGroupsData} />
        </AppModal>
      </Grid>
    </div>
  )
}
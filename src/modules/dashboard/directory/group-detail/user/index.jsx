import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
// import AddIcon from '@material-ui/icons/Add'
// import Button from '@material-ui/core/Button'
import { callApi } from '../../../../../utils/api'
import UserListCard from './UserList'
import ModalAssign from './ModalAssign'
import Modal from '@material-ui/core/Modal'
import EmptyScreen from '../../../../../components/EmptyScreen'
import { TablePagination } from '@material-ui/core'
import SearchField from '../../../../../components/AppSearchField'
import { isActiveForRoles } from '../../../../../utils/auth'
import SearchIcon from '@material-ui/icons/Search';
import DropDown from '../../../../../components/DropDownComponent'
import MenuItem from '@material-ui/core/MenuItem'
import CustomPagination from '../../../../../components/CustomPagination'

function getModalStyle() {
  const top = 20;
  const left = 35;

  return {
    top: `${top}%`,
    left: `${left}%`,
  };
}
const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  Nav: {
    display: 'flex',
    paddingBottom: '10px !important',
    // marginTop: '12px',
    alignItems: 'center',
    marginTop: '5px',
    justifyContent: 'flex-end',
    paddingRight: '20px'
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
    //
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
  paper: {
    position: 'fixed',
    width: 600,
    backgroundColor: 'white',
    borderRadius: '20px',
  },
  userList: {
    flex: 1,
    marginTop: 15
  },
  displayflex: { 
    display: 'flex' 
  },
  span: { 
    fontStyle: 'normal', 
    fontWeight: 'normal', 
    fontSize: '12px', 
    lineHeight: '20px', 
    color: '#8998AC;', 
    marginLeft: '0px' 
  },
}))

const drop = [
  {type: 'ASC'}, {type: 'DESC'}
]

export default function UserLayout(props) {
  const classes = useStyles()

  const defaultFilters = {
    "direction": "ASC",
    "filters": {
      "group": props.group.id,
      // status: [
      //   // "INACTIVE"
      // ],
    },
    "keyword": "",
    "pageNumber": 0,
    "pageSize": 10,
    "sort": "FIRST_NAME"
  }

  const [filters, _setFilters] = React.useState(defaultFilters)

  const [users, setGroup] = React.useState([])
  const [data] = React.useState(props.group)
  const [totalUsers, setTotalUsers] = React.useState(0)
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [searchField, setSearchField] = React.useState(false);

  const handleModalOpen = () => {
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
  };


  const downloadGroupsData = () => {
    callApi(`/usersrvc/api/user/directory/list`, 'POST', filters)
      .then(e => {
        if (e.success) {
          setGroup(e.data ? e.data.elements : [])
          setTotalUsers(e.data.totalElements)
        }
      })
  }

  React.useEffect(downloadGroupsData, [filters])

  const handleChangePage = (event, newPage) => _setFilters({ ...filters, pageNumber: newPage })
  const handleChangeRowsPerPage = e => _setFilters({ ...filters, pageNumber: 0, pageSize: parseInt(e, 10) })
  const setSearchQuery = e => { _setFilters({ ...filters, keyword: e, pageNumber: 0 }); }
  const setSortQuery = e => _setFilters({ ...filters, direction: e })

  const downloadData = () => {
    downloadGroupsData();
    props.onUpdate();
    // handleModalOpen()
  }

  return (
    <div className={classes.root}>

      <Grid container spacing={3}>
        <Grid item xs={3}>
          <div className={classes.clickedLink} >Users</div>
        </Grid>
        <Grid item xs={9} className={classes.Nav} >
          <div className={classes.divone} style={{ marginRight: 20 }}>
            {!searchField ? (
              <SearchIcon style={{ color: "#353795" }} onClick={() => setSearchField(true)} />
            ) : (
            <SearchField
              onBlur={downloadGroupsData}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by user name" />
            )}
          </div>
          <DropDown title="Sort" options={drop} body={
            drop.map(o => {
              return (
                <MenuItem key={o.type} onClick={() => setSortQuery(o.type)}>
                  <div className={classes.displayflex}>
                    <span className={classes.span}>{o.type}</span>
                  </div>
                </MenuItem>
              )
            })
          } />  
          {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']) && (
            <div onClick={handleModalOpen} className="primary-btn-view ml-3">
              <img src="/assets/img/icons/plus.svg" alt="" title="" /> Add User
            </div>
          )}
        </Grid>
      </Grid>

      <div className={classes.userList} >
        {users.length === 0 ? <EmptyScreen /> : users.map(u => <UserListCard key={u.id} user={u} onUpdate={downloadData} history={props.history} group={data} />)}
      </div>

      <Modal open={open} onClose={handleModalClose}>
        <div style={modalStyle} className={classes.paper}>
          <ModalAssign group={data} assignedUsers={users} onUpdate={downloadGroupsData} />
        </div>
      </Modal>

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

    </div>
  )
}
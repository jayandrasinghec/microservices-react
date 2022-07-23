import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button' 

import { callApi } from '../../../../../utils/api'
import { isActiveForRoles } from '../../../../../utils/auth'
import EmptyScreen from '../../../../../components/EmptyScreen'
import UserListCard from './UserList'
import CustomPagination from '../../../../../components/CustomPagination'
import AppModal from '../../../../../components/AppModal'
import AddUser from './AddUser'
import { Box, Paper } from '@material-ui/core'
import AppTextInput from '../../../../../components/form/AppTextInput'
import { showSuccess } from '../../../../../utils/notifications'


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
    // display: 'flex', 
    // flexDirection: 'row',
    overflow: 'hidden', 
    width: '100%', 
    marginLeft: '10px', 
    marginTop: '10px',
    marginRight: '10px', 
    // flex: 1 
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
  consent: {
    flex: 1, 
    overflow: 'auto', 
    padding: 15,
    // paddingLeft: 15, 
    // paddingRight: 15, 
    verticalAlign: 'center'
  },
  box: {
    width: '100%',
    background: '#E9EDF6',
    padding: '25px 15px',
    borderRadius: 10,
  },
  consentBtn: {
    float: 'right'
  },
}))

const defaultFilters = {
  "filter": {
    // "status": true,
    "userId": ""
  },
  "keyword": "",
  "pageNumber": 0,
  "pageSize": 10,
  "sortDirection": "ASC",
  "sortOn": [
    "id"
  ]
}

const defaultConsentFilter = {
  "keyword": "",
  "pageNumber": 0,
  "pageSize": 10,
  "sortDirection": "ASC",
  "sortOn": [
    "id"
  ]
}

export default function DelegationAccess(props) {
  const classes = useStyles()
  const [filters, _setFilters] = React.useState(defaultFilters)
  const [users, setUsers] = React.useState([])
  const [saving, setSaving] = React.useState(false)
  const [groups, setGroups] = React.useState([])
  const [userCon, setUserCon] = React.useState({});
  const [assigneeCon, setAssigneeCon] = React.useState({});
  const [errors, _setErrors] = React.useState({})
  const [change, setChange] = React.useState({
    user: false,
    assignee: false
  })
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const setError = e => _setErrors({ ...errors, ...e });
  const isValid = !Object.values(errors).some(e => e != null);

  const handleUserModalOpen = () => {
    setOpen(true);
  };
  const handleUserModalClose = () => {
    setOpen(false);
  };

  const downloadUsersData = () => {
    callApi(`/authsrvc/delegateUser/list`, 'POST', filters)
      .then(e => {
        if (e.success) {
          setUsers(e.data ? e.data.content : [])
          setTotalUsers(e.data ? e.data.totalElements : 0)
        }
      })
  }

  React.useEffect(downloadUsersData, [filters])

  const downloadConsent = () => {
    callApi(`/authsrvc/delegateConsent/list`, 'POST', defaultConsentFilter)
      .then(res => {
        if(res && res.data) {
          let data = res.data.content;
          data && data.length > 0 && data.map(obj => {
            if(obj.type === 'USER_CONSENT') setUserCon(obj);
            if(obj.type === 'ASSIGNEE_CONSENT') setAssigneeCon(obj);
          })
        }
      })
      .catch(error => {})
  }

  React.useEffect(downloadConsent, [])

  const updateConsent = (type) => {
    const body = {
      "active": true,
      "consent": type === 'ASSIGNEE_CONSENT' ? assigneeCon.consent : userCon.consent,
      "type": type
    }
    callApi(`/authsrvc/delegateConsent/${type === 'ASSIGNEE_CONSENT' ? assigneeCon.id : userCon.id}`, 'PUT', body)
      .then(res => {
        if(res && res.data) {
          console.log('res',res)
          if(type === 'ASSIGNEE_CONSENT') {
            setAssigneeCon(res.data)
            setChange({...change, assignee: false})
          } else{
            setUserCon(res.data)
            setChange({...change, user: false})
          }
          showSuccess('Updated Successfully');
        }
      })
      .catch(error => {})
  }


  const handleChangePage = (event, newPage) => _setFilters({ ...filters, pageNumber: newPage })
  const handleChangeRowsPerPage = e => _setFilters({ ...filters, pageNumber: 0, pageSize: parseInt(e, 10) })
  const setSearchQuery = e => { _setFilters({ ...filters, keywoard: e }); }

  return (
    <div className={classes.container}>
      <Grid container>
      <Grid item xs={12} sm={6} className={classes.gridone}>
        <div className={classes.containerone}>
          <div className={classes.clickedLink}>Users</div>
          <div className={classes.searchfielddiv}>
            {/* <SearchField
              onBlur={downloadGroupsData}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by user name" /> */}
          </div>
          <div className={classes.assign} />
          {isActiveForRoles(['ORG_ADMIN']) && (
            <div onClick={handleUserModalOpen} className="primary-btn-view" style={{ cursor: 'pointer' }}>Assign New</div>
          )}
        </div>

        <div className={classes.userlist}>
            {users.length === 0 ? <EmptyScreen /> : users.map((u, k) => <UserListCard key={u.id} user={u} index={k} onUpdate={downloadUsersData} users={users} setUsers={setUsers}/>)}
        </div>
         <CustomPagination             
              count={Math.ceil(totalUsers / filters.pageSize)}
              totalCount = {totalUsers}
              page={filters.pageNumber}
              onChangePage={handleChangePage}
              rowsPerPage={filters.pageSize}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              rowsPerPageOption={[10, 25, 50, 100]}
        />
        <AppModal
          open={open}
          onClose={handleUserModalClose} title="Assign User">
          <AddUser assignedUsers={users} onUpdate={downloadUsersData} />
        </AppModal>
      </Grid>

      <Grid item xs={12} sm={6} className={classes.gridtwo} >
        <div className={classes.containerone}>
          <div className={classes.clickedLink}>Consent</div>
        </div>
        <div className={classes.consent}>
          <Grid container className="mb-3">
            <Box className={classes.box}>
              <div><b>User Consent</b></div>
              <AppTextInput 
                multiline
                rows={3}
                value={userCon.consent}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                onChange={e => {
                  setChange({...change, user: true})
                  setUserCon({ ...userCon, consent: e.target.value })
                }}
              />
              <Grid className="mt-2">
                <Button 
                  disabled={!isActiveForRoles(['ORG_ADMIN']) || !isValid || !change.user || saving}
                  variant="contained"
                  color="primary"
                  className={classes.consentBtn}
                  size='small'
                  onClick={() => updateConsent('USER_CONSENT')}
                  >
                    {!saving ? 'Save' : 'Saving'}
                </Button>
              </Grid>
            </Box>
          </Grid>
          <Grid container>
            <Box className={classes.box}>
              <div><b>Assignee Consent</b></div>
              <AppTextInput 
                multiline
                rows={3}
                value={assigneeCon.consent}
                disabled={!isActiveForRoles(['ORG_ADMIN'])}
                onChange={e => {
                  setChange({...change, assignee: true})
                  setAssigneeCon({ ...assigneeCon, consent: e.target.value })
                }}
              />
              <Grid className="mt-2">
                <Button 
                  disabled={!isActiveForRoles(['ORG_ADMIN']) || !isValid|| !change.assignee || saving}
                  variant="contained"
                  color="primary"
                  onClick={() => updateConsent('ASSIGNEE_CONSENT')}
                  className={classes.consentBtn}
                  size='small'
                  >
                    {!saving ? 'Save' : 'Saving'}
                </Button>
              </Grid>
            </Box>
          </Grid>
        </div>
      </Grid>
      </Grid>
    </div>
  )
}
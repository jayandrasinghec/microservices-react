import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link as Linking } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import SearchField from '../../../../../components/AppSearchField'
import LetterAvatar from '../../../../../components/LetterAvatar';

import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications';
import EmptyScreen from '../../../../../components/EmptyScreen'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  fields: {
    display: 'flex',
    marginTop: '10px',
    marginBottom: '10px'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  textField: {
    backgroundColor: '#F7F7F7',
  },
  input: {
    height: 40
  },
  selectRoot: {
    height: 33,
  },
  select: {
    height: 33,
    paddingTop: 0,
    paddingBottom: 0,
    verticalAlign: "middle"
  },
  avatar: {
    height: '50px',
    width: '50px',
    marginLeft: '10px',
    marginTop: '3px',
    marginBottom: '5px'
  },
  name: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '16px',
    textAlign: 'left',
    color: '#1F4287',
    paddingTop: '5px'
  },
  designation: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    textAlign: 'center',
    color: '#8392A7'
  },
  checkbox: {
    width: '24px',
    height: '24px',
    marginTop: '8px'
  },
  flexdiv: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  gridone: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  img: {
    width: '30px',
    height: '30px',
    margin: 10,
    padding: '8px'
  },
  divone: {
    margin: '20px 5px'
  },
  gridtwo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  divtwo: {
    color: '#363793',
    fontSize: 14,
    fontWeight: 'bold',
    paddingRight: 10
  },
  iconbutton: {
    height: 45,
    width: 45,
    marginRight: 10
  },
  griditemone: {
    backgroundColor: '#EEF1F8',
    borderRadius: '8px',
    maxHeight: 500
  },
  divthree: {
    marginLeft: 22,
    marginRight: 22,
    fontSize: 16,
    padding: '10px 0',
    color: 'black',
    fontWeight: 'bold'
  },
  griditemtwo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '20px'
  },
  divfour: {
    padding: 10,
    overflowY: 'auto',
    maxHeight: 400,
    overflowX: 'hidden',
    marginTop: 10,
    marginBottom: 10
  },
}))
const defaultFilters = {
  direction: "ASC",
  filters: {
    status: [
      "ACTIVE"
    ],
  },
  pageNumber: 0,
  pageSize: 10,
  sort: "FIRST_NAME"
}
function Assign(props) {
  const classes = useStyles();
  const { user, group } = props
  const [assigned, setAssigned] = React.useState(props.isAssigned)
  const [saving, setSaving] = React.useState(false)

  const data = {
    groupIds: [
      `${group.id}`
    ],
    userIds: [
      `${user.id}`
    ],
  }

  const handleClick = () => {
    setSaving(true)
    callApi(`/usersrvc/api/group/assign`, 'PUT', data)
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('User has been added into the group')
          if (props.onUpdate) props.onUpdate()
          setAssigned(true);
        }
      })
      .catch(() => setSaving(false))
  }

  return (
    <Grid container className="mb-1">
      <Paper className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={10}>
            <div className={classes.flexdiv}>
              <LetterAvatar className={classes.avatar} text={`${user.firstName} ${user.lastName}`} status={user.status} profileImage={user.profilePic} variant="dot" />
              <div className={classes.divone}>
                <h4 className={classes.name}>{user.firstName} {user.lastName}</h4>
                <span className={classes.designation}>{user.designation || "No Designation"}</span>
              </div>
            </div>
          </Grid>
          <Grid xs={1} className={classes.gridone}>
            <div className={classes.padtopdiv}>
              {
                assigned || props.isAssigned ? (<div className={classes.divtwo}>Assigned</div>) : ( 
                !saving ? 
                  <IconButton disabled={saving} className={classes.iconbutton} onClick={handleClick} > <AddIcon /> </IconButton> : 
                  <a href="javascript:void(0)" style={{ color: 'black' }}>Adding..</a> )
              }
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
}


export default function AddOne(props) {
  const classes = useStyles();
  const { group } = props
  const [filters, _setFilters] = React.useState(defaultFilters)
  const [users, setUsers] = React.useState([])
  const [endload, setEndLoad] = React.useState(false)
  const [laxypage, setLazyPage] = React.useState(0)

  const downloadUsers = () => {
    callApi(`/usersrvc/api/user/directory/list`, 'POST', filters)
      .then(e => {
        if (e.success) {
          setEndLoad(false)
          setLazyPage(0)
          setUsers(e.data ? e.data.elements : [])
        }
      })
  }
  React.useEffect(() => downloadUsers(), [filters])
  const laxyLoad = () => {
    if (endload) return
    const f = { ...filters, pageNumber: laxypage + 1 }
    callApi(`/usersrvc/api/user/directory/list?pageNo=${laxypage + 1}`, 'POST', f)
      .then(e => {
        if (e.success) {
          setLazyPage(laxypage + 1)
          if (e.data) {
            if (!e.data.elements || e.data.elements.length === 0) setEndLoad(true)
            else setUsers([...users, ...e.data.elements])
          }
        }
      })
  }

  const onScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop - 2 < e.target.clientHeight;
    if (bottom) {
    laxyLoad()
    }
  }
  const setSearchQuery = e => _setFilters({ ...filters, keyword: e })

  return (
    <div className={classes.root} onScroll={onScroll}>
      <Grid container>
        <Grid item xs={12} className={classes.griditemone}>
          <div className={classes.fields}>
            <div className={classes.divthree}>
              Assign users to this group
            </div>
            <Grid item xs={6} className={classes.griditemtwo}>
              <SearchField
                onBlur={downloadUsers}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by Name and Email" />
            </Grid>
            <Linking to={`/dash/directory/groups/${group.id}/users`}>
              <IconButton aria-label="close" className={classes.closeButton}>
                <CloseIcon />
              </IconButton>
            </Linking>
          </div>

          <div className={classes.divfour}>
            {users.length === 0 ? (<EmptyScreen/>) : (users.map(u => <Assign
              isAssigned={props.assignedUsers.map(a => a.id).indexOf(u.id) >= 0}
              key={u.id} user={u} group={group} onUpdate={props.onUpdate} />))}
          </div>

        </Grid>
      </Grid>
    </div>
  )
}
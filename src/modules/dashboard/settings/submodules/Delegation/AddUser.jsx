import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import LetterAvatar from '../../../../../components/LetterAvatar';
import AppSearchField from '../../../../../components/AppSearchField';
import { callApi } from '../../../../../utils/api'
import EmptyScreen from '../../../../../components/EmptyScreen'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  fields: {
    display: 'flex',
    marginTop: '10px',
    marginBottom: '10px',
    overflow: 'hidden'
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
    textAlign: 'center',
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
}))

const defaultFilters = {
  direction: "ASC",
  pageNumber: 0,
  pageSize: 10,
  sort: "FIRST_NAME",
  filters: {
    status: [
      "ACTIVE"
    ],
  },
}

function Assign(props) {
  const classes = useStyles();

  const { app, user } = props

  const [_assigned, setAssigned] = React.useState(props.assignedUsers.indexOf(user.userId) >= 0)
  const [_saved, setSaved] = React.useState(props.assignedUsers.indexOf(user.userId) >= 0)
  const [saving, setSaving] = React.useState(false)

  const assigned = _assigned || props.isAssigned
  const saved = _saved || props.isAssigned

  const onsave = () => {
    const body = {
      active: true,
      userId: user.id
    }
    setSaving(true)
    callApi(`/authsrvc/delegateUser`, 'POST', body)
      .then(e => {
        setSaving(false)
        if (e.success) {
          console.log('e', e);
          setAssigned(true); 
          props.onAssign(user); 
          if (props.onUpdate) props.onUpdate();
        }
      })
      .catch(() => {
        setAssigned(false)
        setSaved(false)
        setSaving(false)
      })
  }

  return (
    <div className="add-user-group-row align-items-center d-flex flex-column flex-sm-column flex-md-column flex-lg-row mt-1">
      <div className="user-group-lhs col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
        <div className="d-flex flex-row align-items-center">
          <LetterAvatar className={classes.avatar} text={`${user.firstName} ${user.lastName}`} profileImage={user.profilePic} status={user.status} variant="dot" />
          <div style={{ display: 'block', lineHeight: '0.8px', marginTop: '-10px', marginLeft: '10px' }}>
            <h4 className={classes.name}>{user.firstName} {user.lastName}</h4>
            <span className={classes.designation}>{user.login || 'no designation'}</span>
          </div>
        </div>
      </div>
      <div className="user-group-rhs col-12 col-sm-12 col-md-12 col-lg-6 pr-0">
        <div className="d-flex flex-row align-items-center justify-content-end">
          { !assigned ? <a onClick={onsave} className="mr-2 assign-app-btn" style={{ cursor: 'pointer' }}>
            Assign
          </a> :
          <a href="javascript:void(0)" className="add-group-btn">User Assigned</a> }
        </div>
      </div>
    </div>
  )
}

export default function AddUser(props) {
  const classes = useStyles();
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
    <div style={{ overflow: 'hidden' }}>
      <div className={classes.fields}>
        <AppSearchField
          onBlur={downloadUsers}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by Name and Email" />
      </div>
      <div style={{ overflowY: 'auto', maxHeight: 400 }} onScroll={onScroll}>
        {users.length === 0 ? (<EmptyScreen/>) : (
          users.map(u => <Assign
            isAssigned={props.assignedUsers.map(a => a.userId).indexOf(u.id) >= 0}
            assignedUsers={props.assignedUsers}
            onAssign={(uu) => { if (props.onAssign) props.onAssign(uu) }}
            key={u.id} user={u} app={props.app} onUpdate={props.onUpdate} />))}
      </div>
    </div>
  )
}
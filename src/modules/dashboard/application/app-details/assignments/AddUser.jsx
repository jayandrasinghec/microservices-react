import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import AddIcon from '@material-ui/icons/Add';
import LetterAvatar from '../../../../../components/LetterAvatar';
import AppSearchField from '../../../../../components/AppSearchField';

import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications';
import AppSelectInput from '../../../../../components/form/AppSelectInput';
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
// function Assign2(props) {
//   const classes = useStyles();
//   const { user, app } = props
//   const [_assigned, setAssigned] = React.useState(props.assignedUsers.indexOf(user.id) >= 0)
//   const [_saved, setSaved] = React.useState(props.assignedUsers.indexOf(user.id) >= 0)
//   const [role, setRole] = React.useState()
//   const [roles, setRoles] = React.useState([])

//   const assigned = _assigned || props.isAssigned
//   const saved = _saved || props.isAssigned

//   const data = {
//     applicationId: app.id,
//     roleIds: [role],
//     userId: user.id
//   }

//   const handleClick = () => {
//     callApi(`/provsrvc/applicationRole/findByApplicationId/${app.id}`).then(e => { setRoles(e.data) })
//     setAssigned(true)
//   }

//   const onsave = () => {
//     callApi(`/usersrvc/api/user/assignapplication`, 'PUT', data)
//       .then(e => {
//         if (e.success) {
//           showSuccess('Application has been added for this user')
//           setAssigned(true); setSaved(true);
//           props.onAssign(user);
//           if (props.onUpdate)props.onUpdate(app)
//         }
//       })
//   }
//   return (
//     <div className={classes.fields}>
//       <Grid item xs={12}>
//         <Paper variant="outlined" elevation={3} className={classes.root}>
//           <Grid container>
//             <Grid item xs={7}>
//               <div style={{ display: 'flex' }}>
//                 <LetterAvatar className={classes.avatar} text={`${user.firstName} ${user.lastName}`} status={user.status} variant="dot" />
//                 <div style={{ display: 'block', lineHeight: '0.8px', marginTop: '6px', marginLeft: '10px' }}>
//                   <h4 className={classes.name}>{user.firstName} {user.lastName}</h4>
//                   <span className={classes.designation}>{user.designation || 'no designation'}</span>
//                 </div>
//               </div>
//             </Grid>
//             {!saved && assigned && (
//               <Grid xs={3} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
//                 <AppSelectInput
//                   options={roles.map(r => r.id)}
//                   onChange={e => setRole(e.target.value)}
//                   fullWidth
//                   labels={roles.map(r => r.roleName)}
//                   style={{ width: '100%' }}
//                 />
//               </Grid>
//             )
//             }
//             <Grid xs={!saved && assigned ? 2 : 5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
//                 {
//                   !assigned ?
//                     (<IconButton style={{ height: 45, width: 45, marginRight: 10 }}><AddIcon onClick={handleClick} /></IconButton>) :
//                     !saved ?
//                       (<Link onClick={onsave} style={{ color: '#363793', fontSize: 14, marginRight: 10, cursor: 'pointer' }}>Save</Link>) :
//                       (<div style={{ color: '#363793', fontSize: 14, fontWeight: 'bold', marginRight: 10, }}>Added to Application</div>)
//                 }
//             </Grid>
//           </Grid>
//         </Paper>
//       </Grid>
//     </div>
//   )
// }

function Assign(props) {
  const classes = useStyles();

  const { app, user } = props

  // const setFromBackend = props.assignedApps.indexOf(app.id) >= 0
  const [_assigned, setAssigned] = React.useState(props.assignedUsers.indexOf(user.id) >= 0)
  const [_saved, setSaved] = React.useState(props.assignedUsers.indexOf(user.id) >= 0)
  const [role, setRole] = React.useState()
  const [roles, setRoles] = React.useState([])
  const [saving, setSaving] = React.useState(false)

  const assigned = _assigned || props.isAssigned
  const saved = _saved || props.isAssigned

  const data = {
    applicationId: app.id,
    roleIds: role ? [role] : [],
    userId: user.id
  }


  const handleClick = () => {
    callApi(`/provsrvc/applicationRole/findByApplicationId/${app.id}?active=true`).then(e => {
      setRoles(e.data)
      setRole(e.data.length > 0 ? e.data[0].id : "")
      if (e.data.length === 0) onsave()
    })
    setAssigned(true)
  }

  const onsave = () => {
    setSaving(true)
    callApi(`/usersrvc/api/user/assignapplication`, 'PUT', data)
      .then(e => {
        setSaving(false)
        if (e.success) {
          e.data.isWorkflowAssigned ? showSuccess('Workflow has been Initiated.') : showSuccess('User has been assigned to Application')
          // showSuccess('User has been assigned to Application')
          setAssigned(true); setSaved(true); props.onAssign(user); if (props.onUpdate)props.onUpdate(app);
        }
      })
      .catch(() => {
        setAssigned(false)
        setSaved(false)
        setSaving(false)
      })
  }

  const phase1 = (
    <div className="add-user-group-row align-items-center d-flex flex-column flex-sm-column flex-md-column flex-lg-row mt-1">
      <div className="user-group-lhs col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
        <div className="d-flex flex-row align-items-center">
          <LetterAvatar className={classes.avatar} text={`${user.firstName} ${user.lastName}`} profileImage={user.profilePic} status={user.status} variant="dot" />
          <div style={{ display: 'block', lineHeight: '0.8px', marginTop: '-10px', marginLeft: '10px' }}>
            <h4 className={classes.name}>{user.firstName} {user.lastName}</h4>
            <span className={classes.designation}>{user.designation || 'no designation'}</span>
          </div>
        </div>
      </div>
      <div className="user-group-rhs col-12 col-sm-12 col-md-12 col-lg-6 pr-0 text-right">
        {!assigned ? 
          <a onClick={handleClick} className="mr-2 assign-app-btn" style={{ cursor: 'pointer' }}>
            Assign
          </a>
        :
        <span className="mr-2" style={{ cursor: 'pointer' }}>
          Assigning...
        </span>
        }
      </div>
    </div>
  )

  const phase2 = (
    <div className="add-user-group-row align-items-center d-flex flex-column flex-sm-column flex-md-column flex-lg-row mt-1">
      <div className="user-group-lhs col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
        <div className="d-flex flex-row align-items-center">
          <LetterAvatar className={classes.avatar} text={`${user.firstName} ${user.lastName}`} status={user.status} profileImage={user.profilePic} variant="dot" />
          <div style={{ display: 'block', lineHeight: '0.8px', marginTop: '-10px', marginLeft: '10px' }}>
            <h4 className={classes.name}>{user.firstName} {user.lastName}</h4>
            <span className={classes.designation}>{user.designation || 'no designation'}</span>
          </div>
        </div>
      </div>
      <div className="user-group-rhs col-12 col-sm-12 col-md-12 col-lg-6 pr-0">
        <div className="d-flex flex-row align-items-center justify-content-end">
          <AppSelectInput
            onChange={e => setRole(e.target.value)}
            fullWidth
            labels={roles.map(r => r.roleName)}
            style={{ width: '100%' }}
            options={roles.map(r => r.id)}
          />
          {!saving ? 
            <a onClick={onsave} className="mr-2 ml-2 assign-app-btn" style={{ cursor: 'pointer' }}>
              Save
            </a>
            :
            <span className="mr-2" style={{ cursor: 'pointer' }}>
              Saving...
            </span>
          }
          {/* <a onClick={onsave} className="mr-2 ml-2 assign-app-btn" style={{ cursor: 'pointer' }}>
            {!saving ? "Save" : "Saving..."}
          </a> */}
        </div>
      </div>
    </div>
  )


  const phase3 = (
    <div className="add-user-group-row align-items-center d-flex flex-column flex-sm-column flex-md-column flex-lg-row mt-1">
      <div className="user-group-lhs col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
        <div className="d-flex flex-row align-items-center">
          <LetterAvatar className={classes.avatar} text={`${user.firstName} ${user.lastName}`} profileImage={user.profilePic} status={user.status} variant="dot" />
          <div style={{ display: 'block', lineHeight: '0.8px', marginTop: '-10px', marginLeft: '10px' }}>
            <h4 className={classes.name}>{user.firstName} {user.lastName}</h4>
            <span className={classes.designation}>{user.designation || 'no designation'}</span>
          </div>
        </div>
      </div>
      <div className="user-group-rhs col-12 col-sm-12 col-md-12 col-lg-6 pr-0">
        <div className="d-flex flex-row align-items-center justify-content-end">
          <a href="javascript:void(0)" className="add-group-btn">User Assigned</a>
        </div>
      </div>
    </div>
  )

  return !assigned && !saved ? phase1 : (saved && assigned) ? phase3 : (!saved && roles.length>0) ? phase2 : phase1
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
            isAssigned={props.assignedUsers.map(a => a.id).indexOf(u.id) >= 0}
            assignedUsers={props.assignedUsers}
            onAssign={(uu) => { if (props.onAssign) props.onAssign(uu) }}
            key={u.id} user={u} app={props.app} onUpdate={props.onUpdate} />))}
      </div>
    </div>
  )
}
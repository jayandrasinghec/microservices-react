import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import TextField from '@material-ui/core/TextField'

import { callApi, callImageApi } from '../utils/api'
import AppSearchField from './AppSearchField';
import { showSuccess } from '../utils/notifications';
import AppSelectInput from './form/AppSelectInput';
import EmptyScreen from './EmptyScreen'


const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    overflow: 'auto',
    maxHeight: 500
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
  appIcon: {
    width: 50,
    height: 50
  },
  assigndiv: {
    overflow: 'auto',
    maxHeight: 400
  },
}))


function Assign(props) {
  const classes = useStyles();

  const { app, userId } = props

  // const setFromBackend = props.assignedApps.indexOf(app.id) >= 0
  const [_assigned, setAssigned] = React.useState(props.assignedApps.indexOf(app.id) >= 0)
  const [_saved, setSaved] = React.useState(props.assignedApps.indexOf(app.id) >= 0)
  const [role, setRole] = React.useState()
  const [roles, setRoles] = React.useState([])
  const [icon, setIcon] = React.useState([])
  const [saving, setSaving] = React.useState(false)

  const assigned = _assigned || props.isAssigned
  const saved = _saved || props.isAssigned

  const data = {
    applicationId: app.id,
    roleIds: role ? [role] : [],
    userId: userId
  }

  const downloadIcon = () => { callImageApi(app.id).then(setIcon) }

  React.useEffect(() => downloadIcon(), [])

  const handleClick = () => {
    callApi(`/provsrvc/applicationRole/findByApplicationId/${app.id}?active=true`).then(e => {
      setRoles(e.data)
      // setRole(e.data.length > 0 ? e.data[0].id : "")
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
          e.data.isWorkflowAssigned ? showSuccess('Workflow has been Initiated.') : showSuccess('Application has been added for this user')
          setAssigned(true); setSaved(true); props.onAssign(app);
          props.onUpdate()
          // props.updateUser()
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
          <img src={icon} alt=" " className={classes.appIcon} />
          <span className="pl-3">{app.displayName || app.appName}</span>
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
          <img src={icon} alt=" " className={classes.appIcon} />
          <span className="pl-3">{app.displayName || app.appName}</span>
        </div>
      </div>
      <div className="user-group-rhs col-12 col-sm-12 col-md-12 col-lg-6 pr-0">
        <div className="d-flex flex-row align-items-center justify-content-end">
          <AppSelectInput
            onChange={e => setRole(e.target.value)}
            options={roles.map(r => r.id)}
            fullWidth
            style={{ width: '100%' }}
            labels={roles.map(r => r.roleName)} />
          {!saving ? 
            <a onClick={onsave} className="mr-2 ml-2 assign-app-btn" style={{ cursor: 'pointer' }}>
              Save
            </a>
            :
            <span className="mr-2" style={{ cursor: 'pointer' }}>
              Saving...
            </span>
          }
        </div>
      </div>
    </div>
  )


  const phase3 = (
    <div className="add-user-group-row align-items-center d-flex flex-column flex-sm-column flex-md-column flex-lg-row mt-1">
      <div className="user-group-lhs col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
        <div className="d-flex flex-row align-items-center">
          <img src={icon} alt=" " className={classes.appIcon} />
          <span className="pl-3">{app.displayName || app.appName}</span>
        </div>
      </div>
      <div className="user-group-rhs col-12 col-sm-12 col-md-12 col-lg-6 pr-0">
        <div className="d-flex flex-row align-items-center justify-content-end">
          <a href="javascript:void(0)" className="add-group-btn">Application Assigned</a>
        </div>
      </div>
    </div>
  )

  return !assigned && !saved ? phase1 : (saved && assigned) ? phase3 : (!saved && roles.length > 0) ? phase2 : phase1
}


const defaultFilters = {
  displayName: "",
  order: "desc",
  pageNo: 0,
  size: 10,
  sortBy: "displayName",
  tag: ""
}


export default function AssignUserModal(props) {
  const classes = useStyles();

  const [endload, setEndLoad] = React.useState(false)
  const [laxypage, setLazyPage] = React.useState(0)
  const [filters, _setFilters] = React.useState(defaultFilters)
  const [applications, setApplications] = React.useState([])
  const [assigned, setAssigned] = React.useState([])

  const appListFilters = {
    pageNumber: 0,
    pageSize: 200,
    userId: props.userId
  }

  React.useEffect(() => {
    callApi(`/usersrvc/api/user/listApplications`, 'POST', appListFilters)
      .then(response => setAssigned((response.data && response.data.elements ? response.data.elements : []).map(d => d.appId)))
  }, [])

  const downloadAplistplications = () => {
    callApi(`/provsrvc/applicationTenant/applicationListByPage`, 'POST', filters)
      .then(e => {
        if (e.success) {
          setEndLoad(false)
          setLazyPage(0)
          setApplications(e.data ? e.data.content : [])
        }
      })
  }

  const laxyLoad = () => {
    if (endload) return
    const f = { ...filters, pageNo: laxypage + 1 }
    callApi(`/provsrvc/applicationTenant/applicationListByPage?pageNo=${laxypage + 1}`, 'POST', f)
      .then(e => {
        if (e.success) {
          setLazyPage(laxypage + 1)
          if (e.data) {
            if (e.data.length === 0) setEndLoad(true)
            else setApplications([...applications, ...e.data.content])
          }
        }
      })
  }

  React.useEffect(() => downloadAplistplications(), [filters])

  const onScroll = (e) => {//e removed from (e)
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) laxyLoad()
  }
  const setSearchQuery = e => _setFilters({
    ...filters,
    displayName: e
  })

  return (
    <div>
      <div className={classes.fields}>
        <AppSearchField
          onBlur={downloadAplistplications}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search Application" />
      </div>
      <div className={classes.assigndiv} onScroll={onScroll}>
        {applications.length === 0 ? (<EmptyScreen />) : (
          applications.map(app => <Assign
            isAssigned={assigned.indexOf(app.id) >= 0}
            assignedApps={assigned}
            onAssign={(gg) => { if (props.onAssign) props.onAssign(gg) }}
            key={app.id} app={app} userId={props.userId} onUpdate={props.onUpdate} updateUser={props.updateUser} />)
        )}
      </div>
    </div>
  )
}

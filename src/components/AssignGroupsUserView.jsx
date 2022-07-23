import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
// import Paper from '@material-ui/core/Paper';
import PersonIcon from '@material-ui/icons/Person';
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
import AddIcon from '@material-ui/icons/Add';

import { callApi } from '../utils/api'
import { showSuccess } from '../utils/notifications'
import AppSearchField from './AppSearchField';
import ellipsis from 'text-ellipsis'
import EmptyScreen from './EmptyScreen'


const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    overflow: 'auto',
    height: 500
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
  iconbutton: { 
    height: 45, 
    width: 45, 
    marginRight: 10 
  },
  icon: { 
    color: '#8392A7', 
    fontSize: 19, 
    margin: '-1px 6px 0 0' 
  },
  listdiv: {
    overflow: 'auto', 
    maxHeight: 400 
  },

}))

const defaultFilters = {
  direction: "ASC",
  pageNumber: 0,
  pageSize: 10,
  keyword: "",
  sort: "GROUP_NAME"
}


function GroupRow(props) {
  const classes = useStyles();
  const { group, user } = props
  const [assigned, setAssigned] = React.useState(props.isAssigned)
  const [saving, setSaving] = React.useState(false)

  const data = {
    groupIds: [group.id],
    userIds: [user]
  }
  const handleClick = () => {
    setSaving(true)
    callApi(`/usersrvc/api/group/assign`, 'PUT', data)
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('Group has been assigned')
          setAssigned(true); props.onAssign(group)
        }
      })
      .catch(() => setSaving(false))
  }

  const unAssigned = (
    <a href="javascript:void(0)" className="mr-2">
      {!saving ? 
        <IconButton disabled={saving} className={classes.iconbutton} onClick={handleClick} > <AddIcon /> </IconButton> : 
        <a href="javascript:void(0)" style={{ color: 'black' }}>Adding..</a>
      }
      
    </a>
  )

  const assignedHTML = (
    <div className="d-flex flex-row align-items-center justify-content-end">
      <a href="javascript:void(0)" className="add-group-btn">Added to group</a>
    </div>
  )

  return (
    <div className="add-user-group-row align-items-center d-flex flex-column flex-sm-column flex-md-column flex-lg-row mb-3">
      <div className="user-group-lhs col-12 col-sm-12 col-md-5 col-lg-5 pl-0">
        <h5 className="">{group.name}</h5>
        <span className="sub-desc">{group.description ? ellipsis(group.description, 100) : "No Description"}</span>
      </div>
      <div className="user-group-lhs col-12 col-sm-12 col-md-3 col-lg-3 pl-0">
        <div className="pt-0 mt-0 d-flex flex-row align-items-center">
          <span className="d-flex flex-row align-items-center">
            {/* <img src="/assets/img/icons/user-gray.svg" alt="" className="mr-2" /> */}
            <PersonIcon className={classes.icon}  />
            {group.numberOfUsers}
          </span>
          <span className="d-flex flex-row align-items-center pl-5">
            <ViewQuiltIcon className={classes.icon}  />
            {/* <img src="/assets/img/icons/user-assign.svg" alt="" className="mr-2" /> */}
            {group.numberOfApps}
          </span>
        </div>
      </div>
      <div className="user-group-rhs col-12 col-sm-12 col-md-4 col-lg-4 pr-0 text-right">
        {assigned || props.isAssigned ? assignedHTML : unAssigned}
      </div>
    </div>
  )
}




export default function AssignGroupsUserView(props) {
  const classes = useStyles();

  const [endload, setEndLoad] = React.useState(false)
  const [laxypage, setLazyPage] = React.useState(0)
  const [filters, _setFilters] = React.useState(defaultFilters)
  const [groups, setGroups] = React.useState([])
  const [assignedGroups, setassignedGroups] = React.useState([])


  React.useEffect(() => {
    callApi(`/usersrvc/api/group/listAssignedGroups/${props.userId}`)
      .then(response => setassignedGroups(response.data.map(d => d.id)))
      .catch(error => {})
  }, [])

  const downloadGroups = () => {
    callApi(`/usersrvc/api/group/list`, 'POST', filters)
      .then(e => {
        if (e.success) {
          setEndLoad(false)
          setLazyPage(0)
          setGroups(e.data ? e.data.elements : [])
        }
      })
  }
  React.useEffect(downloadGroups, [filters])

  const laxyLoad = () => {
    if (endload) return
    const f = { ...filters, pageNumber: laxypage + 1 }
    callApi(`/usersrvc/api/group/list?pageNo=${laxypage + 1}`, 'POST', f)
      .then(e => {
        if (e.success) {
          setLazyPage(laxypage + 1)
          if (e.data) {
            if (!e.data.elements || e.data.elements.length === 0) setEndLoad(true)
            else setGroups([...groups, ...e.data.elements])
          }
        }
      })
  }

  const onScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop - 2 < e.target.clientHeight;
    if (bottom) 
    laxyLoad()
  }

  const setSearchQuery = e => _setFilters({ ...filters, keyword: e })

  return (
    <div>
      <div className={classes.fields}>
        <AppSearchField
          onBlur={downloadGroups}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search Groups" />
      </div>
      <div className={classes.listdiv} onScroll={onScroll}>
        {groups.length === 0 ? (<EmptyScreen/>) : (
          groups.map(g => <GroupRow
          isAssigned={assignedGroups.indexOf(g.id) >= 0}
          onAssign={(gg) => { if (props.onAssign) props.onAssign(gg) }}
          key={g.id} group={g} user={props.userId} />))}
      </div>
    </div>
  )
}
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import AddIcon from '@material-ui/icons/Add'
import { IconButton } from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person';
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';

import { callApi } from '../../../../../utils/api'
import SearchField from '../../../../../components/AppSearchField'
import { showSuccess } from '../../../../../utils/notifications'
import AppSearchField from '../../../../../components/AppSearchField';
import ellipsis from 'text-ellipsis'
import EmptyScreen from '../../../../../components/EmptyScreen'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 15,
    height: 500,
    overflow: 'auto',
    paddingBottom: 15,
    backgroundColor: '#EEF1F8', borderRadius: '8px'
  },
  fields: {
    display: 'flex',
    marginTop: '10px',
    marginBottom: '10px'
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
  personicon: { 
    color: '#8392A7', 
    fontSize: 19, 
    margin: '-1px 6px 0 0' 
  },
  viewquilicon: { 
    color: '#8392A7', 
    fontSize: 19, 
    margin: '-1px 6px 0 0' 
  },
  container: { 
    // height: 500 
  },
  overflow: { 
    overflow: 'auto', 
    maxHeight: 400 
  }
}))

const defaultFilters = {
  direction: "ASC",
  pageNumber: 0,
  pageSize: 10,
  keyword: "",
  sort: "GROUP_NAME"
}

function Assign(props) {
  const classes = useStyles()
  const { app, group } = props
  const [assigned, setAssigned] = React.useState(false)
  const [saving, setSaving] = React.useState(false)

  const data = {
    applicationIds: [app.id],
    groupId: group.id
  }

  const handleClick = () => {
    setSaving(true)
    callApi(`/provsrvc/applicationTenant/assignApplicationToGroup`, 'POST', data)
      .then(e => { setSaving(false)
        if (e.success) {
        showSuccess('Group has been added into the application')
        if (props.onUpdate) props.onUpdate()
        setAssigned(true)
      }})
      .catch(() => setSaving(false))
  }

  const assignedHTML = (
    <div className="d-flex flex-row align-items-center justify-content-end">
      <a href="javascript:void(0)" className="add-group-btn">Added to group</a>
    </div>
  )


  const unAssigned = (
    <a href="javascript:void(0)" className="mr-2">
      {!saving ? 
        <IconButton disabled={saving} className={classes.iconbutton} onClick={handleClick} > <AddIcon /> </IconButton> : 
        <a href="javascript:void(0)" style={{ color: 'black' }}>Adding..</a>
      }    
    </a>
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

  // return (
  //   <div className={classes.fields}>
  //     <Grid item xs={12} style={{ marginLeft: '20px', marginRight: '20px' }}>
  //       <Paper variant="outlined" elevation={3}>
  //         <Grid container>
  //           <Grid xs={10} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '20px' }}>
  //             <div style={{ margin: '5px 5px', lineHeight: '0.4' }}>
  //               <h3 style={{ color: '#363793' }}> {group.name} </h3>
  //               <span style={{ fontSize: '13px', color: '#8392A7', lineHeight: 1.5 }}>{group.description}</span>
  //               <div style={{ display: 'flex', marginTop: '10px' }}>
  //                 <div style={{ display: 'flex' }}><PersonIcon style={{ color: '#8392A7' }} /><div style={{ marginTop: '10px' }}> {group.numberOfUsers}</div></div>
  //                 <div style={{ display: 'flex', marginLeft: '50px' }}><ViewQuiltIcon style={{ color: '#8392A7' }} /><div style={{ marginTop: '10px' }}> {group.numberOfOu}</div></div>
  //               </div>
  //             </div>
  //           </Grid>
  //           <Grid xs={1} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '0px' }}>
  //             <div style={{ paddingTop: '5px' }}>
  //               {
  //                 assigned || props.isAssigned ? (<div style={{  color: '#363793', fontSize: 14, fontWeight: 'bold' }}>Assigned</div>) : (<IconButton style={{ height: 45, width: 45, marginRight: 10 }} onClick={handleClick} ><AddIcon /></IconButton>)
  //               }
  //             </div>
  //           </Grid>
  //         </Grid>
  //       </Paper>
  //     </Grid>
  //   </div>
  // )
}

export default function AssignUserView(props) {
  const classes = useStyles()

  const [endload, setEndLoad] = React.useState(false)
  const [laxypage, setLazyPage] = React.useState(0)
  const [filters, _setFilters] = React.useState(defaultFilters)
  const [groups, setGroups] = React.useState([])

  const downloadGroups = () => {
    callApi(`/usersrvc/api/group/list`, 'POST', filters)
      .then(e => { if (e.success)
        {
          setEndLoad(false)
          setLazyPage(0)
          setGroups(e.data ? e.data.elements : []) }
        })
  }
  React.useEffect(downloadGroups, [filters])

  const laxyLoad = () => {
    if (endload) return
    const f = { ...filters, pageNumber: laxypage + 1}
    callApi(`/usersrvc/api/group/list?pageNo=${laxypage + 1}`, 'POST', f)
      .then(e => { if (e.success) {
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

    if (bottom) {
      laxyLoad()
    }
  }

  const setSearchQuery = e => _setFilters({ ...filters, keyword: e })

  return (
    <div className={classes.container}>
      <div className={classes.fields}>
        <AppSearchField
          onBlur={downloadGroups}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search Groups" />
      </div>
      <div className={classes.overflow} onScroll={onScroll}>
        {groups.length === 0 ? (<EmptyScreen/>) : (
          groups.map(g => <Assign
            isAssigned={props.assignedGroups.map(a => a.id).indexOf(g.id) >= 0}
            onAssign={(gg) => { if (props.onAssign) props.onAssign(gg) }}
            key={g.id} group={g} app={props.app} onUpdate={props.onUpdate} />))}
      </div>
    </div>
  )
}

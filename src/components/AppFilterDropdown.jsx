
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Paper from '@material-ui/core/Paper';
import PersonIcon from '@material-ui/icons/Person';
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
import AddIcon from '@material-ui/icons/Add';

import { callApi } from '../utils/api'
import SearchField from '../modules/dashboard/directory/SearchField';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    overflow: 'auto',
    height: 500
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
  griditemone: {
    marginLeft: '20px',
    marginRight: '20px'
  },
  gridone: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: '20px'
  },
  divone: {
      margin: '5px 5px',
      lineHeight: '0.4'
  },
  headthree: {
      color: '#363793'
  },
  span: {
      fontSize: '13px',
      color: '#8392A7',
      lineHeight: 1.5
  },
  divtwo: {
      display: 'flex',
      marginTop: '10px'
  },
  personicondiv: {
      display: 'flex'
  },
  viewicondiv: {
      display: 'flex',
      marginLeft: '50px'
  },
  icon: {
      color: '#8392A7'
  },
  margintop: {
      marginTop: '10px'
  },
  gridtwo: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingRight: '0px'
  },
  paddingtop: {
      paddingTop: '5px' ,
  },
  divthree: {
      color: '#363793',
      fontSize: 14,
      fontWeight: 'bold' ,
  },
  griditemtwo: {
      backgroundColor: '#EEF1F8',
      borderRadius: '8px',
  },
  griditemthree: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: '20px'
  },
  button: {
      backgroundColor: '#8392A7',
      color: 'white',
      borderRadius: '20px',
      paddingLeft: '10px'
  },
}))

const defaultFilters = {
  direction: "ASC",
  pageNumber: 0,
  pageSize: 10,
  keyword: "",
  sort: "GROUP_NAME"
}


function Assign(props) {
  const classes = useStyles();
  const { group, user } = props
  const [assigned, setAssigned] = React.useState(false)

  const data = {
    groupIds: [group.id],
    userIds: [user]
  }
  const handleClick = () => {
    callApi(`/usersrvc/api/group/assign`, 'PUT', data)
      .then(e => { if (e.success) { setAssigned(true); props.onAssign(group) } })
  }
  return (
    <div className={classes.fields}>
      <Grid item xs={12} className={classes.griditemone}>
        <Paper variant="outlined" elevation={3}>
          <Grid container>
            <Grid xs={10} className={classes.gridone}>
              <div className={classes.divone}>
                <h3 className={classes.headthree}> {group.name} </h3>
                <span  className={classes.span}>{group.description}</span>
                <div className={classes.divtwo}>
                  <div className={classes.personicondiv}><PersonIcon  className={classes.icon} /><div className={classes.margintop}> {group.numberOfUsers}</div></div>
                  <div className={classes.viewicondiv}><ViewQuiltIcon  className={classes.icon} /><div className={classes.margintop}> {group.numberOfOu}</div></div>
                </div>
              </div>
            </Grid>
            <Grid xs={1} className={classes.gridtwo}>
              <div className={classes.paddingtop}>
                {
                  assigned || props.isAssigned ? (<div className={classes.divthree}>Assigned</div>) : (<AddIcon onClick={handleClick} />)
                }
              </div>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </div>
  )
}


export default function AddTwo(props) {
  const classes = useStyles();

  const [endload, setEndLoad] = React.useState(false)
  const [laxypage, setLazyPage] = React.useState(0)
  const [filters, _setFilters] = React.useState(defaultFilters)
  const [groups, setGroups] = React.useState([])
  const [assignedGroups, setassignedGroups] = React.useState([])


  React.useEffect(() => {
    callApi(`/usersrvc/api/group/listAssignedGroups/${props.userId}`)
      .then(response => setassignedGroups(response.data.map(d => d.id)))
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
  React.useEffect(() => downloadGroups(), [filters])

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
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) laxyLoad()
  }

  const setSearchQuery = e => _setFilters({ ...filters, keyword: e })

  return (
    <div className={classes.root} onScroll={onScroll}>
      <Grid container>
        <Grid item xs={12} className={classes.griditemtwo}>
          <div className={classes.fields}>
            <Grid item xs={6} className={classes.griditemthree}>
              <SearchField
                onBlur={downloadGroups}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Group" />
              <Button className={classes.button} endIcon={<ArrowDropDownIcon />} >Most users</Button>
            </Grid>
          </div>
          {groups.map(g => < Assign
            isAssigned={assignedGroups.indexOf(g.id) >= 0}
            onAssign={(group) => { if (props.onAssign) props.onAssign(group) }}
            key={g.id} group={g} user={props.userId} />)}
        </Grid>
      </Grid>
    </div>
  )
}
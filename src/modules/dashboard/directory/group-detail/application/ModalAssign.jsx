import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link as Linking } from 'react-router-dom'
import CloseIcon from '@material-ui/icons/Close'
import Grid from '@material-ui/core/Grid'
import { IconButton } from '@material-ui/core'

import ModalAppRow from './ModalAppRow'
import { callApi } from '../../../../../utils/api'
import SearchField from '../../../../../components/AppSearchField'
import EmptyScreen from '../../../../../components/EmptyScreen'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    paddingTop: 15,
    maxHeight: 500,
    overflow: 'hidden',
    paddingBottom: 15,
    backgroundColor: '#EEF1F8', borderRadius: '8px',
  },
  fields: {
    display: 'flex',
    // marginTop: '20px',
    marginBottom: 5,
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
  divone: {
    padding: '10px 23px',
    fontWeight: 'bold'
  },
  griditemone: {
    marginLeft: '20px'
  },
  divtwo: {
    overflow: 'auto',
    maxHeight: 400,
    marginTop: 10,
    marginBottom: 10
  },
}))


const defaultFilters = {
  displayName: "",
  order: "desc",
  pageNo: 0,
  size: 10,
  sortBy: "displayName",
	tag: ""
}


export default function AssignUserView(props) {
  const classes = useStyles()
  const { groupid } = props
  const [endload, setEndLoad] = React.useState(false)
  const [laxypage, setLazyPage] = React.useState(0)
  const [filters, _setFilters] = React.useState(defaultFilters)
  const [applications, setApplications] = React.useState([])

  const downloadAplistplications = () => {
    callApi(`/provsrvc/applicationTenant/applicationListByPage`, 'POST', filters)
      .then(e => { if (e.success) {
        setEndLoad(false)
        setLazyPage(0)
        setApplications(e.data ? e.data.content : [])

      }})
  }

  const laxyLoad = () => {
    if (endload) return
    const f = { ...filters, pageNo: laxypage + 1}
    callApi(`/provsrvc/applicationTenant/applicationListByPage?pageNo=${laxypage + 1}`, 'POST', f)
      .then(e => { if (e.success) {
        setLazyPage(laxypage + 1)
        if (e.data) {
          if (e.data.length === 0)setEndLoad(true)
          else setApplications([...applications, ...e.data.content])
        }
      }
    })
  }

  React.useEffect(() => downloadAplistplications(), [filters])

  const onScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop - 2 < e.target.clientHeight;

    if (bottom) {
      laxyLoad()
    }
  }

  const setSearchQuery = e => _setFilters({ ...filters, displayName: e })

  return (
    <div className={classes.root} id="appdiv" onScroll={onScroll}>
      <div className={classes.fields}>
        <div className={classes.divone}>Assign an Application</div>
        <Grid item xs={6} className={classes.griditemone}>
          <SearchField
            onBlur={downloadAplistplications}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Application" />
        </Grid>
        <Linking to={`/dash/directory/groups/${props.groupid}/applications`}>
          <IconButton aria-label="close" className={classes.closeButton}>
            <CloseIcon />
          </IconButton>
        </Linking>
      </div>

      <div className={classes.divtwo}>
      {applications.length === 0 ? (<EmptyScreen/>) : (applications.map(u => <ModalAppRow
        isAssigned={props.assignedApplications.map(a => a.id).indexOf(u.id) >= 0}
        key={u.id} app={u} groupId={groupid} onUpdate={props.onUpdate} />))}
      </div>
    </div>
  )
}

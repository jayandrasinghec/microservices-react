import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { callApi } from '../../../../utils/api'
import ApplicationCard from './Application'
import { CircularProgress } from '@material-ui/core'
import AssignButton from './AssignButton'
import CloseIcon from '@material-ui/icons/Close';
import { Link as Linking } from 'react-router-dom'

import EmptyScreen from '../../../../components/EmptyScreen'
import { TablePagination } from '@material-ui/core'
import {isActiveForRoles} from '../../../../utils/auth'
import '../../../../FrontendDesigns/master-screen-settings/assets/css/profile.css'
import CustomPagination from '../../../../components/CustomPagination'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    padding: 15,
    display: 'flex',
    flex: 1, 
    flexDirection: 'column', 
    overflow: 'hidden',  
  },
  layout: {
    flexGrow: 1,
    backgroundColor: 'white'
  },
  Nav: {
    display: 'flex',
    marginTop: '5px',
    marginBottom: '5px',
  },
  heading: {
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '18px',
    color: '#171717',
    margin: 0,
    lineHeight: '21px',
  },
  paper: {
    position: 'fixed',
    width: 600,
    backgroundColor: 'white',
    borderRadius: '20px',
  },

  header: {
    marginBottom: '20px',
    marginLeft: '20px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  circularprogress: { 
    display: 'flex', 
    width: '100%', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  divone: { 
    position: 'absolute', 
    top: 15, 
    right: 15, 
    display: 'flex', 
    flexDirection: 'column' 
  },
  closeicon: { 
    color: '#666', 
    marginBottom: 15 
  },
  divtwo: { 
    flex: 1, 
    overflow: 'auto', 
  },
}))


export default function UserLayout(props) {
  const classes = useStyles()

  const defaultFilters = {
    pageNumber: 0,
    pageSize: 12,
    userId: props.match.params.id
  }

  const [filters, _setFilters] = React.useState(defaultFilters)
  const [applications, setApplications] = React.useState([])
  const [totalApps, setTotalApps] = React.useState(0)

  const downloadAppData = () => {
    callApi(`/usersrvc/api/user/listApplications`, 'POST', filters)
      .then(e => { if (e.success) {
        setApplications(e.data && e.data.elements ? e.data.elements : []);
        setTotalApps(e.data.totalElements)
      }})
  }

  React.useEffect(() => downloadAppData(), [filters])

  const handleChangePage = (event, newPage) => _setFilters({ ...filters, pageNumber : newPage })
  const handleChangeRowsPerPage = (event) => {
    _setFilters({ ...filters, pageNumber : 0, pageSize : parseInt(event, 10) })
  }

  if (!applications) return (
    <div className={classes.circularprogress}>
      <CircularProgress color="secondary" />
    </div>
  )

  const applicationItems = applications.map(app => (
    <div className="col-sm-12 col-md-6 col-lg-4">
      <ApplicationCard application={app} onUpdate={downloadAppData} user={props.user} updateUser={props.updateUser}/>
    </div>
  ))

  return (
    <div className={classes.root}>
      <div className={classes.divone}>
        <Linking to="/dash/directory/user">
          <CloseIcon className={classes.closeicon}/>
        </Linking>
      </div>

      <div className={classes.header}>
        <div className={classes.heading}>Assigned Applications</div>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && (<AssignButton
          userId={props.user.id}
          assignedApps={applications}
          onUpdate={downloadAppData}
          updateUser={props.updateUser} />)}
      </div>

      <div className={classes.divtwo}>
        <Grid container>
          {applications.length === 0 ? <EmptyScreen /> : applicationItems}
        </Grid>
      </div>
      {/* <div className="profile-applications-grid mt-3 container-fluid cym-custom-scroll">
        <div className="profile-app-grid-wrap">
          <div className="row pr-2">
            {applications.length === 0 ? <EmptyScreen /> : applicationItems}
          </div>
        </div>
      </div> */}

      {/* <TablePagination
        component="div"
        count={totalApps}
        page={filters.pageNumber}
        onChangePage={handleChangePage}
        rowsPerPage={filters.pageSize}
        rowsPerPageOptions={[12, 24, 60, 120]}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
      <CustomPagination              
              count={Math.ceil(totalApps / filters.pageSize)}
              totalCount = {totalApps}
              page={filters.pageNumber}
              onChangePage={handleChangePage}
              rowsPerPage={filters.pageSize}
              rowsPerPageOption={[12, 24, 60, 120]}
              onChangeRowsPerPage={handleChangeRowsPerPage}
        />
    </div>
  )
}

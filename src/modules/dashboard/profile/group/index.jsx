import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { callApi } from '../../../../utils/api'
import CloseIcon from '@material-ui/icons/Close';
import { Link as Linking } from 'react-router-dom'
import GroupCard from './GroupCard'
import { CircularProgress } from '@material-ui/core'
import AssignButton from './AssignButton'
import {isActiveForRoles} from '../../../../utils/auth'
import EmptyScreen from '../../../../components/EmptyScreen'


const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    padding: 15 ,
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
  const [groups, setGroups] = React.useState([])

  const downloadUsers = () => {
    callApi(`/usersrvc/api/group/listAssignedGroups/${props.user.id}`)
      .then(response => setGroups(response.data))
      .catch(error => {})
  }

  React.useEffect(() => downloadUsers(), [])

  if (!groups) return (
    <div className={classes.circularprogress}>
      <CircularProgress color="secondary" />
    </div>
  )

  const groupItems = groups.map(u => (
    <Grid item xs={12} md={6} key={u.id} >
     <GroupCard group={u} history={props.history} user={props.user} onUpdate={downloadUsers} />
    </Grid>
  ))

  return (
    <div className={classes.root} >
      <div className={classes.divone}>
        <Linking to="/dash/directory/user">
          <CloseIcon className={classes.closeicon} />
        </Linking>
      </div>
      <div className={classes.header}>
        <div className={classes.heading}>Assigned Groups</div>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && (<AssignButton userId={props.user.id} onUpdate={downloadUsers} />)}
      </div>

      <div className={classes.divtwo}>
        <Grid container>
          {groups.length === 0 ? <EmptyScreen /> : groupItems}
        </Grid>
      </div>
    </div>
  )
}
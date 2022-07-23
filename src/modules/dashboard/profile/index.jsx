import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
// import { NavLink } from 'react-router-dom'
import { Switch, Route, Redirect } from "react-router-dom"

import { CircularProgress } from '@material-ui/core'
import { callApi } from '../../../utils/api'

// import ComingSoon from '../../../components/ComingSoon'
import ProfileInfo from './Info'
import ProfileSettings from './Settings'
import ProfileActivity from './Activity'
import ProfileApplications from './application'
import ProfileGroups from './group'
import ProfileManagedView from './ManagedView'
// import {isActiveForRoles} from '../../../utils/auth'
import AppTabView from '../../../components/AppTabView'
import '../../../FrontendDesigns/master-screen-settings/assets/css/profile.css'
import LetterAvatar from '../../../components/LetterAvatar'
import {isActiveForRoles} from '../../../utils/auth'
import Delegation from './delegation'

// import '../../../FrontendDesigns/master-screen-settings/assets/css/nice-select.css'
const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  layout: {
    // flexGrow: 1,
    backgroundColor: 'white'
  },
  circularprogress: { 
    display: 'flex', 
    width: '100%', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  letteravatar: { 
    height: 150, 
    width: 150 
  },
}))



export default function ProfileLayout(props) {
  const classes = useStyles()
  const [user, setUser] = React.useState()
  const [login, setLogin] = React.useState()

  const updateUser = () => {
    callApi(`/usersrvc/api/user/${props.match.params.id}`)
      .then(response => {
        setUser(response.data)
        setLogin(response.data.provisionedApps.CYMMETRI.login.login)
      })
      .catch(error => {})
  }
  React.useEffect(updateUser, [])

  if (!user) return (
    <div className={classes.circularprogress}>
      <CircularProgress color="secondary" />
    </div>
  )

  return (
    <div className={classes.root}>
      <div className={classes.layout}>
        {/* <Grid container> */}
        <div className="profile-top-section d-flex flex-column flex-md-row flex-sm-column align-items-center justify-content-between">
          {/*profile-image*/}
          <div className="col-12 col-md-8 d-flex flex-row align-items-center">
            <div className="profile-image mr-4">
              <LetterAvatar text={`${user.firstName} ${user.lastName}`} profileImage={user.profilePic} status={user.status} className={classes.letteravatar}/>
            </div>

            {/*profile-image*/}
            {/*profile-details*/}
            <div className="profile-details">
              <div className="col-12 col-sm-12 col-md-12 profile-name mb-1">{user.firstName} {user.lastName}</div>
              <div className="col-12 col-sm-12 col-md-12 profile-designation">{user.designation || 'No Desgination'}</div>
              <div className="col-12 col-sm-12 col-md-12 app-permission">{user.department || 'No Department'}</div>
              {user.status === 'ACTIVE' ? (
                <div className="col-12 col-sm-12 col-md-12 profile-status-green mb-1">{user.status}</div>
              ) : (
                <div className="col-12 col-sm-12 col-md-12 profile-status-red mb-1">{user.status}</div>
              )}
            </div>
          </div>
          {/*profile-details*/}
          {/*profile-details*/}
          <div className="col-12 col-sm-12 col-md-4 profile-details profile-connects">
            <div className="col-12 col-sm-12 col-md-12"><div className="user-contact">
              <a className="login d-flex flex-row align-items-center mt-0" ><span className="icon-view"  /> <span className="text-view">{login}</span></a>
            </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12"><div className="user-contact">
              <a className="mail-to d-flex flex-row align-items-center"><span className="icon-view" /> <span className="text-view">{user.email}</span></a>
            </div>
            </div>
            <div className="col-12 col-sm-12 col-md-12"><div className="user-contact">
              <a className="contact-info d-flex flex-row align-items-center mt-0"><span className="icon-view" /> <span className="text-view">{user.mobile}</span></a>
            </div>
            </div>
          </div>
          {/*profile-details*/}
        </div>
        <div className="profile-nav-section d-flex flex-row flex-md-row flex-sm-row align-items-center justify-content-between">
          <AppTabView
            links={[
              {
                href: `/dash/directory/user/${user.id}/applications`,
                name: 'Applications',
                roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
              },
              {
                href: `/dash/directory/user/${user.id}/groups`,
                name: 'Groups',
                roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']
              },
              {
                href: `/dash/directory/user/${user.id}/info`,
                name: 'Info',
                roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'HELP_DESK']
              },
              {
                href: `/dash/directory/user/${user.id}/activity`,
                name: 'Activity',
                roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'HELP_DESK']
              },
              {
                href: `/dash/directory/user/${user.id}/settings`,
                name: 'Settings',
                roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'HELP_DESK']
              },
              {
                href: `/dash/directory/user/${user.id}/managed-view`,
                name: 'Managed View',
                roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'HELP_DESK']
              },
              {
                href: `/dash/directory/user/${user.id}/delegation`,
                name: 'Delegation',
                roles: ['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'HELP_DESK']
              }
            ]}
          />
        </div>
      </div>

      <Switch>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'HELP_DESK']) && <Route exact={true} path="/dash/directory/user/:id/info" component={p => <ProfileInfo {...p} user={user} login={login} updateUser={updateUser} />} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'HELP_DESK']) && <Route exact={true} path="/dash/directory/user/:id/settings" component={p => <ProfileSettings {...p} user={user} login={login} updateUser={updateUser} />}
        /* component={p => <ProfileSettings {...p} user={user} />} */ /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route exact={true} path="/dash/directory/user/:id/applications" component={p => <ProfileApplications {...p} user={user} updateUser={updateUser} />} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route exact={true} path="/dash/directory/user/:id/groups" component={p => <ProfileGroups {...p} user={user} />} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'HELP_DESK']) && <Route exact={true} path="/dash/directory/user/:id/activity" component={p => <ProfileActivity {...p} user={user} />} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'HELP_DESK']) && <Route exact={true} path="/dash/directory/user/:id/managed-view" component={p => <ProfileManagedView {...p} user={user} />} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'HELP_DESK']) && <Route exact={true} path="/dash/directory/user/:id/delegation" component={p => <Delegation {...p} user={user} />} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'HELP_DESK']) && <Redirect to={`/dash/directory/user/${user.id}/info`} /> }
      </Switch>
    </div>
  )
}
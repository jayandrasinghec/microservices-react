import React from 'react'
import { Switch, Route, Redirect } from "react-router-dom"

import UserList from './user-list'
import GroupList from './group-list'
import GroupDetail from './group-detail'
import OrgList from './org-list'
import OrgDetail from './org-detail';
import Header from './Header'
import organization from './organization'

import './style.sass'
import ComingSoon from '../../../components/ComingSoon'
import { makeStyles } from '@material-ui/core/styles';
import UserProfile from '../profile'
import AddModule from '../add'
import {isActiveForRoles} from '../../../utils/auth'
import ImportList from './importList'
import { ImportSummary } from './importList/ImportSummary'
import ImportUsers from './import'

const useStyles = makeStyles(() => ({
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    width: '100%', 
    height: '100%', 
    padding: 15 ,
  }
}))

export default function DirectoryModule (props) {
  const classes = useStyles()

  return (
    <>
    <div id="dash-directory" className={classes.container}>

      <Header profile={props.profile} />

      <Switch>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'HELP_DESK']) && <Route exact={true} path="/dash/directory/user" component={UserList} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'HELP_DESK']) && <Route path="/dash/directory/import/users" component={ImportUsers} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && <Route exact={true} path="/dash/directory/import" component={ImportList} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'HELP_DESK']) && <Route path="/dash/directory/import/:id" component={ImportSummary} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'HELP_DESK']) && <Route exact={true} path="/dash/directory/groups" component={GroupList} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'HELP_DESK']) && <Route exact={true} path="/dash/directory/organization" component={organization} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'HELP_DESK']) && <Route exact={true} path="/dash/directory/orgs" component={OrgList} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY', 'HELP_DESK']) && <Route exact={true} path="/dash/directory/orgs/:id" component={OrgDetail} /> }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <Route path="/dash/directory/groups/:id" component={GroupDetail} /> }
        {/* <Route path="/dash/directory/user/:id" component={UserProfile} />
        <Route path="/dash/directory/add" component={p => <AddModule {...p} profile={props.profile} />} /> */}
        <Redirect to="/dash/directory/user" />
      </Switch>
    </div>
    </>
  )
}
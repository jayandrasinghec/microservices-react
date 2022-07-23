import React from 'react'
import { Switch, Route, Redirect } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles'
import UserList from './user'
import GroupList from './group'
import Header from './Header'

// import './style.sass'
const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: 15 
  }
}))

export default function DirectoryModule(props) {
  const classes = useStyles()
  return (
    <div id="dash-add" className={classes.container}>
      <Header profile={props.profile} />

      <Switch>
        <Route path="/dash/directory/add/user" component={UserList} />
        <Route exact={true} path="/dash/directory/add/groups" component={GroupList} />
        <Redirect to="/dash/directory/add/user" />
      </Switch>
    </div>
  )
}
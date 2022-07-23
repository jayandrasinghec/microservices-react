import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AddOne from './AddOne'


const useStyles = makeStyles(() => ({
  stepper: {
    maxWidth: 600,
    margin: '0 auto',
    width: '100%',
    marginTop: 30

  },
  root: {
    flexGrow: 1,
    overflow:'auto', 
  },
  center: { 
    textAlign: 'center' 
}
}))


export default function AddGroups (props) {
  const classes = useStyles()


  return (
    <div className={classes.root}>
      <h2 className={classes.center}>Add New Group</h2>
      <div className={classes.stepper}>
        <AddOne {...props} />
      </div>
    </div>
  )
}

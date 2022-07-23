import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import AddIcon from '@material-ui/icons/Add'
import { IconButton } from '@material-ui/core'

import { callApi, callImageApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications'

const useStyles = makeStyles(() => ({
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
    // marginTop: '20px',
    marginBottom: 5
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
  gridcontainer: { 
    marginLeft: '20px', 
    marginRight: '20px' 
  },
  gridone: { 
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  img: { 
    width: '50px', 
    height: '50px', 
    margin: 10, 
    padding: '8px' 
  },
  divone: { 
    margin: '20px 5px' 
  },
  gridtwo: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'flex-end',
  },
  divtwo: { 
    color: '#363793', 
    fontSize: 14, 
    fontWeight: 'bold', 
    paddingRight: 10 
  },
  iconbutton: { 
    height: 45, 
    width: 45, 
    marginRight: 10 
  },
}))


export default function ModalAppRow(props) {
  const classes = useStyles()
  const { app, groupId } = props
  const [assigned, setAssigned] = React.useState(props.isAssigned)
  const [saving, setSaving] = React.useState(false)

  const data = {
    applicationIds: [app.id],
    groupId: groupId
  }

  const [icon, setIcon] = React.useState([])

  const downloadIcon = () => { callImageApi(app.id).then(setIcon) }


  React.useEffect(() => {downloadIcon()}, [])

  const handleClick = () => {
    setSaving(true)
    callApi(`/provsrvc/applicationTenant/assignApplicationToGroup`, 'POST', data)
      .then(e => { setSaving(false)
        if (e.success) {
        showSuccess('Application has been added into the group')
        if (props.onUpdate) props.onUpdate()
        setAssigned(true)
      }})
      .catch(() => setSaving(false))
  }

  return (
    <div className={classes.fields}>
      <Grid item xs={12} className={classes.gridcontainer}>
        <Paper variant="outlined" elevation={3}>
          <Grid container>
            <Grid xs={9} className={classes.gridone}>
              {/* <div style={{ width: '30px', height: '30px', margin: 10, padding: '8px', backgroundColor: '#ddd', borderRadius: 45 }} /> */}
              <img src ={icon} alt=" " className={classes.img} />
              <div className={classes.divone}> {app.displayName || app.appName} </div>
            </Grid>

            <Grid xs={3} className={classes.gridtwo}>
              {
                assigned || props.isAssigned ? (<div className={classes.divtwo}>Assigned</div>) : (
                  !saving ? 
                  <IconButton disabled={saving} className={classes.iconbutton} onClick={handleClick} > <AddIcon /> </IconButton> : 
                  <a href="javascript:void(0)" style={{ color: 'black' }}>Adding..</a>
                )
              }
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </div>
  )
}
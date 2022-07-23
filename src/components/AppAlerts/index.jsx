import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import * as _ from 'underscore'
import { connect } from 'react-redux'
import { removeNotification } from './actions'
import { getNotifications } from './reducer'


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}


function AppAlerts(props) {
  const handleClose = () => props.notification && props.removeNotification(props.notification.id)

  return (
    <Snackbar
      open={!!props.notification}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={5000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={(props.notification && props.notification.kind) || 'error' || 'success'}>
        {props.notification && props.notification.messageId}
      </Alert>
    </Snackbar>
  )
}


const mapStateToProps = (state) => {
  return {
    notification: _.last(getNotifications(state))
  }
}


const mapDispatchToProps = dispatch => {
  return {
    removeNotification: (id) => dispatch(removeNotification(id))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(AppAlerts)
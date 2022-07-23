import React from 'react'

// import TextField from '@material-ui/core/TextField'
// import InputAdornment from '@material-ui/core/InputAdornment'
// import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'
// import Modal from '@material-ui/core/Modal'

import '../FrontendDesigns/master-screen-settings/assets/css/settings.css'
import '../FrontendDesigns/master-screen-settings/assets/css/nice-select.css'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  closeicon: { 
    cursor: 'pointer' 
  },
  button: { 
    float: 'right', 
    borderRadius: '8px', 
  },

}))

export default function AddNew(props) {
  const classes = useStyles()
  return (
    <div>
      <div className="settings-add-new-global-modal" id="centralModalSm" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title w-100" id="myModalLabel"> {props.title} </h4>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true"><CloseIcon className={classes.closeicon} onClick={props.onClose} /></span>
              </button>
            </div>
            <div className="modal-body" style={{maxHeight: '62vh'}}>
              {props.body}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-left btn-sm mr-auto" onClick={props.onClose}>Discard</button>
              <Button disabled={props.disabled} hidden={props.hidden} onClick={props.onSubmit} variant="contained" className={classes.button}
                color="primary"> {!props.saving ? "Save" : "Saving..."} </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
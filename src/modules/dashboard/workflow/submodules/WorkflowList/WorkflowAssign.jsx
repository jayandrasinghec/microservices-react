/* eslint-disable react/display-name */
import React from 'react'
import Button from '@material-ui/core/Button'
import CloseIcon from '@material-ui/icons/Close'
import Modal from '@material-ui/core/Modal'

import '../../../../../FrontendDesigns/master-screen-settings/assets/css/settings.css'
import '../../../../../FrontendDesigns/master-screen-settings/assets/css/nice-select.css'
import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications'
import { makeStyles } from '@material-ui/core/styles'
import AppUserInput from '../../../../../components/form/AppUserInput'


const useStyles = makeStyles(() => ({
  textField: {
    backgroundColor: '#F7F7F7',
  },
  label: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5
  },
  input: {
    height: 40
  },
  multilineInput: {
    // height: 33
  },
}))


export default function WorkflowAssign(props) {
  const classes = useStyles()

  const [reassign, setReassign] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [userId, setUserId] = React.useState(props.item.assigneeId)
  const handleReassignClick = () => setReassign(true)
  const handleReassignClose = () => setReassign(false)


  const data = {
    userId: userId,
    workflowTaskId: props.item.id
  }


  const onSubmit = () => {
    setSaving(true)

    callApi(`/workflowsrvc/api/workflowtaskassignment/assignTask`, 'PUT', data)
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('Reassigned Successfully!')
          handleReassignClose()
          props.onUpdate()
        }
      })
      .catch(() => { setSaving(false) })
  }


  return (
    <div>
      <div onClick={handleReassignClick} style={{ color: 'blue', cursor: 'pointer' }}>Reassign</div>
      <Modal open={reassign} onClose={handleReassignClose}>
        <div className="settings-add-new-global-modal" id="centralModalSm" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
          aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title w-100" id="myModalLabel">Reassign</h4>
                <span aria-hidden="true"><CloseIcon style={{ cursor: 'pointer' }} onClick={handleReassignClose} /></span>
              </div>
              <div className="modal-body">
                <form>
                  <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
                      <div>
                        <div className={classes.label}>Currently Assigned to</div>
                        <div>{props.item.assigneeName}</div>
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto">
                      <AppUserInput
                        label="Reassign to"
                        value={userId}
                        onGroupId={e => setUserId(e)} />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-left btn-sm mr-auto" onClick={handleReassignClose}>Discard</button>
                <Button
                  disabled={saving}
                  onClick={onSubmit} variant="contained" style={{ float: 'right', borderRadius: '8px', }}
                  color="primary">{!saving ? 'Save' : 'Saving'}</Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div >
  );
}

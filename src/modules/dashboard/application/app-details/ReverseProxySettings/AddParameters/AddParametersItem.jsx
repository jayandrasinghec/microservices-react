import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CloseIcon from '@material-ui/icons/Close'
import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver'
import { Modal } from '@material-ui/core';

import AppSelectInput from '../../../../../../components/form/AppSelectInput';
import AppTextInput from '../../../../../../components/form/AppTextInput';
import AppCheckbox from '../../../../../../components/form/AppCheckbox';
import {isActiveForRoles} from '../../../../../../utils/auth'

const useStyles = makeStyles(() => ({
  paperLevel: {
    margin: '0 0 20px',
    padding: '7px 22px',
    display: 'flex',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: '10px',
    flexDirection: 'column',
    overflow: 'hidden',
    alignItems: 'flex-start',
  },
  griditemone: { 
    display: 'flex', 
    alignItems: 'center' 
  },
  displayflex: { 
    display: 'flex' 
  },
  griditemtwo: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'flex-end' 
  },
  buttondiv: { 
    display: 'flex', 
    alignItems: 'center', 
    margin: '35px 10px 10px' 
  },
}))

const defaultValues = {
  name: "",
  type: "",
  script: "",
}

export const AddParametersItem = (props) => {
  const { item, config, setConfig, index } = props;
  const classes = useStyles();
  
  const [newData, setNewData] = React.useState(item || defaultValues)
  const [changes, setChange] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [enable, setEnable] = React.useState(newData.script && newData.script !== '' ? true : false)

  const typeOptions = ['FORM', 'HEADER', 'REQUEST_PARAM'];

  const handleModalOpen = () => { setOpen(true); };
  const handleModalClose = () => { setOpen(false); };

  const change = e => {
    setChange(true)
    setNewData({ ...newData, ...e })
  }

  const onSave = () => {
    let arr = config.parameters;
    arr[index] = newData
    setConfig({ ...config, parameters: arr})
    setChange(false)
  }

  const ModalBody = (
    <div className="settings-add-new-global-modal" id="centralModalSm1" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document" style={{overflowy: 'initial !important'}}>
        <div className="modal-content p-2">
          <div className="modal-header pb-1">
            <h4 className="modal-title w-100 pb-2" id="myModalLabel">Script Editor</h4>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true"><CloseIcon style={{ cursor: 'pointer' }} onClick={handleModalClose} /></span>
            </button>
          </div>
          <div className="modal-body p-0" style={{ backgroundColor: '#E9EDF6', height: '73vh', overflowY: 'auto' }}>
            <AceEditor
              mode={"java"}
              theme="twilight"
              onChange={(newValue) => change({ script: newValue })}
              value={newData.script}
              height="100%"
              width="100%"
              fontSize={14}
              wrapEnabled={true}
              enableBasicAutocompletion
              enableLiveAutocompletion
              name="UNIQUE_ID_OF_DIV"
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true
              }}
            />
          </div>
          <div className="modal-footer py-2">
            <button type="button" className="btn btn-left btn-sm ml-auto" onClick={handleModalClose}>Close</button>
            {/* <a href="JavaScript:void(0)" className="primary-btn-view">UPDATE</a> */}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className={classes.paperLevel}>
      <Grid container spacing={3}>
        <Grid item xs={6} md={4}>
          <AppTextInput
            label="Name"
            disabled={isActiveForRoles(['READ_ONLY'])}
            value={newData.name}
            onChange={e => change({ name: e.target.value })} 
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <AppSelectInput
            fullWidth
            label="Type"
            value={newData.type}
            disabled={isActiveForRoles(['READ_ONLY'])}
            onChange={e => change({ type: e.target.value })}
            options={typeOptions.map(o => o)} />
        </Grid>
        <Grid item xs={6} md={2} className={classes.griditemone}>
          <div className="custom-checkbox" className={classes.displayflex}>
            <AppCheckbox
              value={enable}
              disabled={isActiveForRoles(['READ_ONLY'])}
              onChange={(e) => {
                setChange(true)
                setEnable(Boolean(e))
              }}
              label="Enable Script" />
          </div>
        </Grid>
        { isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','APP_ADMIN']) && 
        <Grid item xs={12} md={2} className={classes.griditemtwo}>
          <div className={classes.buttondiv}>
            <IconButton 
              onClick={handleModalOpen} 
              disabled={isActiveForRoles(['READ_ONLY']) || !enable}
              title="Script Editor"
            >
              <AssignmentIcon />
            </IconButton>
            <IconButton 
              title="Save"
              disabled={!changes} 
              onClick={onSave}
            >
              <SaveIcon />
            </IconButton>
          </div>
        </Grid>
      }
      </Grid>
      <Modal open={open} onClose={handleModalClose}>
        {ModalBody}
      </Modal>
    </div>
  )
}

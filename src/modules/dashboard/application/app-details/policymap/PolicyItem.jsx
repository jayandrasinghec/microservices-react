import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CloseIcon from '@material-ui/icons/Close'
import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver'
import { Button, Modal } from '@material-ui/core';

import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications'
import AppSelectInput from '../../../../../components/form/AppSelectInput';
import AppTextInput from '../../../../../components/form/AppTextInput';
import AppCheckbox from '../../../../../components/form/AppCheckbox';
import Delete from '../../../../../FrontendDesigns/new/assets/img/icons/Delete.svg'
import {isActiveForRoles} from '../../../../../utils/auth'
import { AsyncAutoComplete } from '../../../administartion/components/AsyncAutocomplete'

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
  button: { 
    borderRadius: '8px' 
  },
}))

export const customAttrReqData = {
  "filter": {
    "name": "",
    "active": true
  },
  "keyword": "",
  "pageNumber": 0,
  "pageSize": 10,
  "sortDirection": "ASC",
  "sortOn": [
    "id"
  ]
 }
export default function PolicyItem(props) {
  const classes = useStyles();

  const defaultValues = {
    // default_val: "",
    external: "",
    internal: "",
    mandatory: false,
    object_type: "USER",
    script: "",
    tenant_applicationId: props.app.id,
    scriptEnable: false
  }
  let customAttrData = {
    "filter": {
      "name": "",
      "active": true
    },
    "keyword": "",
    "pageNumber": 0,
    "pageSize": 10,
    "sortDirection": "ASC",
    "sortOn": [
      "id"
    ]
   }
  const { data1, data2, item,data3 } = props
  const [newData, setNewData] = React.useState(item || defaultValues)
  const [changes, setChange] = React.useState(false)
  const [customField, setCustomField] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [enable, setEnable] = React.useState(newData.script && newData.script !== '' && newData.scriptEnable ? true : false)
  const [defaultToggle, setDefaultToggle] = React.useState(false)

  const handleModalOpen = () => { setOpen(true); };
  const handleModalClose = () => { setOpen(false); };

  const change = e => {
    setChange(true)
    setNewData({ ...newData, ...e })
  }

  const getCustomFieldData = (value, success, error)=>{
    if(value){
      customAttrData.filter.name = value;
    }
    if(customField === ""){
      success(data3)
    }else{
      // callApi(`/utilsrvc/meta/list/CustomAttribute`,'post',customAttrData)
      callApi(`/utilsrvc/meta/list/CustomAttribute`)
      .then(e => {
        if (e.success) {
          // e.data && success(e.data.content)
          e.data && success(e.data)
        }
      })
      .catch(error => {})
    }
  }
  const onSave = () => {
    setSaving(true)
    if(props.isCustomField){
      newData['isCustom'] = true
    }
    if (!newData.id) {
      callApi(`/provsrvc/policyMapTenant/save`, 'POST', newData)
        .then(e => {
          setChange(false)
          setSaving(false)
          if (e.success) showSuccess('New policy map added successfully!')
          props.onDelete()
        })
        .catch(error => {
          setSaving(false)
        })
    } else {
      callApi(`/provsrvc/policyMapTenant/update`, 'PUT', newData)
        .then(e => {
          setChange(false)
          setSaving(false)
          if (e.success) showSuccess('Saved Successfully!')
        })
        .catch(error => {
          setSaving(false)
        })
    }
  }

  const onDelete = () => {
    setSaving(true)
    callApi(`/provsrvc/policyMapTenant/delete/${newData.id}`, 'DELETE')
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('Deleted Successfully!')
          props.onDelete()
        }
      })
      .catch(err => {
        setSaving(false)
      })
  }
  // const customField = !!newData.default_val || newData.default_val === ''
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
  const getCustomFieldValue = (internal) =>{
    let newValue = data3.find(item=>item.value === internal);
    let newName = data3.find(item=>item.name === internal);
    if(newValue){
      return newValue.name;
    }
    if(newName){
      return newName.name;
    }
    if(internal){
        return internal;
    }
      return "";
    
  }

  const getInputValue = ()=>{
      if(newData.internal && customField === ""){
        return getCustomFieldValue(newData.internal)
      }else if(customField){
        return getCustomFieldValue(customField)
      }else{
        return ""
      }
  }

  return (
    <div className={classes.paperLevel}>
      <Grid container spacing={3}>
        <Grid item xs={6} md={2}>
          <AppSelectInput
            fullWidth
            label="Application Field"
            value={newData.external}
            disabled={isActiveForRoles(['READ_ONLY']) || newData.mandatory}
            onChange={e => change({ external: e.target.value })}
            options={data1.map(o => o.policy_attr)} />
        </Grid>
        {newData.isCustom ? <Grid item xs={6} md={2}>
          {/* <AsyncAutoComplete
            label="Custom Field"
            disabled={isActiveForRoles(['READ_ONLY'])}
            api={(value, success, error) => {
              getCustomFieldData(value, success, error)
            }}
            getOptionLabel={(option, allOptions) => {             
              if (typeof option === "object") {
                return option.name;
              } else {

                let found = allOptions.find(op => op.id === option.id);
                if (found) {
                  return found.name
                }
                return "";
              }
            }}
            onLoadApiCall={false}
            onChange={(event, newValue) => {             
              if(newValue){
                change({ internal: newValue.value })
              }               
            }}
            onInputChange={(event, newValue) => {                     
                setCustomField(newValue);
                if(event && event.nativeEvent && newValue === ""){
                  change({ internal: "" })
                }
              }}
            isSetOptions={true}
            allOptions={data3}
            onChangeApiCall={true}          
            inputValue={ getInputValue()}
          />
        </Grid>: */}
        <AsyncAutoComplete
            label="Custom Field"
            // value={{'name': "Name", 'value': "Value"}}
            value={data3.find(val => val.value === newData.internal) || ''}
            disabled={isActiveForRoles(['READ_ONLY'])}
            getOptionLabel={(option, allOptions) => {
              if (typeof option === "object") {
                return option.name;
              } else {
                return '';
              }
            }}
            api={(value, success, error) => {
              success(data3)
            }}
            onLoadApiCall={false}
            onChange={(event, newValue, reason) => {   
              if(newValue){
                change({ internal: newValue.value })
              }else {
                change({ internal: null })    
              }            
            }}
            onInputChange={(event, newValue) => {                     
                setCustomField(newValue);
                if(event && event.nativeEvent && newValue === ""){
                  change({ internal: "" })
                }
              }}
            isSetOptions={true}
            allOptions={data3}
          />
        </Grid>:
        <Grid item xs={6} md={2}>
          <AppSelectInput
            fullWidth
            disabled={isActiveForRoles(['READ_ONLY'])}
            label="Cymmetri Field"
            value={newData.internal}
            onChange={e => change({ internal: e.target.value })}
            options={data2.map(o => o.policy_attr)} />
        </Grid>}
        <Grid item xs={6} md={2} className={classes.griditemone}>
          <div className="custom-checkbox" className={classes.displayflex}>
            {/* <AppCheckbox
              value={customField}
              onChange={() => {
                if (customField) change({ default_val: undefined })
                else change({ default_val: '' })
              }}
              label="Set Default Value?" /> */}

            <AppCheckbox
              value={defaultToggle}
              onChange={(e) => {
                setChange(true)
                setDefaultToggle(Boolean(e))
                if (!e) change({ default_val: undefined })
                else {
                  setEnable(false)
                  change({ default_val: '' })
                }
              }}
              disabled={isActiveForRoles(['READ_ONLY'])}
              label="Set Default Value?" />
          </div>
        </Grid>
        <Grid item xs={6} md={2} className={classes.griditemone}>
          {/* {
            customField && ( */}
              <AppTextInput
                label="Default Value"
                // disabled={!customField}
                disabled={isActiveForRoles(['READ_ONLY']) || !defaultToggle}
                value={newData.default_val}
                placeholder={"Set default value here"}
                onChange={e => change({ default_val: e.target.value })} />
            {/* )
          } */}
        </Grid>
        <Grid item xs={6} md={2} className={classes.griditemone}>
          <div className="custom-checkbox" className={classes.displayflex}>
            <AppCheckbox
              value={enable}
              disabled={isActiveForRoles(['READ_ONLY']) || defaultToggle}
              onChange={(e) => {
                setChange(true)
                setEnable(Boolean(e))
                change({scriptEnable: Boolean(e)})
              }}
              label="Enable Script" />
          </div>
        </Grid>
        { isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','APP_ADMIN']) && 
        <Grid item xs={12} md={2} className={classes.griditemtwo}>
          <div className={classes.buttondiv}>
            {/* <Button onClick={increment} variant="contained" style={{ borderRadius: '8px', float: 'right' }} color="primary">+ Add</Button> */}
            {/* {
              enable && (<IconButton onClick={handleModalOpen} title="Script Editor"><AssignmentIcon /></IconButton>)
            } */}
            {/* <Button
              disabled={!changes}
              onClick={onSave} variant="contained" className={classes.button} color="primary">Save</Button> */}
            <IconButton 
              onClick={handleModalOpen} 
              disabled={isActiveForRoles(['READ_ONLY']) || !enable}
              title="Script Editor"
            >
              <AssignmentIcon />
            </IconButton>
            <IconButton 
              title="Save"
              disabled={!changes || saving} 
              onClick={onSave}
            >
              <SaveIcon />
            </IconButton>
            {/* {
              newData.id && !newData.mandatory && (<a onClick={onDelete} className="ml-2"><img src={Delete} alt="" title="" /></a>)
            } */}
            { 
              newData.id && !newData.mandatory && (<IconButton title="Delete" onClick={onDelete} disabled={saving}><DeleteIcon /></IconButton>)
            }
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

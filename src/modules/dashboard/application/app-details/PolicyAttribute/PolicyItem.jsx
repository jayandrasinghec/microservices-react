import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications'
import AppSelectInput from '../../../../../components/form/AppSelectInput';
import AppTextInput from '../../../../../components/form/AppTextInput';
import AppCheckbox from '../../../../../components/form/AppCheckbox';
import Delete from '../../../../../FrontendDesigns/new/assets/img/icons/Delete.svg'
import {isActiveForRoles} from '../../../../../utils/auth'


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
    alignItems: 'center' ,
    justifyContent: 'center'
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


export default function PolicyItem(props) {
  const classes = useStyles();

  const defaultValues = {
    "active": true,
    "application_id": props.app.id,
    "description": "",
    "policy_attr": ""
  }

  const { item } = props
  const [newData, setNewData] = React.useState(item || defaultValues)
  const [changes, setChange] = React.useState(false)
  const [saving, setSaving] = React.useState(false)


  const change = e => {
    setChange(true)
    setNewData({ ...newData, ...e })
  }


  const onSave = () => {
    setSaving(true)
    if (!newData.id) {
      callApi(`/provsrvc/policyAttributeTenant/create`, 'POST', newData)
        .then(e => {
          setChange(false)
          setSaving(false)
          if (e.success) {
            showSuccess('New attribute added successfully!')
            setNewData(e.data)
            props.downloadAttributes()
          }
        })
        .catch(error => {
          setSaving(false)
        })
    } else {
      callApi(`/provsrvc/policyAttributeTenant/update`, 'PUT', newData)
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
    callApi(`/provsrvc/policyAttributeTenant/delete/${newData.id}`, 'DELETE')
      .then(e => {
        if (e.success) {
          showSuccess('Deleted Successfully!')
          props.downloadAttributes()
        }
      })
  }


  return (
    <div className={classes.paperLevel}>
      <Grid container spacing={3} >
        <Grid item xs={6} md={4}>
          <AppTextInput
            label="Attribute"
            value={newData.policy_attr}
            onChange={e => change({ policy_attr: e.target.value })}
            disabled={isActiveForRoles(['READ_ONLY'])}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <AppTextInput
            label="Description"
            value={newData.description}
            onChange={e => change({ description: e.target.value })}
            disabled={isActiveForRoles(['READ_ONLY'])}
          />
            
        </Grid>
        <Grid item xs={6} md={1} className={classes.griditemone}>
          <div className="custom-checkbox" className={classes.displayflex}>
            <AppCheckbox
              value={newData.active}
              onChange={e => change({ active: e })}
              label="Active" 
              disabled={isActiveForRoles(['READ_ONLY'])}
            />
          </div>
        </Grid>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','APP_ADMIN']) && 
        <Grid item xs={6} md={3} className={classes.griditemtwo}>
          <div className={classes.buttondiv}>
            <Button
              disabled={!changes || saving}
              onClick={onSave} variant="contained" className={classes.button} color="primary">Save</Button>

            {/* {
              newData.id && !newData.mandatory && (<a onClick={onDelete} className="ml-4"><img src={Delete} alt="" title="" /></a>)
            } */}
          </div>
        </Grid>
        }
      </Grid>
    </div>
  )
}

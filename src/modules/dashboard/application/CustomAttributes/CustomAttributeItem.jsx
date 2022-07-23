import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import { callApi } from '../../../../utils/api'
import { showSuccess } from '../../../../utils/notifications'
import AppSelectInput from '../../../../components/form/AppSelectInput';
import AppTextInput from '../../../../components/form/AppTextInput';
import AppCheckbox from '../../../../components/form/AppCheckbox';
import Delete from '../../../../FrontendDesigns/new/assets/img/icons/Delete.svg'
import {isActiveForRoles} from '../../../../utils/auth'
import ActiveStatusChip from '../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../components/HOC/InactiveStatusChip';
import AddEditCustomAttribute from './AddEditCustomAttribute';


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
  },
  displayflex: { 
    display: 'flex',
    paddingTop:'20px' 
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


export default function CustomAttributeItem(props) {
  const classes = useStyles();

  const defaultValues = {
    "type": "CustomAttribute",
    "name": "",
    "value": "",
    "status": false,
    "active": false,
  }

  const { item } = props
  const [newData, setNewData] = React.useState(item || defaultValues)
  const [changes, setChange] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [openAddAttribute, setOpenAddAttribute] = React.useState(false);
  const change = e => {
    setChange(true)
    setNewData({ ...newData, ...e })
  }

  React.useEffect(() => {
    setNewData(item || defaultValues)
  }, [item])


  

  // const onDelete = () => {
  //   callApi(`/utilsrvc/meta/CustomAttribute/${newData.id}`, 'DELETE')
  //     .then(e => {
  //       if (e.success) {
  //         showSuccess('Deleted Successfully!')
  //         props.downloadAttributes()
  //       }
  //     })
  // }

  const handleClose = () => {
    setOpenAddAttribute(false);
  };

  return (
    <>
      {openAddAttribute ? (
        <AddEditCustomAttribute open={openAddAttribute} handleClose={handleClose} edit={true} editData={newData} downloadAttributes={props.downloadAttributes} />
      ) : null}
    <div className={classes.paperLevel}>
      <Grid container spacing={3} >
        <Grid item xs={6} md={4}>
          <AppTextInput
            label="Attribute"
            value={newData && newData.name}
            // disabled={!isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN','APP_ADMIN']) || newData && newData.id && newData.name}
            disabled={true}
            onChange={e => change({ name: e.target.value })}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <AppTextInput
            label="Description"
            value={newData && newData.value}
            onChange={e => change({ value: e.target.value })}
            // disabled={!isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN','APP_ADMIN'])}
            disabled={true}
          />
            
        </Grid>
        <Grid item xs={6} md={1} className={classes.griditemone}>
          <div className="custom-checkbox" className={classes.displayflex}>
            {/* <AppCheckbox
              value={newData && newData.active}
              onChange={e => change({ active: e })}
              label="Active" 
              disabled={!isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN','APP_ADMIN'])}
            /> */}
            {newData && newData.active ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip>}
          </div>
        </Grid>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && 
        <Grid item xs={6} md={3} className={classes.griditemtwo}>
          <div className={classes.buttondiv}>
            <Button
              // disabled={!changes || saving}
              disabled={!isActiveForRoles(["ORG_ADMIN", "DOMAIN_ADMIN"])}
              onClick={()=>setOpenAddAttribute(true)} 
              variant="contained" className={classes.button} color="primary">Edit</Button>
          </div>
        </Grid>
        }
        {/* {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','APP_ADMIN']) && 
        <Grid item xs={6} md={3} className={classes.griditemtwo}>
          <div className={classes.buttondiv}>
            <Button
              disabled={!changes || saving}
              onClick={onSave} 
              variant="contained" className={classes.button} color="primary">Save</Button>
          </div>
        </Grid>
        } */}
      </Grid>
    </div>
    </>
  )
}

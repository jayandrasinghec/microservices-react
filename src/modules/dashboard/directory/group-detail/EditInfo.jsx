import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
// import Button from '@material-ui/core/Button'
import { callApi } from '../../../../utils/api'
import { showSuccess } from '../../../../utils/notifications'
import AppTextInput from '../../../../components/form/AppTextInput'
import AppGroupInput from '../../../../components/form/AppGroupInput'
import AppSelectInput from '../../../../components/form/AppSelectInput'
import {isActiveForRoles} from '../../../../utils/auth'
import Button from '@material-ui/core/Button'


const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  container: {
    padding: 25,
    backgroundColor: 'white', borderRadius: '8px',
    // flexGrow: 1,
    width: '100%',
    margin: '15px 0',
  },
  divone: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 30
  },
  divtwo:{
    flex: 1
  },
}))


export default function AddOne(props) {
  const classes = useStyles();
  const [newGroup, setNewGroup] = React.useState(props.group)
  const [groupType, setGroupType] = React.useState([])
  const [errors, _setErrors] = React.useState({})
  const [saving, setSaving] = React.useState(false)
  const setError = e => _setErrors({ ...errors, ...e })

  const downloadData = () => {
    callApi(`/utilsrvc/meta/list/grouptype`, 'GET')
      .then(e => { if (e.success) setGroupType(e.data ? e.data : []) })
  }

  React.useEffect(() => downloadData(), [])
  const change = e => setNewGroup({ ...newGroup, ...e })

  const createGroup = () => {
    setSaving(true)
    callApi(`/usersrvc/api/group/${props.group.id}`, 'PUT', newGroup)
      .then(e => {
        setSaving(false) 
        if (e.success) {
          setNewGroup(e.data);
          props.onUpdate();
          showSuccess('Data has been saved')
        }
      })
      .catch(() => setSaving(false))
  }
  const isValid = newGroup.name && newGroup.type

  const checkGname = () => setError({ name: (newGroup.name || '').length > 1 ? null : 'Group name is required' })
  const checkGtype = () => setError({ type: (newGroup.type || '').length > 1 ? null : 'Group type is required' })


  return (
    <div className={classes.root}>
      <div className={classes.container} >
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <AppTextInput
              required
              label="Group Name"
              error={!!errors.name}
              onBlur={checkGname}
              helperText={errors.name}
              value={newGroup.name}
              onChange={e => change({ name: e.target.value })} />
          </Grid>
          <Grid item xs={4}>
            <AppSelectInput
              required
              label="Group Type"
              value={newGroup.type}
              error={!!errors.type}
              onBlur={checkGtype}
              helperText={errors.type}
              options={groupType.map(u => u.name)}
              onChange={e => change({ type: e.target.value })} />
          </Grid>
          <Grid item xs={4}>
            <AppGroupInput
              value={newGroup.directParentGroupId}
              label="Parent Group"
              onGroupId={e => change({ directParentGroupId: e })} />
          </Grid>

          <Grid item xs={12}>
            <AppTextInput
              label="Group Description"
              rows={4}
              multiline
              value={newGroup.description}
              onChange={e => change({ description: e.target.value })} />
          </Grid>
        </Grid>

        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && <div className={classes.divone}>
          <div className={classes.divtwo} />
            <Button disabled={!isValid || saving} onClick={createGroup} variant="contained" style={{ margin: '10px' }} color="primary">{!saving ? 'Save' : 'Saving'}</Button>

          {/* {isValid ? (
            <div onClick={createGroup} className="primary-btn-view">
              Save
            </div>
          ) : (
            <div className="primary-btn-view" style={{ backgroundColor: '#E0E0E0' }}>
              Save
            </div>
          )} */}


        </div>
        }
      </div>
    </div>
  )
}
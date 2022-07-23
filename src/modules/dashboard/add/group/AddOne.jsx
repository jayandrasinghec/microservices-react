import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link as Linking } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { showSuccess } from '../../../../utils/notifications'
import AppTextInput from '../../../../components/form/AppTextInput'
import AppGroupInput from '../../../../components/form/AppGroupInput'
import AppMasterInput from '../../../../components/form/AppMasterInput'
import * as UserSrvc from '../../../../api/usersrvc'
const useStyles = makeStyles(() => ({
  root: {
    padding: 25,
    backgroundColor: 'white', borderRadius: '8px',
    // flexGrow: 1
    display: 'flex',
    flex: 1,
    maxHeight: 500,
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
    marginBottom: '20px',
    maxWidth: 600
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
  },
  fieldName: {
    marginBottom: 10
  },
  textField: {
    backgroundColor: '#F7F7F7',
  },
  textFields: {
    backgroundColor: '#F7F7F7',
  },
  input: {
    height: 33
  },
  inputs: {
    minHeight: 100
  },
  selectRoot: {
    height: 33,
  },
  select: {
    height: 33,
    paddingTop: 0,
    paddingBottom: 0,
    verticalAlign: "middle",
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 30
  },
  flex: {
    flex: 1
 }
}))

const defaultGroup = {
  // description: "",
  // directParentGroupId: "5ebd52954ba32c7bc4f86095",
  name: "",
  type: null
}

export default function AddOne(props) {
  const classes = useStyles();

  const [newGroup, setNewGroup] = React.useState(defaultGroup)
  const [errors, _setErrors] = React.useState({})
  const [saving, setSaving] = React.useState(false)

  const setError = e => _setErrors({ ...errors, ...e })

  const change = e => setNewGroup({ ...newGroup, ...e })
  const isValid = newGroup.name && newGroup.type
  const createGroup = () => {
    setSaving(true)
    UserSrvc.createGroup(newGroup)
      .then(e => {
        setSaving(false)

        if (e.success) {
          showSuccess('New Group has been created')
          props.history.push(`/dash/directory/groups/${e.data.id}`)
          setSaving(false)
        }else{
          setSaving(false)
        }
      })
      .catch(() => setSaving(false))
  }

  const checkGname = () => setError({ name: (newGroup.name || '').length > 1 ? null : 'Group name is required' })
  const checkGtype = () => setError({ type: (newGroup.type || '').length > 1 ? null : 'Group type is required' })


  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <AppTextInput
            required
            label="Group Name"
            error={!!errors.name}
            onBlur={checkGname}
            helperText={errors.name}
            value={newGroup.name}
            onChange={e => change({ name: e.target.value })} />
        </Grid>
        <Grid item xs={6}>
          <AppMasterInput
            required
            label="Group Type"
            masterType="grouptype"
            value={newGroup.type}
            error={!!errors.type}
            onBlur={checkGtype}
            helperText={errors.type}
            onChange={e => change({ type: e.target.value })} />
        </Grid>
        <Grid item xs={6}>
          <AppGroupInput
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

      <div className={classes.button}>
        <Linking to="/dash/directory/groups">
          <Button>Discard</Button>
        </Linking>

        <div className={classes.flex} />

        <Button disabled={!isValid || saving}
          variant="contained"
          color="primary"
          onClick={createGroup}
          className={classes.button}>
            {!saving ? 'Save' : 'Saving'}
        </Button>
      </div>
    </div>
  )
}
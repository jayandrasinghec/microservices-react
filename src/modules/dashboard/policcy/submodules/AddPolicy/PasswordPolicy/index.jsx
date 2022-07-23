/* eslint-disable react/display-name */
import React from 'react';
import { Link as Linking } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import { callApi } from '../../../../../../utils/api'
import { showSuccess } from '../../../../../../utils/notifications'
import AppCheckbox from '../../../../../../components/form/AppCheckbox';
import AppTextInput from '../../../../../../components/form/AppTextInput';
import AppSelectInput from '../../../../../../components/form/AppSelectInput';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 400,
    overflow: 'hidden',
    flex: 1
},
divone: {
    marginRight: 20,
    marginLeft: 10,
    borderRadius: '10px',
    flex: 1,
    overflowY: 'auto'
},
paper: {
    padding: 25,
    marginBottom: 20,
    marginTop: 20,
    border: 'none',
    boxShadow: 'none'
  },
  flexdiv: {
    display: 'flex',
  },
  button: {
    float: 'right',
    borderRadius: '8px',
    marginRight: 20
  },
  divgrid: {
    fontWeight: 'bold' ,
  },
  span: {
    marginBottom: 15 ,
  },
  divtwo: {
    margin: '10px 10px' ,
  },
}))

const defaultData = {
  // "name":"password policy name2",
  // "description":"description",
  "isDefault": false,
  "active": false
}

const defaultComposition = {
  // randomGenerationDefaultValue:true,
  passwordLengthFrom: 6,
  passwordLengthTo: 7,
  numericCharactersAmountFrom: 1,
  numericCharactersAmountTo: 2,
  alphaCharactersAmountFrom: 1,
  alphaCharactersAmountTo: 2,
  // passwordHistoryVersion:3,
  // rejectPasswordEqualsPassword: true,
  // rejectPasswordWhichEqualsToLoginId:true,
  // rejectPasswordWhichEqualsToFirstOrLastName: true,
  // charactersNotAllowedInPassword:"$",
  upperCaseCharactersAmountFrom: 1,
  upperCaseCharactersAmountTo: 2,
  lowerCaseCharactersAmountFrom: 1,
  lowerCaseCharactersAmountTo: 2
}

export default function Global(props) {

  const [newData, setNewData] = React.useState(defaultData)
  const [newComposition, setNewComposition] = React.useState(defaultComposition)
  const [errors, _setErrors] = React.useState({})
  const [saving, setSaving] = React.useState(false)
  const [comp, setComp] = React.useState(false)
  const [id, setId] = React.useState()
  const classes = useStyles()

  const drop = [
    { type: 1 }, { type: 2 }, { type: 3 },
    { type: 4 }, { type: 5 }, { type: 6 },
    { type: 7 }, { type: 8 }, { type: 9 },
    { type: 10 }, { type: 11 }, { type: 12 },
  ]

  const change = e => setNewData({ ...newData, ...e })
  const changeComp = e => setNewComposition({ ...newComposition, ...e })
  const setError = e => _setErrors({ ...errors, ...e })

  const onSubmit = () => {
    setSaving(true)
    callApi(`/authsrvc/passwordPolicy/createPolicy`, 'POST', newData)
      .then(e => {

        if (e.success) {

          showSuccess('Policy Created Successfully!')
          setComp(true)
          setId(e.data ? e.data.id : "")
          // props.history.push(`/dash/policy/password`)
        }
      })
      .catch(() => setSaving(false))
  }

  const onCompSubmit = () => {
    callApi(`/authsrvc/passwordPolicy/savePasswordCompositionRule/${id}`, 'POST', newComposition)
      .then(e => {

        setSaving(false)
        if (e.success) {

          showSuccess('Composition Created Successfully!')
          props.history.push(`/dash/policy/password`)
        }
      })
      .catch(() => setSaving(false))
  }

  const isValid = newData.name && newData.description

  const checkCname = () => setError({ name: (newData.name || '').length > 1 ? null : 'Policy name is required' })
  const checkDes = () => setError({ description: (newData.description || '').length > 1 ? null : 'Description is require' })

  return (
    <div className={classes.container}>
      <div className={classes.divone}>
        {/* <Grid item xs={12}> */}
        <Paper variant="outlined" elevation={3} className={classes.paper} >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} lg={5}>
              <AppTextInput
                required
                value={newData.name}
                error={!!errors.name}
                onBlur={checkCname}
                helperText={errors.name}
                onChange={e => change({ name: e.target.value })}
                label="Policy Name" />
            </Grid>
            <Grid item xs={12} md={4} lg={5}>
              <AppTextInput
                required
                value={newData.description}
                error={!!errors.description}
                onBlur={checkDes}
                helperText={errors.description}
                onChange={e => change({ description: e.target.value })}
                label="Description" />
            </Grid>
            <Grid item xs={6} md={2} lg={2}>
              <AppCheckbox
                value={newData.active} onChange={e => change({ active: Boolean(e) })}
                switchLabel={newData.active ? 'Active' : 'Inactive'}
                label="Status" />
            </Grid>
          </Grid>
        </Paper>
        {/* </Grid> */}
        <div className={classes.flexdiv}>
          <Grid item xs={8}>
            <Linking to="/dash/policy">
              <Button>
                Discard
          </Button>
            </Linking>
          </Grid>
          <Grid item xs={4}>
            <Button disabled={!isValid || saving}
              onClick={onSubmit} variant="contained" className={classes.button}
              color="primary">
              {!saving ? 'Save' : 'Saving'}
            </Button>
          </Grid>
        </div>
        <Paper variant="outlined" elevation={3} className={classes.paper} >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div className={classes.divgrid}>Password Policy Composition ?</div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                <input type="checkbox" name={1} id={1} defaultChecked={newComposition.randomGenerationDefaultValue} onChange={e => newComposition.randomGenerationDefaultValue = e.target.checked} /> <label htmlFor={1} />
                <span>Random generation default value</span>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                <input type="checkbox" name={7} id={7} defaultChecked={newComposition.rejectPasswordEqualsPassword} onChange={e => newComposition.rejectPasswordEqualsPassword = e.target.checked} /> <label htmlFor={7} />
                <span>Password Equals Password</span>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                <input type="checkbox" name={9} id={9} defaultChecked={newComposition.rejectPasswordWhichEqualsToLoginId} onChange={e => newComposition.rejectPasswordWhichEqualsToLoginId = e.target.checked} /> <label htmlFor={9} />
                <span>Password which equals to LoginID</span>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                <input type="checkbox" name={10} id={10} defaultChecked={newComposition.rejectPasswordWhichEqualsToFirstOrLastName} onChange={e => newComposition.rejectPasswordWhichEqualsToFirstOrLastName = e.target.checked} /> <label htmlFor={10} />
                <span>Reject password which equals to First or Last name</span>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                <span className={classes.span}>Password Length</span>
              </div>
              <div className={classes.flexdiv}>
                <div className={classes.divtwo}>From</div>
                <AppSelectInput
                  label=""
                  value={parseInt(newComposition.passwordLengthFrom)}
                  onChange={e => changeComp({ passwordLengthFrom: e.target.value })}
                  options={drop.filter(o => o.type >= 6 && o.type <= 10).map(o => o.type)} />
                <div className={classes.divtwo}>To</div>
                <AppSelectInput
                  label=""
                  value={parseInt(newComposition.passwordLengthTo)}
                  onChange={e => changeComp({ passwordLengthTo: e.target.value })}
                  options={drop.filter(o => o.type > newComposition.passwordLengthFrom).map(o => o.type)} />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                <span className={classes.span}>Numeric characteristics (min - max) amount</span>
              </div>
              <div className={classes.flexdiv}>
                <div className={classes.divtwo}>From</div>
                <AppSelectInput
                  label=""
                  value={parseInt(newComposition.numericCharactersAmountFrom)}
                  onChange={e => changeComp({ numericCharactersAmountFrom: e.target.value })}
                  options={drop.filter(o => o.type <= 10).map(o => o.type)} />
                <div className={classes.divtwo}>To</div>
                <AppSelectInput
                  label=""
                  value={parseInt(newComposition.numericCharactersAmountTo)}
                  onChange={e => changeComp({ numericCharactersAmountTo: e.target.value })}
                  options={drop.filter(o => o.type > newComposition.numericCharactersAmountFrom).map(o => o.type)} />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                <span className={classes.span}>Password history versions</span>
              </div>
              <div className={classes.flexdiv}>
                <div className={classes.divtwo}>Version</div>
                <AppTextInput
                  value={newComposition.passwordHistoryVersion}
                  onChange={e => changeComp({ passwordHistoryVersion: e.target.value })}
                  label=""
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                <span className={classes.span}>Characters are not allowed in the password</span>
              </div>
              <div className={classes.flexdiv}>
                <div className={classes.divtwo}>Characters</div>
                <AppTextInput
                  label=""
                  value={newComposition.charactersNotAllowedInPassword}
                  onChange={e => changeComp({ charactersNotAllowedInPassword: e.target.value })}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                <span className={classes.span}>Alpha characters (min - max)</span>
              </div>
              <div className={classes.flexdiv}>
                <div className={classes.divtwo}>From</div>
                <AppSelectInput
                  label=""
                  value={parseInt(newComposition.alphaCharactersAmountFrom)}
                  onChange={e => changeComp({ alphaCharactersAmountFrom: e.target.value })}
                  options={drop.filter(o => o.type <= 10).map(o => o.type)} />
                <div className={classes.divtwo}>To</div>
                <AppSelectInput
                  label=""
                  value={parseInt(newComposition.alphaCharactersAmountTo)}
                  onChange={e => changeComp({ alphaCharactersAmountTo: e.target.value })}
                  options={drop.filter(o => o.type > newComposition.alphaCharactersAmountFrom).map(o => o.type)} />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                <span className={classes.span}>Lowercase characteristics (min - max)</span>
              </div>
              <div className={classes.flexdiv}>
                <div className={classes.divtwo}>From</div>
                <AppSelectInput
                  label=""
                  value={parseInt(newComposition.lowerCaseCharactersAmountFrom)}
                  onChange={e => changeComp({ lowerCaseCharactersAmountFrom: e.target.value })}
                  options={drop.filter(o => o.type <= 10).map(o => o.type)} />
                <div className={classes.divtwo}>To</div>
                <AppSelectInput
                  label=""
                  value={parseInt(newComposition.lowerCaseCharactersAmountTo)}
                  onChange={e => changeComp({ lowerCaseCharactersAmountTo: e.target.value })}
                  options={drop.filter(o => o.type > newComposition.lowerCaseCharactersAmountFrom).map(o => o.type)} />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                <span className={classes.span}>Uppercase characteristics (min - max)</span>
              </div>
              <div className={classes.flexdiv}>
                <div className={classes.divtwo}>From</div>
                <AppSelectInput
                  label=""
                  value={parseInt(newComposition.upperCaseCharactersAmountFrom)}
                  onChange={e => changeComp({ upperCaseCharactersAmountFrom: e.target.value })}
                  options={drop.filter(o => o.type <= 10).map(o => o.type)} />
                <div className={classes.divtwo}>To</div>
                <AppSelectInput
                  label=""
                  value={parseInt(newComposition.upperCaseCharactersAmountTo)}
                  onChange={e => changeComp({ upperCaseCharactersAmountTo: e.target.value })}
                  options={drop.filter(o => o.type > newComposition.upperCaseCharactersAmountFrom).map(o => o.type)} />
              </div>
            </Grid>
          </Grid>
        </Paper>
        {/* <Grid item xs={12}> */}
        <div className={classes.flexdiv}>
          <Grid item xs={8}>
            <Linking to="/dash/policy">
              <Button>
                Discard
          </Button>
            </Linking>
          </Grid>
          <Grid item xs={4}>
            <Button disabled={!comp}
              onClick={onCompSubmit}
              variant="contained" className={classes.button}
              color="primary">
              Save
          </Button>
          </Grid>
        </div>
        {/* </Grid> */}
      </div>
    </div>
  )
}



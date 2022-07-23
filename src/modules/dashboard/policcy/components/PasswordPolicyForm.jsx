import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import { Link as Linking } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Link from '@material-ui/core/Link'
import Collapse from '@material-ui/core/Collapse';

import AppCheckbox from '../../../../components/form/AppCheckbox';
import AppTextInput from '../../../../components/form/AppTextInput';
import AppSelectInput from '../../../../components/form/AppSelectInput';
import { callApi } from '../../../../utils/api'
import { showSuccess } from '../../../../utils/notifications'
import {isActiveForRoles} from '../../../../utils/auth'

const useStyles = makeStyles(() => ({
  link: {
    paddingBottom: 5,
    marginTop: '10px',
    marginRight: '30px',
    fontSize: 14,
    transition: 'all 0.1s ease',
    fontWeight: 'bold !important',
    color: '#1F4287',
    textDecorationLine: 'none',
    '&:hover': {
      fontWeight: 'bold',
      color: '#363795'
    },
    cursor: 'pointer'
  },
  button: {
    float: 'right',
    borderRadius: '8px',
    marginRight: 20
  },
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
    marginRight: 20,
    border: 'none',
    boxShadow: 'none'
  },
  flexdisplay: {
    display: 'flex'
  },
  span: {
    marginBottom: 15
  },
  divtwo: {
    margin: '10px 10px'
  },
  divthree: {
    margin: '10px 10px 10px 0px',
    display: 'flex'
  },
}))

export default function PasswordPolicyForm (props) {
  const classes = useStyles()
  const { newData, setNewData, newComposition, setNewComposition, newChange, setNewChange } = props
  const [errors, _setErrors] = React.useState({})
  const [compErrors, _setCompErrors] = React.useState({})
  const [saving, setSaving] = React.useState(false)
  const [savingForm, setSavingForm] = React.useState(false)

  const [composition, setComposition] = React.useState(true);
  const [changeP, setChangeP] = React.useState(false);
  const [changed, setChanged] = React.useState(false);
  const [compChanged, setCompChanged] = React.useState(false);
  const [conditionalAttrValueOptions, setConditionalAttrValueOptions] = React.useState([])
  // const [notifications, setNotifications] = React.useState(false);
  // const [reset, setReset] = React.useState(false);
  const handleCompClick = () => { setComposition(true); setChangeP(false); }
  const handleChangeClick = () => { setComposition(false); setChangeP(true); }
  // const handleNotiClick = () => { setComposition(false); setChangeP(false); setNotifications(true); setReset(false) }
  // const handleResetClick = () => { setComposition(false); setChangeP(false); setNotifications(false); setReset(true) }


  const conditionalAttrTypeOptions = [{label: 'User', value: 'USER'}]
  const conditionalAttrNameOptions = [{label: 'UserType', value: 'userType'}]

  const getConditionalAttrValueOptions = () => {
    callApi(`/utilsrvc/meta/list/userType`, 'GET')
      .then(e => { 
        if (e.success) {
          setConditionalAttrValueOptions(e.data)
        }
      })
  }

  React.useEffect(() => getConditionalAttrValueOptions(), [])

  const drop = [
    {type: 1}, {type: 2}, {type: 3},
    {type: 4}, {type: 5}, {type: 6},
    {type: 7}, {type: 8}, {type: 9},
    {type: 10}, {type: 11}, {type: 12},
  ]

  const changeComp = e => {
    setNewComposition({ ...newComposition, ...e })
    setCompChanged(true)
  }
  const changeChange = e => {
    setNewChange({ ...newChange, ...e })
    setCompChanged(true)
  }
  // const changeReset = e => setNewReset({ ...newReset, ...e })
  // const changeNoti = e => setNewNoti({ ...newNoti, ...e })

  const change = e => {
    setNewData({ ...newData, ...e })
    setChanged(true)
  }
  const setError = e => _setErrors({ ...errors, ...e })
  const isValid = newData.name && newData.description && !Object.values(errors).some(e => e != null)
  const checkCname = () => setError({ name: (newData.name || '').length > 1 ? null : 'Console Display name is required' })
  const checkDes = () => setError({ description: (newData.description || '').length > 1 ? null : 'Description is required' })

  const setCompError = e => _setCompErrors({ ...compErrors, ...e })

  const isValidComposition = !Object.values(compErrors).some(e => e != null) && newComposition.numericCharactersAmountFrom && newComposition.alphaCharactersAmountFrom && newComposition.lowerCaseCharactersAmountFrom && newComposition.upperCaseCharactersAmountFrom

  const checkFields = (e) => {
    if(newComposition[e.target.name] === null || !(newComposition[e.target.name]).toString().length) {
      setCompError({ [e.target.name] : `This field is required.` })
    } else {
      setCompError({ [e.target.name] : null })
    }
  }
  // const checkPasswordLengthTo = () => {
  //   if(newComposition.passwordLengthTo && Number(newComposition.passwordLengthTo) < 0) {
  //     setError({passwordLengthTo : 'Value should be greater than 0.'})
  //   } else {
  //     setError({passwordLengthTo : null})
  //   }
  //   if(newComposition.passwordLengthTo && newComposition.passwordLengthFrom) {
  //     if(Number(newComposition.passwordLengthTo) <= Number(newComposition.passwordLengthFrom)) {
  //       setError({passwordLengthTo : 'To value cannot be smaller than From value.'})
  //     } else {
  //       setError({passwordLengthTo : null, passwordLengthFrom : null})
  //     }
  //   }
  // }
  
  // const checkPasswordLengthFrom = () => {
  //   if(newComposition.passwordLengthFrom && Number(newComposition.passwordLengthFrom) < 0) {
  //     setError({passwordLengthFrom : 'Value should be greater than 0.'})
  //   } else {
  //     setError({passwordLengthFrom : null})
  //   }
  //   if(newComposition.passwordLengthTo && newComposition.passwordLengthFrom) {
  //     if(Number(newComposition.passwordLengthTo) <= Number(newComposition.passwordLengthFrom)) {
  //       setError({passwordLengthFrom : 'From value cannot be greater than To value.'})
  //     } else {
  //       setError({passwordLengthFrom : null, passwordLengthTo : null})
  //     }
  //   }
  // }

  const checkPasswordLengthFrom = () => {
    if(newComposition.passwordLengthFrom && Number(newComposition.passwordLengthFrom) < 1) {
      setError({passwordLengthFrom : 'Value should be greater than 0.'})
    } else if(newComposition.passwordLengthTo && newComposition.passwordLengthFrom && Number(newComposition.passwordLengthTo) <= Number(newComposition.passwordLengthFrom)) {
      setError({passwordLengthFrom : 'From value cannot be greater than To value.'})
    }else {
      setError({passwordLengthFrom : null})
    }
  }
  
  const checkPasswordLengthTo = () => {
    if(newComposition.passwordLengthTo && Number(newComposition.passwordLengthTo) < 1) {
      setError({passwordLengthTo : 'Value should be greater than 0.'})
    } else if(newComposition.passwordLengthTo && newComposition.passwordLengthFrom && Number(newComposition.passwordLengthTo) <= Number(newComposition.passwordLengthFrom)) {
      setError({passwordLengthTo : 'To value cannot be smaller than From value.'})
    }else {
      setError({passwordLengthTo : null})
    }
  }
  

  const checkPasswordLength = ()=>{
    checkPasswordLengthFrom()
    checkPasswordLengthTo()
  }
  const checkPasswordExpiryLengthTo = () => {
    if(newChange.daysToPasswordExpirationWarningTo && newChange.daysToPasswordExpirationWarningFrom) {
      if(newChange.daysToPasswordExpirationWarningTo <= newChange.daysToPasswordExpirationWarningFrom) {
        setError({daysToPasswordExpirationWarningTo : 'Invalid Input'})
      } else {
        setError({daysToPasswordExpirationWarningTo : null, daysToPasswordExpirationWarningFrom : null})
      }
    }
  }

  const checkPasswordExpiryLengthFrom = () => {
    if(newChange.daysToPasswordExpirationWarningTo && newChange.daysToPasswordExpirationWarningFrom) {
      if(newChange.daysToPasswordExpirationWarningTo <= newChange.daysToPasswordExpirationWarningFrom) {
        setError({daysToPasswordExpirationWarningFrom : 'Invalid Input'})
      } else {
        setError({daysToPasswordExpirationWarningFrom : null, daysToPasswordExpirationWarningTo : null})
      }
    }
  }
  const type = composition ? "savePasswordCompositionRule" : "savePasswordChangeRule"
  const body = composition ? newComposition : newChange

  const onFormSubmit = () => {
    setSavingForm(true)
    callApi(`/authsrvc/passwordPolicy/savePolicy/${props.match.params.id}`, 'POST', newData)
      .then(e => {
        setSavingForm(false)
        setChanged(false)
        if (e.success) {
          showSuccess('Policy Saved Successfully!')
        }
      })
      .catch(() => setSavingForm(false))
  }
  const onSubmit = () => {
    setSaving(true)
    callApi(`/authsrvc/passwordPolicy/${type}/${props.match.params.id}`, 'POST', body)
      .then(e => {
        setSaving(false)
        setCompChanged(false)
        if (e.success) {
          showSuccess('Saved Successfully!')
          // props.history.goBack()
        }
      })
      .catch(() => setSaving(false))

  }

  return (
    <div className={classes.container}>
      <div className={classes.divone}>
        <Paper variant="outlined" elevation={3} className={classes.paper} >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} lg={4}>
              <AppTextInput
                required
                value={newData.name}
                error={!!errors.name}
                onBlur={checkCname}
                helperText={errors.name}
                onChange={e => change({ name: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN']) || newData.isDefault}
                label="Policy Name" 
              />
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <AppTextInput
                required
                value={newData.description}
                error={!!errors.description}
                onBlur={checkDes}
                helperText={errors.description}
                onChange={e => change({ description: e.target.value })}
                disabled={!isActiveForRoles(['ORG_ADMIN']) || newData.isDefault}
                label="Description" 
              />
            </Grid>
            <Grid item xs={6} md={2} lg={2}>
              <AppCheckbox
                value={newData.active} onChange={e => change({ active: Boolean(e) })}
                switchLabel={newData.active ? 'Active' : 'Inactive'}
                disabled={!isActiveForRoles(['ORG_ADMIN']) || newData.isDefault}
                label="Status" 
              />
            </Grid>
            {newData.isDefault ? 
              <Grid item xs={6} md={2} lg={2}>
                <AppCheckbox
                  value={newData.isDefault} onChange={e => change({ isDefault: Boolean(e) })}
                  switchLabel={newData.isDefault ? 'True' : 'False'}
                  disabled={!isActiveForRoles(['ORG_ADMIN']) || newData.isDefault}
                  label="isDefault" 
                />
              </Grid> : null
            }
            
          </Grid>
          {!newData.isDefault ?
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} lg={4}>
                <AppSelectInput
                  value={newData.conditionalAttrType}
                  onChange={e => change({ conditionalAttrType: e.target.value })}
                  label="Conditinal Attribute Type"
                  disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                  options={conditionalAttrTypeOptions.map(opt => opt.value)}
                  labels={conditionalAttrTypeOptions.map(opt => opt.label)} 
                />
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <AppSelectInput
                  value={newData.conditionalAttrName}
                  onChange={e => change({ conditionalAttrName: e.target.value })}
                  label="Conditinal Attribute Name"
                  disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                  options={conditionalAttrNameOptions.map(opt => opt.value)}
                  labels={conditionalAttrNameOptions.map(opt => opt.label)} 
                />
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <AppSelectInput
                  value={newData.conditionalAttrValue}
                  onChange={e => change({ conditionalAttrValue: e.target.value })}
                  label="Conditinal Attribute Value"
                  disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                  options={conditionalAttrValueOptions.map(opt => opt.value)}
                  labels={conditionalAttrValueOptions.map(opt => opt.name)} 
                />
              </Grid>
            </Grid> : null
          }
        </Paper>
        <div className={classes.flexdisplay}>
          {isActiveForRoles(['ORG_ADMIN']) && <Grid item xs={12}>
            <Button 
              className={classes.button} 
              disabled={!isValid || savingForm || !changed || newData.isDefault} 
              onClick={onFormSubmit} 
              variant="contained" 
              color="primary"
            > 
              {!savingForm ? 'Save' : 'Saving'}
            </Button>
          </Grid>}
        </div>

        <Grid item xs={12}>
          <Link onClick={handleCompClick} className={classes.link}>Composition</Link>
          <Link onClick={handleChangeClick} className={classes.link}>Change</Link>
        </Grid>

        <Collapse in={composition}>
        <Paper variant="outlined" elevation={3} className={classes.paper} >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                <input 
                  type="checkbox" 
                  disabled={!isActiveForRoles(['ORG_ADMIN'])} 
                  name={7} 
                  id={7} 
                  defaultChecked={newComposition.rejectPasswordEqualsPassword} 
                  onChange={e => {
                    newComposition.rejectPasswordEqualsPassword= e.target.checked
                    setCompChanged(true)
                  }}
                /> 
                <label htmlFor={7} />
                <span>Reject Password Equals Password</span>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                <input 
                  type="checkbox" 
                  disabled={!isActiveForRoles(['ORG_ADMIN'])} 
                  name={9} 
                  id={9} 
                  defaultChecked={newComposition.rejectPasswordWhichEqualsToLoginId} 
                  onChange={e => {
                    newComposition.rejectPasswordWhichEqualsToLoginId= e.target.checked
                    setCompChanged(true)
                  }}
                /> 
                <label htmlFor={9} />
                <span>Reject Password which equals to LoginID</span>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                <input 
                  type="checkbox" 
                  disabled={!isActiveForRoles(['ORG_ADMIN'])} 
                  name={10} 
                  id={10} 
                  defaultChecked={newComposition.rejectPasswordWhichEqualsToFirstOrLastName} 
                  onChange={e => {
                    newComposition.rejectPasswordWhichEqualsToFirstOrLastName = e.target.checked
                    setCompChanged(true) 
                  }} 
                /> 
                <label htmlFor={10} />
                <span>Reject password which equals to First or Last name</span>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                <span className={classes.span}>Password Length</span>
              </div>
              <div className={classes.flexdisplay}>
                <div className={classes.divtwo}>From</div>
                {/* <AppSelectInput
                  label=""
                  value={parseInt(newComposition.passwordLengthFrom)}
                  disabled={!isActiveForRoles(['ORG_ADMIN'])}
                  onChange={e => changeComp({ passwordLengthFrom: e.target.value })}
                  options={drop.filter(o => o.type >= 6 && o.type <=10).map(o => o.type)} /> */}
                  <AppTextInput
                    label=""
                    type="number"
                    style={{width: '120px'}}
                    error={!!errors.passwordLengthFrom}
                    onBlur={checkPasswordLengthFrom}
                    helperText={errors.passwordLengthFrom}
                    min={0}
                    value={parseInt(newComposition.passwordLengthFrom)}
                    disabled={!isActiveForRoles(['ORG_ADMIN'])}
                    onChange={e => changeComp({ passwordLengthFrom: e.target.value })}
                  />
                <div className={classes.divtwo}>To</div>
                {/* <AppSelectInput
                  label=""
                  value={parseInt(newComposition.passwordLengthTo)}
                  disabled={!isActiveForRoles(['ORG_ADMIN'])}
                  onChange={e => changeComp({ passwordLengthTo: e.target.value })}
                  options={drop.filter(o => o.type > newComposition.passwordLengthFrom).map(o => o.type)} /> */}
                  <AppTextInput
                    label=""
                    type="number"
                    style={{width: '120px'}}
                    error={!!errors.passwordLengthTo}
                    onBlur={checkPasswordLengthTo}
                    helperText={errors.passwordLengthTo}
                    min={0}
                    value={parseInt(newComposition.passwordLengthTo)}
                    disabled={!isActiveForRoles(['ORG_ADMIN'])}
                    onChange={e => changeComp({ passwordLengthTo: e.target.value })}
                  />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                {/* <span className={classes.span}>Numeric characteristics (min - max) amount</span> */}
                <span className={classes.span}>Numeric characters minimum count <span className="text-danger">*</span>  </span>
              </div>
              <div className={classes.flexdisplay}>
                {/* <div className={classes.divtwo}>From</div> */}
                <div className={classes.divtwo}>Value</div>
                {/* <AppSelectInput
                  label=""
                  disabled={!isActiveForRoles(['ORG_ADMIN'])}
                  value={parseInt(newComposition.numericCharactersAmountFrom)}
                  onChange={e => changeComp({ numericCharactersAmountFrom: e.target.value })}
                  options={drop.filter(o => o.type <= 10).map(o => o.type)} /> */}
                  <AppTextInput
                    label=""
                    type="number"
                    // style={{width: '60px'}}
                    min={0}
                    disabled={!isActiveForRoles(['ORG_ADMIN'])}
                    value={parseInt(newComposition.numericCharactersAmountFrom)}
                    onChange={e => changeComp({ numericCharactersAmountFrom: e.target.value })}
                    name="numericCharactersAmountFrom"
                    error={!!compErrors.numericCharactersAmountFrom}
                    onBlur={checkFields}
                    helperText={compErrors.numericCharactersAmountFrom}
                  />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                <span className={classes.span}>Password history versions</span>
              </div>
              <div className={classes.flexdisplay}>
                <div className={classes.divtwo}>Version</div>
                <AppTextInput
                  disabled={!isActiveForRoles(['ORG_ADMIN'])}
                  type="number"
                  min={0}
                  value={newComposition.passwordHistoryVersion}
                  onChange={e => changeComp({ passwordHistoryVersion: e.target.valueAsNumber })}
                  label=""
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                <span className={classes.span}>Special Characters Count</span>
              </div>
              <div className={classes.flexdisplay}>
                <div className={classes.divtwo}>Value</div>
                <AppTextInput
                  disabled={!isActiveForRoles(['ORG_ADMIN'])}
                  type="number"
                  min={0}
                  value={newComposition.specialCharactersAmount}
                  onChange={e => changeComp({ specialCharactersAmount: e.target.valueAsNumber })}
                  label=""
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                <span className={classes.span}>Characters are not allowed in the password</span>
              </div>
              <div className={classes.flexdisplay}>
              <div className={classes.divtwo}>Characters</div>
                <AppTextInput
                  label=""
                  disabled={!isActiveForRoles(['ORG_ADMIN'])}
                  value={newComposition.charactersNotAllowedInPassword}
                  onChange={e => changeComp({ charactersNotAllowedInPassword: e.target.value })}
                  />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                {/* <span className={classes.span}>Alpha characters (min - max)</span> */}
                <span className={classes.span}>Alpha characters <span className="text-danger">*</span></span>
              </div>
              <div className={classes.flexdisplay}>
                {/* <div className={classes.divtwo}>From</div> */}
                <div className={classes.divtwo}>Value</div>
                {/* <AppSelectInput
                  disabled={!isActiveForRoles(['ORG_ADMIN'])}
                  label=""
                  value={parseInt(newComposition.alphaCharactersAmountFrom)}
                  onChange={e => changeComp({ alphaCharactersAmountFrom: e.target.value })}
                  options={drop.filter(o => o.type <= 10).map(o => o.type)} /> */}
                  <AppTextInput
                    disabled={!isActiveForRoles(['ORG_ADMIN'])}
                    label=""
                    type="number"
                    // style={{width: '60px'}}
                    min={0}
                    value={parseInt(newComposition.alphaCharactersAmountFrom)}
                    onChange={e => changeComp({ alphaCharactersAmountFrom: e.target.value })}
                    name="alphaCharactersAmountFrom"
                    error={!!compErrors.alphaCharactersAmountFrom}
                    onBlur={checkFields}
                    helperText={compErrors.alphaCharactersAmountFrom}
                  />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                {/* <span className={classes.span}>Lowercase characteristics (min - max)</span> */}
                <span className={classes.span}>Lowercase characters <span className="text-danger">*</span></span>
              </div>
              <div className={classes.flexdisplay}>
                {/* <div className={classes.divtwo}>From</div> */}
                <div className={classes.divtwo}>Value</div>
                {/* <AppSelectInput
                  disabled={!isActiveForRoles(['ORG_ADMIN'])}
                  label=""
                  value={parseInt(newComposition.lowerCaseCharactersAmountFrom)}
                  onChange={e => changeComp({ lowerCaseCharactersAmountFrom: e.target.value })}
                  options={drop.filter(o => o.type <= 10).map(o => o.type)} /> */}
                  <AppTextInput
                    disabled={!isActiveForRoles(['ORG_ADMIN'])}
                    label=""
                    type="number"
                    // style={{width: '60px'}}
                    min={0}
                    value={parseInt(newComposition.lowerCaseCharactersAmountFrom)}
                    onChange={e => changeComp({ lowerCaseCharactersAmountFrom: e.target.value })}
                    name="lowerCaseCharactersAmountFrom"
                    error={!!compErrors.lowerCaseCharactersAmountFrom}
                    onBlur={checkFields}
                    helperText={compErrors.lowerCaseCharactersAmountFrom}
                  />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="custom-checkbox" style={{ display: 'flex' }}>
                {/* <span className={classes.span}>Uppercase characteristics (min - max)</span> */}
                <span className={classes.span}>Uppercase characters <span className="text-danger">*</span></span>
              </div>
              <div className={classes.flexdisplay}>
                {/* <div className={classes.divtwo}>From</div> */}
                <div className={classes.divtwo}>Value</div>
                {/* <AppSelectInput
                  label=""
                  disabled={!isActiveForRoles(['ORG_ADMIN'])}
                  value={parseInt(newComposition.upperCaseCharactersAmountFrom)}
                  onChange={e => changeComp({ upperCaseCharactersAmountFrom: e.target.value })}
                  options={drop.filter(o => o.type <= 10).map(o => o.type)} /> */}
                  <AppTextInput
                    label=""
                    type="number"
                    // style={{width: '60px'}}
                    min={0}
                    disabled={!isActiveForRoles(['ORG_ADMIN'])}
                    value={parseInt(newComposition.upperCaseCharactersAmountFrom)}
                    onChange={e => changeComp({ upperCaseCharactersAmountFrom: e.target.value })}
                    name="upperCaseCharactersAmountFrom"
                    error={!!compErrors.upperCaseCharactersAmountFrom}
                    onBlur={checkFields}
                    helperText={compErrors.upperCaseCharactersAmountFrom}
                  />
              </div>
            </Grid>
          </Grid>
        </Paper>

        </Collapse>

        <Collapse in={changeP}>
          <Paper variant="outlined" elevation={3} className={classes.paper} >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <div className="custom-checkbox" style={{ display: 'flex' }}>
                  <input 
                    type="checkbox" 
                    disabled={!isActiveForRoles(['ORG_ADMIN'])} 
                    name={2} 
                    id={2} 
                    defaultChecked={newChange.changePasswordAfterReset} 
                    onChange={e => {
                      newChange.changePasswordAfterReset=e.target.checked 
                      setCompChanged(true)
                    }}
                  /> 
                  <label htmlFor={2} />
                  <span>Change Password After Reset</span>
                </div>
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <div className="custom-checkbox" style={{ display: 'flex' }}>
                  <input 
                    type="checkbox" 
                    disabled={!isActiveForRoles(['ORG_ADMIN'])} 
                    name={3} 
                    id={3} 
                    defaultChecked={newChange.rejectResetByUser} 
                    onChange={e => {
                      newChange.rejectResetByUser=e.target.checked 
                      setCompChanged(true)
                    }}
                  /> 
                  <label htmlFor={3} />
                  <span>Reject Reset By User</span>
                </div>
              </Grid> */}
              <Grid item xs={12} md={12}>
                <div className={classes.flexdisplay}>
                  <div className={classes.divthree}>Password Expiration Days</div>
                  <AppTextInput
                    value={newChange.passwordExpirationDays}
                    onChange={e => changeChange({ passwordExpirationDays: e.target.value })}
                    disabled={!isActiveForRoles(['ORG_ADMIN'])}
                    label=""
                  />
                </div>
              </Grid>
              {/* <Grid item xs={12} md={12}>
                <div className={classes.flexdisplay}>
                  <div className={classes.divthree}>Password Expiration Grace Period</div>
                  <AppTextInput
                    value={newChange.passwordExpirationGracePeriod}
                    onChange={e => changeChange({ passwordExpirationGracePeriod: e.target.value })}
                    label=""
                    disabled={!isActiveForRoles(['ORG_ADMIN'])}
                  />
                </div>
              </Grid> */}
              <Grid item xs={12} md={12}>
                <div className="custom-checkbox" style={{ display: 'flex' }}>
                  <span className={classes.span}>Days To Password Expiration Warning</span>
                </div>
                <div className={classes.flexdisplay}>
                  <div className={classes.divtwo}>From</div>
                  {/* <AppSelectInput
                    label=""
                    disabled={!isActiveForRoles(['ORG_ADMIN'])}
                    value={parseInt(newChange.daysToPasswordExpirationWarningFrom)}
                    onChange={e => changeChange({ daysToPasswordExpirationWarningFrom: e.target.value })}
                    options={drop.filter(o => o.type <= 10).map(o => o.type)} /> */}
                    <AppTextInput
                      label=""
                      type="number"
                      style={{width: '120px'}}
                      min={0}
                      error={!!errors.daysToPasswordExpirationWarningFrom}
                      onBlur={checkPasswordExpiryLengthFrom}
                      helperText={errors.daysToPasswordExpirationWarningFrom}
                      disabled={!isActiveForRoles(['ORG_ADMIN'])}
                      value={parseInt(newChange.daysToPasswordExpirationWarningFrom)}
                      onChange={e => changeChange({ daysToPasswordExpirationWarningFrom: e.target.value })} 
                    />
                  {/* <div className={classes.divtwo}>To</div> */}
                  {/* <AppSelectInput
                    label=""
                    disabled={!isActiveForRoles(['ORG_ADMIN'])}
                    value={parseInt(newChange.daysToPasswordExpirationWarningFrom)}
                    onChange={e => changeChange({ daysToPasswordExpirationWarningFrom: e.target.value })}
                    options={drop.filter(o => o.type > newChange.daysToPasswordExpirationWarningFrom).map(o => o.type)} /> */}
                    {/* <AppTextInput
                      label=""
                      type="number"
                      style={{width: '120px'}}
                      min={0}
                      error={!!errors.daysToPasswordExpirationWarningTo}
                      onBlur={checkPasswordExpiryLengthTo}
                      helperText={errors.daysToPasswordExpirationWarningTo}
                      disabled={!isActiveForRoles(['ORG_ADMIN'])}
                      value={parseInt(newChange.daysToPasswordExpirationWarningTo)}
                      onChange={e => changeChange({ daysToPasswordExpirationWarningTo: e.target.value })} 
                    /> */}
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>

        <div className={classes.flexdisplay}>
          <Grid item xs={8}>
            <Linking to="/dash/policy">
            <Button>
              Discard
            </Button>
            </Linking>
          </Grid>
          {isActiveForRoles(['ORG_ADMIN']) && <Grid item xs={4}>
            <Button 
              className={classes.button} 
              disabled={saving || !isValidComposition || !compChanged} 
              onClick={onSubmit} 
              variant="contained" 
              color="primary"
            > 
              {!saving ? 'Save' : 'Saving'}
            </Button>
          </Grid>}
        </div>
    </div>
  </div>
  )
}
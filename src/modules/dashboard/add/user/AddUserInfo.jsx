import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link as Linking } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import validator from 'validator'
import Button from '@material-ui/core/Button'
import AppCountryCodeInput from '../../../../components/form/AppCountryCodeInput'
import AppTextInput from '../../../../components/form/AppTextInput'
import { showSuccess } from '../../../../utils/notifications'
import AppMasterInput from '../../../../components/form/AppMasterInput'
import AppUserInput from '../../../../components/form/AppUserInput'
import * as UserSrvc from '../../../../api/usersrvc'
import Modal from '@material-ui/core/Modal';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

// import { format } from "date-fns";
function getModalStyle() {
  const top = 28;
  const left = 35;

  return {
    top: `${top}%`,
    left: `${left}%`,
  };
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: 1,
    // maxHeight: 500,
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
    marginBottom: '20px'
  },
  button: {
    float: 'right',
    borderRadius: '8px',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: 15,
    maxHeight: '80',
    // overflow: 'auto'
  },
  paper: {
    position: 'fixed',
    width: 500,
    backgroundColor: 'white',
    borderRadius: '20px',
    textAlign: 'center',
    alignItems: 'center',
    display: 'block'
  },
  content: {
    width: 500,
    backgroundColor: '#E9EDF6',
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: '0px 0px 20px 20px',
    display: 'block'
  },
  modalheader: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '19px',
    lineHeight: '21px',
  },
  modalcontent: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '21px',
  },
  modalcancel: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '21px',
    color: '#363795',
  },
  griditemone: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
  },
  divone: {
    width: 70
  },
  griditemtwo: {
    justifyContent: 'flex-end',
    display: 'flex'
  },
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
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
  telContainer: {
    '& input' : {
      width: '100%'
    }
  },
  countryInput: {
    width: '100% !important',
    height: '40px !important',
    position: 'relative',
    fontSize: '1rem ',
    letterSpacing: '.01rem',
    marginTop: '0 !important',
    marginBottom: '0 !important',
    paddingLeft: '48px',
    marginLeft: '0',
    background: '#f6f6f7 !important',
    borderRadius: '4px !important',
    lineHeight: '40px !important',
    "&:focus" : {
      boxShadow: '0 0 0 0.1rem rgba(54, 55, 147, 1)'
    }
  }
}))

const defaultUser = {
  assignedGroups: [],
  // attributes: {},
  provisionedApps: {},
  securityQuestion: {}
}

export default function AddUserInfo(props) {
  const classes = useStyles();

  const [newUser, setNewUser] = React.useState(defaultUser)
  const [agree1, setAgree1] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [open, setOpen] = React.useState(false);
  const [login, setLogin] = React.useState();
  const [password, setPassword] = React.useState();
  const [id, setId] = React.useState();
  const [errors, _setErrors] = React.useState({})
  const [modalStyle] = React.useState(getModalStyle);

  const change = e => setNewUser({ ...newUser, ...e })
  const setError = e => _setErrors({ ...errors, ...e })

  const handleModalOpen = () => {
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
    props.history.push(`/dash/directory/add/user/${id}/groups`)
  };

  const onSubmit = () => {
    if(newUser.startDate){
      newUser.startDate = newUser.startDate + 'T00:00'
    }
    if(newUser.endDate){
      newUser.endDate = newUser.endDate + 'T00:00'
    }
    setSaving(true)
    UserSrvc.createUser(newUser)
      .then(e => {

        setSaving(false)
        if (e.success) {
          showSuccess('User Created Successfully!')
          setId(e.data ? e.data.id : "")
          setLogin(e.data ? e.data.provisionedApps.CYMMETRI.login.login : "")
          setPassword(e.data ? e.data.password : "")
          handleModalOpen()
          // alert(`Login : ${e.data.provisionedApps.CYMMETRI.login.login} , Password : ${e.data.password}`)
          // props.history.push(`/dash/directory/add/user/${e.data.id}/groups`)
        }
      })
      .catch(() => setSaving(false))
  }

  const body = (
    <div>
      <div style={modalStyle} className={classes.paper}>
        <div style={{ display: 'block' }}>
          <div style={{ paddingBottom: '10px', paddingTop: 20 }}><span className={classes.modalheader}>Login Credentials</span></div>
          <div style={{ paddingTop: '10px' }}><span className={classes.modalcontent}>Login - {login}</span></div>
          <div><span className={classes.modalcontent}>Password - {password} </span></div>
          <Button color="primary" variant="contained" style={{ margin: '10px' }} onClick={handleModalClose}>Continue</Button>
        </div>
      </div>
    </div>
  );

  const isValid = !Object.values(errors).some(e => e != null) && newUser.firstName && newUser.lastName  && newUser.login && newUser.userType

  const checkFname = () => {
    if ((newUser.firstName || '').length === 0) {
      setError({firstName: 'First name is required'})
    } else if(!newUser.firstName.match(/^(?! )[A-Za-z ]*(?<! )$/)) {
      setError({firstName: 'Please enter valid first name'})
    } else if((newUser.firstName || '').length > 30) {
      setError({firstName: 'Max 30 characters are allowed'})
    } else {
      setError({firstName: null})
    }
  }

  const checkLname = () => {
    if ((newUser.lastName || '').length === 0) {
      setError({lastName: 'Last name is required'})
    } else if(!newUser.lastName.match(/^(?! )[A-Za-z ]*(?<! )$/)) {
      setError({lastName: 'Please enter valid last name'})
    } else if((newUser.lastName || '').length > 30) {
      setError({lastName: 'Max 30 characters are allowed'})
    } else {
      setError({lastName: null})
    }
  }

  const checkEmail = () => {
    if(newUser.email) {
      if(!validator.isEmail(newUser.email)) {
        setError({email: 'Please enter valid email address'})
      } else if((newUser.email || '').length > 50) {
        setError({email: 'Max 50 characters are allowed'})
      } else {
        setError({email: null})
      }
    } else {
      setError({email: null})
    }
  }

  const checkLogin = () => {
    // if(!newUser.login.match(/^[a-zA-Z0-9._]*$/)) {
    if((newUser.login || '').length === 0) {
      setError({login: 'Login ID is required'})
    } else if(!newUser.login.match(/^[a-zA-Z0-9._@]*$/)) {
      setError({login: 'Login ID should be alphaNumeric'})
    } else if((newUser.login || '').length > 50) {
      setError({login: 'Maximum 50 characters are allowed'})
    } else {
      setError({login: null})
    }
  }

  const employeeId = () => {
    if(newUser.employeeId) {
      if(!newUser.employeeId.match(/^[a-zA-Z0-9._]*$/)) {
        setError({employeeId: 'Please enter valid employee id'})
      } else if((newUser.employeeId || '').length > 30) {
        setError({employeeId: 'Max 30 characters are allowed'})
      } else {
        setError({employeeId: null})
      }
    } else {
      setError({employeeId: null})
    }
  }
  // const checkCountry = () => setError({ country: (newUser.country || '') ? null : 'Country is required' })
  // const checkMobile = () => setError({ mobile: validator.isMobilePhone(newUser.mobile) || !newUser.mobile ? null : 'Mobile Number is invalid' })
  // const checkLandline = () => setError({ landline: validator.isMobilePhone(newUser.landline) || !newUser.mobile ? null : 'Landline Number is invalid' })
  const checkMobile = () => {
    if(newUser.mobile) {
      if(!validator.isMobilePhone(newUser.mobile, ['en-IN'])) {
        setError({mobile: 'Mobile Number is invalid'})
      } else {
        setError({mobile: null})
      }
    } else {
      setError({mobile: null})
    }
  }
  const checkLandline = () => {
    if(newUser.landline) {
      if((newUser.landline || '').length < 10 || (newUser.landline || '').length > 15) {
        setError({landline: 'Minimum 10 and Maximum 15 digits are allowed'})
      }else {
        setError({landline: null})
      }
    } else {
      setError({landline: null})
    }
  }

  const checkUserType = () => setError({ userType: (newUser.userType || '') ? null : 'User Type is required' })
  
  // const checkSDate = () => {
  //   if(new Date(newUser.startDate).toLocaleDateString() === new Date().toLocaleDateString()) {
  //     setError({startDate: null})
  //   } else {
  //     if(new Date(newUser.startDate) < new Date()) {
  //       setError({startDate: 'Start Date is invalid.'})
  //     } else {
  //       setError({startDate: null})
  //     }
  //   }

  //   if(newUser.endDate) {
  //     if(new Date(newUser.endDate) < new Date(newUser.startDate)) {
  //       setError({endDate: 'End Date is invalid.'})
  //     }
  //   }
  // }

  const checkEDate = () => setError({ endDate: (new Date(newUser.endDate) > new Date(newUser.startDate)) || !newUser.startDate ? null : 'End Date is invalid' })

  const checkAddress1 = () => {
    if((newUser.address1 || '').length > 50) {
      setError({address1: 'Maximum 50 characters are allowed'})
    } else {
      setError({address1: null})
    }
  }

  const checkAddress2 = () => {
    if((newUser.address2 || '').length > 50) {
      setError({address2: 'Maximum 50 characters are allowed'})
    } else {
      setError({address2: null})
    }
  }

  const checkAssociatedPartner = () => {
    if(newUser.associatedPartner) {
      if(!newUser.associatedPartner.match(/^(?! )[A-Za-z ]*(?<! )$/)) {
        setError({associatedPartner: 'Please enter valid associated partner name'})
      } else if((newUser.associatedPartner || '').length > 30) {
        setError({associatedPartner: 'Maximum 30 characters are allowed'})
      } else {
        setError({associatedPartner: null})
      }
    } else {
      setError({associatedPartner: null})
    }
  }

  const checkCity = () => {
    if(newUser.city) {
      if(!newUser.city.match(/^(?! )[A-Za-z ]*(?<! )$/)) {
        setError({city: 'Please enter valid city name'})
      } else if((newUser.city || '').length > 30) {
        setError({city: 'Maximum 30 characters are allowed'})
      } else {
        setError({city: null})
      }
    } else {
      setError({city: null})
    }
  }

  const checkDOB = () => {
    const getAge = (dateString) => {
      let today = new Date();
      let birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      let m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }

    if(getAge(newUser.dateOfBirth) < 18) {
      setError({dateOfBirth: 'Age must me atleast 18 years.'})
    } else {
      setError({dateOfBirth: null})
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <AppTextInput
              required
              label="First Name"
              error={!!errors.firstName}
              onBlur={checkFname}
              value={newUser.firstName}
              helperText={errors.firstName}
              onChange={e => change({ firstName: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <AppTextInput
              required
              label="Last Name"
              error={!!errors.lastName}
              onBlur={checkLname}
              helperText={errors.lastName}
              value={newUser.lastName}
              onChange={e => change({ lastName: e.target.value })} />
          </Grid>
          <Grid item xs={6}>
            <AppTextInput
              label="Email"
              type="email"
              error={!!errors.email}
              onBlur={checkEmail}
              helperText={errors.email}
              value={newUser.email}
              onChange={e => change({ email: e.target.value })} />
          </Grid>
          <Grid item xs={6}>
            <AppTextInput
              required
              label="Login ID"
              value={newUser.login}
              error={!!errors.login}
              onBlur={checkLogin}
              helperText={errors.login}
              onChange={e => change({ login: e.target.value })} />
          </Grid>
          <Grid item xs={6}>
            <AppTextInput
              label="Employee ID"
              value={newUser.employeeId}
              error={!!errors.employeeId}
              onBlur={employeeId}
              helperText={errors.employeeId}
              onChange={e => change({ employeeId: e.target.value })} />
          </Grid>
          <Grid item xs={6}>
            <AppUserInput
              label="Manager"
              value={newUser.managerId ? newUser.managerId : null}
              onGroupId={e => change({ ...newUser ,managerId: e })}
            />
          </Grid>
          <Grid item xs={6}>
            <AppTextInput
              label="Mobile"
              min={0}
              type="number"
              error={!!errors.mobile}
              onBlur={checkMobile}
              helperText={errors.mobile}
              value={newUser.mobile}
              onChange={e => change({ mobile: e.target.value })} />
          </Grid>
          <Grid item xs={6}>
            <AppMasterInput
              required
              masterType="userType"
              label="User Type"
              value={newUser.userType}
              error={!!errors.userType}
              onBlur={checkUserType}
              helperText={errors.userType}
              onChange={e => change({ userType: e.target.value })} />
          </Grid>
          <Grid item xs={6}>
            <AppMasterInput
              masterType="department"
              label="Department"
              value={newUser.department}
              onChange={e => change({ department: e.target.value })} />
          </Grid>
          <Grid item xs={6}>
            <AppMasterInput
              masterType="designation"
              label="Designation"
              value={newUser.designation}
              onChange={e => change({ designation: e.target.value })} />
          </Grid>
          <Grid item xs={6}>
            <AppTextInput
              label="Start Date"
              type="date"
              value={newUser.startDate}
              // error={!!errors.startDate}
              // onBlur={checkSDate}
              // helperText={errors.startDate}
              onChange={e => change({ startDate: e.target.value })} />
          </Grid>
          <Grid item xs={6}>
            <AppTextInput
              label="End Date"
              type="date"
              error={!!errors.endDate}
              onBlur={checkEDate}
              helperText={errors.endDate}
              value={newUser.endDate}
              onChange={e => change({ endDate: e.target.value })} />
          </Grid>

          {
            agree1 && (
              <React.Fragment>
                <Grid item xs={6}>
                  <AppTextInput
                    label="Date of Birth"
                    type="date"
                    value={newUser.dateOfBirth}
                    error={!!errors.dateOfBirth}
                    onBlur={checkDOB}
                    helperText={errors.dateOfBirth}
                    onChange={e => change({ dateOfBirth: e.target.value })} />
                </Grid>
                {/* <Grid item xs={6}>
                  <AppTextInput
                    label="Profile Picture"
                    type="file" />
                </Grid> */}
                <Grid item xs={6}>
                  <AppTextInput
                    label="Landline"
                    type="number"
                    value={newUser.landline}
                    error={!!errors.landline}
                    onBlur={checkLandline}
                    helperText={errors.landline}
                    onChange={e => change({ landline: e.target.value })} />
                </Grid>
                <Grid item xs={6}>
                  <AppTextInput
                    label="Address 1"
                    value={newUser.address1}
                    error={!!errors.address1}
                    helperText={errors.address1}
                    onBlur={checkAddress1}
                    onChange={e => change({ address1: e.target.value })} />
                </Grid>
                <Grid item xs={6}>
                  <AppTextInput
                    label="Address 2"
                    value={newUser.address2}
                    error={!!errors.address2}
                    helperText={errors.address2}
                    onBlur={checkAddress2}
                    onChange={e => change({ address2: e.target.value })} />
                </Grid>
                <Grid item xs={6}>
                  <AppTextInput
                    label="Associated Partner"
                    value={newUser.associatedPartner}
                    error={!!errors.associatedPartner}
                    helperText={errors.associatedPartner}
                    onBlur={checkAssociatedPartner}
                    onChange={e => change({ associatedPartner: e.target.value })} />
                </Grid>
                <Grid item xs={6}>
                  <AppTextInput
                    label="City"
                    value={newUser.city}
                    error={!!errors.city}
                    helperText={errors.city}
                    onBlur={checkCity}
                    onChange={e => change({ city: e.target.value })} />
                </Grid>
                <Grid item xs={6}>
                  {/* <AppCountryCodeInput
                    label="Country Code"
                    type="number"
                    min={0}
                    value={newUser.countryCode}
                    onChange={e => change({ countryCode: e })} /> */}
                  <div className={classes.label}>Country Code</div>
                  <PhoneInput
                    containerClass={classes.telContainer}
                    inputClass={classes.countryInput}
                    country={''}
                    placeholder="Select Country Code."
                    value={newUser.countryCode}
                    onChange={e => change({ countryCode: e })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <AppMasterInput
                    masterType="country"
                    label="Country"
                    value={newUser.country}
                    onChange={e => change({ country: e.target.value })} />
               </Grid>
              </React.Fragment>
            )
          }

          <Grid item xs={8}>
            <Button onClick={() => setAgree1(!agree1)}>
              {!agree1 ? 'Add more info' : 'Hide more info'}
            </Button>
          </Grid>

          <Grid item xs={4}>
            <Linking to="/dash/directory/users">
              <Button>Discard</Button>
            </Linking>
            <Button disabled={!isValid || saving}
              onClick={onSubmit} variant="contained" className={classes.button}
              color="primary">
                {!saving ? 'Add User' : 'Saving'}
            </Button>
          </Grid>
        </Grid>
        <Modal open={open} onClose={handleModalClose}>
        {body}
      </Modal>
      </div>

    </div>
  )
}
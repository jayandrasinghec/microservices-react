import React,{useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link as Linking } from 'react-router-dom'
import validator from 'validator'
import Collapse from '@material-ui/core/Collapse'
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip';
import PhoneInput from 'react-phone-input-2'

import CustomAttributeList from './CustomAttributeList'
import Line from '../../../assets/Line.png'
import Plus from '../../../assets/Plus.png'
import CopyIcon from '../../../assets/copy.svg'
import EditIcon from '../../../assets/edit.svg';
import AppUserInput from '../../../components/form/AppUserInput'
import AppTextInput from '../../../components/form/AppTextInput'
import AppMasterInput from '../../../components/form/AppMasterInput'
import { callApi } from '../../../utils/api'
import { showSuccess } from '../../../utils/notifications'
import { isActiveForRoles } from '../../../utils/auth'
import { copyText, trimmedString } from '../../../utils/helper'

import '../../../FrontendDesigns/master-screen-settings/assets/css/main.css'
import '../../../FrontendDesigns/master-screen-settings/assets/css/profile.css'
import '../../../FrontendDesigns/master-screen-settings/assets/css/profile-info.css'
import '../../../FrontendDesigns/master-screen-settings/assets/css/settings.css'
import '../../../FrontendDesigns/master-screen-settings/assets/css/users.css'
import '../../../FrontendDesigns/master-screen-settings/assets/css/nice-select.css'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    overflow: 'auto',
    minHeight: '20px'
  },
  layout: {
    flexGrow: 1,
    backgroundColor: 'white'
  },
  Nav: {
    display: 'flex',
    marginTop: '5px',
    marginBottom: '5px',
  },
  editPointer:{
    cursor:'pointer',
  },
  link: {
    marginTop: '20px',
    marginLeft: '20px',

    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    color: '#1F4287',
    textDecorationLine: 'none',
    '&:hover': {
      fontWeight: 'bold',
      color: '#363795',
      textDecorationLine: 'none',
    }
  },
  clickedLink: {
    textDecorationLine: 'none',
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#363795',
    marginTop: '2px',
    marginLeft: '20px',
    fontSize: '18px',
  },
  heading: {
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '18px',
    color: '#171717',
    lineHeight: '21px',
    marginTop: '10px',
    marginLeft: '30px'
  },
  paper: {
    padding: '30px !important',
    margin: '10px 20px',
  },
  infoheading: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 13,
    color: '#8392A7',
    lineHeight: '16px',
  },
  infocontent: {
    fontWeight: '500',
    fontSize: 16,
    color: '#171717',
    lineHeight: 1.5,
  },
  fields: {
    display: 'flex',
    marginTop: '20px',
    marginBottom: '30px'
  },
  divone: {
    position: 'absolute',
    top: 15,
    right: 15,
    display: 'flex',
    flexDirection: 'column'
  },
  closeicon: {
    color: '#666',
    marginBottom: 15
  },
  divtwo: {
    padding: 15
  },
  toolTipFont: {
    fontSize: '15px'
  },
  copyClipboardWrap :{
    display:'flex'
  },
  pdL10:{
    paddingLeft:'10px'
  },
  label: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5
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
}));


export default function UserLayout(props) {
  const classes = useStyles();
  const [user, setUser] = React.useState(true);
  const [saving, setSaving] = React.useState(false)
  const [contact, setContact] = React.useState(false);
  const [department, setDepartment] = React.useState(false);
  const [customAttr, setCustomAttr] = React.useState(false);
  const [other, setOther] = React.useState(false);
  const [editable, setEditable] = React.useState(false);
  const [data, setData] = React.useState(props.user)
  const [errors, _setErrors] = React.useState({})
  const [iconHide, seticonHide] = React.useState(null)
  const setError = e => _setErrors({ ...errors, ...e })

  var UserImage, ContactImage, DeptImage, CustAttrImage, OtherImg;
  (user === true) ? (UserImage = Line) : (UserImage = Plus);
  (contact === true) ? (ContactImage = Line) : (ContactImage = Plus);
  (department === true) ? (DeptImage = Line) : (DeptImage = Plus);
  (customAttr === true) ? (CustAttrImage = Line) : (CustAttrImage = Plus);
  (other === true) ? (OtherImg = Line) : (OtherImg = Plus);

  const handleUserClick = () => setUser(!user);
  const handleContactClick = () => setContact(!contact);
  const handleDepartmentClick = () => setDepartment(!department);
  const handleCustomAttrClick = () => setCustomAttr(!customAttr);
  const handleOtherClick = () => setOther(!other);

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


  const firstName = () => {
    if ((data.firstName || '').length === 0) {
      setError({firstName: 'First name is required'})
    } else if(!data.firstName.match(/^(?! )[A-Za-z ]*(?<! )$/)) {
      setError({firstName: 'Please enter valid first name'})
    } else if((data.firstName || '').length > 30) {
      setError({firstName: 'Max 30 characters are allowed'})
    } else {
      setError({firstName: null})
    }
  }

  const lastName = () => {
    if ((data.lastName || '').length === 0) {
      setError({lastName: 'Last name is required'})
    } else if(!data.lastName.match(/^(?! )[A-Za-z ]*(?<! )$/)) {
      setError({lastName: 'Please enter valid last name'})
    } else if((data.lastName || '').length > 30) {
      setError({lastName: 'Max 30 characters are allowed'})
    } else {
      setError({lastName: null})
    }
  }

  const email = () => {
    if(data.email) {
      if(!validator.isEmail(data.email)) {
        setError({email: 'Please enter valid email address'})
      } else if((data.email || '').length > 50) {
        setError({email: 'Max 50 characters are allowed'})
      }
       else {
        setError({email: null})
      }
    } else {
      setError({email: null})
    }
  }

  const employeeId = () => {
    if(data.employeeId) {
      if(!data.employeeId.match(/^[a-zA-Z0-9._]*$/)) {
        setError({employeeId: 'Please enter valid employee id'})
      } else if((data.employeeId || '').length > 30) {
        setError({employeeId: 'Max 30 characters are allowed'})
      } else {
        setError({employeeId: null})
      }
    } else {
      setError({employeeId: null})
    }
  }
  // const country = () => setError({ country: (newUser.country || '') ? null : 'Country is required' })
  const mobile = () => {
    if(data.mobile) {
      if(!validator.isMobilePhone(data.mobile, ['en-IN'])) {
        setError({mobile: 'Mobile Number is invalid'})
      } else {
        setError({mobile: null})
      }
    } else {
      setError({mobile: null})
    }
  }

  const landline = () => {
    if(data.landline) {
      if((data.landline || '').length < 10 || (data.landline || '').length > 15) {
        setError({landline: 'Minimum 10 and Maximum 15 digits are allowed'})
      } else {
        setError({landline: null})
      }
    } else {
      setError({landline: null})
    }
  }
  const userType = () => setError({ userType: (data.userType || '') ? null : 'User Type is required' })
  // const endDate = () => setError({ endDate: (new Date(newUser.endDate) > new Date(newUser.startDate)) ? null : 'End Date is invalid' })
  // const startDate = () => {
  //   if(new Date(data.startDate).toLocaleDateString() === new Date().toLocaleDateString()) {
  //     setError({startDate: null})
  //   } else {
  //     if(new Date(data.startDate) < new Date()) {
  //       setError({startDate: 'Start Date is invalid.'})
  //     } else {
  //       setError({startDate: null})
  //     }
  //   }

  //   if(data.endDate) {
  //     if(new Date(data.endDate) < new Date(data.startDate)) {
  //       setError({endDate: 'End Date is invalid.'})
  //     }
  //   }
  // }
  const endDate = () => setError({ endDate: (new Date(data.endDate) > new Date(data.startDate)) || !data.startDate ? null : 'End Date is invalid' })
  
  const address1 = () => {
    if((data.address1 || '').length > 50) {
      setError({address1: 'Maximum 50 characters are allowed'})
    } else {
      setError({address1: null})
    }
  }

  const address2 = () => {
    if((data.address2 || '').length > 50) {
      setError({address2: 'Maximum 50 characters are allowed'})
    } else {
      setError({address2: null})
    }
  }

  const associatedPartner = () => {
    if(data.associatedPartner) {
      if(!data.associatedPartner.match(/^(?! )[A-Za-z ]*(?<! )$/)) {
        setError({associatedPartner: 'Please enter valid associated partner name'})
      } else if((data.associatedPartner || '').length > 30) {
        setError({associatedPartner: 'Maximum 30 characters are allowed'})
      } else {
        setError({associatedPartner: null})
      }
    } else {
      setError({associatedPartner: null})
    }
  }

  const city = () => {
    if(data.city) {
      if(!data.city.match(/^(?! )[A-Za-z ]*(?<! )$/)) {
        setError({city: 'Please enter valid city name'})
      } else if((data.city || '').length > 30) {
        setError({city: 'Maximum 30 characters are allowed'})
      } else {
        setError({city: null})
      }
    } else {
      setError({city: null})
    }
  }

  const dateOfBirth = () => {
    if(getAge(data.dateOfBirth) < 18) {
      setError({dateOfBirth: 'Age must me atleast 18 years.'})
    } else {
      setError({dateOfBirth: null})
    }
  }


  const onClick = () => {
    setSaving(true)
    if(data.startDate){
      if(!data.startDate.includes('T')) data.startDate = data.startDate + 'T00:00'
    }
    if(data.endDate){
      if(!data.endDate.includes('T')) data.endDate = data.endDate + 'T00:00'
    }
    callApi(`/usersrvc/api/user/${props.match.params.id}`, 'PUT', data)
      .then(response => {
        setSaving(false)
        if(response.success){
          setUser(response.data);
          props.updateUser();
          setEditable(false)
          showSuccess('The profile info has been saved!')
        }
      })
      .catch(() => setSaving(false))
  }
  const onEdit = () => {
    if(editable==false){
      setUser(true)
      setContact(true)
      setDepartment(true)
      setCustomAttr(true)
      setOther(true)
    }
    setEditable(!editable)
  }

  const getField = (label, key, type, options, disabled, attrValue) => {

    const valid = () => _setErrors(...errors,{ key: (setUser.key || '').length > 1 ? null : `${key} is required` })

    if (type === 'date') {
      let d = ''
      if (data[key]) d = data[key].split("T")[0];

      if (editable) return (
        label === "Date of Birth" ?
        <AppTextInput
          type="date"
          label={label}
          error={key === 'dateOfBirth' ? !!errors.dateOfBirth : ''}
          onBlur={key === 'dateOfBirth' ? dateOfBirth : ''}
          helperText={key === 'dateOfBirth' ? errors.dateOfBirth : ''}
          onChange={e => {
            setData({ ...data, [key]: e.target.value })
          }}
          value={data[key] ? d : null} /> : 
          <AppTextInput
            type="date"
            label={label}
            error={key === 'endDate' ? !!errors.endDate : ''}
            onBlur={key === 'endDate' ? endDate : ''}
            helperText={key === 'endDate' ? errors.endDate : ''}
            onChange={e => setData({ ...data, [key]: e.target.value })}
            value={data[key] ? d : null} /> 
      )

      return (
        <div style={{ overflowX: 'hidden' }}>
          <div className="heading-basic-info mb-1"><span>{label}</span></div>
          <div className="content-nasic-info"><label>{d}</label></div>
        </div>
      )
    }

    if (type === 'user' && editable) {
      return (
        <AppUserInput
          label="Manager"
          resource={data.id}
          value={data[key] ? data[key] : null}
          onGroupId={e => setData({ ...data, [key]: e })} />
      )
    }
    if (key === 'countryCode' && editable) {
      return (
        <>
          <div className={classes.label}>Country Code</div>
          <PhoneInput
            containerClass={classes.telContainer}
            inputClass={classes.countryInput}
            country={''}
            placeholder="Select Country Code."
            value={data[key]}
            onChange={e => setData({ ...data, [key]: e })}
          />
        </>
      )
    }
    if (type === 'dropdown') {
      if (editable) return (
        <AppMasterInput
          label={label}
          masterType={options}
          error={key === 'userType' ? !!errors.userType : ''}
          onBlur={key === 'userType' ? userType : ''}
          helperText={key === 'userType' ? errors.userType : ''}
          value={data[key]}
          onChange={e => setData({ ...data, [key]: e.target.value })} />
      )

      return (
        <div style={{ overflowX: 'hidden' }}>
          <div className="heading-basic-info mb-1">{label}</div>
          <div className={classes.copyClipboardWrap} onMouseOver={()=>{
            handleDisplayCopyIcon(data[key])
          }} onMouseLeave={()=>{seticonHide(null)}} >
          <div className="content-nasic-info">
            {data[key]}
          </div>
           {data[key] ? iconHide && iconHide[data[key]] ? <img className={classes.pdL10} src={CopyIcon} alt='copy' style={{cursor:'pointer'}} onClick={() => copyText(data[key])} />:null :null}
          </div>
        </div>
      )
    }

    if (type === 'login') {
      return (
        <div style={{ overflowX: 'hidden' }}>
          <div className="heading-basic-info mb-1">{label}</div>
          <div className={classes.copyClipboardWrap} onMouseOver={()=>{
            handleDisplayCopyIcon(props.login)
          }} onMouseLeave={()=>{seticonHide(null)}}>
          <Tooltip title={<span className={classes.toolTipFont}>{props.login}</span>} placement="top">
            <div className="content-nasic-info" >
              {props.login && trimmedString(props.login)}
              </div>
          </Tooltip>
          {props.login ?iconHide && iconHide[props.login] ? <img className={classes.pdL10} src={CopyIcon} alt='copy' style={{cursor:'pointer'}} onClick={() => copyText(props.login)} />:null:null}
          </div>
        </div>
      )
    }

    if (type === 'createdBy' || type === 'displayName') {
      return (
        <div style={{ overflowX: 'hidden' }}>
          <div className="heading-basic-info mb-1">{label}</div>
          <div className={classes.copyClipboardWrap} onMouseOver={()=>{
            handleDisplayCopyIcon(data[key])
          }} onMouseLeave={()=>{seticonHide(null)}}>

          <Tooltip title={<span className={classes.toolTipFont}>{data[key]}</span>} placement="top">
            <div className="content-nasic-info">{trimmedString(data[key])}</div>
          </Tooltip>
          {data[key] ? iconHide && iconHide[data[key]] ? <img className={classes.pdL10} src={CopyIcon} alt='copy' style={{cursor:'pointer'}} onClick={() => copyText(data[key])} />:null:null}
          </div>
        </div>
      )
    }

    if (editable) return (
      <AppTextInput
        label={label}
        type={type}
        error={key === 'firstName' ? !!errors.firstName : key === 'lastName' ? !!errors.lastName : key === 'email' ? !!errors.email : key === 'mobile' ? !!errors.mobile : key === 'landline' ? !!errors.landline : key === 'employeeId' ? !!errors.employeeId : key === 'associatedPartner' ? !!errors.associatedPartner : key === 'city' ? !!errors.city : key === 'address1' ? !!errors.address1 : key === 'address2' ? !!errors.address2 : '' }
        helperText={key === 'firstName' ? errors.firstName : key === 'lastName' ? errors.lastName : key === 'email' ? errors.email : key === 'mobile' ? errors.mobile : key === 'landline' ? errors.landline : key === 'employeeId' ? errors.employeeId : key === 'associatedPartner' ? errors.associatedPartner : key === 'city' ? errors.city : key === 'address1' ? errors.address1 : key === 'address2' ? errors.address2 : '' }
        onBlur={key === 'firstName' ? firstName : key === 'lastName' ? lastName : key === 'email' ? email : key === 'mobile' ? mobile : key === 'landline' ? landline : key === 'employeeId' ? employeeId : key === 'associatedPartner' ? associatedPartner : key === 'city' ? city : key === 'address1' ? address1 : key === 'address2' ? address2 : '' }
        onChange={e => setData({ ...data, [key]: e.target.value })}
        value={data[key]} />
    )

    return (
        <div style={{ overflowX: 'hidden' }}>
          <div className="heading-basic-info mb-1">{label}</div>
          <div className={classes.copyClipboardWrap} onMouseOver={()=>{
            handleDisplayCopyIcon(data[key])
          }} onMouseLeave={()=>{seticonHide(null)}}>

          <Tooltip title={<span className={classes.toolTipFont}>{key === 'managerId' ? data['managerDisplayName'] : key === 'countryCode' && data['countryCode'] ? '+' + data['countryCode'] : data[key]}</span>} placement="top">
            <div
             className="content-nasic-info">{trimmedString(key === 'managerId' ? data['managerDisplayName'] : key === 'countryCode' && data['countryCode'] ? '+' + data['countryCode'] : data[key])}</div>
          </Tooltip>
          {data[key] ? iconHide && iconHide[data[key]] ? <img className={classes.pdL10} style={{cursor:'pointer'}} src={CopyIcon} alt='copy' onClick={() => copyText(key === 'managerId' ? data['managerDisplayName'] : key === 'countryCode' && data['countryCode'] ? '+' + data['countryCode'] : data[key]) } />:null : null }
          </div>
        </div>
    )
  }

  const handleDisplayCopyIcon = (key)=>{
    seticonHide({[key]:true})
  }
  useEffect(()=>{
    if(props.history.location.state &&props.history.location.state.edit){
      onEdit()
    }
  },[])
  return (
    <div className={classes.root}>
      <div className={classes.divone}>
        <Linking to="/dash/directory/user">
          <CloseIcon className={classes.closeicon} />
        </Linking>
        {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'HELP_DESK']) && (

          <img className={ classes.editPointer } src={ EditIcon } alt="" title="" onClick={() => { onEdit() }} />
         )} 
      </div>
      <div className="accordion cym-custom-scroll " id="accordionExample">
        <div className="cym-admin-list-row-info user-cards-table">
          <div className="settings-table-card row" id="headingOne">
            <div className=" col-12 " onClick={handleUserClick}>
              <div style={{ justifyContent: 'space-between', display: 'flex' }} className="row mb-3 mb-sm-3 mb-md-0 ">
                <h4 className="admin-row-heading mb-0 pl-3">Basic Info</h4>
                <div>
                  <img alt="Icon" src={UserImage} />
                </div>
              </div>
            </div>
          </div>
          <Collapse in={(editable == true)?(user && editable):(user || editable)}>
            <div id="collapseOne" className="collapse show mt-3">
              <div className="user-table-card">
                <div className="row">
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6 mb-2">
                    {getField('First Name', 'firstName')}
                  </div>
                  {/* <div style={{display: 'table',}} className="col-lg-3 col-md-6 mb-2">
                    {getField('Middle Name', 'middleName')}
                  </div> */}
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6 mb-2">
                    {getField('Last Name', 'lastName')}
                  </div>
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6">
                    {getField('Designation', 'designation', 'dropdown', 'designation')}
                  </div>
                  
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6 mb-2">
                    {getField('Date of Birth', 'dateOfBirth', 'date')}
                  </div>
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6">
                    {getField('Start Date', 'startDate', 'date')}
                  </div>
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6 mb-2">
                    {getField('Display Name', 'displayName', 'displayName')}
                  </div>
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6">
                    {getField('Login Id', 'login', 'login')}
                  </div>
                </div>
              </div>
            </div>
          </Collapse>
        </div>
        <div className="cym-admin-list-row-info user-cards-table">
          <div className="settings-table-card row" id="headingTwo">
            <div className="col-12" onClick={handleContactClick}>
              <div style={{ justifyContent: 'space-between', display: 'flex' }} className="row mb-3 mb-sm-3 mb-md-0 ">
                <h4 className="admin-row-heading mb-0 pl-3">Contact Info</h4>
                <div>
                  <img alt="Icon" src={ContactImage} />
                </div>
              </div>
            </div>
          </div>
          <Collapse in={(editable == true)?(contact && editable):(contact || editable)}>
            <div id="collapseTwo" className="collapse show mt-3" >
              <div className="user-table-card">
                <div className="row">
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6">
                    {getField('Country', 'country', 'dropdown', 'country')}
                  </div>
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6">
                    {getField('City', 'city')}
                  </div>
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6">
                    {getField('Landline', 'landline', 'number')}
                  </div>
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6">
                    {getField('Mobile', 'mobile', 'number')}
                  </div>
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6">
                    {getField('Address 1', 'address1')}
                  </div>
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6">
                    {getField('Address 2', 'address2')}
                  </div>
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6">
                    {getField('Country Code', 'countryCode')}
                  </div>
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6">
                    {getField('Email Id', 'email')}
                  </div>
                </div>
              </div>
            </div>
          </Collapse>
        </div>
        <div className="cym-admin-list-row-info user-cards-table">
          <div className="settings-table-card row" id="headingThree">
            <div className=" col-12 " onClick={handleDepartmentClick}>
              <div style={{ justifyContent: 'space-between', display: 'flex' }} className="row mb-3 mb-sm-3 mb-md-0 ">
                <h4 className="admin-row-heading mb-0 pl-3">Department/ Divison</h4>
                <div>
                  <img alt="Icon" src={DeptImage} />
                </div>
              </div>
            </div>
          </div>
          <Collapse in={(editable == true)?(department && editable):(department || editable)}>
            <div id="collapseThree" className="collapse show mt-3">
              <div className="user-table-card">
                <div className="row">
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6 mb-2">
                    {getField('Department', 'department', 'dropdown', 'department')}
                  </div>
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6 mb-2">
                    {getField('Manager', 'managerId', 'user')}
                  </div>
                  {/* <div style={{display: 'table',}} className="col-lg-3 col-md-6 mb-2">
                    {getField('Start Date', 'startDate', 'date')}
                  </div> */}
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6 mb-2">
                    {getField('End Date', 'endDate', 'date')}
                  </div>
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6 mb-2">
                    {getField('Employee ID', 'employeeId')}
                  </div>
                </div>
              </div>
            </div>
          </Collapse>
        </div>

        {
          !editable && data && data.attributes && data.attributes.length > 0 &&
        <div className="cym-admin-list-row-info user-cards-table">
          <div className="settings-table-card row" id="headingThree">
            <div className=" col-12 " onClick={handleCustomAttrClick}>
              <div style={{ justifyContent: 'space-between', display: 'flex' }} className="row mb-3 mb-sm-3 mb-md-0 ">
                <h4 className="admin-row-heading mb-0 pl-3">Custom Attributes</h4>
                <div>
                  <img alt="Icon" src={CustAttrImage} />
                </div>
              </div>
            </div>
          </div>
          <Collapse in={(editable == true)?(customAttr && editable):(customAttr || editable)}>
          {/* <Collapse in={(customAttr || editable)}> */}
            <div id="collapseThree" className="collapse show mt-3">
              <div className="user-table-card">
                  <CustomAttributeList attributes={data.attributes}/>
              </div>
            </div>
          </Collapse>
        </div>
        }

        <div className="cym-admin-list-row-info user-cards-table">
          <div className="settings-table-card row" id="headingFour">
            <div className=" col-12 " onClick={handleOtherClick}>
              <div style={{ justifyContent: 'space-between', display: 'flex' }} className="row mb-3 mb-sm-3 mb-md-0 ">
                <h4 className="admin-row-heading mb-0 pl-3">Others</h4>
                <div>
                  <img alt="Icon" src={OtherImg} />
                </div>
              </div>
            </div>
          </div>
          <Collapse in={(editable == true)?(other && editable):(other || editable)}>
            <div id="collapseFour" className="collapse show mt-3">
              <div className="user-table-card">
                <div className="row">
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6 mb-2">
                    {getField('Associated Partner', 'associatedPartner')}
                  </div>
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6 mb-2">
                    {getField('Created By', 'createdBy', 'createdBy')}
                  </div>
                  <div style={{display: 'table',}} className="col-lg-3 col-md-6 mb-2">
                    {getField('User Type', 'userType', 'dropdown', 'userType')}
                  </div>
                </div>
              </div>
            </div>
          </Collapse>
        </div>
        {
          editable && (
            <div className={classes.divtwo}>
              <Button
                disabled={Object.values(errors).some(e => e != null) || saving }
                variant="contained"
                color="primary" onClick={onClick}>{!saving ? 'Save' : 'Saving'}</Button>
            </div>
          )
        }
      </div>
    </div>
  );
}
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import LetterAvatar from '../../../../../components/LetterAvatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {isActiveForRoles} from '../../../../../utils/auth'
import '../../../../../FrontendDesigns/new/assets/css/main.css'
import '../../../../../FrontendDesigns/new/assets/css/users.css'
import ellipsis from 'text-ellipsis'
import Modal from '@material-ui/core/Modal';
import Dustbin from '../../../../../assets/Dustbin.png'
// import Dustbin from '../../../../../assets/'
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications'
import AppModal from '../../../../../components/AppModal'
import AssignUserApplicationView from '../../../../../components/AssignUserApplicationView'
import AssignGroupsUserView from '../../../../../components/AssignGroupsUserView'
import Delete from '../../../../../FrontendDesigns/new/assets/img/icons/Delete.svg'

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
    // maxWidth: 205,
    borderRadius: '10px'
  },
  avatar: {
    height: '90px',
    width: '90px',
    marginLeft: '17px',
    marginTop: '15px'
  },
  name: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '16px',
    textAlign: 'center',
    color: '#1F4287'
  },
  designation: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    textAlign: 'center',
    color: '#8392A7'
  },
  ephone: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '13px',
    lineHeight: '15px',
    color: '#171717',
    marginLeft: '5px',
  },
  boxextra: {
    // width: '185px',
  },
  base: {
    width: '22px',
    height: '24px'
  },
  settings: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '20px',
    color: '#8998AC;',
    marginLeft: '10px'
  },
  checkbox: {
    // position: 'absolute',
    width: '24px',
    height: '24px',
    // left: '14px',
    // top: '10px',
    // color: '#ECECEE'
  },
  flexdiv: { 
    display: 'flex' 
  },
  letteravatar: { 
    height: 75, 
    width: 75 
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
}));

export default function LogListCard(props) {
  const { user } = props
  const classes = useStyles();
  const history = useHistory()
  const [modalStyle] = React.useState(getModalStyle);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [open, setOpen] = React.useState(false);
  const [resetOpen, setResetOpen] = React.useState(false);
  const [appOpen, setAppOpen] = React.useState(false)
  const [groupOpen, setGroupOpen] = React.useState(false)
  const [type, setType] = React.useState();
  const [login, setLogin] = React.useState()

  const [userStatus, setUserStatus] = React.useState(user.status)
  const [resetPass, setResetPass] = React.useState()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModalOpen = (val) => {
    setOpen(true);
    setType(val)
  };
  const handleModalClose = () => {
    setOpen(false);
  };

  const handleAppModalOpen = () => setAppOpen(true)
  const handleAppModalClose = () => setAppOpen(false)
  const handleGroupModalOpen = () => setGroupOpen(true)
  const handleGroupModalClose = () => setGroupOpen(false)

  const handleResetModalOpen = () => {
    setResetOpen(true);
  };
  const handleResetModalClose = () => {
    setResetOpen(false);
  };

  const handleStatusClickChange = () => {
    callApi(`/usersrvc/api/user/changeStatus`, 'PUT', { "status": userStatus, "userId": user.id })
      .then(response => {if(response.success) {
        if(userStatus === 'DELETE'){
          handleModalClose()
          showSuccess("User Deleted Successfully")
          props.onUpdate()
        }else{
          showSuccess("Status Updated Successfully")
          handleModalClose()
          props.onUpdate()
        }
      }})
      .catch(error => {})
  }

  const resetPassword = () => {
    callApi(`/usersrvc/api/user/${user.id}`)
      .then(response => {
        setLogin(response.data.provisionedApps.CYMMETRI.login.login)
        onClickReset()
      })
      .catch(error => {})
  }

  const onClickReset = () => {
    callApi(`/authsrvc/auth/resetPassword`, 'POST', {"userName": login})
      .then(e => {
        if (e.success) {
          setResetPass(e.data ? e.data : "")
          handleModalClose()
          showSuccess("Password Generated Successfully")
          handleResetModalOpen()
        }
      })
      .catch(error => {})
  }

  return (
    <div className="user-table-card d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center my-2 text-center">
    {/* <div className="col-12 col-sm-12 col-md-12 col-lg-4">
    <div className="d-flex  flex-row align-items-center"> */}
      {/* <div className="custom-checkbox d-inline-block">
        <input type="checkbox" name={user.id} id={user.id} /> <label htmlFor={user.id} />
      </div> */}
      {/* <div className="d-flex flex-row align-items-center" onClick={props.onClick}>
        <div className="user-avatar"> */}
          {/* <img style={{ backgroundColor: '#ddd'}} alt="" title /> */}
          {/* <LetterAvatar text={`${user.firstName} ${user.lastName}`} status={user.status} variant="dot" style={{ height: 50, width: 50, marginLeft: 15 }}/> */}
          {/* {user.status === 'ACTIVATED' ? (<span className="online-status-badge avail" />) : (user.status === 'REGISTERED') ? (<span className="online-status-badge offline" />) : (<span className="online-status-badge away" />)} */}
        {/* <LetterAvatar text={`${user.firstName} ${user.lastName}`} status={user.status} variant="dot" /> */}
        {/* </div>
        <div className="user-card-detail pl-2">
          <h5>{user.firstName} {user.lastName}</h5>
          <span>{user.designation || "No Designation"}</span>
        </div>
      </div>
    </div>
  </div> */}
  <div className="col-12 col-sm-12 col-lg-3 col-md-12 mt-0 mt-sm-2" onClick={props.onClick}>
    <div className="user-contact">
      <a className="mail-to d-flex flex-row align-items-center">
        {/* <span className="icon-view" />  */}
        <span className="text-view">{user.description || "No Action"}</span></a>
    </div>
  </div>
  <div className="col-12 col-sm-12 col-lg-3 col-md-12 mt-0 mt-sm-2" onClick={props.onClick}>
    <div className="user-contact">
      <a className="mail-to d-flex flex-row align-items-center">
        {/* <span className="icon-view" />  */}
        <span className="text-view">{user.requestorId || "Null"}</span></a>
    </div>
  </div>
  <div className="col-12 col-sm-12 col-lg-3 col-md-12 mt-0 mt-sm-2" onClick={props.onClick}>
    <div className="user-contact">
      <a className="contact-info d-flex flex-row align-items-center mt-0">
        {/* <span className="icon-view" />  */}
        <span className="text-view">{user.sourceId || "Null"}</span></a>
    </div>
  </div>
  <div className="col-12 col-sm-12 col-lg-3 col-md-12 mt-0 mt-sm-2" onClick={props.onClick}>
    <div className="user-contact">
      <a className="contact-info d-flex flex-row align-items-center mt-0">
        {/* <span className="icon-view" /> */}
        <span className="text-view">{user.performedAt || "NA"}</span></a>
    </div>
  </div>
  {/* <div className="col-12 col-sm-12 col-lg-3 col-md-12 text-right mt-0 mt-sm-2"> */}
    {/* <div className="user-menu-view dropdown d-inline-block" onClick={handleClick} style={{ marginRight: 20 }}>
      <div className="d-flex flex-row dropdown-toggle" data-toggle="dropdown">
        <span />
        <span />
        <span />
      </div>
    </div> */}
    {/* edit and delete */}
    {/* {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN', 'HELP_DESK']) && (<a className="pl-2 pr-2 pt-2 pb-2" onClick={props.onClick}><img src="assets/img/icons/edit.svg" alt="" title style={{ marginRight: 20, cursor: 'pointer' }} /></a>)}
    {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && (<a className="pl-0 pr-2 pt-2 pb-2" onClick={() => {setUserStatus('DELETE'); handleModalOpen("changeStatus")}}><img src={Delete} alt="" title style={{ cursor: 'pointer' }} /></a>)} */}
    {/* edit and delete */}
    {/* <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={anchorEl}
      onClose={handleClose}
      className="nav nav-tabs" role="tablist">
      <MenuItem onClick={() => handleModalOpen("resetPassword")}>
        <div className={classes.flexdiv}>
          <span className={classes.settings}>Reset Password</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => {user.status === 'ACTIVE' ? setUserStatus('INACTIVE') : setUserStatus('ACTIVE') ;handleModalOpen("changeStatus")}}>
        <div className={classes.flexdiv}>
          <span className={classes.settings}> {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} </span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => handleGroupModalOpen()}>
        <div className={classes.flexdiv}>
          <span className={classes.settings}>Assign Group</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => handleAppModalOpen()}>
        <div className={classes.flexdiv}>
          <span className={classes.settings}>Assign Application</span>
        </div>
      </MenuItem>
    </Menu>

    <Modal open={open} onClose={handleModalClose}>
        <div>
          <div style={modalStyle} className={classes.paper}>
            <div style={{ display: 'block' }}>
              <img alt="Dustbin" src={Dustbin} style={{ margin: '25px 0 10px 0' }} />
              <div style={{ paddingBottom: '10px' }}><span className={classes.modalheader}> Are you sure you want to {type === 'changeStatus' ? (userStatus === 'ACTIVE' ? 'activate this user' : userStatus === 'INACTIVE' ? 'inactivate this user' : 'delete this user') : 'reset the password'} </span></div>
            </div>
            <div className={classes.content}>
              <div style={{ paddingTop: '10px' }}><span className={classes.modalcontent}>Warning! This cannot be undone. </span></div>
              <Button style={{ backgroundColor: '#C53230', borderRadius: '5px', margin: '10px' }}><span style={{ color: 'white' }} onClick={() => type === 'changeStatus' ? handleStatusClickChange() : resetPassword()}>Next</span></Button>
              <div style={{ padding: '0 0 20px 0' }}><Link onClick={handleModalClose} className={classes.modalcancel}>Cancel</Link></div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal open={resetOpen} onClose={handleResetModalClose}>
        <div>
          <div style={modalStyle} className={classes.paper}>
            <div style={{ display: 'block' }}>
              <div style={{ paddingBottom: '10px', paddingTop: 20 }}><span className={classes.modalheader}>Login Credentials</span></div>
              <div style={{ paddingTop: '10px' }}><span className={classes.modalcontent}>Login - {login}</span></div>
              <div><span className={classes.modalcontent}>Password - {resetPass} </span></div>
              <Button color="primary" variant="contained" style={{ margin: '10px' }} onClick={handleResetModalClose}>Continue</Button>
            </div>
          </div>
        </div>
      </Modal>
      <AppModal
        open={appOpen}
        onClose={handleAppModalClose} title="Assign an Application">
        <AssignUserApplicationView onUpdate={props.onUpdate} userId={user.id} />
      </AppModal>
      <AppModal
        open={groupOpen}
        onClose={handleGroupModalClose} title="Assign a Group">
        <AssignGroupsUserView userId={user.id} onAssign={props.onUpdate} />
      </AppModal>

  </div> */}
</div>
  );
}

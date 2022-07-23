import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import LetterAvatar from './LetterAvatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import { isActiveForRoles } from '../utils/auth'
import '../FrontendDesigns/new/assets/css/main.css'
import '../FrontendDesigns/new/assets/css/users.css'
import ellipsis from 'text-ellipsis'
import Modal from '@material-ui/core/Modal';
import Dustbin from '../assets/Dustbin.png'
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { callApi } from '../utils/api'
import { showSuccess } from '../utils/notifications'
import AppModal from './AppModal'
import AssignUserApplicationView from './AssignUserApplicationView'
import AssignGroupsUserView from './AssignGroupsUserView'

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

export default function UserGridCard(props) {
  const { user } = props
  const classes = useStyles();
  const history = useHistory()
  const [modalStyle] = React.useState(getModalStyle);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [saving, setSaving] = React.useState(false)

  const [open, setOpen] = React.useState(false);
  const [resetOpen, setResetOpen] = React.useState(false);
  const [appOpen, setAppOpen] = React.useState(false)
  const [groupOpen, setGroupOpen] = React.useState(false)
  const [type, setType] = React.useState();

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
    setSaving(true)
    callApi(`/usersrvc/api/user/changeStatus`, 'PUT', { "status": userStatus, "userId": user.id })
      .then(response => {
        setSaving(false)
        if (response.success) {
          if (userStatus === 'DELETE') {
            handleModalClose()
            showSuccess("User Deleted Successfully")
            props.onUpdate()
          } else {
            showSuccess("Status Updated Successfully")
            handleModalClose()
            props.onUpdate()
          }
        }
      })
      .catch(() => setSaving(false))
  }

  const resetPassword = () => {
    setSaving(true)
    callApi(`/authsrvc/auth/resetPassword`, 'POST', { "userName": user.login })
      .then(e => {
        setSaving(false)
        if (e.success) {
          setResetPass(e.data ? e.data : "")
          handleModalClose()
          showSuccess("Password Generated Successfully")
          handleResetModalOpen()
        }
      })
      .catch(() => setSaving(false))
  }

  return (
    <div className="col-12 col-sm-6 col-md-6 col-lg-3">
      <div className="user-card">
        {/* checkbox */}
        <div className="custom-checkbox">
          <input type="checkbox" name={user.id} id={user.id} /> <label htmlFor={user.id} />
        </div>
        {/* checkbox */}
        {/* User Menu */}
        {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'HELP_DESK']) &&
          <div className="user-menu-view dropdown">
            <div className="d-flex flex-row dropdown-toggle" data-toggle="dropdown" onClick={handleClick}>
              <span />
              <span />
              <span />
            </div>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={anchorEl}
              onClose={handleClose}
              className="nav nav-tabs" role="tablist">
              {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'HELP_DESK']) && <MenuItem onClick={() => handleModalOpen("resetPassword")}>
                <div className={classes.flexdiv}>
                  <span className={classes.settings}>Reset Password</span>
                </div>
              </MenuItem>}
              {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'HELP_DESK']) && <MenuItem onClick={() => { user.status === 'ACTIVE' ? setUserStatus('INACTIVE') : setUserStatus('ACTIVE'); handleModalOpen("changeStatus") }}>
                <div className={classes.flexdiv}>
                  <span className={classes.settings}> {user.status === 'ACTIVE' ? 'Mark Inactive' : 'Mark Active'} </span>
                </div>
              </MenuItem>}
              {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']) &&
                <MenuItem onClick={() => handleGroupModalOpen()}>
                  <div className={classes.flexdiv}>
                    <span className={classes.settings}>Assign Group</span>
                  </div>
                </MenuItem>}
              {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']) &&
                <MenuItem onClick={() => handleAppModalOpen()}>
                  <div className={classes.flexdiv}>
                    <span className={classes.settings}>Assign Application</span>
                  </div>
                </MenuItem>}
              {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']) &&
                <MenuItem
                  onClick={() => history.push({ pathname: `/dash/directory/user/${user.id}/info`, state: { edit: true } })}
                >
                  <div className={classes.flexdiv}>
                    <span className={classes.settings}>Edit Info</span>
                  </div>
                </MenuItem>}
              {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']) &&
                <MenuItem onClick={() => { setUserStatus('DELETE'); handleModalOpen("changeStatus") }}>
                  <div className={classes.flexdiv}>
                    <span className={classes.settings}> Delete User </span>
                  </div>
                </MenuItem>}
            </Menu>
          </div>}
        {/* User Menu */}
        <div className="text-center cym-user-avatar-view " onClick={props.onClick}>
          {/* <img className="avatar" style={{ backgroundColor: '#ddd'}} alt="" title /> */}
          <LetterAvatar text={`${user.firstName} ${user.lastName}`} profileImage={user.profilePic} status={user.status} className={classes.letteravatar} />
          {/* <LetterAvatar text={`${user.firstName} ${user.lastName}`} status={user.status} /> */}
          {/* {user.status === 'ACTIVATED' ? (<span className="online-status-badge avail" />) : (user.status === 'REGISTERED') ? (<span className="online-status-badge offline" />) : (<span className="online-status-badge away" />)} */}
        </div>
        <div className="user-per-detail pt-1 pb-1 text-center" onClick={props.onClick}>
          <h5>{user.firstName} {user.lastName}</h5>
          <span>{user.designation || "No Designation"}</span>
        </div>
        <div className="user-contact pt-1" onClick={props.onClick}>
          <a className="mail-to d-flex flex-row align-items-center"><span className="icon-view" /> <span className="text-view">{user.email || "No Email"}</span></a>
          <a className="contact-info d-flex flex-row align-items-center mt-1"><span className="icon-view" /> <span className="text-view">{user.mobile || "No Mobile"}</span></a>
        </div>
      </div>
      <Modal open={open} onClose={handleModalClose}>
        <div>
          <div style={modalStyle} className={classes.paper}>
            <div style={{ display: 'block' }}>
              <img alt="Dustbin" src={Dustbin} style={{ margin: '25px 0 10px 0' }} />
              <div style={{ paddingBottom: '10px' }}><span className={classes.modalheader}> Are you sure you want to {type === 'changeStatus' ? (userStatus === 'ACTIVE' ? 'activate this user' : userStatus === 'INACTIVE' ? 'inactivate this user' : 'delete this user') : 'reset the password'} </span></div>
            </div>
            <div className={classes.content}>
              <div style={{ paddingTop: '10px' }}><span className={classes.modalcontent}>{userStatus === 'DELETE' && "Warning! This cannot be undone. "}</span></div>
              <Button disabled={saving} variant="contained" color="primary" style={{ marginTop: 10, marginBottom: 10 }} onClick={() => type === 'changeStatus' ? handleStatusClickChange() : resetPassword()}>{!saving ? 'Next' : 'Saving'}</Button>
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
              <div style={{ paddingTop: '10px' }}><span className={classes.modalcontent}>Login - {user.login}</span></div>
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
    </div>
  );
}

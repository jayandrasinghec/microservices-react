import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Base from '../assets/Base.png';
import LetterAvatar from '../components/LetterAvatar';
import {isActiveForRoles} from '../utils/auth'
import { useHistory } from 'react-router-dom';

import '../FrontendDesigns/new/assets/css/main.css'
import '../FrontendDesigns/new/assets/css/users.css'
import Edit from '../FrontendDesigns/new/assets/img/icons/edit.svg'
import Delete from '../FrontendDesigns/new/assets/img/icons/Delete.svg'
import DeleteModal from '../components/DeleteModal';

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: '10px',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 0,
    display: 'flex'
  },
  avatar: {
    height: 40,
    width: 40,
    marginLeft: '10px',
    marginTop: '3px',
    marginBottom: '5px'
  },
  name: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '16px',
    textAlign: 'center',
    color: '#1F4287',
    paddingTop: '5px'
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
    lineHeight: 0,
    color: '#171717',
    marginLeft: '7px',
  },
  boxextra: {
    width: '185px',
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
    width: '24px',
    height: '24px'
  },
}));

export default function UserListCard(props) {
  const classes = useStyles();
  const history = useHistory()

  const [agree, setAgree] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleModalOpen = () => {
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChange = (event) => setAgree(event.target.checked);


  const { user } = props


  const deleteApp = () => {
    handleModalClose()
    alert("Delete Function API is not available yet.")
  }

  return (
    <div className="user-table-card d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center">
    <div className="col-12 col-sm-12 col-md-12 col-lg-4">
    <div className="d-flex  flex-row align-items-center">
      <div className="custom-checkbox d-inline-block">
        <input type="checkbox" name={user.id} id={user.id} /> <label htmlFor={user.id} />
      </div>
      <div className="d-flex flex-row align-items-center" onClick={props.onClick}>
        <div className="user-avatar">
          {/* <img style={{ backgroundColor: '#ddd'}} alt="" title /> */}
          <LetterAvatar text={`${user.firstName} ${user.lastName}`} status={user.status} variant="dot" style={{ height: 50, width: 50, marginLeft: 15 }}/>
          {/* {user.status === 'ACTIVATED' ? (<span className="online-status-badge avail" />) : (user.status === 'REGISTERED') ? (<span className="online-status-badge offline" />) : (<span className="online-status-badge away" />)} */}
        {/* <LetterAvatar text={`${user.firstName} ${user.lastName}`} status={user.status} variant="dot" /> */}
        </div>
        <div className="user-card-detail pl-2">
          <h5>{user.firstName} {user.lastName}</h5>
          <span>{user.designation || "No Designation"}</span>
        </div>
      </div>
    </div>
  </div>
  <div className="col-12 col-sm-12 col-lg-3 col-md-12 mt-0 mt-sm-2" onClick={props.onClick}>
    <div className="user-contact">
      <a className="mail-to d-flex flex-row align-items-center"><span className="icon-view" /> <span className="text-view">{user.email || "No Email"}</span></a>
    </div>
  </div>
  <div className="col-12 col-sm-12 col-lg-2 col-md-12 mt-0 mt-sm-2" onClick={props.onClick}>
    <div className="user-contact">
      <a className="contact-info d-flex flex-row align-items-center mt-0"><span className="icon-view" /> <span className="text-view">{user.mobile || "No Mobile"}</span></a>
    </div>
  </div>
  <div className="col-12 col-sm-12 col-lg-3 col-md-12 text-right mt-0 mt-sm-2">
    <div className="user-menu-view dropdown d-inline-block" onClick={handleClick} style={{ marginRight: 20 }}>
      <div className="d-flex flex-row dropdown-toggle" data-toggle="dropdown">
        <span />
        <span />
        <span />
      </div>
    </div>
    {/* edit and delete */}
    {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN', 'HELP_DESK']) && (<a className="pl-2 pr-2 pt-2 pb-2" onClick={props.onClick}><img src="assets/img/icons/edit.svg" alt="" title style={{ marginRight: 20, cursor: 'pointer' }} /></a>)}
    {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && (<a className="pl-0 pr-2 pt-2 pb-2" onClick={handleModalOpen}><img src={Delete} alt="" title style={{ cursor: 'pointer' }} /></a>)}
    {/* edit and delete */}
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={anchorEl}
      onClose={handleClose}
      className="nav nav-tabs" role="tablist">
        <MenuItem onClick={() => history.push(`/dash/directory/user/${user.id}/info`)}>
        <div className={classes.flexdiv}>
          <span className={classes.settings}>Edit User</span>
        </div>
      </MenuItem>
      <MenuItem onClick={() => history.push(`/dash/directory/user/${user.id}/groups`)}>
        <div className={classes.flexdiv}>
          <span className={classes.settings}>Assign Group</span>
        </div>
      </MenuItem>
        <MenuItem onClick={() => history.push(`/dash/directory/user/${user.id}/applications`)}>
        <div className={classes.flexdiv}>
          <span className={classes.settings}>Assign Application</span>
        </div>
      </MenuItem>
    </Menu>

    {open ? (<DeleteModal open={open} onClose={handleModalClose} name={user.firstName} onDelete={deleteApp} />) : (<></>)}
  </div>
</div>
  );
}
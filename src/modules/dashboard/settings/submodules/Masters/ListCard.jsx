import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CloseIcon from '@material-ui/icons/Close'
import { TablePagination } from '@material-ui/core'
import Dustbin from '../../../../../assets/Dustbin.png'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { IconButton } from '@material-ui/core';

import Delete from '../../../../../FrontendDesigns/new/assets/img/icons/Delete.svg'
import '../../../../../FrontendDesigns/master-screen-settings/assets/css/settings.css';
import '../../../../../FrontendDesigns/master-screen-settings/assets/css/nice-select.css';
import Plus from '../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/plus.svg';
import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications'
import AppCheckbox from '../../../../../components/form/AppCheckbox';
import AppTextInput from '../../../../../components/form/AppTextInput';

function getModalStyle() {
  const top = 20;
  const left = 35;

  return {
    top: `${top}%`,
    left: `${left}%`,
  };
}

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: '10px',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 0,
    display: 'flex'
  },
  avatar: {
    height: '50px',
    width: '50px',
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
  paper: {
    position: 'fixed',
    width: 500,
    backgroundColor: 'white',
    borderRadius: '20px',
    textAlign:'center',
    alignItems:'center',
    display:'block'
  },
  content: {
    width: 500,
    backgroundColor: '#E9EDF6',
    textAlign:'center',
    alignItems:'center',
    borderRadius:'0px 0px 20px 20px',
    display:'block'
  },
  modalheader:{
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '19px',
    lineHeight: '21px',
  },
  modalcontent:{
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '21px',
  },
  modalcancel:{
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '21px',
    color:'#363795',
  },
}));


export default function Zone(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const { u } = props

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModalOpen = () => {
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
  };

  const onDelete = () => {
    callApi(`/rulesrvc/zone/delete/${u.id}`, 'DELETE')
      .then(e => {
        if (e.success) {
          showSuccess('Deleted Successfully!')
          handleModalClose()
          props.onUpdate()
        }
      })
  }


  const body = (
    <div>
    <div style={modalStyle} className={classes.paper}>
      <div style={{display:'block'}}>
        <img alt="Dustbin" src={Dustbin} style={{margin:'25px 0 10px 0'}} />
        <div style={{paddingBottom:'10px'}}><span className={classes.modalheader}>Delete {u.name}</span></div>
      </div>
      <div className={classes.content}>
        <div style={{paddingTop:'10px'}}><span className={classes.modalcontent}>Warning! This cannot be undone. Lorem ipsum dolor sit</span></div>
        <div><span className={classes.modalcontent}>amet, consectur adipiscing elit, set do eusmud</span></div>
        <div><span className={classes.modalcontent}>tampor incident labour eu done dolore</span></div>
        <Button style={{backgroundColor:'#C53230',borderRadius:'5px',margin:'10px'}}><span style={{color:'white'}} onClick={onDelete}>Delete</span></Button>
        <div style={{padding:'0 0 20px 0', cursor: 'pointer'}}><Link onClick={handleModalClose} className={classes.modalcancel}>Cancel</Link></div>
      </div>
    </div>
  </div>
  );

  return (
    <div key className="settings-table-row d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center">
      <div className="col-12 col-sm-12 col-md-12 col-lg-4">
        <div className="d-flex flex-row align-items-center">
          {u.name}
        </div>
      </div>
      <div className="col-12 col-sm-12 col-md-12 col-lg-2">
        {u.gatewayIp}
      </div>
      {u.active ? (
        <div className="col-12 col-sm-12 col-md-12 col-lg-2">
          <span className="badge badge-pill badge-success">Active</span>
        </div>
        ) : (
          <div className="col-12 col-sm-12 col-md-12 col-lg-2">
            <span className="badge badge-pill badge-danger">Inactive</span>
          </div>
        )}
      <div className="col-12 col-sm-12 col-md-12 col-lg-2">
        Anje Keizer
      </div>
      <div className="col-12 col-sm-12 col-md-12 col-lg-2">
        <div onClick={handleClick} style={{ cursor: 'pointer' }}>
          <MoreHorizIcon fontSize="small" />
        </div>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={anchorEl}
          onClose={handleClose}
          className="nav nav-tabs" role="tablist">
          <MenuItem onClick={handleModalOpen}>
            <div style={{ display: 'flex' }}>
              <span style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '12px', lineHeight: '20px', color: '#8998AC;', marginLeft: '0px' }}>Delete</span>
            </div>
          </MenuItem>
        </Menu>
      </div>
      <Modal open={open} onClose={handleModalClose}>
        {body}
      </Modal>

    </div>
            
  )
}



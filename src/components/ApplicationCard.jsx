import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import Dustbin from '../assets/Dustbin.png'
import { callImageApi } from '../utils/api'
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import {isActiveForRoles} from '../utils/auth'
import { callApi } from '../utils/api'
import { showSuccess } from '../utils/notifications'

import '../FrontendDesigns/master-screen-settings/assets/css/profile.css'

function getModalStyle() {
  const top = 20;
  const left = 35;

  return {
    top: `${top}%`,
    left: `${left}%`,
  };
}

const useStyles = makeStyles(() => ({
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
    position: 'relative',
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
  img: {
    width: '45px',
    height: '45px'
  },
  main: {
    position: 'relative',
  },
  icon: {
    height: 20,
    width: 20,
    position: 'absolute',
    bottom: 10,
    right: 10,
    cursor: 'pointer'
  },
}));

export default function RecipeReviewCard(props) {
  const classes = useStyles();
  const [icon, setIcon] = React.useState([]);
  const [modalStyle] = React.useState(getModalStyle);
  const [saving, setSaving] = React.useState(false)
  const [open, setOpen] = React.useState(false);
  const { app } = props

  const handleModalOpen = () => {
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
  };

  const downloadIcon = () => { callImageApi(app.id).then(setIcon) }
  React.useEffect(() => downloadIcon(), [])

  // const appData={
  //   groupIds: [
  //     `${group.id}`
  //   ],
  //   appIds: [
  //     `${app.id}`
  //   ]
  // }

  const deleteApp = () => {
    // const body = {
    //   groupId: props.group.id,
    //   applicationId: app.id
    // }
    setSaving(true)
    callApi(`/provsrvc/applicationTenant/unAssignApplicationFromGroup`,'delete',{
      applicationId:app.id,
      groupId:props.group.id
    })
      .then(e => { setSaving(false) 
        if (e.success) {
        showSuccess('Application has been removed from the group')
        props.onUpdate()
        handleModalClose()
      } })
      .catch(() => setSaving(false))
    // alert(" Delete function is not available yet")
    // props.onUpdate()
    // handleModalClose()
  }


  const body = (
      <div style={modalStyle} className={classes.paper}>
        <div style={{ display: 'block' }}>
          <img alt="Dustbin" src={Dustbin} style={{ margin: '25px 0 10px 0' }} />
          <div style={{ paddingBottom: '10px' }}><span className={classes.modalheader}>Delete {app.appName}</span></div>
        </div>
        <div className={classes.content}>
          <div style={{ paddingTop: '10px' }}><span className={classes.modalcontent}>Warning! This cannot be undone.</span></div>
          {/* <div><span className={classes.modalcontent}>amet, consectur adipiscing elit, set do eusmud</span></div>
          <div><span className={classes.modalcontent}>tampor incident labour eu done dolore</span></div> */}
          <Button disabled={saving} onClick={deleteApp} variant="contained" style={{ margin: '10px' }} color="primary">{!saving ? 'Delete' : 'Deleting'}</Button>
          <div style={{ padding: '0 0 20px 0' }}><Link onClick={handleModalClose} className={classes.modalcancel}>Cancel</Link></div>
        </div>
      </div>
  );

  return (
    <div className="profile-sapplicaion-card rounded relative" style={{ position: 'relative' }}>
      <div className="row pr-2  flex-row  align-items-center">
        <div className="col-12 col-sm-12 col-md-4">
          <img src={icon} alt="" title="" className={classes.img} />
        </div>
        <div className="profile-app-name col-12 col-sm-12 col-md-8 text-center">
          {app.appName}
        </div>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && (
          <img src="assets/img/icons/delete.svg" className={classes.icon} onClick={handleModalOpen} alt="" title="" />
        )}
      </div>

      <Modal open={open} onClose={handleModalClose}>
        {body}
      </Modal>
    </div>
  );
}

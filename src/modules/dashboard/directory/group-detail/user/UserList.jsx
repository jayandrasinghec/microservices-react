import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link as Linking } from 'react-router-dom'
import Paper from '@material-ui/core/Paper';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import VisibilityIcon from '@material-ui/icons/Visibility'
import LetterAvatar from '../../../../../components/LetterAvatar';
import { IconButton } from '@material-ui/core';
// import DeleteIcon from '@material-ui/icons/Delete';
// import EditIcon from '@material-ui/icons/Edit';
import Dustbin from '../../../../../assets/Dustbin.png'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link';
import { callApi } from '../../../../../utils/api'
import Modal from '@material-ui/core/Modal';
import { showSuccess } from '../../../../../utils/notifications';
import { isActiveForRoles } from '../../../../../utils/auth'

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
    display: 'flex',
    flex: 1
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
    textAlign: 'left',
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
    height: '24px',
    marginTop: '8px'
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
  divone: {
    display: 'flex',
    width: 300,
    overflow: 'hidden'
  },
  divtwo: {
    display: 'block',
    lineHeight: '0.8px',
    marginTop: 5,
    alignItems: 'center',
    marginLeft: '10px'
  },
  divthree: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  divfour: {
    display: 'flex',
    alignItems: 'center',
    width: 200,
    overflow: 'hidden',
    marginRight: 15
  },
  icon: {
    color: '#fff',
    backgroundColor: '#8392A7',
    padding: 5,
    borderRadius: 15,
    height: 25,
    width: 25
  },
  divfive: {
    display: 'flex',
    alignItems: 'center',
    width: 200,
    overflow: 'hidden'
  },
  iconbuttonone: {
    height: 45,
    width: 45,
  },
  iconbuttontwo: {
    height: 45,
    width: 45,
    marginRight: 5
  },
  divsix: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
}));

export default function UserListCard(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false)

  const handleModalOpen = () => {
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
  };

  const { user, group } = props

  const groupData = {
    groupIds: [
      `${group.id}`
    ],
    userIds: [
      `${user.id}`
    ]
  }
  const deleteApp = () => {
    setSaving(true)
    callApi(`/usersrvc/api/group/unassign`, 'PUT', groupData)
      .then(e => {
        setSaving(false) 
        if (e.success) {
          showSuccess('User has been removed from the group')
          handleModalClose()
          props.onUpdate()
        }
      })
      .catch(() => setSaving(false))
  }
  const body = (
    <div>
      <div style={modalStyle} className={classes.paper}>
        <div style={{ display: 'block' }}>
          <img alt="Dustbin" src={Dustbin} style={{ margin: '25px 0 10px 0' }} />
          <div style={{ paddingBottom: '10px' }}><span className={classes.modalheader}>Delete {user.firstName}</span></div>
        </div>
        <div className={classes.content}>
          <div style={{ paddingTop: '10px' }}><span className={classes.modalcontent}>Warning! This cannot be undone.</span></div>
          {/* <div><span className={classes.modalcontent}>amet, consectur adipiscing elit, set do eusmud</span></div>
          <div><span className={classes.modalcontent}>tampor incident labour eu done dolore</span></div> */}
          <Button disabled={saving} onClick={deleteApp} variant="contained" style={{ margin: '10px' }} color="primary">{!saving ? 'Delete' : 'Deleting'}</Button>
          <div style={{ padding: '0 0 20px 0' }}><Link onClick={handleModalClose} className={classes.modalcancel}>Cancel</Link></div>
        </div>
      </div>
    </div>
  );
  return (
    <Paper variant="outlined" elevation={3} className={classes.root} >
      <div className="custom-checkbox d-inline-block" style={{ margin: '10px 0 10px 10px' }}>
        <input type="checkbox" name={user.id} id={user.id} /> <label htmlFor={user.id} />
      </div>
      <div className={classes.divone}>
        <LetterAvatar className={classes.avatar} text={`${user.firstName} ${user.lastName}`} profileImage={user.profilePic} status={user.status} variant="dot" />
        <div className={classes.divtwo}>
          <h4 className={classes.name}>{user.firstName} {user.lastName}</h4>
          <span className={classes.designation}>{user.designation || 'No Designation'}</span>
        </div>
      </div>

      <div className={classes.divthree}>
        <div className={classes.divfour}>
          <EmailIcon className={classes.icon} />
          <span className={classes.ephone}>{user.email || "No Email"}</span>
        </div>

        <div className={classes.divfive}>
          <PhoneIcon className={classes.icon} />
          <span className={classes.ephone}>{user.mobile || "No Mobile"}</span>
        </div>
      </div>



      {isActiveForRoles(['ORG_ADMIN', 'DOMIAN_ADMIN', 'READ_ONLY']) && (<div className={classes.divsix}>
        <Linking to={`/dash/directory/user/${user.id}`}>
          <IconButton className={classes.iconbuttonone}>
          {isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : <img src="assets/img/icons/edit.svg" alt="" title="" />}
          </IconButton>
        </Linking>
        <IconButton className={classes.iconbuttontwo} hidden={!isActiveForRoles(['ORG_ADMIN', 'DOMIAN_ADMIN'])} disabled={!isActiveForRoles(['ORG_ADMIN', 'DOMIAN_ADMIN'])} onClick={handleModalOpen}>
          <img src="assets/img/icons/delete.svg" alt="" title="" />
        </IconButton>
      </div>)}

      <Modal open={open} onClose={handleModalClose}>
        {body}
      </Modal>
    </Paper>
  );
}

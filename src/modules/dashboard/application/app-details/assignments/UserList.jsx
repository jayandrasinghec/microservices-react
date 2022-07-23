import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link as Linking } from 'react-router-dom'
import Paper from '@material-ui/core/Paper';
import VisibilityIcon from '@material-ui/icons/Visibility'
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';
import LetterAvatar from '../../../../../components/LetterAvatar';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Dustbin from '../../../../../assets/Dustbin.png'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link';
import { callApi } from '../../../../../utils/api'
import Modal from '@material-ui/core/Modal';
import { showSuccess } from '../../../../../utils/notifications';
import { isActiveForRoles } from '../../../../../utils/auth'
import DeleteModal from '../../../../../components/DeleteModal';
import Delete from '../../../../../FrontendDesigns/new/assets/img/icons/Delete.svg'

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

}));

export default function UserListCard(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false)

  const handleModalOpen = () => setOpen(true)
  const handleModalClose = () => setOpen(false);

  const { user, app } = props

  const userData = {
    applicationId: app.id,
    userId: user.id,
    roleIds: []
  }

  const deleteApp = () => {
    setSaving(true)
    callApi(`/usersrvc/api/user/unassignapplication`, 'PUT', userData)
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('User has been removed from the Application')
          props.onUpdate()
          handleModalClose()
        }
      })
      .catch(() => setSaving(false))
  }
const deleteDesc = ()=>{
      return (<>
            <div>Warning! This cannot be undone.</div>
            <div>The user will be removed after successful completion of workflow and/or all user entitlements are removed from backend.</div>
            </>)
}
  return (
    <Paper variant="outlined" elevation={3} className={classes.root} style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', width: 500, overflow: 'hidden' }}>
        <LetterAvatar className={classes.avatar} text={`${user.firstName} ${user.lastName}`} profileImage={user.profilePic} status={user.status} variant="dot" />
        <div style={{ display: 'block', lineHeight: '0.8px', marginTop: 6, marginLeft: 10 }}>
          <h4 className={classes.name}>{user.firstName} {user.lastName}</h4>
          <span className={classes.designation}>{user.designation || 'No Desgination'}</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY']) && (<Linking to={`/dash/directory/user/${user.id}`} style={{ marginRight: 15 }}>
        {isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : <img src="assets/img/icons/edit.svg" alt="" title="" />}
        </Linking>)}
        {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN']) && (<div style={{ marginRight: 15 }} onClick={handleModalOpen}>
          <img src={Delete} alt="" title="" style={{ cursor: 'pointer' }} />
        </div>)}
      </div>

      {open ? (<DeleteModal desc={deleteDesc()} saving={saving} open={open} onClose={handleModalClose} name={user.firstName} onDelete={deleteApp} />) : (<></>)}

    </Paper>
  );
}

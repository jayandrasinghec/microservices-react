import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link as Linking } from 'react-router-dom'
import Paper from '@material-ui/core/Paper';
import LetterAvatar from '../../../../../components/LetterAvatar';
import { Grid, IconButton, Switch } from '@material-ui/core';
import Dustbin from '../../../../../assets/Dustbin.png'
import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications';
import { isActiveForRoles } from '../../../../../utils/auth'
import ConfirmationModal from '../../../../../components/ConfirmationModal';

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
    paddingTop: '15px'
  },
  designation: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    textAlign: 'center',
    color: '#8392A7'
  },
  boxextra: {
    width: '185px',
  },
}));

export default function UserListCard(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { user, users, setUsers, index, onUpdate } = props

  const handleStatus = (status, id) => {
    callApi(`/authsrvc/delegateUser/${status ? 'activate' : 'deactivate'}/${id}`, 'PUT')
      .then(res => {
          if(res.success) {
            showSuccess("Status updated Successfully")
            onUpdate()
          }
      })
      // .catch(err => console.log(err))
}

  return (
    <Paper variant="outlined" elevation={3} className={classes.root} style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', width: 500, overflow: 'hidden' }}>
        <LetterAvatar className={classes.avatar} text={`${user.userName}`} profileImage={user.profilePic} status={user.userAccountStatus} variant="dot" />
        <div style={{ display: 'block', lineHeight: '0.8px', marginTop: 6, marginLeft: 10 }}>
          <h4 className={classes.name}>{user.userName}</h4>
          {/* <span className={classes.designation}>{user.designation || 'No Desgination'}</span> */}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        { user.userAccountStatus === 'ACTIVE' && isActiveForRoles(['ORG_ADMIN']) && (
          <div style={{ marginRight: 15 }}>
            <Switch
                name="status"
                color="primary"
                checked={user.active}
                onChange={(e) => setShowConfirmation(true)}
            />
          </div>
        )}
      </div>

      <ConfirmationModal 
        open={showConfirmation} 
        name={`${user.active ? 'Deactivate' : 'Activate'} delegation access`} 
        // content='Warning'
        onClose={() => {
          setShowConfirmation(false)
        }} 
        onConfirm={() => {
          handleStatus(!user.active, user.id)
        }}
      /> 
    </Paper>
  );
}

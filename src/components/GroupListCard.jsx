import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import DomainIcon from '@material-ui/icons/ViewQuilt';
import PersonIcon from '@material-ui/icons/Person';
// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';
// import Base from '../assets/Base.png';
import ellipsis from 'text-ellipsis'

import Modal from '@material-ui/core/Modal';
import Dustbin from '../assets/Dustbin.png'
import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
// import DeleteIcon from '@material-ui/icons/Delete';
// import EditIcon from '@material-ui/icons/Edit';
// import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import { callApi } from '../utils/api'
import { isActiveForRoles } from '../utils/auth'
import { showSuccess } from '../utils/notifications'


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
    borderRadius: '10px',
    marginLeft: 15,
    padding: '17px 13px',
    marginRight: 15,
    marginBottom: 12,
    display: 'flex'
  },
  name: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#1F4287',
  },
  designation: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: 1,
    display: 'block',
    maxHeight: 24,
    overflow: 'hidden',
    color: '#8392A7'
  },
  icon: {
    color: '#888',
  },
  ephone: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '13px',
    lineHeight: '15px',
    color: '#888',
    marginLeft: '7px',
    marginTop: '5px'
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
  }
}));

export default function RecipeReviewCard(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false)

  const handleModalOpen = (e) => {
    e.preventDefault()
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

  const { group } = props

  const deleteApp = () => {
    setSaving(true)
    callApi(`/usersrvc/api/group/${group.id}`, 'DELETE')
      .then(e => { setSaving(false) 
        if (e.success) { showSuccess('Group has been deleted!'); props.onUpdate(); handleModalClose() } })
      .catch(() => setSaving(false))
  }

  const body = (
    <div>
      <div style={modalStyle} className={classes.paper}>
        <div style={{ display: 'block' }}>
          <img alt="Dustbin" src={Dustbin} style={{ margin: '25px 0 10px 0' }} />
          <div style={{ paddingBottom: '10px' }}><span className={classes.modalheader}>Delete {group.name} Group</span></div>
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
    <Paper variant="outlined" elevation={3} className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={5} onClick={props.onClick}>
          <div className={classes.flexdiv}>
            <div className={classes.headdiv}>
              <h4 className={classes.name}> {group.name} </h4>
              <span className={classes.designation}> {group.description ? ellipsis(group.description, 50) : "No Description"} </span>
            </div>
          </div>
        </Grid>
        <Grid item xs={4} className={classes.griditemone} onClick={props.onClick}>
          <div className={classes.divone}>
            <PersonIcon className={classes.icon} />
            <span className={classes.ephone}> {group.numberOfUsers} </span>
          </div>
          <div className={classes.divone}>
            <DomainIcon className={classes.icon} />
            <span className={classes.ephone}> {group.numberOfApps} </span>
          </div>
        </Grid>
        <Grid item xs={3} className={classes.griditemtwo}>
          {/* <IconButton onClick={handleClick} className={classes.iconbuttonone}>
            <MoreHorizIcon fontSize="small" />
          </IconButton> */}

          {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']) && (<Link to={`/dash/directory/groups/${group.id}`}>
            <IconButton className={classes.iconbuttonone}>
              <img src="assets/img/icons/edit.svg" alt="" title="" />
            </IconButton>
          </Link>)}

          {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']) && (<IconButton className={classes.iconbuttontwo} onClick={handleModalOpen}>
            <img src="assets/img/icons/delete.svg" alt="" title="" />
          </IconButton>)}

          {/* <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={anchorEl}
            onClose={handleClose}
            className={classes.boxextra}>
            <MenuItem onClick={handleClose}>
              <div className={classes.divtwo}>
                <span className={classes.settings}>Reset Password</span>
              </div>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <div className={classes.divtwo}>
                <span className={classes.settings}>Deactivate</span>
              </div>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <div className={classes.divtwo}>
                <span className={classes.settings}>Enable MFA</span>
              </div>
            </MenuItem>
            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']) && (<MenuItem onClick={handleClose}>
              <div className={classes.divtwo}>
                <span className={classes.settings}>Delete User</span>
              </div>
            </MenuItem>)}
          </Menu> */}


          <Modal open={open} onClose={handleModalClose}>
            {body}
          </Modal>
        </Grid>
      </Grid>
    </Paper>
  );
}

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
// import Grid from '@material-ui/core/Grid'
// import DomainIcon from '@material-ui/icons/ViewQuilt';
// import PersonIcon from '@material-ui/icons/Person';
import VisibilityIcon from '@material-ui/icons/Visibility'
import ellipsis from 'text-ellipsis'
import Modal from '@material-ui/core/Modal';
import { Link } from 'react-router-dom';
// import { IconButton } from '@material-ui/core';
// import DeleteIcon from '@material-ui/icons/Delete';
// import EditIcon from '@material-ui/icons/Edit';
import Dustbin from '../../../../assets/Dustbin.png'
import { callApi } from '../../../../utils/api'
import { showSuccess } from '../../../../utils/notifications';
import { isActiveForRoles } from '../../../../utils/auth'

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
    color: '#8392A7',
    lineHeight: 1.5
  },
  ephone: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '13px',
    lineHeight: '15px',
    color: '#171717',
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
}));

export default function GroupCard(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false)

  const handleModalOpen = (e) => {
    e.preventDefault()
    setOpen(true)
  }
  const handleModalClose = () => {
    setOpen(false)
  }

  const { group, user } = props

  const groupData = {
    groupIds: [group.id],
    userIds: [user.id]
  }

  const deleteGroup = () => {
    setSaving(true)
    callApi(`/usersrvc/api/group/unassign`, 'PUT', groupData)
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('User has been removed from the group')
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
          <div style={{ paddingBottom: '10px' }}><span className={classes.modalheader}>Delete {group.name}</span></div>
        </div>
        <div className={classes.content}>
          <div style={{ paddingTop: '10px' }}><span className={classes.modalcontent}>Warning! This cannot be undone.</span></div>
          {/* <div><span className={classes.modalcontent}>amet, consectur adipiscing elit, set do eusmud</span></div>
          <div><span className={classes.modalcontent}>tampor incident labour eu done dolore</span></div> */}
          <Button disabled={saving}
              onClick={deleteGroup} variant="contained" style={{ margin: '10px' }}
              color="primary">
                {!saving ? 'Delete' : 'Deleting'}
            </Button>
          {/* <Button style={{ backgroundColor: '#C53230', borderRadius: '5px', margin: '10px' }}><span style={{ color: 'white' }} onClick={deleteGroup}>Delete</span></Button> */}
          <div style={{ padding: '0 0 20px 0' }}>
            <Link onClick={handleModalClose} className={classes.modalcancel}>Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ borderRadius: '8px', margin: 15 }}
      className="add-user-group-row align-items-center d-flex flex-column flex-sm-column flex-md-column flex-lg-row mt-3">
      <div className="user-group-lhs col-12 col-sm-12 col-md-8 col-lg-8 pl-0">
        <h5 className="">{group.name}</h5>
        <span className="sub-desc">{group.description ? ellipsis(group.description, 48) : "No Description"}</span>
        <div className="pt-2 mt-2 d-flex flex-row align-items-center">
          <span className="d-flex flex-row align-items-center"><img src="assets/img/icons/user-gray.svg" alt=""
            className="mr-2" /> {group.userCount}</span>
          <span className="d-flex flex-row align-items-center pl-5"><img src="assets/img/icons/user-assign.svg"
            alt="" className="mr-2" /> {group.appCount}</span>
        </div>
      </div>
      <div className="user-group-rhs col-12 col-sm-12 col-md-4 col-lg-4 pr-0">
        <div className="d-flex flex-column  justify-content-end text-right">
          <Link to={`/dash/directory/groups/${group.id}`} className="pb-5">
            {isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : <img src="assets/img/icons/edit.svg" alt="" title="" />}
          </Link>
          {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']) && (<div>
            <a onClick={handleModalOpen} className="save-btn">Remove from group</a>
          </div>)}
        </div>
      </div>

      <Modal open={open} onClose={handleModalClose}>
        {body}
      </Modal>
    </div>
  )

  // return (
  //   <Paper variant="outlined" elevation={3} className={classes.root}>
  //     <Grid container spacing={3}>
  //       <Grid item xs={5}>
  //         <div style={{ display: 'flex' }}>
  //           <div style={{ display: 'block', lineHeight: '0.8px', marginTop: '-10px', marginLeft: '10px', padding: '12px 0' }}>
  //             <h4 className={classes.name}> {group.name} </h4>
  //             <span className={classes.designation}> {ellipsis(group.description, 100)} </span>
  //           </div>
  //         </div>
  //       </Grid>
  //       <Grid item xs={4} style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
  //         <div style={{ display: 'flex', marginRight: '15px' }}>
  //           <PersonIcon style={{ color: '#8392A7' }} />
  //           <span className={classes.ephone}> {group.userCount} </span>
  //         </div>
  //         <div style={{ display: 'flex' }}>
  //           <DomainIcon style={{ color: '#8392A7' }} />
  //           <span className={classes.ephone}> {group.appCount} </span>
  //         </div>
  //       </Grid>

  //       <Grid item xs={3} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
  //         {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && (<div style={{ display: 'flex', marginRight: '15px' }}>
  //           <Link to={`/dash/directory/groups/${group.id}`}>
  //             <IconButton><EditIcon style={{ color: '#8392A7' }} /></IconButton>
  //           </Link>
  //         </div>)}
  //         {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && (<div style={{ display: 'flex' }}>
  //           <IconButton>
  //             <DeleteIcon style={{ color: '#8392A7' }} onClick={handleModalOpen} />
  //           </IconButton>
  //         </div>)}

  //       </Grid>
  //     </Grid>
  //   </Paper>
  // );
}

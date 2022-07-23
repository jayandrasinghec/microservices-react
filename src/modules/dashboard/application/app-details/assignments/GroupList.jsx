import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import DomainIcon from '@material-ui/icons/Domain';
import PersonIcon from '@material-ui/icons/Person';

import VisibilityIcon from '@material-ui/icons/Visibility'
import Modal from '@material-ui/core/Modal';
import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Dustbin from '../../../../../assets/Dustbin.png'
import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications';
import { isActiveForRoles } from '../../../../../utils/auth';
import ellipsis from 'text-ellipsis'

function getModalStyle() {
  const top = 28;
  const left = 35;

  return {
    top: `${top}%`,
    left: `${left}%`,
  };
}

const useStyles = makeStyles((theme) => ({
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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleModalOpen = (e) => {
    e.preventDefault()
    setOpen(true)
  }
  const handleModalClose = () => {
    setOpen(false)
  }

  const { group, app } = props

  return (
    <div
      className="add-user-group-row align-items-center d-flex flex-column flex-sm-column flex-md-column flex-lg-row mt-3">
      <div className="user-group-lhs col-12 col-sm-12 col-md-8 col-lg-8 pl-0">
        <h5 className="">{group.name}</h5>
        <span className="sub-desc">{group.description ? ellipsis(group.description, 35) : 'No Description'}</span>
        <div className="pt-2 mt-2 d-flex flex-row align-items-center">
          <span className="d-flex flex-row align-items-center"><img src="assets/img/icons/user-gray.svg" alt=""
            className="mr-2" /> {group.userCount || 0}</span>
          <span className="d-flex flex-row align-items-center pl-5"><img src="assets/img/icons/user-assign.svg"
            alt="" className="mr-2" /> {group.appCount || 0}</span>
        </div>
      </div>
      <div className="user-group-rhs col-12 col-sm-12 col-md-4 col-lg-4 pr-0">
        <div className="d-flex flex-column  justify-content-end text-right">
          {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY']) && (
            <Link to={`/dash/directory/groups/${group.id}`}  className="pb-5">
              {isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : <img src="assets/img/icons/edit.svg" alt="" title="" />}
            </Link>
          )}
          {/* <a href="javascript:void(0)" className="pb-5">
            <img src="assets/img/icons/edit.svg" alt="" title="" />
          </a> */}
          {/* <a href="javascript:void(0)" className="save-btn">Remove</a> */}
        </div>
      </div>
    </div>
  )
  // return (
  //   <Paper variant="outlined" elevation={3} className={classes.root}>
  //     <Grid container spacing={3}>
  //       <Grid item xs={8}>
  //         <div style={{ display: 'flex' }}>
  //           <div style={{ display: 'block', lineHeight: '0.8px', marginTop: '-10px', marginLeft: '10px', padding: '0px 0' }}>
  //             <h4 className={classes.name}> {group.name} </h4>
  //             <span className={classes.designation}> {group.description} </span>
  //           </div>
  //         </div>
  //       </Grid>
  //       <Grid item xs={2} style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
  //         <div style={{ display: 'flex', marginRight: '15px' }}>
  //           <PersonIcon style={{ color: '#8392A7' }} />
  //           <span className={classes.ephone}> {group.userCount} </span>
  //         </div>
  //       </Grid>

  //       <Grid item xs={2} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
  //         <div style={{ display: 'flex', marginRight: '15px' }}>
  //         {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','APP_ADMIN']) && (<Link to={`/dash/directory/groups/${group.id}`}>
  //             <IconButton><EditIcon style={{ color: '#8392A7' }} /></IconButton>
  //           </Link>)}
  //         </div>
  //       </Grid>
  //     </Grid>
  //   </Paper>
  // );
}

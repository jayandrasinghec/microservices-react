import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Dustbin from '../assets/Dustbin.png'
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';


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
    width: 500,
    backgroundColor: '#E9EDF6',
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: '0px 0px 20px 20px',
    display: 'block',
    padding: '24px'
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

export default function DeleteModal(props) {
  const classes = useStyles();
  const {desc} = props;
  const [modalStyle] = React.useState(getModalStyle);

  const body = (
    <div>
      <div style={modalStyle} className={classes.paper}>
        <div style={{ display: 'block' }}>
          <img alt="Dustbin" src={Dustbin} style={{ margin: '25px 0 10px 0' }} />
          <div style={{ paddingBottom: '10px' }}><span className={classes.modalheader}>Delete {props.name}</span></div>
        </div>
        <div className={classes.content}>
          <div style={{ paddingTop: '10px' }}><span className={classes.modalcontent}>{desc ? desc : `Warning! This cannot be undone.`} </span></div>
          <Button disabled={props.saving} onClick={props.onDelete} variant="contained" color="primary" style={{ marginTop: 10, marginBottom: 10 }} > {props.saving === false ? "Delete" : "Deleting"} </Button>
          <div style={{ padding: '0 0 20px 0' }}><Link onClick={props.onClose} className={classes.modalcancel}>Cancel</Link></div>
        </div>
        </div>
    </div>
  );
  
  return (
    <div>
      <Modal open={props.open} onClose={props.onClose}>
          {body}
      </Modal>
    </div>
  );
}
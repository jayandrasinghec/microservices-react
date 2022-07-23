import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import SlowMotionVideoTwoToneIcon from '@material-ui/icons/SlowMotionVideoTwoTone';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';


import '../../../../../FrontendDesigns/master-screen-settings/assets/css/profile.css'

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

export default function ConfirmationModal(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const body = (
    <div>
      <div style={modalStyle} className={classes.paper}>
        <div style={{ display: 'block' }}>
          <div style={{ margin: '25px 0 10px 0'}}>
            <SlowMotionVideoTwoToneIcon fontSize="large" style={{fontSize: '4rem' }} color='primary'/>
          </div>
          <div style={{ paddingBottom: '10px' }}><span className={classes.modalheader}>Run Deprovisioning</span></div>
        </div>
        <div className={classes.content}>
          <div style={{ paddingTop: '10px' }}><span className={classes.modalcontent}>Warning! This cannot be undone. </span></div>
          <Button disabled={props.saving} onClick={props.confirmDepro} variant="contained" color="primary" style={{ marginTop: 10, marginBottom: 10 }} >Confirm</Button>
          <div style={{ padding: '0 0 20px 0' }}><div style={{cursor:'pointer'}} onClick={props.onClose} className={classes.modalcancel}>Cancel</div></div>
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
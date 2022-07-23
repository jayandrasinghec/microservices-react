import React from 'react';
import { Button, Grid, Modal, makeStyles } from '@material-ui/core';
import { ReportProblemOutlined } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  paper: {
    position: 'fixed',
    width: 500,
    backgroundColor: 'white',
    borderRadius: '20px',
    textAlign: 'center',
    alignItems: 'center',
    display: 'block',
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%,-50%)'
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
    margin: '16px 0'
  },
  modalcontent: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '21px',
  },
}));

const EditWarningModal = ({ open, close, title, des, confirm }) => {

  const classes = useStyles();
  
  return(
    <Modal open={open} onClose={close}>
      <Grid container xs={6} alignContent='center' alignItems='center' className={classes.paper}>
        <Grid item xs={12}>
          <ReportProblemOutlined style={{ fontSize: '75px', color: '#FF9800', marginTop: '24px' }} />
          <p className={classes.modalheader}>{title}</p>
        </Grid>
        <Grid item xs={12} className={classes.content}>
          <p className={classes.modalcontent}>{des}</p>
          <Button style={{ marginTop: '16px', marginRight: 16 }} variant='contained' color='default' onClick={close}>Cancel</Button>
          <Button style={{ marginTop: '16px' }} variant='contained' color='primary' onClick={confirm}>Confirm</Button>
        </Grid>
      </Grid>
    </Modal>
  );
}

export default EditWarningModal;
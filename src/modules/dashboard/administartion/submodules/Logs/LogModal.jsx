import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import ReactJson from 'react-json-view'
import MaterialTable from 'material-table';
import { Grid } from '@material-ui/core';
import { getFormatedDate } from '../../../../../utils/helper';


function getModalStyle() {
  const top = 10 ;
  const left = 16;

  return {
    top: `${top}vh`,
    left: `${left}%`,
  };
}

const useStyles = makeStyles(() => ({
  paper: {
    position: 'fixed',
    width: '70%',
    backgroundColor: 'white',
    borderRadius: '10px',
    // textAlign: 'center',
    // alignItems: 'center',
    display: 'block',
    maxHeight: '80vh',
    overflowY: 'auto',
    padding: '10px'
  },
  closeicon: { 
    color: '#666', 
    float: 'right',
    marginTop: -30,
    marginRight: 10,
    cursor: 'pointer'
  },
  modalItemLabel: {
    fontWeight: 700, 
    marginRight: 10
  }
}))

const LogModal = (props) => {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles()
  const {open , handleModalClose, modalData, } = props
  const [modalVal, setModalVal] = React.useState(modalData)
  const [oldObjectData, setoldObjectData] = React.useState(false)
  const [newObjectData, setnewObjectData] = React.useState(false)
  const data = Object.keys(modalData)
  delete modalData['id']


  const columns = [
    { title: 'Info', field: 'description'},
    { title: 'Actor', field: 'requestorId' },
    { title: 'Target', field: 'sourceDisplayName' },
    { title: 'Time', field: 'performedAt', render: row =>  <span>{ getFormatedDate(row['performedAt'], 'DD/MM/YYYY HH:mm:ss') }</span>}
  ];

  return (  
    <>
      <Modal open={open} onClose={handleModalClose}>
        <div style={modalStyle} className={classes.paper}>
          <div>
            <h5 style={{ textAlign: 'center', marginTop: 10 }}>Complete Log</h5>
            <div style={{ display: 'flex',float: 'right' }}><CloseIcon onClick={handleModalClose} className={classes.closeicon} /></div>
          </div>
          <Grid item xs={12}>
            <MaterialTable
              title=""
              columns={columns}
              data={[modalData]}
              options={{
                rowStyle: {
                  backgroundColor: '#fff',
                },
                cellStyle: {
                  borderBottom: 'none',
                  width:20
                },
                headerStyle: {
                  backgroundColor: 'transparent',
                  borderBottom: 'none',
                  color: '#666667',
                },
                paging: false,
                draggable: true,
                actionsColumnIndex: -1,
                search:false,
                toolbar:false
              }}  
            />
          </Grid>
          <br/>
          <ReactJson
            name="auditLog"
            src={modalData}
            iconStyle="triangle"
            enableClipboard={false}
            displayDataTypes={false}
            displayObjectSize={false}
            collapsed={1}
          />
        </div>
      </Modal>  
    </>
  )
}

export default LogModal;
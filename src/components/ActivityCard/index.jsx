import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import { Grid } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ReactJson from 'react-json-view'
import MaterialTable from 'material-table';

// import request from './icon-request.png'
// import alert from './icon-alert.png'
// import reject from './icon-reject.png'
import update from './icon-update.png'
import app from './icon-app.png'
import approve from './icon-approve.png'
import group from './icon-group.png'
import remove from './icon-remove.png'
import { activityDate, activityTimeWithzTimeZone, getFormatedDate } from '../../utils/helper';

function getModalStyle() {
  const top = 10 ;
  const left = 16;

  return {
    top: `${top}vh`,
    left: `${left}%`,
  };
}

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: 5,
    marginLeft: 15,
    marginRight: 15,
    // marginBottom: 12,
    display: 'flex'
  },
  container: {
    width: '100%',
    padding: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  name: {
    flex: 1,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '16px',
    color: '#171717',
  },
  date: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    color: '#8392A7',
    marginRight: '20px'
  },
  img: { 
    width: '30px', 
    height: '30px', 
    margin: '10px', 
  },
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
}))


const getAppIconFromState = (type) => {
  switch (type) {
    case 'USER_CREATE': case 'GROUP_CREATE': return approve
    case 'ASSIGN_USER_APP': return app
    case 'ASSIGN_GROUP_USER': return group
    case 'USER_UPDATE': case 'GROUP_UPDATE': return update
    case 'UNASSIGN_APP':
    default:
      return remove
  }
}

export default function RecipeReviewCard(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const { data } = props
  const [open, setOpen] = React.useState(false);
  const handleModalOpen = () => {
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
  };
  // const date = new Date(data.performedAt).toDateString();
  // const time = new Date(data.performedAt).toTimeString().split("+")[0];
  const date = activityDate(data.performedAt);
  const time = activityTimeWithzTimeZone(data.performedAt);

  const log = [];
  for (const key in data) {
    const obj = data[key];
    log.push(obj);
  }

  const columns = [
    { title: 'Info', field: 'description', render: rowData => <span> {rowData.description || '--'} </span> },
    { title: 'Type', field: 'type', render: rowData => <span> {rowData.type || '--'} </span> },
    { title: 'Result', field: 'result', render: rowData => <span> {rowData.result || '--'} </span> },
    { title: 'Time', field: 'performedAt', render: row =>  <span>{ getFormatedDate(row['performedAt'], 'DD/MM/YYYY HH:mm:ss') }</span>}
  ];

  return (
    <div>
      <Paper 
        onClick={handleModalOpen} 
        variant="outlined" 
        elevation={3} 
        className={classes.root}
      >
        <div className={classes.container}>
          <img src={getAppIconFromState(data.action)} className={classes.img}></img>
          <span className={classes.name}>{data.description}</span>
          <span className={classes.date}>{date} at {time}</span>
        </div>
      </Paper>
      <Modal open={open} onClose={handleModalClose}>
        <div style={modalStyle} className={classes.paper}>
          <div>
            <h5 style={{ textAlign: 'center', marginTop: 10 }}>Complete Log</h5>
            <div style={{ display: 'flex',float: 'right' }}>
              <CloseIcon 
                onClick={handleModalClose} 
                className={classes.closeicon} 
              />
            </div>
          </div>
          <Grid item xs={12}>
            <MaterialTable
              title=""
              columns={columns}
              data={[data]}
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
            name="activityLog"
            src={data}
            iconStyle="triangle"
            enableClipboard={false}
            displayDataTypes={false}
            displayObjectSize={false}
            collapsed={1}
          />
        </div>
      </Modal>
    </div>
  );
}


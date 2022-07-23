import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import { callApi } from '../../../../../utils/api'
import ApplicationCard from '../../../../../components/ApplicationCard'
import ModalAssign from './ModalAssign'
import Modal from '@material-ui/core/Modal';
import EmptyScreen from '../../../../../components/EmptyScreen'
import { isActiveForRoles } from '../../../../../utils/auth'
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
  root: {
    flexGrow: 1,
    height: '1'
  },
  Nav: {
    display: 'flex',
    paddingBottom: '10px !important',
    // marginTop: '12px'
    // display: 'flex',
    alignItems: 'center',
    marginTop: '5px',
    justifyContent: 'flex-end',
    paddingRight: '20px'
  },
  link: {
    marginTop: '20px',
    marginLeft: '20px',

    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    color: '#1F4287',
    textDecorationLine: 'none',
    '&:hover': {

      fontWeight: 'bold',
      color: '#363795',
      textDecorationLine: 'none',
    }
  },
  clickedLink: {
    textDecorationLine: 'none',
    fontStyle: 'normal',
    marginTop: '10px',
    fontSize: 16,
    padding: '10px 0',
    color: 'black',
    fontWeight: 'bold',
    // color: '#363795',
    // marginTop: '20px',
    marginLeft: '20px',
    // fontSize: '18px',
  },
  bellicon: {
    marginTop: '0px',
    width: '19px',
    height: '24px'
  },
  small: {
    width: '25px',
    height: '26px',
    // marginTop: '5px',
    marginLeft: '10px'
  },
  search: {
    // marginLeft: '10px',
  },
  bulk: {

    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    color: '#FFFFFF',
  },
  name: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#1F4287',
  },
  designation: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    color: '#8392A7'
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
  paper: {
    position: 'fixed',
    width: 600,
    backgroundColor: 'white',
    borderRadius: '20px',
  },
  containerdiv: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px',
    backgroundColor: '#EEF1F8',
    flex: 1,
    borderRadius: '10px',
    height: '100%'
},
}))


export default function UserLayout(props) {
  const classes = useStyles()
  const [applications, setApplications] = React.useState([])
  const [data] = React.useState(props.group)
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleModalOpen = () => {
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
  };

  const Filterdata = [props.group.id]

  const downloadGroupsData = () => {
    callApi(`/provsrvc/applicationTenant/applicationByGroupList`, 'POST', Filterdata)
      .then(e => {
        if (e.success) {

          const apps = e.data.find(d => d.groupIdString === data.id)
          if (apps) setApplications(apps.applicationBriefs)
        }
      })
  }
  React.useEffect(() => downloadGroupsData(), [])

  const downloadData = () => {
    downloadGroupsData();
    props.onUpdate();
    // handleModalOpen()
  }

  const applicationItems = applications.map(u => (
    <Grid item xs={6} md={4}>
      <ApplicationCard app={u} history={props.history} group={data} onUpdate={downloadData} />
    </Grid>
  ))

  return (
    <div className={classes.root}>
      <div className={classes.containerdiv}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <div className={classes.clickedLink}>Applications</div>
          </Grid>
          <Grid item xs={6} className={classes.Nav}>

            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']) && (<Button onClick={handleModalOpen} variant="contained" color="primary" startIcon={<AddIcon />} >
              <span className={classes.bulk}>Assign Application</span>
            </Button>)}
          </Grid>
        </Grid>

        <div className="mt-3 container-fluid">
          <div>
            <Grid container spacing={3}>
              {applications.length === 0 ? <EmptyScreen /> : applicationItems}
            </Grid>
          </div>
        </div>

        <Modal open={open} onClose={handleModalClose}>
          <div style={modalStyle} className={classes.paper}>
            <ModalAssign groupid={props.group.id} assignedApplications={applications} onUpdate={downloadGroupsData}/>
          </div>
        </Modal>
      </div>
    </div>
  )
}
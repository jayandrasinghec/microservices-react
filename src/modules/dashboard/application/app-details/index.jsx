import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link as Linking } from 'react-router-dom'
import { Switch, Route, Redirect } from "react-router-dom"
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import ImageUploader from 'react-images-upload';
import { deepOrange } from '@material-ui/core/colors'
import { Button, CircularProgress, Modal } from '@material-ui/core'
import { callApi, callAppImageApi, callImageApi } from '../../../../utils/api'

import ComingSoon from '../../../../components/ComingSoon'
import Header from '../Header'
import Settings from './Settings'
import Provisioning from './Provisioning'
import SSO from './SSO'
import Assignment from './assignments'
import Workflow from './workflow'
import Mapping from './policymap'
import Roles from './roles'
import * as ProvSrvc from '../../../../api/provsrvc'
import AppTabView from '../../../../components/AppTabView'
import SAMLSettings from './SAMLSettings'
import AdvanceSettings from './advance-settings'
import PolicyAttribute from './PolicyAttribute'
// import CustomAttributes from './CustomAttributes'
import Reconciliation from './Reconcillation'
import { showSuccess } from '../../../../utils/notifications'
import Edit from '../../../../assets/edit.svg'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  layout: {
    // flexGrow: 1,
    backgroundColor: 'white',
    margin: '0 15px',
    borderRadius: 15
  },
  Nav: {
    display: 'flex',
    marginTop: '15px',
  },
  activeLink: {
    fontWeight: 'bold !important',
    borderBottom: '3px solid #1F4287',
    color: '#1F4287',
  },
  link: {
    paddingBottom: 5,
    marginTop: '10px',
    marginLeft: '30px',
    fontSize: 14,
    transition: 'all 0.1s ease',
    color: '#1F4287',
    textDecorationLine: 'none',
    '&:hover': {
      fontWeight: 'bold',
      color: '#363795'
    }
  },
  clickedLink: {
    textDecorationLine: 'underline',
    fontStyle: 'normal',
    fontWeight: 'bold',
    color: '#363795',
    marginTop: '12px',
    marginLeft: '30px',
    fontSize: '18px',
  },
  purple: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  image: {
    width: '80px',
    marginRight: '15px',
    height: '80px',
    marginTop: '20px',
    marginLeft: '30px'
  },
  item: {
    marginTop: '5px',
    marginLeft: '30px',
    marginRight: '30px'
  },
  itemGrid: {
    marginTop: '10px',
    marginLeft: '30px',
  },
  name: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 26,
    color: '#1F4287',
    lineHeight: '42px',
  },
  designation: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    color: '#8392A7',
    lineHeight: 1.5,
  },
  organisation: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    lineHeight: '21px',
    color: '#171717',
    textTransform: 'capitalize',
  },
  active: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '16px',
    textTransform: 'capitalize',
    color: '#45926A',
    marginTop: 5,
  },
  ephone: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    color: '#363795',
    marginLeft: '10px',
    marginTop: '3px'
  },
  cross: {
    width: '14px',
    height: '14px',
    color: '#5B5B5B',
    marginTop: '40px',
    marginLeft: '60px'
  },
  circularprog: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    display: 'flex',
    flexDirection: 'row'
  },
  containerone: {
    display: 'block',
    marginTop: '25px',
    marginLeft: '20px'
  },
  grditemone: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  iconbutton: {
    marginTop: 10,
    marginRight: 10
  },
  closeicon: {
    color: 'black'
  },
  logoDiv:{
    position: 'relative'
  },
  logoEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    cursor: 'pointer'
  }
}))



export default function UserLayout(props) {
  const classes = useStyles()
  const [app, setApp] = React.useState()
  const [icon, setIcon] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [pictures, setPictures] = React.useState([])
  const [disableUploadBtn, setDisableUploadBtn] = React.useState(true)

  const handleModalOpen = () => { setOpen(true); };
  const handleModalClose = () => { setOpen(false); };

  const fileUpload = () => {
    const key = `appImage:${app.id}`
    callAppImageApi(`/provsrvc/applicationTenant/addApp/icon?applicationId=${app.id}`, 'POST', pictures[0])
      .then(e => {
        if(e.success){
          showSuccess('Application Icon Updated Succesfully.')
          localStorage.removeItem(key)
          callImageApi(props.match.params.id).then(setIcon)
          handleModalClose()
          setPictures([])
          setDisableUploadBtn(true)
        }
      })
  };

  const downloadApp = () => {
    callApi(`/provsrvc/applicationTenant/getByAppId/${props.match.params.id}`)
      .then(response => setApp(response.data))
      .catch(error => {})

    callImageApi(props.match.params.id).then(setIcon)
  }
  React.useEffect(() => downloadApp(), [])

  const onDrop = (picture) => {
    if (picture.length > 0) {
      setPictures(picture)
      setDisableUploadBtn(false)
    } else {
      setPictures([])
      setDisableUploadBtn(true)
    }
}

  if (!app) return (
    <div className={classes.circularprog}>
      <CircularProgress color="secondary" />
    </div>
  )
  // const setSearchQuery = e => { setId({ ...filters, displayName: e }); setTimeout(downloadApps, 100) }

  const ModalBody = (
    <div className="" id="centralModalSm1" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document" style={{overflowy: 'initial !important'}}>
        <div className="modal-content p-2">
          <div className="modal-header pb-1">
            <h4 className="modal-title w-100" id="myModalLabel">Change Application Icon</h4>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true"><CloseIcon style={{ cursor: 'pointer' }} onClick={handleModalClose} /></span>
            </button>
          </div>
          <div className="modal-body p-0" style={{ height: '65vh', overflowY: 'auto' }}>
            <ImageUploader
              withIcon={true}
              withPreview={true}
              singleImage={true}
              buttonText='Choose image'
              onChange={onDrop}
              label="Max file size: 100KB, accepted: jpeg | jpg | png"
              imgExtension={['.jpeg', '.jpg', '.png']}
              maxFileSize={102400}
            />
          </div>
          <div className="modal-footer pt-1 p-2">
            <Button variant="contained" className='mr-2' color="primary" type="button" disabled={disableUploadBtn} onClick={fileUpload}> 
              Upload
            </Button>
            <Button variant="contained" color="primary" type="button" onClick={handleModalClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className={classes.root}>
      <Header profile={props.profile} />
      <div className={classes.layout}>
        <Grid container>
          <Grid item xs={11}>
            <div className={classes.container}>
              <div className={classes.logoDiv}>
                <span className={classes.logoEdit} onClick={handleModalOpen}><img src={Edit} alt="editIcon" /></span>
                <img src={icon} alt="applicationIcon"  className={classes.image} />
              </div>
              <div className={classes.containerone}>
                <div className={classes.name}>{app.settings.displayName || app.appType}</div>
                <div className={classes.designation}>{app.tagLine}</div>
              </div>
            </div>
            <Modal open={open} onClose={handleModalClose}>
                {ModalBody}
            </Modal>
          </Grid>
          <Grid item xs={1}>
            <div className={classes.grditemone}>
              <Linking to="/dash/apps/applications">
                <IconButton className={classes.iconbutton}><CloseIcon className={classes.closeicon} /></IconButton>
              </Linking>
            </div>
          </Grid>
          <Grid item xs={12} className={classes.Nav}>
            <AppTabView
              links={[
                {
                  roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY'],
                  href: `/dash/apps/applications/${app.id}/assignment`,
                  name: 'Assignments'
                }, {
                  roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY'],
                  href: `/dash/apps/applications/${app.id}/signon`,
                  name: 'Sign On'
                }, {
                  roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY'],
                  href: `/dash/apps/applications/${app.id}/provisioning`,
                  name: 'Provisioning'
                }, {
                  roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY'],
                  href: `/dash/apps/applications/${app.id}/roles`,
                  name: 'Roles'
                }, {
                  roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY'],
                  href: `/dash/apps/applications/${app.id}/workflow`,
                  name: 'Workflow'
                }, {
                  roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY'],
                  href: `/dash/apps/applications/${app.id}/mapping`,
                  name: 'Policy Map'
                }, {
                  roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY'],
                  href: `/dash/apps/applications/${app.id}/settings`,
                  name: 'Settings'
                }, {
                  roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY'],
                  href: `/dash/apps/applications/${app.id}/attribute`,
                  name: 'Policy Attribute'
                },
                // {
                //   roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY'],
                //   href: `/dash/apps/applications/${app.id}/customAttributes`,
                //   name: 'Custom Attributes'
                // }, 
                {
                  roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY'],
                  href: `/dash/apps/applications/${app.id}/reconciliation`,
                  name: 'Reconciliation'
                }
              ]}
            />
          </Grid>
        </Grid>
      </div>

      <Switch>
        {/* <Route exact={true} path="/dash/apps/applications/:id/assignment" component={p => <ProfileInfo {...p} user={user} />} /> */}
        <Route exact={true} path="/dash/apps/applications/:id/assignment" component={p => <Assignment {...p} app={app} />} />
        <Route exact={true} path="/dash/apps/applications/:id/signon" component={p => <SSO {...p} app={app} />} />
        <Route exact={true} path="/dash/apps/applications/:id/signon/settings" component={p => <SAMLSettings {...p} app={app} />} />
        <Route exact={true} path="/dash/apps/applications/:id/signon/advance-settings" component={p => <AdvanceSettings {...p} app={app} />} />
        <Route exact={true} path="/dash/apps/applications/:id/provisioning" component={p => <Provisioning {...p} app={app} />} />
        <Route exact={true} path="/dash/apps/applications/:id/roles" component={p => <Roles {...p} app={app} />} />
        <Route exact={true} path="/dash/apps/applications/:id/mapping" component={p => <Mapping {...p} app={app} />} />
        {/* <Route exact={true} path="/dash/apps/applications/:id/import" component={ComingSoon} /> */}
        <Route exact={true} path="/dash/apps/applications/:id/groups" component={ComingSoon} />
        <Route exact={true} path="/dash/apps/applications/:id/workflow" component={p => <Workflow {...p} app={app} />} />
        <Route exact={true} path="/dash/apps/applications/:id/settings" component={p => <Settings {...p} app={app} onUpdate={downloadApp} />} />
        <Route exact={true} path="/dash/apps/applications/:id/attribute" component={p => <PolicyAttribute {...p} app={app} />} />
        {/* <Route exact={true} path="/dash/apps/applications/:id/customAttributes" component={p => <CustomAttributes {...p} app={app} />} /> */}
        <Route path="/dash/apps/applications/:id/reconciliation" component={p => <Reconciliation {...p} app={app} />} />
        <Redirect to={`/dash/apps/applications/${app.id}/settings`} />
      </Switch>
    </div>
  )
}
import React from 'react';
import { callApi, callMasterImageApi } from '../../../../utils/api'
import { showSuccess } from '../../../../utils/notifications'
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
import checked from './checked.png'
import unchecked from './unchecked.png'
import { IconButton } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import * as ProvSrvc from '../../../../api/provsrvc'
import { makeStyles } from '@material-ui/core/styles';
import AppTextInput from '../../../../components/form/AppTextInput';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(() => ({
  card: {
    padding: 42,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflowY: 'auto',
    overflowX: 'hidden',
    borderRadius: '0',
    position: 'relative'
  },
  main: {
    width: '360px'
  },
  imgbox: {
    width: '120px',
    float: 'left'
  },
  imgicon: {
    width: '50%'
  },
  containerone:{
    width: '200px',
    float: 'left',
    margin: '0 20px 20px 0px'
  },
  label: {
    color: 'black',
    marginBlockStart: '0.5em',
    marginBlockEnd: '0.5em'
  },
  bold: {
    fontWeight: 'bolder',
    marginTop: '0px',
    fontSize: '25px'
  },
  headerfive: {
    color: 'black',
    marginBlockStart: '0.5em',
    marginBlockEnd: '0.5em'
  },
  toggledrawer: {
    width: '10px',
    fontSize: '20px',
    float: 'left',
    marginTop: '-3%'
  },
  closeicon: {
    color: '#666'
  },
  buttons: {
    width: '360px',
    fontSize: 'small',
    margin: '10px 0'
  },
  buttonone: {
    width: '100px',
    float: 'left',
    margin: '10px 20px 10px 0px',
    borderRadius: '15px',
    backgroundColor: 'white',
    padding: '5px 0'
  },
  overview: {
    width: '360px'
  },
  containertwo: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '360px'
  },
  containerthree: {
    display: 'flex',
    width: '30%',
    marginBottom: 15
  },
  checkbox: {
    width: 15,
    height: 15,
    color: 'rgb(153,204,102)',
    marginRight: '5px'
  },
  containerfour: {
    fontSize: '14px'
  },
  headerfour: {
    marginTop: '20px'
  },
  containerfive: {
    background: '#fff',
    borderRadius: 15,
    padding: '1rem',
    height: '100%',
    position: 'relative',
  },
  addbutton: {
    // backgroundColor: '#363793',
    // borderRadius: '10px',
    // borderColor: '#363793',
    // color: 'white',
    // textDecorationColor: 'white',
    // top: '93%',
    width: '300px',
    height: '50px',
    // left: '69%',
    marginTop: '30px',
    marginLeft: '30px',
    boxSizing: 'border-box'
  },
  containersix: {
    display: 'flex',
    width: '360px'
  },
  imgicontwo: {
    width: '20%',
    marginLeft: '20px'
  },
  iconbutton: {
    float: 'right',
    margin: '-15px -5px 0 0'
  },
  headerfourtwo: {
    color: '#4c659a',
    marginBlockStart: '0.5em',
    marginBlockEnd: '0.5em'
  },
  boldtwo: {
    fontWeight: 'bolder',
    fontSize: '18px',
    marginLeft: '20px'
  },
  headerfivetwo: {
    color: '#ccd2df',
    marginBlockStart: '0.5em',
    marginBlockEnd: '0.5em',
    fontSize: '14px',
    marginLeft: '20px'
  }

}))
export default function AppListCard(props) {
  const { app } = props
  const [data, setData] = React.useState([])
  const [icon, setIcon] = React.useState([])
  const [provisioning, setProv] = React.useState([])
  const [sso, setSSO] = React.useState([])
  const [drawer, setDrawer] = React.useState(false)
  const [appLabel, setAppLabel] = React.useState()
  const operations = [];
  const signOnMethods = [];
  const classes = useStyles()
  const [saving, setSaving] = React.useState(false)

  const downloadIcon = () => { callMasterImageApi(app.id).then(setIcon) }

  React.useEffect(() => { downloadIcon() }, [])

  const downloadData = () => {
    ProvSrvc.downloadData(app.id)
      .then(e => {
        if (e.success) {
          setData(e.data ? e.data : [])
          setAppLabel(e.data ? e.data.settings ? e.data.settings.displayName : '' : '')
          setProv(e.data ? e.data.provisioning : [])
          setSSO(e.data ? e.data.sso : [])
        }
      })
  }
  const toggleDrawer = () => {
    setDrawer(!drawer);
    downloadData();
  };

  const Checkbox = (props) => {
    if (props.checked) return <img src={checked} className={classes.checkbox} />
    return <img src={unchecked} className={classes.checkbox} />
  }

  if(provisioning){
    for (const key in provisioning.operations) {
      const obj = provisioning.operations[key];
      operations.push(obj);
    }
  }
  if(sso){
    for (const key in sso.signOnMethods) {
      const obj = sso.signOnMethods[key];
      signOnMethods.push(obj);
    }
  }

  const onClick = () => {
    const newApp = {
      appName: appLabel ? appLabel : app.appName,
      masterAppId: app.id,
    }
    setSaving(true)
    ProvSrvc.createApp(newApp)
      .then(e => {
        setSaving(false) 
        if (e.success) {
          showSuccess('Application Created Successfully!')
          // if(appLabel !== '' && appLabel !== e.data.settings.displayName){  
          //   let updatedData = data.settings
          //   updatedData['displayName'] = appLabel
          //   callApi(`/provsrvc/applicationTenant/updateSettings/${e.data.id}`, 'PUT', updatedData)
          //     .then(response => {
          //       showSuccess('Application Label Updated Successfully!')
          //     })
          //   // props.history.push(`/dash/applications/${e.data.id}/settings`)
          //   props.history.push(`/dash/apps/applications/${e.data.id}/settings`)
          // }else{
          //   // props.history.push(`/dash/applications/${e.data.id}/settings`)
          // }    
          props.history.push(`/dash/apps/applications/${e.data.id}/settings`)
        }
      })
      .catch(() => setSaving(false))
  }

  const list = () => (
    <div className="card card-1" className={classes.card}>
      <div className="main" className={classes.main}>
        <div className="imgbox" className={classes.imgbox}>
          <img src={icon} alt=" " className={classes.imgicon} />
        </div>
        <div className={classes.containerone}>
          <label className={classes.label}>
            <b className={classes.bold}> {data.appType} </b>
          </label>
          <h5 className={classes.headerfive}>
            {data.tagLine}
          </h5>
        </div>
        <div onClick={toggleDrawer} className={classes.toggledrawer}><CloseIcon className={classes.closeicon} /></div>
      </div>
      <div className="buttons" className={classes.buttons}>
        {(data.tag) ? ((data.tag).map((u, key) => {
          return (
            <button key={key} className="button1" className={classes.buttonone}> {u} </button>
          )
        })) : []}
      </div>
      <div className="overview" className={classes.overview}>
        <h4>Overview</h4>
        <p> {data.description}</p>
      </div>
      <div className="access">
        <h4>Access</h4>
        <div className={classes.containertwo}>
          {signOnMethods.map((u, key) => {
            return (
              <div key={key} className={classes.containerthree}><Checkbox name={u.label} className={classes.checkbox} checked={!u.value.status} /><div className={classes.containerfour}> {u.label} </div></div>
            )
          })}
        </div>
      </div>
      <div className="access">
        <h4 className={classes.headerfour}>Provisioning</h4>
        <div className={classes.containertwo}>
          {operations.map((u, key) => {
            return (
              <div key={key} className={classes.containerthree}><Checkbox name={u.label} className={classes.checkbox} checked={!u.value} /><div className={classes.containerfour}> {u.label} </div></div>
            )
          })}
        </div>
      </div>
      <div className="access">
        <div className={classes.appLabelName}>
          <AppTextInput
            className=""
            label={'Application Label'}
            value={appLabel}
            onChange={e => setAppLabel(e.target.value)}
          />
        </div>
      </div>
      <div className="access">
        <div className={classes.containersix}>
          {/* <button className="button1" onClick={onClick} className={classes.addbutton}>+ Add Application</button> */}
          <Button disabled={saving} className={classes.addbutton} onClick={onClick} variant="contained" color="primary">{!saving ? '+ Add Application' : 'Adding...'}</Button>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div className={classes.containerfive} onClick={toggleDrawer}>
        <img src={icon} alt=" " className={classes.imgicontwo} />
        <IconButton className={classes.iconbutton} onClick={toggleDrawer} >
          <MoreHorizIcon />
        </IconButton>
        <h4 className={classes.headerfourtwo}>
          <b className={classes.boldtwo}> {app.appName} </b>
        </h4>
        <h5 className={classes.headerfivetwo}>
          {app.tagLine}
        </h5>
      </div>

      <Drawer anchor="right" open={drawer} onClose={toggleDrawer}>
        {list()}
      </Drawer>
    </div>
  );
}

import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import { callApi } from '../../../../../utils/api'
import PolicyItem, { customAttrReqData } from './PolicyItem';
import { makeStyles } from '@material-ui/core/styles';
import {isActiveForRoles} from '../../../../../utils/auth'
import AddButton from './dropdownSelect';

const useStyles = makeStyles((theme) => ({
  container: { 
  display: 'flex', 
  flex: 1, 
  flexDirection: 'column', 
  width: '100%', 
  overflow: 'hidden' 
},
gridcontainer: { 
  overflowY: 'auto',
  overflowX: 'hidden', 
  marginBottom: 15, 
  marginTop: 15, 
  width: '100%' 
},
griditemone: { 
  paddingTop: 0, 
  marginLeft: '30px', 
  backgroundColor: '#EEF1F8', 
  borderRadius: '10px' 
},
button: { 
  borderRadius: '8px' 
},
}))


export default function UserLayout(props) {
  const [data1, setData1] = React.useState([])
  const [data2, setData2] = React.useState([])
  const [data3, setData3] = React.useState([])
  const [mappings, setMappings] = React.useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isCustomField,setIsCustomField] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    if(selectedIndex){
      setIsCustomField(true);
      setMappings([...mappings, {
        isCustom:true,
        external: "",
        internal: "",
        mandatory: false,
        object_type: "USER",
        script: "",
        tenant_applicationId: props.app.id,
      }]);
    }else{
      setIsCustomField(false);
      setMappings([...mappings, null]);
    }
  };

 
  const classes = useStyles()
  const downloadData = () => {
    callApi(`/provsrvc/policyMapTenant/findByTypeAndAppId?objectType=USER&appId=${props.app.id}`)
      .then(response => {
        setMappings([])
        setMappings([...response.data])
      })
      .catch(error => {})
  }

  const downloadMasters = () => {
    // callApi(`/provsrvc/policyAttribute/findAllByAppId/${props.app.appid}`)
    callApi(`/provsrvc/policyAttributeTenant/findAllByAppId/${props.app.id}`)
      .then(response => setData1(response.data))
      .catch(error => {})

    // callApi(`/provsrvc/policyAttribute/findAllByAppId/internal`)
    callApi(`/provsrvc/policyAttributeMaster/findAllByAppId/internal`)
      .then(response => setData2(response.data))
      .catch(error => {})

    // callApi(`/utilsrvc/meta/list/CustomAttribute`,'post',customAttrReqData)
    callApi(`/utilsrvc/meta/list/CustomAttribute`)
    .then(e => {
      if (e.success) {
        // setData3(e.data.content)
        setData3(e.data)
      }
    })
    .catch(error => {})
  }


  React.useEffect(() => {
    downloadData()
    downloadMasters()
  }, [])




  let items = [];
  for (var i = 0; i < mappings.length; i++) {
    items.push(<PolicyItem key={i} app={props.app} item={mappings[i]} data1={data1} data2={data2} />)
  }

  return (
    <div className={classes.container}>
      <Grid container spacing={3} className={classes.gridcontainer}>
        <Grid item xs={12} className={classes.griditemone}>
          {/* <div style={{ padding: '10px', textAlign: 'right' }}>
            <Button onClick={onAdd} variant="contained" style={{ borderRadius: '8px' }} color="primary">+ Add</Button>
          </div> */}
          <div className="d-flex p-2 mb-3 flex-row align-items-center justify-content-between">
            <div>Policy Mapping</div>
            {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','APP_ADMIN']) && <AddButton open={open} setOpen={setOpen} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} handleClick={handleClick} />}
          </div>

          <div>
            {mappings.map((m, i) => <PolicyItem key={i} onDelete={downloadData} app={props.app} item={m} data1={data1} data2={data2} isCustomField={isCustomField} index={i} data3={data3} />)}
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

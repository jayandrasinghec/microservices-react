import React from 'react';
import { Button, Grid} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import AttributeItem from './AttributeItem';
import { callApi } from '../../../../../utils/api'
import { isActiveForRoles } from '../../../../../utils/auth';

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
  borderRadius: '8px',
  marginLeft: 'auto' 
},
}))

const AdvanceSettings = (props) => {
  const [mappings, setMappings] = React.useState([])
  const [max, setMax] = React.useState(0)
  const [id , setId] = React.useState(null)
  const classes = useStyles()

  const downloadData = () => {
    // callApi(`/samlsrvc/api/getSamlAttrById/${props.app.id}`)
    callApi(`/sso-config/saml/attributeMapper/${props.app.id}`)
      .then(response => {
        setMappings([])
        setMappings([...response.data.samlAttribute])
        setMax(response.data.maxindex)
        setId(response.data.id)
      })
      .catch(error => {})
  }

  React.useEffect(() => {
    downloadData()
  }, [])

  const onAdd = () => {
    setMappings([...mappings, null])
    setMax(max+1)
  }

  const updateMappings = (mapping, max) => {
    setMappings([])
    setMappings([...mapping])
    setMax(max)
  }

  let items = [];
  for (var i = 0; i < mappings.length; i++) {
    items.push(<AttributeItem key={i} app={props.app} item={mappings[i]} />)
  }
  return (
    <>
      <div className={classes.container}>
      <Grid container spacing={3} className={classes.gridcontainer}>
        <Grid item xs={12} className={classes.griditemone}>
          {/* <div style={{ padding: '10px', textAlign: 'right' }}>
            <Button onClick={onAdd} variant="contained" style={{ borderRadius: '8px' }} color="primary">+ Add</Button>
          </div> */}
          { isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && <div className="d-flex mb-3 flex-row align-items-center justify-content-between">
            {/* <div><h5>Advance Settings</h5></div> */}
            <Button onClick={onAdd} variant="contained" className={classes.button} color="primary">+ Add</Button>
          </div> }
          {
            mappings.length === 0 ?
            <p className="text-center">No attributes found. To map attributes please click on Add button.</p> : null
          }

          <div>
            {mappings.map((m, i) => 
              <AttributeItem 
                key={i} 
                index={i} 
                id={id} 
                downloadData={downloadData}
                updateMappings={updateMappings}
                max={max}
                app={props.app}
                item={m} 
              />
            )}
          </div>
        </Grid>
      </Grid>
    </div>
    </>
  )
}

export default AdvanceSettings;
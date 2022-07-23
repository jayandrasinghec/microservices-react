import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import { callApi } from '../../../../../utils/api'
import PolicyItem from './PolicyItem';
import { makeStyles } from '@material-ui/core/styles';
import {isActiveForRoles} from '../../../../../utils/auth'

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


export default function PolicyAttribute(props) {
    
    const [attributes, setAttributes] = React.useState([])
    const classes = useStyles()

    const downloadAttributes = () => {
        callApi(`/provsrvc/policyAttributeTenant/findAllByAppId/${props.app.id}`)
          .then(response => setAttributes(response.data))
          .catch(error => {})
    }

    const onAdd = () => {
        setAttributes([...attributes, null])
      }
    

    React.useEffect(() => {
        downloadAttributes()
    }, [])

    return (
        <div className={classes.container}>
            <Grid container spacing={3} className={classes.gridcontainer}>
                <Grid item xs={12} className={classes.griditemone}>
                    <div className="d-flex p-2 mb-3 flex-row align-items-center justify-content-between">
                    <div>Policy Attribute</div>
                    {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','APP_ADMIN']) && <Button onClick={onAdd} variant="contained" className={classes.button} color="primary">+ Add</Button>}
                    </div>
        
                    <div>
                    {attributes.map((m, i) => 
                        <PolicyItem
                            key={i}
                            downloadAttributes={downloadAttributes}
                            app={props.app}
                            item={m}
                        />)}
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

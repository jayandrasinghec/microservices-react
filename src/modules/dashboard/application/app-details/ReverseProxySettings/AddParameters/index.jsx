import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { AddParametersItem } from './AddParametersItem';
import { makeStyles } from '@material-ui/core/styles';
import {isActiveForRoles} from '../../../../../../utils/auth';

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
  heading: {
    fontWeight: 'bold'
  }
}))


export const AddParameters = (props) => {
  const { config, setConfig } = props;
  const { parameters } = config;
  const classes = useStyles();
  
  const [mappings, setMappings] = React.useState(parameters);

  useEffect(() => {
    setMappings(parameters)
  }, [parameters])

  const onAdd = () => {
    setMappings([...mappings, null])
  }

  let items = [];
  for (var i = 0; i < mappings.length; i++) {
    items.push(<AddParametersItem key={i} item={mappings[i]} />)
  }

  return (
    <>
      <div className={classes.container}>
      <Grid container spacing={3} className={classes.gridcontainer}>
        <Grid item xs={12} className={classes.griditemone}>
          <div className="d-flex mb-3 flex-row align-items-center justify-content-between">
            <span className={classes.heading}>Parameters</span> 
            { isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) &&  <Button onClick={onAdd} variant="contained" className={classes.button} color="primary">+ Add</Button> }
          </div>
          {
            mappings.length === 0 ?
            <p className="text-center">No parameter found. To add parameter please click on Add button.</p> : null
          }

          <div>
            {mappings.map((m, i) => 
              <AddParametersItem 
                key={i} 
                index={i} 
                setConfig={setConfig}
                config={config}
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
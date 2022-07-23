import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import WorkflowItem from './WorkflowItem'
import { callApi } from '../../../../../utils/api'
import EmptyScreen from '../../../../../components/EmptyScreen'


const useStyles = makeStyles(() => ({
  grid: {
    marginTop: 10
  },
  mainDiv: {
    // overflowY: 'auto',
    flex: 1,
    // width: '100%',
    // margin: '30px 15px',
  }
}))


export default function Workflow(props) {
  const classes = useStyles();
  const [data, setData] = React.useState([])

  const appId = props.match.params.id
  const query = {
    direction: "ASC",
    pageNumber: 0,
    pageSize: 10,
    sort: "WORKFLOW_NAME"
  }
  const [workFlow,_setWorkFlow] = React.useState(0);
  React.useEffect(() => {
    getList();
  }, [workFlow])
  const getList = () => {
    callApi(`/workflowsrvc/api/workflow/list`, 'POST', query)
      // .then(e => { if (e.success) setData(e.data && e.data.elements ? e.data.elements : []) })
      .then(e => { if (e.success) {
        if(e.data && e.data.elements) {
         setData(e.data.elements.sort((a,b) => a.name < b.name ? 1 : -1))
        }
      }})
  }
  return (
    <div className={classes.mainDiv}>
      <Grid container spacing={3}>
        {
          data.filter(d => d.name.indexOf('Application') == 0 && d.enabled && d.global).length === 0 ?
            (
              <div style={{ margin: 'auto', marginTop: '20%' }}>
                <EmptyScreen />
              </div>
            ) :
            data
              .filter(d => d.name.indexOf('Application') == 0 && d.enabled && d.global)
              .map(d => (
                <Grid item xs={12} md={6} key={d.id} className={classes.grid}>
                  <WorkflowItem title={d.name} workflowId={d.id} appId={appId} onSave={()=> getList()}/>
                </Grid>
              ))
        }
      </Grid>
    </div>
  )
}
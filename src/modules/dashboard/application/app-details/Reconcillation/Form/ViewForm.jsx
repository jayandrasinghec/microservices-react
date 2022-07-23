/* eslint-disable react/display-name */
import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import AppTextInput from '../../../../../../components/form/AppTextInput';
import AppCheckbox from '../../../../../../components/form/AppCheckbox';
import AppUserInput from '../../../../../../components/form/AppUserInput';
import AppGroupInput from '../../../../../../components/form/AppGroupInput';
import { makeStyles } from '@material-ui/core/styles';
import { callApi } from '../../../../../../utils/api'
import { isActiveForRoles } from '../../../../../../utils/auth';

const useStyles = makeStyles(() => ({
  container: {
    
  },
  divone: {
    marginRight: 20,
    marginLeft: 10,
    borderRadius: '10px',
    flex: 1,
    overflowY: 'auto'
  },
  paperone: {
    padding: 25,
    marginBottom: 20,
    marginTop: 20,
    border: 'none',
    boxShadow: 'none'
  },
  papertwo: {
    padding: 25,
    marginBottom: 20,
    marginTop: 20,
    border: 'none',
    boxShadow: 'none'
  },
  flexdiv: {
    display: 'flex'
  },
  button: {
    float: 'right',
    borderRadius: '8px',
    marginRight: 20
  },
}))

export default function AuthPolicyForm(props) {
  const { newMaster, setTable, runNow, run, action  } = props
  const classes = useStyles()
  const [rules, setRules] = React.useState([])

  const downloadData = () => {
    callApi(`/provsrvc/reconOperation/getReconciliationRules/${props.type}`)
      .then(e => {
        if (e.success) {
          setRules(e.data ? e.data : [])
        } 
      })
  }
  React.useEffect(() => downloadData(), [])

  const showValue = {
    TARGET_EXTSTS_IDM_EXISTS: 'User exists in Cymmetri & Target System',
    TARGET_EXTSTS_IDM_NOT_EXISTS: 'User exists in Target System & does not exist in Cymmetri',
    TARGET_DELETED_IDM_EXISTS: 'User does not exist in Target System & exists in Cymmetri',
    IDM_EXTSTS_TARGET_EXISTS: 'User exists in Cymmetri & Target System',
    IDM_EXTSTS_TARGET_NOT_EXISTS: 'User does not exist in Target System & exists in Cymmetri',
    IDM_DELETED_TARGET_EXISTS: 'User exists in Target System & does not exist in Cymmetri'
  }

  return (
    <div className={classes.container}>
      <div className={classes.divone}>
        <Paper variant="outlined" elevation={3} className={classes.paperone} >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <AppTextInput label="Name"
                value={newMaster.name || '--'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppTextInput label="Modes"
                value={newMaster.reconMode || '--'}
              />
            </Grid>
            {/* <Grid item xs={12} md={4}>
              <AppTextInput label="Frequency"
                value={newMaster.frequency || '--'}
              />
            </Grid> */}
            <Grid item xs={6} md={4}>
              <AppTextInput label="Sync Field"
                value={newMaster.idmRepositoryField || '--'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppTextInput label="Source Attributes"
                value={newMaster.sourceAttributeName || '--'}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <AppTextInput label="Status"
                value={newMaster.status || '--'}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <AppTextInput label="Type"
                value={newMaster.type || '--'}
              />
            </Grid>
          </Grid>
        </Paper>


        <Paper variant="outlined" elevation={3} className={classes.paperone} >
          <Grid container spacing={3}>
            <Grid item xs={10}>
              <div className='mt-2'>
                Scheduler
              </div>
            </Grid>
            <Grid item xs={2}>
              <AppCheckbox label="" 
                value={newMaster.scheduler.markActive}
                disabled
              />
            </Grid>
            {
              newMaster.scheduler.markActive && 
              <>
              <Grid item xs={12} md={6}>
                <AppTextInput 
                  label="Start Date"
                  type="datetime-local"
                  value={newMaster.scheduler.start}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <AppTextInput label="Cron Expression"
                  value={newMaster.scheduler.cronExpression}
                />
              </Grid>
              </>
            }   
          </Grid>
        </Paper>

        <Paper variant="outlined" elevation={3} className={classes.paperone} >
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <AppTextInput label="Search Query Filter" placeholder="enter filter criteria"
                value={newMaster.targetSystemSearchQueryFilter || '--'}
              />
            </Grid>
          </Grid>
        </Paper>

        {props.type === 'PUSH' ? (<>
        <div>Search & Add Filter Criteria</div>
        <Paper variant="outlined" elevation={3} className={classes.paperone} >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <AppTextInput label="Department" 
                value={newMaster.idmSearchQueryFilter.department || '--'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppTextInput label="Designation" 
                value={newMaster.idmSearchQueryFilter.designation || '--'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppTextInput label="User Type" 
                value={newMaster.idmSearchQueryFilter.userType || '--'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppTextInput label="Location" 
                value={newMaster.idmSearchQueryFilter.location || '--'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppUserInput label="Reporting Manager" 
                value={newMaster.idmSearchQueryFilter.reportingManager ? newMaster.idmSearchQueryFilter.reportingManager : null}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppGroupInput label="Group" 
                value={newMaster.idmSearchQueryFilter.group ? newMaster.idmSearchQueryFilter.group : null}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppTextInput label="Email" 
                value={newMaster.idmSearchQueryFilter.email || '--'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppTextInput label="Mobile" 
                value={newMaster.idmSearchQueryFilter.mobile || '--'}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppCheckbox label="Account Status" 
                disabled
                value={newMaster.idmSearchQueryFilter.locked}
                switchLabel={newMaster.idmSearchQueryFilter.locked ? 'Locked' : 'Unlocked'}
              />
            </Grid>
            <Grid item xs ={12}><div>User Status</div></Grid>
            <Grid item xs={12} md={2}>
              <div className="custom-checkbox">
                <input type="checkbox" name="user" id="fitlerActive" checked={newMaster.idmSearchQueryFilter.status.indexOf('ACTIVE') >= 0} /> <label htmlFor="fitlerActive">Active</label>
              </div>
            </Grid>
            <Grid item xs={12} md={2}>
              <div className="custom-checkbox">
                <input type="checkbox" name="user" id="fitlerInActive" checked={newMaster.idmSearchQueryFilter.status.indexOf('INACTIVE') >= 0} /> <label htmlFor="fitlerInActive">Inactive</label>
              </div>
            </Grid>
          </Grid>
        </Paper>     
        </>) : (<></>)}

        <div>Conditions</div>

        <Paper variant="outlined" elevation={3} className={classes.paperone} >
          <Grid container spacing={3}>
            {rules.map((rule) => (
              <Grid item xs={12} md={6}>
                <AppTextInput label={showValue[rule]}
                  value={newMaster.reconConditions[rule] || '--'}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>

        <div className={classes.flexdiv}>
          <Grid item xs={8}>
            <Button onClick={() => setTable(true)}>
              Back
            </Button>
          </Grid>
          {isActiveForRoles(['ORG_ADMIN']) && action && action === "Edit" &&
          <Grid item xs={4}>
              <Button disabled={run}
                onClick={runNow} variant="contained" className={classes.button}
                color="primary"
              >
                {!run ? 'Run Now' : 'Running'}
              </Button>
          </Grid>}
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'

import AppSelectInput from '../../../../../components/form/AppSelectInput';
import Delete from '../../../../../FrontendDesigns/new/assets/img/icons/Delete.svg'
import { isActiveForRoles } from '../../../../../utils/auth';


const useStyles = makeStyles(() => ({
  paperLevel: {
    margin: '0 0 10px',
    // padding: '7px 0',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  griditem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  div: {
    display: 'flex',
    alignItems: 'center',
    margin: '35px 10px 10px'
  },
}))


export default function PolicyItem(props) {
  const classes = useStyles();

  const { item, list, onUpdate, onDelete, priority } = props
  const change = e => onUpdate({ ...item, ...e })

  var elements = []
  for(var i=1; i <= priority; i++){
    elements.push(i)
  }

  return (
    <div className={classes.paperLevel}>
      <Grid container spacing={3}>
        <Grid item xs={6} md={7}>
          <AppSelectInput
            fullWidth
            label="Authenticator"
            value={item.authenticatorId}
            onChange={e => change({ authenticatorId: e.target.value })}
            disabledList={list.filter(e => props.selectedAuths.indexOf(e.id) >= 0).map(e => e.id)}
            labels={list.map(l => l.name)}
            options={list.map(l => l.id)}
            disabled={!isActiveForRoles(['ORG_ADMIN'])}
            />
        </Grid>
        <Grid item xs={6} md={4}>
          <AppSelectInput
            fullWidth
            label="Priority"
            value={item.priority}
            disabledList={elements.filter(e => props.selectedPriorities.indexOf(e) >= 0)}
            options={elements}
            disabled={!isActiveForRoles(['ORG_ADMIN'])}
            onChange={e => change({ priority: e.target.value })} />
        </Grid>
        {
          isActiveForRoles(['ORG_ADMIN']) && 
          <Grid item xs={12} md={1} className={classes.griditem}>
            <div className={classes.div}>
              <a onClick={onDelete} className="ml-2"><img src={Delete} alt="" title="" /></a>
            </div>
          </Grid>
        }
      </Grid>
    </div>
  )
}

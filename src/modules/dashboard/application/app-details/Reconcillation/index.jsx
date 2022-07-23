import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {isActiveForRoles} from '../../../../../utils/auth'
import clsx from 'clsx'
import Link from '@material-ui/core/Link'

import Pull from './Pull';
import Push from './Push';
import History from './History';

const useStyles = makeStyles(() => ({
  Nav: {
    display: 'flex',
    padding: '0px !important',
  },
  icon: {
    marginRight: 5
  },
  link: {
    paddingBottom: 5,
    marginTop: '10px',
    marginLeft: '30px',
    fontSize: 14,
    transition: 'all 0.1s ease',
    //fontWeight: 'bold !important',
    color: '#1F4287',
    textDecorationLine: 'none',
    '&:hover': {
      fontWeight: 'bold',
      color: '#363795',
      borderBottom: '3px solid #1F4287',
    },
    '&:active': {
      fontWeight: 'bold !important',
      borderBottom: '3px solid #363795 !important',
      color: '#363795',
    },
    cursor: 'pointer'
  },
  activeLink: {
    fontWeight: 'bold !important',
    borderBottom: '3px solid #1F4287',
    color: '#1F4287',
  },
}))

export default function ReconcillationModule(props) {
  const classes = useStyles()
  const [type, setType] = React.useState('PULL')
  const [table, setTable] = React.useState(true)
  return (
    <div id="dash-admin" style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: 15 }}>
      <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
        <Grid item xs={12} className={classes.Nav}>
          <Link onClick={() => {setType('PULL'); setTable(true);}} style={{color:'#1F4287'}} className={clsx(classes.link, type === 'PULL' && classes.activeLink)}>Pull</Link>
          <Link onClick={() => {setType('PUSH'); setTable(true);}} style={{color:'#1F4287'}} className={clsx(classes.link, type === 'PUSH' && classes.activeLink)}>Push</Link>
          <Link onClick={() => {setType('HISTORY'); setTable(true);}} style={{color:'#1F4287'}} className={clsx(classes.link, type === 'HISTORY' && classes.activeLink)}>History</Link>
        </Grid>
      </Grid>
      
      { 
        type === 'PULL' ? 
          (<Pull app={props.app} table={table} setTable={setTable} {...props} />) :
        type === 'PUSH' ?
          (<Push app={props.app} table={table} setTable={setTable} {...props} />) :
        type === 'HISTORY' ?
          (<History app={props.app} table={table} setTable={setTable} />) : ((<Pull app={props.app} table={table} setTable={setTable} />))
      }

    </div>
  )
}
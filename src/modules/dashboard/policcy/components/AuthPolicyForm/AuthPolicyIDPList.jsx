/* eslint-disable react/display-name */
import React from 'react';
// import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import { callApi } from '../../../../../utils/api'
// import AppSelectInput from '../../../../../components/form/AppSelectInput';
import { Button } from '@material-ui/core';
import PolicyItem from './PolicyItem';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  paper: {
    padding: 25,
    border: 'none',
    boxShadow: 'none'
  },
  divone: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden'
  },
  button: {
    borderRadius: '8px'
  },
}))

export default function AuthPolicyIDPList(props) {
  const { newData, setNewData } = props
  const [list, setList] = React.useState([])
  const classes = useStyles()
  const length = newData.authenticationList.length
  const downloadList = () => {
    callApi('/authsrvc/AuthenticationProvider/activeList')
      .then(e => {
        if (e.success) {
          setList(e.data)
        }
      })
  }

  const onAdd = () => {
    setNewData({
      ...newData,
      authenticationList: [...newData.authenticationList, {  }]
    })
  }

  React.useEffect(() => downloadList(), [])

  const selectedPriorities = newData.authenticationList.map(d => d.priority).filter(d => d > 0)
  const selectedAuths = newData.authenticationList.map(d => d.authenticatorId)

  return (
    <Paper variant="outlined" elevation={3} className={classes.paper} >
      <div className={classes.divone}>
        <div className="d-flex flex-row align-items-center justify-content-between">
          <div>IDP Priorities</div>
          <Button disabled={newData.authenticationList.length === list.length} onClick={onAdd} variant="contained" className={classes.button} color="primary">+ Add</Button>
        </div>


        <div>
          {newData.authenticationList
            .map((m, i) => <PolicyItem key={i}
              onUpdate={e => {
                const authList = newData.authenticationList || []
                authList[i] = e
                setNewData({ ...newData, authenticationList: [...authList] })
              }}
              selectedAuths={selectedAuths}
              selectedPriorities={selectedPriorities}
              item={m}
              priority={length}
              onDelete={() => {
                const authList = newData.authenticationList || []
                authList.splice(i, 1)
                setNewData({ ...newData, authenticationList: [...authList] })
              }} auth={newData} list={list} />)}
        </div>
      </div>
    </Paper>
  )
}

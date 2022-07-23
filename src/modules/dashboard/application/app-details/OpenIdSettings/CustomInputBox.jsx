import React, { useState } from 'react'
import { Grid, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import AppTextInput from '../../../../../components/form/AppTextInput';
import { isActiveForRoles } from '../../../../../utils/auth';

const useStyles = makeStyles((theme) => ({
  addBtnGrid: {
    // paddingTop: '20px',
    // textAlign: 'center'
  },
  addBtn: {
    // float: 'right'
    textAlign: 'center',
    margin: '25px 10px 0px'
  },
  deleteBtn: {
    textAlign: 'center',
    margin: '10px 10px 0px'
  }
}))

export const CustomInputBox = (props) => {
  const classes = useStyles()
  const { label, name, change, data, placeholder, error, onBlur, helperText } = props;
  // console.log('data',data);
  // const [arr, setArr] = useState(data || [])
  // console.log('arr',arr);
  const [input, setInput] = useState('')

  const handleInput = (inpVal, index) => (
    <Grid 
      key={index}
      container 
      direction="row" 
      justify="flex-end" 
      alignItems="baseline" 
      alignContent="flex-end"
    >
      <Grid item xs={10}>
        <AppTextInput
          value={inpVal}
          disabled
        />
      </Grid>
      <Grid item xs={2}>
        <IconButton
          className={classes.deleteBtn}
          onClick={() => {
            let newData = data.filter((val, i) => i !== index);
            change(newData)
            // setArr(newData)
          }}
          title="Delete"
        >
          <IndeterminateCheckBoxIcon />
        </IconButton>
      </Grid>
    </Grid>
  )

  return (
    <>
      <Grid 
        container 
        direction="row" 
        // justify="space-between" 
        alignItems="center" 
        // alignContent="flex-end"
      >
        <Grid item xs={10}>
          {name === 'redirectUris' ? 
            (
              <AppTextInput
                label={label}
                required
                value={input}
                name={name}
                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                placeholder={placeholder}
                error={error}
                onBlur={onBlur}
                helperText={helperText}
                onChange={e => setInput(e.target.value)}
              />
            ) : (
              <AppTextInput
                label={label}
                value={input}
                name={name}
                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                placeholder={placeholder}
                onChange={e => setInput(e.target.value)}
              />
            )
          }
        </Grid>
        <Grid item xs={2} className={classes.addBtnGrid}>
          <IconButton
            disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || input === ''}
            className={classes.addBtn}
            onClick={() => {
              let newData = data;
              newData.push(input)
              change(newData)
              setInput ('')
              onBlur()
            }}
            title="Add"
          >
            <AddCircleIcon />
          </IconButton>
        </Grid>
      </Grid>
      {data && data.length > 0 && data.map((val,i) => (
        handleInput(val, i)
      ))}
    </>
  )
}

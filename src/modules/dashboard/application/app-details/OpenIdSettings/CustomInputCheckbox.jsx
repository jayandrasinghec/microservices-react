import React, { useState } from 'react'
import { Checkbox, FormControlLabel, Grid, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AppTextInput from '../../../../../components/form/AppTextInput';

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

export const CustomInputCheckbox = (props) => {
  const classes = useStyles()
  const { label, name, change, data, placeholder, error, onBlur, helperText } = props;
  const [input, setInput] = useState('')

  const handleCheckbox = (inpVal, index) => (
    <Grid 
      key={index}
      container 
      direction="row" 
      justify="flex-end" 
      alignItems="baseline" 
      alignContent="flex-end"
    >
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              name={inpVal.label}
              color="primary"
              value={inpVal.label}
              checked={inpVal.value}
              onChange={(e) => {
                  let obj = {}
                  obj['label'] = inpVal.label
                  obj['value'] = e.target.checked ? true : false

                  let item = data
                  item[index] = obj
                  change(item)
                  onBlur()
              }}
            />
          }
          labelPlacement="start"
          label={inpVal.label}
        />
      </Grid>
    </Grid>
  )

  return (
    <>
      <Grid 
        container 
        direction="row" 
        alignItems="center" 
      >
        <Grid item xs={10}>
          <AppTextInput
            label={label}
            value={input}
            required
            name={name}
            placeholder={placeholder}
            error={error}
            onBlur={onBlur}
            helperText={helperText}
            onChange={e => setInput(e.target.value)}
          />
        </Grid>
        <Grid item xs={2} className={classes.addBtnGrid}>
          <IconButton
            disabled={input === '' ? true : false}
            className={classes.addBtn}
            onClick={() => {
              let obj = {}
              obj['label'] = input
              obj['value'] = false
              let item = data
              item.push(obj)
              change(item)
              setInput ('')
            }}
            title="Add"
          >
            <AddCircleIcon />
          </IconButton>
        </Grid>
      </Grid>
      {data && data.length > 0 && data.map((val,i) => (
        handleCheckbox(val, i)
      ))}
    </>
  )
}

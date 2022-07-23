import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'


const useStyles = makeStyles(() => ({
  textField: {
    backgroundColor: '#F7F7F7',
  },
  label: {
    fontSize: 14,
    marginBottom: 10
  },
  input: {
    height: 40
  },
}))


export default function AppDateInput(props: TextFieldProps) {
  const classes = useStyles();
  const { label, className, ...textProps } = props

  return (
    <div className={className}>
      <div className={classes.label}>{props.label}</div>
      <TextField
        {...textProps}
        type="date"
        className={classes.textField}
        fullWidth variant="outlined"
        InputProps={{ className: classes.input }} />
    </div>
  )
}
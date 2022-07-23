import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'


const useStyles = makeStyles(() => ({
  textField: {
    backgroundColor: '#F7F7F7',
  },
  label: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5
  },
  input: {
    height: 40
  },
  multilineInput: {
    // height: 33
  },
}))


export default function AppTextInputProps(props: TextFieldProps) {
  const classes = useStyles();
  const { label, required, style, className, ...textProps } = props

  return (
    <div style={style} className={className}>
      {required ? (
        <div className={classes.label}>{label} <span style={{ color: 'red', fontSize: 14 }}>*</span></div>
      ) : (
        <div className={classes.label}>{label}</div>
      )}
      <TextField
        {...textProps}
        className={classes.textField}
        fullWidth variant="outlined"
        // InputProps={{ className: !props.multiline ? classes.input : classes.multilineInput }}
        />
    </div>
  )
}
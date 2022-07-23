import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import { MenuItem } from '@material-ui/core';


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
  selectRoot: {
    height: 40,
    lineHeight: 2,
  },
  select: {
    lineHeight: '40px',
    height: 40,
    paddingTop: 0,
    paddingBottom: 0,
    verticalAlign: "middle"
  }
}))


interface IProps {
  style?: any
  className?: any
  options: any[]
  labels?: string[]
  disabledList?: string[]
}

export default function AppSelectInputValue(props: IProps & TextFieldProps) {
  const classes = useStyles();
  const { label, labels: _labels, className, style, ...textProps } = props

  const labels = _labels || props.options
  const disabledList = props.disabledList || []

  return (
    <div style={style} className={className}>
      {props.label && props.required ? (
        <div className={classes.label}>{label} <span style={{ color: 'red', fontSize: 14 }}>*</span></div>
      ) : (
        <div className={classes.label}>{label}</div>
      )}

      <TextField
        {...textProps}
        className={classes.textField}
        fullWidth variant="outlined"
        value={props.value || ""}
        select
        SelectProps={{
          classes: {
            root: classes.selectRoot,
            select: classes.select
          }
        }}
        InputProps={{ className: classes.input }}>
        <MenuItem value=""><em>Select an option</em></MenuItem>
        {props.options.map((o, index) => <MenuItem key={o}
          disabled={disabledList.indexOf(o) >= 0 && (!props.value || o === props.value)} 
          value={o}>
            {labels[index]}
            </MenuItem>)}
      </TextField>
    </div>
  )
}
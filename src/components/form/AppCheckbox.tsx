import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FormControlLabel, Switch } from '@material-ui/core';


const useStyles = makeStyles(() => ({
  textField: {
    backgroundColor: '#F7F7F7',
  },
  label: {
    fontSize: 14,
    marginTop: 5
  },
  input: {
    height: 40,
    fontSize: 14,
    margin: 0
  },
}))


interface IProps {
  className?: any
  value: boolean
  label: string
  switchLabel: string
  disabled?: boolean
  onChange: (val: boolean) => void
}


export default function AppCheckbox(props: IProps) {
  const classes = useStyles();
  const { label, className, disabled, ...textProps } = props

  return (
    <div className={className}>
      <div className={classes.label}>{props.label}</div>
      <FormControlLabel
        className={classes.input}
        control={<Switch color="primary" disabled={disabled} checked={props.value || false} onChange={e => props.onChange(e.target.checked)} />}
        label={props.switchLabel}
      />
    </div>
  )
}
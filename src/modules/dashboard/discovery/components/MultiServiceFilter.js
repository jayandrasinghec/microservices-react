import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(() => ({
  textField: {
    backgroundColor: '#F7F7F7',
  },
  label: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5
  },
  option: {
    padding: 3
  },
  input: {
    height: 40
  },
}))

export default function MultiServiceFilter(props) {
  const classes = useStyles();
  const { label, style, resource, disabled, className, options, onChange, value, ...textProps } = props

  return (
    <div className={className}>
      <div className={classes.label}>{props.label}</div>

      <Autocomplete
        multiple
        // id="tags-standard"
        options={options}
        value={value}
        disabled={disabled}
        autoHighlight
        onChange={(event, newValue, reason) => {
            onChange(newValue)
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            className={classes.textField}
            fullWidth
          />
        )}
      />
    </div>
  )
}



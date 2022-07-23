import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import { callApi } from '../../utils/api';
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
    height: 40,
    lineHeight: '40px !important',
  },
  selectRoot: {
    height: 40,
    lineHeight: '40px !important',
  },
  select: {
    lineHeight: '40px !important',
    height: 40,
    paddingTop: 0,
    paddingBottom: 0,
    verticalAlign: "middle"
  }
}))


interface IProps {
  masterType: string
}


export default function AppMasterInput(props: TextFieldProps & IProps) {
  const classes = useStyles();
  const { label, className, style, ...textProps } = props
  const [list, setList] = React.useState<any[]>([])

  React.useEffect(() => {
    // TODO: Cache these values using Redux
    callApi(`/utilsrvc/meta/list/${props.masterType}`, 'GET')
      .then(e => { if (e.success) setList(e.data ? e.data : []) })
  }, [])

  return (
    <div className={className} style={style}>
      {props.required ? (
        <div className={classes.label}>{props.label} <span style={{ color: 'red', fontSize: 17 }}>*</span></div>
      ) : (
        <div className={classes.label}>{props.label}</div>
      )}
      <TextField
        {...textProps}
        className={classes.textField}
        fullWidth variant="outlined"
        select
        SelectProps={{
          classes: {
            root: classes.selectRoot,
            select: classes.select
          }
        }}
        InputProps={{ className: classes.input }}>
        <MenuItem value=""><em>Select an option</em></MenuItem>
        {list.map(o => <MenuItem key={o} value={o.name}>{o.name}</MenuItem>)}
      </TextField>
    </div>
  )
}
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { callApi } from '../../utils/api';


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


export default function AppGroupInput(props: TextFieldProps) {
  const classes = useStyles();
  const { label, style, className, disabled, ...textProps } = props


  const defaultFilters = {
    direction: "ASC",
    pageNumber: 0,
    pageSize: 10,
    keyword: "",
    sort: "GROUP_NAME"
  }

  const [filters, _setFilters] = React.useState(defaultFilters)
  const [groups, setGroups] = React.useState<any[]>([])
  const [totalGroups, setTotalGroups] = React.useState<any>(0)

  const setSearchQuery = (e: any) => { 
    _setFilters({ ...filters, keyword: e });
  }
  
  React.useEffect(()=>{
    if(filters != defaultFilters)
      downloadGroups()
  },[filters])

  const downloadGroups = () => {
    callApi(`/usersrvc/api/group/list`, 'POST', filters)
      .then(e => {
        if (e.success) {
          setGroups(e.data ? e.data.elements : [])
          setTotalGroups(e.data ? e.data.totalElements : [])
        }
      })
  }

  React.useEffect(() => {
    if (!props.value) return
    callApi(`/usersrvc/api/group/${props.value}`)
      .then(e => { if (e.success) setGroups([e.data]) })
  }, [props.value])

  if (props.value && groups.length === 0) return <div />
  // React.useEffect(() => downloadGroups(), [filters])

  return (
    <div style={style} className={className}>
      <div className={classes.label}>{props.label}</div>

      <Autocomplete
        options={groups}
        onFocus={downloadGroups}
        disabled={disabled}
        value={props.value}
        onInputChange={(e: any, newValue: any) => {
          setSearchQuery(e ? e.target ? e.target.value : "" : "")
        }}
        onChange={(event, newValue: any) => {
          if (newValue && newValue.id) {
            setSearchQuery(newValue.name)
            // @ts-ignore
            props.onGroupId(newValue.id)
          }
        }}
        getOptionSelected={(option: any, value) => {
          return option.id === value
        }}
        autoHighlight
        filterOptions={(options, state) => {
          const res = options.filter((o: any) => {
            const name = o.name.toLowerCase()
            return name.includes(state.inputValue.toLowerCase())
          })

          return res
        }}
        getOptionLabel={(option: any) => {
          const group = groups.find(u => u.id == option || u.id == option.id)
          if (!group) return 'choose a group'
          return group.name
        }}
        renderOption={(option: any) => (
          <React.Fragment>{option.name}</React.Fragment>
        )}
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



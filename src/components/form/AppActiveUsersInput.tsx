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

export default function AppActiveUsersInput(props: TextFieldProps) {
  const classes = useStyles();
  const { label, style, resource, className, disabled, ...textProps } = props

  const defaultFilters = {
    direction: "ASC",
    pageNumber: 0,
    pageSize: 30,
    filters: {
      "status": ["ACTIVE"]
    },
    keyword: "",
    sort: "FIRST_NAME"
  }

  const [filters, _setFilters] = React.useState(defaultFilters)
  const [users, setUsers] = React.useState<any[]>([])
  const [totalUsers, setTotalUsers] = React.useState<any>(0)

  React.useEffect(() => {
    if(filters != defaultFilters)
      downloadGroups()
  }, [filters])

  const downloadGroups = () => {
    callApi(`/usersrvc/api/user/list`, 'POST', filters)
      .then(e => {
        if (e.success) {
          setUsers(e.data ? e.data.elements : [])
          setTotalUsers(e.data ? e.data.totalElements : [])
        }
      })
  }

  // if(totalUsers > filters.pageSize) {
  //   filters.pageSize = totalUsers
  //   downloadGroups()
  // }

  React.useEffect(() => {
    if (!props.value) return
    callApi(`/usersrvc/api/user/${props.value}`)
      .then(e => { if (e.success) setUsers([e.data]) })
  }, [props.value])

  const setSearchQuery = (e: any) => {
    _setFilters({ ...filters, keyword: e });
  }

  // React.useEffect(() => { downloadGroups() }, [filters])
  if (props.value && users.length === 0) return <div />

  return (
    <div className={className}>
      {props.required ? (
        <div className={classes.label}>{label} <span style={{ color: 'red', fontSize: 14 }}>*</span></div>
      ) : (
        <div className={classes.label}>{label}</div>
      )}
      <Autocomplete
        options={users}
        onFocus={downloadGroups}
        value={props.value}
        disabled={disabled}
        onInputChange={(e: any, newValue: any) => {
          setSearchQuery(e ? e.target ? e.target.value : "" : "")
        }}
        //defaultValue={users[0]}
        onChange={(event: any, newValue: any, reason: any) => {
          setSearchQuery(event.target.value)
          if (newValue && newValue.id) {
            setSearchQuery(newValue.firstName)
            // @ts-ignore
            if (props.onGroupId) props.onGroupId(newValue.id)
          }
          if(reason === 'clear') {
            // @ts-ignore
            if (props.onGroupId) props.onGroupId(null)
          }
        }}
        getOptionSelected={(o: any, v) => o.id === v}
        autoHighlight
        filterOptions={(options, state) => {
          const res = options.filter((o: any) => {
            const name = `${o.firstName} ${o.lastName}`.toLowerCase()
            return name.includes(state.inputValue.toLowerCase())
          })

          return res
        }}
        getOptionLabel={(option: any) => {
          const user = users.find(u => u.id == option || u.id == option.id)
          if (!user) return 'choose a user'
          return `${user.firstName} ${user.lastName}`
        }}
        renderOption={(option: any) => (
          <React.Fragment>
            {option.firstName} {option.lastName} - <i>{option.designation || 'NA'}</i>
          </React.Fragment>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            // margin="dense"
            className={classes.textField}
            fullWidth
            {...textProps}
          />
        )}
      />
    </div>
  )
}



import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { callApi } from '../../utils/api';


const useStyles = makeStyles(() => ({
  textField: {
    margin: 0,
    padding: 0
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

export default function AppUserDropdown(props) {
  const classes = useStyles();
  const { label, style, resource, className, placeholder, ...textProps } = props

  const defaultFilters = {
    direction: "ASC",
    pageNumber: 0,
    pageSize: 30,
    filters: {},
    keyword: "",
    sort: "FIRST_NAME"
  }

  const defaultAppFilters = {
    displayName: "",
    order: "asc",
    pageNo: 0,
    size: 12,
    sortBy: "displayName",
    tag: ""
  }

  const [filters, _setFilters] = React.useState(defaultFilters)
  const [appfilters, _setAppFilters] = React.useState(defaultAppFilters)
  const [users, setUsers] = React.useState([])
  const [totalUsers, setTotalUsers] = React.useState(0)

  const downloadGroups = () => {
      if(props.type === 'users'){
        callApi(`/usersrvc/api/user/list/public`, 'POST', filters)
      .then(e => {
        if (e.success) {
          setUsers(e.data ? e.data.content : [])
          setTotalUsers(e.data ? e.data.totalElements : [])
        }
      })
      }
      if(props.type === 'applications'){
        callApi(`/provsrvc/applicationTenant/applicationListByPage`, 'POST', appfilters)
        .then(e => { if (e.success) {
          setUsers(e.data ? e.data.content : [])
          setTotalUsers(e.data ? e.data.totalElements : [])
        }})
      }
  }

  React.useEffect(() => {    
    if((filters != defaultFilters) || (appfilters != defaultAppFilters)){
      downloadGroups()
    }
  }, [props.type === 'users' ? filters : appfilters])

  React.useEffect(() => {
    if (!props.value) return
    downloadGroups()    
  }, [props.v, props.value])

  // if(totalUsers > filters.pageSize) {
  //   filters.pageSize = totalUsers
  //   downloadGroups()
  // }

  // React.useEffect(() => {
  //   if (!props.value) return
  //   callApi(`/usersrvc/api/user/${props.value}`)
  //     .then(e => { if (e.success) setUsers([e.data]) })
  // }, [props.value])

  // const setSearchQuery = (e) => {
  //   _setFilters({ ...filters, keyword: e });
  // }

  const setSearchQuery = (e) => {
    if(props.type === 'users') _setFilters({ ...filters, keyword: e });
    if(props.type === 'applications') _setAppFilters({ ...appfilters, displayName: e });
  }

  // React.useEffect(() => { downloadGroups() }, [filters])
  // if (props.value && users.length === 0) return <div />

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
        onInputChange={(e, newValue) => {          
          setSearchQuery(e ? e.target ? e.target.value : "" : "")
        }}
        //defaultValue={users[0]}
        onChange={(event, newValue, reason) => {
         
          
          setSearchQuery(event.target.value)  
          if (newValue && newValue.id) {
            setSearchQuery(newValue.firstName)
            // @ts-ignore
            if (props.onGroupId) props.onGroupId(newValue)
          }
          if(reason === 'clear') {
            // @ts-ignore
            if (props.onGroupId) props.onGroupId(null)
          }
        }}
        // getOptionSelected={(o, v) => o.id === v}
        autoHighlight
        filterOptions={(options, state) => {
          const res = options.filter((o) => {
            const name = props.type === 'users' ? `${o.displayName}`.toLowerCase() : `${o.appName}`.toLowerCase()
            return name.includes(state.inputValue.toLowerCase())
          })

          return res
        }}
        // getOptionLabel={(option) => {
          
        //   // const user = users.find(u => u.id == option || u.id == option.id || u == option)
        //   // if (!user) return ''
        //   // return props.type === 'users' ? `${user.displayName}` : `${user.appName}`
        //   return option
        // }}
        renderOption={(option) => (
          <React.Fragment>
            {props.type === 'users' ? `${option.displayName} - ${option.login || 'NA'}` : `${option.appName}`}
          </React.Fragment>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            placeholder={placeholder}
            className={classes.textField}
            fullWidth
            {...textProps}
          />
        )}
      />
    </div>
  )
}

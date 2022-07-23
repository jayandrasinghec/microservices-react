import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { callApi } from '../../utils/api';
import Chip from '@material-ui/core/Chip';

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

const defaultFilters = {
  direction: "ASC",
  pageNumber: 0,
  pageSize: 10,
  filters: {
    "status": ["ACTIVE"]
  },
  keyword: "",
  sort: "FIRST_NAME"
}

const defaultGroupFilters = {
  direction: "ASC",
  pageNumber: 0,
  pageSize: 10,
  keyword: "",
  sort: "GROUP_NAME"
}


const defaultAppFilters = {
  displayName: "",
  order: "asc",
  pageNo: 0,
  size: 12,
  sortBy: "displayName",
  tag: ""
}

export default function AppUserInput(props) {
  const classes = useStyles();
  const { label, style, resource, disabled, className, ...textProps } = props

  const optValue = props.value

  const [filters, _setFilters] = React.useState(defaultFilters)
  const [groupfilters, _setGroupFilters] = React.useState(defaultGroupFilters)
  const [appfilters, _setAppFilters] = React.useState(defaultAppFilters)

  const [users, setUsers] = React.useState([])
  const [totalUsers, setTotalUsers] = React.useState(0)

  React.useEffect(() => {
    if((filters != defaultFilters) || (groupfilters != defaultGroupFilters) || (appfilters != defaultAppFilters))
      downloadGroups()
  }, [props.type === 'users' ? filters : props.type === 'groups' ? groupfilters : appfilters])

  const downloadGroups = () => {
    if(props.type === 'users'){
      callApi(`/usersrvc/api/user/list`, 'POST', filters)
      .then(e => {
        if (e.success) {
          let opt = e.data ? e.data.elements : []
          let ids = new Set(optValue.map(d => d.id));
          let merged = [...optValue, ...opt.filter(d => !ids.has(d.id))];
          setUsers(e.data ? merged : optValue)
          setTotalUsers(e.data ? e.data.totalElements : [])
        }
      })
    }
    if(props.type === 'groups'){
      callApi(`/usersrvc/api/group/list`, 'POST', groupfilters)
      .then(e => {
        if (e.success) {
          let opt = e.data ? e.data.elements : []
          let ids = new Set(optValue.map(d => d.id));
          let merged = [...optValue, ...opt.filter(d => !ids.has(d.id))];
          setUsers(e.data ? merged : optValue)
          setTotalUsers(e.data ? e.data.totalElements : [])
        }
      })
    }
    if(props.type === 'applications'){
      callApi(`/provsrvc/applicationTenant/applicationListByPage`, 'POST', appfilters)
      .then(e => { if (e.success) {
        let opt = e.data ? e.data.content : []
        let ids = new Set(optValue.map(d => d.id));
        let merged = [...optValue, ...opt.filter(d => !ids.has(d.id))];
        setUsers(e.data && e.data.content ? merged : optValue)
        setTotalUsers(e.data.totalElements)

      }})
    }
    if(props.type === 'userType'){
      callApi(`/utilsrvc/meta/list/userType`, 'GET')
      .then(e => { if (e.success) {
        let opt = e.data.map(d => d.name)
        setUsers(e.data ? opt : optValue)
      }})
    }
  }


  React.useEffect(() => {
    if (!props.value) return
    downloadGroups()    
  }, [props.v])
    

  const setSearchQuery = (e) => {
    if(props.type === 'users') _setFilters({ ...filters, keyword: e });
    if(props.type === 'groups') _setGroupFilters({ ...groupfilters, keyword: e });
    if(props.type === 'applications') _setAppFilters({ ...appfilters, displayName: e });
  }

  return (
    <div className={className}>
      <div className={classes.label}>{props.label}</div>

      <Autocomplete
        multiple
        // id="tags-standard"
        // onFocus={downloadGroups}
        options={users}
        value={props.value || []}
        disabled={disabled}
        autoHighlight
        filterOptions={(options, state) => {
          const res = options.filter((o) => {
            const name = props.type === 'users' ? `${o.displayName}`.toLowerCase() : props.type === 'groups' ? `${o.name}`.toLowerCase() : props.type === 'applications' ? `${o.appName}`.toLowerCase() : `${o}`
            return name.includes(state.inputValue.toLowerCase())
          })
          return res
        }}
        onChange={(event, newValue, reason) => {
          if (props.onGroupId) props.onGroupId(newValue)
          setSearchQuery('')
          if(reason === 'clear') {
            if (props.onGroupId) props.onGroupId(null)
          }
        }}
        onInputChange={e => {
          setSearchQuery(e ? e.target ? e.target.value : "" : "")
        }}
        renderOption={(option) => (
          <React.Fragment>
            {props.type === 'users' ? `${option.displayName} - ${option.designation || 'NA'}` : props.type === 'groups' ? `${option.name}` : props.type === 'applications' ? `${option.appName}` : `${option}`}
          </React.Fragment>
        )}
        getOptionLabel={(option) => {
          const user = users.find(u => u.id == option || u.id == option.id || u == option)
          if (!user) return 'choose'
          return props.type === 'users' ? `${user.displayName}` : props.type === 'groups' ? `${user.name}` : props.type === 'applications' ? `${user.appName}` : `${option}`
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



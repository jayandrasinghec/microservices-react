import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { callApi } from '../../../../../utils/api';

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

export default function AutocompleteField(props) {
  const classes = useStyles();
  const { query, setFilters, source, filterKey } = props
  let defaultUserFilters = {
    direction: "ASC",
    pageNumber: 0,
    pageSize: 1000,
    keyword: "",
    sort: "FIRST_NAME"
  }
  
  let defaultGroupFilters = {
    direction: "ASC",
    keyword: "",
    pageNumber: 0,
    pageSize: 1000,
    sort: "GROUP_NAME"
  }

  let defaultAppFilters = {
    displayName: "",
    order: "asc",
    pageNo: 0,
    size: 1000,
    sortBy: "displayName",
    tag: ""
  }

  const [userFilters, _setUserFilters] = React.useState(defaultUserFilters)
  const [groupFilters, _setGroupFilters] = React.useState(defaultGroupFilters)
  const [appFilters, _setAppFilters] = React.useState(defaultAppFilters)
  const [options, setOptions] = React.useState([])
  const filterKeyValue = query.filter[filterKey] || ''
  
  const download = () => {
    if(source === 'USER') {
      callApi(`/usersrvc/api/user/list`, 'POST', userFilters)
      .then(e => {
        if (e.success) {
          let arr=[]
          e.data && (e.data.elements).map( data => {
            let obj={}
            obj['id'] = data.id
            obj['label'] = data.displayName
            arr.push(obj)
          } )
          setOptions(e.data ? arr : [])
        }
      })
    }

    if(source === 'GROUP') {
      callApi(`/usersrvc/api/group/list`, 'POST', groupFilters)
      .then(e => {
        if (e.success) {
          let arr=[]
          e.data && (e.data.elements).map( data => {
            let obj={}
            obj['id'] = data.id
            obj['label'] = data.name
            arr.push(obj)
          })
          setOptions(e.data ? arr : [])
        }
      })
    }

    if(source === 'APPLICATION') {
      callApi(`/provsrvc/applicationTenant/applicationListByPage`, 'POST', appFilters)
      .then(e => {
        if (e.success) {
          let arr=[]
          e.data && (e.data.content).map( data => {
            let obj={}
            obj['id'] = data.id
            obj['label'] = data.appName
            arr.push(obj)
          })
          setOptions(e.data ? arr : [])
        }
      })
    }
  }

  const setSearchQuery = (e) => { 
    
      if(source === 'USER'){
        _setUserFilters({ ...userFilters, keyword: e }); 
      }else if(source === 'GROUP'){
        _setGroupFilters({ ...groupFilters, keyword: e });
      }else if(source === 'APPLICATION'){
        _setAppFilters({ ...appFilters, displayName: e }); 
      }
    }
    
  const clear = () => {
    setFilters({[filterKey] : ''})
    setSearchQuery('')
  }

  var downloadApiCall;

  const onSearchTextHandler = (event, value, reason) => {
    if(value) {
      downloadApiCall && clearTimeout(downloadApiCall);
      downloadApiCall= setTimeout(() => {
        setSearchQuery(value)
        download()
      }, 3000);
      
    }
    // if(value){
    //   setSearchQuery(value)
    //   download()  
    // }

    if (reason === 'clear') {
      clear();
    }
  }

  // React.useEffect(() => download(), [query])
  return (
    <div>
      <div className={classes.label}>{props.label}</div>
      <Autocomplete
        options={options}
        onFocus={download}
        onChange={(event, newValue) => {
          // if (newValue && newValue.id) {
          //   // setSearchQuery(newValue.label)
          //   setFilters({[filterKey] : newValue.id})
          // }else{
          //   setSearchQuery('')
          //   setFilters({[filterKey] : ''})
          // }
        }}
        disabled={props.disabled}
        // inputValue={filterKeyValue}
        onInputChange={onSearchTextHandler}
        // value={options.find(v => v.id === filterKeyValue) || {}}
        getOptionLabel={(option) => option.label || ''}
        renderInput={(params) => 
          <TextField {...params}
            variant="outlined"
            size="small"
            className={classes.textField}
            fullWidth
          />
        }
      />
    </div>
  );
}

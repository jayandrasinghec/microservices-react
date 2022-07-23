import React, { useState, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { TextField, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  textField: {
    backgroundColor: '#F7F7F7',
  },
  label: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5
  },
}));

export const SearchMatchValueDropdown = ({
  style,
  name,
  api,
  keyword,
  apiParams = [],
  value,
  onChange = () => { },
  onChangeApiCall=true,
  matchValue,
  onLoadApiCall = true,
  setResponse = false,
  source='',
  inputValue="",
  inputText,
  isSetOptions=false,
  allOptions=[],
  error,
  helperText,
  onBlur,
  
  onInputChange=()=>{},
  // getOptionLabel = (option) => option.label || "",
  getOptionLabel = false,
  getOptionSelected = (option, value) => option.label === value.label,
  ...props
}) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [debaunceTimeout, setdebaunceTimeout] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const [nodataFound, setnodataFound] = useState(false);
  const apiCall = (value = "") => {
    api(value, setOptions, setnodataFound)
  };

  useEffect(() => {
    if (onLoadApiCall) {
      apiCall();
    }
  }, [source]);

  useEffect(() => {
    if(isSetOptions){
      setOptions(allOptions)
    }
  }, [])

  const debounceCall = (e) => {
    let val = e.target.value;
    debaunceTimeout && clearTimeout(debaunceTimeout)
    setdebaunceTimeout(setTimeout(() => {
      apiCall(val)
    }, 300))

  }

  return (
    <>
      {props.label && props.required ? (
        <div className={classes.label}>{props.label} <span style={{ color: 'red', fontSize: 14 }}>*</span></div>
      ) : (
        <div className={classes.label}>{props.label}</div>
      )}
      <Autocomplete            
        size="small"
        style={style}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        value={options.find(val => value === val.value) || ''}
        getOptionSelected={(options,val)=>{                                
          return val.id===value
        }}
        // inputValue={inputValue}
        // value={value(options)}
        // getOptionSelected={getOptionSelected}
        getOptionLabel={(option)=>getOptionLabel(option,options)}
        options={options}
        // loading={loading && !nodataFound}
        disabled={props.disabled}
        onChange={(event, newValue, reason) => {
          onChange(event, newValue, reason)
          if(reason === 'clear') {
            api('', setOptions, setnodataFound)
          }
        }}
        // onInputChange={onInputChange}
        renderInput={(params) => (
          <TextField
            // onChange={onChangeApiCall && debounceCall}
            onChange={(e) => {
              props.setKeyword && props.setKeyword({...keyword, [name]: e.target.value})
              onChangeApiCall && debounceCall(e)
            }}
            variant="outlined"
            size="small"
            className={classes.textField}
            fullWidth
            error={!error && nodataFound ? nodataFound : error}
            helperText={!error && nodataFound ? "Record not found" : helperText}
            onBlur={onBlur}
            {...params}
          />
        )}
      />
    </>
  );
};

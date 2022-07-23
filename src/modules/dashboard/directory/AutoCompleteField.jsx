import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
  textfield: { 
    border: 0, 
    backgroundColor: 'white' 
  },
  searchicon: { 
    color: '#363793' 
  },
});

export default function SearchField (props) {
  const classes = useStyles();
  return (
    <div id="search">
      <Autocomplete
        {...props}
        classes={{
          option: classes.option,
        }}
        autoHighlight
        getOptionLabel={(option) => option.label}
        // renderOption={(option) => (
        //   <React.Fragment>
        //     <span>{countryToFlag(option.code)}</span>
        //     {option.label} ({option.code}) +{option.phone}
        //   </React.Fragment>
        // )}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            variant="outlined"
            size="small"
            inputProps={{ style: { border: 0, padding: 15 } }}
            className={classes.textfield}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className={classes.searchicon} />
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </div>
  )
}
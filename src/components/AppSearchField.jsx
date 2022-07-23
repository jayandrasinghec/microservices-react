import React from 'react'

import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  textfield: { 
    border: 0, 
    backgroundColor: 'white' 
  },
  searchicon: { 
    color: '#363793' 
  },
}))



export default function AppSearchField(props) {
  const classes = useStyles()
  return (
    <div className="app-search-field">
      <TextField
        {...props}
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
    </div>
  )
}
import React from 'react'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  appdropicon: { 
    color: 'white' 
  },
  button: { 
    marginRight: '20px',
    fontSize: 12, 
    textTransform: 'capitalize', 
    borderRadius: '15px', 
    color: '#fff',
    backgroundColor: '#8392A7' 
  },
}))

export default function AddNew(props) {

  const [dropbutton, setDropButton] = React.useState(null);
  const classes = useStyles()
  const handleDropClick = (event) => {
    setDropButton(event.currentTarget);
  };

  const handleDropClose = () => {
    setDropButton(null);
  };

  return (
    <div>
      <Button
        onClick={handleDropClick} variant="contained" endIcon={<ArrowDropDownIcon className={classes.appdropicon} />}
        className={classes.button} ><span> {props.title} </span>
      </Button>

    <Menu
      id="simple-menu"
      anchorEl={dropbutton}
      keepMounted
      open={dropbutton}
      onClose={handleDropClose}
      className="nav nav-tabs" role="tablist">

      {props.body}

    </Menu>

    </div>
  )
}
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import LetterAvatar from './LetterAvatar';
import Base from '../assets/Base.png';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PhoneIcon from '@material-ui/icons/Phone';
import EmailIcon from '@material-ui/icons/Email';


const useStyles = makeStyles(() => ({
  root: {
    // maxWidth: 205,
    borderRadius: '10px'
  },
  avatar: {
    height: '90px',
    width: '90px',
    marginLeft: '17px',
    marginTop: '15px'
  },
  name: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '16px',
    textAlign: 'center',
    color: '#1F4287'
  },
  designation: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    textAlign: 'center',
    color: '#8392A7'
  },
  ephone: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '13px',
    lineHeight: '15px',
    color: '#171717',
    marginLeft: '5px',
  },
  boxextra: {
    // width: '185px',
  },
  base: {
    width: '22px',
    height: '24px'
  },
  settings: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '20px',
    color: '#8998AC;',
    marginLeft: '10px'
  },
  checkbox: {
    // position: 'absolute',
    width: '24px',
    height: '24px',
    // left: '14px',
    // top: '10px',
    // color: '#ECECEE'
  },
  flexdiv: { 
    display: 'flex' 
  },
  divone: { 
    marginTop: '5px', 
    marginLeft: '0px' 
  },
  divtwo: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    display: 'flex' 
  },
  divthree: { 
    marginLeft: '15px', 
    marginTop: '0px' 
  },
  divfour: { 
    lineHeight: '0.6px', 
    textAlign: 'center', 
    marginTop: '0px' 
  },
  divfive: { 
    padding: 10, 
    color: '#999' 
  },
  icondivone: { 
    display: 'flex', 
    marginLeft: '5px', 
    alignItems: 'center' 
  },
  icon: { 
    color: '#fff', 
    backgroundColor: '#8392A7', 
    padding: 5, 
    borderRadius: 15, 
    fontSize: 14 
  },
  icondivtwo: { 
    display: 'flex', 
    marginLeft: '5px', 
    marginTop: 5, 
    alignItems: 'center' 
  },
}));

export default function UserGridCard(props) {
  const classes = useStyles();
  const [agree, setAgree] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event) => {
    setAgree(event.target.checked);
  };

  const { user } = props

  return (
    <Card className={classes.root}>
      <div className={classes.flexdiv}>
        <div className={classes.divone}>
          <Checkbox
            checked={agree}
            onChange={handleChange}
            defaultChecked
            color="primary"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
            className={classes.checkbox}
          />
        </div>
        <div className={classes.divtwo} onClick={props.onClick} >
          <LetterAvatar className={classes.avatar} text={`${user.firstName} ${user.lastName}`} status={user.status} />
        </div>
        <div className={classes.divthree}>
          <IconButton aria-label="settings" onClick={handleClick}>
            <MoreHorizIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={anchorEl}
            onClose={handleClose}
            className={classes.boxextra}>
            <MenuItem onClick={handleClose}>
              <div className={classes.flexdiv}>
                <img alt="icon" src={Base} className={classes.base} />
                <span className={classes.settings}>Reset Password</span>
              </div>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <div className={classes.flexdiv}>
                <img alt="icon" src={Base} className={classes.base} />
                <span className={classes.settings}>Deactivate</span>
              </div>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <div className={classes.flexdiv}>
                <img alt="icon" src={Base} className={classes.base} />
                <span className={classes.settings}>Enable MFA</span>
              </div>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <div className={classes.flexdiv}>
                <img alt="icon" src={Base} className={classes.base} />
                <span className={classes.settings}>Delete User</span>
              </div>
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div  className={classes.divfour} onClick={props.onClick}>
        <h4 className={classes.name}>{user.firstName} {user.lastName}</h4>
        <span className={classes.designation}>{user.designation}</span>
      </div>
      <br />
      <Divider />
      <div className={classes.divfive} onClick={props.onClick} >
        <div className={classes.icondivone}>
          <div><EmailIcon className={classes.icon} /></div>
          <span className={classes.ephone}>{user.email}</span>
        </div>
        <div className={classes.icondivtwo}>
          <div><PhoneIcon className={classes.icon} /></div>
          <span className={classes.ephone}>{user.mobile}</span>
        </div>
      </div>
    </Card>
  );
}
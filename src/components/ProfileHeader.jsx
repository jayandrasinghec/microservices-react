import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {Link, useHistory} from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import RecentActors from '@material-ui/icons/RecentActors'
import DescriptionIcon from '@material-ui/icons/Description';
import IconButton from '@material-ui/core/IconButton'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LetterAvatar from '../components/LetterAvatar';
import { callApi } from '../utils/api'
import { connect } from 'react-redux'
import { clearSnackbarAction, closeSnackbarAction, enqueueSnackbarAction } from '../modules/dashboard/administartion/submodules/MultiFactorAuth/actions/snackbarActions'
import { logout } from '../modules/authentication/authActions'
import { getRefreshToken } from '../utils/auth'
import { Button } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  Nav: {
    display: 'flex',
    paddingBottom: '10px !important'
    // marginTop: '12px'
  },
  bellicon: {
    marginTop: '0px',
    width: '19px',
    height: '24px'
  },
  small: {
    width: '25px',
    height: '26px',
    // marginTop: '5px',
    marginLeft: '10px'
  },
  name: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    color: '#171717',
    marginLeft: '10px',
    // marginTop: '9px',
  },
  bulk: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    color: '#FFFFFF',
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
  containerdiv: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '5px',
    justifyContent: 'flex-end',
    flex: 1
  },
  icon: {
    color: '#363795'
  },
  menumargin: {
    marginTop: 40
  },
  flexdiv: {
    display: 'flex'
  },

}))


function ProfileHeader (props) {
  const classes = useStyles()
  const history = useHistory()
  const [dropbutton, setDropButton] = React.useState(null);
  const [data] = React.useState(props.profile || []);
  const [profileImage, setProfileImage] = React.useState('');

  
  const refreshToken = getRefreshToken()

  const handleDropClick = (event) => {
    setDropButton(event.currentTarget);
  };

  const handleDropClose = () => {
    setDropButton(null);
  };

  const handleClick= () => {
    const data = {
      refreshToken: refreshToken
    }

    // history.push('/auth')    
    callApi(`/authsrvc/auth/logout`, 'POST', data)
      .then(response => {
        props.dispatch(logout())
        // history.replace('/auth/login')
        history.push('/#/auth/login')
        props.dispatch(
          enqueueSnackbarAction({
            message: "User logged out successfully",
            options: {
              key: new Date().getTime() + Math.random(),
              variant: "success",
              action: (key) => (
                <Button onClick={() => props.dispatch(closeSnackbarAction(key))}>
                  x
                </Button>
              ),
            },
          })
        );
        document.cookie = `samlOneTimeToken` + "=; Max-Age=0";
        document.cookie = `tenantId` + "=; Max-Age=0";
        localStorage.clear();
        localStorage.setItem('logout',true);
        // setLogin(response.data.provisionedApps.CYMMETRI.login.login)
        // onClickReset()
      })
      .catch(error => {
        props.dispatch(logout());
        history.push('/auth');
        document.cookie = `samlOneTimeToken=; Max-Age=0`;
        document.cookie = `tenantId=; Max-Age=0`;
        localStorage.clear();
      })
  }

  const downloadUserProfile = () => {
    callApi(`/selfservice/api/selfservice/userprofile`, 'GET')
      .then(e => {
        if (e && e.success) {
          setProfileImage(e.data ? e.data.profilePic : '')
        }
      })
  }

  React.useEffect(() => downloadUserProfile(), [])

  return (
    <div className={classes.containerdiv}>
      {/* <IconButton>
        <NotificationsIcon className={classes.icon} />
      </IconButton> */}
      {/* <Avatar alt="Remy Sharp" src="data:image/jpeg;base64,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" className={classes.small} /> */}
      { profileImage && profileImage!=='' ? <Avatar src={`data:image/jpeg;base64,${profileImage}`} className={classes.small} /> :
      <LetterAvatar text={`${data.firstName} ${data.lastName}`} status={data.status} variant="dot" className={classes.small} />}
      <span className={classes.name}> {data.displayName} </span>
      <IconButton onClick={handleDropClick}><ArrowDropDownIcon className={classes.icon} /></IconButton>
      <Menu 
        anchorEl={dropbutton}
        keepMounted
        className={classes.menumargin}
        open={dropbutton}
        onClose={handleDropClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        > 
          <MenuItem>
            <div className={classes.flexdiv} >
              <RecentActors size="small" className={classes.base} />
              <a href='/#/welcome' target="_blank" style={{color:'#8998AC'}}>
                <span className={classes.settings}>Selfservice</span>
              </a>
            </div>
          </MenuItem>
          <MenuItem>
            <div className={classes.flexdiv} >
              <DescriptionIcon size="small" className={classes.base} />
              <a href='https://unotech.atlassian.net/wiki/spaces/CCV1/pages/8028224/Administrative+Management+Console' target="_blank" style={{color:'#8998AC'}}>
                <span className={classes.settings}>Documentation</span>
              </a>
            </div>
          </MenuItem>
          <MenuItem onClick={handleClick}>
            <div className={classes.flexdiv}>
              <ExitToAppIcon size="small" className={classes.base} />
              <span className={classes.settings}>Logout</span>
            </div>
          </MenuItem>
      </Menu>
    </div>
  )
}

export default connect()(ProfileHeader)
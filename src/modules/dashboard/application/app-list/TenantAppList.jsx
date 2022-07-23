import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { callImageApi, callApi } from '../../../../utils/api'
// import { isActiveForRoles } from '../../../../utils/auth'
import AppModal from '../../../../components/AppModal'
import AddUser from '../app-details/assignments/AddUser'
import ModalAssignGroup from '../app-details/assignments/AddGroup'
import { isActiveForRoles } from '../../../../utils/auth';

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
    width: '24px',
    height: '24px',
  },
  status: {
    backgroundColor: '#6ec497',
    fontSize: 'small',
    margin: '5px',
    color: '#fff',
    marginLeft: 15,
    borderRadius: 10,
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    paddingTop: '0.2rem',
    paddingBottom: '0.2rem'
  }
}));


export default function UserGridCard(props) {

  const defaultFilters = {
    "filter": {
      "applicationId": props.app.id,
      // "firstName": "string",
      // "lastName": "string"
    },
    "pageNumber": 0,
    "pageSize": 10,
    "sortDirection": "ASC",
    "sortOn": [
      "id"
    ]
  }

  const classes = useStyles();
  const [filters, _setFilters] = React.useState(defaultFilters)

  const { app } = props
  const [icon, setIcon] = React.useState([])
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [users, setUsers] = React.useState([])
  const [groups, setGroups] = React.useState([])
  const [userOpen, setUserOpen] = React.useState(false);
  const [groupOpen, setOpenGroup] = React.useState(false);

  const handleUserModalOpen = () => {
    setUserOpen(true);
  };
  const handleUserModalClose = () => {
    setUserOpen(false);
  };
  const handleGroupModalOpen = () => {
    setOpenGroup(true);
  };
  const handleGroupModalClose = () => {
    setOpenGroup(false);
  };

  const downloadUsersData = () => {
    callApi(`/usersrvc/api/user/listByApplication`, 'POST', filters)
      .then(e => {
        if (e.success) {
          setUsers(e.data ? e.data.content : [])
        }
      })
  }

  const downloadGroupsData = () => {
    callApi(`/usersrvc/api/group/listByApplication/${props.app.id}`, 'GET')
      .then(response => setGroups(response.data))
  }

  const downloadIcon = () => { callImageApi(app.id).then(setIcon) }
  React.useEffect(() => { downloadIcon() }, [])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    downloadUsersData()
    downloadGroupsData()
  };

  const handleClose = () => {
    setAnchorEl(null);
    setUsers([])
    setGroups([])
  };

  return (
    <div className={classes.root} style={{ background: '#fff', borderRadius: 15, padding: 25 }} >
      <img src={icon} alt=" " style={{ width: 40, height: 40 }} onClick={props.onClick} />
      <IconButton style={{ float: 'right', margin: '-15px -5px 0 0' }} onClick={handleClick} >
        <MoreHorizIcon />
      </IconButton>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={anchorEl}
        onClose={handleClose}
        className="nav nav-tabs" role="tablist">
        <MenuItem onClick={props.onClick}>
          <div style={{ display: 'flex' }}>
            <span className={classes.settings}>Settings</span>
          </div>
        </MenuItem>
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','APP_ADMIN']) && 
          <MenuItem onClick={handleUserModalOpen}>
            <div style={{ display: 'flex' }}>
              <span className={classes.settings}>Assign User</span>
            </div>
          </MenuItem> 
        }
        {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','APP_ADMIN']) && 
          <MenuItem onClick={handleGroupModalOpen}>
            <div style={{ display: 'flex' }}>
              <span className={classes.settings}>Assign Group</span>
            </div>
          </MenuItem> 
        }
      </Menu>
      <h4 style={{ color: '#363795', display: 'flex', alignItems: 'center', margin: '10px 0 0' }} onClick={props.onClick}>
        <b style={{ fontWeight: 'bold', fontSize: 18 }}>{app.appName}</b>
        {/* <div className={classes.status}>
          {app.status}
        </div> */}
      </h4>

      <div style={{ fontSize: 12, color: '#8491A7', margin: '5px 0 20px 0', fontWeight: 'bold' }} onClick={props.onClick}>
        {app.tagLine}
      </div>

      <AppModal
        open={userOpen}
        onClose={handleUserModalClose} title="Assign User">
        <AddUser app={app} assignedUsers={users} onUpdate={downloadUsersData} />
      </AppModal>
      <AppModal
        open={groupOpen}
        onClose={handleGroupModalClose} title="Assign a Group">
        <ModalAssignGroup app={app} assignedGroups={groups} onUpdate={downloadGroupsData} />
      </AppModal>
      {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14, marginBottom: 5, fontWeight: 'bold' }}>
        <label htmlFor="file" style={{ color: '#555', width: 60 }}>Users</label> */}
      {/* &nbsp;&nbsp;&nbsp;
        <div style={{ backgroundColor: '#ddd', flex: 1, borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ height: 7, width: '30%', backgroundColor: '#363794'}} />
        </div> */}
      {/* &nbsp;&nbsp;&nbsp;
        <label htmlFor="file" style={{ color: '#555', width: 40, textAlign: 'right'  }}>21120</label>
      </div> */}

      {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14, fontWeight: 'bold' }}>
        <label htmlFor="file" style={{ color: '#555', width: 60 }}>Groups</label> */}
      {/* &nbsp;&nbsp;&nbsp;
        <div style={{ backgroundColor: '#ddd', flex: 1, borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ height: 7, width: '80%', backgroundColor: '#363794'}} />
        </div> */}
      {/* &nbsp;&nbsp;&nbsp;
        <label htmlFor="file" style={{ color: '#555', width: 40, textAlign: 'right' }}>20</label>
      </div> */}
    </div>
  )
}

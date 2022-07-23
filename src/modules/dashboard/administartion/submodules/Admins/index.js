import React from 'react';
import Delete from '../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/Delete.svg';
import Plus from '../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/plus.svg';
import Edit from '../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/edit.svg';
import Admin from '../../../../../FrontendDesigns/master-screen-settings/assets/img/admin.png';

import '../../../../../FrontendDesigns/master-screen-settings/assets/css/main.css';
import '../../../../../FrontendDesigns/master-screen-settings/assets/css/nice-select.css';
import '../../../../../FrontendDesigns/master-screen-settings/assets/css/settings.css';
import { callApi } from '../../../../../utils/api';
import LetterAvatar from '../../../../../components/LetterAvatar';
import DeleteModal from '../../../../../components/DeleteModal';
import { showSuccess } from '../../../../../utils/notifications';
import { makeStyles } from '@material-ui/core/styles';
import {isActiveForRoles} from '../../../../../utils/auth'

const useStyles = makeStyles((theme) => ({
  container: { 
    overflow: 'auto' 
  },
  letteravatar: { 
    height: 50, 
    width: 50 
  }
}))

export default function AdminAdmins(props) {
  const [data, setData] = React.useState([])
  const [open, setOpen] = React.useState(false);
  const [roleId, setRoleId] = React.useState(null);
  const [userId, setUserId] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const classes = useStyles()
  const downloadAdmins = () => {
    callApi('/usersrvc/api/user/listAdmins')
      .then(e => setData(e.data))
  }

  const getAdminToDelete = (u, r) => {
    setRoleId(r.roleId)
    setUserId(u.id)
    handleModalOpen()
  }

  const deleteAdmin = (u, r) => {
    const body = {
      roleId: r,
      userId: u
    }
    setSaving(true)
    callApi(`/usersrvc/api/user/unassignDefaultAppRole`, 'PUT', body)
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('Admin removed Successfully!')
          downloadAdmins()
          handleModalClose()
        }
      })
      .catch(() => setSaving(false))
  }

  const handleModalOpen = () => { setOpen(true); };
  const handleModalClose = () => { setOpen(false); };

  React.useEffect(() => downloadAdmins(), [])

  return (
    <div className="AdminAdmins" className={classes.container}>
      <div className="pt-4 d-flex flex-column flex-md-row align-items-center justify-content-between">
        <div className="col-12 col-sm-12 col-md-5">
          {/* <input type="text" value="" className="form-input" placeholder="Search" /> */}
        </div>
        {isActiveForRoles(['ORG_ADMIN']) && <div className="mt-3 mt-sm-3 mt-mb-0">
          <a href="JavaScript:void(0)" onClick={() => props.history.push('/dash/admin/admins/add')} class="primary-btn-view"><img src={Plus} alt="" title="" /> Add New</a>
        </div>}
      </div>
      {
        data
        .filter(d => d.users.length > 0)
        .map((d, i) => {
          return (
            <div className="cym-admin-list-row mt-4" key={i}>
              <h3 className="admin-row-heading mb-3">{d.role.label}</h3>
              <div className="row">
                {d.users.map(u => (
                  <div key={u.id} className="col-12 col-sm-12 col-md-12 col-lg-6 mb-3 mb-sm-3  mb-md-3 mb-lg-0">
                    <div className="admin-col mb-2">
                      <div className="d-flex flex-column flex-sm-row flex-md-row justify-content-between align-items-center">
                        <div className="admin-detail-view d-flex flex-column flex-sm-column flex-md-row align-items-center">
                          <div className="img-view">
                            <LetterAvatar className={classes.letteravatar} text={u.displayName} profileImage={u.profilePic} status={u.status} />
                            {/* <img src={Admin} alt="" title="" /> */}
                            <span className="status avail"></span>
                          </div>
                          <div className="pl-3">
                            <h3>{u.displayName}</h3>
                            <span>{u.designation || 'no designation'}</span>
                          </div>
                        </div>
                        {isActiveForRoles(['ORG_ADMIN']) && <div className="actions-view">
                          {/* <a href="javascript:void(0)"><img src={Edit} alt="" title="" /></a> */}
                          {/* <a onClick={() => deleteAdmin(u, d.role)} ><img src={Delete} alt="" title="" /></a> */}
                          <a onClick={() => getAdminToDelete(u, d.role)} ><img src={Delete} alt="" title="" /></a>
                          {/* {open && userId && roleId ? (<DeleteModal open={open} onClose={handleModalClose} onDelete={() => deleteAdmin(userId, roleId)} />) : (<></>)} */}
                        </div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      }
      {open && userId && roleId ? (<DeleteModal open={open} onClose={handleModalClose} saving={saving} onDelete={() => deleteAdmin(userId, roleId)} />) : (<></>)}
    </div>
  )
}

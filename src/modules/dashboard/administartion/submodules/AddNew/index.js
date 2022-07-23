import React from 'react'
import '../../../../../FrontendDesigns/new/assets/css/main.css';
import '../../../../../FrontendDesigns/new/assets/css/nice-select.css';
import '../../../../../FrontendDesigns/new/assets/css/settings.css';
import Admin from '../../../../../FrontendDesigns/new/assets/img/admin.png';
import { callApi } from '../../../../../utils/api';
import { showSuccess } from '../../../../../utils/notifications';
import LetterAvatar from '../../../../../components/LetterAvatar';
import {isActiveForRoles} from '../../../../../utils/auth'
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  letteravatar: {
    width: 50, 
    height: 50 
  }
}))
function AddNew(props) {
  const [roles, setRoles] = React.useState([])
  const [role, setRole] = React.useState()
  const [user, setUser] = React.useState()
  const [saving, setSaving] = React.useState(false)

  const classes = useStyles()
  const download = () => {
    callApi('/utilsrvc/user/role/list').then(data => setRoles(data.data))
    callApi(`/usersrvc/api/user/${props.match.params.id}`).then(d => setUser(d.data))
      // uid  5f2a55c243141a30871f3fcf
      // role 5f2fe0bf537c033ecb9e272b
      // callApi('/utilsrvc/user/role/add', 'POST', {
      //   "description": "All the super duper admisn go in here",
      //   "label": "Super Admins",
      //   "roleId": "SUPER_ADMIN"
      // })
    }

    const addUser = () => {
      setSaving(true)
      callApi('/usersrvc/api/user/assignDefaultAppRole', 'PUT', {
        roleId: role.roleId,
        userId: props.match.params.id
      })
      .then(() => {
        setSaving(false)
        props.history.push('/dash/admin/admins/list')
        showSuccess('Admin has been added')
      })
      .catch(() => setSaving(false))
  }

  React.useEffect(() => download(), [])

  if (!user) return <div />

  return (
    <div classNameName="AddNew">
      <div className="cym-app">
        <div className="add-admin-view pt-4 w-100">
          <h1 className="text-center mb-3">Add New Admin</h1>
          <div className="add-admin-roles w-75 m-auto">
            <div className="row">
              <div className="col-12 col-sm-12 col-md-12 col-lg-8">
                <div className="admin-col">
                  <div className="d-flex flex-column flex-sm-column flex-md-row justify-content-between align-items-center">
                    <div className="admin-detail-view d-flex flex-row align-items-center">
                      <div className="img-view">
                        <LetterAvatar className={classes.letteravatar} text={user.displayName} status={user.status} />
                        <span className="status avail"></span>
                      </div>
                      <div className="pl-3">
                        <h3>{user.displayName}</h3>
                        <span>{user.designation || 'no designation'}</span>
                      </div>
                    </div>
                    <div className="actions-view">
                      <a onClick={props.history.goBack}><img src="assets/img/icons/close.svg" alt="" title="" /></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="assign-roles-view cym-custom-scroll mt-4">
              <h5 className="mb-2">Assign Role</h5>
              <div className="row">
                {
                  roles.map((r, i) => (
                    <div id={r.id} key={r.id} className="col-12 col-sm-12 col-md-12 col-lg-6">
                      <div className="assign-role-col mb-3">
                        <div className="custom-radio">
                          <input type="radio" name="user" id={i} onClick={() => setRole(r)} />
                          <label htmlFor={i} className="mb-0">{r.label}</label>
                          <span className="d-block">
                            {r.description}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
              {
                role && isActiveForRoles(['ORG_ADMIN']) && (
                  <Button disabled={saving} onClick={addUser} variant="contained" color="primary">{!saving ? 'Add User' : 'Adding...'}</Button>
                  // <div onClick={addUser} className="primary-btn-view">
                  //   Add User
                  // </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AddNew
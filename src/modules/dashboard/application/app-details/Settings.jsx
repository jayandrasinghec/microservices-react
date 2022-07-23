import React from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import AppTextInput from '../../../../components/form/AppTextInput'

import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit';

import { CircularProgress } from '@material-ui/core'
import { callApi } from '../../../../utils/api'
import { showSuccess } from '../../../../utils/notifications'
import {isActiveForRoles} from '../../../../utils/auth'
import '../../../../FrontendDesigns/new/assets/css/main.css'
import LogGAuth from '../../../../assets/google-authenticator.png'

export default function UserLayout(props) {
  const [data, setData] = React.useState([])
  const [editable, setEditable] = React.useState(false);
  const [saving, setSaving] = React.useState(false)
  const [errors, _setErrors] = React.useState({})

  const downloadUsers = () => {
    callApi(`/provsrvc/applicationTenant/getSettingsById/${props.app.id}`)
      .then(response => setData(response.data))
      .catch(error => {})
  }
  React.useEffect(() => downloadUsers(), [])

  const visibility = [];
  for (const key in data.visibility) {
    const obj = data.visibility[key];
    visibility.push(obj);
  }

  const autoSubmit = [];
  for (const key in data.autoSubmit) {
    const obj = data.autoSubmit[key];
    autoSubmit.push(obj);
  }

  const module = [];
  for (const key in data.module) {
    const obj = data.module[key];
    module.push(obj);
  }

  const handleEdit = () => {
    setEditable(!editable);
  }
  const onClick = () => {
    setSaving(true)
    setData.visibility=visibility
    setData.autoSubmit=autoSubmit
    callApi(`/provsrvc/applicationTenant/updateSettings/${props.app.id}`, 'PUT', data)
      .then(response => {
        setSaving(false)
        setData(response.data)
        showSuccess('Settings has been updated!')
        setEditable(false)
        props.onUpdate()
      })
      .catch(() => setSaving(false))
  }
  const setError = e => _setErrors({ ...errors, ...e })

  const isValid = data.displayName
  const checkDname = () => setError({ displayName: (data.displayName || '').length > 0 ? null : 'Display name is required' })

  if (!data) return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress color="secondary" />
    </div>
  )

  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
      <Grid container spacing={3} style={{ overflowY: 'auto', overflowX: 'hidden', marginBottom: 15, marginTop: 30, width: '100%' }}>
        <Grid item xs={12} style={{ paddingTop: 0, marginLeft: '15px' }}>
          <div style={{  }}>
          <div style={{ backgroundColor: 'white', borderRadius:'10px', padding: 15 , lineHeight: 1.5 }}>
              <Grid container spacing={5}>
                <Grid item xs={5} style={{ textAlign: 'right' }}>
                  <label>Application Label</label>
                </Grid>
                <Grid item xs={7} style={{ display: 'flex' }}>
                  <label style={{ fontSize: 'larger' }}>
                    {editable ? (
                      <AppTextInput
                        defaultValue = {data.displayName}
                        onChange={e => data.displayName=e.target.value }
                        onBlur={checkDname}
                        helperText={errors.displayName}
                        error={!!errors.displayName}
                      />
                    ) : (
                      <b>{data.displayName}</b>
                    )}

                    {
                      isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','APP_ADMIN']) && 
                      (<IconButton onClick={handleEdit} >
                        <img src="assets/img/icons/edit.svg" alt="" title="" />
                      </IconButton>
                      )
                    }
                  </label>
                </Grid>
              </Grid>
              <Grid container spacing={5}>
                <Grid item xs={5} style={{ textAlign: 'right' }}>
                  <label>Modules</label>
                </Grid>
                <Grid item xs={7}>
                  <label>
                    {editable ? (
                      module.map((u,key) => {
                        const icon = u.value.icon
                        const img = icon ? `data:image/jpeg;base64,${icon}` : LogGAuth
                        return(
                          <div key={key} style={{ display: 'flex' }}>
                            <div className="custom-checkbox" style={{ marginTop: -5 }}>
                              <input type="checkbox" name="checkedCA" id={u} defaultChecked
                                onChange={e => u.value=e.target.checked }
                              /> <label htmlFor={u} />
                            </div>
                          <img src={img} width={25} height={25} />
                          &nbsp;&nbsp;&nbsp;<span>{u.label || 'NA'}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          </div>                        )
                      })
                      ) : (
                      module.map((u,key) => {
                        const icon = u.value.icon
                        const img = icon ? `data:image/jpeg;base64,${icon}` : LogGAuth
                        return(
                          <div key={key} style={{ display: 'flex' }}>
                            <div className="custom-checkbox" style={{ marginTop: -5 }}>
                              <input type="checkbox" name="checkedCA" id={u} defaultChecked
                                disabled={isActiveForRoles(['READ_ONLY'])}
                                onChange={e => u.value=e.target.checked }
                              /> <label htmlFor={u} />
                            </div>
                          {/* <Checkbox color="primary" style={{ width: 16, height: 16, marginTop: '-15px' }} defaultChecked name="s1" defaultValue={1} width={25} height={25} />&nbsp;&nbsp; */}
                          <img src={img} width={25} height={25} />
                          &nbsp;&nbsp;&nbsp;<span>{u.label || 'NA'}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          </div>
                        )
                      })
                    )}
                  </label>
                </Grid>
              </Grid>
              <Grid container spacing={5}>
                <Grid item xs={5} style={{ textAlign: 'right' }}>
                  <label>Visibility</label>
                </Grid>
                <Grid item xs={7}>
                  <label>
                    {editable ? (
                      visibility.map((u,key) => {
                        return(
                          <div key={key} style={{ display: 'flex', marginBottom: 10 }}>
                            <div className="custom-checkbox">
                              <input type="checkbox" name={u.label} id={u.label} defaultChecked={u.value}
                                onChange={e => u.value=e.target.checked }
                              /> <label htmlFor={u.label} />
                            </div>
                            <div style={{ fontSize: '14px', marginLeft: 15, marginTop: -1 }}> {u.label} </div></div>
                        )
                      })
                      ) : (
                      visibility.map((u,key) => {
                        return(
                          <div key={key} style={{ display: 'flex', marginBottom: 10 }}>
                            <div className="custom-checkbox">
                              <input type="checkbox" name={u.label} id={u.label} defaultChecked={u.value}
                                onChange={e => u.value=e.target.checked }
                                disabled={isActiveForRoles(['READ_ONLY'])}
                              /> <label htmlFor={u.label} />
                            </div>
                            <div style={{ fontSize: '14px', marginLeft: 10, marginTop: 5 }}> {u.label || 'NA'} </div></div>
                        )
                      })
                    )}
                  </label>
                </Grid>
              </Grid>
              {/* <Grid container spacing={5}>
                <Grid item xs={5} style={{ textAlign: 'right' }}>
                  <label>Browser Plugin Auto Submit</label>
                </Grid>
                <Grid item xs={7}>
                  <label style={{ fontSize: 14 }}>
                    {editable ? (
                      autoSubmit.map((u,key) => {
                        return(
                          <div key={key} style={{ display: 'flex' }}>
                            <div className="custom-checkbox">
                              <input type="checkbox" name={u.label} id={u.label} defaultChecked={u.value}
                                onChange={e => u.value=e.target.checked }
                              /> <label htmlFor={u.label} />
                            </div><span style={{ fontSize: '14px', marginTop: -1, marginLeft: 15 }}>
                            <AppTextInput
                              defaultValue = {u.description || 'NA'}
                              onChange={e => u.description=e.target.value }
                            />
                          </span></div>
                        )
                      })
                      ) : (
                      autoSubmit.map((u,key) => {
                        return(
                          <div key={key} style={{ display: 'flex', marginBottom: 10 }}>
                            <div className="custom-checkbox">
                              <input type="checkbox" name={u.label} id={u} defaultChecked={u.value}
                                onChange={e => u.value=e.target.checked }
                              /> <label htmlFor={u} />
                            </div>
                            <span style={{ fontSize: '14px', marginTop: 8, marginLeft: 15 }}> {u.description ? u.description : 'NA'} </span></div>
                        )
                      })
                    )}
                  </label>
                </Grid>
              </Grid> */}
              <Grid container spacing={5}>
                <Grid item xs={5} style={{ textAlign: 'right' }}>
                  <label>Notes for End Users</label>
                </Grid>
                <Grid item xs={7}>
                  {editable ? (
                    <AppTextInput
                      // rows={3}
                      multiline
                      defaultValue = {data.notes.userNotes.value || 'NA'}
                      onChange={e => data.notes.userNotes.value=e.target.value }
                      />
                  ) : (
                    <label style={{ fontSize: 14 }}>
                      {data.notes != null ? (data.notes.userNotes != null ? data.notes.userNotes.value : 'NA') : 'NA'}
                    </label>
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={5}>
                <Grid item xs={5} style={{ textAlign: 'right' }}>
                  <label>Notes for Admin Users</label>
                </Grid>
                <Grid item xs={7}>
                  {editable ? (
                    <AppTextInput
                      // rows={3}
                      multiline
                      defaultValue = {data.notes.adminNotes.value || 'NA'}
                      onChange={e => data.notes.adminNotes.value=e.target.value }
                    />
                  ) : (
                    <label style={{ fontSize: 14 }}>
                      {data.notes != null ? (data.notes.adminNotes != null ? data.notes.adminNotes.value : 'NA') : 'NA'}
                    </label>
                  )}
                </Grid>
              </Grid>

            </div>
            {
              editable && (
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 15 }}>
                  <div onClick={handleEdit} style={{ marginRight: 20, cursor: 'pointer' }}>Cancel</div>
                  <Button disabled={!isValid || saving} variant="contained" color="primary" onClick={onClick} onUpdate={downloadUsers}>{!saving ? 'Save' : 'Saving...'}</Button>
                </div>
              )
            }
          </div>
        </Grid>
        {/* <Grid item xs={3} style={{ paddingTop: 0, marginLeft: '15px', marginTop: '0px' }}>
          <div style={{ backgroundColor: '#F1E09A', padding: '15px' }}>
            <div>? Help</div>
            <div style={{ fontSize: '12px', marginTop: '10px' }}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. At architecto consequatur ea eveniet fugiat labore esse quae sunt soluta tempore. Debitis quia sint aliquid ea similique, a ipsum reprehenderit? Illo.</div>
          </div>
        </Grid> */}
      </Grid>
    </div>
  )
}
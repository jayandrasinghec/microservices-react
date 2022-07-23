/* eslint-disable react/display-name */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Plus from '../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/plus.svg';
import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications'
import Modal from '@material-ui/core/Modal';
import Edit from '../../../../../FrontendDesigns/new/assets/img/icons/edit.svg'
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close'

import '../../../../../FrontendDesigns/master-screen-settings/assets/css/settings.css';
import '../../../../../FrontendDesigns/master-screen-settings/assets/css/nice-select.css';


import AppCheckbox from '../../../../../components/form/AppCheckbox';
import AppTextInput from '../../../../../components/form/AppTextInput';
import { isActiveForRoles } from '../../../../../utils/auth';
import AppMasterInput from '../../../../../components/form/AppMasterInput';
// import AppSelectInput from '../../../../../../components/form/AppSelectInput';



function getModalStyle() {
  const top = 28;
  const left = 35;

  return {
    top: `${top}%`,
    left: `${left}%`,
  };
}


const useStyles = makeStyles(theme => ({
  paper: {
    position: 'fixed',
    width: 500,
    backgroundColor: 'white',
    borderRadius: '20px',
    textAlign: 'center',
    alignItems: 'center',
    display: 'block'
  },
  content: {
    width: 500,
    backgroundColor: '#E9EDF6',
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: '0px 0px 20px 20px',
    display: 'block'
  },
  modalheader: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '19px',
    lineHeight: '21px',
  },
  modalcontent: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '21px',
  },
  modalcancel: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '21px',
    color: '#363795',
  },
  ruleTable: {
    // paddingBottom: "0px !important",
    // marginBottom: '-16px',
    '& .MuiToolbar-gutters': {
      padding: "0px !important",
      '& .MuiTextField-root': {
        border: "1px solid #ccc",
        borderRadius: "4px",
        paddingLeft: "8px",
        '& .MuiInput-underline:before': {
          display: "none",
        },
        '& .MuiInput-underline:after': {
          display: "none",
        }
      },

      '& .MuiIconButton-root:hover': {
        background: "transparent",
        '& .MuiTouchRipple-root': {
          display: "none"
        }
      }
    },

    '& table': {
      // overflowX: 'none',
      border: '1px solid #ddd',
      // borderCollapse: "separate",
      borderSpacing: "0",
    },
    '& th ': {
      padding: "16px !important",
    },
    '& td ': {
      borderBottom: 0,
    },
    '& .MuiPaper-root': {
      boxShadow: "none",
      background: "transparent"
    },
    '& .MuiTablePagination-caption': {
      display: "unset !important",
      position: "absolute",
      color: "#a9b2c3",
    },
    '& .MuiTableCell-footer': {
      borderBottom: '0px',
      '& .MuiTablePagination-selectRoot': {
        background: "#282a73",
        borderRadius: "20px",
        color: "#fff",
        '& svg': {
          color: "#fff"
        }
      },
      '& .MuiButton-contained.Mui-disabled': {
        background: "transparent",
      }
    },
  },
  rulesSearchAdd: {
    float: 'right',
  },
  tableAddIcon: {
    height: 32,
  },
  editDeleteIcon: {
    '& img': {
      width: "16px",
      height: "16px",
    }
  },
  cardViewWrapper: {
    padding: theme.spacing(3, 2),
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
  },
  pointer: { 
    cursor: 'pointer' 
  },
  button: { 
    float: 'right', 
    borderRadius: '8px', 
  }
}));

export default function AddRoleButton(props) {
  const defaultData = {
    applicationId: props.app.id,
    active: false
  }
  const classes = useStyles()
  const [newData, setNewData] = React.useState(defaultData)
  const [errors, _setErrors] = React.useState({})
  const [saving, setSaving] = React.useState(false)
  const [changed, setChanged] = React.useState(false)

  React.useEffect(() => {
    setNewData(props.row)
  }, [props.open])

  const change = e => {
    setNewData({ ...newData, ...e })
    setChanged(true)
  }
  const setError = e => _setErrors({ ...errors, ...e })

  const isValid = newData.roleName && newData.roleDescreption && newData.roleId && newData.cosoType

  const checkCname = () => setError({ name: (newData.roleName || '').length > 1 ? null : 'Console Display name is required' })
  const checkDes = () => setError({ description: (newData.roleDescreption || '').length > 1 ? null : 'Description is required' })
  const checkCoso = () => setError({ cosoType: (newData.cosoType || '').length > 1 ? null : 'COSO Type is required' })

  const onSubmit = () => {
    setSaving(true)
    callApi(`/provsrvc/applicationRole/update`, 'POST', newData)
      .then(e => {
        setSaving(false)
        setChanged(false)
        if (e.success) {
          showSuccess('Role Updated Successfully!')

          props.onUpdate()
        }
      })
      .catch(() => {
        setSaving(false)
        setChanged(false)
      })
  }

  
  return (
    <Modal open={props.open} onClose={props.onUpdate}>
      <div>
        <div className="settings-add-new-global-modal" id="centralModalSm" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
          aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title w-100" id="myModalLabel">Edit Application Role</h4>
                <span aria-hidden="true"><CloseIcon className={classes.pointer} onClick={props.onUpdate} /></span>
              </div>
              <div className="modal-body">
                <form>
                  <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center mb-3">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
                      <AppTextInput
                        required
                        value={newData.roleName}
                        error={!!errors.name}
                        onBlur={checkCname}
                        helperText={errors.name}
                        disabled={isActiveForRoles(['READ_ONLY'])}
                        onChange={e => change({ roleName: e.target.value })}
                        label="Role Name" />
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto">
                      <AppTextInput
                        required
                        value={newData.roleDescreption}
                        error={!!errors.description}
                        onBlur={checkDes}
                        helperText={errors.description}
                        disabled={isActiveForRoles(['READ_ONLY'])}
                        onChange={e => change({ roleDescreption: e.target.value })}
                        label="Description" />
                    </div>
                  </div>
                  <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center mb-3">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
                      <AppMasterInput
                        required
                        masterType="ApplicationCOSO"
                        label="COSO Type"
                        value={newData.cosoType}
                        error={!!errors.cosoType}
                        // onBlur={checkUserType}
                        onBlur={checkCoso}
                        helperText={errors.cosoType}
                        onChange={e => change({ cosoType: e.target.value })} />
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto">
                      <AppTextInput
                        required
                        value={newData.roleId}
                        // error={!!errors.description}
                        onBlur={checkDes}
                        placeholder={"ROLE_ID_2"}
                        disabled={isActiveForRoles(['READ_ONLY'])}
                        // helperText={errors.description}
                        onChange={e => change({ roleId: e.target.value })}
                        label="Role ID" />
                    </div>
                  </div>
                  <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
                      <AppCheckbox
                        value={newData.active} onChange={e => change({ active: Boolean(e) })}
                        switchLabel={newData.active ? 'Active' : 'Inactive'}
                        disabled={isActiveForRoles(['READ_ONLY'])}
                        label="Status" />
                    </div>
                    {/* <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto">
                    <AppSelectInput
                      label="Type"
                      value={newMaster.type} onChange={e => change({ type: e.target.value })}
                      options={drop.map(o => o.type)} />
                  </div> */}
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-left btn-sm mr-auto" onClick={props.onUpdate}>Discard</button>
                <Button 
                  disabled={isActiveForRoles(['READ_ONLY']) || !isValid || saving || !changed} 
                  onClick={onSubmit} 
                  variant="contained" 
                  className={classes.button}
                  color="primary"
                >
                  {!saving ? 'Save' : 'Saving...'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

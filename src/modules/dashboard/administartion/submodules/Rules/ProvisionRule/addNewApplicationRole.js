/* eslint-disable react/display-name */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Plus from '../../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/plus.svg';
import { callApi } from '../../../../../../utils/api'
import { showSuccess } from '../../../../../../utils/notifications'
import Modal from '@material-ui/core/Modal';
import Dustbin from '../../../../../../assets/Dustbin.png'
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from '@material-ui/icons/Close'

import '../../../../../../FrontendDesigns/master-screen-settings/assets/css/settings.css';
import '../../../../../../FrontendDesigns/master-screen-settings/assets/css/nice-select.css';

import AppCheckbox from '../../../../../../components/form/AppCheckbox';
import AppTextInput from '../../../../../../components/form/AppTextInput';
import AddNewModal from '../../../../../../components/AddNewComponent'
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
  displayflex: {
    display: 'flex'
  },
  pointer: {
    cursor: 'pointer'
  },

}));

export default function AddRoleButton(props) {
  const defaultData = {
    applicationId: props.appId,
    // roleId: 'ROLE_ID_2',
    // "name":"password policy name2",
    // "description":"description",
    active: false,
    roleId:'',
    roleDescreption:'',
    roleName:''
  }
  const classes = useStyles()
  const [addopen, addsetOpen] = React.useState(false);
  const [newData, setNewData] = React.useState(defaultData)
  const [errors, _setErrors] = React.useState({})
  const [saving, setSaving] = React.useState(false)

  const change = e => setNewData({ ...newData, ...e })
  const setError = e => _setErrors({ ...errors, ...e })

  const isValid = newData.roleName && newData.roleDescreption && newData.roleId

  const checkCname = () => setError({ name: (newData.roleName || '').length > 1 ? null : 'Role name is required' })
  const checkDes = () => setError({ description: (newData.roleDescreption || '').length > 1 ? null : 'Description is required' })
  const checkId = () => setError({ id: (newData.roleId || '').length > 1 ? null : 'Role Id is required' })


  const onSubmit = () => {
    setSaving(true)
    callApi(`/provsrvc/applicationRole/create`, 'POST', newData)
      .then(e => {
        setSaving(false)
        if (e.success) {

          showSuccess('Role Created Successfully!')
          addhandleModalClose()
        //   props.onAdd()
        props.getSelectedApplicationRole(props.appId)
        }
      })
      .catch(() => setSaving(false))
  }

  const addhandleModalOpen = () => {
    addsetOpen(true);
    setNewData(defaultData);
  };

  const addhandleModalClose = () => {
    addsetOpen(false);
    setNewData(defaultData);
  };

  const addbody = (
    <AddNewModal
    title="Add New Role"
    onClose={addhandleModalClose}
    disabled={!isValid || saving}
    saving={saving}
    onSubmit={onSubmit}
    body={
      <form>
        <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center mb-3">
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
            <AppTextInput
              required
              value={newData.roleName}
              error={!!errors.name}
              onBlur={checkCname}
              helperText={errors.name}
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
              onChange={e => change({ roleDescreption: e.target.value })}
              label="Description" />
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto">
          <AppTextInput
            required
            value={newData.roleId}
            error={!!errors.id}
            onBlur={checkId}
            placeholder={"ROLE_ID_2"}
            helperText={errors.id}
            onChange={e => change({ roleId: e.target.value })}
            label="Role ID" />
        </div>
        <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center">
          <div className="col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
            <AppCheckbox
              value={newData.active} onChange={e => change({ active: Boolean(e) })}
              switchLabel={newData.active ? 'Active' : 'Inactive'}
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
    }
  />
  )

  return (
    <div className={classes.displayflex}>
        {/* <div onClick={addhandleModalOpen} className={classes.pointer} className="primary-btn-view">
        <img src={Plus} alt="" title /> Add Role</div> */}
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                disableElevation
                disableFocusRipple
                disableRipple
                disabled={props.appId ? false : true}
                className={classes.tableAddIcon}
                onClick={addhandleModalOpen}
                >
                Add Role
            </Button>
        <Modal open={addopen} onClose={addhandleModalClose}>
            {addbody}
        </Modal>
    </div>
  )
}

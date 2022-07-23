import React,{useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import PersonIcon from "@material-ui/icons/Person";
import CloseIcon from "@material-ui/icons/Close";
import Modal from "@material-ui/core/Modal";
import {
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
  Tooltip
} from "@material-ui/core";
import { callApi, callImageApi } from "../../../../utils/api";
import { showSuccess } from "../../../../utils/notifications";
import { isActiveForRoles } from "../../../../utils/auth";
import "../../../../FrontendDesigns/master-screen-settings/assets/css/profile.css";
import Delete from "../../../../FrontendDesigns/master-screen-settings/assets/img/icons/Delete.svg";
import DeleteModal from "../../../../components/DeleteModal";
import GroupIcon from "@material-ui/icons/Group";
import TextField from "@material-ui/core/TextField";
import { MenuItem } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ClearIcon from "@material-ui/icons/Clear";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CustomInputLabel from "../../../../components/HOC/CustomInputLabel";
import ReplayIcon from '@material-ui/icons/Replay';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import DeprovisionModal from "../../../../components/DeprovisionModal";
import RetryModal from "../../../../components/RetryModal";
import delIcon from '../../../../assets/Delete.png';
const editIcon="assets/img/icons/edit.svg"


const mapStatus = (status) => {
  switch (status) {
    case "PENDING_CREATE":

      return { status: "PENDING_CREATE", message: "Application in pending creation state", color: "yellow", action: { delete: true, edit: false, deprovision: false, retry: true } }
    case "PENDING_UPDATE":

      return { status: "PENDING_UPDATE", message: "Application in pending updation state", color: "yellow", action: { delete: false, edit: false, deprovision: true, retry: true } }
    case "PENDING_DELETE":

      return { status: "PENDING_DELETE", message: "Application in pending deletion state", color: "yellow", action: { delete: false, edit: false, deprovision: true, retry: false } }
    case "SUCCESS_CREATE":

      return { status: "SUCCESS_CREATE", message: "Application assigned", color: "green", action: { delete: false, edit: true, deprovision: true, retry: false } }
    case "SUCCESS_UPDATE":

      return { status: "SUCCESS_UPDATE", message: "Application updated completed", color: "green", action: { delete: false, edit: true, deprovision: true, retry: false } }

    case "FAIL_CREATE":

      return { status: "FAIL_CREATE", message: "Application in fail creation state", color: "red", action: { delete: true, edit: false, deprovision: false, retry: true } }
    case "FAIL_UPDATE":

      return { status: "FAIL_UPDATE", message: "Application in fail updation state", color: "red", action: { delete: false, edit: false, deprovision: true, retry: true } }
    case "FAIL_DELETE":

      return { status: "FAIL_DELETE", message: "Application in fail deletion state", color: "red", action: { delete: false, edit: false, deprovision: true, retry: false } }

    case "SUCCESS_SSO":
      return { status: "SUCCESS_SSO", message: "SSO enabled", color: "green", action: { delete: true, edit: true, deprovision: false, retry: false } }

    default:
      return { status: "SUCCESS_CREATE", message: "Application Assigned", color: "green", action: { delete: false, edit: false, deprovision: false, retry: false}}
  }

}

const useStyles = makeStyles(() => ({
  textField: {
    backgroundColor: "#F7F7F7",
  },
  label: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5,
  },
  input: {
    height: 40,
  },
  selectRoot: {
    height: 40,
    lineHeight: 2,
  },
  select: {
    lineHeight: "40px",
    height: 40,
    paddingTop: 0,
    paddingBottom: 0,
    verticalAlign: "middle",
  },
  customChip: {
    background: "#4e97c8",
    borderRadius: 4,
    marginRight: 16,
    marginBottom: 16,
    marginTop: 10,
    "&:hover, &:focus": {
      background: "#4e97c8",
    },
    "& span": {
      color: "#fff",
    },
    "& svg": {
      color: "#fff",
    },
  },
  tooltipFont: {
    fontSize: '15px'
  }
}));




export default function RecipeReviewCard(props) {
  const { application, user } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [deprovisionDialog, setDeprovisionDialog] = React.useState(false);
  const [retryDialog, setRetryDialog] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [icon, setIcon] = React.useState([]);
  const [roles, setRoles] = React.useState([]);
  const [addRoles, setAddRoles] = React.useState([]);
  const [userRoles, setUserRoles] = React.useState([]);
  const [appRoles, setAppRoles] = React.useState([]);
  const appId = application.appId;
  const [roleIds, setRoleIds] = React.useState(
    user.provisionedApps[appId] && user.provisionedApps[appId]["assignedRoles"]
      ? user.provisionedApps[appId]["assignedRoles"]
      : []
  );
  const [isLoading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const handleModalOpen = () => {
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
  };

  // Created new array to map user roles in chips
  // let rolePills = []
  // let optionsArr = roles
  // roles.map((role, i) => {
  //   roleIds.map(roleId => {
  //     if(roleId === role.id) {
  //       rolePills.push(role)
  //       optionsArr.splice(i, 1);
  //     }
  //   })
  // })


  const updateModalRoles = (data) => {
    let rolePills = [];
    let optionsArr = data;
    for (var i = 0; i < optionsArr.length; i++) {
      if (roleIds.includes(optionsArr[i].id)) {
        rolePills.push(optionsArr[i]);
        optionsArr.splice(i, 1);
        i--;
      }
    }
    setAppRoles(optionsArr);
    setUserRoles(rolePills);
  };

  // setAppRoles(optionsArr)
  // setUserRoles(rolePills)
 

  const handleEditOpen = () => {
    setEdit(true);
    callApi(
      `/provsrvc/applicationRole/findByApplicationId/${application.appId}?active=true`,
      "GET"
    ).then((e) => {
      if (e.success) {
        updateModalRoles(e.data);
        // setRoles(e.data ? e.data : [])
      }
    });
  };

  const handleEditClose = () => {
    setEdit(false);
    setRoles([]);
    setAddRoles([])
  };
  const downloadIcon = () => {
    callImageApi(application.appId).then(setIcon);
  };
  // const statusColour =
  //   application.status === "SUCCESS_CREATE" || "SUCCESS_UPDATE" 
  //     ? "green"
  //     : application.status === "PENDING_CREATE"|| "PENDING_UPDATE" || "PENDING_DELETE" 
  //     ? "yellow"
  //     : "red";
  const applicationStatus=mapStatus(application.status)
  React.useEffect(() => {
    downloadIcon();
  }, [props.onUpdate]);

  const updateRoles = () => {
    setLoading(true);
    let body = {
      applicationId: application.appId,
      roleIds: addRoles,
      userId: user.id,
    };
    callApi(`/usersrvc/api/user/assignapplication`, "PUT", body)
      .then((e) => {
        if (e.success) {
          setLoading(false);
          setAddRoles([]);
          handleRoleAdd(addRoles[0]);
          // props.updateUser()
          showSuccess("Role has been updated for this application");
          // handleEditClose()
        }
      })
      .catch(() => setLoading(false));
  };

  const handleRoleAdd = (id) => {
    setRoleIds([...roleIds, id]);
    setUserRoles([...userRoles, appRoles.find((obj) => obj.id === id)]);
    setAppRoles(appRoles.filter((obj) => obj.id !== id));
   
    // setAddRoles()
  };

  const handleRolesRemove = (id) => {
    setAppRoles([...appRoles, userRoles.find((obj) => obj.id === id)]);
    setRoleIds(roleIds.filter((roleId) => roleId !== id));
    setUserRoles(userRoles.filter((obj) => obj.id !== id));
  };

  const handleDelete = (event, id) => {
    event.preventDefault();
    let body = {
      applicationId: application.appId,
      userId: user.id,
      roleIds: id ? [id] : [],
    };

    setSaving(true);
    // callApi(`/usersrvc/api/user/unassignapplication`, "PUT", body)
    callApi(`/usersrvc/api/user/removeApplication`, "PUT", body)
      .then((e) => {
        setSaving(false);
        if (e.success) {
          id
            ? showSuccess("Role has been removed for this user") 
            : showSuccess("Application has been removed for this user");
          props.onUpdate();
          handleRolesRemove(id);      
          setOpen(false)    
          //  id ? handleEditClose() : handleModalClose()
        }
      })
      .catch(() => setSaving(false));
  };


  const handleRetry = (event, id) => {
    event.preventDefault();
    let body = {
      applicationId: application.appId,
      userId: user.id,
    };

    setSaving(true);
    callApi(`/usersrvc/api/user/retryProvisioning`, "PUT", body)
      .then((e) => {
        setSaving(false);
        if (e.success) {
          showSuccess("System will retry for provisioning");
          props.onUpdate();
          handleRolesRemove(id);
          setRetryDialog(false)
        }
      })
      .catch(() => setSaving(false));
  };



  const handleDeprovision=(event,id)=>{
    event.preventDefault();
    let body = {
      applicationId: application.appId,
      userId: user.id,
      roleIds: id ? [id] : [],
    };
    callApi(`/usersrvc/api/user/unassignapplication`, "PUT", body)
      .then((e) => {
        setSaving(false);
        if (e.success) {
          id
            ? showSuccess("Role has been deprovisioned for this user") 
            : showSuccess("Application has been deprovisioned for this user");
          // props.onUpdate();
          setTimeout(() => {
            props.onUpdate();
          },1000)
          handleRolesRemove(id);
          //  id ? handleEditClose() : handleModalClose()
          setDeprovisionDialog(false)          
        }
      })
      .catch(() => setSaving(false));
  }

  const editbody2 = (
    <div
      className="settings-add-new-global-modal"
      id="centralModalSm1"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="myModalLabel"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title w-100" id="myModalLabel">
              Edit Assignment Type
            </h4>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">
                <CloseIcon
                  style={{ cursor: "pointer" }}
                  onClick={handleEditClose}
                />
              </span>
            </button>
          </div>
          <div className="modal-body" style={{ backgroundColor: "#E9EDF6" }}>
            <form>
              <div className="profile-modal-extra d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center">
                <div
                  className="col-12 col-sm-12 col-md-12 col-lg-2 pl-0"
                  style={{ backgroundColor: "#E9EDF6" }}
                >
                  <img
                    src={icon}
                    alt=""
                    title=""
                    style={{
                      width: 60,
                      height: 60,
                      backgroundColor: "#E9EDF6",
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-10 pl-0">
                  <div className="row pr-2 flex-row  align-items-center">
                    <div className="profile-service-title col-12 col-sm-12 col-md-12">
                      {application.appName}
                    </div>
                  </div>
                  <div className="row pr-2 flex-row  align-items-center">
                    {/* <div className="col-12 col-sm-12 col-md-9">
                      <span className="badge badge-pill badge-secondary">API Management</span><span className="badge badge-pill badge-secondary">API Management</span><span className="badge badge-pill badge-secondary">API Management</span>
                    </div> */}
                    <div className="remove-icon col-12 col-sm-12 col-md-3">
                      {/* <a href="javascript:void" className="pl-2 pr-2 pt-2 pb-2"><img src={Delete} alt="" title /> Remove</a> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-body-white">
                <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 pl-0">
                    <div className="form-group">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-12 ml-auto">
                        <div className="form-group pb-0 pt-3">
                        
                           {appRoles.length === 0 && userRoles.length === 0 ? 
                           <Typography component="h5" variant="h6" className="text-center pt-2">
                           No Roles Associated with Application
                           </Typography> :
                           <Typography component="h5" variant="h6">
                           User Roles:
                           </Typography>
                           }
                          
                          
                          {roleIds &&
                            userRoles.map((e, k) => {
                              return (
                                <Chip
                                  key={k}
                                  label={e.roleName}
                                  clickable
                                  className={classes.customChip}
                                  onDelete={(event) =>
                                    handleDelete(event, e.id)
                                  }
                                  deleteIcon={<ClearIcon />}
                                />
                              );
                            })}
                          {appRoles.length >0 &&<Grid item xs={12}>
                            <Autocomplete
                            //  key={addRoles.length}
                              id="user"
                              autoHighlight
                              value={addRoles[0]}
                              getOptionSelected={(options,val)=>{                                
                                return val.id===addRoles[0]
                              }}
                              options={appRoles}
                              onChange={(event, value) => 
                                setAddRoles(value ? [value.id] : "")
                              }
                              getOptionLabel={(option) => `${option.roleName}`}
                              // onInputChange={(e) => this.onChangeExcludeUserHandler(e)}
                              renderOption={(option) => <>{option.roleName}</>}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  InputProps={{
                                    ...params.InputProps,
                                    autoComplete: "new-password",
                                    endAdornment: (
                                      <>
                                        {/* {loading ? <CircularProgress color="inherit" size={20} /> : null} */}
                                        {params.InputProps.endAdornment}
                                      </>
                                    ),
                                  }}
                                />
                              )}
                            />
                          </Grid>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-left btn-sm mr-auto"
              onClick={handleEditClose}
            >
              Discard
            </button>
            <Button
              onClick={updateRoles}
              variant="contained"
              disabled={!addRoles[0] || isLoading}
              color="primary"
              style={{ float: "right" }}
            >
              {!isLoading ? "Assign" : "Loading..."}
            </Button>
            {/* <a href="JavaScript:void(0)" className="primary-btn-view" onClick={updateRoles}>UPDATE</a> */}
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div
      className="profile-sapplicaion-card"
      style={{ borderRadius: "8px", margin: 15 }}
    >
      <div className="row pr-2 pt-3 pb-3  flex-row  align-items-center">
        <div className="col-12 col-sm-12 col-md-12 col-lg-3">
          <img
            src={icon}
            alt=""
            title=""
            style={{ width: "45px", height: "45px" }}
          />
        </div>
        <div className="profile-app-name col-12 col-sm-12 col-md-12 col-lg-8 text-center">
          {application.appName}
        </div>
      </div>
      {application.appType === "USER" ? (
        <Tooltip title={<span className={classes.tooltipFont}>{applicationStatus && applicationStatus.message}</span>} placement="top">
        <div
          style={{
            width: "15px",
            height: "15px",
            position: "absolute",
            top: 30,
            right: 45,
            display: "inline-block",
            borderRadius: "50px",
            background:applicationStatus.color
            // background: statusColour,
          }}
        ></div>
        </Tooltip>
      ) : (
        // <div style={{ width:'15px', height: '15px', position: 'absolute', top: 30, right: 80, display: 'inline-block', borderRadius: '50px', background: statusColour }}></div>
        <Tooltip title={<span className={classes.tooltipFont}>{applicationStatus && applicationStatus.message}</span>} placement="top">
        <div
          style={{
            width: "15px",
            height: "15px",
            position: "absolute",
            top: 30,
            right: 45,
            display: "inline-block",
            borderRadius: "50px",
            background:applicationStatus.color
            // background: statusColour,
          }}
        ></div>
        </Tooltip>
      )}

      {application.appType === "USER" && applicationStatus.action.delete ? (
        <IconButton
          style={{
            height: 55,
            width: 55,
            position: "absolute",
            top: 10,
            right: 100,
          }}
          onClick={handleModalOpen}
        >
          {isActiveForRoles(["ORG_ADMIN", "DOMAIN_ADMIN"]) && (
            <img src={delIcon} alt="" title="" />
          )}
        </IconButton>
      ) : (
        <></>
      )}
      {application.appType === "USER" && applicationStatus.action.deprovision ? (
        <IconButton
          style={{
            height: 55,
            width: 55,
            position: "absolute",
            top: 10,
            right: 100,
          }}
          onClick={(e)=>setDeprovisionDialog(true)}
        >
          
         <PersonAddDisabledIcon />
        </IconButton>
      ) : (
        <></>
      )}
      {application.appType === "USER" && applicationStatus.action.retry ? (
        <IconButton
          style={{
            height: 55,
              width: 55,
              position: "absolute",
              top: 10,
              right: 60,
          }}
          onClick={()=>setRetryDialog(true)}
        >
          <ReplayIcon />
        </IconButton>
      ) : (
        <></>
      )}

      {isActiveForRoles(["ORG_ADMIN", "DOMAIN_ADMIN"]) && applicationStatus.action.edit &&
        application.appType === "USER" && (
          <IconButton
            style={{
              height: 55,
              width: 55,
              position: "absolute",
              top: 10,
              right: 60,
            }}
            onClick={handleEditOpen}
          >
            <img src="assets/img/icons/edit.svg" alt="" title="" />
          </IconButton>
        )}
      {/* {isActiveForRoles(["ORG_ADMIN", "DOMAIN_ADMIN"]) &&
        application.appType === "GROUP" && (
          <IconButton
            style={{
              height: 55,
              width: 55,
              position: "absolute",
              top: 10,
              right: 20,
            }}
            onClick={handleEditOpen}
          >
            <img src="assets/img/icons/edit.svg" alt="" title="" />
          </IconButton>
        )} */}
      <IconButton
        disabled
        style={{
          height: 55,
          width: 55,
          position: "absolute",
          marginTop: -20,
          right: 65,
        }}
      >
        <div style={{ fontSize: 12, color: "#999" }}>
          {" "}
          {application.appType}{" "}
        </div>
      </IconButton>
      <IconButton
        disabled
        style={{
          height: 55,
          width: 55,
          position: "absolute",
          marginTop: -20,
          right: 25,
        }}
      >
        {application.appType === "USER" ? (
          <PersonIcon fontSize="small" style={{ color: "#999" }} />
        ) : (
          <GroupIcon fontSize="small" style={{ color: "#999" }} />
        )}
      </IconButton>
      {open ? (
        <DeleteModal
          open={open}
          onClose={handleModalClose}
          name={application.appName}
          saving={saving}
          onDelete={handleDelete}
        />
      ) : (
        <></>
      )}
      {deprovisionDialog ? (
        <DeprovisionModal
          open={deprovisionDialog}
          onClose={setDeprovisionDialog}
          name={application.appName}
          saving={saving}
          onDelete={handleDeprovision}
        />
      ) : (
        <></>
      )}
      {retryDialog ? (
        <RetryModal
          open={retryDialog}
          onClose={setRetryDialog}
          name={application.appName}
          saving={saving}
          onDelete={handleRetry}
        />
      ) : (
        <></>
      )}

      <Modal open={edit} onClose={handleEditClose}>
        {editbody2}
      </Modal>
      {/* <AppModal
        title="Edit Assignment Type"
        open={edit} onClose={handleEditClose} actions={
          <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
            <Button onClick={handleEditClose}>Discard</Button>
            <Button color="primary" variant="contained">Update</Button>
          </div>
        }>
        {editbody}
      </AppModal> */}
    </div>
  );
}

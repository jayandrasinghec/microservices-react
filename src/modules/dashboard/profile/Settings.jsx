import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { Link as Linking } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Line from "../../../assets/Line.png";
import Plus from "../../../assets/Plus.png";
import Collapse from "@material-ui/core/Collapse";

import AppSelectInput from "../../../components/form/AppSelectInput";
import AppTextInput from "../../../components/form/AppTextInput";
import AppMasterInput from "../../../components/form/AppMasterInput";
import Minus from "../../../FrontendDesigns/master-screen-settings/assets/img/icons/minus.svg";
import Dustbin from "../../../assets/Dustbin.png";
import { Link } from "react-router-dom";
import Modal from "@material-ui/core/Modal";
import { isActiveForRoles } from "../../../utils/auth";

import "../../../FrontendDesigns/master-screen-settings/assets/css/main.css";
import "../../../FrontendDesigns/master-screen-settings/assets/css/profile.css";
import "../../../FrontendDesigns/master-screen-settings/assets/css/profile-info.css";
import "../../../FrontendDesigns/master-screen-settings/assets/css/settings.css";
import "../../../FrontendDesigns/master-screen-settings/assets/css/users.css";
import "../../../FrontendDesigns/master-screen-settings/assets/css/nice-select.css";
import "../../../FrontendDesigns/master-screen-settings/assets/css/react-sign-up.css";
import LogoNoSpace from "../../../FrontendDesigns/master-screen-settings/assets/img/icons/logo-nospace.svg";
import LogGAuth from "../../../assets/google-authenticator.png";
import LogoSMS from "../../../assets/sms.png";
import LogoSecretQ from "../../../assets/faq.png";
import CloseIcon from "@material-ui/icons/Close";

import Delete from "../../../FrontendDesigns/new/assets/img/icons/Delete.svg";
import Copy from "../../../assets/copy.svg";
import { callApi } from "../../../utils/api";
import DeleteModal from "../../../components/DeleteModal";
import { showSuccess } from "../../../utils/notifications";
import { Autocomplete } from "@material-ui/lab";
import { Chip, TextField } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
// import ConfirmationModal from "../administartion/submodules/Rules/ProvisionRule/ConfirmationModal";
function getModalStyle() {
  const top = 28;
  const left = 35;

  return {
    top: `${top}%`,
    left: `${left}%`,
  };
}

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    overflow: "auto",
    minHeight: "20px",
  },
  link: {
    marginTop: "20px",
    marginLeft: "20px",
    cursor: "pointer",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "18px",
    color: "#1F4287",
    textDecorationLine: "none",
    "&:hover": {
      fontWeight: "bold",
      color: "#363795",
      textDecorationLine: "none",
    },
  },
  clickedLink: {
    textDecorationLine: "none",
    cursor: "pointer",
    fontStyle: "normal",
    fontWeight: "bold",
    color: "#363795",
    marginTop: "20px",
    marginLeft: "20px",
    fontSize: "18px",
  },
  paper: {
    position: "fixed",
    width: 500,
    backgroundColor: "white",
    borderRadius: "20px",
    textAlign: "center",
    alignItems: "center",
    display: "block",
  },
  content: {
    width: 500,
    backgroundColor: "#E9EDF6",
    textAlign: "center",
    alignItems: "center",
    borderRadius: "0px 0px 20px 20px",
    display: "block",
  },
  modalheader: {
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "19px",
    lineHeight: "21px",
  },
  divone: {
    position: "absolute",
    top: 15,
    right: 15,
    display: "flex",
    flexDirection: "column",
  },
  modalcontent: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "14px",
    lineHeight: "21px",
  },
  modalcancel: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "14px",
    lineHeight: "21px",
    color: "#363795",
  },
  closeicon: {
    color: "#666",
    marginBottom: 15,
  },
  customChip: {
    background: "#4e97c8",
    borderRadius: 4,
    marginRight: 16,
    marginBottom: 16,
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
}));

const drop = [{ type: "ACTIVE" }, { type: "INACTIVE" }, { type: "DELETE" }];

export default function UserLayout(props) {
  const classes = useStyles();
  const history = useHistory();
  const [modalStyle] = React.useState(getModalStyle);
  const [status, setStatus] = React.useState(true);
  const [factor, setFactor] = React.useState(false);
  const [password, setPassword] = React.useState(false);
  const [rbac, setRbac] = React.useState(false);
  const [other, setOther] = React.useState(false);
  const [rbacList, setRbacList] = React.useState([]);
  const [selectedRbacList, setSelectedRbacList] = React.useState(
    props.user.rbacRoles || []
  );
  const [rabcValue, setRabcValue] = useState("");
  const [locked, setLocked] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);
  const [verification, setVerify] = React.useState([]);
  const [userStatus, setUserStatus] = React.useState(props.user.status);
  const [resetPass, setResetPass] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState();
  const [saving, setSaving] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteName, setDeleteName] = useState("");
  const [isDelete, setIsDelete] = useState(false);

  var StatusImage, FactorImage, PasswordImage, OthersImage, RbacImage;
  status === true ? (StatusImage = Minus) : (StatusImage = Plus);
  factor === true ? (FactorImage = Minus) : (FactorImage = Plus);
  rbac === true ? (RbacImage = Minus) : (RbacImage = Plus);
  password === true ? (PasswordImage = Minus) : (PasswordImage = Plus);
  other === true ? (OthersImage = Minus) : (OthersImage = Plus);

  const handleStatusClick = () => {
    setStatus(!status);
  };
  const handleFactorClick = () => {
    setFactor(!factor);
  };
  const handlePasswordClick = () => {
    setPassword(!password);
  };
  const handleOthersClick = () => {
    setOther(!other);
  };

  const handleRbacClick = () => {
    setRbac(!rbac);
  };

  const downloadData = () => {
    if (props.login) {
      callApi(`/authsrvc/auth/isUserLocked/${props.login}`)
        .then((response) => {
          if (response.success) setLocked(true);
        })
        .catch((error) => {});
    }
    if(password) {
      callApi(`/mfasrvc/SecretQuestion/findSecretQuestionForUserById`, "POST", {
        userId: props.user.id,
      })
        .then((e) => {
          if (e.success) setQuestions(e.data ? e.data : []);
        })
        .catch((error) => {});
    }
    if(other) {
      callApi(`/mfasrvc/mfaConfig/admin/listMFAForUser`, "POST", {
        userId: props.user.id,
      })
        .then((e) => {
          if (e.success) setVerify(e.data ? e.data : []);
        })
        .catch((error) => {});
    }
  };
  const getRbacList = () => {
    if(rbac) {
      callApi(`/utilsrvc/meta/list/RBAC`, "GET")
      .then((e) => {
        if (e.success) {
            setRbacList(e.data ? e.data : []);
        }
      })
      .catch((error) => {});
    }
    
  };

  const reloadList = () => {
    if (props.user.id) {
      callApi(`/usersrvc/api/user/${props.user.id}`)
        .then((response) => {
          if (response.success && response.data) {
            setSelectedRbacList(response.data.rbacRoles ? response.data.rbacRoles : []);
            
          }
        })
        .catch((error) => {});
    }
  };

  const getFilterRbacList = (items) => {
    let contentData = [];
    if (items.length) {
      contentData = items.filter((data) => {
        return selectedRbacList && !selectedRbacList.find((val) => val === data.name);
      });
    }
    return contentData;
  };
  const handleRbacAssign = () => {
    if (props.user.id && rabcValue) {
      callApi(
        `/usersrvc/api/user/assignRbacRoles/${props.user.id}/${rabcValue}`,
        "PUT"
      )
        .then((e) => {
          if (e.success) {
            showSuccess("RBAC Role Assign Successfully");
            reloadList();
            setRabcValue("")
          }
        })
        .catch((error) => {});
    }
  };
  const handleUnassignRbac = () => {
    setIsDelete(true)
    if (props.user.id && deleteName) {
      callApi(
        `/usersrvc/api/user/unAssignRbacRoles/${props.user.id}/${deleteName}`,
        "PUT"
      )
        .then((e) => {
          setIsDelete(false)
          if (e.success) {
            showSuccess("RBAC Role Unassign Successfully");
            reloadList();
          }
        })
        .catch((error) => setIsDelete(false));
        setShowConfirmation(false);
    }
  };
  React.useEffect(() => {
    downloadData();
    getRbacList();
  }, [password, other, rbac]);

  const handleModalOpen = (val) => {
    setOpen(true);
    setType(val);
  };
  const handleModalClose = () => {
    setOpen(false);
  };

  const handleLockClick = () => {
    setSaving(true);
    callApi(`/authsrvc/auth/unlockLogin/${props.login}`, "POST")
      .then((response) => {
        setSaving(false);
        if (response.success) {
          setLocked(false);
          handleModalClose();
          showSuccess("Unlocked Successfully");
        }
      })
      .catch(() => setSaving(false));
  };

  const handleStatusClickChange = () => {
    setSaving(true);
    callApi(`/usersrvc/api/user/changeStatus`, "PUT", {
      status: userStatus,
      userId: props.user.id,
    })
      .then((response) => {
        setSaving(false);
        if (response.success) {
          if (userStatus === "DELETE") {
            handleModalClose();
            showSuccess("User Deleted Successfully");
            history.push("/dash/directory/user");
          } else {
            showSuccess("Status Updated Successfully");
            handleModalClose();
            props.updateUser();
          }
        }
      })
      .catch(() => setSaving(false));
  };

  const removeMFA = (v) => {
    setSaving(true);
    callApi(`/mfasrvc/mfaConfig/admin/removeMFAForUser`, "POST", {
      mfaType: v,
      userId: props.user.id,
    })
      .then((e) => {
        setSaving(false);
        if (e.success) {
          showSuccess("MFA Deleted Successfully");
          handleModalClose();
          downloadData();
        }
      })
      .catch(() => setSaving(false));
  };

  const resetPassword = () => {
    setSaving(true);
    callApi(`/authsrvc/auth/resetPassword`, "POST", { userName: props.login })
      .then((e) => {
        setSaving(false);
        if (e.success) {
          setResetPass(e.data ? e.data : "");
          handleModalClose();
          showSuccess("Password Generated Successfully");
        }
      })
      .catch(() => setSaving(false));
  };

  return (
    <div className={classes.root}>
      {showConfirmation && (
        <DeleteModal
          open={showConfirmation}
          saving={isDelete}
          name={deleteName}
          onClose={() => setShowConfirmation(false)}
          onDelete={() => handleUnassignRbac()}
        />
      )}
      <div className={classes.divone}>
        <Linking to="/dash/directory/user">
          <CloseIcon className={classes.closeicon} />
        </Linking>
      </div>
      <Grid container>
        <Grid item lg={3} md={4} xs={12}>
          <div
            style={{
              display: "block",
              margin: "25px",
              backgroundColor: "#EEF1F8",
              height: "250px",
              borderRadius: "10px",
            }}
          >
            <div
              className={status ? classes.clickedLink : classes.link}
              style={{ marginTop: "10px", paddingTop: "20px" }}
              onClick={handleStatusClick}
            >
              Status
            </div>
            {isActiveForRoles(["ORG_ADMIN", "DOMAIN_ADMIN", "HELP_DESK"]) && (
              <div
                className={factor ? classes.clickedLink : classes.link}
                onClick={handleFactorClick}
              >
                Reset Password
              </div>
            )}
            <div
              className={rbac ? classes.clickedLink : classes.link}
              onClick={handleRbacClick}
            >
              RBAC
            </div>
            <div
              className={password ? classes.clickedLink : classes.link}
              onClick={handlePasswordClick}
            >
              Secret Question
            </div>
            <div
              className={other ? classes.clickedLink : classes.link}
              onClick={handleOthersClick}
            >
              Additional Verification
            </div>
          </div>
        </Grid>
        <Grid item lg={9} md={8} xs={12}>
          <div className="accordion cym-custom-scroll " id="accordionExample">
            <div className="cym-admin-list-row-info user-cards-table">
              <div className="settings-table-card row" id="headingOne">
                <div className=" col-12 " onClick={handleStatusClick}>
                  <div
                    style={{ justifyContent: "space-between", display: "flex" }}
                    className="row mb-3 mb-sm-3 mb-md-0 "
                  >
                    <h4 className="admin-row-heading mb-0 pl-3">Status</h4>
                    <div>
                      <img alt="Icon" src={StatusImage} />
                    </div>
                  </div>
                </div>
              </div>
              <Collapse in={status}>
                <div id="collapseOne" className="collapse show mt-3">
                  <div className="user-table-card">
                    <div className="row" style={{ padding: 15 }}>
                      <div className="col-lg-6 col-md-12 mb-2">
                        <div>
                          <div className="m-auto" style={{ fontSize: "14px" }}>
                            <span>User Status</span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              marginTop: 20,
                              marginBottom: 10,
                            }}
                          >
                            {locked ? (
                              <div
                                style={{
                                  width: "15px",
                                  height: "15px",
                                  borderRadius: "50px",
                                  backgroundColor: "red",
                                  display: "flex",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "15px",
                                  height: "15px",
                                  borderRadius: "50px",
                                  backgroundColor: "green",
                                  display: "flex",
                                }}
                              />
                            )}
                            <span
                              style={{
                                marginLeft: 10,
                                marginTop: -5,
                                marginBottom: 10,
                              }}
                            >
                              {" "}
                              {locked ? "Locked" : "Unlock"}{" "}
                            </span>
                            <div style={{ padding: "0 15px 15px 15px" }}>
                              {locked &&
                              isActiveForRoles([
                                "ORG_ADMIN",
                                "DOMAIN_ADMIN",
                                "HELP_DESK",
                              ]) ? (
                                <div
                                  className="primary-btn-view"
                                  onClick={() => handleModalOpen("unlockUser")}
                                  style={{
                                    margin: "-40px 0 0 20px",
                                    padding: "6px 16px",
                                    fontSize: "16px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Unlock
                                </div>
                              ) : (
                                <></>
                              )}

                              {/* <Button variant="contained" color="primary" onClick={handleLockClick} style={{ margin: '-40px 0 0 20px' }}> {locked ? "Unlock" : "Lock"} </Button> */}
                            </div>
                          </div>
                          {locked ? (
                            <div style={{ marginTop: -20, fontSize: "14px" }}>
                              Locked due to incorrect password
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-12 mr-auto mt-0">
                        <AppSelectInput
                          label="Account Status"
                          value={userStatus}
                          onChange={(e) => setUserStatus(e.target.value)}
                          options={drop.map((o) => o.type)}
                        />
                      </div>
                      {isActiveForRoles([
                        "ORG_ADMIN",
                        "DOMAIN_ADMIN",
                        "HELP_DESK",
                      ]) && (
                        <div className="col-lg-2 col-md-12 m-auto mr-auto mt-2">
                          <div style={{ padding: 18 }}>
                            {/* <div disabled onClick={() => handleModalOpen("changeStatus")} className="primary-btn-view" style={{ padding: '6px 16px', fontSize: '16px', cursor: 'pointer', }}>
                              Update
                            </div> */}
                            {isActiveForRoles([
                              "ORG_ADMIN",
                              "DOMAIN_ADMIN",
                              "HELP_DESK",
                            ]) && userStatus !== "DELETE" ? (
                              <Button
                                disabled={!userStatus}
                                onClick={() => handleModalOpen("changeStatus")}
                                variant="contained"
                                color="primary"
                              >
                                Update
                              </Button>
                            ) : isActiveForRoles([
                                "ORG_ADMIN",
                                "DOMAIN_ADMIN",
                              ]) ? (
                              <Button
                                disabled={!userStatus}
                                onClick={() => handleModalOpen("changeStatus")}
                                variant="contained"
                                color="primary"
                              >
                                Update
                              </Button>
                            ) : (
                              <></>
                            )}
                            {/* <Button variant="contained" color="primary" >Update</Button> */}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Collapse>
            </div>
            {isActiveForRoles(["ORG_ADMIN", "DOMAIN_ADMIN", "HELP_DESK"]) && (
              <div className="cym-admin-list-row-info user-cards-table">
                <div className="settings-table-card row" id="headingTwo">
                  <div className="col-12" onClick={handleFactorClick}>
                    <div
                      style={{
                        justifyContent: "space-between",
                        display: "flex",
                      }}
                      className="row mb-3 mb-sm-3 mb-md-0 "
                    >
                      <h4 className="admin-row-heading mb-0 pl-3">
                        Reset Password
                      </h4>
                      <div>
                        <img alt="Icon" src={FactorImage} />
                      </div>
                    </div>
                  </div>
                </div>
                <Collapse in={factor}>
                  <div id="collapseTwo" className="collapse show mt-3">
                    <div className="user-table-card">
                      <div className="row" style={{ padding: 15 }}>
                        {/* <div className="col-lg-4 col-md-12 m-auto">
                      <AppTextInput label="Password" />
                    </div> */}
                        <div
                          onClick={() => handleModalOpen("resetPassword")}
                          className="primary-btn-view"
                          style={{
                            padding: "6px 16px",
                            fontSize: "16px",
                            cursor: "pointer",
                          }}
                        >
                          Generate Password
                        </div>
                        {resetPass ? (
                          <div style={{ marginLeft: 20 }}>
                            <AppTextInput value={resetPass} label="" />
                          </div>
                        ) : (
                          <></>
                        )}

                        {/* <div className="col-lg-4 col-md-12 m-auto">
                      <div style={{ fontSize: '18px', color: '#1F4287', cursor: 'pointer' }}>Generate Password</div>
                    </div> */}
                        {/* <div className="col-lg-4 col-md-12 ml-0 m-auto">
                      <div className="custom-checkbox" style={{ display: 'flex' }}>
                        <input type="checkbox" name={1} id={1} /> <label htmlFor={1} />
                        <span style={{ fontSize: '16px' }}>Share Password to user through email now</span>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6 ml-0 m-auto">
                      <div style={{ display: 'flex' }}>
                        <img src={Copy} style={{ margin: 10 }}/>
                        <span style={{ fontSize: '16px', marginTop: 5 }}>Copy to Clipboard</span>
                      </div>
                    </div> */}
                        {/* <div className="col-lg-5 col-md-6 ml-0 mt-auto">
                      <div style={{ padding: 15 }}>
                        <div onClick={resetPassword} className="primary-btn-view" style={{ padding: '6px 16px', fontSize: '16px', cursor: 'pointer', }}>
                          Generate Password
                        </div>
                        <Button variant="contained" color="primary">Update</Button>
                      </div>
                    </div> */}
                      </div>
                    </div>
                  </div>
                </Collapse>
              </div>
            )}
            <div className="cym-admin-list-row-info user-cards-table">
              <div className="settings-table-card row" id="headingOne">
                <div className=" col-12 " onClick={handleRbacClick}>
                  <div
                    style={{ justifyContent: "space-between", display: "flex" }}
                    className="row mb-3 mb-sm-3 mb-md-0 "
                  >
                    <h4 className="admin-row-heading mb-0 pl-3">RBAC</h4>
                    <div>
                      <img alt="Icon" src={RbacImage} />
                    </div>
                  </div>
                </div>
              </div>
              <Collapse in={rbac}>
                <div id="collapseOne" className="collapse show mt-3">
                  <div className="user-table-card">
                    {selectedRbacList && selectedRbacList.length >=1 && (
                      <div className="row" style={{ padding: 15 }}>
                        <div className="col-lg-12 col-md-12 mr-auto mt-0">
                          {selectedRbacList.map((val, i) => (
                            <Chip
                              key={val - i}
                              label={val}
                              clickable
                              className={classes.customChip}
                              onDelete={(e) =>{ 
                                setShowConfirmation(true);
                                setDeleteName(val)
                              }
                              }
                              deleteIcon={<ClearIcon />}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="row" style={{ padding: 15 }}>
                      <div className="col-lg-4 col-md-12 mr-auto mt-0">
                        <AppSelectInput
                          label="RBAC"
                          id="rbac"
                         
                          onChange={(e) => {
                            setRabcValue(e.target.value);
                          }}
                          
                          labels={getFilterRbacList(rbacList).map(val=>val.name)}
                          
                          options={getFilterRbacList(rbacList).map(val=>val.name)}

                        />
                      </div>
                      <div
                        className="col-lg-2 col-md-12 m-auto mr-auto mt-2"
                        style={{ display: "flex", alignItems: "flex-end" }}
                      >
                        <div style={{ padding: "30px 0px" }}>
                          {isActiveForRoles([
                            "ORG_ADMIN",
                            "DOMAIN_ADMIN",
                            "HELP_DESK",
                          ]) && userStatus !== "DELETE" ? (
                            <Button
                              disabled={!userStatus}
                              onClick={() => handleRbacAssign()}
                              variant="contained"
                              color="primary"
                            >
                              Update
                            </Button>
                          ) : isActiveForRoles([
                              "ORG_ADMIN",
                              "DOMAIN_ADMIN",
                            ]) ? (
                            <Button
                              disabled={!userStatus}
                              onClick={() => handleRbacAssign()}
                              variant="contained"
                              color="primary"
                            >
                              Update
                            </Button>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Collapse>
            </div>
            <div className="cym-admin-list-row-info user-cards-table">
              <div className="settings-table-card row" id="headingThree">
                <div className=" col-12 ">
                  <div
                    style={{ justifyContent: "space-between", display: "flex" }}
                    className="row mb-3 mb-sm-3 mb-md-0 "
                  >
                    <h4
                      className="admin-row-heading mb-0 pl-3"
                      onClick={handlePasswordClick}
                    >
                      Secret Question
                    </h4>
                    <div>
                      {/* <Button variant="contained" color="primary" style={{ marginRight: 25 }} onClick={onAdd}>Add New</Button> */}
                      <img
                        alt="Icon"
                        src={PasswordImage}
                        onClick={handlePasswordClick}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Collapse in={password}>
                <div id="collapseThree" className="collapse show mt-3">
                  {questions.length === 0 ? (
                    <div className="user-table-card" style={{ margin: 10 }}>
                      <div className="row" style={{ padding: 15 }}>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: 500,
                            textAlign: "center",
                          }}
                        >
                          No Question Found
                        </div>
                      </div>
                    </div>
                  ) : (
                    questions.map((q) => (
                      <>
                        <div className="user-table-card" style={{ margin: 10 }}>
                          <div className="row" style={{ padding: 15 }}>
                            <div style={{ fontSize: "16px", fontWeight: 500 }}>
                              {" "}
                              {q.question}{" "}
                            </div>
                          </div>
                        </div>
                      </>
                    ))
                  )}
                </div>
              </Collapse>
            </div>
            <div className="cym-admin-list-row-info user-cards-table">
              <div className="settings-table-card row" id="headingFour">
                <div className=" col-12 ">
                  <div
                    style={{ justifyContent: "space-between", display: "flex" }}
                    className="row mb-3 mb-sm-3 mb-md-0 "
                  >
                    <h4
                      className="admin-row-heading mb-0 pl-3"
                      onClick={handleOthersClick}
                    >
                      Additional Verification
                    </h4>
                    <div>
                      {/* <Button variant="contained" color="primary" style={{ marginRight: 25 }} onClick={onVerify}>Add New</Button> */}
                      <img
                        alt="Icon"
                        src={OthersImage}
                        onClick={handleOthersClick}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Collapse in={other}>
                <div
                  id="collapseFour"
                  className="collapse show mt-3"
                  style={{ display: "flex" }}
                >
                  <Grid container spacing={3} style={{ display: "flex" }}>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      style={{ marginTop: 15, marginLeft: 15 }}
                    >
                      {verification.length === 0 ? (
                        <div className="user-table-card">
                          <div className="row" style={{ padding: 15 }}>
                            <div
                              style={{
                                fontSize: "16px",
                                fontWeight: 500,
                                textAlign: "center",
                              }}
                            >
                              No MFA Found
                            </div>
                          </div>
                        </div>
                      ) : (
                        verification.map((v) => (
                          <>
                            <div
                              className="card mb-4"
                              style={{ border: "none" }}
                            >
                              <div className="p-4 authentication-card">
                                <img
                                  src={
                                    v === "SecretQuestions"
                                      ? LogoSecretQ
                                      : v === "GoogleAuthenticator"
                                      ? LogGAuth
                                      : v === "SMSAuthenticator"
                                      ? LogoSMS
                                      : LogoNoSpace
                                  }
                                  alt="logo"
                                  className="mr-3"
                                />
                                <p className="mb-0">
                                  {" "}
                                  {v} <br />
                                  <span>
                                    Enter single-use code from mobile app
                                  </span>
                                </p>
                                {isActiveForRoles([
                                  "ORG_ADMIN",
                                  "DOMAIN_ADMIN",
                                ]) && (
                                  <img
                                    src={Delete}
                                    onClick={() => handleModalOpen(v)}
                                    alt="logo"
                                    className="m-auto"
                                  />
                                )}
                              </div>
                            </div>
                          </>
                        ))
                      )}
                    </Grid>
                  </Grid>
                </div>
              </Collapse>
            </div>
          </div>
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleModalClose}>
        <div>
          <div style={modalStyle} className={classes.paper}>
            <div style={{ display: "block" }}>
              <img
                alt="Dustbin"
                src={Dustbin}
                style={{ margin: "25px 0 10px 0" }}
              />
              <div style={{ paddingBottom: "10px" }}>
                <span className={classes.modalheader}>
                  {" "}
                  Are you sure you want to{" "}
                  {type === "changeStatus"
                    ? userStatus === "ACTIVE"
                      ? "activate this user"
                      : userStatus === "INACTIVE"
                      ? "inactivate this user"
                      : "delete this user"
                    : type === "resetPassword"
                    ? "reset the password"
                    : type === "unlockUser"
                    ? "unlock this user"
                    : `delete ${type} from MFA `}{" "}
                </span>
              </div>
            </div>
            <div className={classes.content}>
              <div style={{ paddingTop: "10px" }}>
                <span className={classes.modalcontent}>
                  {type === "changeStatus" &&
                  (userStatus === "ACTIVE" || userStatus === "INACTIVE")
                    ? ""
                    : "Warning! This cannot be undone. "}
                </span>
              </div>
              <Button
                disabled={saving}
                color="primary"
                variant="contained"
                style={{ margin: "10px" }}
                onClick={() =>
                  type === "changeStatus"
                    ? handleStatusClickChange()
                    : type === "resetPassword"
                    ? resetPassword()
                    : type === "unlockUser"
                    ? handleLockClick()
                    : removeMFA(type)
                }
              >
                {!saving ? "Next" : "Saving"}
              </Button>
              <div style={{ padding: "0 0 20px 0" }}>
                <Link
                  onClick={handleModalClose}
                  className={classes.modalcancel}
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* {open ? (<DeleteModal open={open} onClose={handleModalClose} name={props.user.firstName} onDelete={() => handleStatusClickChange()} />) : (<></>)} */}
    </div>
  );
}

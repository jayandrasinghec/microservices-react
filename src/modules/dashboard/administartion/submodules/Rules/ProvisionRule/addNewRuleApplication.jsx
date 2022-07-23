import React, { useEffect, useState } from "react";
import clsx from "clsx";
import {
  Avatar,
  Box,
  Button,
  Grid,
  InputLabel,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import GreyBtn from "../../../../../../components/HOC/GreyBtn";
import { Autocomplete } from "@material-ui/lab";
import MaterialTable from "material-table";
import AppSelectInput from "../../../../../../components/form/AppSelectInput";
import CardViewWrapper from "../../../../../../components/HOC/CardViewWrapper";
import AddNewApplicationRole from "./addNewApplicationRole";
import {
  getApplicationData,
  getApplicationRoles,
  saveNewProvisionRuleApplication,
  getApplicationRuleList,
  removeApplicationRule,
} from "./provisionRuleApi";
import { showSuccess } from "../../../../../../utils/notifications";
import DeleteModal from "../../../../../../components/DeleteModal";
import { isActiveForRoles } from "../../../../../../utils/auth";
import CustomPagination from "../../../../../../components/CustomPagination";

const useStyles = makeStyles(() => ({
  ruleCard: {
    margin: "16px 0px",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    "& .ruleType": {
      color: "#363795",
      fontWeight: "700",
    },
    "& .ruleDesc": {
      color: "#8897ab",
    },
    "& .ruleName": {
      fontWeight: "700",
    },
    "& .editDeleteIcon": {
      "& img": {
        width: "16px",
        height: "16px",
      },
    },
  },
  ruleTable: {
    // paddingBottom: "0px !important",
    // marginBottom: '-16px',
    "& .MuiToolbar-gutters": {
      padding: "0px !important",
      "& .MuiTextField-root": {
        border: "1px solid #ccc",
        borderRadius: "4px",
        paddingLeft: "8px",
        "& .MuiInput-underline:before": {
          display: "none",
        },
        "& .MuiInput-underline:after": {
          display: "none",
        },
      },

      "& .MuiIconButton-root:hover": {
        background: "transparent",
        "& .MuiTouchRipple-root": {
          display: "none",
        },
      },
    },

    "& table": {
      // overflowX: 'none',
      // border: '1px solid #ddd',
      // borderCollapse: "separate",
      borderSpacing: "0",
    },
    "& th ": {
      padding: "16px !important",
    },
    "& td ": {
      borderBottom: 0,
    },
    "& .MuiPaper-root": {
      boxShadow: "none",
      background: "transparent",
    },
    "& .MuiTablePagination-caption": {
      display: "unset !important",
      position: "absolute",
      color: "#a9b2c3",
    },
    "& .MuiTableCell-footer": {
      borderBottom: "0px",
      "& .MuiTablePagination-selectRoot": {
        background: "#282a73",
        borderRadius: "20px",
        color: "#fff",
        "& svg": {
          color: "#fff",
        },
      },
      "& .MuiButton-contained.Mui-disabled": {
        background: "transparent",
      },
    },
  },
  tableAddIcon: {
    height: 32,
  },
  gridBtn: {
    display: "flex",
    justifyContent: "flex-end",
  },
  customInputLabel: {
    fontSize: "14px",
    marginTop: "5px",
    marginBottom: "5px",
    lineHeight: 1.5,
    color: "#212529",
  },
  editDeleteIcon: {
    "& img": {
      width: "16px",
      height: "16px",
    },
  },
  executInput: {
    display: "flex",
    alignItems: "center",
    "& > div": {
      marginRight: 20,
    },
    "& .MuiTextField-root": {
      marginRight: 0,
    },
  },
  autoCompleteField: {
    '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
      padding: "0px",
      maxWidth: "200px",
    },
  },
  roleGrid: {
    marginLeft: "10px",
  },
  labelGrid: {
    marginRight: "10px",
  },
  roleBtn: {
    display: "flex",
    justifyContent: "flex-end",
    marginLeft: "auto",
  },
  manageWidth:{
    width: '15vw'
  },
  paginationContainer:{
    display:"block",
    padding:"20px 0px"
}
}));

const AddNewRuleApplication = (props) => {
  const classes = useStyles();
  const { isVisible, setIsVisible, value, ruleId } = props;
  const [applicationData, setApplicationData] = useState([]);
  const [applicationList, setApplicationList] = useState([]);
  const [applicationRoles, setApplicationRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [appId, setAppId] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [deleteName, setDeleteName] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const [chunk,setChunk] = useState([])


  const handleAddApplicationSave = async () => {
    setSaving(true)
    let postData = {
      appId,
      roles:selectedRoles,
    };
    if (appId) {
      let data = await saveNewProvisionRuleApplication(ruleId, postData);
      if (data && data.success) {
        showSuccess("Application Rule Added successfully");
        getApplicationsList();
        setAppId("");
        setSelectedRoles([]);
        setApplicationRoles([]);
        setSaving(false)
      } else {
        setSaving(false)
      }
    }
    setIsVisible(false);
  };

  const getApplication = async () => {
    const data = await getApplicationData();
    if (data && data.content) {
      let contentData = data.content;
      if (applicationList.length) {
        contentData = contentData.filter((data) => {
          return !applicationList.find((val) => val.application.id === data.id);
        });
      }
      setApplicationData(contentData);
    }
  };

  const getSelectedApplicationRole = async (id) => {
    const data = await getApplicationRoles(id);
    if (data) {
      let activeRoles = data.filter((val) => val.active);
      setApplicationRoles(activeRoles);
    }
  };

  const getApplicationsList = async () => {
    const data = await getApplicationRuleList(ruleId);
    if (data) {
      setApplicationList(data);
    }
  };
  const handleClickDelete = async () => {
    setIsDelete(true);
    let data = await removeApplicationRule(ruleId, deleteId);
    if (data && data.success) {
      showSuccess("Application Rule Deleted successfully");
      getApplicationsList();
      setIsVisible(false);
      setIsDelete(false);
      setAppId("");
      setSelectedRoles([]);
    }
    setShowConfirmation(false);
  };

  useEffect(() => {
    getApplicationsList();
  }, []);

  useEffect(() => {
    if (isVisible) {
      getApplication();
    }
  }, [isVisible]);
  return (
    <div>
      {showConfirmation && (
        <DeleteModal
          open={showConfirmation}
          saving={isDelete}
          name={deleteName}
          onClose={() => setShowConfirmation(false)}
          onDelete={() => handleClickDelete()}
        />
      )}
      {isVisible && (
        <CardViewWrapper>
          <Box className={classes.ruleCard}>
            <Grid container spacing={3} className="p-3">
              <Grid item xs={12} md={4}>
                <AppSelectInput
                  label="Application"
                  id="application"
                  className={classes.executInput}
                  onChange={(e) => {
                    let { id } = e.target.value;
                    setAppId(id);
                    getSelectedApplicationRole(id);
                    setSelectedRoles([]);
                  }}
                  // disabledList={list.filter(e => props.selectedAuths.indexOf(e.id) >= 0).map(e => e.id)}
                  // labels={list.map(l => l.name)}
                  labels={applicationData.map((val, key) => {
                    if (val.provisionEnable) {
                      return val.appName;
                    }
                  })}
                  // options={list.map(l => l.id)}
                  options={applicationData.map((val, key) => {
                    if (val.provisionEnable) {
                      return val;
                    }
                  })}
                  // disabled={!isActiveForRoles(['ORG_ADMIN'])}
                />
              </Grid>
              <Grid
                container
                direction="row"
                alignItems="center"
                className={clsx(classes.roleGrid, "pt-3")}
              >
                <Grid item xs={1} md={1} className={classes.labelGrid}>
                  <InputLabel className={classes.customInputLabel}>
                    Role
                  </InputLabel>
                </Grid>
                <Grid item xs={11} md={3}>
                <AppSelectInput
                  label=""
                  id="role"
                  labels={applicationRoles.map(label=>label.roleName)}
                  onChange={(e) => {
                    let {id} = e.target.value
                    setSelectedRoles([id]);
                  }}
                  options={applicationRoles.map(label=>label)}
                  disabled={appId ? false : true}
                  
                />
                 
                </Grid>
                <Grid item xs={12} md={3} className={classes.roleBtn}>
                  <AddNewApplicationRole
                    appId={appId}
                    getSelectedApplicationRole={getSelectedApplicationRole}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <GreyBtn onClick={() => {setAppId(''); setSelectedRoles([]);setIsVisible(false)}}>Discard</GreyBtn>
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                lg={6}
                container
                direction="row"
                justify="flex-end"
              >
                <Button
                  variant="contained"
                  color="primary"
                  // type="submit"
                  size="small"
                  disableElevation
                  disabled={!appId || saving}
                  onClick={() => handleAddApplicationSave()}
                >
                  {saving ? 'Saving' : 'Save' }
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardViewWrapper>
      )}
      <CardViewWrapper>
        <Grid container spacing={2}>
          <Grid item xs={12} className={classes.ruleTable}>
            <MaterialTable
              title=""
              data={chunk}
              columns={[
                {
                  title: "Application Name",
                  render: (rowData) => {
                    return <>{rowData.application.name}</>;
                  },
                },
                {
                  title: "Application Roles",
                  render: (rowData) => {
                    return (
                      <>
                        {rowData.roles.map((val, i) => {
                          if (rowData.roles.length - 1 !== i) {
                            return (
                              <span key={val.id}>
                                <span>{val.name}</span>
                                <span>,</span>
                              </span>
                            );
                          } else {
                            return <span key={val.id}>{val.name}</span>;
                          }
                        })}
                      </>
                    );
                  },
                },
              ]}
              options={{
                rowStyle: {
                  backgroundColor: "#fff",
                },
                cellStyle: {
                  borderBottom: "none",
                },
                headerStyle: {
                  backgroundColor: "transparent",
                  borderBottom: "none",
                  color: "#666667",
                },
                paginationType: "stepped",
                draggable: false,
                actionsColumnIndex: -1,
                search: false,
                toolbar: false,
                paging:false,
              }}
              // localization={{
              //   pagination: {
              //     labelRowsPerPage: "",
              //     labelDisplayedRows:
              //       "Displaying {from}-{to} of {count} records",
              //   },
              // }}
              actions={[
                {
                  icon: () => (
                    <Avatar
                      src={require("../../../../../../assets/Delete.png")}
                      className={classes.editDeleteIcon}
                    />
                  ),
                  hidden: !isActiveForRoles(["ORG_ADMIN"]),
                  tooltip: "Delete Condition",
                  onClick: (event, rowData) => {
                    setDeleteId(rowData.application.id);
                    setDeleteName(rowData.application.name);
                    setShowConfirmation(true);
                  },
                },
              ]}
            />
          </Grid>
          <Grid container className={classes.paginationContainer}>
                    <CustomPagination 
                            data={applicationList}
                            setChunk={setChunk}          
                            />
                    </Grid>
        </Grid>
      </CardViewWrapper>
    </div>
  );
};

export default AddNewRuleApplication;

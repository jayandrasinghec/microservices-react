import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import GreyBtn from "../../../../../../components/HOC/GreyBtn";
import { Autocomplete } from "@material-ui/lab";
import CustomInputLabel from "../../../../../../components/HOC/CustomInputLabel";
import { Field } from "redux-form";
import { renderSelectField } from "../../../../../../shared/reduxFields";
import AppSelectInput from "../../../../../../components/form/AppSelectInput";
import AppCheckbox from "../../../../../../components/form/AppCheckbox";
import AppTextInput from "../../../../../../components/form/AppTextInput";
import {
  changeRuleConditionStatus,
  getAttributeList,
  getConditionRuleList,
  getSelectedAttributeList,
  removeConditionRule,
  saveNewProvisionRuleCondition,
  setExecuteCondition,
} from "./provisionRuleApi";
import CardViewWrapper from "../../../../../../components/HOC/CardViewWrapper";
import MaterialTable from "material-table";
import { showSuccess } from "../../../../../../utils/notifications";
import DeleteModal from "../../../../../../components/DeleteModal";
import CustomPagination from "../../../../../../components/CustomPagination";
import { isActiveForRoles } from "../../../../../../utils/auth";

const list = [
  { name: "Any", allConditionApplied: false },
  { name: "All", allConditionApplied: true },
];
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
  editDeleteIcon: {
    "& img": {
      width: "16px",
      height: "16px",
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

  ruleApplyRadio: {
    border: "1px solid #ccc",
    margin: "16px 0px 0px 0px",
    borderRadius: "4px",
    width: "100%",
    display: "block",
  },
  tableAddIcon: {
    height: 32,
  },
  gridBtn: {
    display: "flex",
    justifyContent: "flex-end",
  },
  ruleActionContainer: {
    display: "flex",
    alignItems: "center",
  },
  customInputLabel: {
    color: "#000",
    fontSize: 14,
    display: "flex",
    fontWeight: "500",
    height: 14,
    margin: 0,
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
    },
  },
  paginationContainer:{
    display:"block",
    padding:"20px 0px"
}
}));

const defaultQuery = {
  pageNo: 0,
  size: 10,
  sortBy: "attributeName",
  order: "ASC",
};

const AddNewRuleCondition = (props) => {
  const classes = useStyles();
  const [query, _setQuery] = useState(defaultQuery);
  const [totalElements, setTotalElements] = useState(0);
  const [type, setType] = useState({ allConditionApplied: false });
  const [isActive, setIsActive] = useState(false);
  const [attributeData, setAttributeData] = useState([]);
  const [selectedAttributeData, setSelectedAttributeData] = useState([]);
  const [selectedAttributeItems, setSelectedAttributeItems] = useState([]);
  const [conditionList, setConditionList] = useState([]);
  const [textValue, setTextValue] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [attributeItem, setAttributeItem] = useState({
    isCustom: false,
  });
  const [deleteName, setDeleteName] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  const { isVisible, setIsVisible, ruleId, rulesDetailsById } = props;
  const handleAddApplicationSave = async () => {
    setSaving(true)
    setExecuteCondition(ruleId, type);
    let attributeValue = selectedAttributeItems.map((val) => val.value);
    let prostData = {
      ruleId: ruleId,
      isCustom: attributeItem.isCustom,
      attributeName: attributeItem.attributeName,
      attributeValue: attributeItem.isCustom
      ? [textValue]
      : attributeValue,
      status: isActive,
    };
    if (attributeItem.attributeName && (attributeValue.length > 0 || textValue)) {
      let data = await saveNewProvisionRuleCondition(prostData);
      if (data && data.success) {
        showSuccess("Condition Rule Added successfully");
        getConditionsList();
        setTextValue([])
        setSelectedAttributeItems([])
        setSelectedAttributeData([])
        setAttributeItem({})
        setIsVisible(false);
        setSaving(false)
      } else {
        setSaving(false)
      }
    }
    // setIsVisible(false);
  };

  const getAttributes = async () => {
    const data = await getAttributeList();
    if (data) {
      let contentData = data;
      if (conditionList.content.length) {
        contentData = contentData.filter((data) => {
          return !conditionList.content.find(
            (val) => val.attributeName === data.attributeName
          );
        });
      }
      setAttributeData(contentData);
    }
  };

  const getSelectedAttributeItem = () => {
    let contentData = [];
    if (selectedAttributeData.length) {
      contentData = selectedAttributeData.filter((data) => {
        return selectedAttributeItems.find((val) => val.value === data.value);
      });
    }
    return contentData;
  };

  const getSelectedAttributeValue = async (serviceName, serviceUrl) => {
    const data = await getSelectedAttributeList(serviceName, serviceUrl);
    if (data) {
      setSelectedAttributeData(data);
    }
  };
  useEffect(() => {
    if (isVisible) {
      getAttributes();
    }
  }, [isVisible]);

  useEffect(() => {
    getConditionsList();
  }, [query.pageNo, query.size]);

  const getConditionsList = async () => {
    const data = await getConditionRuleList(ruleId, query);
    if (data) {
      setConditionList(data);
      setTotalElements(data.totalElements);
    }
  };

  const handleStatus = async (status, rowData) => {
    const data = await changeRuleConditionStatus(rowData.id, status);
    if (data && data.success) {
      showSuccess("Status Changed successfully");
      getConditionsList();
    }
  };
  const handleClickDelete = async () => {
    setIsDelete(true)
    let data = await removeConditionRule(deleteId);
    if (data && data.success) {
      showSuccess("Condition Deleted successfully");
      getConditionsList();
      setIsVisible(false);
      setIsDelete(false);
      setSelectedAttributeItems([]);
    }
    setShowConfirmation(false);
  };

  const handleChangePage = (event, newPage) => {
    _setQuery({ ...query, pageNo: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    _setQuery({ ...query, pageNo: 0, size: parseInt(event, 10) });
  };

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
            <TableContainer>
              <Table aria-label="caption table">
                <TableBody>
                  {/* <TableRow>
                    <TableCell
                      style={{ border: "none", width: "25vw" }}
                      scope="row"
                    >
                      <AppSelectInput
                        id="execute"
                        label="Execute"
                        // value={item.authenticatorId}
                        className={classes.executInput}
                        value={false}
                        onChange={
                          (e) => {
                            setType({
                              allConditionApplied: !type.allConditionApplied,
                            });
                          }
                          // change({ authenticatorId: e.target.value })
                        }
                        // disabledList={list.filter(e => props.selectedAuths.indexOf(e.id) >= 0).map(e => e.id)}
                        // labels={list.map(l => l.name)}
                        labels={list.map((val, key) => val.name)}
                        // options={list.map(l => l.id)}
                        options={list.map(
                          (val, key) => val.allConditionApplied
                        )}
                        // disabled={!isActiveForRoles(['ORG_ADMIN'])}
                      />
                    </TableCell>
                    <TableCell style={{ border: "none" }} scope="row">
                      <InputLabel className={classes.customInputLabel}>
                        Conditions
                      </InputLabel>
                    </TableCell>
                  </TableRow> */}

                  <TableRow>
                    <TableCell
                      style={{ border: "none", width: "25vw" }}
                      scope="row"
                    >
                      <AppSelectInput
                        label="Attribute"
                        id="attribute"
                        className={classes.executInput}
                        onChange={(e) => {
                          let {
                            isCustom,
                            serviceName,
                            serviceUrl,
                          } = e.target.value;
                          if (!isCustom) {
                            getSelectedAttributeValue(serviceName, serviceUrl);
                            setSelectedAttributeItems([]);
                          }
                          setAttributeItem(e.target.value);
                          if (isCustom) {
                            setTextValue([]);
                          }
                        }}
                        // disabledList={list.filter(e => props.selectedAuths.indexOf(e.id) >= 0).map(e => e.id)}
                        // labels={list.map(l => l.name)}
                        labels={attributeData.map(
                          (val, key) => val.attributeName
                        )}
                        // options={list.map(l => l.id)}
                        options={attributeData.map((val, key) => val)}
                        // disabled={!isActiveForRoles(['ORG_ADMIN'])}
                      />
                    </TableCell>
                    <TableCell
                      style={{ border: "none" }}
                      scope="row"
                      variant="footer"
                    >
                      <InputLabel className={classes.customInputLabel}>
                        is
                      </InputLabel>
                    </TableCell>
                    <TableCell style={{ border: "none" }} scope="row">
                      {attributeItem && attributeItem.isCustom ? (
                        // <TextField
                        // value={form.login}

                        // onChange={(e) => {
                        //   setTextValue([e.target.value]);
                        // }}
                        // className="text-field"
                        // label=""
                        // variant="outlined"
                        // placeholder=""
                        // fullWidth
                        // InputProps={{
                        //   startAdornment: (
                        //     <InputAdornment position="start">
                        //       <AccountCircleIcon
                        //         className={classes.iconcolor}
                        //       />
                        //     </InputAdornment>
                        //   ),
                        // }}
                        // />
                        <AppTextInput
                          onChange={(e) => {
                            setTextValue(e.target.value);
                          }}
                          className="text-field"
                          label=""
                          variant="outlined"
                          placeholder=""
                          fullWidth
                        />
                      ) : (
                        <Autocomplete
                          id="attribute-value"
                          multiple
                          autoHighlight
                          style={{ width: "25vw" }}
                          className={classes.autoCompleteField}
                          value={getSelectedAttributeItem()}
                          // loading={loading}
                          options={selectedAttributeData}
                          // disabled={isGroupDisabled}
                          disabled={!attributeItem.attributeName}
                          onChange={(event, value) => {
                            setSelectedAttributeItems(value);
                          }}
                          getOptionLabel={(option) => option.name}
                          // onInputChange={(e) => this.onChangeGroupHandler(e)}
                          renderOption={(option) => <>{option.name}</>}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              InputProps={{
                                ...params.InputProps,
                                // autoComplete: "new-password",
                                endAdornment: (
                                  <>
                                    {/* {loading ? <CircularProgress color="inherit" size={20} /> : null} */}
                                    {/* {params.InputProps.endAdornment} */}
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                      )}
                    </TableCell>
                    <TableCell
                      style={{ border: "none", textAlign: "center" }}
                      scope="row"
                    >
                      <AppCheckbox
                        value={isActive}
                        onChange={(e) => setIsActive(!isActive)}
                        switchLabel={isActive ? "Active" : "Inactive"}
                        // label="Action"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <GreyBtn onClick={() => {
                  setIsVisible(false);
                  setSelectedAttributeItems([])
                  }}>Discard</GreyBtn>
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
                  onClick={() => handleAddApplicationSave()}
                  disabled={(!attributeItem.isCustom ? selectedAttributeItems.length == 0 : !textValue.length) || saving}
                  disableElevation
                >
                  {saving ? 'Saving' : 'Save'}
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
              title={rulesDetailsById && rulesDetailsById.allConditionApplied !== true ? 'Condition - Executing Any condition in active state' : 'Condition - Executing All condition in active state'}
              data={conditionList.content}
              columns={[
                { title: "Attribute Type", field: "attributeName" },
                {
                  title: "Attribute Value",
                  render: (rowData) => {
                    return (
                      <>
                        {rowData.attributeValue.map((val, i) => {
                          if (rowData.attributeValue.length - 1 !== i) {
                            return (
                              <span key={i}>
                                <span>{val}</span>
                                <span>,</span>
                              </span>
                            );
                          } else {
                            return <span key={i}>{val}</span>;
                          }
                        })}
                      </>
                    );
                  },
                },
                {
                  title: "Status",
                  render: (rowData) => {
                    return (
                      <>
                        <AppCheckbox
                          value={rowData.status}
                          disabled={isActiveForRoles(['READ_ONLY'])}
                          onChange={(e) => handleStatus(e, rowData)}
                          switchLabel={rowData.status ? "Active" : "Inactive"}
                          label=""
                        />
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
                // paginationType: "stepped",
                paging: false,
                draggable: false,
                actionsColumnIndex: -1,
                search: false,
              }}
              actions={[
                {
                  icon: () => (
                    <Avatar
                      src={require("../../../../../../assets/Delete.png")}
                      className={classes.editDeleteIcon}
                    />
                  ),
                  tooltip: "Delete Condition",
                  disabled: !isActiveForRoles(["ORG_ADMIN"]),
                  onClick: (event, rowData) => {
                    
                    setShowConfirmation(true);
                    setDeleteId(rowData.id);
                    setDeleteName(rowData.attributeName);
                  },
                },
              ]}
              localization={{
                body: {
                  emptyDataSourceMessage: (
                    <span>
                      Please ensure one active condition to enforce this rule
                    </span>
                  ),
                },
              }}
            />
          </Grid>
          <Grid container className={classes.paginationContainer} >
            {/* <TablePagination
              component="div"
              // rowsPerPageOptions={[5, 10, 25, 50]}
              count={totalElements}
              page={query.pageNo}
              onChangePage={handleChangePage}
              rowsPerPage={query.size}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            /> */}
            <CustomPagination                 
                  count={Math.ceil(totalElements / query.size)}
                  totalCount = {totalElements}
                  page={query.pageNo}
                  onChangePage={handleChangePage}
                  rowsPerPage={query.size}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
              />
          </Grid>
        </Grid>
      </CardViewWrapper>
    </div>
  );
};

export default AddNewRuleCondition;

import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Grid,
  makeStyles,
  MenuItem,
  Modal,
  TablePagination,
} from "@material-ui/core";
import { Link as Linking } from "react-router-dom";
import MaterialTable from "material-table";
import moment from "moment";
import { callApi, getTenant } from "../../../../../utils/api";
import { showSuccess } from "../../../../../utils/notifications";
import Dustbin from "../../../../../assets/Dustbin.png";
import Edit from "../../../../../FrontendDesigns/new/assets/img/icons/edit.svg";
import Delete from "../../../../../FrontendDesigns/new/assets/img/icons/Delete.svg";
import Plus from "../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/plus.svg";
import { isActiveForRoles } from "../../../../../utils/auth";
import AddEditHook from "./addEditHook";
import DropDown from '../../../../../components/DropDownComponent'
import ActiveStatusChip from "../../../../../components/HOC/ActiveStatusChip";
import InactiveStatusChip from "../../../../../components/HOC/InactiveStatusChip";
import CustomPagination from "../../../../../components/CustomPagination";
import { getFormatedDate } from "../../../../../utils/helper";

const defaultQuery = {
  order: "ASC",
  pageNo: 0,
  size: 10,
  sortBy: "name",
  keyword:'',
  filter:{    
      action:""
  },
  sortOn:[]
};
const hookActionType = [
    { label: "Type", value: "" },
    { label: "PRE", value: "PRE" },
    { label: "POST", value: "POST" },
  ];
const useStyles = makeStyles((theme) => ({
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
      border: "1px solid #ddd",
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
  rulesSearchAdd: {
    float: "right",
  },
  tableAddIcon: {
    height: 32,
  },
  editDeleteIcon: {
    "& img": {
      width: "16px",
      height: "16px",
    },
  },
  cardViewWrapper: {
    padding: theme.spacing(3, 2),
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
  },
  displayflex: {
    display: "flex",
  },
  pointer: {
    cursor: "pointer",
  },
}));

const HookConfig = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [query, _setQuery] = useState(defaultQuery);
  const [totalData, setTotalData] = useState(100);
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [ids, setIds] = useState("");
  const [saving, setSaving] = useState(false);
  const [screens, setScreens] = useState({ isEditId: "", isAdd: false });
  
  const downloadData = () => {
    callApi(`/utilsrvc/hook/config/list`, "POST",{},"", false, {
      tenant: getTenant(),
    })
      .then((e) => {
        if (e.success) {
          setData(e.data.content);
          setTotalData(e.data.content.length);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getFilterData = ()=>{
      let reqData = {
        pageNumber:query.pageNo,
        pageSize:query.size,
        sortDirection:query.order,
        filter:{type:query.filter.action},
        keyword:query.keyword,
        sortOn:query.sortOn
      }
    callApi(`/utilsrvc/hook/config/list`, "POST",reqData,"", false, {
        tenant: getTenant(),
      })
    .then((e) => {
      if (e.success) {
        setData(e.data.content);
        setTotalData(e.data.content.length);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }
  // useEffect(() => downloadData(), []); 
  useEffect(() => {
    if(query.filter.action){
      getFilterData()
    }else{
      if(query.filter.action === ""){
        downloadData()
      }
    }
  }, [query]); 

  const deleteApp = () => {
    setSaving(true);
    callApi(`/utilsrvc/hook/config/${ids}`, "DELETE", {}, "", false, {
      tenant: getTenant(),
    })
      .then((e) => {
        setSaving(false);
        if (e.success) {
          showSuccess("Deleted Successfully!");
          downloadData();
          handleModalClose();
        }
      })
      .catch(() => {
        setSaving(false);
      });
  };
  const handleModalClose = () => {
    setOpen(false);
    setName("");
    setIds("");
  };
  function getModalStyle() {
    const top = 28;
    const left = 35;

    return {
      top: `${top}%`,
      left: `${left}%`,
    };
  }

  const handleDeleteClick = (rowData) => {
    setOpen(true);
    setName(rowData.action);
    setIds(rowData.id);
  };
  const body = (
    <div>
      <div style={modalStyle} className={classes.paper}>
        <div style={{ display: "block" }}>
          <img
            alt="Dustbin"
            src={Dustbin}
            style={{ margin: "25px 0 10px 0" }}
          />
          <div style={{ paddingBottom: "10px" }}>
            <span className={classes.modalheader}>Delete {name} Action</span>
          </div>
        </div>
        <div className={classes.content}>
          <div style={{ paddingTop: "10px" }}>
            <span className={classes.modalcontent}>
              Warning! This cannot be undone.
            </span>
          </div>
          <Button
            disabled={saving}
            onClick={deleteApp}
            variant="contained"
            style={{ margin: "10px" }}
            color="primary"
          >
            {!saving ? "Delete" : "Deleting"}
          </Button>
          <div style={{ padding: "0 0 20px 0" }}>
            <Linking onClick={handleModalClose} className={classes.modalcancel}>
              Cancel
            </Linking>
          </div>
        </div>
      </div>
    </div>
  );

  const handleChangePage = (event, newPage) =>
    _setQuery({ ...query, pageNo: newPage });
  const handleChangeRowsPerPage = (event) => {
    _setQuery({ ...query, pageNo: 0, size: parseInt(event, 10) });
  };

  const columns = [
    {
      title: "Action",
      field: "action",
      cellStyle: { fontWeight: "700", border: "none" },
    },
    { title: "Type", field: "type" },
    { title: "Status", field: "status",render: rowData => (
       rowData.status === true ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip>
    )},
    {
      title: "Created By",
      field: "createdBy",      
    },
    {
      title: "Created On",
      field: "updated",
      render: (row) => (
        <span>
          {row.updated
            ? getFormatedDate(row["updated"], "DD/MM/YYYY")
            : ""}
        </span>
      ),
    },
  ];

  const handleEditClick = (id) => {
    setScreens({ isEditId: id, isAdd: true });
  };
  const handleAdd = () => {
    setScreens({ isEditId: "", isAdd: true });
  };
  
  console.log(query.pageNo,totalData);


  return !screens.isAdd ? (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Box className={classes.cardViewWrapper}>
            <Grid container spacing={2}>
              <Grid item xs={12} className={classes.ruleTable}>
                <MaterialTable
                  title=""
                  columns={columns}
                  data={data}
                  // isLoading={loading}
                  options={{
                    paging: false,
                    rowStyle: {
                      border: "1px solid #ddd",
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
                    draggable: true,
                    actionsColumnIndex: -1,
                  }}
                  localization={{
                    pagination: {
                      labelRowsPerPage: "",
                      labelDisplayedRows:
                        "Displaying {from}-{to} of {count} records",
                    },
                  }}
                  actions={[
                    {
                      icon: () =>
                        isActiveForRoles(["ORG_ADMIN"]) && (
                          <div className={classes.displayflex}>
                            <DropDown
                              title={query.filter.action ? query.filter.action : "Action" }
                              options={hookActionType}
                              body={hookActionType.map((o) => {
                                return (
                                  <MenuItem
                                    key={o.label}
                                    onClick={(e) => {
                                      _setQuery({...query,filter:{action:o.value}});
                                    //   downloadData(o.type);
                                    }}
                                  >
                                    <div style={{ display: "flex" }}>
                                      <span
                                        style={{
                                          fontStyle: "normal",
                                          fontWeight: "normal",
                                          fontSize: "12px",
                                          lineHeight: "20px",
                                          color: "#8998AC;",
                                          marginLeft: "0px",
                                        }}
                                      >
                                        {o.label}
                                      </span>
                                    </div>
                                  </MenuItem>
                                );
                              })}
                            />
                            <div
                              className={classes.pointer}
                              className="primary-btn-view"
                              onClick={handleAdd}
                            >
                              <img src={Plus} alt="" title /> ADD NEW
                            </div>
                          </div>
                        ),
                      isFreeAction: true,
                    },
                    {
                      icon: () => <img src={Edit} alt="" title />,
                      tooltip: "Edit Hook Config",
                      hidden: !isActiveForRoles(["ORG_ADMIN"]),
                      onClick: (event, rowData) => handleEditClick(rowData.id),
                    },
                    {
                      icon: () => <img src={Delete} alt="" title />,
                      tooltip: "Delete Hook Config",
                      hidden: !isActiveForRoles(["ORG_ADMIN"]),
                      onClick: (event, rowData) => handleDeleteClick(rowData),
                    },
                  ]}
                />
                <Modal open={open} onClose={handleModalClose}>
                  {body}
                </Modal>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      {/* <TablePagination
        component="div"
        // rowsPerPageOptions={[12, 24, 60, 120]}
        count={totalData}
        page={query.pageNo}
        onChangePage={handleChangePage}
        rowsPerPage={query.size}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
      <CustomPagination
                   count={Math.ceil(totalData / query.size)}
                   totalCount = {totalData}
                   page={query.pageNo}
                   onChangePage={handleChangePage}
                   rowsPerPage={query.size}
                   onChangeRowsPerPage={handleChangeRowsPerPage}
              />
    </>
  ) : (
    <AddEditHook screens={screens} allData={data} setScreens={setScreens} downloadData={downloadData} />
  );
};

export default HookConfig;

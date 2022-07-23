import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import AddIcon from "@material-ui/icons/Add";
import { Link as Linking } from "react-router-dom";
import VisibilityIcon from '@material-ui/icons/Visibility'
import {
  GetAdminRuleListAction,
  SetRoleIDAction,
} from "./actions/administrationRuleActions";
import CardViewWrapper from "../../../../../components/HOC/CardViewWrapper";
import ScrollWrapper from "../../../../../components/HOC/ScrollWrapper";
import ActiveStatusChip from "../../../../../components/HOC/ActiveStatusChip";
import InactiveStatusChip from "../../../../../components/HOC/InactiveStatusChip";
import AddNewRuleModal from "./AddNewRulesModal";
import { isActiveForRoles } from "../../../../../utils/auth";
import ProvisionRuleMain from './ProvisionRule/';
import CommonSectionRulesConfig from './CommonSectionRulesConfig';
import CustomPagination from "../../../../../components/CustomPagination";

const styles = (theme) => ({
  ruleTable: {
    paddingBottom: "0px !important",
    marginBottom: "-16px",
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
      borderCollapse: "separate",
      borderSpacing: "0 15px",
    },
    "& th ": {
      padding: "0px 16px !important",
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
  marginLeft: {
    marginLeft: 16
}
});

class AdminRules extends Component {
  constructor(props) {
    super(props);
    this.state = {
    
      data: [],
      openAddRule: false,
      ruleID: "",
      isProvision: false,
      listRules: true,
      chunk:[]
    };
  }

  columns= [
    {
      title: "Name",
      field: "name",
      cellStyle: { fontWeight: "700", border: "none" },
    },
    { title: "Description", field: "description" },
    { title: "Type", field: "actionGroupId" },
    {
      title: "Status",
      field: "active",
      render: (rowData) =>
        rowData.active === true ? (
          <ActiveStatusChip>Active</ActiveStatusChip>
        ) : (
          <InactiveStatusChip>Inactive</InactiveStatusChip>
        ),
    },
    { title: "Created by", field: "createdBy" },
  ]
  componentDidMount = () => {
    this.props.GetAdminRuleListAction();
  };
  handleClose = () => {
    this.setState({
      openAddRule: false,
    });
  };

  handleAddNewRule = () => {
    this.setState({
      openAddRule: true,
    });
  };

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (this.props.adminRuleList !== nextProps.adminRuleList) {
      if (nextProps.adminRuleList !== undefined) {
        this.setState({
          data: nextProps.adminRuleList.data,
        });
      }
    }
  };

  setIsProvision = ()=>{
    this.setState({ 
      isProvision: true
    })
  }

  handleClickEditRuleCondition = (event, rowData) => {
    this.props.SetRoleIDAction(rowData.id);
    if (rowData.actionGroupId !== "MFA") {
      this.setState({ 
        ruleID: rowData.id,
        isProvision: true,
        listRules: false
       });
    } else {
      this.setState(
        {
          ruleID: rowData.id,
          listRules: false
        },
        // () => {
        //   this.props.SetRoleIDAction(rowData.id);
        //   let url = `/dash/admin/rules/${rowData.id}`;
        //   this.props.history.push(url);
        // }
      );
    }
  };

  setChunk=(v)=>{
    // console.log("chunk data",v,this.state.data)
    this.setState((state)=>{
     
      return {...state,chunk:v}
    })
  }


  render() {
    // console.log(this.state.data)
    const { classes, loading } = this.props;
    const { data,  openAddRule, isProvision,listRules,chunk } = this.state;

    return (
      <>
        {openAddRule && (
          <AddNewRuleModal
            open={openAddRule}
            setIsProvision={()=>this.setIsProvision()}
            handleClose={() => this.handleClose()}
          />
        )}
        {listRules ? (
          <div style={{ overflow: "auto", height: "min-content" }}>
            <Grid container>
              <Grid item xs={12}>
                <CardViewWrapper>
                  <Grid container spacing={2}>
                    <Grid item xs={12} className={classes.ruleTable}>
                      <MaterialTable
                        title="Rule"
                        columns={this.columns}
                        data={chunk}
                        isLoading={loading}
                        options={{
                          paging: false,
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
                          draggable: true,
                          actionsColumnIndex: -1,
                        }}
                        // localization={{
                        //   pagination: {
                        //     labelRowsPerPage: "",
                        //     labelDisplayedRows:
                        //       "Displaying {from}-{to} of {count} records",
                        //   },
                        // }}
                        actions={
                          [
                            {
                              icon: () => (
                                <span>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    disableElevation
                                    disableFocusRipple
                                    disableRipple
                                    className={classes.tableAddIcon}
                                  >
                                    ADD Rule
                                  </Button>
                                </span>
                              ),
                              isFreeAction: true,
                              hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
                              onClick: () => this.handleAddNewRule(),
                            },
                            {
                              icon: () => (
                                isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : 
                                <Avatar
                                  src={require("../../../../../assets/Edit.png")}
                                  className={classes.editDeleteIcon}
                                />
                              ),
                              tooltip: "Edit Rule",
                              // hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
                              onClick: (event, rowData) =>
                                this.handleClickEditRuleCondition(
                                  event,
                                  rowData
                                ),
                            },
                          ]
                        }
                      />
                    </Grid>
                  </Grid>
                </CardViewWrapper>
                <CustomPagination data={data} setChunk={this.setChunk} />
              </Grid>
            </Grid>
          </div>
        ) : !isProvision ? (
          <CommonSectionRulesConfig />
        ) : (
          <ScrollWrapper>
            <Grid container>
              <Grid item xs={12}>
                <Grid container justify="center" alignItems="center">
                  <Grid item xs={12} className={classes.marginLeft}>
                    <Linking to="/dash/admin/rules">
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        size="small"
                        disableElevation
                      >
                        Back To Rule List
                      </Button>
                    </Linking>
                  </Grid>
                </Grid>
                <ProvisionRuleMain history={this.props.history} />
              </Grid>
            </Grid>
          </ScrollWrapper>
        )}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.adminRuleReducer.loading,
    adminRuleList:
      state.adminRuleReducer.adminRuleList !== null &&
      state.adminRuleReducer.adminRuleList,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators(
      {
        GetAdminRuleListAction,
        SetRoleIDAction,
      },
      dispatch
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AdminRules));

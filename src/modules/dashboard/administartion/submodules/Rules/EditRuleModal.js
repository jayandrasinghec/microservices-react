import React, { Component } from "react";
import { Field, reduxForm, reset,change,untouch } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import MenuItem from "@material-ui/core/MenuItem";

import {
  renderTextField,
  renderSelectField,
  renderToggle,
} from "../../../../../shared/reduxFields";
import {
  PostModifyExistingRuleAction,
  GetRulesDetailsByIdAction,
} from "./actions/administrationRuleActions";
import GreyBtn from "../../../../../components/HOC/GreyBtn";
import CustomInputLabel from "../../../../../components/HOC/CustomInputLabel";
import validate from "./AddNewRulesModalValidate";
import { isActiveForRoles } from "../../../../../utils/auth";

const styles = (theme) => ({
  helpText: {
    background: "#f1e09a",
    padding: "16px",
    borderRadius: "4px",
    marginTop: "94px",
    "& div": {
      display: "flex",
      alignItems: "center",
      marginBottom: "8px",
      "& svg": {
        marginRight: "4px",
      },
    },
  },
  rulesSearchAdd: {
    float: "right",
  },
  questionItem: {
    padding: "8px 0px 8px 16px",
  },
  custDialog: {
    "& .MuiDialog-paper": {
      background: "#e6eaf6",
      width: "500px",
    },
    "& .MuiDialogActions-root": {
      padding: "8px 16px 16px 16px",
      justifyContent: "unset",
    },
  },
  closeButton: {
    float: "right",
    marginTop: "-8px",
  },
  statusSwitch: {
    marginBottom: "-16px",
    marginLeft: "0px",
  },
});


const resetFields = ['ruleName','description','status','isAdaptive','adaptiveScore','allConditionApplied',]

class EditRuleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      isActive: false,
      rulesDetailsById: null,
      isAdaptive: false,
      type: "MFA",
      allConditionApplied: false,
    };
  }

  componentDidMount = () => {
    if (this.props.ruleId !== null) {
      this.props.GetRulesDetailsByIdAction(this.props.ruleId);
    } else {
      this.setState({
        redirect: true,
      });
    }
  };

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (this.props.ruleDetailsById !== nextProps.ruleDetailsById) {
      this.setState({
        isActive: nextProps.ruleDetailsById.active,
        isAdaptive: nextProps.ruleDetailsById.isAdaptive,
        allConditionApplied:nextProps.ruleDetailsById.allConditionApplied
      });
    }
  };

  handleReset = () => {
    this.setState(
      {
        isActive: false,        
        isAdaptive: false,
        allConditionApplied: false,
      },
      () => {
        // this.props.dispatch(reset("EditRuleModalForm"));
        for (var i = 0; i < resetFields.length; i++) {
          this.props.dispatch(change('EditRuleModalForm',resetFields[i],null))
          this.props.dispatch(untouch('EditRuleModalForm',resetFields[i]))
        }
      }
    );
  };

  activeToggleHandler = () => {
    this.setState({
      isActive: !this.state.isActive,
    });
  };

  adaptiveToggleHandler = () => {
    this.setState({
      isAdaptive: !this.state.isAdaptive,
    });
  };

  onFormSubmitHandler = (formData) => {
    let postData = {
      id: this.props.ruleId,
      name: formData.ruleName,
      description: formData.description,
      active: formData.status,
      actionGroupId: formData.type,
      isAdaptive: formData.isAdaptive,
      adaptiveScore: formData.adaptiveScore,
      allConditionApplied:formData.allConditionApplied
    };
    this.props.PostModifyExistingRuleAction(postData);
    this.props.handleClose();
  };

  render() {
    const { classes, handleSubmit, initialValues } = this.props;
    const { isActive, isAdaptive, type, allConditionApplied } = this.state;

    return (
      <div className={classes.custDialog}>
        <Dialog
          open={this.state.open}
          onClose={() => this.props.handleClose()}
          aria-labelledby="form-dialog-title"
          className={classes.custDialog}
        >
          <DialogTitle id="form-dialog-title">
            EDIT RULE
            <IconButton aria-label="close" className={classes.closeButton}>
              <CloseIcon onClick={() => this.props.handleClose()} />
            </IconButton>
          </DialogTitle>
          <form onSubmit={handleSubmit((val) => this.onFormSubmitHandler(val))}>
            <DialogContent>
              <Card elevation={0}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <CustomInputLabel>Type</CustomInputLabel>
                      <Field
                        id="type"
                        name="type"
                        required={true}
                        disabled={true}
                        component={renderSelectField}
                        onChange={(event, newValue, previousValue, name) => {
                          this.setState({ type: newValue });
                        }}
                      >
                        <MenuItem value="MFA">MFA</MenuItem>
                        <MenuItem value="PROVISION">PROVISION</MenuItem>
                      </Field>
                    </Grid>
                    <Grid item xs={12}>
                      <CustomInputLabel>Name<span className="text-danger">*</span></CustomInputLabel>
                      <Field
                        id="ruleName"
                        name="ruleName"
                        required={true}
                        disabled={!isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN'])}
                        inputProps={{
                          maxLength: 100,
                          minLength: 2,
                        }}
                        component={renderTextField}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomInputLabel>Description<span className="text-danger">*</span></CustomInputLabel>
                      <Field
                        id="description"
                        name="description"
                        disabled={!isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN'])}
                        required={true}
                        multiline
                        rows={3}
                        inputProps={{
                          maxLength: 200,
                          minLength: 2,
                        }}
                        component={renderTextField}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Field
                        name="status"
                        color="primary"
                        checked={isActive}
                        disabled={!isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN'])}
                        label="Status"
                        labelPlacement="start"
                        onChange={() => this.activeToggleHandler()}
                        component={renderToggle}
                      ></Field>
                    </Grid>
                    {initialValues.type === "MFA" && type === "MFA" ? (
                      <Grid item xs={12}>
                        <Field
                          name="isAdaptive"
                          color="primary"
                          checked={isAdaptive}
                          disabled={!isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN'])}
                          label="Adaptive MFA"
                          labelPlacement="start"
                          onChange={() => this.adaptiveToggleHandler()}
                          component={renderToggle}
                        ></Field>
                      </Grid>
                    ) : (
                      <Grid item xs={12}>
                        <Field
                          name="allConditionApplied"
                          color="primary"
                          checked={allConditionApplied}
                          disabled={!isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN'])}
                          label={`${
                            allConditionApplied ? "All" : "Any"
                          } Condition Apply`}
                          labelPlacement="start"
                          onChange={() =>
                            this.setState({
                              allConditionApplied: !allConditionApplied,
                            })
                          }
                          component={renderToggle}
                        ></Field>
                      </Grid>
                    )}
                    {isAdaptive && (
                      <Grid item xs={12}>
                        <CustomInputLabel>Adaptive Score<span className="text-danger">*</span></CustomInputLabel>
                        <Field
                          name="adaptiveScore"
                          required={true}
                          disabled={!isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN'])}
                          type="number"
                          inputProps={{
                            min: 20,
                            max: 100,
                          }}
                          component={renderTextField}
                        />
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </DialogContent>
            <DialogActions>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6} md={6} lg={6}>
                  <GreyBtn onClick={() => this.handleReset()}>Reset</GreyBtn>
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
                    type="submit"
                    size="small"
                    disabled={!isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN'])}
                    disableElevation
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    );
  }
}

EditRuleModal = reduxForm({
  form: "EditRuleModalForm",
  validate,
  enableReinitialize: true,
})(EditRuleModal);

function mapStateToProps(state) {
  let initialValueData = {};
  if (
    state.adminRuleReducer.ruleDetailsById !== null &&
    state.adminRuleReducer.ruleDetailsById !== undefined &&
    state.adminRuleReducer.ruleDetailsById.data !== null
  ) {
    let data = state.adminRuleReducer.ruleDetailsById.data;
    initialValueData = {
      ruleName: data.name,
      description: data.description,
      type: data.actionGroupId,
      status: data.active === true ? true : false,
      adaptiveScore: data.adaptiveScore,
      isAdaptive: data.isAdaptive,
      allConditionApplied:data.allConditionApplied
    };
  }

  return {
    loading: state.adminRuleReducer.loading,
    initialValues: initialValueData,
    ruleId: state.adminRuleReducer.ruleId,
    ruleDetailsById:
      state.adminRuleReducer.ruleDetailsById !== null &&
      state.adminRuleReducer.ruleDetailsById.data,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators(
      {
        PostModifyExistingRuleAction,
        GetRulesDetailsByIdAction,
      },
      dispatch
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(EditRuleModal));

import React, { Component } from "react";
import { Field, reduxForm, reset } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";

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
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import MenuItem from "@material-ui/core/MenuItem";

import {
  renderTextField,
  renderSelectField,
} from "../../../../../shared/reduxFields";
import {
  PostAddRuleAction,
  SetRoleIDAction,
} from "././actions/administrationRuleActions";
import GreyBtn from "../../../../../components/HOC/GreyBtn";
import CustomInputLabel from "../../../../../components/HOC/CustomInputLabel";
import validate from "./AddNewRulesModalValidate";

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

class AddNewRuleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      isActive: false,
      isAdaptive: false,
      type: "MFA",
      allConditionApplied:false,
      saving: false
    };
  }

  handleReset = () => {
    this.setState(
      {
        isActive: false,
        isAdaptive: false,
      },
      () => {
        this.props.dispatch(reset("AddNewRuleModalForm"));
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

  componentDidUpdate = (prevProps, nextState) => {
    if (this.props.addedRule !== prevProps.addedRule) {
      if (this.props.addedRule.success === true) {
        let roleId = this.props.addedRule.data.id;
        this.props.SetRoleIDAction(roleId);
        if(this.state.type==="MFA") {
          // this.props.history.push("/dash/admin/rules/assignedto");
          this.props.history.push("/dash/admin/rules");
        }else{
          this.props.handleClose()
          this.props.setIsProvision()
          this.props.history.push("/dash/admin/rules");
        }
      }
    }
  };

  onFormSubmitHandler = (formData) => {
    this.setState({
      saving: true
    })
    let postData = {
      name: formData.ruleName,
      description: formData.description,
      active: this.state.isActive,
      actionGroupId: formData.type,
      isAdaptive: this.state.isAdaptive,
      adaptiveScore: formData.adaptiveScore,
    };
    if(this.state.type!=="MFA") {
       postData = {
        name: formData.ruleName,
        description: formData.description,
        active: this.state.isActive,
        actionGroupId: formData.type,
        allConditionApplied:this.state.allConditionApplied
      };
    }
    this.props.PostAddRuleAction(postData);
  };

  render() {
    const { classes, handleSubmit } = this.props;
    const { isActive, isAdaptive, type, allConditionApplied, saving } = this.state;
    return (
      <div className={classes.custDialog}>
        <Dialog
          open={this.state.open}
          onClose={() => this.props.handleClose()}
          aria-labelledby="form-dialog-title"
          className={classes.custDialog}
        >
          <DialogTitle id="form-dialog-title">
            ADD NEW RULE
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

                    {type === "MFA" ? (
                      <Grid item xs={12}>
                        <FormControlLabel
                          className={classes.statusSwitch}
                          label="Enable Adaptive MFA"
                          labelPlacement="start"
                          control={
                            <Switch
                              name="isAdaptive"
                              color="primary"
                              checked={isAdaptive}
                              onChange={() => this.adaptiveToggleHandler()}
                            />
                          }
                        />
                      </Grid>
                    ):(
                      <Grid item xs={12}>
                        <FormControlLabel
                          id="allConditionApplied"
                          className={classes.statusSwitch}
                          label={`${allConditionApplied?'All':'Any'} Condition Apply`}
                          labelPlacement="start"
                          control={
                            <Switch
                              name="allConditionApplied"
                              color="primary"
                              checked={allConditionApplied}
                              onChange={() => this.setState({allConditionApplied:!allConditionApplied})}
                            />
                          }
                        />
                      </Grid>
                    )}
                    {isAdaptive && (
                      <Grid item xs={12}>
                        <CustomInputLabel>Adaptive Score<span className="text-danger">*</span></CustomInputLabel>
                        <Field
                          id="adaptiveScore"
                          name="adaptiveScore"
                          required={true}
                          type="number"
                          inputProps={{
                            min: 20,
                            max: 100,
                          }}
                          component={renderTextField}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <FormControlLabel
                        className={classes.statusSwitch}
                        label="Status"
                        labelPlacement="start"
                        control={
                          <Switch
                            name="checked"
                            color="primary"
                            checked={isActive}
                            onChange={() => this.activeToggleHandler()}
                          />
                        }
                      />
                    </Grid>
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
                    disableElevation
                    disabled={saving}
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

AddNewRuleModal = reduxForm({
  form: "AddNewRuleModalForm",
  validate,
  enableReinitialize: true,
})(AddNewRuleModal);

function mapStateToProps(state) {
  let initialValueData = {
    type:'MFA',
  };
  return {
    loading: state.adminRuleReducer.loading,
    initialValues: initialValueData,
    addedRule:
      state.adminRuleReducer.addedRule !== null &&
      state.adminRuleReducer.addedRule,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators(
      {
        PostAddRuleAction,
        SetRoleIDAction,
      },
      dispatch
    ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(styles)(AddNewRuleModal)));

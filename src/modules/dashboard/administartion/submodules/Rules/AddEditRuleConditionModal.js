import React, { Component } from 'react';
import { Field, reduxForm, reset, change } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import MenuItem from "@material-ui/core/MenuItem";
import CardViewWrapperTitle from "../../../../../components/HOC/CardViewWrapperTitle"

import { renderTextField, renderSelectField } from '../../../../../shared/reduxFields';
import { PostCreateRuleConditionAction, GetRuleActionGroupDetailsAction, GetConditionNameAction } from './actions/administrationRuleActions';
import GreyBtn from '../../../../../components/HOC/GreyBtn';
import CustomInputLabel from '../../../../../components/HOC/CustomInputLabel';
import validate from './AddNewRulesModalValidate';
import { Typography } from '@material-ui/core';

const styles = theme => ({
    custDialog: {
        '& .MuiDialog-paper': {
            background: "#e6eaf6",
            width: "900px",
        },
        '& .MuiDialogActions-root': {
            padding: "8px 16px 16px 16px",
            justifyContent: "unset",
        }
    },
    closeButton: {
        float: "right",
        marginTop: "-8px",
    },
    statusSwitch: {
        marginTop: 8,
        '& .MuiFormControlLabel-label': {
            color: "#8392a7",
        }
    },
    typeName: {
        fontSize: 16,
        fontWeight: 600,
        marginTop: 16,
    },
    ipAddressText: {
        color: "#8392a7",
        fontSize: 12,
        '& span': {
            color: "#1F4287",
            fontWeight: 600,

        }
    }
});

class AddEditRuleConditionsModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: props.open,
            isActive: false,
            ruleActionGroupDetails: {},
            accessRequestOrigin: [],
            matchingCriteria: [{name: 'Equal', value:"EQUALS"}, {name: 'Not Equal', value:"NOT_EQUALS"}],
            conditionName: [],
            eventOccurence: [],
            accessRequestOriginValue: '',
            matchingCriteriaValue: ''
        }
    }

    componentDidMount = () => {
        this.props.dispatch(reset('AddEditRuleConditionsModalForm'));
        this.props.GetRuleActionGroupDetailsAction();
    }

    UNSAFE_componentWillReceiveProps = (nextProps) => {
        if (this.props.ruleActionGroupDetails !== nextProps.ruleActionGroupDetails) {
            if (nextProps.ruleActionGroupDetails !== null && nextProps.ruleActionGroupDetails !== undefined) {
                this.setState({
                    ruleActionGroupDetails: nextProps.ruleActionGroupDetails.data,
                    accessRequestOrigin: nextProps.ruleActionGroupDetails.data.conditionAttributes,
                    eventOccurence: nextProps.ruleActionGroupDetails.data.occurences,
                })
            }
        }
        if (this.props.conditionName !== nextProps.conditionName) {
            if (nextProps.conditionName !== null && nextProps.conditionName !== undefined) {
                this.setState({
                    conditionName: nextProps.conditionName.data,
                })
            }
        }

    }

    handleReset = () => {
        this.setState({
            isActive: false
        }, () => {
            this.props.dispatch(reset('AddNewRuleModalForm'));
            this.props.dispatch(reset('AddEditRuleConditionsModalForm'));
        })
    }

    activeToggleHandler = () => {
        this.setState({
            isActive: !this.state.isActive
        })
    }

    accessRequestOriginChangeHandler = (event) => {
        let accessRequestOrigin = event.target.value;
        if (accessRequestOrigin.toUpperCase() !== "ZONE") {
            this.props.dispatch(change('AddEditRuleConditionsModalForm', 'gatewayIps', ''));
            this.props.dispatch(change('AddEditRuleConditionsModalForm', 'proxyIps', ''));
            this.props.dispatch(change('AddEditRuleConditionsModalForm', 'conditionName', ''));
        }
        this.setState({
            accessRequestOriginValue: accessRequestOrigin
        }, () => {
            let ruleActionGroupDetails = this.state.ruleActionGroupDetails.conditionAttributes;
            let selectedAROdetails = ruleActionGroupDetails.filter(val => val.value === accessRequestOrigin);
            let serviceName = selectedAROdetails[0].serviceName;
            let serviceUrl = selectedAROdetails[0].serviceUrl;
            let URL = serviceName + serviceUrl
            this.props.GetConditionNameAction(URL);
        })
    }

    matchingCriteriaChangeHandler = (event) => {
      let matchingCriteria = event.target.value;
      this.setState({
          matchingCriteriaValue: matchingCriteria
      })
  }

    conditionNameChangeHandler = (event) => {
        let selectedConditionName = event.target.value;
        let accessRequestOriginValue = this.state.accessRequestOriginValue;
        if (accessRequestOriginValue.toUpperCase() === "ZONE") {
            let conditionName = this.state.conditionName;
            let selectedConditionNameDetails = conditionName.filter(val => val.name === selectedConditionName)
            this.props.dispatch(change('AddEditRuleConditionsModalForm', 'gatewayIps', selectedConditionNameDetails[0].gatewayIp));
            this.props.dispatch(change('AddEditRuleConditionsModalForm', 'proxyIps', selectedConditionNameDetails[0].proxyIp));
        }
    }

    onFormSubmitHandler = (formData) => {
        let postData = {
            "ruleId": this.props.ruleId,
            "type": formData.accessRequestOrigin,
            "name": formData.accessRequestOrigin,
            "value": formData.conditionName,
            "status": this.state.isActive,
            "occurence": formData.eventOccurence,
            "matches":this.state.matchingCriteriaValue
        }
        this.props.PostCreateRuleConditionAction(postData, this.props.ruleId);
        this.props.handleClose();
    }

    render() {
        const { classes, handleSubmit } = this.props;
        const { isActive, accessRequestOrigin, matchingCriteria, conditionName, eventOccurence, accessRequestOriginValue } = this.state;
        return (
            <div className={classes.custDialog}>
                <Dialog open={this.state.open} onClose={() => this.props.handleClose()} aria-labelledby="form-dialog-title" className={classes.custDialog}>
                    <DialogTitle id="form-dialog-title">ADD NEW CONDITION
                            <IconButton aria-label="close" className={classes.closeButton}>
                            <CloseIcon onClick={() => this.props.handleClose()} />
                        </IconButton>
                    </DialogTitle>
                    <form onSubmit={handleSubmit(val => this.onFormSubmitHandler(val))}>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={5} >
                                    <CustomInputLabel>Rule Name</CustomInputLabel>
                                    <Field
                                        id="ruleName"
                                        name="ruleName"
                                        disabled={true}
                                        component={renderTextField}
                                    />
                                </Grid>
                                <Grid item xs={4} container direction="column" alignItems="center" >
                                    <CustomInputLabel>Type</CustomInputLabel>
                                    <Typography className={classes.typeName}>MFA</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <CustomInputLabel>Status</CustomInputLabel>
                                    <FormControlLabel
                                        className={classes.statusSwitch}
                                        label="Status"
                                        labelPlacement="end"
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
                            <CardViewWrapperTitle>
                                Event (If Condition)
                            </CardViewWrapperTitle>
                            <Card elevation={0}>

                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} >
                                            <CustomInputLabel>Access Request Origin</CustomInputLabel>
                                            <Field
                                                id="accessRequestOrigin"
                                                name="accessRequestOrigin"
                                                required={true}
                                                component={renderSelectField}
                                                onChange={(e) => this.accessRequestOriginChangeHandler(e)}
                                            >
                                                {
                                                    accessRequestOrigin !== undefined && accessRequestOrigin.map((obj, index) => {
                                                        return <MenuItem key={index} value={obj.value}>{obj.name}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} >
                                            <CustomInputLabel>Event Occurence</CustomInputLabel>
                                            <Field
                                                id="eventOccurence"
                                                name="eventOccurence"
                                                required={true}
                                                component={renderSelectField}
                                            >
                                                {
                                                    eventOccurence !== undefined && eventOccurence.map((value, index) => {
                                                        return <MenuItem key={index} value={value}>{value}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                            <CardViewWrapperTitle>
                                Event Matches
                            </CardViewWrapperTitle>
                            <Card elevation={0}>

                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} >
                                            <CustomInputLabel>Matching Criteria</CustomInputLabel>
                                            <Field
                                                id="matchingCriteria"
                                                name="matchingCriteria"
                                                required={true}
                                                component={renderSelectField}
                                                onChange={(e) => this.matchingCriteriaChangeHandler(e)}
                                            >
                                                {
                                                    matchingCriteria !== undefined && matchingCriteria.map((obj, index) => {
                                                        return <MenuItem key={index} value={obj.value}>{obj.name}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                            <CardViewWrapperTitle>
                                Event Criteria
                            </CardViewWrapperTitle>
                            <Card elevation={0}>

                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} >
                                            <CustomInputLabel>
                                                {
                                                    accessRequestOriginValue.toUpperCase() === "ZONE"
                                                        ? 'Zone Name'
                                                        : accessRequestOriginValue.toUpperCase() === "DEVICE"
                                                            ? 'Device Name'
                                                            : accessRequestOriginValue.toUpperCase() === "COUNTRY"
                                                                ? 'Country Name'
                                                                : ''
                                                } 
                                            </CustomInputLabel>
                                            <Field
                                                id="conditionName"
                                                name="conditionName"
                                                required={true}
                                                onChange={(e) => this.conditionNameChangeHandler(e)}
                                                component={renderSelectField}
                                            >
                                                {
                                                    conditionName !== undefined && conditionName.map((obj, index) => {
                                                        return <MenuItem key={index} value={obj.name}>{obj.name}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} >

                                        </Grid>
                                        {accessRequestOriginValue.toUpperCase() === "ZONE" &&
                                            <>
                                                <Grid item xs={6} >
                                                    <CustomInputLabel>Gateway IPs</CustomInputLabel>
                                                    <Field
                                                        id="gatewayIps"
                                                        name="gatewayIps"
                                                        disabled={true}
                                                        component={renderTextField}
                                                    />
                                                    {/* <Typography className={classes.ipAddressText}>Add you current IP address <span>29.122.122.21</span></Typography> */}
                                                </Grid>
                                                <Grid item xs={6} >
                                                    <CustomInputLabel>Proxy IPs</CustomInputLabel>
                                                    <Field
                                                        id="proxyIps"
                                                        name="proxyIps"
                                                        disabled={true}
                                                        component={renderTextField}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                    </Grid>
                                </CardContent>
                            </Card>


                        </DialogContent>
                        <DialogActions>
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={6} md={6} lg={6}>
                                    <GreyBtn onClick={() => this.handleReset()}>Reset</GreyBtn>
                                </Grid>
                                <Grid item xs={6} sm={6} md={6} lg={6} container direction="row" justify="flex-end">
                                    <Button variant="contained" color="primary" type="submit" size="small" disableElevation>
                                        Save
                                </Button>
                                </Grid>
                            </Grid>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        )
    }
}

AddEditRuleConditionsModal = reduxForm({
    form: "AddEditRuleConditionsModalForm",
    validate,
    enableReinitialize: true
})(AddEditRuleConditionsModal);

function mapStateToProps(state) {
    let initialValue = {}
    if (state.adminRuleReducer.ruleDetailsById !== undefined && state.adminRuleReducer.ruleDetailsById !== null) {
        initialValue = {
            ruleName: state.adminRuleReducer.ruleDetailsById.data.name
        }
    }
    return {
        loading: state.adminRuleReducer.loading,
        initialValues: initialValue,
        ruleId: state.adminRuleReducer.ruleId,
        ruleActionGroupDetails: state.adminRuleReducer.ruleActionGroupDetails !== null && state.adminRuleReducer.ruleActionGroupDetails,
        conditionName: state.adminRuleReducer.conditionName !== null && state.adminRuleReducer.conditionName,
        ruleDetailsById: state.adminRuleReducer.ruleDetailsById !== null && state.adminRuleReducer.ruleDetailsById.data,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({
            PostCreateRuleConditionAction,
            GetRuleActionGroupDetailsAction,
            GetConditionNameAction
        }, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(AddEditRuleConditionsModal));


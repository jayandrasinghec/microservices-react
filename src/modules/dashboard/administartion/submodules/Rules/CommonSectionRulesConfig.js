import React, { Component } from 'react';
import { Field, reduxForm, reset, change } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Switch, Route, Redirect, Link as Linking } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import VisibilityIcon from '@material-ui/icons/Visibility'

import { renderSelectField } from '../../../../../shared/reduxFields';
import CardViewWrapper from "../../../../../components/HOC/CardViewWrapper"
import CardViewWrapperTitle from "../../../../../components/HOC/CardViewWrapperTitle"
import ActiveStatusChip from '../../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../../components/HOC/InactiveStatusChip';
import EditRuleModal from './EditRuleModal';
import { GetRulesDetailsByIdAction, PostDeleteRuleAction, PostFactorsActionableElementsAction, ClearRuleDetailsByID } from './actions/administrationRuleActions';
import { GetMfaConfigAction } from '../MultiFactorAuth/actions/administrationmfaActions'
import GreyBtn from '../../../../../components/HOC/GreyBtn';
import NestedSections from '../../components/NestedSections';
import AdminRuleConfigAssigned from './AdminRulesConfigAssigned';
import AdminRuleConfigConditions from './AdminRulesConfigConditions';
import AdminRuleConfigActions from './AdminRulesConfigActions';
import ScrollWrapper from "../../../../../components/HOC/ScrollWrapper";
import { isActiveForRoles } from '../../../../../utils/auth';
import AssignedTo from './AssignedTo';
import DeleteModal from '../../../../../components/DeleteModal';


const styles = theme => ({
    ruleCard: {
        margin: 16,
        padding: 16,
        borderRadius: 8,
        backgroundColor: "#fff",
        '& .ruleType': {
            color: "#363795",
            fontWeight: "700",
        },
        '& .ruleDesc': {
            color: "#8897ab",
        },
        '& .ruleName': {
            fontWeight: "700",
        },
        '& .editDeleteIcon': {
            '& img': {
                width: "16px",
                height: "16px",
            }
        },
        '& .adaptiveScore': {
            fontWeight: "500",
        },

    },
    ruleApplyRadio: {
        border: "1px solid #ccc",
        margin: "16px 0px 0px 0px",
        borderRadius: "4px",
        width: "100%",
        display: "block",
    },
    availableFactorCard: {
        display: "flex",
        alignItems: "center",
        fontWeight: "500",
        '& .MuiAvatar-circle': {
            marginRight: 16,
        }
    },
    marginLeft: {
        marginLeft: 16
    },
    navbar: {
        color: '#363795',
        background: '#eef1f8',
        boxShadow: '0px 0px',
        borderRadius: 8
    },
    tabs: {
        padding: '0px !important',
        "& .MuiTabPanel-root": {
            padding: '0px !important'
        },
        fontWeight: 500
    },
    wrapper: {
        padding: theme.spacing(2,1),
        backgroundColor: "#eef1f8",
        borderRadius: 8,
    },
    wrapper1: {
        padding: theme.spacing(3,2),
        backgroundColor: "#eef1f8",
        borderRadius: 8,
        margin: '20px 0px'
    },
    mfaLogos: {
      '& img': {
        width: 'auto',
        height: 'auto',
        objectFit: 'none'
      }
    }
});


class CommonSectionRulesConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            rulesDetailsById: {},
            redirect: false,
            mfaConfigDetails: null,
            value:"1",
            showConfirmation: false,
            deleteName: '',
            saving: false
        }
    }

    componentDidMount = () => {
      console.log(this.state);
        if (this.props.ruleId !== null) {
            this.props.GetRulesDetailsByIdAction(this.props.ruleId);
            this.props.GetMfaConfigAction();
        } else {
            this.setState({
                redirect: true
            })
        }
    }

    componentWillUnmount = () => {
      this.props.ClearRuleDetailsByID()
    }

    UNSAFE_componentWillReceiveProps = (nextProps) => {
        if (this.props.ruleDetailsById !== nextProps.ruleDetailsById) {
            if (nextProps.ruleDetailsById !== null) {
                this.setState({
                    rulesDetailsById: nextProps.ruleDetailsById
                }, () => {
                    if(nextProps.ruleDetailsById.isAdaptive === true){
                      if(this.state.value == "1"){
                        this.setState({ value: "2" })
                      }
                    }
                    if (nextProps.ruleDetailsById.actionableElements === null) {
                        this.props.dispatch(reset('CommonSectionRulesConfigForm'));
                    } else {
                        if (nextProps.ruleDetailsById.actionableElements.GoogleAuthenticator) {
                            this.props.dispatch(change('CommonSectionRulesConfigForm', 'GoogleAuthenticator', nextProps.ruleDetailsById.actionableElements.GoogleAuthenticator))
                        }
                        if (nextProps.ruleDetailsById.actionableElements.CymmetriAuthenticator) {
                            this.props.dispatch(change('CommonSectionRulesConfigForm', 'CymmetriAuthenticator', nextProps.ruleDetailsById.actionableElements.CymmetriAuthenticator))
                        }
                        if (nextProps.ruleDetailsById.actionableElements.SecretQuestions) {
                            this.props.dispatch(change('CommonSectionRulesConfigForm', 'SecretQuestions', nextProps.ruleDetailsById.actionableElements.SecretQuestions))
                        }
                        if (nextProps.ruleDetailsById.actionableElements.SMSAuthenticator) {
                            this.props.dispatch(change('CommonSectionRulesConfigForm', 'SMSAuthenticator', nextProps.ruleDetailsById.actionableElements.SMSAuthenticator))
                        }
                        if (nextProps.ruleDetailsById.actionableElements.PushAuthenticator) {
                            this.props.dispatch(change('CommonSectionRulesConfigForm', 'PushAuthenticator', nextProps.ruleDetailsById.actionableElements.PushAuthenticator))
                        }
                    }
                })
            }
        }
        if (this.props.mfaConfigDetails !== nextProps.mfaConfigDetails) {
            if (nextProps.mfaConfigDetails !== undefined) {
                this.setState({
                    mfaConfigDetails: nextProps.mfaConfigDetails.data,
                })
            }
        }
    }

    handleChange = (event, newValue) => {
        this.setState({
            value: newValue
        })
        // setValue(newValue);
    };

    handleClose = () => {
        this.setState({
            isEdit: false
        })
    }

    handleEditRuleClick = () => {
        this.setState({
            isEdit: true
        })
    }

    handleDeleteRuleClick = () => {
        this.setState({
          saving: true
        })
        this.props.PostDeleteRuleAction(this.props.ruleId, this.props.history)
    }

    onClearHandler = () => {
        this.props.dispatch(reset('CommonSectionRulesConfigForm'));
    }

    onFormSubmitHandler = (formData) => {
        let actionableElements = {}
        if (formData.GoogleAuthenticator !== '') {
            actionableElements['GoogleAuthenticator'] = formData.GoogleAuthenticator
        }
        if (formData.CymmetriAuthenticator !== '') {
            actionableElements['CymmetriAuthenticator'] = formData.CymmetriAuthenticator
        }
        if (formData.SMSAuthenticator !== '') {
            actionableElements['SMSAuthenticator'] = formData.SMSAuthenticator
        }
        if (formData.SecretQuestions !== '') {
            actionableElements['SecretQuestions'] = formData.SecretQuestions
        }
        if (formData.PushAuthenticator !== '') {
            actionableElements['PushAuthenticator'] = formData.PushAuthenticator
        }
        let postData = {
            "id": this.props.ruleId,
            "actionableElements": actionableElements
        }
        this.props.PostFactorsActionableElementsAction(postData);
    }

    render() {
        const { classes, handleSubmit, ruleId, loading } = this.props;
        const { isEdit, redirect, rulesDetailsById, mfaConfigDetails, value, showConfirmation, deleteName, saving } = this.state;

        return (
            <>
                {isEdit && <EditRuleModal open={isEdit} handleClose={() => this.handleClose()} />}
                {redirect && <Redirect to="/dash/admin/rules" />}
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
                                        >Back To Rule List</Button>
                                    </Linking >
                                </Grid>
                            </Grid>
                            <Box className={classes.ruleCard}>
                                <Grid container justify="center" alignItems="center">
                                    <Grid item xs={4}>
                                        <Typography className="ruleType">{rulesDetailsById.name !== null ? rulesDetailsById.name : ''}</Typography>
                                        <Typography className="ruleDesc">{rulesDetailsById.description !== null ? rulesDetailsById.description : ''}</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography className="ruleName">Multi-factor Authentication</Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                    {
                                        rulesDetailsById.isAdaptive
                                        && 
                                        <Typography className="adaptiveScore">Score: {rulesDetailsById.adaptiveScore}</Typography>                                                  
                                    }
                                    </Grid>
                                    <Grid item xs={1}>
                                        {
                                            rulesDetailsById.active
                                                ?
                                                <ActiveStatusChip>Active</ActiveStatusChip>
                                                :
                                                <InactiveStatusChip>Inactive</InactiveStatusChip>
                                        }
                                    </Grid>
                                    <Grid item xs={2} container direction="row" justify="flex-end" alignItems="center">
                                        <IconButton color="primary" aria-label="Edit Rule" component="span" onClick={() => this.handleEditRuleClick()}>
                                            { isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : <Avatar src={require('../../../../../assets/Edit.png')} className="editDeleteIcon" />}
                                        </IconButton>
                                        {
                                        isActiveForRoles(['ORG_ADMIN']) &&
                                        <IconButton
                                            color="primary"
                                            aria-label="Delete Rule"
                                            component="span"
                                            // disabled={rulesDetailsById.active === true ? true : false}
                                            disabled={!isActiveForRoles(['ORG_ADMIN']) || rulesDetailsById.active}
                                            // onClick={() => this.handleDeleteRuleClick()} 
                                            onClick={() => this.setState({
                                              showConfirmation: true
                                            })} 
                                        >
                                            <Avatar src={require('../../../../../assets/Delete.png')} className="editDeleteIcon" />
                                        </IconButton> }
                                        {showConfirmation && (
                                          <DeleteModal
                                            open={showConfirmation}
                                            name={deleteName}
                                            saving={saving}
                                            onClose={() => this.setState({
                                              showConfirmation: false
                                            })}
                                            onDelete={() => this.handleDeleteRuleClick()}
                                          />
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>
                            <CardViewWrapper>
                                <CardViewWrapperTitle>
                                    Available Factors
                            </CardViewWrapperTitle>
                                <form onSubmit={handleSubmit(val => this.onFormSubmitHandler(val))}>
                                    <Grid container spacing={2}>
                                        {mfaConfigDetails !== null && mfaConfigDetails.googleAuthenticatorConfig.enabled &&
                                            <Grid item xs={6}>
                                                <Card elevation={0}>
                                                    <CardContent>
                                                        <Grid container spacing={2} justify="center" alignItems="center">
                                                            <Grid item xs={7}>
                                                                <Typography className={classes.availableFactorCard}><Avatar className={classes.mfaLogos} src={require('../../../../../assets/google-authenticator-2.svg')} /> Google Authenticator</Typography>
                                                            </Grid>
                                                            <Grid item xs={5}>
                                                                <Field
                                                                    id="GoogleAuthenticator"
                                                                    name="GoogleAuthenticator"
                                                                    required={true}
                                                                    disabled={!isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN'])}
                                                                    component={renderSelectField}
                                                                >
                                                                    <MenuItem value="Required">Required</MenuItem>
                                                                    <MenuItem value="Disabled">Disabled</MenuItem>
                                                                    <MenuItem value="Optional">Optional</MenuItem>
                                                                </Field>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        }
                                        {mfaConfigDetails !== null && mfaConfigDetails.totpPolicyConfig.enabled &&
                                            <Grid item xs={6}>
                                                <Card elevation={0}>
                                                    <CardContent>
                                                        <Grid container spacing={2} justify="center" alignItems="center">
                                                            <Grid item xs={7}>
                                                                <Typography className={classes.availableFactorCard}><Avatar className={classes.mfaLogos} src={require('../../../../../assets/cymmetri-logo.png')} />Cymmetri Authenticator</Typography>
                                                            </Grid>
                                                            <Grid item xs={5}>
                                                                <Field
                                                                    id="CymmetriAuthenticator"
                                                                    name="CymmetriAuthenticator"
                                                                    required={true}
                                                                    disabled={!isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN'])}
                                                                    component={renderSelectField}
                                                                >
                                                                    <MenuItem value="Required">Required</MenuItem>
                                                                    <MenuItem value="Disabled">Disabled</MenuItem>
                                                                    <MenuItem value="Optional">Optional</MenuItem>
                                                                </Field>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>}
                                        {mfaConfigDetails !== null && mfaConfigDetails.smsAuthenticationConfig.enabled &&
                                            <Grid item xs={6}>
                                                <Card elevation={0}>
                                                    <CardContent>
                                                        <Grid container spacing={2} justify="center" alignItems="center">
                                                            <Grid item xs={7}>
                                                                <Typography className={classes.availableFactorCard}><Avatar className={classes.mfaLogos} src={require('../../../../../assets/sms.svg')} /> SMS Authenticator</Typography>
                                                            </Grid>
                                                            <Grid item xs={5}>
                                                                <Field
                                                                    id="SMSAuthenticator"
                                                                    name="SMSAuthenticator"
                                                                    required={true}
                                                                    disabled={!isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN'])}
                                                                    component={renderSelectField}
                                                                >
                                                                    <MenuItem value="Required">Required</MenuItem>
                                                                    <MenuItem value="Disabled">Disabled</MenuItem>
                                                                    <MenuItem value="Optional">Optional</MenuItem>
                                                                </Field>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        }
                                        {mfaConfigDetails !== null && mfaConfigDetails.securityQuestionsConfig.enabled &&
                                            <Grid item xs={6}>
                                                <Card elevation={0}>
                                                    <CardContent>
                                                        <Grid container spacing={2} justify="center" alignItems="center">
                                                            <Grid item xs={7}>
                                                                <Typography className={classes.availableFactorCard}><Avatar className={classes.mfaLogos} src={require('../../../../../assets/faq.svg')} /> Secret Questions</Typography>
                                                            </Grid>
                                                            <Grid item xs={5}>
                                                                <Field
                                                                    id="SecretQuestions"
                                                                    name="SecretQuestions"
                                                                    required={true}
                                                                    disabled={!isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN'])}
                                                                    component={renderSelectField}
                                                                >
                                                                    <MenuItem value="Required">Required</MenuItem>
                                                                    <MenuItem value="Disabled">Disabled</MenuItem>
                                                                    <MenuItem value="Optional">Optional</MenuItem>
                                                                </Field>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>}
                                            {mfaConfigDetails !== null && mfaConfigDetails.pushAuthenticationConfig.enabled &&
                                            <Grid item xs={6}>
                                                <Card elevation={0}>
                                                    <CardContent>
                                                        <Grid container spacing={2} justify="center" alignItems="center">
                                                            <Grid item xs={7}>
                                                                <Typography className={classes.availableFactorCard}><Avatar className={classes.mfaLogos} src={require('../../../../../assets/cymmetri-logo.png')} />Push Authenticator</Typography>
                                                            </Grid>
                                                            <Grid item xs={5}>
                                                                <Field
                                                                    id="PushAuthenticator"
                                                                    name="PushAuthenticator" 
                                                                    required={true}
                                                                    disabled={!isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN'])}
                                                                    component={renderSelectField}
                                                                >
                                                                    <MenuItem value="Required">Required</MenuItem>
                                                                    <MenuItem value="Disabled">Disabled</MenuItem>
                                                                    <MenuItem value="Optional">Optional</MenuItem>
                                                                </Field>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>}
                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Box mt={2}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                                        <GreyBtn onClick={() => this.onClearHandler()}>Discard</GreyBtn>
                                                    </Grid>
                                                    <Grid item xs={6} sm={6} md={6} lg={6} container direction="row" justify="flex-end">
                                                        <Button variant="contained" color="primary" type="submit" size="small" disableElevation disabled={!isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']) || loading}>
                                                            Save
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </form>
                            </CardViewWrapper>
                        </Grid>
                    </Grid>
                    {/* <CardViewWrapper>
                        <NestedSections ruleId={ruleId} isAdaptive={rulesDetailsById.isAdaptive ? true : false}/>
                    </CardViewWrapper> */}
                    <div className="px-3">
                        {/* <Switch>
                            <Route exact={true} path="/dash/admin/rules/:id/assignedto" component={AdminRuleConfigAssigned} />
                            <Route exact={true} path="/dash/admin/rules/:id/conditions" component={AdminRuleConfigConditions} />
                            <Route exact={true} path="/dash/admin/rules/:id/action" component={AdminRuleConfigActions} />
                            <Redirect to="/dash/admin/rules/:id/assignedto" />
                        </Switch> */}
                        <TabContext value={value} >
                            <div className={classes.wrapper}>
                                <TabList onChange={this.handleChange} textColor='primary' indicatorColor='primary' aria-label="simple tabs example">
                                  <Tab label="Conditions" value="1" hidden={rulesDetailsById.isAdaptive} />
                                  <Tab label="Assigned To" value="2"  />
                                  <Tab label="Action" value="3" />
                                  {/* {rulesDetailsById.isAdaptive === false ? <Tab label="Conditions" value="1" /> : <></>} */}
                                </TabList>
                            </div>
                            <div className={classes.wrapper1}>
                                {/* <TabPanel className={classes.tabs} value="0"><AdminRuleConfigAssigned /></TabPanel> */}
                                <TabPanel className={classes.tabs} value="1" hidden={rulesDetailsById.isAdaptive}><AdminRuleConfigConditions /></TabPanel>
                                <TabPanel className={classes.tabs} value="2"><AssignedTo ruleData={rulesDetailsById} ruleId={ruleId} /></TabPanel>
                                <TabPanel className={classes.tabs} value="3"><AdminRuleConfigActions /></TabPanel>
                            </div>
                        </TabContext>
                    </div>
                </ScrollWrapper>
            </>
        )
    }
}

CommonSectionRulesConfig = reduxForm({
    form: "CommonSectionRulesConfigForm",
    // validate,
    enableReinitialize: true
})(CommonSectionRulesConfig);

function mapStateToProps(state) {

    return {
        loading: state.adminRuleReducer.loading,
        ruleId: state.adminRuleReducer.ruleId,
        ruleDetailsById: state.adminRuleReducer.ruleDetailsById !== null && state.adminRuleReducer.ruleDetailsById.data,
        deleteRule: state.adminRuleReducer.deleteRule !== null && state.adminRuleReducer.deleteRule,
        mfaConfigDetails: state.administrationmfaReducer.mfaConfigDetails !== null && state.administrationmfaReducer.mfaConfigDetails
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({
            GetRulesDetailsByIdAction,
            GetMfaConfigAction,
            PostDeleteRuleAction,
            PostFactorsActionableElementsAction,
            ClearRuleDetailsByID
        }, dispatch)
    };
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(withStyles(styles)(CommonSectionRulesConfig)));


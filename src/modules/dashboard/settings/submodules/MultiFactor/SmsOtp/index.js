import React, { Component } from 'react'
import { Field, reduxForm, reset, formValueSelector } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { CardHeader } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Box from '@material-ui/core/Box';
import MenuItem from "@material-ui/core/MenuItem";
import AceEditor from "react-ace";
import 'ace-builds/webpack-resolver'

import ScrollWrapper from "../../../../../../components/HOC/ScrollWrapper";
import CardViewWrapper from "../../../../../../components/HOC/CardViewWrapper"
import Edit from "../../../../../../FrontendDesigns/new/assets/img/icons/edit.svg"
import CardViewWrapperTitle from "../../../../../../components/HOC/CardViewWrapperTitle"
import Button from '@material-ui/core/Button';
import CustomInputLabel from '../../../../../../components/HOC/CustomInputLabel';
import GreyBtn from '../../../../../../components/HOC/GreyBtn';
import { renderTextField, renderSelectField, renderCheckBox } from '../../../../../../shared/reduxFields';
import { GetSmsAuthConfigAction } from '../../../actions/settingActions';
import { PostAddUpdateSMSAuthConfigAction, GetMfaConfigAction } from '../../../../administartion/submodules/MultiFactorAuth/actions/administrationmfaActions';
import validate from './validateSmsOtp';
import { isActiveForRoles } from '../../../../../../utils/auth';


const styles = theme => ({
    helpText: {
        background: "#f1e09a",
        padding: "16px",
        borderRadius: "4px",
        marginTop: "94px",
        '& div': {
            display: 'flex',
            alignItems: 'center',
            marginBottom: "8px",
            '& svg': {
                marginRight: '4px',
            }
        }
    },
    cardView: {
        padding: "10px",
        backgroundColor: '#eef1f8',
        borderRadius: "8px",
        boxShadow: "none",
        '& .MuiCardActions-root': {
            display: "flex",
            padding: "0px 16px 8px 16px",
            height: 18,
        }
    },
    headerTitle: {
        paddingBottom: "0px",
        '& .MuiCardHeader-content': {
            '& span': {
              fontSize: 16,
              lineHeight: "0px",
              marginTop: "-4px",
              color: "#1F4287",
              fontWeight: "600"
            }
        }
    },
    cardContent:{
        height: 'auto',
        // overflow: "scroll",
    }
});

class SmsOtp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mfaConfigDetails: {}
        }
    }


    componentDidMount = () => {
        this.props.GetMfaConfigAction();
        this.props.GetSmsAuthConfigAction();
    }

    UNSAFE_componentWillReceiveProps = (nextProps) => {
        if (this.props.mfaConfigDetails !== nextProps.mfaConfigDetails) {
            if (nextProps.mfaConfigDetails !== undefined) {
                this.setState({
                    mfaConfigDetails: nextProps.mfaConfigDetails.data,
                })
            }
        }
    }


    onFormSubmitHandler = (formData, smsOtpTemplate) => {
        let postData = {
            "enabled": this.state.mfaConfigDetails.smsAuthenticationConfig.enabled,
            "noOfDigits": formData.noOfDigits,
            "otpResendTime": formData.otpResendTime,
            "otpExpiryTime": formData.otpExpiry,
            "isEmailEnabled": formData.isEmailEnabled,
            "isSmsEnabled": formData.isSmsEnabled,
            "smsOtpTemplate": smsOtpTemplate
        }
        this.props.PostAddUpdateSMSAuthConfigAction(postData, "SMS");
    }

    onDiscardClickHandler = () => {
        this.props.dispatch(reset('SmsOtpForm'));
    }

    render() {
        const { classes, handleSubmit, formValues, loading } = this.props;
        let smsOtpTemplate = formValues ? formValues.smsOtpTemplate : null

        return (
            <>
                <ScrollWrapper>
                    <Grid container>
                        <Grid item xs={12} sm={9} md={9} lg={8}>
                            <CardViewWrapper>
                                <CardViewWrapperTitle>
                                    OTP
                                </CardViewWrapperTitle>
                                <form onSubmit={handleSubmit(val => this.onFormSubmitHandler(val, smsOtpTemplate))}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Card elevation={0}>
                                                <CardContent>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={4} md={4} lg={4}>
                                                            <CustomInputLabel>Number of Digits</CustomInputLabel>
                                                            <Field
                                                                id="noOfDigits"
                                                                name="noOfDigits"
                                                                required={true}
                                                                inputProps={{
                                                                    maxLength: 100
                                                                }}
                                                                component={renderSelectField}
                                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                            >
                                                                <MenuItem value="4">4</MenuItem>
                                                                <MenuItem value="5">5</MenuItem>
                                                                <MenuItem value="6">6</MenuItem>
                                                            </Field>
                                                        </Grid>
                                                        <Grid item xs={12} sm={4} md={4} lg={4}>
                                                            <CustomInputLabel>OTP Expiry (Minutes)</CustomInputLabel>
                                                            <Field
                                                                id="otpExpiry"
                                                                name="otpExpiry"
                                                                required={true}
                                                                inputProps={{
                                                                    maxLength: 2,
                                                                    minLength: 1
                                                                }}
                                                                component={renderTextField}
                                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} sm={4} md={4} lg={4}>
                                                            <CustomInputLabel>OTP Resent Time</CustomInputLabel>
                                                            <Field
                                                                id="otpResendTime"
                                                                name="otpResendTime"
                                                                required={true}
                                                                component={renderSelectField}
                                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                            >
                                                                <MenuItem value="1">1</MenuItem>
                                                                <MenuItem value="2">2</MenuItem>
                                                                <MenuItem value="3">3</MenuItem>
                                                            </Field>
                                                        </Grid>
                                                        {/* <Grid item xs={12} sm={12} md={12} lg={12}>
                                                            <CustomInputLabel>OTP Template</CustomInputLabel>
                                                            <Field
                                                                id="otpTemplate"
                                                                name="otpTemplate"
                                                                required={true}
                                                                multiline
                                                                rows={2}
                                                                inputProps={{
                                                                    maxLength: 100,
                                                                    minLength: 7
                                                                }}
                                                                component={renderTextField}
                                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                            />
                                                        </Grid> */}
                                                        <Grid item xs={12} sm={12} md={12} lg={12}>
                                                            <Field
                                                                id="isEmailEnabled"
                                                                name="isEmailEnabled"
                                                                label="Email Template"
                                                                color="primary"
                                                                component={renderCheckBox}
                                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                            />

                                                            {/* <CustomInputLabel>Email Template</CustomInputLabel> */}
                                                            {formValues && formValues.isEmailEnabled && 
                                                                <Card className={classes.cardView}>
                                                                    <CardHeader
                                                                      action={
                                                                          <span><img src={Edit} title="Edit Email Template" alt="edit" /></span>
                                                                      }
                                                                      title="Email Template"
                                                                      className={classes.headerTitle}
                                                                    />
                                                                    <CardContent>
                                                                        <Typography variant="body2" color="textSecondary" component="p" className={classes.cardContent}>
                                                                          {formValues && formValues.emailOtpTemplate}
                                                                        </Typography>
                                                                    </CardContent>
                                                                </Card>
                                                            }
                                                            {/* <Field
                                                                id="emailOtpTemplate"
                                                                name="emailOtpTemplate"
                                                                hidden={formValues && !formValues.isEmailEnabled}
                                                                // required={true}
                                                                multiline
                                                                rows={2}
                                                                inputProps={{
                                                                    maxLength: 100,
                                                                    minLength: 7
                                                                }}
                                                                component={renderTextField}
                                                                disabled={true}
                                                            /> */}
                                                        </Grid>
                                                        <Grid item xs={12} sm={12} md={12} lg={12}>
                                                            <Field
                                                                id="isSmsEnabled"
                                                                name="isSmsEnabled"
                                                                label="SMS Script"
                                                                color="primary"
                                                                component={renderCheckBox}
                                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                            />

                                                            {/* <CustomInputLabel>SMS Script</CustomInputLabel> */}
                                                            {formValues && formValues.isSmsEnabled && <AceEditor
                                                              mode={"java"}
                                                              theme="twilight"
                                                              onChange={(newValue) => {
                                                                smsOtpTemplate = newValue
                                                              }}
                                                              value={smsOtpTemplate}
                                                              height="250px"
                                                              width="100%"
                                                              fontSize={14}
                                                              wrapEnabled={true}
                                                              enableBasicAutocompletion
                                                              enableLiveAutocompletion
                                                              editorProps={{ $blockScrolling: true }}
                                                              setOptions={{
                                                                enableBasicAutocompletion: true,
                                                                enableLiveAutocompletion: true,
                                                                enableSnippets: true
                                                              }}
                                                            />}	                        
                                                            {/* <Field
                                                                id="smsOtpTemplate"
                                                                name="smsOtpTemplate"
                                                                // required={true}
                                                                hidden={formValues && !formValues.isSmsEnabled}
                                                                multiline
                                                                rows={2}
                                                                inputProps={{
                                                                    maxLength: 100,
                                                                    minLength: 7
                                                                }}
                                                                component={renderTextField}
                                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                            /> */}
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                    <Box mt={2}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                                <GreyBtn onClick={() => this.onDiscardClickHandler()} disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}>Discard</GreyBtn>
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={6} lg={6} container direction="row" justify="flex-end">
                                                <Button variant="contained" color="primary" size="small" disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || loading} disableElevation type="submit">
                                                    Save
                                            </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </form>
                            </CardViewWrapper>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={4}>
                            <Box className={classes.helpText}>
                                <div className={classes.iconTitle}><ErrorOutlineIcon />Configure SMS Policy </div>
                                <Typography variant="body2" gutterBottom>
                                Configure the SMS policy to set up this 2FA method for additional security of your Cymmetri IAM accounts.<br />
                                <b>Number of Digits:</b> The length of the generated OTPs, which can be 4-6 numbers. Default is 6.<br />
                                <b>OTP Expiry (Minutes):</b> This number determines how long a one-time password is active before it expires and a new OTP needs to be generated. Default is 10 minutes.<br />
                                <b>OTP Resend Time:</b> The number of OTP resend requests allowed by the server in the case of SMS lost in transmission. Default is 2. <br />
                                <b>OTP Template:</b> Create or customize the default template of SMS OTP. 
                        </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </ScrollWrapper>
            </>
        )
    }
}

SmsOtp = reduxForm({
    form: "SmsOtpForm",
    validate,
    enableReinitialize: true
})(SmsOtp);

function mapStateToProps(state) {
    let initialValueData = {};
    if (state.settingReducer.smsConfigDetails !== null && state.settingReducer.smsConfigDetails !== undefined) {
        let data = state.settingReducer.smsConfigDetails.data
        initialValueData = {
            noOfDigits: data && data.noOfDigits,
            otpExpiry: data && data.otpExpiryTime,
            // otpTemplate: data && data.smsOtpTemplate,
            otpResendTime: data && data.otpResendTime,
            isEmailEnabled: data && data.isEmailEnabled,
            isSmsEnabled: data && data.isSmsEnabled,
            emailOtpTemplate: data && data.emailOtpTemplate,
            smsOtpTemplate: data && data.smsOtpTemplate,
        }
    }

    const selector = formValueSelector('SmsOtpForm')
    const isEmailEnabledValue = selector(state, 'isEmailEnabled')
    const isSmsEnabledValue = selector(state, 'isSmsEnabled')
    const emailOtpTemplateValue = selector(state, 'emailOtpTemplate')
    const smsOtpTemplateValue = selector(state, 'smsOtpTemplate')

    return {
        loading: state.settingReducer.loading || state.administrationmfaReducer.loading,
        initialValues: initialValueData,
        mfaConfigDetails: state.administrationmfaReducer.mfaConfigDetails !== null && state.administrationmfaReducer.mfaConfigDetails,
        formValues: {
          isEmailEnabled: isEmailEnabledValue,
          isSmsEnabled: isSmsEnabledValue,
          emailOtpTemplate: emailOtpTemplateValue,
          smsOtpTemplate: smsOtpTemplateValue,
        }

    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({
            GetSmsAuthConfigAction,
            PostAddUpdateSMSAuthConfigAction,
            GetMfaConfigAction
        }, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(SmsOtp));



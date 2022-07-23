import React, { Component } from 'react';
import { Field, reduxForm, reset } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Box from '@material-ui/core/Box';
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

import CardViewWrapper from "../../../../../../components/HOC/CardViewWrapper"
import CardViewWrapperTitle from "../../../../../../components/HOC/CardViewWrapperTitle"
import CustomInputLabel from '../../../../../../components/HOC/CustomInputLabel';
import GreyBtn from '../../../../../../components/HOC/GreyBtn';
import ScrollWrapper from "../../../../../../components/HOC/ScrollWrapper";
import validate from './validateOtpPolicy';
import { renderSelectField } from '../../../../../../shared/reduxFields';
import { GetTotpConfigAction } from '../../../actions/settingActions';
import { PostAddUpdateTotpConfigAction, GetMfaConfigAction } from '../../../../administartion/submodules/MultiFactorAuth/actions/administrationmfaActions';
import { isActiveForRoles } from '../../../../../../utils/auth';

const styles = theme => ({
  supportedAppChip: {
    borderRadius: 4,
    marginRight: 16,
    marginTop: 8
  },
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
  questionIcon: {
    fontSize: 14,
    marginLeft: 8,
  }
});

class OtpPolicy extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mfaConfigDetails: {}
    }
  }

  componentDidMount = () => {
    this.props.GetMfaConfigAction();
    this.props.GetTotpConfigAction();
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

  onFormSubmitHandler = (formData) => {
    let postData = {
      "enabled": this.state.mfaConfigDetails.totpPolicyConfig.enabled,
      "otpTokenPeriod": formData.optTokenPeriod,
      "lookAheadWindow": formData.lookAheadWindow,
      "otpHashAlgorithm": formData.opthashAlgo,
      "numberOfDigits": formData.noOfDigits
    }
    this.props.PostAddUpdateTotpConfigAction(postData, "OTP");
  }

  onDiscardClickHandler = () => {
    this.props.dispatch(reset('OtpPolicyForm'));
  }

  render() {
    const { classes, handleSubmit, loading } = this.props;
    return (
      <>
        <ScrollWrapper>
          <Grid container>
            <Grid item xs={12} sm={9} md={9} lg={8}>
              <CardViewWrapper>
                <CardViewWrapperTitle>
                  TOTP Policy
                            </CardViewWrapperTitle>
                <form onSubmit={handleSubmit(val => this.onFormSubmitHandler(val))}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Card elevation={0}>
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                              <CustomInputLabel>OTP Type
                                                            <Tooltip title="Add" placement="top">
                                  <HelpOutlineIcon className={classes.questionIcon} />
                                </Tooltip>
                              </CustomInputLabel>
                              <Field
                                id="otpType"
                                name="otpType"
                                required={true}
                                component={renderSelectField}
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                              >
                                <MenuItem value="timebased">Time Based</MenuItem>
                              </Field>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                              <CustomInputLabel>OTP Hash Algorithm</CustomInputLabel>
                              <Field
                                id="opthashAlgo"
                                name="opthashAlgo"
                                required={true}
                                component={renderSelectField}
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                              >
                                <MenuItem value="HmacSHA1">HmacSHA1</MenuItem>
                              </Field>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                              <CustomInputLabel>Number of Digits</CustomInputLabel>
                              <Field
                                id="noOfDigits"
                                name="noOfDigits"
                                required={true}
                                component={renderSelectField}
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                              >
                                <MenuItem value="6">6</MenuItem>
                              </Field>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                              <CustomInputLabel>OTP Token Period</CustomInputLabel>
                              <Field
                                id="optTokenPeriod"
                                name="optTokenPeriod"
                                required={true}
                                component={renderSelectField}
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                              >
                                <MenuItem value="30">30</MenuItem>
                              </Field>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} lg={6}>
                              <CustomInputLabel>Look Ahead Window</CustomInputLabel>
                              <Field
                                id="lookAheadWindow"
                                name="lookAheadWindow"
                                required={true}
                                component={renderSelectField}
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                              >
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                                <MenuItem value="4">4</MenuItem>
                                <MenuItem value="5">5</MenuItem>
                              </Field>
                            </Grid>
                            <Grid item xs={12}>
                              <CustomInputLabel>Supported Application</CustomInputLabel>
                              <Chip
                                avatar={<Avatar src={require('../../../../../../assets/cymmetri-logo.png')} />}
                                label="Cymmetri Authenticator"
                                clickable
                                variant="outlined"
                                className={classes.supportedAppChip}
                              />
                              <Chip
                                // icon={<GoogleLogo />}
                                avatar={<Avatar src={require('../../../../../../assets/googleLogo.png')} />}
                                // avatar={<GoogleLogo/>}
                                label="Google Authenticator"
                                clickable
                                variant="outlined"
                                className={classes.supportedAppChip}
                              />
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
                        <Button variant="contained" disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || loading} color="primary" size="small" disableElevation type="submit">
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
                <div className={classes.iconTitle}><ErrorOutlineIcon />Configure TOTP Policy </div>
                <Typography variant="body2" gutterBottom>
                Configure the Time-Based One-Time Password (TOTP) policy to set up this 2FA method for additional security of your Cymmetri IAM accounts.<br /> 
                <b>OTP Type:</b> Enable the relevant authentication method.<br />
                <b>OTP Hash Algorithm:</b> Select the appropriate cryptographic algorithm to generate the OTP. Default option is HmacSHA1.<br />
                <b>Number of Digits:</b> The length of the generated OTPs, which can be 6 - 9 numbers. The default is 6.<br />
                <b>OTP Token Period:</b> This number determines how long a one-time password is active before the next one-time password generates. The default is 30 seconds.<br />
                <b>Look Ahead Window:</b> The Look Ahead Window considers any possible synchronization delay between the server and the client that generates the one-time password. Default value is 2. <br />
                <b>Supported Applications:</b> Two-Factor Authentication apps that can be used by users to secure their Cymmetri IAM accounts. 
                        </Typography>
              </Box>
            </Grid>
          </Grid>
        </ScrollWrapper>
      </>
    )
  }
}

OtpPolicy = reduxForm({
  form: "OtpPolicyForm",
  validate,
  enableReinitialize: true
})(OtpPolicy);

function mapStateToProps(state) {
  let initialValueData = {};
  if (state.settingReducer.totpConfigDetails !== null && state.settingReducer.totpConfigDetails !== undefined) {
    let data = state.settingReducer.totpConfigDetails.data
    initialValueData = {
      otpType: 'timebased',
      opthashAlgo: data.otpHashAlgorithm,
      noOfDigits: data.numberOfDigits,
      optTokenPeriod: data.otpTokenPeriod,
      lookAheadWindow: data.lookAheadWindow,
    }
  }
  return {
    loading: state.settingReducer.loading || state.administrationmfaReducer.loading,
    initialValues: initialValueData,
    mfaConfigDetails: state.administrationmfaReducer.mfaConfigDetails !== null && state.administrationmfaReducer.mfaConfigDetails
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({
      GetTotpConfigAction,
      PostAddUpdateTotpConfigAction,
      GetMfaConfigAction
    }, dispatch)
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(OtpPolicy));

import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link as Linking } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import CardViewWrapper from "../../../../../components/HOC/CardViewWrapper";
import CardViewWrapperTitle from "../../../../../components/HOC/CardViewWrapperTitle";
import ScrollWrapper from "../../../../../components/HOC/ScrollWrapper";
import { 
  GetMfaConfigAction,
  PostAddUpdateTotpConfigAction,
  PostAddUpdateSecQuesConfigAction,
  PostAddUpdateGoogleAuthConfigAction,
  PostAddUpdateSMSAuthConfigAction,
  PostAddUpdatePushAuthConfigAction
} from './actions/administrationmfaActions';
import { isActiveForRoles } from '../../../../../utils/auth';
import EditWarningModal from '../../../../../components/EditWarningModal';

const styles = theme => ({
  cardView: {
    padding: "8px",
    borderRadius: "8px",
    boxShadow: "none",
    '& .MuiCardActions-root': {
      display: "flex",
      padding: "0px 16px 8px 16px",
      height: 18,
    }
  },
  authTitle: {
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
  mfauthCardContent:{
    height: 100,
    overflow: "scroll",
  }
});


class AdminMFA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleCA: false,
      toggleSQ: false,
      toggleGA: false,
      toggleSA: false,
      checkedCA: false,
      mfaConfigDetails: {},
      showConfirmation: false,
      toggleVal: null
    }
  }

  componentDidMount = () => {
    this.props.GetMfaConfigAction();
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if(this.props.mfaConfigDetails !== nextProps.mfaConfigDetails) {
        if(nextProps.mfaConfigDetails !== undefined) {
          this.setState({
            mfaConfigDetails: nextProps.mfaConfigDetails.data,
            toggleCA: nextProps.mfaConfigDetails.data.totpPolicyConfig.enabled,
            toggleSQ: nextProps.mfaConfigDetails.data.securityQuestionsConfig.enabled,
            toggleGA: nextProps.mfaConfigDetails.data.googleAuthenticatorConfig.enabled,
            toggleSA: nextProps.mfaConfigDetails.data.smsAuthenticationConfig.enabled,
            checkedCA: nextProps.mfaConfigDetails.data.pushAuthenticationConfig.enabled
          })
        }
    }
  }

  configPreferenceHandler = (type, data) => {
    let postData = {}
    if(type === "CA") {
      postData = {
        "enabled": this.state.toggleCA,
        "otpTokenPeriod": data.otpTokenPeriod,
        "lookAheadWindow": data.lookAheadWindow,
        "otpHashAlgorithm": data.otpHashAlgorithm,
        "numberOfDigits": data.numberOfDigits
      }
      this.props.PostAddUpdateTotpConfigAction(postData, 'CA');
    } else if( type === "SQ") {
      postData = {
        "enabled": this.state.toggleSQ,
        "minimumCorrectAnswers": data.minimumCorrectAnswers,
        "noOfQuestionToConfigure": data.noOfQuestionToConfigure,
        "minAnswerLength": data.minAnswerLength,
      }
      this.props.PostAddUpdateSecQuesConfigAction(postData, "CA");
    } else if( type === "GA") {
      postData = {
        "enabled": this.state.toggleGA
      }
      this.props.PostAddUpdateGoogleAuthConfigAction(postData)
    } else if( type === "SA") {
      postData = {
        "emailOtpTemplate": data.emailOtpTemplate,
        "enabled": this.state.toggleSA,
        "isEmailEnabled": data.isEmailEnabled,
        "isSmsEnabled": data.isSmsEnabled,
        "noOfDigits": data.noOfDigits,
        "otpExpiryTime": data.otpExpiryTime,
        "otpResendTime": data.otpResendTime,
        "smsOtpTemplate": data.smsOtpTemplate
      }
      this.props.PostAddUpdateSMSAuthConfigAction(postData, "SA")
    }
  }

  toggleChecked = (type) => {
    const mfaConfigDetails =  this.state.mfaConfigDetails
    if(type === "CA") {
      this.setState({
        toggleCA: !this.state.toggleCA
      }, () => {
        this.configPreferenceHandler("CA", mfaConfigDetails.totpPolicyConfig);
      })
    } else if(type === "SQ") {
      this.setState({
        toggleSQ: !this.state.toggleSQ
      }, () => {
        this.configPreferenceHandler("SQ", mfaConfigDetails.securityQuestionsConfig);
      })
    } else if(type === "GA") {
      this.setState({
        toggleGA: !this.state.toggleGA
      }, () => {
        this.configPreferenceHandler("GA", mfaConfigDetails.googleAuthenticatorConfig);
      })
    }  else if(type === "SA") {
      this.setState({
        toggleSA: !this.state.toggleSA
      }, () => {
        this.configPreferenceHandler("SA", mfaConfigDetails.smsAuthenticationConfig);
      })
    }
  }

  handlePushChange = () => {
      this.setState({
        checkedCA: !this.state.checkedCA
      }, () => {
        let postData = {
          "enabled": this.state.checkedCA
        }
        this.props.PostAddUpdatePushAuthConfigAction(postData)
      })
  }

  manageQuesClickHandler = () => {
    this.props.history.push('/dash/settings/mfa/secretquestion')
  }

  render() {
    
    const { classes } = this.props;
    const { toggleCA, toggleSQ, toggleGA, toggleSA, checkedCA, showConfirmation, toggleVal } = this.state;
    return (
      <>
      <ScrollWrapper>
        <Grid container>
          <Grid item xs={12}>
            <CardViewWrapper>
              <CardViewWrapperTitle>
                Multi-factor Authentication
              </CardViewWrapperTitle>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <Card className={classes.cardView}>
                    <CardHeader
                      action={
                        <FormControlLabel
                          control={
                            <Switch
                              name="toggleCA"
                              color="primary"
                              checked={toggleCA}
                              disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                              // onChange={() => this.toggleChecked("CA")}
                              onChange={() => {
                                this.setState({
                                  showConfirmation: true,
                                  toggleVal: 'CA'
                                })
                              }}
                            />
                          }
                        />
                      }
                      title="Cymmetri Authenticator"
                      className={classes.authTitle}
                    />
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" component="p" className={classes.mfauthCardContent}>
                        Allow users to verify their identities with 2-Factor Authentication (2FA) with Cymmetri Authenticator app. It is a mobile security app available on iOS and Android platforms that generates an alphanumeric secret key after setting up an account by scanning the QR code displayed on the Cymmetri IAM Cloud website.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="checkedCA"
                            color="primary"
                            checked={checkedCA}
                            disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                            // onChange={() => this.handlePushChange()}
                            onChange={() => {
                              this.setState({
                                showConfirmation: true,
                                toggleVal: null
                              })
                            }}
                          />
                        }
                        label="Enable Push Notification"
                      />
                    </CardActions>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <Card className={classes.cardView}>
                    <CardHeader
                      action={
                        <FormControlLabel
                          control={
                            <Switch
                              name="toggleSQ"
                              color="primary"
                              checked={toggleSQ}
                              disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                              // onChange={() => this.toggleChecked("SQ")}
                              onChange={() => {
                                this.setState({
                                  showConfirmation: true,
                                  toggleVal: 'SQ'
                                })
                              }}
                            />
                          }
                        />
                      }
                      title="Secret Questions"
                      className={classes.authTitle}
                    />
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" component="p" className={classes.mfauthCardContent}>
                      Deploy an added layer of security with Secret Questions as an alternative option for users to verify their identities while accessing their Cymmetri IAM accounts. These are specific question/answer combinations that only the user who sets up these while logging in for the first time, knows.
                      </Typography>
                    </CardContent>
                    <CardActions>
                        <Linking to="/dash/settings/mfa/secretquestion">
                          <Button color="primary" OnClick={() => this.manageQuesClickHandler()}>
                            Manage Question
                          </Button>
                        </Linking>
                    </CardActions>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <Card className={classes.cardView} raised="false">
                    <CardHeader
                      action={
                        <FormControlLabel
                          control={
                            <Switch
                              name="toggleGA"
                              color="primary"
                              checked={toggleGA}
                              disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                              // onChange={() => this.toggleChecked("GA")}
                              onChange={() => {
                                this.setState({
                                  showConfirmation: true,
                                  toggleVal: 'GA'
                                })
                              }}
                            />
                          }
                        />
                      }
                      title="Google Authenticator"
                      className={classes.authTitle}
                    />
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" component="p" className={classes.mfauthCardContent}>
                      Enable users to securely login to their Cymmetri IAM accounts by using Google Authenticator app available on iOS or Android platforms. Google Authenticator is a software-based authenticator that generates 2-Step verification codes using Time-based One-Time Password and HMAC-based One-Time Password algorithms.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <Card className={classes.cardView}>
                    <CardHeader
                      action={
                        <FormControlLabel
                          control={
                            <Switch
                              name="toggleSA"
                              color="primary"
                              checked={toggleSA}
                              disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                              // onChange={() => this.toggleChecked("SA")}
                              onChange={() => {
                                this.setState({
                                  showConfirmation: true,
                                  toggleVal: 'SA'
                                })
                              }}
                            />
                          }
                        />
                      }
                      title="SMS Authenticator"
                      className={classes.authTitle}
                    />
                    <CardContent>
                      <Typography variant="body2" color="textSecondary" component="p" className={classes.mfauthCardContent}>
                      Set up SMS authentication as an identity proof for 2FA verifications for users to authenticate their access into their Cymmetri IAM accounts. Trusted mobile phone numbers receive temporary passcodes (Time-based One-Time Password or TOTP) generated by algorithm by text or SMS messages in passcode that can be used by users to verify their identities.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardViewWrapper>
          </Grid>
        </Grid>

        <EditWarningModal 
          open={showConfirmation} 
          title={`Confirm activation / deactivation.`}
          des={`This may impact users using the system.`} 
          close={() => {
            this.setState({
              showConfirmation: false
            })
          }} 
          confirm={() => {
            if(toggleVal !== null) {
              this.toggleChecked(toggleVal)
            } else {
              this.handlePushChange()
            }
            this.setState({
              showConfirmation: false
            })
          }}
        />
      </ScrollWrapper>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.administrationmfaReducer.loading,
    mfaConfigDetails: state.administrationmfaReducer.mfaConfigDetails !== null && state.administrationmfaReducer.mfaConfigDetails
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ 
      GetMfaConfigAction,
      PostAddUpdateTotpConfigAction,
      PostAddUpdateSecQuesConfigAction,
      PostAddUpdateGoogleAuthConfigAction,
      PostAddUpdateSMSAuthConfigAction,
      PostAddUpdatePushAuthConfigAction
    }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AdminMFA));
import React, { Component } from 'react';
import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';

import CardViewWrapper from "../../../../../components/HOC/CardViewWrapper"
import CustomInputLabel from '../../../../../components/HOC/CustomInputLabel';
import GreyBtn from '../../../../../components/HOC/GreyBtn';
import { PostRuleActionAction } from './actions/administrationRuleActions';
import { isActiveForRoles } from '../../../../../utils/auth';

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
});


class AdminRuleConfigActions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.ruleDetailsById.actionGroupId === "MFA" ? "Login_With_2FA_With_System" : props.ruleDetailsById.actionToBeExecute,
            errorMessage: ''
        }
    }

    UNSAFE_componentWillReceiveProps = (nextProps) => {
        if (this.props.ruleDetailsById !== nextProps.ruleDetailsById) {
            if (nextProps.ruleDetailsById !== null && nextProps.ruleDetailsById.actionToBeExecute !== null && nextProps.ruleDetailsById.actionToBeExecute !== '') {
                this.setState({
                    value: nextProps.ruleDetailsById.actionToBeExecute
                })
            }
        }
    }

    handleRadioActionChange = (event) => {
        this.setState({
            value: event.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const { value } = this.state;
        if (value === '') {
            this.setState({
                errorMessage: 'Please select action'
            })
        } else {
            let postData = {
                "id": this.props.ruleId,
                "actionToExecute": value
            }
            this.props.PostRuleActionAction(postData, this.props.ruleId);
        }
    }

    render() {
        const { classes, loading } = this.props;
        const { value, errorMessage } = this.state;
        return (
            <>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <Card elevation={0}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <CustomInputLabel>
                                        Who Does this rule apply to
                                        </CustomInputLabel>
                                    <RadioGroup aria-label="quiz" name="quiz" value={value} onChange={(e) => this.handleRadioActionChange(e)}>
                                        <FormControlLabel color="primary" value="Login_With_2FA_With_System" control={<Radio />} label="Login to Cymmetri" disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])} className={classes.ruleApplyRadio} />
                                        {/* <FormControlLabel value="Login_With_2FA_With_App" control={<Radio />} label="Login With 2FA With App" className={classes.ruleApplyRadio} /> */}
                                        {/* <FormControlLabel value="Login_With_Single_Sign_On" control={<Radio />} label="Login With Single Sign On" className={classes.ruleApplyRadio} /> */}
                                    </RadioGroup>
                                    <FormHelperText error={true}>{errorMessage}</FormHelperText>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Box mt={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <GreyBtn>Discard</GreyBtn>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} container direction="row" justify="flex-end">
                                <Button variant="contained" color="primary" type="submit" size="small" disableElevation disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || loading}>
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            </>
        )
    }
}

AdminRuleConfigActions = reduxForm({
    form: "AdminRuleConfigActionsForm",
    // validate,
    enableReinitialize: true
})(AdminRuleConfigActions);

function mapStateToProps(state) {
    return {
        loading: state.adminRuleReducer.loading,
        ruleId: state.adminRuleReducer.ruleId,
        ruleDetailsById: state.adminRuleReducer.ruleDetailsById !== null && state.adminRuleReducer.ruleDetailsById.data,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({
            PostRuleActionAction
        }, dispatch)
    };
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(AdminRuleConfigActions));


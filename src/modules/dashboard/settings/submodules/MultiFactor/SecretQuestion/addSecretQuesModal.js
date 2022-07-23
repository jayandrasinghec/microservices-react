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

import { renderTextField } from '../../../../../../shared/reduxFields';
import GreyBtn from '../../../../../../components/HOC/GreyBtn';
import CustomInputLabel from '../../../../../../components/HOC/CustomInputLabel';
import { PostCreateNewSecQuesAction, PostEditSecQuesAction } from '../../../actions/settingActions';
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
    rulesSearchAdd: {
        float: 'right',
    },
    questionItem: {
        padding: "8px 0px 8px 16px",
    },
    custDialog: {
        '& .MuiDialog-paper': {
            background: "#e6eaf6",
            width: "500px",
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
        marginBottom: "-16px",
        marginLeft: "0px",
    }
});

const validate = (values) => {
    const errors = {}

    if (!values.question) {
        errors.question = 'Question Required'
    }

    return errors;
}

class AddSecretQuestionModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: props.open,
            isActive: props.type === "add" ? false : props.isActive
        }
    }

    componentDidMount = () => {
        if(this.props.type === "edit") {
            this.props.dispatch(change('AddSecretQuestionModalForm', 'question', this.props.questionName))
        }
    }

    handleReset = () => {
        this.props.dispatch(reset('AddSecretQuestionModalForm'));
    }

    activeToggleHandler = () => {
        this.setState({
            isActive: !this.state.isActive
        })
    }

    onFormSubmitHandler = (formData) => {
        if(this.props.type === "add") {
            let postData = {
                "question": formData.question,
                "active": this.state.isActive
            }
            this.props.PostCreateNewSecQuesAction(postData);
            this.props.handleClose();
        } else if(this.props.type === "edit") {
            let postData = {
                "id": this.props.quesID,
                "question": formData.question,
                "active": this.state.isActive
            }
            this.props.PostEditSecQuesAction(postData);
            this.props.handleClose();
        }
    }

    render() {
        const { classes, handleSubmit, type } = this.props;
        const { isActive } = this.state;
        return (
            <div className={classes.custDialog}>
                <Dialog open={this.state.open} onClose={() => this.props.handleClose()} aria-labelledby="form-dialog-title" className={classes.custDialog}>
                    <DialogTitle id="form-dialog-title">{`${type === "add" ? 'ADD NEW' : 'EDIT'} SECRET QUESTION`}
                            <IconButton aria-label="close" className={classes.closeButton}>
                            <CloseIcon onClick={() => this.props.handleClose()} />
                        </IconButton>
                    </DialogTitle>
                    <form onSubmit={handleSubmit(val => this.onFormSubmitHandler(val))}>
                        <DialogContent>
                            <Card elevation={0}>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} >
                                            <CustomInputLabel>Question</CustomInputLabel>
                                            <Field
                                                id="question"
                                                name="question"
                                                required={true}
                                                multiline
                                                rows="2"
                                                inputProps={{
                                                    maxLength: 100
                                                }}
                                                component={renderTextField}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                className={classes.statusSwitch}
                                                label="Status"
                                                labelPlacement="start"
                                                control={
                                                    <Switch
                                                        name="checkedA"
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
                                    <GreyBtn onClick={() => this.handleReset()} disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}>Reset</GreyBtn>
                                </Grid>
                                <Grid item xs={6} sm={6} md={6} lg={6} container direction="row" justify="flex-end">
                                    <Button variant="contained" color="primary" disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])} type="submit" size="small" disableElevation>
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

AddSecretQuestionModal = reduxForm({
    form: "AddSecretQuestionModalForm",
    validate,
    enableReinitialize: true
})(AddSecretQuestionModal);

function mapStateToProps(state) {
    return {
        loading: state.settingReducer.loading,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({
            PostCreateNewSecQuesAction,
            PostEditSecQuesAction
        }, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(AddSecretQuestionModal));


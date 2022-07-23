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
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Box from '@material-ui/core/Box';
import AddIcon from '@material-ui/icons/Add';
import MenuItem from "@material-ui/core/MenuItem";
import MaterialTable from 'material-table';
import Avatar from '@material-ui/core/Avatar';
import VisibilityIcon from '@material-ui/icons/Visibility'

import { renderSelectField, renderTextField } from '../../../../../../shared/reduxFields';
import ScrollWrapper from "../../../../../../components/HOC/ScrollWrapper";
import CardViewWrapper from "../../../../../../components/HOC/CardViewWrapper";
import CardViewWrapperTitle from "../../../../../../components/HOC/CardViewWrapperTitle";
import CustomInputLabel from '../../../../../../components/HOC/CustomInputLabel';
import GreyBtn from '../../../../../../components/HOC/GreyBtn';
import { GetSecQuesConfigAction, GetAllSecQuesAction, PostDeleteSecQuesAction } from '../../../actions/settingActions';
import { GetMfaConfigAction, PostAddUpdateSecQuesConfigAction } from '../../../../administartion/submodules/MultiFactorAuth/actions/administrationmfaActions';
import validate from './validateSecretQuestion';
import AddSecretQuestionModal from './addSecretQuesModal';
import ActiveStatusChip from '../../../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../../../components/HOC/InactiveStatusChip';
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
    },
    ruleTable: {
        paddingBottom: "0px !important",
        marginBottom: '-16px',
        '& .MuiToolbar-gutters': {
            padding: "0px !important",
            '& .MuiTextField-root': {
                border: "1px solid #ccc",
                borderRadius: "4px",
                paddingLeft: "8px",
                '& .MuiInput-underline:before': {
                    display: "none",
                },
                '& .MuiInput-underline:after': {
                    display: "none",
                }
            },

            '& .MuiIconButton-root:hover': {
                background: "transparent",
                '& .MuiTouchRipple-root': {
                    display: "none"
                }
            }
        },

        '& table': {
            borderCollapse: "separate",
            borderSpacing: "0 15px",
        },
        '& th ': {
            padding: "0px 16px !important",
        },
        '& td ': {
            borderBottom:0,
        },
        '& .MuiPaper-root': {
            boxShadow: "none",
            background: "transparent"
        },
        '& .MuiTablePagination-caption': {
            display: "unset !important",
            position: "absolute",
            color: "#a9b2c3",
        },
        '& .MuiTableCell-footer': {
            borderBottom: '0px',
            '& .MuiTablePagination-selectRoot': {
                background: "#282a73",
                borderRadius: "20px",
                color: "#fff",
                '& svg': {
                    color: "#fff"
                }
            },
            '& .MuiButton-contained.Mui-disabled': {
                background: "transparent",
            }
        },
    },
    tableAddIcon: {
        height: 32,
    },
    editDeleteIcon: {
        '& img': {
            width: "16px",
            height: "16px",
        }
    }
});

class SecretQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mfaConfigDetails: {},
            openAddQuesModal: false,
            columns: [
                { title: 'Question', field: 'question', cellStyle: { fontWeight: '700', borderBottom: 'none' } },
                {
                    title: 'Status',
                    field: 'active',
                    render: rowData => rowData.active === true ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip>,
                    cellStyle: { fontWeight: '700', border: 'none' } },
            ],
            data: [],
            type: '',
            quesID: '',
            isActive: false,
            questionName: ''
        }
    }


    componentDidMount () {
        this.props.GetMfaConfigAction();
        this.props.GetSecQuesConfigAction();
        this.props.GetAllSecQuesAction();
    }

    UNSAFE_componentWillReceiveProps = (nextProps) => {
        if (this.props.mfaConfigDetails !== nextProps.mfaConfigDetails) {
            if (nextProps.mfaConfigDetails !== undefined) {
                this.setState({
                    mfaConfigDetails: nextProps.mfaConfigDetails.data,
                })
            }
        }
        if (this.props.data !== nextProps.data) {
            this.setState({
                data: nextProps.data,
            })
        }
    }


    handleAddQuesModalOpen = () => {
        this.setState({
            type: 'add',
            openAddQuesModal: true,
        })
    }

    handleClose = () => {
        this.setState({
            openAddQuesModal: false,
            type: '',
            quesID: '',
            isActive: false,
            questionName: ''
        })
    }

    onFormSubmitHandler = (formData) => {
        let postData = {
            "enabled": this.state.mfaConfigDetails.securityQuestionsConfig.enabled,
            "minimumCorrectAnswers": formData.minimumQuestion,
            "noOfQuestionToConfigure": formData.requiredQuestion,
            "minAnswerLength": formData.minAnswerLength,
        }
        this.props.PostAddUpdateSecQuesConfigAction(postData, "SECQ");
    }

    onDiscardClickHandler = () => {
        this.props.dispatch(reset('SecretQuestionForm'));
    }

    handleClickOpenEdit = (event, rowData) => {
        this.setState({
            type: 'edit',
            openAddQuesModal: true,
            quesID: rowData.id,
            isActive: rowData.active,
            questionName: rowData.question
        })
    }

    handleClickDelete = (event, rowData) => {
        this.props.PostDeleteSecQuesAction(rowData.id)
    }

    render() {
        const { classes, handleSubmit, loading } = this.props;
        const { data, columns, type, quesID, questionName, isActive } = this.state;

        return (
            <>
                <ScrollWrapper>
                    <Grid container>
                        <Grid item xs={12} sm={9} md={9} lg={8}>
                            <CardViewWrapper>
                                <CardViewWrapperTitle>
                                    Secret Questions
                            </CardViewWrapperTitle>
                                <form onSubmit={handleSubmit(val => this.onFormSubmitHandler(val))}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Card elevation={0}>
                                                <CardContent>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                                            <CustomInputLabel>Required Questions To Configure</CustomInputLabel>
                                                            <Field
                                                                id="requiredQuestion"
                                                                name="requiredQuestion"
                                                                required={true}
                                                                inputProps={{
                                                                    maxLength: 100
                                                                }}
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
                                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                                            <CustomInputLabel>Minimum Correct Questions</CustomInputLabel>
                                                            <Field
                                                                id="minimumQuestion"
                                                                name="minimumQuestion"
                                                                required={true}
                                                                inputProps={{
                                                                    maxLength: 100
                                                                }}
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
                                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                                            <CustomInputLabel>Minimum Answer Length</CustomInputLabel>
                                                            <Field
                                                                id="minAnswerLength"
                                                                name="minAnswerLength"
                                                                required={true}
                                                                type="number"
                                                                inputProps={{
                                                                  min: 0,
                                                                }}
                                                                component={renderTextField}
                                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
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
                                                <Button variant="contained" color="primary" disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || loading} size="small" disableElevation type="submit">
                                                    Save
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </form >
                            </CardViewWrapper>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={4}>
                            <Box className={classes.helpText}>
                                <div className={classes.iconTitle}><ErrorOutlineIcon />Configure Display Frequency </div>
                                <Typography variant="body2" gutterBottom>
                                Select the number of Secret Questions that users need to configure to set up verification for their Cymmetri IAM accounts. Choose the minimum number of questions that users need to answer correctly to gain access to their accounts or retrieve passwords.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={9} md={9} lg={8}>
                            <CardViewWrapper>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} className={classes.ruleTable}>
                                        <MaterialTable
                                            title="Questions"
                                            columns={columns}
                                            data={data}
                                            isLoading={loading}
                                            options={{
                                                rowStyle: {
                                                    backgroundColor: '#fff',
                                                },
                                                cellStyle: {
                                                    borderBottom: 'none',
                                                },
                                                headerStyle: {
                                                    backgroundColor: 'transparent',
                                                    borderBottom: 'none',
                                                    color: '#666667',
                                                },
                                                paginationType: 'stepped',
                                                draggable: false,
                                                actionsColumnIndex: -1
                                            }}
                                            localization={{
                                                pagination: {
                                                    labelRowsPerPage: '',
                                                    labelDisplayedRows: 'Displaying {from}-{to} of {count} records'
                                                }
                                            }}
                                            actions={[
                                                {
                                                    icon: () => <span><Button variant="contained" color="primary" startIcon={<AddIcon />} disableElevation disableFocusRipple disableRipple className={classes.tableAddIcon}>
                                                        ADD NEW
                                                    </Button></span>,
                                                    isFreeAction: true,
                                                    hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
                                                    onClick: () => this.handleAddQuesModalOpen()
                                                },
                                                {
                                                    icon: () => isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : <Avatar src={require('../../../../../../assets/Edit.png')} className={classes.editDeleteIcon} />,
                                                    tooltip: "Edit Question",
                                                    onClick: (event, rowData) => this.handleClickOpenEdit(event, rowData)
                                                },
                                                {
                                                    icon: () => <Avatar src={require('../../../../../../assets/Delete.png')} className={classes.editDeleteIcon} />,
                                                    tooltip: "Delete Question",
                                                    onClick: (event, rowData) => this.handleClickDelete(event, rowData),
                                                    hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
                                                }
                                            ]}
                                        />
                                    </Grid>
                                </Grid>
                            </CardViewWrapper>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={4}>
                            <Box className={classes.helpText}>
                                <div className={classes.iconTitle}><ErrorOutlineIcon />Set Up Secret Questions </div>
                                <Typography variant="body2" gutterBottom>
                                Create a predefined set of Secret Questions that users can choose from while setting up their Secret Question/Answer combinations as an added layer of protection for their Cymmetri IAM accounts. Easily edit, activate or deactivate Secret Questions in use.
                        </Typography>
                            </Box>

                        </Grid>
                    </Grid>
                    {
                        this.state.openAddQuesModal &&
                        <AddSecretQuestionModal
                            open={this.state.openAddQuesModal}
                            handleClose={() => this.handleClose()}
                            type={type}
                            isActive={isActive}
                            quesID={quesID}
                            questionName={questionName}
                        />
                    }
                </ScrollWrapper>
            </>
        )
    }
}

SecretQuestion = reduxForm({
    form: "SecretQuestionForm",
    validate,
    enableReinitialize: true
})(SecretQuestion);

function mapStateToProps(state) {
    let initialValueData = {};
    if (state.settingReducer.secQuesConfigDetails !== null && state.settingReducer.secQuesConfigDetails !== undefined) {
        let data = state.settingReducer.secQuesConfigDetails.data
        initialValueData = {
            requiredQuestion: data.noOfQuestionToConfigure,
            minimumQuestion: data.minimumCorrectAnswers,
            minAnswerLength: data.minAnswerLength,
        }
    }
    return {
        loading: state.settingReducer.loading || state.administrationmfaReducer.loading,
        initialValues: initialValueData,
        mfaConfigDetails: state.administrationmfaReducer.mfaConfigDetails !== null && state.administrationmfaReducer.mfaConfigDetails,
        data: state.settingReducer.secQuesList !== null && state.settingReducer.secQuesList.data
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({
            GetSecQuesConfigAction,
            GetMfaConfigAction,
            PostAddUpdateSecQuesConfigAction,
            GetAllSecQuesAction,
            PostDeleteSecQuesAction
        }, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(SecretQuestion));

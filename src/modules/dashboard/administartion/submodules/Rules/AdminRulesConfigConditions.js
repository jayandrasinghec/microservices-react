import React, { Component } from 'react';
import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Switch from '@material-ui/core/Switch';

import CardViewWrapper from "../../../../../components/HOC/CardViewWrapper"
import ActiveStatusChip from '../../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../../components/HOC/InactiveStatusChip';
import GreyBtn from '../../../../../components/HOC/GreyBtn';
import AddIcon from '@material-ui/icons/Add';
import AddEditRuleConditionModal from './AddEditRuleConditionModal';
import { GetConditionListByRuleIdAction, DeleteRuleConditionAction, PostChangeConditionStatusAction } from './actions/administrationRuleActions';
import { isActiveForRoles } from '../../../../../utils/auth';
import CustomPagination from '../../../../../components/CustomPagination';


const styles = theme => ({
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
    },
    paginationContainer:{
        display:"block",
        padding:"20px 0px"
    }
});


class AdminRuleConfigConditions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isAdd: false,
            isActive: false,
            chunk:[]
        }
    }

    componentDidMount = () => {
        this.props.GetConditionListByRuleIdAction(this.props.ruleId)
    }

    UNSAFE_componentWillReceiveProps = (nextProps) => {
        if (this.props.conditionByRuleIdList !== nextProps.conditionByRuleIdList) {
            this.setState({
                data: nextProps.conditionByRuleIdList.data
            })
        }
    }

    handleClose = () => {
        this.setState({
            isAdd: false
        })
    }

    handleClickDelete = (event, rowData) => {
        this.props.DeleteRuleConditionAction(rowData.id, this.props.ruleId)
    }

    activeToggleHandler = (event, rowData) => {
        let conditionID = rowData.id;
        let postData = {
            "status": rowData.status === true ? false : true
        }
        this.props.PostChangeConditionStatusAction(postData, conditionID, this.props.ruleId)
    }

    handleAddNewCondition = () => {
        this.setState({
            isAdd: true
        })
    }

    onBackButtonClick = () => {
        const url = '/dash/admin/rules';
        this.props.history.push(url);
    }

    render() {
        const { classes, loading } = this.props;
        const { data, isAdd,chunk } = this.state;
        return (
            <>
                {isAdd && <AddEditRuleConditionModal open={isAdd} handleClose={() => this.handleClose()} />}
                <Grid container spacing={2}>
                    <Grid item xs={12} className={classes.ruleTable}>
                        <MaterialTable
                            title="Rule"
                            data={chunk}
                            // isLoading={loading}
                            columns={[
                                { title: 'Type', field: 'type' },
                                // { title: 'Value', field: 'value', cellStyle: { fontWeight: '700', border: 'none' } },
                                { title: 'Value', render:(rowData)=>{
                                        
                                    return (
                                        <>
                                        {rowData.matches === 'NOT_EQUALS' ? <span>(not)</span>:null}
                                    <span style={{ fontWeight: '700', border: 'none' }}>
                                        
                                        {rowData.value}
                                    </span>
                                    </>)
                                }},
                                { title: 'Details', field: 'occurence' },
                                {
                                    title: 'Status',
                                    field: 'status',
                                    render: rowData => rowData.status === true
                                        ?
                                        <>
                                            <ActiveStatusChip>Active</ActiveStatusChip>
                                        </>
                                        :
                                        <>
                                            <InactiveStatusChip>Inactive</InactiveStatusChip>
                                        </>
                                },
                            ]}
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
                                actionsColumnIndex: -1,
                                paging: false,
                            }}
                            // localization={{
                            //     pagination: {
                            //         labelRowsPerPage: '',
                            //         labelDisplayedRows: 'Displaying {from}-{to} of {count} records'
                            //     }
                            // }}
                            actions={[
                                {
                                    icon: () => <span><Button variant="contained" color="primary" startIcon={<AddIcon />} disableElevation disableFocusRipple disableRipple className={classes.tableAddIcon}>
                                        ADD NEW
                                            </Button></span>,
                                    isFreeAction: true,
                                    hidden: !isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
                                    onClick: () => this.handleAddNewCondition()
                                },
                                rowData => ({
                                    icon: () => <Switch name="checked" color="primary" checked={rowData.status === true ? true : false} />,
                                    tooltip: "Change Status",
                                    disabled: !isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
                                    onClick: (event, rowData) => this.activeToggleHandler(event, rowData)
                                }),
                                {
                                    icon: () => <Avatar src={require('../../../../../assets/Delete.png')} className={classes.editDeleteIcon} />,
                                    tooltip: "Delete Condition",
                                    disabled: !isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
                                    onClick: (event, rowData) => this.handleClickDelete(event, rowData)
                                }
                            ]}
                        />
                    </Grid>
                    <Grid container className={classes.paginationContainer}>
                    <CustomPagination 
                            data={data}
                            setChunk={(data)=>{this.setState({chunk:data})}}          
                            />
                    </Grid>
                </Grid>
                
                {/* <Box mt={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={6} sm={6} md={6} lg={6}>
                            <GreyBtn>Discard</GreyBtn>
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} lg={6} container direction="row" justify="flex-end">
                            <Button variant="contained" color="primary" type="submit" size="small" disableElevation>
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </Box> */}
            </>
        )
    }
}

AdminRuleConfigConditions = reduxForm({
    form: "AdminRuleConfigConditionsForm",
    // validate,
    enableReinitialize: true
})(AdminRuleConfigConditions);

function mapStateToProps(state) {
    return {
        loading: state.adminRuleReducer.loading,
        ruleId: state.adminRuleReducer.ruleId,
        conditionByRuleIdList: state.adminRuleReducer.conditionByRuleIdList !== null && state.adminRuleReducer.conditionByRuleIdList,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({
            GetConditionListByRuleIdAction,
            DeleteRuleConditionAction,
            PostChangeConditionStatusAction
        }, dispatch)
    };
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(AdminRuleConfigConditions));


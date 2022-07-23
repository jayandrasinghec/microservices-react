import React from 'react';
import {
    actionCreator,
    checkHttpStatus,
    jsonApiHeader,
    AdminRuleActionTypes,
    GET_ADMIN_RULE_LIST_API,
    POST_ADD_NEW_RULE_API,
    GET_RULE_DETAILS_BY_ID_API,
    POST_MODIFY_EXISTING_RULE_API,
    POST_DELETE_RULE_API,
    POST_FACTORS_ACTIONABLE_ELEMENTS_API,
    POST_SAVE_ACTION_API,
    GET_CONDITION_BY_RULE_ID_API,
    DELETE_CONDITION_RULE_DETAIL_API,
    POST_CREATE_CONDITION_RULE_API,
    GET_RULE_ACTION_GROUP_API,
    GET_USER_LIST_SEARCH_API,
    POST_CHANGE_CONDITION_STATUS_RULE_API,
    GET_GROUP_LIST_SEARCH_API,
    POST_RULE_ASSIGNED_TO_API
} from '../constants/index';
import { API_URL } from '../../../../../../shared/utility';
import { enqueueSnackbarAction, closeSnackbarAction } from "../../MultiFactorAuth/actions/snackbarActions";
import Button from '@material-ui/core/Button';
import { showError } from '../../../../../../utils/notifications';
import { errors } from '../../../../../../utils/error';

const search = (key) => {
  for (var i = 0; i < errors.length; i++) {
    if (errors[i].key === key) {
      return errors[i].value;
    }
  }
}

export const SetRoleIDAction = (roleId) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdminRuleActionTypes.set_RoleId.SUCCESS, roleId));
    };
};

export const ResetRoleIDAction = (roleId) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdminRuleActionTypes.reset_RoleId.SUCCESS, null));
    };
};

export const GetAdminRuleListAction = () => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdminRuleActionTypes.get_AdminRuleList.REQUEST));
        fetch(`${GET_ADMIN_RULE_LIST_API}`, {
            method: 'GET',
            headers: jsonApiHeader('milan', false),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdminRuleActionTypes.get_AdminRuleList.SUCCESS, response));
            })
            .catch(function (error) {
                dispatch(actionCreator(AdminRuleActionTypes.get_AdminRuleList.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while fetching rules list",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "error",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
            });
    };
};


export const PostAddRuleAction = (postData) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdminRuleActionTypes.post_AddNewRule.REQUEST));
        fetch(`${POST_ADD_NEW_RULE_API}`, {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: jsonApiHeader('milan', true),
        })
            .then(checkHttpStatus)
            .then(function (response) {
              // dispatch(actionCreator(AdminRuleActionTypes.post_AddNewRule.SUCCESS, response));
              if(response.success){
                dispatch(actionCreator(AdminRuleActionTypes.post_AddNewRule.SUCCESS, response));
              } else {
                dispatch(actionCreator(AdminRuleActionTypes.post_AddNewRule.FAILURE));
                const value = search(response.errorCode);
                const message = value ? value : response.errorCode
                showError(message, response.errorCode)
              }
            })
            .catch(function (error) {
                dispatch(actionCreator(AdminRuleActionTypes.post_AddNewRule.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while adding new rule",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "error",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
            });
    };
};

export const PostModifyExistingRuleAction = (postData) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdminRuleActionTypes.post_ModifyExistingRule.REQUEST));
        fetch(`${POST_MODIFY_EXISTING_RULE_API}`, {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: jsonApiHeader('milan', true),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                if(response.success){
                    dispatch(actionCreator(AdminRuleActionTypes.post_ModifyExistingRule.SUCCESS, response));
                    dispatch(enqueueSnackbarAction({
                        message: "Rules details updated successfully",
                        options: {
                          key: new Date().getTime() + Math.random(),
                          variant: "success",
                          action: key => (
                            <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                          )
                        }
                    }))
                } else {
                    dispatch(actionCreator(AdminRuleActionTypes.post_ModifyExistingRule.FAILURE));
                    const value = search(response.errorCode);
                    const message = value ? value : response.errorCode
                    showError(message, response.errorCode)
                  }
            })
            .catch(function (error) {
                dispatch(actionCreator(AdminRuleActionTypes.post_ModifyExistingRule.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while updating rule details",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "error",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
            });
    };
};

export const PostDeleteRuleAction = (ruleID, history) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdminRuleActionTypes.post_DeleteRule.REQUEST));
        fetch(`${POST_DELETE_RULE_API}/${ruleID}`, {
            method: 'POST',
            headers: jsonApiHeader('milan', false),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdminRuleActionTypes.post_DeleteRule.SUCCESS, response));
                history.push('/dash/admin/rules');
                dispatch(enqueueSnackbarAction({
                    message: "Rule deleted successfully",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "success",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
            })
            .catch(function (error) {
                dispatch(actionCreator(AdminRuleActionTypes.post_DeleteRule.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while deleting rule",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "error",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
            });
    };
};


export const GetRulesDetailsByIdAction = (ruleID) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdminRuleActionTypes.get_RuleDetaisByID.REQUEST));
        fetch(`${GET_RULE_DETAILS_BY_ID_API}/${ruleID}`, {
            method: 'GET',
            headers: jsonApiHeader('milan', false),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdminRuleActionTypes.get_RuleDetaisByID.SUCCESS, response));
            })
            .catch(function (error) {
                dispatch(actionCreator(AdminRuleActionTypes.get_RuleDetaisByID.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while fetching rule details",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "error",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
            });
    };
};

export const PostFactorsActionableElementsAction = (postData) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdminRuleActionTypes.post_FactorsActionableElements.REQUEST));
        fetch(`${POST_FACTORS_ACTIONABLE_ELEMENTS_API}`, {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: jsonApiHeader('milan', true),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdminRuleActionTypes.post_FactorsActionableElements.SUCCESS, response));
                dispatch(enqueueSnackbarAction({
                    message: "Available factors updated successfully",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "success",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
            })
            .catch(function (error) {
                dispatch(actionCreator(AdminRuleActionTypes.post_FactorsActionableElements.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while updating available factors",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "error",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
            });
    };
};



export const PostRuleActionAction = (postData, ruleId) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdminRuleActionTypes.post_saveAction.REQUEST));
        fetch(`${POST_SAVE_ACTION_API}`, {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: jsonApiHeader('milan', true),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdminRuleActionTypes.post_saveAction.SUCCESS, response));
                dispatch(enqueueSnackbarAction({
                    message: "Action applied successfully",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "success",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
                dispatch(GetRulesDetailsByIdAction(ruleId))
            })
            .catch(function (error) {
                dispatch(actionCreator(AdminRuleActionTypes.post_saveAction.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while Applying Action",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "error",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
            });
    };
};

export const GetConditionListByRuleIdAction = (ruleID) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdminRuleActionTypes.get_ConditionByRuleId.REQUEST));
        fetch(`${GET_CONDITION_BY_RULE_ID_API}/${ruleID}`, {
            method: 'GET',
            headers: jsonApiHeader('milan', false),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdminRuleActionTypes.get_ConditionByRuleId.SUCCESS, response));
            })
            .catch(function (error) {
                dispatch(actionCreator(AdminRuleActionTypes.get_ConditionByRuleId.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while fetching condition list",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "error",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
            });
    };
};

export const DeleteRuleConditionAction = (conditionID, ruleID) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdminRuleActionTypes.delete_ConditionRuleDetail.REQUEST));
        fetch(`${DELETE_CONDITION_RULE_DETAIL_API}/${conditionID}`, {
            method: 'DELETE',
            headers: jsonApiHeader('milan', false),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdminRuleActionTypes.delete_ConditionRuleDetail.SUCCESS, response));
                dispatch(enqueueSnackbarAction({
                    message: "Condition deleted successfully",
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: "success",
                        action: key => (
                            <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                            )
                        }
                    }))
                dispatch(GetConditionListByRuleIdAction(ruleID));
            })
            .catch(function (error) {
                dispatch(actionCreator(AdminRuleActionTypes.delete_ConditionRuleDetail.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error occured while deleting condition",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "error",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
            });
    };
};

export const PostCreateRuleConditionAction = (postData, ruleID) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdminRuleActionTypes.post_CreateConditionRuleDetail.REQUEST));
        fetch(`${POST_CREATE_CONDITION_RULE_API}`, {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: jsonApiHeader('milan', true),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdminRuleActionTypes.post_CreateConditionRuleDetail.SUCCESS, response));
                dispatch(enqueueSnackbarAction({
                    message: "Condition created succesfully",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "success",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
                dispatch(GetConditionListByRuleIdAction(ruleID))
            })
            .catch(function (error) {
                dispatch(actionCreator(AdminRuleActionTypes.post_CreateConditionRuleDetail.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error occured while creating a condition",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "error",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
            });
    };
};

export const GetRuleActionGroupDetailsAction = () => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdminRuleActionTypes.get_RuleActionGroup.REQUEST));
        fetch(`${GET_RULE_ACTION_GROUP_API}`, {
            method: 'GET',
            headers: jsonApiHeader('milan', false),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdminRuleActionTypes.get_RuleActionGroup.SUCCESS, response));
            })
            .catch(function (error) {
                dispatch(actionCreator(AdminRuleActionTypes.get_RuleActionGroup.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while fetching action group details",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "error",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
            });
    };
};

export const GetConditionNameAction = (URL) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdminRuleActionTypes.get_conditionName.REQUEST));
        fetch(`${API_URL}/${URL}`, {
            method: 'GET',
            headers: jsonApiHeader('milan', false),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdminRuleActionTypes.get_conditionName.SUCCESS, response));
            })
            .catch(function (error) {
                dispatch(actionCreator(AdminRuleActionTypes.get_conditionName.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while fetching condition name",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "error",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
            });
    };
};

export const PostChangeConditionStatusAction = (postData, conditionID, ruleID) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdminRuleActionTypes.post_changeConditionstatus.REQUEST));
        fetch(`${POST_CHANGE_CONDITION_STATUS_RULE_API}/${conditionID}`, {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: jsonApiHeader('milan', true),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdminRuleActionTypes.post_changeConditionstatus.SUCCESS, response));
                dispatch(enqueueSnackbarAction({
                    message: "Condition status updated successfully",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "success",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
                dispatch(GetConditionListByRuleIdAction(ruleID))
            })
            .catch(function (error) {
                dispatch(actionCreator(AdminRuleActionTypes.post_changeConditionstatus.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while updating condition status",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "error",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
            });
    };
};

export const PostUserListSearchAction = (postData) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdminRuleActionTypes.get_userListSearch.REQUEST));
        fetch(`${GET_USER_LIST_SEARCH_API}`, {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: jsonApiHeader('milan', true),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdminRuleActionTypes.get_userListSearch.SUCCESS, response));
            })
            .catch(function (error) {
                dispatch(actionCreator(AdminRuleActionTypes.get_userListSearch.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while fetching user list",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "error",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
            });
    };
};

export const PostGroupListSearchAction = (postData) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdminRuleActionTypes.get_groupListSearch.REQUEST));
        fetch(`${GET_GROUP_LIST_SEARCH_API}`, {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: jsonApiHeader('milan', true),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdminRuleActionTypes.get_groupListSearch.SUCCESS, response));
            })
            .catch(function (error) {
                dispatch(actionCreator(AdminRuleActionTypes.get_groupListSearch.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while fetching group list",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "error",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
            });
    };
};


export const PostRuleAssignedToAction = (postData, ruleId) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdminRuleActionTypes.post_ruleAssignedTo.REQUEST));
        fetch(`${POST_RULE_ASSIGNED_TO_API}`, {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: jsonApiHeader('milan', true),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdminRuleActionTypes.post_ruleAssignedTo.SUCCESS, response));
                dispatch(enqueueSnackbarAction({
                    message: "Rules Assigned successfully",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "success",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
                dispatch(GetRulesDetailsByIdAction(ruleId))
            })
            .catch(function (error) {
                dispatch(actionCreator(AdminRuleActionTypes.post_ruleAssignedTo.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while assigning rules",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "error",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
            });
    };
};

export const ClearRuleDetailsByID = () => ({
  type: AdminRuleActionTypes.clear_RuleDetaisByID.SUCCESS
})



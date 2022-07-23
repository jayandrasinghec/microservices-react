import {
    actionCreator,
    API_URL,
    checkHttpStatus,
    createRequestActionTypes,
    jsonApiHeader,
} from '../../../../../../shared/utility';

export {
    jsonApiHeader,
    actionCreator,
    checkHttpStatus
};

export const GET_ADMIN_RULE_LIST_API = `${API_URL}/rulesrvc/rule/list`;
export const POST_ADD_NEW_RULE_API = `${API_URL}/rulesrvc/rule/create`;
export const POST_MODIFY_EXISTING_RULE_API = `${API_URL}/rulesrvc/rule/modify`;
export const POST_DELETE_RULE_API = `${API_URL}/rulesrvc/rule/delete`;
export const GET_RULE_DETAILS_BY_ID_API = `${API_URL}/rulesrvc/rule/getRuleById`;
export const POST_FACTORS_ACTIONABLE_ELEMENTS_API = `${API_URL}/rulesrvc/rule/actionableElements`;
export const POST_SAVE_ACTION_API = `${API_URL}/rulesrvc/rule/saveAction`;
export const GET_CONDITION_BY_RULE_ID_API = `${API_URL}/rulesrvc/rule/condition/getByRuleId`;
export const DELETE_CONDITION_RULE_DETAIL_API = `${API_URL}/rulesrvc/rule/condition/delete`;
export const POST_CREATE_CONDITION_RULE_API = `${API_URL}/rulesrvc/rule/condition/create`;
export const POST_CHANGE_CONDITION_STATUS_RULE_API = `${API_URL}/rulesrvc/rule/condition`;
export const GET_RULE_ACTION_GROUP_API = `${API_URL}/rulesrvc/ruleActionGroup/getById?id=MFA`;
export const GET_USER_LIST_SEARCH_API = `${API_URL}/usersrvc/api/user/list`;
export const GET_GROUP_LIST_SEARCH_API = `${API_URL}/usersrvc/api/group/list`;
export const POST_RULE_ASSIGNED_TO_API = `${API_URL}/rulesrvc/rule/assignTo`;

export const AdminRuleActionTypes = {
    get_AdminRuleList : createRequestActionTypes("GET_ADMIN_RULE_LIST"),
    post_AddNewRule: createRequestActionTypes('ADD_NEW_RULE'),
    post_ModifyExistingRule: createRequestActionTypes('POST_MODIFY_EXISTING_RULE'),
    post_DeleteRule: createRequestActionTypes('POST_MODIFY_EXISTING_RULE'),
    set_RoleId: createRequestActionTypes('SET_ROLE_ID'),
    reset_RoleId: createRequestActionTypes('RESET_ROLE_ID'),
    get_RuleDetaisByID: createRequestActionTypes('GET_RULE_DETAILS_BY_ID'),
    clear_RuleDetaisByID: createRequestActionTypes('CLEAR_RULE_DETAILS_BY_ID'),
    post_FactorsActionableElements: createRequestActionTypes('POST_FACTCORS_ACTIONABLE_ELEMENTS'),
    post_saveAction: createRequestActionTypes('POST_SAVE_ACTION'),
    get_ConditionByRuleId: createRequestActionTypes('GET_CONDITION_BY_RULE_ID'),
    delete_ConditionRuleDetail: createRequestActionTypes('DELETE_CONDITION_RULE_DETAIL'),
    post_CreateConditionRuleDetail: createRequestActionTypes('POST_CREATE_CONDITION_RULE'),
    get_RuleActionGroup: createRequestActionTypes('GET_RULE_ACTION_GROUP'),
    get_conditionName: createRequestActionTypes('GET_CONDITION_NAME'),
    get_userListSearch: createRequestActionTypes('GET_USER_LIST_SEARCH'),
    get_groupListSearch: createRequestActionTypes('GET_GROUP_LIST_SEARCH'),
    post_changeConditionstatus: createRequestActionTypes('POST_CHANGE_CONDITION_STATUS_RULE'),
    post_ruleAssignedTo: createRequestActionTypes('POST_RULE_ASSIGNED_TO'),
};
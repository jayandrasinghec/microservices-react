import { AdminRuleActionTypes } from '../constants/index';

const initialState = {
    loading: false,
    adminRuleList: null,
    addedRule: null,
    modifyExistingRule: null,
    deleteRule: null,
    ruleId: null,
    ruleDetailsById: null,
    factorsActionableElements: null,
    saveAction: null,
    conditionByRuleIdList: null,
    deletedConditionRuleDetail: null,
    CreatedConditionRule: null,
    ruleActionGroupDetails: null,
    conditionName: null,
    userListSearch: null,
    groupListSearch: null,
    changeConditionStatus: null,
    ruleAssignedTo: null
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case AdminRuleActionTypes.set_RoleId.SUCCESS:
            return {
                ...state,
                ruleId: payload
            };
        case AdminRuleActionTypes.reset_RoleId.SUCCESS:
            return {
                ...state,
                ruleId: null
            };
        case AdminRuleActionTypes.get_AdminRuleList.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdminRuleActionTypes.get_AdminRuleList.SUCCESS:
            return {
                ...state,
                loading: false,
                adminRuleList: payload
            };
        case AdminRuleActionTypes.get_AdminRuleList.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdminRuleActionTypes.post_AddNewRule.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdminRuleActionTypes.post_AddNewRule.SUCCESS:
            return {
                ...state,
                loading: false,
                addedRule: payload
            };
        case AdminRuleActionTypes.post_AddNewRule.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdminRuleActionTypes.get_RuleDetaisByID.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdminRuleActionTypes.get_RuleDetaisByID.SUCCESS:
            return {
                ...state,
                loading: false,
                ruleDetailsById: payload
            };
        case AdminRuleActionTypes.get_RuleDetaisByID.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdminRuleActionTypes.post_ModifyExistingRule.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdminRuleActionTypes.post_ModifyExistingRule.SUCCESS:
            return {
                ...state,
                loading: false,
                ruleDetailsById: payload
            };
        case AdminRuleActionTypes.post_ModifyExistingRule.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdminRuleActionTypes.post_DeleteRule.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdminRuleActionTypes.post_DeleteRule.SUCCESS:
            return {
                ...state,
                loading: false,
                deleteRule: payload
            };
        case AdminRuleActionTypes.post_DeleteRule.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdminRuleActionTypes.post_FactorsActionableElements.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdminRuleActionTypes.post_FactorsActionableElements.SUCCESS:
            return {
                ...state,
                loading: false,
                factorsActionableElements: payload
            };
        case AdminRuleActionTypes.post_FactorsActionableElements.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdminRuleActionTypes.post_saveAction.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdminRuleActionTypes.post_saveAction.SUCCESS:
            return {
                ...state,
                loading: false,
                saveAction: payload
            };
        case AdminRuleActionTypes.post_saveAction.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdminRuleActionTypes.get_ConditionByRuleId.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdminRuleActionTypes.get_ConditionByRuleId.SUCCESS:
            return {
                ...state,
                loading: false,
                conditionByRuleIdList: payload
            };
        case AdminRuleActionTypes.get_ConditionByRuleId.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdminRuleActionTypes.delete_ConditionRuleDetail.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdminRuleActionTypes.delete_ConditionRuleDetail.SUCCESS:
            return {
                ...state,
                loading: false,
                deletedConditionRuleDetail: payload
            };
        case AdminRuleActionTypes.delete_ConditionRuleDetail.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdminRuleActionTypes.post_CreateConditionRuleDetail.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdminRuleActionTypes.post_CreateConditionRuleDetail.SUCCESS:
            return {
                ...state,
                loading: false,
                CreatedConditionRule: payload
            };
        case AdminRuleActionTypes.post_CreateConditionRuleDetail.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdminRuleActionTypes.get_RuleActionGroup.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdminRuleActionTypes.get_RuleActionGroup.SUCCESS:
            return {
                ...state,
                loading: false,
                ruleActionGroupDetails: payload
            };
        case AdminRuleActionTypes.get_RuleActionGroup.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdminRuleActionTypes.get_conditionName.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdminRuleActionTypes.get_conditionName.SUCCESS:
            return {
                ...state,
                loading: false,
                conditionName: payload
            };
        case AdminRuleActionTypes.get_conditionName.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdminRuleActionTypes.get_userListSearch.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdminRuleActionTypes.get_userListSearch.SUCCESS:
            return {
                ...state,
                loading: false,
                userListSearch: payload
            };
        case AdminRuleActionTypes.get_userListSearch.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdminRuleActionTypes.post_changeConditionstatus.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdminRuleActionTypes.post_changeConditionstatus.SUCCESS:
            return {
                ...state,
                loading: false,
                changeConditionStatus: payload
            };
        case AdminRuleActionTypes.post_changeConditionstatus.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdminRuleActionTypes.get_groupListSearch.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdminRuleActionTypes.get_groupListSearch.SUCCESS:
            return {
                ...state,
                loading: false,
                groupListSearch: payload
            };
        case AdminRuleActionTypes.get_groupListSearch.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdminRuleActionTypes.post_ruleAssignedTo.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdminRuleActionTypes.post_ruleAssignedTo.SUCCESS:
            return {
                ...state,
                loading: false,
                ruleAssignedTo: payload
            };
        case AdminRuleActionTypes.post_ruleAssignedTo.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdminRuleActionTypes.clear_RuleDetaisByID.SUCCESS:
          return {
              ...state,
              // loading: false,
              ruleDetailsById: {}
          };
        default:
            return state;
    }
};

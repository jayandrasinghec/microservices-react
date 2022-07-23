import { CampaignActionTypes } from '../constants/index';

const initialState = {
    loading: false,
    campaigns: null,
    campaignDetails: null,
    campaignStage: null,
    campaignHistoryDetails: null,
    campaignStatus: null,
    stages: null,
    scope: null,
    campaignHistory: null,
    assignmentList: null,
    assignmentHistoryList: null,
    campaignScope: null,
    activeSummary: null,
    activeAssignments: null,
    historySummary: null,
    historyAssignments: null
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case CampaignActionTypes.post_CampaignDetails.REQUEST:
            return {
                ...state,
                loading: true
            };
        case CampaignActionTypes.post_CampaignDetails.SUCCESS:
            return {
                ...state,
                campaignDetails: payload
            };
        case CampaignActionTypes.post_CampaignDetails.FAILURE:
            return {
                ...state,
                // loading: true
            };
        case CampaignActionTypes.put_CampaignDetails.REQUEST:
            return {
                ...state,
                // loading: true
            };
        case CampaignActionTypes.put_CampaignDetails.SUCCESS:
            return {
                ...state,
                campaignDetails: payload
            };
        case CampaignActionTypes.put_CampaignDetails.FAILURE:
            return {
                ...state,
                // loading: true
            };
        case CampaignActionTypes.get_CampaignDetails.REQUEST:
            return {
                ...state,
                // loading: true
            };
        case CampaignActionTypes.get_CampaignDetails.SUCCESS:
            return {
                ...state,
                campaignDetails: payload
            };
        case CampaignActionTypes.get_CampaignDetails.FAILURE:
            return {
                ...state,
                // loading: true
            };
        case CampaignActionTypes.get_CampaignStage.REQUEST:
          return {
              ...state,
              // loading: true
          };
        case CampaignActionTypes.get_CampaignStage.SUCCESS:
            return {
                ...state,
                campaignStage: payload.stages
            };
        case CampaignActionTypes.get_CampaignStage.FAILURE:
            return {
                ...state,
                // loading: true
            };
        case CampaignActionTypes.post_CampaignStage.REQUEST:
          return {
              ...state,
              // loading: true
          };
        case CampaignActionTypes.post_CampaignStage.SUCCESS:
            return {
                ...state,
                campaignStage: payload
            };
        case CampaignActionTypes.post_CampaignStage.FAILURE:
            return {
                ...state,
                // loading: true
            };
        case CampaignActionTypes.put_CampaignStage.REQUEST:
          return {
              ...state,
              // loading: true
          };
        case CampaignActionTypes.put_CampaignStage.SUCCESS:
            return {
                ...state,
                campaignStage: payload
            };
        case CampaignActionTypes.put_CampaignStage.FAILURE:
            return {
                ...state,
                // loading: true
            };
        case CampaignActionTypes.get_AllCampaignLists.REQUEST:
            return {
                ...state,
                // loading: true
            };
        case CampaignActionTypes.get_AllCampaignLists.SUCCESS:
            return {
                ...state,
                campaigns: payload
            };
        case CampaignActionTypes.get_AllCampaignLists.FAILURE:
            return {
                ...state,
                // loading: true
            };
        case CampaignActionTypes.put_CampaignManualStart.REQUEST:
            return {
                ...state,
                loading: true
            };
        case CampaignActionTypes.put_CampaignManualStart.SUCCESS:
            return {
                ...state,
                loading: false
                // campaignStatus: payload
            };
        case CampaignActionTypes.put_CampaignManualStart.FAILURE:
            return {
                ...state,
                loading: true
            };
        case CampaignActionTypes.put_CampaignManualStop.REQUEST:
            return {
                ...state,
                loading: true
            };
        case CampaignActionTypes.put_CampaignManualStop.SUCCESS:
            return {
                ...state,
                loading: false
                // campaignStatus: payload
            };
        case CampaignActionTypes.put_CampaignManualStop.FAILURE:
            return {
                ...state,
                loading: true
            };
        case CampaignActionTypes.put_CampaignPublish.REQUEST:
            return {
                ...state,
                // loading: true
            };
        case CampaignActionTypes.put_CampaignPublish.SUCCESS:
            return {
                ...state,
                campaignStatus: payload
            };
        case CampaignActionTypes.put_CampaignPublish.FAILURE:
            return {
                ...state,
                // loading: true
            };
        case CampaignActionTypes.post_CampaignHistoryList.REQUEST:
            return {
                ...state,
            };
        case CampaignActionTypes.post_CampaignHistoryList.SUCCESS:
            return {
                ...state,
                campaignHistory: payload
            };
        case CampaignActionTypes.post_CampaignHistoryList.FAILURE:
            return {
                ...state,
            };
        case CampaignActionTypes.post_CampaignAssignmentList.REQUEST:
            return {
                ...state,
            };
        case CampaignActionTypes.post_CampaignAssignmentList.SUCCESS:
            return {
                ...state,
                assignmentList: payload
            };
        case CampaignActionTypes.post_CampaignAssignmentList.FAILURE:
            return {
                ...state,
            };
        case CampaignActionTypes.get_CampaignHistoryDetails.REQUEST:
            return {
                ...state,
            };
        case CampaignActionTypes.get_CampaignHistoryDetails.SUCCESS:
            return {
                ...state,
                campaignHistoryDetails: payload
            };
        case CampaignActionTypes.get_CampaignHistoryDetails.FAILURE:
            return {
                ...state,
            };
        case CampaignActionTypes.post_CampaignAssignmentHistoryList.REQUEST:
            return {
                ...state,
            };
        case CampaignActionTypes.post_CampaignAssignmentHistoryList.SUCCESS:
            return {
                ...state,
                assignmentHistoryList: payload
            };
        case CampaignActionTypes.post_CampaignAssignmentHistoryList.FAILURE:
            return {
                ...state,
            };
        case CampaignActionTypes.get_CampaignScope.REQUEST:
            return {
                ...state,
            };
        case CampaignActionTypes.get_CampaignScope.SUCCESS:
            return {
                ...state,
                campaignScope: payload
            };
        case CampaignActionTypes.get_CampaignScope.FAILURE:
            return {
                ...state,
            };
        case CampaignActionTypes.post_CampaignScope.REQUEST:
            return {
                ...state,
            };
        case CampaignActionTypes.post_CampaignScope.SUCCESS:
            return {
                ...state,
                // campaignScope: payload
            };
        case CampaignActionTypes.post_CampaignScope.FAILURE:
            return {
                ...state,
            };
        case CampaignActionTypes.post_CampaignActiveSummary.REQUEST:
            return {
                ...state,
            };
        case CampaignActionTypes.post_CampaignActiveSummary.SUCCESS:
            return {
                ...state,
                activeSummary: payload
            };
        case CampaignActionTypes.post_CampaignActiveSummary.FAILURE:
            return {
                ...state,
            };
        case CampaignActionTypes.post_CampaignActiveAssignments.REQUEST:
            return {
                ...state,
            };
        case CampaignActionTypes.post_CampaignActiveAssignments.SUCCESS:
            return {
                ...state,
                activeAssignments: payload
            };
        case CampaignActionTypes.post_CampaignActiveAssignments.FAILURE:
            return {
                ...state,
            };
        case CampaignActionTypes.post_CampaignHistorySummary.REQUEST:
            return {
                ...state,
            };
        case CampaignActionTypes.post_CampaignHistorySummary.SUCCESS:
            return {
                ...state,
                historySummary: payload
            };
        case CampaignActionTypes.post_CampaignHistorySummary.FAILURE:
            return {
                ...state,
            };
        case CampaignActionTypes.post_CampaignHistoryAssignments.REQUEST:
            return {
                ...state,
            };
        case CampaignActionTypes.post_CampaignHistoryAssignments.SUCCESS:
            return {
                ...state,
                historyAssignments: payload
            };
        case CampaignActionTypes.post_CampaignHistoryAssignments.FAILURE:
            return {
                ...state,
            };
        case CampaignActionTypes.clear_CampaignDetails.SUCCESS:
            return {
                ...state,
                campaignDetails: null
            };
        case CampaignActionTypes.clear_CampaignAssignmentList.SUCCESS:
            return {
                ...state,
                assignmentList: null
            };
        case CampaignActionTypes.clear_CampaignHistoryDetails.SUCCESS:
            return {
                ...state,
                campaignHistoryDetails: null
            };
        case CampaignActionTypes.clear_CampaignAssignmentHistoryList.SUCCESS:
            return {
                ...state,
                assignmentHistoryList: null
            };
        case CampaignActionTypes.clear_CampaignScope.SUCCESS:
            return {
                ...state,
                campaignScope: null
            };
        case CampaignActionTypes.clear_CampaignStage.SUCCESS:
            return {
                ...state,
                campaignStage: null
            };
        case CampaignActionTypes.clear_CampaignHistoryList.SUCCESS:
            return {
                ...state,
                campaignHistory: null
            };
        case CampaignActionTypes.clear_CampaignActiveSummary.SUCCESS:
            return {
                ...state,
                activeSummary: null
            };
        case CampaignActionTypes.clear_CampaignActiveAssignments.SUCCESS:
            return {
                ...state,
                activeAssignments: null
            };
        case CampaignActionTypes.clear_CampaignHistorySummary.SUCCESS:
            return {
                ...state,
                historySummary: null
            };
        case CampaignActionTypes.clear_CampaignHistoryAssignments.SUCCESS:
            return {
                ...state,
                historyAssignments: null
            };
        default:
            return state;
    }
};

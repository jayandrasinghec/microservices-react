import {
    actionCreator,
    API_URL,
    checkHttpStatus,
    createRequestActionTypes,
    jsonApiHeader,
} from '../../../../shared/utility';

export {
    jsonApiHeader,
    actionCreator,
    checkHttpStatus
};

export const POST_CAMPAIGN_DETAILS_API = `${API_URL}/igsrvc/api/ig/campaign`;
export const GET_CAMPAIGN_DETAILS_API = `${API_URL}/igsrvc/api/ig/campaign`;
export const GET_ALL_CAMPAIGN_LIST_API = `${API_URL}/igsrvc/api/ig/campaign/admin/list`;
export const POST_UPDATE_CAMPAIGN_STATUS_API = `${API_URL}/igsrvc/api/ig/campaign/update-status`;
export const PUT_CAMPAIGN_PUBLISH_API = `${API_URL}/igsrvc/api/ig/campaign/publish`;
export const PUT_CAMPAIGN_MANUAL_START_API = `${API_URL}/igsrvc/api/ig/campaign/start`;
export const PUT_CAMPAIGN_MANUAL_STOP_API = `${API_URL}/igsrvc/api/ig/campaign/end`;
// export const POST_CAMPAIGN_HISTORY_LIST_API = `${API_URL}/igsrvc/api/ig/campaign/history/execution`;
export const POST_CAMPAIGN_HISTORY_LIST_API = `${API_URL}/igsrvc/api/ig/campaign/execution/history/list`;
export const POST_CAMPAIGN_ASSIGNMENT_LIST_API = `${API_URL}/igsrvc/api/ig/campaignassignment/admin/list`;
export const POST_CAMPAIGN_ASSIGNMENT_HISTORY_LIST_API = `${API_URL}/igsrvc/api/ig/campaignassignment/history`;
export const GET_CAMPAIGN_HISTORY_DETAILS_API = `${API_URL}/igsrvc/api/ig/campaign/history/execution`;
export const PUT_CAMPAIGN_STAGE_API = `${API_URL}/igsrvc/api/ig/campaign/stage`;
export const GET_CAMPAIGN_STAGE_API = `${API_URL}/igsrvc/api/ig/campaign/stage`;
export const GET_CAMPAIGN_SCOPE_API = `${API_URL}/igsrvc/api/ig/campaign/scope`;
export const POST_CAMPAIGN_ACTIVE_SUMMARY = `${API_URL}/igsrvc/api/ig/campaign/execution/list-summary/admin`;
export const POST_CAMPAIGN_ACTIVE_ASSIGNMENTS = `${API_URL}/igsrvc/api/ig/campaign/assignment/list-derived/admin`;
export const POST_CAMPAIGN_HISTORY_SUMMARY = `${API_URL}/igsrvc/api/ig/campaign/execution/history/list-summary/admin`;
export const POST_CAMPAIGN_HISTORY_ASSIGNMENTS = `${API_URL}/igsrvc/api/ig/campaign/assignment/history/list-derived/admin`;


export const CampaignActionTypes = {
    post_CampaignDetails : createRequestActionTypes("POST_CAMPAIGN_DETAILS"),
    get_CampaignDetails : createRequestActionTypes("GET_CAMPAIGN_DETAILS"),
    put_CampaignDetails : createRequestActionTypes("PUT_CAMPAIGN_DETAILS"),
    clear_CampaignDetails : createRequestActionTypes("CLEAR_CAMPAIGN_DETAILS"),
    get_AllCampaignLists : createRequestActionTypes("GET_ALL_CAMPAIGN_LIST"),
    // post_UpdateCampaignStatus : createRequestActionTypes("POST_UPDATE_CAMPAIGN_STATUS"),
    put_CampaignManualStart : createRequestActionTypes("PUT_CAMPAIGN_MANUAL_START"),
    put_CampaignManualStop : createRequestActionTypes("PUT_CAMPAIGN_MANUAL_STOP"),
    put_CampaignPublish : createRequestActionTypes("PUT_CAMPAIGN_PUBLISH"),
    post_CampaignHistoryList : createRequestActionTypes("POST_CAMPAIGN_HISTORY_LIST"),
    clear_CampaignHistoryList : createRequestActionTypes("CLEAR_CAMPAIGN_HISTORY_LIST"),
    post_CampaignAssignmentList : createRequestActionTypes("POST_CAMPAIGN_ASSIGNMENT_LIST"),
    clear_CampaignAssignmentList : createRequestActionTypes("CLEAR_CAMPAIGN_ASSIGNMENT_LIST"),
    get_CampaignHistoryDetails : createRequestActionTypes("GET_CAMPAIGN_HISTORY_DETAILS"),
    clear_CampaignHistoryDetails : createRequestActionTypes("CLEAR_CAMPAIGN_HISTORY_DETAILS"),
    post_CampaignAssignmentHistoryList : createRequestActionTypes("POST_CAMPAIGN_ASSIGNMENT_HISTORY_LIST"),
    clear_CampaignAssignmentHistoryList : createRequestActionTypes("CLEAR_CAMPAIGN_ASSIGNMENT_HISTORY_LIST"),
    get_CampaignScope : createRequestActionTypes("GET_CAMPAIGN_SCOPE"),
    post_CampaignScope : createRequestActionTypes("POST_CAMPAIGN_SCOPE"),
    clear_CampaignScope : createRequestActionTypes("CLEAR_CAMPAIGN_SCOPE"),
    post_CampaignStage : createRequestActionTypes("POST_CAMPAIGN_STAGE"),
    get_CampaignStage : createRequestActionTypes("GET_CAMPAIGN_STAGE"),
    put_CampaignStage : createRequestActionTypes("PUT_CAMPAIGN_STAGE"),
    clear_CampaignStage : createRequestActionTypes("CLEAR_CAMPAIGN_STAGE"),
    post_CampaignActiveSummary : createRequestActionTypes("POST_CAMPAIGN_ACTIVE_SUMMARY"),
    clear_CampaignActiveSummary : createRequestActionTypes("CLEAR_CAMPAIGN_ACTIVE_SUMMARY"),
    post_CampaignActiveAssignments : createRequestActionTypes("POST_CAMPAIGN_ACTIVE_ASSIGNMENTS"),
    clear_CampaignActiveAssignments : createRequestActionTypes("CLEAR_CAMPAIGN_ACTIVE_ASSIGNMENTS"),
    post_CampaignHistorySummary : createRequestActionTypes("POST_CAMPAIGN_HISTORY_SUMMARY"),
    clear_CampaignHistorySummary : createRequestActionTypes("CLEAR_CAMPAIGN_HISTORY_SUMMARY"),
    post_CampaignHistoryAssignments : createRequestActionTypes("POST_CAMPAIGN_HISTORY_ASSIGNMENTS"),
    clear_CampaignHistoryAssignments : createRequestActionTypes("CLEAR_CAMPAIGN_HISTORY_ASSIGNMENTS"),
};
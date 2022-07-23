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

export const GET_MFA_CONFIG_API = `${API_URL}/mfasrvc/mfaConfig`;
export const POST_ADD_UPDATE_TOTP_CONFIG_API = `${API_URL}/mfasrvc/mfaConfig/totpConfig`;
export const POST_ADD_UPDATE_SEC_QUES_CONFIG_API = `${API_URL}/mfasrvc/mfaConfig/securityQuestionConfig`;
export const POST_ADD_UPDATE_GOOGLE_AUTH_CONFIG_API = `${API_URL}/mfasrvc/mfaConfig/googleAuthConfig`;
export const POST_ADD_UPDATE_SMS_AUTH_CONFIG_API = `${API_URL}/mfasrvc/mfaConfig/smsAuthConfig`;
export const POST_ADD_UPDATE_PUSH_AUTH_CONFIG_API = `${API_URL}/mfasrvc/mfaConfig/pushAuthConfig`;


export const AdministrationActionTypes = {
    get_MfaConfig : createRequestActionTypes("GET_MFA_CONFIG"),
    post_AddUpdateTotpConfig : createRequestActionTypes("POST_ADD_UPDATE_TOTP_CONFIG"),
    post_AddUpdateSecQuesConfig : createRequestActionTypes("POST_ADD_UPDATE_SEC_QUES_CONFIG"),
    post_AddUpdateGoogleAuthConfig : createRequestActionTypes("POST_ADD_UPDATE_GOOGLE_AUTH_CONFIG"),
    post_AddUpdateSmsAuthConfig : createRequestActionTypes("POST_ADD_UPDATE_GOOGLE_AUTH_CONFIG"),
    post_AddUpdatePushAuthConfig : createRequestActionTypes("POST_ADD_UPDATE_PUSH_AUTH_CONFIG"),
};
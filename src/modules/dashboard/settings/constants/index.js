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

export const GET_TOTP_CONFIG_API = `${API_URL}/mfasrvc/mfaConfig/totpAuthConfig`;
export const GET_SMS_AUTH_CONFIG_API = `${API_URL}/mfasrvc/mfaConfig/smsAuthConfig`;
export const GET_SEC_QUES_CONFIG_API = `${API_URL}/mfasrvc/mfaConfig/securityQuestionConfig`;
export const GET_ALL_SEC_QUESTIONS_API = `${API_URL}/mfasrvc/questionBank/findAll`;
export const POST_CREATE_NEW_SEC_QUES_API = `${API_URL}/mfasrvc/questionBank/create`;
export const POST_EDIT_NEW_SEC_QUES_API = `${API_URL}/mfasrvc/questionBank/modify`;
export const DELETE_SEC_QUES =  `${API_URL}/mfasrvc/questionBank/remove`;
export const GET_HOOK_CONFIG_ACTION_API =  `${API_URL}/utilsrvc/hook/config/actions`;


export const SettingActionTypes = {
    get_TotpConfig : createRequestActionTypes("GET_TOTP_CONFIG"),
    get_SmsAuthConfig:  createRequestActionTypes("GET_SMS_AUTH_CONFIG"),
    get_SecQuesConfig:  createRequestActionTypes("GET_SEC_QUES_CONFIG"),
    get_AllSecQuestion: createRequestActionTypes('GET_ALL_SEC_QUESTIONS'),
    post_CreateNewSecQues: createRequestActionTypes('POST_CREATE_NEW_SEC_QUES'),
    post_EditNewSecQues: createRequestActionTypes('POST_EDIT_NEW_SEC_QUES'),
    post_DeleteSecQues: createRequestActionTypes('DELETE_SEC_QUES'),
    get_HookConfig:createRequestActionTypes('GET_HOOK_CONFIG_ACTION'),
};
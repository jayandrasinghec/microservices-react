import { SettingActionTypes } from '../constants/index';

const initialState = {
    loading: false,
    totpConfigDetails: null,
    smsConfigDetails: null,
    secQuesConfigDetails: null,
    secQuesList: null,
    createNewSecQues: null,
    editSecQues: null,
    deleteSecQues: null,
    hookAction:[]
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case SettingActionTypes.get_TotpConfig.REQUEST:
            return {
                ...state,
                loading: true
            };
        case SettingActionTypes.get_TotpConfig.SUCCESS:
            return {
                ...state,
                loading: false,
                totpConfigDetails: payload
            };
        case SettingActionTypes.get_TotpConfig.FAILURE:
            return {
                ...state,
                loading: false
            };
        case SettingActionTypes.get_SmsAuthConfig.REQUEST:
            return {
                ...state,
                loading: true
            };
        case SettingActionTypes.get_SmsAuthConfig.SUCCESS:
            return {
                ...state,
                loading: false,
                smsConfigDetails: payload
            };
        case SettingActionTypes.get_SmsAuthConfig.FAILURE:
            return {
                ...state,
                loading: false
            };
        case SettingActionTypes.get_SecQuesConfig.REQUEST:
            return {
                ...state,
                loading: true
            };
        case SettingActionTypes.get_SecQuesConfig.SUCCESS:
            return {
                ...state,
                loading: false,
                secQuesConfigDetails: payload
            };
        case SettingActionTypes.get_SecQuesConfig.FAILURE:
            return {
                ...state,
                loading: false
            };
        case SettingActionTypes.post_CreateNewSecQues.REQUEST:
            return {
                ...state,
                loading: true
            };
        case SettingActionTypes.post_CreateNewSecQues.SUCCESS:
            return {
                ...state,
                loading: false,
                createNewSecQues: payload
            };
        case SettingActionTypes.post_CreateNewSecQues.FAILURE:
            return {
                ...state,
                loading: false
            };
        case SettingActionTypes.post_EditNewSecQues.REQUEST:
            return {
                ...state,
                loading: true
            };
        case SettingActionTypes.post_EditNewSecQues.SUCCESS:
            return {
                ...state,
                loading: false,
                editSecQues: payload
            };
        case SettingActionTypes.post_EditNewSecQues.FAILURE:
            return {
                ...state,
                loading: false
            };
        case SettingActionTypes.post_DeleteSecQues.REQUEST:
            return {
                ...state,
                loading: true
            };
        case SettingActionTypes.post_DeleteSecQues.SUCCESS:
            return {
                ...state,
                loading: false,
                deleteSecQues: payload
            };
        case SettingActionTypes.post_DeleteSecQues.FAILURE:
            return {
                ...state,
                loading: false
            };
        case SettingActionTypes.get_AllSecQuestion.REQUEST:
            return {
                ...state,
                loading: true
            };
        case SettingActionTypes.get_AllSecQuestion.SUCCESS:
            return {
                ...state,
                loading: false,
                secQuesList: payload
            };
        case SettingActionTypes.get_AllSecQuestion.FAILURE:
            return {
                ...state,
                loading: false
            };
        case SettingActionTypes.get_HookConfig.REQUEST:
                return {
                    ...state,
                    loading: true
                };
        case SettingActionTypes.get_HookConfig.SUCCESS:
            return {
                ...state,
                hookAction: payload.data,
                loading: false
            };
        case SettingActionTypes.get_HookConfig.FAILURE:
                return {
                    ...state,
                    loading: false
            };
        default:
            return state;
    }
};

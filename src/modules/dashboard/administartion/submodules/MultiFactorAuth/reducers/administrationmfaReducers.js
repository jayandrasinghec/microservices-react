import { AdministrationActionTypes } from '../constants/index';

const initialState = {
    loading: false,
    mfaConfigDetails: null,
    savedTotpConfig: null,
    savedSecQuesConfig: null,
    savedGoogleAuthConfig: null,
    savedSMSAuthConfig: null
};

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case AdministrationActionTypes.get_MfaConfig.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdministrationActionTypes.get_MfaConfig.SUCCESS:
            return {
                ...state,
                loading: false,
                mfaConfigDetails: payload
            };
        case AdministrationActionTypes.get_MfaConfig.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdministrationActionTypes.post_AddUpdateTotpConfig.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdministrationActionTypes.post_AddUpdateTotpConfig.SUCCESS:
            return {
                ...state,
                loading: false,
                savedTotpConfig: payload
            };
        case AdministrationActionTypes.post_AddUpdateTotpConfig.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdministrationActionTypes.post_AddUpdateSecQuesConfig.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdministrationActionTypes.post_AddUpdateSecQuesConfig.SUCCESS:
            return {
                ...state,
                loading: false,
                savedSecQuesConfig: payload
            };
        case AdministrationActionTypes.post_AddUpdateSecQuesConfig.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdministrationActionTypes.post_AddUpdateGoogleAuthConfig.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdministrationActionTypes.post_AddUpdateGoogleAuthConfig.SUCCESS:
            return {
                ...state,
                loading: false,
                savedGoogleAuthConfig: payload
            };
        case AdministrationActionTypes.post_AddUpdateGoogleAuthConfig.FAILURE:
            return {
                ...state,
                loading: false
            };
        case AdministrationActionTypes.post_AddUpdateSmsAuthConfig.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdministrationActionTypes.post_AddUpdateSmsAuthConfig.SUCCESS:
            return {
                ...state,
                loading: false,
                savedSMSAuthConfig: payload
            };
        case AdministrationActionTypes.post_AddUpdateSmsAuthConfig.FAILURE:
            return {
                ...state,
                loading: false
            };
            case AdministrationActionTypes.post_AddUpdatePushAuthConfig.REQUEST:
            return {
                ...state,
                loading: true
            };
        case AdministrationActionTypes.post_AddUpdatePushAuthConfig.SUCCESS:
            return {
                ...state,
                loading: false,
                savedPushAuthConfig: payload
            };
        case AdministrationActionTypes.post_AddUpdatePushAuthConfig.FAILURE:
            return {
                ...state,
                loading: false
            };
        default:
            return state;
    }
};

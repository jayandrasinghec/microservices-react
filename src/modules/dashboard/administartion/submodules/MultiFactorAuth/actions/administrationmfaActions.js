import React from 'react';
import {
    actionCreator,
    checkHttpStatus,
    jsonApiHeader,
    AdministrationActionTypes,
    GET_MFA_CONFIG_API,
    POST_ADD_UPDATE_TOTP_CONFIG_API,
    POST_ADD_UPDATE_SEC_QUES_CONFIG_API,
    POST_ADD_UPDATE_GOOGLE_AUTH_CONFIG_API,
    POST_ADD_UPDATE_SMS_AUTH_CONFIG_API,
    POST_ADD_UPDATE_PUSH_AUTH_CONFIG_API
} from '../constants/index';

import { GetSmsAuthConfigAction } from '../../../../settings/actions/settingActions';
import { enqueueSnackbarAction, closeSnackbarAction } from "./snackbarActions";
import Button from '@material-ui/core/Button';


export const GetMfaConfigAction = () => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdministrationActionTypes.get_MfaConfig.REQUEST));
        fetch(`${GET_MFA_CONFIG_API}`, {
            method: 'GET',
            headers: jsonApiHeader('milan', false),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdministrationActionTypes.get_MfaConfig.SUCCESS, response));
            })
            .catch(function (error) {
                dispatch(actionCreator(AdministrationActionTypes.get_MfaConfig.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "MFA config details fetching failed",
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

export const PostAddUpdateTotpConfigAction = (postData, type) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdministrationActionTypes.post_AddUpdateTotpConfig.REQUEST));
        fetch(`${POST_ADD_UPDATE_TOTP_CONFIG_API}`, {
            method: 'POST',
            headers: jsonApiHeader('milan2', true),
            body: JSON.stringify(postData)
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdministrationActionTypes.post_AddUpdateTotpConfig.SUCCESS, response));
                dispatch(enqueueSnackbarAction({
                    message: type === "CA" ? "Cymmetri Authenticator updated successfully" : "TOTP policy updated successfully",
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
                dispatch(actionCreator(AdministrationActionTypes.post_AddUpdateTotpConfig.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while updating Cymmetri Authenticator",
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

export const PostAddUpdateSecQuesConfigAction = (postData, type) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdministrationActionTypes.post_AddUpdateSecQuesConfig.REQUEST));
        fetch(`${POST_ADD_UPDATE_SEC_QUES_CONFIG_API}`, {
            method: 'POST',
            headers: jsonApiHeader('milan2', true),
            body: JSON.stringify(postData)
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdministrationActionTypes.post_AddUpdateSecQuesConfig.SUCCESS, response));
                dispatch(enqueueSnackbarAction({
                    message: type === "CA" ? "Security Question updated successfully" : "Secret Question updated successfully",
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
                dispatch(actionCreator(AdministrationActionTypes.post_AddUpdateSecQuesConfig.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while updating Security Questions",
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


export const PostAddUpdateGoogleAuthConfigAction = (postData) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdministrationActionTypes.post_AddUpdateGoogleAuthConfig.REQUEST));
        fetch(`${POST_ADD_UPDATE_GOOGLE_AUTH_CONFIG_API}`, {
            method: 'POST',
            headers: jsonApiHeader('milan2', true),
            body: JSON.stringify(postData)
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdministrationActionTypes.post_AddUpdateGoogleAuthConfig.SUCCESS, response));
                dispatch(enqueueSnackbarAction({
                    message: "Google Authenticator updated successfully",
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
                dispatch(actionCreator(AdministrationActionTypes.post_AddUpdateGoogleAuthConfig.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while updating Google Authenticator",
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

export const PostAddUpdateSMSAuthConfigAction = (postData, type) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdministrationActionTypes.post_AddUpdateSmsAuthConfig.REQUEST));
        fetch(`${POST_ADD_UPDATE_SMS_AUTH_CONFIG_API}`, {
            method: 'POST',
            headers: jsonApiHeader('milan2', true),
            body: JSON.stringify(postData)
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdministrationActionTypes.post_AddUpdateSmsAuthConfig.SUCCESS, response));
                dispatch(enqueueSnackbarAction({
                    // message: type === "SA" ? "SMS Authenticator updated successfully" : "SMS OTP updated successfully",
                    message: type === "SA" ? "SMS Authenticator updated successfully" : "OTP template updated successfully",
                    options: {
                      key: new Date().getTime() + Math.random(),
                      variant: "success",
                      action: key => (
                        <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                      )
                    }
                }))
                dispatch(GetSmsAuthConfigAction())
            })
            .catch(function (error) {
                dispatch(actionCreator(AdministrationActionTypes.post_AddUpdateSmsAuthConfig.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while updating SMS Authenticator",
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

export const PostAddUpdatePushAuthConfigAction = (postData) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(AdministrationActionTypes.post_AddUpdatePushAuthConfig.REQUEST));
        fetch(`${POST_ADD_UPDATE_PUSH_AUTH_CONFIG_API}`, {
            method: 'POST',
            headers: jsonApiHeader('milan2', true),
            body: JSON.stringify(postData)
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(AdministrationActionTypes.post_AddUpdatePushAuthConfig.SUCCESS, response));
                dispatch(enqueueSnackbarAction({
                    message: "Push Notification updated successfully",
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
                dispatch(actionCreator(AdministrationActionTypes.post_AddUpdatePushAuthConfig.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error while updating Push Notification",
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


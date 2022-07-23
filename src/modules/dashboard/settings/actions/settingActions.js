import React from 'react';
import Button from '@material-ui/core/Button';
import {
    actionCreator,
    checkHttpStatus,
    jsonApiHeader,
    SettingActionTypes,
    GET_TOTP_CONFIG_API,
    GET_SMS_AUTH_CONFIG_API,
    GET_SEC_QUES_CONFIG_API,
    POST_CREATE_NEW_SEC_QUES_API,
    POST_EDIT_NEW_SEC_QUES_API,
    DELETE_SEC_QUES,
    GET_ALL_SEC_QUESTIONS_API,
    GET_HOOK_CONFIG_ACTION_API
} from '../constants/index';
import { reset } from "redux-form";
import { enqueueSnackbarAction, closeSnackbarAction } from "../../administartion/submodules/MultiFactorAuth/actions/snackbarActions";
import { showError } from '../../../../utils/notifications';
import { errors } from '../../../../utils/error';
import { jsonApiHeaderWithTenant } from '../../../../shared/utility';

const search = (key) => {
    for (var i = 0; i < errors.length; i++) {
      if (errors[i].key === key) {
        return errors[i].value;
      }
    }
  }

export const GetTotpConfigAction = () => {
    return (dispatch, getState) => {
        dispatch(actionCreator(SettingActionTypes.get_TotpConfig.REQUEST));
        fetch(`${GET_TOTP_CONFIG_API}`, {
            method: 'GET',
            headers: jsonApiHeader('milan', false),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(SettingActionTypes.get_TotpConfig.SUCCESS, response));
            })
            .catch(function (error) {
                dispatch(actionCreator(SettingActionTypes.get_TotpConfig.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error occured while fetching totp config",
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

export const GetSmsAuthConfigAction = () => {
    return (dispatch, getState) => {
        dispatch(actionCreator(SettingActionTypes.get_SmsAuthConfig.REQUEST));
        fetch(`${GET_SMS_AUTH_CONFIG_API}`, {
            method: 'GET',
            headers: jsonApiHeader('milan', false),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(SettingActionTypes.get_SmsAuthConfig.SUCCESS, response));
            })
            .catch(function (error) {
                dispatch(actionCreator(SettingActionTypes.get_SmsAuthConfig.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error occured while fetching auth config",
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

export const GetSecQuesConfigAction = () => {
    return (dispatch, getState) => {
        dispatch(actionCreator(SettingActionTypes.get_SecQuesConfig.REQUEST));
        fetch(`${GET_SEC_QUES_CONFIG_API}`, {
            method: 'GET',
            headers: jsonApiHeader('milan', false),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(SettingActionTypes.get_SecQuesConfig.SUCCESS, response));
            })
            .catch(function (error) {
                dispatch(actionCreator(SettingActionTypes.get_SecQuesConfig.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error occured while fetching security question config",
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

export const GetAllSecQuesAction = () => {
    return (dispatch, getState) => {
        dispatch(actionCreator(SettingActionTypes.get_AllSecQuestion.REQUEST));
        fetch(`${GET_ALL_SEC_QUESTIONS_API}`, {
            method: 'GET',
            headers: jsonApiHeader('', false),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(SettingActionTypes.get_AllSecQuestion.SUCCESS, response));
            })
            .catch(function (error) {
                dispatch(actionCreator(SettingActionTypes.get_AllSecQuestion.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error occured while fetching security question list",
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


export const PostCreateNewSecQuesAction = (postData) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(SettingActionTypes.post_CreateNewSecQues.REQUEST));
        fetch(`${POST_CREATE_NEW_SEC_QUES_API}`, {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: jsonApiHeader('', true),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(SettingActionTypes.post_CreateNewSecQues.SUCCESS, response));
                dispatch(reset('AddSecretQuestionModalForm'));
                dispatch(enqueueSnackbarAction({
                    message: "Secret question added successfully",
                    options: {
                        key: new Date().getTime() + Math.random(),
                        variant: "success",
                        action: key => (
                            <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                        )
                    }
                }))
                dispatch(GetAllSecQuesAction());
            })
            .catch(function (error) {
                dispatch(actionCreator(SettingActionTypes.post_CreateNewSecQues.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error occured while adding secret question",
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
}

export const PostEditSecQuesAction = (postData) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(SettingActionTypes.post_EditNewSecQues.REQUEST));
        fetch(`${POST_EDIT_NEW_SEC_QUES_API}`, {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: jsonApiHeader('', true),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                if (response.success === true) {
                    dispatch(actionCreator(SettingActionTypes.post_EditNewSecQues.SUCCESS, response));
                    dispatch(reset('AddSecretQuestionModalForm'));
                    dispatch(enqueueSnackbarAction({
                        message: "Secret question updated successfully",
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: "success",
                            action: key => (
                                <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                            )
                        }
                    }))
                    dispatch(GetAllSecQuesAction());
                } else {
                    dispatch(actionCreator(SettingActionTypes.post_EditNewSecQues.FAILURE));
                    // dispatch(enqueueSnackbarAction({
                    //     message: "Error occured while editing secret question",
                    //     options: {
                    //         key: new Date().getTime() + Math.random(),
                    //         variant: "error",
                    //         action: key => (
                    //             <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                    //         )
                    //     }
                    // }))
                    const value = search(response.errorCode);
                    const message = value ? value : response.errorCode            
                    showError(message)
                }
            })
            .catch(function (error) {
                dispatch(actionCreator(SettingActionTypes.post_EditNewSecQues.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error occured while editing secret question",
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
}

export const PostDeleteSecQuesAction = (id) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(SettingActionTypes.post_DeleteSecQues.REQUEST));
        fetch(`${DELETE_SEC_QUES}/${id}`, {
            method: 'GET',
            headers: jsonApiHeader('', false),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                if (response.success === true) {
                    dispatch(actionCreator(SettingActionTypes.post_DeleteSecQues.SUCCESS, response));
                    dispatch(enqueueSnackbarAction({
                        message: "Secret Question deleted successfully",
                        options: {
                            key: new Date().getTime() + Math.random(),
                            variant: "success",
                            action: key => (
                                <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                            )
                        }
                    }))
                    dispatch(GetAllSecQuesAction());
                } else {
                    dispatch(actionCreator(SettingActionTypes.post_DeleteSecQues.FAILURE));
                    // dispatch(enqueueSnackbarAction({
                    //     message: "Error occured while deleting secret question",
                    //     options: {
                    //         key: new Date().getTime() + Math.random(),
                    //         variant: "error",
                    //         action: key => (
                    //             <Button onClick={() => dispatch(closeSnackbarAction(key))}>x</Button>
                    //         )
                    //     }
                    // }))
                    const value = search(response.errorCode);
                    const message = value ? value : response.errorCode            
                    showError(message)
                }
            })
            .catch(function (error) {
                dispatch(actionCreator(SettingActionTypes.post_DeleteSecQues.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error occured while deleting secret question",
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
}

export const GetAllHookAction = () => {
    return (dispatch, getState) => {
        dispatch(actionCreator(SettingActionTypes.get_HookConfig.REQUEST));
        fetch(`${GET_HOOK_CONFIG_ACTION_API}`, {
            method: 'GET',
            headers: jsonApiHeaderWithTenant('', false),
        })
            .then(checkHttpStatus)
            .then(function (response) {
                dispatch(actionCreator(SettingActionTypes.get_HookConfig.SUCCESS, response));
            })
            .catch(function (error) {
                dispatch(actionCreator(SettingActionTypes.get_HookConfig.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error occured while fetching hook config action list",
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
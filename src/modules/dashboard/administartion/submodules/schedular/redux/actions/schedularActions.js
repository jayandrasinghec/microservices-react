import React from 'react';

import {
    actionCreator,
    checkHttpStatus,
    jsonApiHeader,
    SchedularActionTypes,
    GET_TASK_LIST_API
} from '../constants/index';
import { reset } from "redux-form";
import { enqueueSnackbarAction, closeSnackbarAction } from "../../../MultiFactorAuth/actions/snackbarActions";
import { jsonApiHeaderWithTenant } from '../../../../../../../shared/utility';
import { callApi } from '../../../../../../../utils/api';
import { getAuthToken } from '../../../../../../../utils/auth';


export const GetTaskListAction = (body) => {
    var  token = getAuthToken();
    return (dispatch, getState) => {
            dispatch(actionCreator(SchedularActionTypes.get_Task_List.REQUEST));
            callApi(GET_TASK_LIST_API, 'POST', body , token)
            .then(response => {
             console.log('getlist  :',response);
              dispatch(actionCreator(SchedularActionTypes.get_Task_List.SUCCESS, response));
            })
            .catch(function (error) {
                dispatch(actionCreator(SchedularActionTypes.get_Task_List.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error occured while fetching totp config",
                }))
            });
    };
};
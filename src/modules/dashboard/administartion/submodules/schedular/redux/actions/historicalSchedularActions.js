import React from 'react';

import {
    actionCreator,
    SchedularActionTypes,
    GET_TASK_EXECUTION_LIST_API
} from '../constants';
import { enqueueSnackbarAction } from "../../../MultiFactorAuth/actions/snackbarActions";
import { callApi } from '../../../../../../../utils/api';
import { getAuthToken } from '../../../../../../../utils/auth';


export const GetExecutionTaskListAction = (body) => {
    var  token = getAuthToken();
    return (dispatch, getState) => {
            dispatch(actionCreator(SchedularActionTypes.get_Task_Execution_List.REQUEST));
            callApi(GET_TASK_EXECUTION_LIST_API, 'POST', body , token)
            .then(response => {
             console.log('getlist  :',response);
              dispatch(actionCreator(SchedularActionTypes.get_Task_Execution_List.SUCCESS, response));
            })
            .catch(function (error) {
                dispatch(actionCreator(SchedularActionTypes.get_Task_Execution_List.FAILURE));
                dispatch(enqueueSnackbarAction({
                    message: "Error occured while fetching Historical List",
                }))
            });
    };
};
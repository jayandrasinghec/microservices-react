import {
    actionCreator,
    checkHttpStatus,
    createRequestActionTypes,
    jsonApiHeader,
} from '../../../../../../../shared/utility';

export {
    jsonApiHeader,
    actionCreator,
    checkHttpStatus
};

export const GET_TASK_LIST_API = `/igschedular/task/list`;
export const GET_TASK_EXECUTION_LIST_API = `/igschedular/task/execution/list`;


export const SchedularActionTypes = {
    get_Task_List : createRequestActionTypes("GET_TASK_LIST") ,
    get_Task_Execution_List : createRequestActionTypes("GET_TASK_EXECUTION_LIST_API")
   
};
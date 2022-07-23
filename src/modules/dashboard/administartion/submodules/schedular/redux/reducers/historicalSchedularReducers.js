import { SchedularActionTypes } from '../constants/index';

const initialState = {
    loading: false,
    taskLists: [],
    
};

export default (state = initialState, { type , payload }) => {
    switch (type) {
        case SchedularActionTypes.get_Task_Execution_List.REQUEST:
            return {
                ...state,
                loading: true
            };
        case SchedularActionTypes.get_Task_Execution_List.SUCCESS:
            console.log('SchedularActionTypes.get_Task_Execution_List.SUCCESS payload ',payload.data.content);
            return {
                ...state,
                loading: false,
                taskLists: payload.data.content
            };
        case SchedularActionTypes.get_Task_Execution_List.FAILURE:
            return {
                ...state,
                loading: false
            };
        default:
            return state;
    }
};

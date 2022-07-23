import * as ActionTypes from './ActionTypes';

export const user = (state = { errMess: null, user:[]}, action) => {
  switch (action.type) {
    case ActionTypes.ADD_USER:
      return {...state, errMess: null, comments: action.payload};

    case ActionTypes.LIST_USER:
    return {...state, errMess: null, user: action.payload};
    default:
      return state;
  }
};
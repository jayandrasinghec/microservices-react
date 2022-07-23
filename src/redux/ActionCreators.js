import * as ActionTypes from './ActionTypes'
// import { baseUrl } from '../config/baseUrl'
import { callApi } from '../utils/api'

export const postUser = (name) => (dispatch) => {
  const newUser = {
    name: name,
  };
  newUser.date = new Date().toISOString();

  callApi('/user/createUser')
    .then(response =>
      setTimeout(() => {
        dispatch(addUser(response));
      }, 2000)
    )
    .catch(error => { alert('New User could not be added\nError: ' + error.message); });
};


export const addUser = (comment) => ({
  type: ActionTypes.ADD_USER,
  payload: comment
});


export const listUser = (sort) => (dispatch) => {
  // const User = {
  //   sort:sort
  // };

  return callApi('/user/list')
    .then(response =>
      setTimeout(() => {
        dispatch(fetchUser(response));
      }, 2000)
    )
    .catch(error => { alert('List could not be fetched\nError: ' + error.message); });
};


export const fetchUser = (user) => ({
  type: ActionTypes.LIST_USER,
  payload: user
});


export const registerUser = newUser => dispatch => {
  const User = newUser;
  //callApi('/signUp',POST,User)
  alert(JSON.stringify(User))
}
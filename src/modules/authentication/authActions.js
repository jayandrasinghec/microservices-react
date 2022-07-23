export const LOGIN = 'LOGIN'
export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN'
export const SET_REFRESH_TOKEN = 'SET_REFRESH_TOKEN'
export const LOGOUT = 'LOGOUT'


export const setUser = (user) => {
  return {
    type: LOGIN,
    user
  };
};

export const logout = () => ({ type: LOGOUT })

export const setAuthToken = token => ({ type: SET_AUTH_TOKEN, token })
export const setRefreshToken = token => ({ type: SET_REFRESH_TOKEN, token })
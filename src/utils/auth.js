import { getCurrentUserFromState, getAuthTokenFromState, getRefreshTokenFromState } from "../modules/authentication/authReducer";
import { store } from '../index'


export const isActiveForRoles = (roles) => {
  const user = getCurrentUser()

  for (var i = 0; i <= roles.length; i++) {
    if (user.roles.indexOf(roles[i]) >= 0) {
      return true;
    }
  }

  return false;
}


export const getRefreshToken = () => getRefreshTokenFromState(store.getState())
export const getAuthToken = () => getAuthTokenFromState(store.getState())
export const getCurrentUser = () => getCurrentUserFromState(store.getState())
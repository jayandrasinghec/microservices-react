import { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR } from './snackbarActions';
import { LOGOUT } from '../../../../../../redux/ActionTypes';

const defaultState = {
  notifications: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case ENQUEUE_SNACKBAR:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            key: action.key,
            ...action.notification,
          },
        ],
      };

    case LOGOUT:
      return {
        ...defaultState
      }

    case CLOSE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.map(notification => (
          (action.dismissAll || notification.key === action.key)
            ? { ...notification, dismissed: true }
            : { ...notification }
        )),
      };

    case REMOVE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.key !== action.key,
        ),
      };

    default:
      return state;
  }
};

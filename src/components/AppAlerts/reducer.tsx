import * as _ from 'underscore'

import * as Actions from './actions'
import { IReduxState } from '../../redux/reducers'
// import { IReduxState } from 'src/reducers'
// import { IArticle } from 'src/utils/interfaces'


export interface IAlertStates {
  notifications: {
    id: string
    kind: 'error' | 'success'
    messageId: string
  }[]
}


// Initial State
const initialState: IAlertStates = {
  notifications: []
}


export default (state = initialState, action: any): IAlertStates => {
  switch (action.type) {
    case Actions.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, {
          kind: action.kind,
          messageId: action.messageId,
          id: action.id
        }]
      }

    case Actions.REMOVE_NOTIFICATION: {
      const newNotifications = state.notifications
        .filter(n => n.id !== action.id)

      return {
        ...state,
        notifications: [...newNotifications]
      }
    }


    default: return state
  }
}


/* Selectors */
export const getNotifications = (state: IReduxState) => state.alerts.notifications || []

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION'
export const addNotification = (messageId: string, kind: 'error' | 'success') => {
  return {
    type: ADD_NOTIFICATION,
    id: Date.now(),
    kind,
    messageId
  }
}


export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'
export const removeNotification = (id: string) => {
  return {
    id,
    type: REMOVE_NOTIFICATION
  }
}
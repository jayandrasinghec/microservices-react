import React from 'react'
import { addNotification } from "../components/AppAlerts/actions"
import { store } from '../index'
import { enqueueSnackbarAction, closeSnackbarAction } from "../modules/dashboard/administartion/submodules/MultiFactorAuth/actions/snackbarActions"
import { Button } from "@material-ui/core"


export const showSuccess = (msg?: string,key?: string) => {
  // store.dispatch(addNotification(code, 'success'))
  store.dispatch(enqueueSnackbarAction({
    message: msg,
    options: {
      key,
      variant: 'success',
      // action: (key: any) => <Button onClick={() => store.dispatch(closeSnackbarAction(key))}>x</Button>
    }
  }))
}


export const showError = (msg?: string,key?: string) => {
  store.dispatch(enqueueSnackbarAction({
    message: msg,
    options: {
      key,
      variant: 'error',
      // action: (key: any) => <Button onClick={() => store.dispatch(closeSnackbarAction(key))}>x</Button>
    }
  }))
}
export const showWarning = (msg?: string,key?: string) => {
  store.dispatch(enqueueSnackbarAction({
    message: msg,
    options: {
      key,
      variant:'warning',
      // action: (key: any) => <Button onClick={() => store.dispatch(closeSnackbarAction(key))}>x</Button>
    }
  }))
}
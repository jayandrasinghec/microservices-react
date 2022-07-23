import { callApi, callMasterApi } from '../utils/api'

type LBody = {
    login: string
    password: string
}

export const login = (body: LBody) => callMasterApi(`/authsrvc/auth/token`, 'POST', body)

// export const loginFlow = (otp: string,token:string) => callApi(`/authsrvc/auth/loginFlow`, 'POST', { otp}, token)

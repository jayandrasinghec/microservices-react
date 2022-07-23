import { callApi, callMasterApi } from '../utils/api'

type IBody = {
  work_email: string
  first_name: string
  last_name: string
  mobile: number
  country: string
  domain: string
  term_condition_id: string
}
type SBody = {
    login: string
    password: string
    confirmPassword: string
}

export const checkDomain = (domain: string) => callApi(`/regsrvc/checkDomain/${domain}`)

export const signUp = (body: IBody) => callMasterApi(`/regsrvc/signUp`, 'POST', body)

export const checkEmail = (tld: string) => callApi(`/regsrvc/checkDomain/${tld}`)

export const downloadTerms = () => callApi(`/regsrvc/getActiveTerms`)

export const verifyToken = (token: string) => callApi(`/regsrvc/confirm-account?token=${token}`, 'GET')

export const completeSignUp = (body: SBody) => callApi(`/regsrvc/completeSignUp`, 'POST', body)

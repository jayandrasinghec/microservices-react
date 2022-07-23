import { callApi } from '../utils/api'

export const downloadCountries = () => callApi(`/utilsrvc/meta/pub/list/country`, 'GET')

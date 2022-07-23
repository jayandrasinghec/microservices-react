import { callApi } from '../utils/api'

export const generateQrCode = () => callApi(`/mfasrvc/totpAuthentication/generateQrCode`, 'POST', )

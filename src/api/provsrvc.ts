import { callApi, callImageApi, callMasterApi } from '../utils/api'
import { Size } from '@material-ui/core'

type ABody = {
  appId: string
  appName: string
}
type MBody = {
  tag: string
  Size: number
  pageNo: number
}

export const downloadData = (id: string) => callApi(`/provsrvc/applicationMaster/getByAppId/${id}`, 'GET')

export const createApp = (body: ABody) => callApi(`/provsrvc/applicationTenant/addApp/appMasterId`, 'POST', body)

export const getCategoryTag = () => callApi(`/provsrvc/applicationMaster/getCategoryTag`)

export const applicationListByPage = (body: MBody) => callApi(`/provsrvc/applicationMaster/applicationListByPage`, 'POST', body)

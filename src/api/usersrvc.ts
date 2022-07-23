import { callApi } from '../utils/api'

type GBody = {
    name: string
    type: string
    description: string
}
type UBody = {
    email: string
    firstName: string
    lastName: string
    login: string
    userType: string
    countryCode: number
    department: string
    designation: string
    startDate: Date
    lastDate: Date
    dateOfBirth: Date 
    mobile: number
    landline: string
    address1: string
    address2: string
    associatedPartner: string
    country: string
    city: string
    employeeId: string
}

export const createGroup = (body: GBody) => callApi(`/usersrvc/api/group/`, 'POST', body)

export const createUser = (body: UBody) => callApi(`/usersrvc/api/user/`, 'POST', body)
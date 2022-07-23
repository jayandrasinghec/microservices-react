import {
    actionCreator,
    checkHttpStatus,
    createRequestActionTypes,
    jsonApiHeader,
} from '../../../../../../shared/utility';

export {
    jsonApiHeader,
    actionCreator,
    checkHttpStatus
};

export const GET_ORGANIZATION_UNIT_MOCK_API = `./__mocks/organization.json`;


export const OrganizationUnitActionTypes = {
    get_Organization_Unit : createRequestActionTypes("GET_ORGANIZATION_UNIT") ,
    set_Organization_Unit : createRequestActionTypes("SET_ORGANIZATION_UNIT") ,
   
};
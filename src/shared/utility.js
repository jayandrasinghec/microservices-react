import { getTenant } from '../utils/api';
import { getAuthToken } from '../utils/auth'
export const API_URL = "";

const REQUEST = "REQUEST";
const SUCCESS = "SUCCESS";
const FAILURE = "FAILURE";

export const PositiveIntegerRegex = /^[1-9]\d*$/;


export function actionCreator(actionType, data) {
    return {
        type: actionType,
        payload: data
    };
}

export function createRequestActionTypes(base) {
    return [REQUEST, SUCCESS, FAILURE].reduce((requestTypes, type) => {
        requestTypes[type] = `${base}_${type}`;
        return requestTypes;
    }, {});
}

export function checkHttpStatus(response) {
    if (response.status >= 200 && response.status < 204) {
        return response.json();
    } else if (response.status === 204) {
        return true;
    } else if (response.status >= 400 && response.status < 500) {
        return response.json();
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

export const jsonApiHeader = (username, contentType) => {
    const token = getAuthToken()
    return {
        'Accept': 'application/json',
        'content-type': contentType ? 'application/json' : '',
        Authorization: `Bearer ${token}`,
        // tenant: 'unotech',
        // User: username
    };
};

export const jsonApiHeaderWithTenant = (username, contentType) =>{
    const token = getAuthToken();
    const tenant = getTenant();
    return {
        'Accept': 'application/json',
        'content-type': contentType ? 'application/json' : '',
        Authorization: `Bearer ${token}`,
        tenant: tenant,
        // User: username
    };
}
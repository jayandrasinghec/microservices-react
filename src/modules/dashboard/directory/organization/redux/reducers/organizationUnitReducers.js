import { OrganizationUnitActionTypes } from '../constants/index';

const initialState = {
    loading: false,
    orgUnits: [],
    filterOrgUnits: [],
    
};

export default (state = initialState, { type , payload }) => {
    switch (type) {
        case OrganizationUnitActionTypes.get_Organization_Unit.REQUEST:
            return {
                ...state,
                loading: true
            };
        case OrganizationUnitActionTypes.get_Organization_Unit.SUCCESS:
           // console.log('OrganizationUnitActionTypes.get_Organization_Unit.SUCCESS payload ',payload);
            return {
                ...state,
                loading: false,
                orgUnits: payload.orgUnits,
                filterOrgUnits: payload.filterData
            };
        case OrganizationUnitActionTypes.get_Organization_Unit.FAILURE:
            return {
                ...state,
                loading: false
            };
        case OrganizationUnitActionTypes.set_Organization_Unit.REQUEST:
            return {
                ...state,
                loading: false
            }
        case OrganizationUnitActionTypes.set_Organization_Unit.SUCCESS:
           return {
                ...state,
                loading: false,
                orgUnits: payload,
                //filterOrgUnits: payload.filterData
            };
        default:
            return state;
    }
};

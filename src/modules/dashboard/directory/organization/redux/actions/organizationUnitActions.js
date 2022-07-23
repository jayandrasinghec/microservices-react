import React from 'react';
import {
    actionCreator,
    OrganizationUnitActionTypes,
    GET_ORGANIZATION_UNIT_MOCK_API
} from '../constants';
import { enqueueSnackbarAction } from "../../../../administartion/submodules/MultiFactorAuth/actions/snackbarActions";
import { callApi } from '../../../../../../utils/api';
import { getAuthToken } from '../../../../../../utils/auth';

let _ = require('lodash');
const data = require('../../__mocks/organization.json');

const contains = (name, term) => {
    return name.toLowerCase().indexOf(term.toLowerCase()) >= 0;
  };

const search = (items, value) => {
    return items.reduce((acc, item) => {
      if (contains(item.name, value)) {
        acc.push(item);
      } else if (item.children && item.children.length > 0) {
        let newItems = search(item.children, value);
        if (newItems && newItems.length > 0) {
          acc.push({
            id : item.id,
            name: item.name,
            children: newItems,
          });
        }
      }
      return acc;
    }, []);
  };

export const GetOrganizationUnitAction = () => {
    var  token = getAuthToken();
    return (dispatch, getState) => {
            dispatch(actionCreator(OrganizationUnitActionTypes.get_Organization_Unit.REQUEST));
            // callApi(GET_ORGANIZATION_UNIT_MOCK_API, 'GET', token)
            // .then(response => {
            //  console.log('getlist  :',response);
            //  dispatch(actionCreator(OrganizationUnitActionTypes.get_Organization_Unit.SUCCESS, response));
            dispatch(actionCreator(OrganizationUnitActionTypes.get_Organization_Unit.SUCCESS, {orgUnits : data.data, filterData : data.data}));
            // })
            // .catch(function (error) {
            //     dispatch(actionCreator(OrganizationUnitActionTypes.get_Organization_Unit.FAILURE));
            //     dispatch(enqueueSnackbarAction({
            //         message: "Error occured while fetching Organization Unit",
            //     }))
            // });
    };
};


export const GetFilterOrganizationUnitAction = (orgUnits, term) => {
    var  token = getAuthToken();
    return (dispatch, getState) => {
            dispatch(actionCreator(OrganizationUnitActionTypes.get_Organization_Unit.REQUEST));
            // callApi(GET_ORGANIZATION_UNIT_MOCK_API, 'GET', token)
            // .then(response => {
            //  console.log('getlist  :',response);
            //  dispatch(actionCreator(OrganizationUnitActionTypes.get_Organization_Unit.SUCCESS, response));
            // NOTE : later replace mock data with api response.
          // console.log('GET_ORGANIZATION_UNIT_MOCK_API', getState().organizationUnitReducer.orgUnits);
            const dataCopy = _.cloneDeep(orgUnits);
            const newData = search(dataCopy.children, term);
            dataCopy.children = [...newData];
            dispatch(actionCreator(OrganizationUnitActionTypes.get_Organization_Unit.SUCCESS, {orgUnits : orgUnits, filterData : dataCopy}));
            // })
            // .catch(function (error) {
            //     dispatch(actionCreator(OrganizationUnitActionTypes.get_Organization_Unit.FAILURE));
            //     dispatch(enqueueSnackbarAction({
            //         message: "Error occured while fetching Organization Unit",
            //     }))
            // });
    };
};

export const setOrganizationUnitAction = ( newData) => {
 //var  token = getAuthToken();
  return (dispatch, getState) => {
          dispatch(actionCreator(OrganizationUnitActionTypes.set_Organization_Unit.REQUEST));
          // callApi(GET_ORGANIZATION_UNIT_MOCK_API, 'GET', token)
          // .then(response => {
          //  console.log('getlist  :',response);
          //  dispatch(actionCreator(OrganizationUnitActionTypes.get_Organization_Unit.SUCCESS, response));
          // NOTE : later replace mock data with api response.
          // const dataCopy = _.cloneDeep(data.data);
          // const newData = search(dataCopy.children, term);
          // dataCopy.children = [...newData];
          // console.log('setOrganizationUnitAction', newData);
          dispatch(actionCreator(OrganizationUnitActionTypes.set_Organization_Unit.SUCCESS, newData));
          // })
          // .catch(function (error) {
          //     dispatch(actionCreator(OrganizationUnitActionTypes.get_Organization_Unit.FAILURE));
          //     dispatch(enqueueSnackbarAction({
          //         message: "Error occured while fetching Organization Unit",
          //     }))
          // });
  };

  
};
export const deleteOrganizationUnitAction = ( newData) => {
  //var  token = getAuthToken();
   return (dispatch, getState) => {
           dispatch(actionCreator(OrganizationUnitActionTypes.set_Organization_Unit.REQUEST));
           // callApi(GET_ORGANIZATION_UNIT_MOCK_API, 'GET', token)
           // .then(response => {
           //  console.log('getlist  :',response);
           //  dispatch(actionCreator(OrganizationUnitActionTypes.get_Organization_Unit.SUCCESS, response));
           // NOTE : later replace mock data with api response.
           // const dataCopy = _.cloneDeep(data.data);
           // const newData = search(dataCopy.children, term);
           // dataCopy.children = [...newData];
           // console.log('setOrganizationUnitAction', newData);
           dispatch(actionCreator(OrganizationUnitActionTypes.set_Organization_Unit.SUCCESS, newData));
           // })
           // .catch(function (error) {
           //     dispatch(actionCreator(OrganizationUnitActionTypes.get_Organization_Unit.FAILURE));
           //     dispatch(enqueueSnackbarAction({
           //         message: "Error occured while fetching Organization Unit",
           //     }))
           // });
   };
  };


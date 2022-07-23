import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { user } from './user';
import alerts, { IAlertStates } from '../components/AppAlerts/reducer';
import administrationmfaReducer from '../modules/dashboard/administartion/submodules/MultiFactorAuth/reducers/administrationmfaReducers';
import adminRuleReducer from '../modules/dashboard/administartion/submodules/Rules/reducers/administrationRuleReducers';
import campaignReducer from '../modules/dashboard/governance/reducer/CampaignReducer';
import settingReducer from '../modules/dashboard/settings/reducers/settingReducers';
import snackbarReducer from '../modules/dashboard/administartion/submodules/MultiFactorAuth/actions/snackbarReducer';
import authReducer from '../modules/authentication/authReducer';
import  schedularReducer from '../modules/dashboard/administartion/submodules/schedular/redux/reducers/schedularReducers';
import  historicalSchedularReducer from '../modules/dashboard/administartion/submodules/schedular/redux/reducers/historicalSchedularReducers';
import  organizationUnitReducer from '../modules/dashboard/directory/organization/redux/reducers/organizationUnitReducers';

export interface IReduxState {
  alerts: IAlertStates
  auth: any
  user: any
  administrationmfaReducer: any
  adminRuleReducer: any
  settingReducer: any,
  snackbarReducer: any,
  campaignReducer: any,
  schedularReducer:any,
  historicalSchedularReducer : any,
  organizationUnitReducer : any
}


export default combineReducers({
  form : formReducer,
  user,
  auth: authReducer,
  alerts,
  administrationmfaReducer,
  adminRuleReducer,
  settingReducer,
  snackbarReducer,
  campaignReducer,
  schedularReducer,
  historicalSchedularReducer,
  organizationUnitReducer
})
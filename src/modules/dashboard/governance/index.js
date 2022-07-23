import React from 'react'
import { Switch, Route, Redirect } from "react-router-dom";

import Header from './components/Header';
import GovernanceCampaign from '../governance/submodules/Campaign/Campaign';
import CampaignDetails from '../governance/submodules/Campaign/CampaignDetails';
import CampaignCreate from '../governance/submodules/Campaign/stepper2';
import CampaignEdit from '../governance/submodules/Campaign/editStepper';
import CampaignHistory from '../governance/submodules/Campaign/CampaignHistory';
import CampaignHistoryDetails from '../governance/submodules/Campaign/CampaignHistoryDetails';

import { makeStyles } from '@material-ui/core/styles';
import { isActiveForRoles } from '../../../utils/auth';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: 15
  }
}))


export default function GovernanceModule(props) {
  const classes = useStyles()
  return (
    <div id="dash-admin" className={classes.container}>
      <Header profile={props.profile} />
      <Switch>
        {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']) && <Route exact={true} path="/dash/governance/campaign" component={GovernanceCampaign} /> }
        {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']) && <Route exact={true} path="/dash/governance/campaign/details/:id" component={CampaignDetails} /> }
        {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']) && <Route path="/dash/governance/campaign/create" component={CampaignCreate} /> }
        {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']) && <Route path="/dash/governance/campaign/edit/:id" component={CampaignEdit} /> }
        {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']) && <Route exact={true} path="/dash/governance/history" component={CampaignHistory} /> }
        {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']) && <Route exact={true} path="/dash/governance/history/details/:id" component={CampaignHistoryDetails} /> }
        {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']) &&  <Redirect to="/dash/governance/campaign" /> }
      </Switch>
    </div>
  )
}
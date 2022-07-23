import React from 'react'
import { Switch, Route, Redirect } from "react-router-dom"
import ReportList from './ReportList';
import AuditLogReport from './AuditLogReport/index.jsx';
import UserApplicationSampleReport from './UserApplicationReport';
import TestReport from './TestReport';
import CymmetriUsage from './CymmetriUsage';
import CymmetriUsers from './CymmetriUsers';
import MFAUsage from './MFAUsage';
import ApplicationUsage from './ApplicationUsage';
import Provisioning from './Provisioning';
import DomainAdminAccess from './DomainAdminAccess';
import UsersWithoutManagers from './UsersWithoutManagers';
import TerminatedEmployees from './TerminatedEmployees';
import TerminatedContractors from './TerminatedContractors';
import TerminatedUsers from './TerminatedUsers';
import SunsetDate from './SunsetDate';
import ContractorsEndDate from './ContractorsEndDate';
import EmployeesEndDate from './EmployeesEndDate';
import RecentHires from './RecentHires';


export default function ReportModule (props) {
  return (
    <div id="dash-report" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: 15 }}>
      <Switch>
        <Route exact={true} path="/dash/report" component={p => <ReportList {...p} profile={props.profile} />} />
        <Route path="/dash/report/audit" component={p => <AuditLogReport {...p} profile={props.profile} />} />
        <Route path="/dash/report/gc-041A-report" component={p => <UserApplicationSampleReport {...p} profile={props.profile} />} />
        <Route path="/dash/report/testReport" component={p => <TestReport {...p} profile={props.profile} />} />
        <Route path="/dash/report/cymmetriUsage" component={p => <CymmetriUsage {...p} profile={props.profile} />} />
        <Route path="/dash/report/cymmetriUsers" component={p => <CymmetriUsers {...p} profile={props.profile} />} />
        <Route path="/dash/report/mfaUsage" component={p => <MFAUsage {...p} profile={props.profile} />} />
        <Route path="/dash/report/applicationUsage" component={p => <ApplicationUsage {...p} profile={props.profile} />} />
        <Route path="/dash/report/provisioning" component={p => <Provisioning {...p} profile={props.profile} />} />
        <Route path="/dash/report/DomainAdminAccess" component={p => <DomainAdminAccess {...p} profile={props.profile} />} />
        <Route path="/dash/report/usersWithoutManagers" component={p => <UsersWithoutManagers {...p} profile={props.profile} />} />
        <Route path="/dash/report/terminatedEmployees" component={p => <TerminatedEmployees {...p} profile={props.profile} />} />
        <Route path="/dash/report/terminatedContractors" component={p => <TerminatedContractors {...p} profile={props.profile} />} />
        <Route path="/dash/report/sunsetDate" component={p => <SunsetDate {...p} profile={props.profile} />} />
        <Route path="/dash/report/terminatedUsers" component={p => <TerminatedUsers {...p} profile={props.profile} />} />
        <Route path="/dash/report/contractorsEndDate" component={p => <ContractorsEndDate {...p} profile={props.profile} />} />
        <Route path="/dash/report/employeesEndDate" component={p => <EmployeesEndDate {...p} profile={props.profile} />} />
        <Route path="/dash/report/recentHires" component={p => <RecentHires {...p} profile={props.profile} />} />
        <Redirect to="/dash/report" />
      </Switch>
    </div>
  )
}
import React from 'react';
import Grid from '@material-ui/core/Grid'

import '../../../../FrontendDesigns/new/assets/css/main.css'
import '../../../../FrontendDesigns/new/assets/css/users.css'


export default function FilterStatuses(props) {

  const { setFilters, query } = props
  const status = query.filters.status || []

  const toggle = (s) => {
    const statuses = query.filters.status || []

    const newStatus1 = [...statuses, s]
    const newStatus2 = statuses.filter(s2 => s2 !== s)

    if (statuses.indexOf(s) >= 0) setFilters({ status: newStatus2 })
    else setFilters({ status: newStatus1 })
  }

  return (
    <Grid container>
      <label className="ttl-view">Account Status</label>
        <div className="row mt-2">
          <div className="col-12 col-sm-12 col-md-12 pr-0">
            <div className="custom-checkbox">
              <input type="checkbox" name="user" id="fitlerActive" checked={status.indexOf('ACTIVE') >= 0} onChange={() => toggle('ACTIVE')} defaultChecked /> <label htmlFor="fitlerActive">Active</label>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 pr-0">
            <div className="custom-checkbox">
              <input type="checkbox" name="user" id="fitlerlock" checked={status.indexOf('INACTIVE') >= 0} onChange={() => toggle('INACTIVE')} defaultChecked /> <label htmlFor="fitlerlock">Inactive</label>
            </div>
          </div>
          {/* <div className="col-12 col-sm-12 col-md-12 pr-0">
            <div className="custom-checkbox">
              <input type="checkbox" name="user" id="fitlerInactive" checked={status.indexOf('DELETE') >= 0} onChange={() => toggle('DELETE')} defaultChecked  /> <label htmlFor="fitlerInactive">Delete</label>
            </div>
          </div> */}
          {/* <div className="col-12 col-sm-6 col-md-6 pr-0">
            <div className="custom-checkbox">
              <input type="checkbox" name="user" id="fitlerPwdReset" checked={status.indexOf('INITIAL_PASS_CHANGED') >= 0} onChange={() => toggle('INITIAL_PASS_CHANGED')} defaultChecked  /> <label htmlFor="fitlerPwdReset">Password Reset</label>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-6 pr-0">
            <div className="custom-checkbox">
              <input type="checkbox" name="user" id="fitlerDeactive" checked={status.indexOf('TERMINATED') >= 0} onChange={() => toggle('TERMINATED')} defaultChecked  /> <label htmlFor="fitlerDeactive">Deactivate</label>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-6 pr-0">
            <div className="custom-checkbox">
              <input type="checkbox" name="user" id="fitlerSunspend" checked={status.indexOf('DEACTIVATED') >= 0} onChange={() => toggle('DEACTIVATED')} defaultChecked  /> <label htmlFor="fitlerSunspend">Suspended</label>
            </div>
          </div> */}
        </div>
    </Grid>
  );
}

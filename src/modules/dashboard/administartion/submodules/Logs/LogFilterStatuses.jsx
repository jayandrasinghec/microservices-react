import React from 'react';
import Grid from '@material-ui/core/Grid'

import '../../../../../FrontendDesigns/new/assets/css/main.css'
import '../../../../../FrontendDesigns/new/assets/css/users.css'


export default function LogFilterStatuses(props) {

  const { setFilters, query } = props
  const result = query.filter.result || ''

  // const toggle = (s) => {
  //   const statuses = query.filter.result || []

  //   const newStatus1 = [...statuses, s]
  //   const newStatus2 = statuses.filter(s2 => s2 !== s)

  //   if (statuses.indexOf(s) >= 0) setFilters({ result: newStatus2 })
  //   else setFilters({ result: newStatus1 })
  // }

  const handleChange = (e) => {
    setFilters({result : e})
  }

  return (
    <Grid container>
      <label className="ttl-view">Status</label>
        <div className="row mt-2">
          <div className="col-12 col-sm-12 col-md-12 pr-0">
            <div className="custom-checkbox">
              {/* <input type="checkbox" name="user" id="fitlerSuccess" checked={status.indexOf('SUCCESS') >= 0} onChange={() => toggle('SUCCESS')} defaultChecked /> */}
              <input type="checkbox" name="user" id="fitlerSuccess" checked={result === 'SUCCESS'} onChange={() => handleChange('SUCCESS')} defaultChecked /> 
              <label htmlFor="fitlerSuccess">Success</label>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 pr-0">
            <div className="custom-checkbox">
              {/* <input type="checkbox" name="user" id="fitlerFail" checked={status.indexOf('FAIL') >= 0} onChange={() => toggle('FAIL')} defaultChecked />  */}
              <input type="checkbox" name="user" id="fitlerFail" checked={result === 'FAIL'} onChange={() => handleChange('FAIL')} defaultChecked /> 
              <label htmlFor="fitlerFail">Failure</label>
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-12 pr-0">
            <div className="custom-checkbox">
              {/* <input type="checkbox" name="user" id="fitlerFail" checked={status.indexOf('FAIL') >= 0} onChange={() => toggle('FAIL')} defaultChecked />  */}
              <input type="checkbox" name="user" id="fitlerAll" checked={result === ''} onChange={() => handleChange('')} defaultChecked /> 
              <label htmlFor="fitlerAll">All</label>
            </div>
          </div>
        </div>
    </Grid>
  );
}

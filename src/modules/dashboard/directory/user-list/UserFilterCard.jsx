import React from 'react'

import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

import { callApi } from '../../../../utils/api'
import FilterStatuses from './FilterStatuses'
import AppSelectInput from '../../../../components/form/AppSelectInput'
import AppCheckbox from '../../../../components/form/AppCheckbox'
import { Button } from '@material-ui/core'

import '../../../../FrontendDesigns/new/assets/css/main.css'
import '../../../../FrontendDesigns/new/assets/css/users.css'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  appselectip: { 
    marginTop: -5 , 
  },
}))

export default function RecipeReviewCard(props) {
  const { setQuery, query, defaultQuery } = props
  const [department, setDepartment] = React.useState([])
  const [designation, setDesignation] = React.useState([])
  const [country, setCountry] = React.useState([])
  const classes = useStyles()
  const setFilters = (e) => setQuery({ ...query, filters: { ...query.filters, ...e } })


  const downloadData = () => {
    callApi(`/utilsrvc/meta/list/department`, 'GET')
      .then(e => {
        if (e.success) {
          setDepartment(e.data ? e.data : [])
        }
      })
    callApi(`/utilsrvc/meta/list/designation`, 'GET')
      .then(e => {
        if (e.success) {
          setDesignation(e.data ? e.data : [])
        }
      })
    callApi(`/utilsrvc/meta/list/country`, 'GET')
      .then(e => {
        if (e.success) {
          setCountry(e.data ? e.data : [])
        }
      })
  }

  React.useEffect(() => downloadData(), [])

  // const toggle = (s) => {
  //   const statuses = query.filters.status || []

  //   const newStatus1 = [...statuses, s]
  //   const newStatus2 = statuses.filter(s2 => s2 !== s)

  //   if (statuses.indexOf(s) >= 0) setFilters({ status: newStatus2 })
  //   else setFilters({ status: newStatus1 })
  // }

  return (
    <div className="user-filter-list" >
    <div className="container-fluid">
      <div className="row">
        <div className="col-6 col-sm-6 col-md-5 col-lg-2 filter-labels">
          <FilterStatuses query={query} setFilters={setFilters} />
        </div>
        <div className="col-6 col-sm-6 col-md-7 col-lg-2 filter-labels">
          <AppCheckbox
            value={query.filters.locked} onChange={e => setFilters({ locked: Boolean(e) })}
            switchLabel={query.filters.locked ? 'Locked' : 'Unlocked'}
            label="User Status" />
        </div>
        <div className="col-12 col-sm-12 col-md-12 col-lg-8">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-5 sort-filter">

              <label className="ttl-view">Location</label>
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12">
                  <AppSelectInput
                    className={classes.appselectip}
                    label=""
                    value={query.filters.location}
                    options={country.map(c => c.name)}
                    onChange={e => setFilters({ location: e.target.value })}/>
                </div>
              </div>

              <label className="ttl-view">Designation</label>
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12">
                  <AppSelectInput
                    className={classes.appselectip}
                    label=""
                    value={query.filters.designation}
                    options={designation.map(c => c.name)}
                    onChange={e => setFilters({ designation: e.target.value })} />
                </div>
              </div>

            </div>
            <div className="col-12 col-sm-12 col-md-7 sort-filter">

              <label className="ttl-view">Department</label>
              <div className="row">
                <div className="col-9 col-sm-9 col-md-8">
                  <AppSelectInput
                    className={classes.appselectip}
                    label=""
                    value={query.filters.department}
                    options={department.map(c => c.name)}
                    onChange={e => setFilters({ department: e.target.value })} />
                </div>
                <div className="d-inline-block">
                  <div className="user-sort-filter d-inline-block">
                    <ToggleButtonGroup
                      size="small"
                      value={query.direction} exclusive
                      onChange={(e, v) => {
                        setQuery({ direction: v })
                      }}>
                      <ToggleButton value="ASC" className="column-view active d-inline-block">
                        <img src="assets/img/icons/up-sort.svg" alt="" title="" />
                      </ToggleButton>
                      <ToggleButton value="DESC" className="row-view d-inline-block">
                        <img src="assets/img/icons/down-sort.svg" alt="" title="" />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                </div>
              </div>

              <label className="ttl-view">SORTY BY</label>
              <div className="row">
                <div className="col-8 col-sm-8 col-md-8">
                  <AppSelectInput
                    className={classes.appselectip}
                    label=""
                    value={query.sort}
                    options={['FIRST_NAME', 'EMAIL']}
                    onChange={e => setQuery({ sort: e.target.value })} />
                </div>
                <div className="text-right pt-1">
                  <Button onClick={() => setQuery(defaultQuery)}>Reset</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

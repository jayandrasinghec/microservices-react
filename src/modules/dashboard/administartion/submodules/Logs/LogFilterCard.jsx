import React from 'react'
import { callApi } from '../../../../../utils/api'
import LogFilterStatuses from './LogFilterStatuses'
import AppSelectInput from '../../../../../components/form/AppSelectInput'
import AppDateInput from '../../../../../components/form/AppDateInput'
// import AutocompleteField from './AutocompleteField'
import { Button } from '@material-ui/core'
import '../../../../../FrontendDesigns/new/assets/css/main.css'
import '../../../../../FrontendDesigns/new/assets/css/users.css'
import { AsyncAutoComplete } from '../../components/AsyncAutocomplete'


let userFilters = {
  direction: "ASC",
  pageNumber: 0,
  pageSize: 30,
  keyword: "",
  sort: "FIRST_NAME"
}

let groupFilters = {
  direction: "ASC",
  keyword: "",
  pageNumber: 0,
  pageSize: 30,
  sort: "GROUP_NAME"
}

let appFilters = {
  displayName: "",
  order: "asc",
  pageNo: 0,
  size: 30,
  sortBy: "displayName",
  tag: ""
}

export default function LogFilterCard(props) {
  const { setQuery, query, defaultQuery, downloadlogs, saving } = props
  const setFilters = (e) => setQuery({ ...query, filter: { ...query.filter, ...e } })
  const [isCall, setIsCall] = React.useState(false)
  const [keyword, setKeyword] = React.useState({
    actor: '',
    action: '',
    target: ''
  })

  // const [actionOptions, setActionOptions] = React.useState([])

  const downloadActions = (value, success, error) => {
    callApi(`/utilsrvc/auditAction/list`, 'GET')
      .then(e => {
        if (e.success) {
          e.data && success(e.data)
        }
      })
  }


  const download = (value, success, error, source) => {
    if (source === 'USER') {
      callApi(`/usersrvc/api/user/list`, 'POST', { ...userFilters, keyword: value })
        .then(e => {
          if (e.success) {
            let arr = []
            e.data && (e.data.elements).map(data => {
              let obj = {}
              obj['id'] = data.login
              obj['label'] = data.displayName
              arr.push(obj)
            })
            success(e.data ? arr : [])
          }
        })
    }

    if (source === 'GROUP') {
      callApi(`/usersrvc/api/group/list`, 'POST', { ...groupFilters, keyword: value })
        .then(e => {
          if (e.success) {
            let arr = []
            e.data && (e.data.elements).map(data => {
              let obj = {}
              obj['id'] = data.id
              obj['label'] = data.name
              arr.push(obj)
            })
            success(e.data ? arr : [])
          }
        })
    }

    if (source === 'APPLICATION') {
      callApi(`/provsrvc/applicationTenant/applicationListByPage`, 'POST', { ...appFilters, keyword: value })
        .then(e => {
          if (e.success) {
            let arr = []
            e.data && (e.data.content).map(data => {
              let obj = {}
              obj['id'] = data.id
              obj['label'] = data.appName
              arr.push(obj)
            })
            success(e.data ? arr : [])
          }
        })
    }
  }


  // React.useEffect(() => downloadActions(), [])

  return (
    <div className="user-filter-list" >
      <div className="container-fluid">
        <div className="row">
          <div className="col-6 col-sm-6 col-md-5 col-lg-2 filter-labels">
            <LogFilterStatuses query={query} setFilters={setFilters} />
          </div>
          <div className="col-12 col-md-12 col-lg-10">
            <div className="row">
              <div className="col-6 col-md-4">
                {/* <AutocompleteField
                label="Actor"
                setFilters={setFilters}
                query={query}
                source={'USER'}
                filterKey="requestorId"
              /> */}
                <AsyncAutoComplete
                  label="Actor"
                  name='actor'
                  inputText={keyword.actor}
                  keyword={keyword}
                  setKeyword={setKeyword}
                  api={(value, success, error) => {
                    download(value, success, error, 'USER')
                  }}
                  getOptionLabel={(option, allOptions) => {
                    if (typeof option === "object") {
                      return option.label;
                    } else {
                      let found = allOptions.find(op => op.id === option);
                      if (found) {
                        return found.label
                      }
                      return "";
                    }
                  }}
                  value={query.filter.requestorId}
                  onLoadApiCall
                  onChange={(event, newValue, reason) => {
                    if (newValue && newValue.id) {
                      setKeyword({...keyword, actor: newValue.label})
                      setFilters({ ["requestorId"]: newValue.id })
                    } else {
                      if(reason === 'clear') {
                        setKeyword({...keyword, actor: ''})
                      }
                      setFilters({ ["requestorId"]: '' })
                    }
                  }} />
                <AsyncAutoComplete
                  label="Action"
                  name="action"
                  keyword={keyword}
                  setKeyword={setKeyword}
                  inputText={keyword.action}
                  api={(value, success, error) => {
                    downloadActions(value, success, error)
                  }}
                  getOptionLabel={(option, allOptions) => {
                    if (typeof option === "object") {
                      return option.action;
                    } else {

                      let found = allOptions.find(op => op.action === option);
                      if (found) {
                        return found.action
                      }
                      return "";
                    }
                  }}
                  value={query.filter.action}
                  onLoadApiCall
                  onChange={(event, newValue, reason) => {     
                    setFilters({ action: newValue ? newValue.action : '' })
                    setKeyword({...keyword, action: newValue ? newValue.action : ''})
                  }}
                  // value={query.filter.action}
                  onChangeApiCall={false}
                />
                {/* <AppSelectInput
                  label="Action"
                  options={actionOptions.map(opt => opt.action)}
                  labels={actionOptions.map(opt => opt.action)}
                  onChange={(e) => {
                    setFilters({ action: e.target.value })
                  }}
                  value={query.filter.action}
                /> */}
              </div>
              <div className="col-6 col-md-8">
                <div className="row">
                  <div className="col-6 col-md-6">
                    <AppDateInput
                      label="From"
                      onChange={(e) => {
                        setFilters({ from: e.target.valueAsDate.toISOString() })
                      }}
                      value={query.filter.from !== '' ? new Date(query.filter.from).toISOString().split("T")[0] : ''}
                    />
                  </div>
                  <div className="col-6 col-md-6">
                    <AppDateInput
                      label="To"
                      onChange={(e) => {
                        let toDate = e.target.valueAsDate;
                        toDate.setHours(23,59,59,999);
                        setFilters({ to: toDate.toISOString() })
                      }}
                      value={query.filter.to !== '' ? new Date(query.filter.to).toISOString().split("T")[0] : ''}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 col-md-6">
                    <AppSelectInput
                      label="Target Type"
                      options={['USER', 'GROUP', 'APPLICATION']}
                      onChange={(e) => {
                        setFilters({ sourceType: e.target.value, sourceId: '' })

                      }}

                      value={query.filter.sourceType}
                    />
                  </div>
                  <div className="col-6 col-md-6">
                    <div>
                      {/* { query.filter.sourceType &&  */}
                      {/* <AutocompleteField
                        label="Target Type"
                        setFilters={setFilters}
                        disabled
                        query={query}
                        source={query.filter.sourceType}
                        filterKey="sourceId"
                        disabled={!query.filter.sourceType}
                      /> */}

                      <AsyncAutoComplete
                        getOptionLabel={(option, allOptions) => {

                          if (typeof option === "object") {
                            return option.label;
                          } else {

                            let found = allOptions.find(op => op.id === option);
                            if (found) {
                              return found.label
                            }
                            return "";
                          }
                        }}
                        keyword={keyword}
                        setKeyword={setKeyword}
                        name="target"
                        inputText={keyword.target}
                        label="Target"
                        disabled={!query.filter.sourceType}
                        api={(value, success, error) => {
                          download(value, success, error, query.filter.sourceType)
                        }
                        }
                        value={query.filter.sourceId}
                        source={query.filter.sourceType}
                        onLoadApiCall
                        onChange={(event, newValue, reason) => {

                          if (newValue && newValue.id) {
                            setKeyword({...keyword, target: newValue.label})
                            setFilters({ ["sourceId"]: newValue.id })
                          } else {
                            if(reason === 'clear') {
                              setKeyword({...keyword, target: ''})
                            }
                            setFilters({ ["sourceId"]: '' })
                          }
                        }}
                      />

                      {/* } */}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-right mt-3">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setFilters(defaultQuery.filter)
                      }}>
                      Reset
                    </Button>
                    <Button className="ml-3"
                      variant="contained"
                      color="primary"
                      disabled={saving}
                      onClick={(e) => downloadlogs({ pageNumber: 0 })}>
                      Search
                    </Button>
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

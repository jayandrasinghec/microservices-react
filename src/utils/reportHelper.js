import { getFormatedDate } from "./helper"


export const reportFilters = (filterKeys, filterParams, postbody, mappings, defaultFilters ) => {

    let body = postbody
    let and = []
    let or = []
    let dateAnd = []
    let dateOr = []

    const operators = {
      "equals": 'eq',
      "greaterThan": 'gt',
      "greaterThanOrEqual": 'gte',
      "lessThan": 'lt',
      "lessThanOrEqual": 'lte',
      "notEqual": 'eq',
      "inRange": 'eq'
    }

    filterKeys.length > 0 && filterKeys.map((item, k) => {
        if(filterParams[item].filterType && (filterParams[item].filterType === 'text' || filterParams[item].filterType === 'number')) {
            if(filterParams[item].operator && (filterParams[item].operator === 'AND' || filterParams[item].operator === 'OR')) {
                let obj1 = {}
                obj1[mappings[item]] = filterParams[item].condition1['filter']
                filterParams[item].operator === 'AND' ? and.push(obj1) : or.push(obj1);
                let obj2 = {}
                obj2[mappings[item]] = filterParams[item].condition2['filter']
                filterParams[item].operator === 'AND' ? and.push(obj2) : or.push(obj2);
            }else {
                let obj = {}
                obj[mappings[item]] = filterParams[item]['filter']
                and.push(obj);
            }
        }
        if(filterParams[item].filterType && filterParams[item].filterType === 'date') {
            if(filterParams[item].filterType && filterParams[item].type === 'inRange') {
                let dateFrom = {}
                dateFrom.field = mappings[item]
                dateFrom.type = 'date'
                dateFrom.operator = 'gte'
                let dateFromValue = filterParams[item]['dateFrom']
                let dateFromValueISO = new Date(getFormatedDate(dateFromValue,'YYYY-MM-DD')).toISOString();
                dateFrom.value = dateFromValueISO;
                dateAnd.push(dateFrom)
                let dateTo = {}
                dateTo.field = mappings[item]
                dateTo.type = 'date'
                dateTo.operator = 'lt'
                let dateToValue = filterParams[item]['dateTo']
                let dateToValueISO = new Date(getFormatedDate(dateToValue,'YYYY-MM-DD')).toISOString();
                dateTo.value = dateToValueISO
                dateAnd.push(dateTo)
            } else {
                let dateFrom = {}
                dateFrom.field = mappings[item]
                dateFrom.operator = 'gte'
                dateFrom.type = 'date'
                let dateFromD = filterParams[item]['dateFrom']
                dateFrom.value = new Date(getFormatedDate(dateFromD,'YYYY-MM-DD')).toISOString();
                dateAnd.push(dateFrom)
                let dateTo = {}
                dateTo.field = mappings[item]
                dateTo.type = 'date'
                dateTo.operator = 'lt'
                let dateEndD = filterParams[item]['dateFrom']
                let dateEndDISO = new Date(getFormatedDate(dateEndD,'YYYY-MM-DD'));
                dateEndDISO.setHours(23,59,59,999);
                dateTo.value = dateEndDISO.toISOString();
                dateAnd.push(dateTo)
            }
        }
        if(filterParams[item].filterType && filterParams[item].filterType === 'set') {
            let arr = filterParams[item].values
            console.log('arr',arr)
            arr.map(val => {
                let obj = {}
                obj[mappings[item]] = val
                or.push(obj)
            })
        }
    })
    let filters = {
        'and' : and ,
        'or' : or,
    }
    console.log('filtersInFunc', filters)
    let datetimeFilters = {
        'and' : dateAnd,
        'or' : dateOr,
    }
    body.json.filters = filters
    body.json.datetimeFilters = datetimeFilters
    console.log('body',body)
    
    return body
  }

  export const sortAndFilterReports = (postBody, mappings, params, defaultFilters, defaultDatetimeFilters) => {

    // sorting and filtering of reports
    console.log(JSON.stringify(params.request, null, 1));
    let body = postBody

    // sortingdefaultDatetimeFilters
    if(params.request.sortModel.length > 0) {
        let obj = {}
        obj[params.request.sortModel[0].colId] = params.request.sortModel[0].sort === 'asc' ? 1 : -1
        body.json.sort = obj
    }


    // filtering
    let filterParams = params.request.filterModel;
    let filterKeys = Object.keys(filterParams)

    if(filterKeys.length > 0) {
        body = reportFilters(filterKeys, filterParams, body, mappings, defaultFilters)
    }else{
        delete body.json.filters
        delete body.json.datetimeFilters
    }

    let newBody = body

    // Handle default filters
    if(defaultFilters && Object.keys(defaultFilters).length > 0 && !newBody.json.filters) newBody.json.filters = {}

    if(defaultFilters && defaultFilters.and && defaultFilters.and.length > 0) {
        newBody.json.filters.and = body.json.filters && body.json.filters.and && body.json.filters.and.length > 0 ? [...body.json.filters.and, ...defaultFilters.and] : defaultFilters.and
    }
    if(defaultFilters && defaultFilters.or && defaultFilters.or.length > 0) {
        newBody.json.filters.or = body.json.filters && body.json.filters.or && body.json.filters.or.length > 0 ? [...body.json.filters.or, ...defaultFilters.or] : defaultFilters.or
    }

    // Handle default date time filters
    if(defaultDatetimeFilters && Object.keys(defaultDatetimeFilters).length > 0 && !newBody.json.datetimeFilters) newBody.json.datetimeFilters = {}

    if(defaultDatetimeFilters && defaultDatetimeFilters.and && defaultDatetimeFilters.and.length > 0) {
        newBody.json.datetimeFilters.and = body.json.datetimeFilters && body.json.datetimeFilters.and && body.json.datetimeFilters.and.length > 0 ? [...body.json.datetimeFilters.and, ...defaultDatetimeFilters.and] : defaultDatetimeFilters.and
    }
    if(defaultDatetimeFilters && defaultDatetimeFilters.or && defaultDatetimeFilters.or.length > 0) {
        newBody.json.datetimeFilters.or = body.json.datetimeFilters && body.json.datetimeFilters.or && body.json.datetimeFilters.or.length > 0 ? [...body.json.datetimeFilters.or, ...defaultDatetimeFilters.or] : defaultDatetimeFilters.or
    }


    return newBody
  }
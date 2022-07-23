import React, { useState } from 'react'
import { Grid } from '@material-ui/core'
import './Rule.css'
import { SearchMatchValueDropdown } from '../../modules/dashboard/policcy/components/SearchMatchValueDropdown';
import { callApi } from '../../utils/api';
import AppTextInput from '../form/AppTextInput'
import AppSelectInput from '../form/AppSelectInput'

const defaultMatchValueFilters = {
    "filter": {
      "name": "",
      "value": ""
    },
    "keyword": "",
    "pageNumber": 0,
    "pageSize": 10,
    "sortDirection": "ASC",
    "sortOn": []
}

export default function Rule({ rule, index, query, updateQuery, options, mainQuery, subRule, reference }) {
    const _ = require("lodash");
    const [valueOptions, setValueOptions] = useState([])
    const [errors, _setErrors] = useState({})

    const setError = e => _setErrors({ ...errors, ...e })

    const checkFields = (key) => {
        if(!rule[key] || !(rule[key]).length) {
          setError({ [key] : `This field is required.` })
        }else {
          setError({ [key] : null })
        }
      } 

    const handleChange = (key, value) => {
        let newQuery = {...mainQuery}
        if(key === 'key') {
            let jsonPath = `${reference}['key']`
        _   .set(newQuery, jsonPath, value);
            let jsonPathValue = `${reference}['value']`
        _   .set(newQuery, jsonPathValue, '');
        }else{
            let jsonPath = `${reference}[${key}]`
        _   .set(newQuery, jsonPath, value);
        }
        updateQuery(newQuery)
    }

    const handleDelete = () => {
        let newQuery = {...mainQuery};
        if(subRule){
            let ref = reference.slice(0,-3)
            let rules = _.get(newQuery, ref);
            rules.splice(index, 1)
            _.set(newQuery, ref, rules);
            updateQuery(newQuery)
            
        }else{
            newQuery.rules.splice(index, 1)
            updateQuery(newQuery)
        }
    }

    const getDropdownOptions = (value, success, error) => {
        let obj = defaultMatchValueFilters;
        obj.filter.name = value;
        if(rule.key){
            let type = rule.key
            callApi(`/utilsrvc/meta/list/${type}`, 'POST', obj)
                .then(e => {
                    if (e.success) {
                        setValueOptions(e.data ? e.data.content : [])
                        success(e.data ? e.data.content : [])
                    } 
                })
        }
    }
    
    return (
        <div className='py-2 and-or-template'>
        {/* // <div className='py-2 and-or-rule'> */}
            <Grid container justify='space-around'>
                <Grid item xs={3}>
                    <AppSelectInput
                        value={rule.key}
                        onChange={(e) => handleChange('key', e.target.value)}
                        options={options.keys.map(opt => opt.name)}
                        labels={options.keys.map(opt => opt.label)}
                        error={!!errors.key}
                        onBlur={() => checkFields('key')}
                        helperText={errors.key}
                    />
                </Grid>
                <Grid item xs={3}>
                    <AppSelectInput
                        value={rule.operator}
                        onChange={(e) => handleChange('operator', e.target.value)}
                        options={options.operators.map(opt => opt.value)}
                        labels={options.operators.map(opt => opt.label)}
                        error={!!errors.operator}
                        onBlur={() => checkFields('operator')}
                        helperText={errors.operator}
                    />
                </Grid>
                <Grid item xs={4}>
                    {
                        rule.operator === 'REGEX' ? 
                        <AppTextInput
                            type='text' 
                            value={rule.value} 
                            disabled={!rule.key}
                            onChange={(e) => handleChange('value', e.target.value)}
                        /> :
                        <SearchMatchValueDropdown
                            value={rule.value}
                            source={rule.key}
                            style={{ maxWidth: 300 }}
                            disabled={!rule.key}
                            getOptionLabel={(option, allOptions) => {
                            if (typeof option === "object") {
                                return option.name;
                            } else {
                                return '';
                            }
                            }}
                            api={(value, success, error) => {
                                getDropdownOptions(value, success, error)
                            }}
                            onLoadApiCall={true}
                            onChange={(event, newValue, reason) => {
                                if(newValue){
                                    handleChange('value', newValue.value)
                                }
                                if(reason === 'clear') {
                                    handleChange('value', '')
                                }          
                            }}
                            isSetOptions={true}
                            allOptions={valueOptions}
                        />
                    }
                </Grid>
                <Grid item xs={1}>
                    <button
                        className="btn btn-sm btn-purple btn-purple-outline mt-2 " 
                        onClick={(e) => handleDelete()}
                    >
                       <i className="fa fa-fw fa-close"></i>
                    </button>
                </Grid>
            </Grid>
        </div>
    )
}
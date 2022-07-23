import React from 'react'
import { Grid } from '@material-ui/core'
import Rule from './Rule'

export default function AndOr({ options, query, updateQuery, subRule, index , mainQuery, isFirst, reference}) {
    const _ = require("lodash");
    const defualtRule = {
        key: null,
        operator: null,
        value: null
    }

    const defaultGroupRule = {
        "condition": "AND",
        "rules": [
            {
                "key": null,
                "operator": null,
                "value": null
            }
        ]
    }

    const addHandler = (group) => {
        let newQuery = {...mainQuery}
        
        if(subRule){
            let rules = _.get(newQuery, `${reference}.rules`);
            rules.push(group ? defaultGroupRule : defualtRule)
            _.set(newQuery, `${reference}.rules`, rules);
            updateQuery(newQuery)
        }else{
            if(newQuery && newQuery.hasOwnProperty('rules')) {
                newQuery.rules.push(group ? defaultGroupRule : defualtRule)
            }else {
                newQuery.rules = [group ? defaultGroupRule : defualtRule]
            }
            updateQuery(newQuery)
        }
    }

    const conditionHandler = (val) => {
        let newQuery = {...mainQuery}
        let jsonPath = `${reference}['condition']`
        _.set(newQuery, subRule ? jsonPath : ['condition'], val);
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

    return (
        <div>
            <Grid container className={`and-or-template p-3 ${isFirst ? 'and-or-first' : ''}`}>
                <Grid container className='and-or-top'>
                <Grid item xs={5}>
                    <button className={`mx-1 btn btn-sm btn-purple-outline btn-radius  ${query.condition === 'AND' ? `btn-purple-outline-focus` : ``}`} onClick={() => conditionHandler('AND')}>AND</button>
                    <button className={`mx-1 btn btn-sm btn-purple-outline btn-radius  ${query.condition === 'OR' ? `btn-purple-outline-focus` : ``}`} onClick={() => conditionHandler('OR')}>OR</button>
                </Grid>
                <Grid item sm={7} className='text-right'>
                    <button  className='mx-1 btn btn-sm btn-purple' onClick={() => addHandler()}>+ Add</button>
                    <button  className='mx-1 btn btn-sm btn-purple' onClick={() => addHandler('group')}>+ (Group)</button>
                    { !isFirst && <button  className='mx-1 btn btn-sm btn-purple' onClick={() => handleDelete()}><i className="fa fa-fw fa-close"></i></button> }
                </Grid>
                <Grid className='w-100 px-5 py-3'>
                    {
                        query && query.hasOwnProperty('rules') && query.rules.map((rule, i) => {
                            // if(rule && rule.hasOwnProperty('condition')) {
                            if(rule.rules) {
                                return <AndOr
                                    key={i}
                                    rule={rule}
                                    index={i}
                                    options={options}
                                    query={rule}
                                    updateQuery={updateQuery}
                                    mainQuery={mainQuery}
                                    subRule={true}
                                    reference={reference ? `${reference}['rules'][${i}]` : `['rules'][${i}]`}
                                />
                            }else {
                                return <Rule
                                    key={i}
                                    rule={rule}
                                    index={i}
                                    options={options} 
                                    query={query}
                                    updateQuery={updateQuery}
                                    mainQuery={mainQuery}
                                    subRule={subRule}
                                    reference={reference ? `${reference}['rules'][${i}]` : `['rules'][${i}]`}                                    
                                />
                            }
                        })
                    }
                </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

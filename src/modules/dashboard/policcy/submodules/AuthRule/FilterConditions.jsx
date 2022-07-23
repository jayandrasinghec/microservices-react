import React, { useEffect, useState } from 'react';
import QueryBuilder from '../../../../../components/QueryBuilder';
import { callApi } from '../../../../../utils/api';


export default function FilterConditions({ query, setQuery }) {
    const [keys, setKeys] = useState({})
    const [operators, setOperators] = useState({})

    const getkeyOptions = () => {
        callApi(`/rulesrvc/ruleEngineConditionConfig/AUTH`)
            .then(e => {
                if (e.success) {
                    e.data && e.data.condition && setKeys(e.data.condition)
                } 
            })
    }
    
    useEffect(() => {
        getkeyOptions()
    }, [])

    const getOperatorOptions = () => {
        callApi(`/rulesrvc/ruleEngine/condition/operator`, 'GET')
            .then(e => {
                if (e.success) {
                    e.data && setOperators(e.data)
                } 
            })
    }
    
    useEffect(() => {
        getOperatorOptions()
    }, [])

    return (
        <div>
            <QueryBuilder 
                // options={filterOptions}
                options={{
                    keys: keys && keys.length ? keys : [],
                    operators: operators && operators.length ? operators : [],
                }}
                query={query}
                updateQuery={setQuery}
            />
        </div>
    );
}
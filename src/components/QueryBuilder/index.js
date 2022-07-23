import React from 'react';
import AndOr from './AndOr';
import './AndOr.css'
import './magic-cube.css'


export default function QueryBuilder({ options, query, updateQuery }) {

  return (
    <div className='container'>
      <AndOr options={options} query={query} updateQuery={updateQuery} mainQuery={query} isFirst={true}/>
    </div>
  )
}


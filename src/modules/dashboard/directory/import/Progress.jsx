import React, { useState, useEffect } from 'react'
import { callApi } from '../../../../utils/api';

export const Progress = (props) => {
  const [progressCount, setProgressCount] = useState(0);

  const getProgress = () => {
    callApi(`/usersrvc/import/users/getProgress/${props.match.params.id}`)
      .then(res => {
        if(res.success) {
          setProgressCount(res.data.percent)
          if(res.data.importStatus === 'COMPLETE') {
            props.history.push(`/dash/directory/import/${props.match.params.id}`)
          }
        }
      })
      .catch(err => {})
  }

  useEffect(()=>{
    setInterval(()=>{
      setProgressCount((prev)=>prev+1)
    }, 2000)
  }, [])
  
  useEffect(()=>{
    getProgress()
  }, [progressCount])

  return (
    <div className="progress">
      <div 
        className="progress-bar progress-bar-striped bg-success" 
        role="progressbar" 
        style={{width: `${progressCount}%`}} 
        aria-valuenow={progressCount} 
        aria-valuemin="0" 
        aria-valuemax="100" />
    </div>
  )
}

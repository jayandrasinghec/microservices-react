import React, { useEffect, useState } from 'react';
import { QueryRenderer } from '@cubejs-client/react';
import MaterialTable from 'material-table';
import { CircularProgress, makeStyles } from '@material-ui/core';
import { callApi } from '../../../../utils/api';
import { getAuthToken } from '../../../../utils/auth';

const useStyles = makeStyles(() => ({
    activeinfoone: {
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    activeinfotwo: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto',
        alignSelf: 'flex-end',
        marginRight: '15px',
    },
})
)

export default function MostSignIn(props) {
    const classes = useStyles();
    const [newData, setNewdata] = useState([])
    const [loader, setLoader] = useState(true)
    const value = props.refreshInt

    const body = {
        "json": {
            "collection": "frequent_application",
            "join": [
                {
                    "collection": "applicationTenant",
                    "localColumn": "appId",
                    "foreignColumn": "_id",
                    "joinCollectionAlias": "joinTableOne",
                    "isLeftJoin": false
                }
            ],
            "measures": [
                {
                    "appName": "joinTableOne.settings.displayName"
                }
            ],
            "sort": {
                "count": -1
            }
        }
    }
  
    const downloadData = () => {
        callApi('/reportingsvc/v1/reports/executeAggregate', 'POST', body, props.token, true)
        .then(result => {
            setLoader(false)
            // console.log("Most Sign in", result.data)
            setNewdata(result.data && result.data.length > 0 ? result.data : [])
      })
      .catch(err => setLoader(false))
    }
  
    useEffect(() => {
        downloadData()
        const interval = setInterval(() => {
          downloadData()
        }, value * 1000)
    
        return () => clearInterval(interval)
    }, [])
  
    // if(newData.length === 0) {
    if(loader) {
        return <div className='text-center'><CircularProgress /></div>
        // return <div className='text-center'>No Recent Application</div>
    }
    return (
        newData.length > 0 ? newData.map((obj, k) => {
            return (
                <div key={k} style={{display:'flex', color: '#8392A7',fontSize: '14px', marginTop: '20px'}}>
                    <div className={classes.activeinfoone}>
                        <p style={{color: '#8392A7',fontSize: '14px', marginTop:'0px', marginBottom:'0px'}}>{obj.appName}</p>
                    </div>
                    <div className="ml-auto mr-3 text-center">
                        <p style={{color: '#8392A7',fontSize: '14px', marginTop:'0px', marginBottom:'0px'}}>
                            {obj.count}
                        </p>
                    </div>
                </div>
            )
        }) :
        <div className='text-center' style={{ color: '#8392A7',fontSize: '14px', marginTop: '20px'}}>
            Not Enough Data
        </div>
    );
}



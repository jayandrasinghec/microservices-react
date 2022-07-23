import React, { useEffect, useState } from 'react';
import { QueryRenderer } from '@cubejs-client/react';
import { CircularProgress, makeStyles } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
import { callApi, getTenant } from '../../../../utils/api';
import { getAuthToken } from '../../../../utils/auth';

const useStyles = makeStyles(() => ({
    imgdiv: {
        margin: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: '14px',
        color: '#8392A7',
        // cursor: 'pointer',
    },
    headthree: {
        fontSize: '28px',
        color: 'black',
    },
})
)


export default function Counter(props) {
    const classes = useStyles();
    const [loader,setLoader] = useState(true);
    const [applications, setApplications] = useState(0);
    const [users, setUsers] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [roles, setRoles] = useState(0);
    const [workflows, setWorkflows] = useState(0);
    const [passwordPolicy, setPasswordPolicy] = useState(0);
    const [rules, setRules] = useState(0);
    const [notLoggedIn, setNotLoggedIn] = useState(0);
    const value = props.refreshInt
    const token = getAuthToken()
    const applicationTenantBody = {
        "json": {
            "collection": "user",
            "removeRoot": true,
            "join": [
                {
                    "collection": "applicationTenant",
                    "joinCollectionAlias": "applications",
                    "count": {
                        "and": [
                            {
                                "status": "ACTIVE"
                            }
                        ]
                    }
                }
            ]
        }
    }

    const userBody = {
        "json": {
            "collection": "user",
            "removeRoot": true,
            "join": [
                {
                    "collection": "user",
                    "joinCollectionAlias": "users",
                    "count": {
                        "and": [
                            {
                                "status": "ACTIVE"
                            }
                        ]
                    }
                }
            ]
        }
    }

    const totalUserBody = {
      "json": {
          "collection": "user",
          "removeRoot": true,
          "join": [
              {
                  "collection": "user",
                  "joinCollectionAlias": "users",
                  "count": {
                      
                  }
              }
          ]
      }
    }

    const applicationRoleBody = {
        "json": {
            "collection": "user",
            "removeRoot": true,
            "join": [
                {
                    "collection": "applicationRole",
                    "joinCollectionAlias": "roles",
                    "count": {
                        "and": [
                            {
                                "active": true
                            }
                        ]
                    }
                }
            ]
        }
    }

    const workflow_setupBody = {
        "json": {
            "collection": "user",
            "removeRoot": true,
            "join": [
                {
                    "collection": "workflow_setup",
                    "joinCollectionAlias": "workflows",
                    "count": {}
                }
            ]
        }
    }

    const passwordPolicyBody = {
        "json": {
            "collection": "user",
            "removeRoot": true,
            "join": [
                {
                    "collection": "passwordPolicy",
                    "joinCollectionAlias": "passwordPolicy",
                    "count": {
                        "and": [
                            {
                                "active": true
                            }
                        ]
                    }
                }
            ]
        }
    }

    const ruleBody = {
        "json": {
            "collection": "user",
            "removeRoot": true,
            "join": [
                {
                    "collection": "rule",
                    "joinCollectionAlias": "rules",
                    "count": {
                        "and": [
                            {
                                "active": true
                            }
                        ]
                    }
                }
            ]
        }
    }

    const notLoggedInBody = {
        "json": {
            "collection": "user",
            "removeRoot": true,
            "join": [
                {
                    "collection": "user",
                    "joinCollectionAlias": "notLoggedIn",
                    "count": {
                        "and": [
                            {
                                "provisionedApps.CYMMETRI.login.lastLoginTime": {
                                    "$exists": false
                                }
                            },
                            {
                              "status": "ACTIVE"
                            }
                        ],
                    }
                }
            ]
        }
    }
  
    const downloadData = () => {
      callApi('/reportingsvc/v1/reports/executeAggregate?page=1&items=1', 'POST', applicationTenantBody, token, true)
      .then(result => {
            if(result.status === 'success' && result.data && result.data.length > 0) {
                let val = result.data[0].applications.count
                setApplications(val)
            } 
      })
      callApi('/reportingsvc/v1/reports/executeAggregate?page=1&items=1', 'POST', userBody, token, true)
      .then(result => {
            if(result.status === 'success' && result.data && result.data.length > 0) {
                let val = result.data[0].users.count
                setUsers(val)
            } 
      })
      callApi('/reportingsvc/v1/reports/executeAggregate?page=1&items=1', 'POST', totalUserBody, token, true)
      .then(result => {
            if(result.status === 'success' && result.data && result.data.length > 0) {
                let val = result.data[0].users.count
                setTotalUsers(val)
            } 
      })
      callApi('/reportingsvc/v1/reports/executeAggregate?page=1&items=1', 'POST', applicationRoleBody, token, true)
      .then(result => {
            if(result.status === 'success' && result.data && result.data.length > 0) {
                let val = result.data[0].roles.count
                setRoles(val)
            } 
      })
      callApi('/reportingsvc/v1/reports/executeAggregate?page=1&items=1', 'POST', workflow_setupBody, token, true)
      .then(result => {
            if(result.status === 'success' && result.data && result.data.length > 0) {
                let val = result.data[0].workflows.count
                setWorkflows(val)
            } 
      })
      callApi('/reportingsvc/v1/reports/executeAggregate?page=1&items=1', 'POST', passwordPolicyBody, token, true)
      .then(result => {
            if(result.status === 'success' && result.data && result.data.length > 0) {
                let val = result.data[0].passwordPolicy.count
                setPasswordPolicy(val)
            } 
      })
      callApi('/reportingsvc/v1/reports/executeAggregate?page=1&items=1', 'POST', ruleBody, token, true)
      .then(result => {
            if(result.status === 'success' && result.data && result.data.length > 0) {
                let val = result.data[0].rules.count
                setRules(val)
            }
      })
      callApi('/reportingsvc/v1/reports/executeAggregate?page=1&items=1', 'POST', notLoggedInBody, token, true)
      .then(result => {
            if(result.status === 'success' && result.data && result.data.length > 0) {
                let val = result.data[0].notLoggedIn ? result.data[0].notLoggedIn.count : 0
                setNotLoggedIn(val)
            }
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

    return (
            <>
                <div className={classes.imgdiv}>
                    <h3 className={classes.headthree}>{applications}</h3>
                    <span>Applications</span>
                </div>
                <div className={classes.imgdiv}>
                    <h3 className={classes.headthree}>{users}</h3>
                    <span>Active Users</span>
                </div>
                <div className={classes.imgdiv}>
                    <h3 className={classes.headthree}>{totalUsers}</h3>
                    <span>Total Users</span>
                </div>
                <div className={classes.imgdiv}>
                    <h3 className={classes.headthree}>{roles}</h3>
                    <span>Roles</span>
                </div>
                <div className={classes.imgdiv}>
                    <h3 className={classes.headthree}>{workflows}</h3>
                    <span>Workflows</span>
                </div>
                <div className={classes.imgdiv}>
                    <h3 className={classes.headthree}>{passwordPolicy}</h3>
                    <span>Password Policy</span>
                </div>
                <div className={classes.imgdiv}>
                    <h3 className={classes.headthree}>{rules}</h3>
                    <span>Rules</span>
                </div>
                <div className={classes.imgdiv}>
                    <h3 className={classes.headthree}>{notLoggedIn}</h3>
                    <span>Users Never Logged On</span>
                </div>
            </>
        );
}

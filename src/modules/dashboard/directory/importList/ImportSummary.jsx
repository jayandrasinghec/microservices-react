import React, { useEffect, useState } from 'react';
import { Link as Linking } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import AppTabView from '../../../../components/AppTabView';
import { Duplicate } from './records/Duplicate';
import { Error } from './records/Error';
import Button from '@material-ui/core/Button'
import { Switch, Route, Redirect } from 'react-router-dom';
import { Created } from './records/Created';
import { callApi } from '../../../../utils/api';
import CardViewWrapper from '../../../../components/HOC/CardViewWrapper';
import CardViewWrapperTitle from '../../../../components/HOC/CardViewWrapperTitle';
import { getFormatedDate } from '../../../../utils/helper';
const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
    // maxHeight: 500,
    marginBottom: '20px',
    // backgroundColor: '#fff'
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: 15,
    overflow: 'auto'
  },
  summaryContainer: {
    background: '#fff',
    width: '100%',
    padding: '15px 25px',
    borderRadius: '8px'
  },
  nav: {
    display: 'flex',
    padding: '0px !important'
    // marginTop: '12px'
  },
  activeLink: {
    fontWeight: 'bold !important',
    borderBottom: '3px solid #1F4287',
    color: '#1F4287',
  },
}))
export const ImportSummary = (props) => {
  const classes = useStyles();
  const [data, setData] = useState([])
  // const [info, setInfo] = useState(null)
  const importInfo = JSON.parse(localStorage.getItem('importInfo'))

  const getImportResultSummary = () => {
    callApi(`/usersrvc/import/users/getImportResultSummary/${props.match.params.id}`)
      .then(res => {
          if(res.success) {
            setData(res.data)
          }
      })
      .catch(err => {})
  }

  useEffect(() => {
    getImportResultSummary()
    if(props.location.state){
      // setInfo(props.location.state.rowData)
      localStorage.setItem('importInfo', JSON.stringify(props.location.state.rowData))
    }
  }, [])

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <CardViewWrapper className={classes.summaryWrapper}>
            <div className={classes.summaryContainer}>
              <CardViewWrapperTitle>
                Import Summary
              </CardViewWrapperTitle>
              <Grid container direction="row">
                <Grid item xs={6}>
                  <p>Created Records: {data.created}</p>
                  <p>Duplicate Records: {data.duplicates}</p>
                  <p>Error Records: {data.errored}</p>
                </Grid>
                {/* {info ? 
                  <Grid item xs={6}>
                    <p>Status: {info.status}</p>
                    <p>Created By: {info.createdBy}</p>
                    <p>Created: {getFormatedDate(info.created)}</p>
                  </Grid> : null
                } */}
                {data ? 
                  <Grid item xs={6}>
                    <p>Status: {data.status}
                    {
                      data.status === 'MAPPING_PENDING' && 
                        <Linking to={`/dash/directory/import/users/${props.match.params.id}/info`}>
                          <Button variant="contained" color="primary" style={{ cursor: 'pointer' }} className="primary-btn-view ml-2">
                            REMAP
                          </Button>
                        </Linking>
                    }
                    </p>
                    <p>Created By: {data.createdBy}</p>
                    <p>Created: {getFormatedDate(data.createdAt)}</p>
                  </Grid> : null
                }
              </Grid>
            </div>
          </CardViewWrapper>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <CardViewWrapper>
            <Grid item xs={6} className={classes.nav}>
              <AppTabView
                links={[
                  {
                    // roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY'],
                    href: `/dash/directory/import/${props.match.params.id}/created`,
                    name: 'Created'
                  }, {
                    // roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY'],
                    href: `/dash/directory/import/${props.match.params.id}/duplicate`,
                    name: 'Duplicate'
                  }, {
                    // roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY'],
                    href: `/dash/directory/import/${props.match.params.id}/error`,
                    name: 'Error'
                  },
                ]}
              />
            </Grid>
            <Switch>
              <Route exact={true} path="/dash/directory/import/:id/created" component={p => <Created {...p} data={data} />} />
              <Route exact={true} path="/dash/directory/import/:id/duplicate" component={p => <Duplicate {...p} data={data} />} />
              <Route exact={true} path="/dash/directory/import/:id/error" component={p => <Error {...p} data={data} />} />
              <Redirect to={`/dash/directory/import/:id/created`} />
            </Switch>
          </CardViewWrapper>
        </Grid>
      </Grid>
    </>
  )
}
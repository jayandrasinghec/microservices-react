import React, { useEffect, useState } from 'react';
import { makeStyles, Grid, Button } from '@material-ui/core';
import CardViewWrapper from '../../../../../../components/HOC/CardViewWrapper';
import CardViewWrapperTitle from '../../../../../../components/HOC/CardViewWrapperTitle';
import { getFormatedDate } from '../../../../../../utils/helper';
import AppTabView from '../../../../../../components/AppTabView';
import { Switch, Route, Redirect, useHistory, Link, useLocation, useParams } from 'react-router-dom';
import Created from '../../../components/Import/ImportSummary/Created/Created';
import Error from '../../../components/Import/ImportSummary/Error/Error';
import { callApi } from '../../../../../../utils/api';

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
  },
  activeLink: {
    fontWeight: 'bold !important',
    borderBottom: '3px solid #1F4287',
    color: '#1F4287',
  },
}));

const ImportSummary = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const { type } = useParams();

  const [id, setId] = useState(location.state && location.state.id ? location.state.id : '');
  const [data, setData] = useState([])

  useEffect(() => {
    if(id && id !== undefined && id !== null && id !== ''){
      getImportResultSummary()
    }else{
      history.push('/dash/sod/import');
    }
  }, [id])

  const getImportResultSummary = () => {
    let url = ''
    if(type === 'entities'){
      url = `/sod/import/sodentities/getImportResultSummary/${id}`
    }
    if(type === 'policies'){
      url = `/sod/import/policyRule/getImportResultSummary/${id}`
    }
    callApi(url)
      .then(res => {
        if(res.success) {
          setData(res.data)
        }
      })
      .catch(err => {})
  }


	return(
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
									<p>Error Records: {data.errored}</p>
								</Grid>
								{data ? 
									<Grid item xs={6}>
										<p>Status: {data.status}
										{
											data.status === 'MAPPING_PENDING' && 
												<Link to={{ pathname: `/dash/sod/import/${type}/file/info`, state: { id: id }}}>
													<Button variant="contained" color="primary" style={{ cursor: 'pointer' }} className="primary-btn-view ml-2">
														REMAP
													</Button>
												 </Link>
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
                    roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY'],
                    href: {pathname: `/dash/sod/import/${type}/importSummary/created`, state: { id: id }},
                    name: 'Created'
                  }, {
                    roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY'],
                    href: {pathname: `/dash/sod/import/${type}/importSummary/error`, state: { id: id }},
                    name: 'Error'
                  },
                ]}
              />
            </Grid>
            <Switch>
              <Route exact path="/dash/sod/import/:type/importSummary/created" component={() => <Created  data={data} />} />
              <Route exact path="/dash/sod/import/:type/importSummary/error" component={() => <Error  data={data} />} />
              <Redirect to={`/dash/sod/import/entities/importSummary/created`} />
            </Switch>
          </CardViewWrapper>
        </Grid>
      </Grid>
		</>
	);
}

export default ImportSummary;
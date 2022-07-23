import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, CardActions, CardContent, CardHeader, Grid, Typography } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import StackedBarChart from './StackedBarChart';
import DoughnutChart from './DoughnutChart';
import CardViewWrapperTitle from '../../../../../components/HOC/CardViewWrapperTitle';
import { callApi } from '../../../../../utils/api';
import MultiServiceFilter from '../../components/MultiServiceFilter';

const useStyles = makeStyles((theme) => ({
  cardView: {
    padding: "8px",
    borderRadius: "8px",
    boxShadow: "none",
    '& .MuiCardActions-root': {
      display: "flex",
      padding: "0px 16px 8px 16px",
      height: 18,
    }
  },
  chartContainer: {
    '& canvas': {
      width: '100% !important',
      height: '100% !important'
    }
  },
  cardViewWrapper: {
    padding: theme.spacing(2, 3),
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  authTitle: {
    paddingBottom: "10px",
    '& .MuiCardHeader-content': {
      '& span': {
        fontSize: 16,
        lineHeight: "0px",
        marginTop: "-4px",
        color: "#1F4287",
        fontWeight: "600"
      }
    },
    borderBottom: '1px solid #ddd'
  },
  cardViewWrapperTitle: {
    fontSize:18,
    fontWeight:500,
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '48',
    lineHeight: 2.6,
    textAlign: 'left'
  },
  linkAction: {
    color: '#007bff',
    width: '100%',
    cursor: 'pointer',
    '&:hover .link': {
      color: '#0056b3',
      cursor: 'pointer',
      textDecoration: 'underline'
    }
  }
}))

export default function Dashboard(props) {
  const {scanId, filterService, setFilterService, id, setId, setSection} = props;
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [services, setServices] = useState([])

  useEffect(() => {
    getDashboardData()
  }, [])

  const getDashboardData = () => {
    callApi(`/iddiscsrvc/v1/api/${scanId}/dashboard`, 'GET')
      .then(e => {
          let arr = e.data ? e.data : []
          setData(arr)
          let arrServices = arr.map(obj => obj.name)
          setServices(arrServices)
        } 
      )
  }

  const serviceCard = (item) => (
    <Grid item xs={12} sm={12} md={6} lg={6}>
      <Card className={classes.cardView}>
        <CardHeader
          action={
            <>
              <span className="text-danger mr-2"><i className="fa fa-info-circle"></i> {item.issues.High}</span>
              <span className="text-warning mr-2"><i className="fa fa-info-circle"></i> {item.issues.Medium}</span>
              <span className="text-success"><i className="fa fa-check-circle"></i> {item.issues.Good}</span>
            </>
          }
          title={item.name}
          className={classes.authTitle}
        />
        <CardContent style={{borderBottom: '1px solid #ddd'}}>
          <>
            <p className="mb-1">Resources <span className="float-right">{item.resources}</span></p>
            <p className="mb-1">Rules <span className="float-right">{item.rules}</span></p>
            <p className="mb-1">Flagged Resources <span className="float-right">{item['flagged-items']}</span></p>
          </>
        </CardContent>
        <CardActions style={{marginTop: 20}}>
          <span 
            className={classes.linkAction}
            onClick={() => {
              setId(item.id)
              setSection("findings")
            }}
          >
            <span className="link">View Report</span><span style={{float: 'right'}}><ArrowForwardIosIcon fontSize="small" /></span>
          </span>
        </CardActions>
      </Card>
    </Grid>
  )

  return (
    <>
      <Grid container spacing={3} justify="center">
        <Grid item xs={12} align="center" >
          <Box className={classes.cardViewWrapper}>
            <Typography gutterBottom className={classes.cardViewWrapperTitle}>
              Issues By Severity
            </Typography>
            <Grid item xs={6} className={classes.chartContainer}>
              <DoughnutChart />
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} className={classes.chartContainer}>
          <Box className={classes.cardViewWrapper}>
            <CardViewWrapperTitle>Issues By Service</CardViewWrapperTitle>
            <StackedBarChart dashboardData={data} />
          </Box>
        </Grid>
      </Grid>
      <Box className={classes.cardViewWrapper + ' my-3'}>
        <Grid container spacing={3} justify="">
          <Grid item xs={12} sm={12} md={6}>
            <Typography gutterBottom className={classes.cardViewWrapperTitle}>
              Services
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <MultiServiceFilter
              options={services}
              value={filterService}
              onChange={(data) => setFilterService(data)}
            />
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={3}>
        {
          filterService.length > 0 ? 
          data.map(item => {
            if (filterService.find(obj => obj === item.name )) {
              return serviceCard(item)
            }
          }) :
          data.map(item => {
            return serviceCard(item)
          })
        }
      </Grid>
    </>
  );
}

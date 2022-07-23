import { Box, Grid, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import AppSelectInput from '../../../../../components/form/AppSelectInput';
import CardViewWrapper from '../../../../../components/HOC/CardViewWrapper';
import { callApi } from '../../../../../utils/api';
import { isActiveForRoles } from '../../../../../utils/auth';
import Dashboard from './Dashboard';
import ServiceGrid from './SummaryDetails/ServiceGrid';
import ServiceGridItem from './SummaryDetails/ServiceGridItem';
import { EnvSearchableDropdown } from '../../components/EnvSearchableDropdown';

const useStyles = makeStyles((theme) => ({
  cardViewWrapper: {
    padding: theme.spacing(2, 3),
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 24
  },
}))

export default function Summary() {
  const classes = useStyles();
  const [section, setSection] = useState('')
  const [id, setId] = useState(null)
  const [violationName, setViolationName] = useState(null)
  const [envList, setEnvList] = useState([])
  const [envId, setEnvId] = useState(null)
  const [scanList, setScanList] = useState([])
  const [scanId, setScanId] = useState(null)
  const [filterService, setFilterService] = useState([])
    
  const renderComponents = () => {
    if(section === 'dash') {
      return ( 
        <Dashboard
          scanId={scanId}
          filterService={filterService}
          setFilterService={setFilterService}
          id={id}
          setId={setId}
          setSection={setSection}
        />
      )
    } else if(section === 'findings'){
      return (
        <ServiceGrid
          scanId={scanId}
          id={id}
          setId={setId}
          setSection={setSection}
          setViolationName={setViolationName}
        />
      )
    } else if(section === 'items'){
      return (
        <ServiceGridItem 
          scanId={scanId}
          id={id}
          setSection={setSection}
          violationName={violationName}
          setViolationName={setViolationName}
        />
      )
    }
  } 

  const getEnvList = (value, success, error) => {
    callApi(`/iddiscsrvc/envconfig/getNames?name=${value}`)
    .then(e => {
      if (e.data) {
        setEnvList(e.data ? e.data[0] : [])
        success(e.data ? e.data[0] : [])    
      } 
    })
  }

  const getScanList = (id) => {
    callApi(`/iddiscsrvc/v1/api/scanner/${id}`)
    .then(e => {
      if (e.data) {
        const arr = e.data ? e.data[0] : [];
        const arr1 = arr.filter(obj => obj.status === "COMPLETED")
        setScanList(arr1);
      } 
    })
  }

  return (
    <CardViewWrapper>
      <Box className={classes.cardViewWrapper}>
        <Grid container spacing={3} >
          <Grid item xs={12} sm={12} md={6}>
            <EnvSearchableDropdown
              label="Environment"  
              required
              value={envId}
              disabled={isActiveForRoles(['READ_ONLY'])}
              getOptionLabel={(option, allOptions) => {
                  if (typeof option === "object") {
                      return option.env_name;
                  } else {
                      return '';
                  }
              }}
              api={(value, success, error) => {
                  getEnvList(value, success, error)
              }}
              onLoadApiCall={true}
              onChange={(event, newValue, reason) => {
                if(newValue){
                  setEnvId(newValue.id)
                  getScanList(newValue.id)
                }
                if(reason === 'clear') {
                  setEnvId(null)
                  setScanId(null)
                  getScanList()
                }      
                setSection('')    
              }}
              // error={!!errors.env_id}
              // onBlur={(e) => checkValue(e)}
              // helperText={errors.env_id}
              name="env_id"
              onChangeApiCall={false}
              isSetOptions={true}
              allOptions={envList}
            />
          </Grid>
          {
            envId ? 
            <Grid item xs={12} sm={12} md={6}>
              <AppSelectInput
                label="Scan"
                required
                onChange={e => {
                  setScanId(e.target.value)
                  e.target.value && setSection('dash')
                }}
                options={scanList.map(r => r.scan_id)}
                fullWidth
                style={{ width: '100%' }}
                // labels={scanList.map(r => r.last_run.time)}
              />
            </Grid> : null
          }
        </Grid>
      </Box>
      { renderComponents() }
    </CardViewWrapper>
  );
}
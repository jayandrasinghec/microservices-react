import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';

import ItemDetails from './ItemDetails';
import { callApi } from '../../../../../../utils/api';
import CustomPagination from '../../../../../../components/CustomPagination';
import CustomTable from '../../../components/CustomTable';

const useStyles = makeStyles(theme => ({
  nameLink: {
    color: '#007bff',
    '&:hover': {
      color: '#0056b3',
      cursor: 'pointer',
      textDecoration: 'underline'
    }
  }
}));

function ServiceGridItem(props) {
  const {scanId, id, setSection, violationName, setViolationName} = props;
  const classes = useStyles();

  const [showItemDetails, setShowItemDetails] = useState(false);
  const [itemName, setItemName] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [pageFilter, setPageFilter] = useState({
    limit: 10,
    page: 0
  })

  useEffect(() => {
    getServiceGridItemData()
  }, [pageFilter])

  const getServiceGridItemData = () => {
    callApi(`/iddiscsrvc/v1/api/${scanId}/services/${id}/findings/${violationName}/items?limit=${pageFilter.limit}&page=${pageFilter.page+1}`, 'GET')
      .then(e => {
        setData(e.data ? e.data : [])
        setTotal(e.data ? e.count : 0)
      })
  }
  
  
  const handleNameClick = (name, id) => {
    setItemName(name)
    setItemId(id)
    setShowItemDetails(true)
  }

  const renderCol = () => {
    let arr = []
    data && data.length > 0 && Object.keys(data[0]).map(key => {
      let obj = {}
      if (key === 'name') {
        obj.title = "Name"
        obj.field = key
        obj.render = rowData =>  <span className={classes.nameLink} onClick={() => handleNameClick(rowData.display_path, rowData.id)}>{rowData.name ? rowData.name : "--" }</span>
        arr.push(obj)
      } else if (key === 'region' || key === 'vpc') {
        obj.title = key === 'region' ? 'Region' : 'VPC'
        obj.field = key
        obj.render = rowData =>  <span>{rowData[key] ? rowData[key] : "--" }</span> 
        arr.push(obj)
      }
    })
    return arr
  }
  
  const columns = renderCol();

  const handleChangePage = (event, newPage) => {
    setPageFilter({ ...pageFilter, page: newPage });
  }
  const handleChangeRowsPerPage = (event) => {
    setPageFilter({ ...pageFilter,page: 0, limit: parseInt(event, 10) });
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="small"
            disableElevation
            onClick={() => {
              setViolationName(null)
              setSection('findings')
            }}
          >
            Back to Service Violations
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <CustomTable
          title="Violation Items"
          columns={data.length > 0 ? columns : []}
          data={data}                
        />
        <CustomPagination
          count={Math.ceil(total / pageFilter.limit)}
          totalCount = {total}
          page={pageFilter.page}
          onChangePage={handleChangePage}
          rowsPerPage={pageFilter.limit}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Grid>
      {
        showItemDetails ? 
        (
          <ItemDetails 
            itemName={itemName}
            itemId={itemId}
            scanId={scanId}
            id={id}
            violationName={violationName}
          />
        ) : null
      }
    </>
  )
}

export default ServiceGridItem

import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid, Typography } from '@material-ui/core';

import { callApi } from '../../../../../../utils/api';

const useStyles = makeStyles(theme => ({
  cardViewWrapper: {
    padding: theme.spacing(3),
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: '16px 0px 0px',
  },
  cardViewWrapperTitle: {
    fontSize:18,
    fontWeight:500,
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '48',
    lineHeight: 2.6,
    textAlign: 'left',
    borderBottom: '1px solid #000'
  },
  infoContainer: {
    padding: theme.spacing(3),
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    margin: 16,
  }
}));

function ItemDetails(props) {
  const classes = useStyles()
  const {itemName, itemId, scanId, id, violationName } = props

  const [itemData, setItemData] = useState([])


  useEffect(() => {
    getItemData()
  }, [itemId, itemName])

  const getItemData = () => {
    callApi(`/iddiscsrvc/v1/api/${scanId}/services/${id}/findings/${violationName}/items/${itemId}?path=${itemName}`, 'GET')
      .then(e => {
        setItemData(e.data ? e.data[0].item : [])
      })
  }
  return (
    <>
      <Box className={classes.cardViewWrapper}>
        <Grid container>
          <Grid item xs={12}>
            <Typography gutterBottom className={classes.cardViewWrapperTitle}>
              {itemData.name}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={classes.infoContainer}>
              <h6>Informations</h6>
              {itemData.id ? <p className="mb-0"><span><b>ID:</b> </span><span>{itemData.id}</span></p> : null}
              {itemData.arn ? <p className="mb-0"><span><b>ARN:</b> </span><span>{itemData.arn}</span></p> : null}
              {itemData.description ? <p className="mb-0"><span><b>Description:</b> </span><span>{itemData.description}</span></p> : null}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default ItemDetails

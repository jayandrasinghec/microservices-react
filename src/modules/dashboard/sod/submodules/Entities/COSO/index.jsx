import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  cardViewWrapper: {
    padding: theme.spacing(3, 2),
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
  }
}));

export const COSO = (props) => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Box className={classes.cardViewWrapper}>
          <Grid container spacing={2}>
            COSO
          </Grid>
        </Box>
      </Grid>
    </Grid>  
  )
}
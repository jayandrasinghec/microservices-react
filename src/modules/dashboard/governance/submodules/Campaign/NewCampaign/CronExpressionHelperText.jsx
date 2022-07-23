import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Grid } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles((theme) => ({
  helpText: {
    background: "#f1e09a",
    padding: "16px",
    borderRadius: "4px",
    '& div': {
      display: 'flex',
      alignItems: 'center',
      marginBottom: "8px",
      '& svg': {
        marginRight: '4px',
      }
    }
  },
  tableDiv: {
    overflow: 'auto',
    transition: 'all 1s ease',
    '&::-webkit-scrollbar': {
      width: '2px'
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent'
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'transparent'
    }
  },
  table: {
    display: 'table',
    width: '100%',
    overflowX: 'scroll',
    whiteSpace: 'nowrap',
    '&.table-bordered' :{
      border:'1px solid #343a40'
    },
    '&.table-bordered > thead > tr > th': {
        border:'1px solid #343a40'
    },
    '&.table-bordered > tbody > tr > td': {
        border: '1px solid #343a40'
    }
  }
}));

const CronExpressionHelperText = (props) => {
  const classes = useStyles();

  const [showCronEx, setShowCronEx] = useState(false)

  return (
    <Box className={classes.helpText}>
      <div><ErrorOutlineIcon />CRON Expression Guide </div>
      <div>The cron expression is made of five fields. Each field can have the following values.</div>
      <div className={clsx(classes.tableDiv, "col col-sm-12 col-md-12 col-lg-12 col-xl-12")}>
        <table className={clsx(classes.table, "table table-bordered text-center")}>
          <thead className="thead-dark">
            <tr>
              <th scope="col">*</th>
              <th scope="col">*</th>
              <th scope="col">*</th>
              <th scope="col">*</th>
              <th scope="col">*</th>
              <th scope="col">*</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <p className="my-0">second</p>
                <p className="my-0">(0 - 59)</p>
              </td>
              <td>
                <p className="my-0">minute</p>
                <p className="my-0">(0 - 59)</p>
              </td>
              <td>
                <p className="my-0">hour</p>
                <p className="my-0">(0 - 23)</p>
              </td>
              <td>
                <p className="my-0">day of the month </p>
                <p className="my-0">(1 - 31)</p>
              </td>
              <td>
                <p className="my-0">month</p>
                <p className="my-0">(1 - 12)</p>
                <p className="my-0">(or JAN-DEC)</p>
              </td>
              <td>
                <p className="my-0">day of the week</p>
                <p className="my-0">(0 - 7)</p>
                <p className="my-0">(0 or 7 is Sunday, or MON-SUN)</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <Button onClick={() => setShowCronEx(!showCronEx)}>View CRON Examples</Button>
      </div>
      {showCronEx && (
        <div className={clsx(classes.tableDiv, "col col-sm-12 col-md-12 col-lg-12 col-xl-12")}>
          <table className={clsx(classes.table, "table table-bordered text-center")}>
            <thead className="thead-dark">
              <tr>
                <th scope="col">Cron expression	</th>
                <th scope="col">Schedule</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0 0 * * * *</td>
                <td>Once an hour</td>
              </tr>
              <tr>
                <td>0 0 0 * * *</td>
                <td>Once a day</td>
              </tr>
              <tr>
                <td>0 0 0 * * 0</td>
                <td>Once a week</td>
              </tr>
              <tr>
                <td>0 0 0 1 * *</td>
                <td>Once a month</td>
              </tr>
              <tr>
                <td>0 0 0 1 1 *</td>
                <td>Once a year</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </Box>
  )
}

export default CronExpressionHelperText

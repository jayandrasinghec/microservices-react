import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import { Doughnut } from 'react-chartjs-2';


const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        padding: '20px'
    },
    card:{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        wordWrap: 'break-word',
        backgroundColor: 'white',
        border: '1px solid rgba(0,0,0,.125)',
        borderRadius: '5px',
        padding: '20px',
        border: 'none',
        // borderBottom: '3px solid'
    },
    cardContent: {

    },
    count: {
        paddingLeft: '30px',
        PaadingTop: '10px',
        fontSize: '23px',
        fontWeight: 'bold',
    },
    couterLabel: {
        paddingTop: '10px',
        color: 'grey'
    },
    rowOneRight: {
        backgroundColor: 'white',
        borderRadius: '5px',
        padding: '20px',
        // width:'50%',
        height: '100%'
    },
    headone: {
        fontSize: '14px',
        marginBottom: '20px',
    },
}))

const COLORS_SERIES = ['#4C6085','#43E0FA'];

export default function Insight() {
    const classes = useStyles();
    const options = {}
    const data = {
        labels: ['Pass', 'Fail'],
        datasets : [{
          data: [60, 40],
          backgroundColor: COLORS_SERIES,
          // borderColor: COLORS_SERIES,
          // hoverBorderColor: COLORS_SERIES
        }]
      }

    const CardComponent = (color, count, content) => (
        <div className={classes.card} style={{ borderBottom: `3px solid ${color}`}}>
            <div className={classes.cardContent}>
                <WarningIcon style={{ color: color }}  fontSize="large" /><span className={classes.count}>{count}</span>
            </div>
            <div className={classes.couterLabel}>
                {content}
            </div>
        </div>
    )

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            {CardComponent('red', '6', 'Critical Alerts')}
                        </Grid>
                        <Grid item xs={6}>
                            {CardComponent('orange', '10', 'High Alerts')}
                        </Grid>
                        <Grid item xs={6}>
                            {CardComponent('yellow', '2', 'Medium Alerts')}
                        </Grid>
                        <Grid item xs={6}>
                            {CardComponent('green', '40', 'Low Alerts')}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={4}>
                    <div className={classes.rowOneRight}>
                        <h3 className={classes.headone}>Compliance</h3>
                        <Doughnut data={data} options={options} />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}
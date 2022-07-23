import React,{Component} from 'react';
import {withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';

const styles = theme => ({

    cardViewWrapperTitle: {
        fontSize:18,
        fontWeight:500,
        marginBottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        height: '48',
        lineHeight: 2.6,
    }

});

class CardViewWrapperTitle extends Component {
    render() {
        const {classes, children} = this.props;
        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography gutterBottom className={classes.cardViewWrapperTitle}>
                  {children}
                  </Typography>
                </Grid>
              </Grid>
        );
    }

}

export default withStyles(styles)(CardViewWrapperTitle);

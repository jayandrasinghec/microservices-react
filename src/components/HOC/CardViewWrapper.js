import React,{Component} from 'react';
import {withStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';

const styles = theme => ({

    cardViewWrapper: {
        padding: theme.spacing(3,2),
        backgroundColor: "#eef1f8",
        borderRadius: 8,
        margin:16,
    }

});

class CardViewWrapper extends Component {
    render() {
        const {classes, children} = this.props;
        return (
            <Box className={classes.cardViewWrapper}>
                {children}
            </Box>
        );
    }

}

export default withStyles(styles)(CardViewWrapper);

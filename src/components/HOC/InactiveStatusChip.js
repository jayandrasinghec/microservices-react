import React,{Component} from 'react';
import {withStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';

const styles = theme => ({

    inactiveStatusChip: {
        background: "#c84040",
        color:"#fff",
        borderRadius: 20,
        textAlign: "center",
        textTransform: "capitalize",
        fontSize: 14,
        width: "fit-content",
        padding: "4px 16px",
    }

});

class InactiveStatusChip extends Component {
    render() {
        const {classes, children} = this.props;
        return (
            <Box className={classes.inactiveStatusChip}>
                {children}
            </Box>
        );
    }

}

export default withStyles(styles)(InactiveStatusChip);

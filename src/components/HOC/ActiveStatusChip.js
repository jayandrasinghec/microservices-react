import React,{Component} from 'react';
import {withStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';

const styles = theme => ({

    activeStatusChip: {
        background: "#6dc497",
        color:"#fff",
        borderRadius: 20,
        textAlign: "center",
        textTransform: "capitalize",
        fontSize: 14,
        width: "fit-content",
        padding: "4px 16px",
    }

});

class ActiveStatusChip extends Component {
    render() {
        const {classes, children} = this.props;
        return (
            <Box className={classes.activeStatusChip}>
                {children}
            </Box>
        );
    }

}

export default withStyles(styles)(ActiveStatusChip);

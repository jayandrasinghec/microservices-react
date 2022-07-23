import React,{Component} from 'react';
import {withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    scrollWrapper: {
        height: "100%",
        overflow: "scroll",
    }

});

class ScrollWrapper extends Component {
    render() {
        const {classes, children} = this.props;
        return (
            <div className={classes.scrollWrapper}>
                {children}
            </div>
        );
    }

}

export default withStyles(styles)(ScrollWrapper);

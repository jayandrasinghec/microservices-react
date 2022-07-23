import React,{Component} from 'react';
import {withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    greyBtn: {
        color:"#707172",
        paddingLeft:0,
    }

});

class GreyBtn extends Component {
    render() {
        const {classes, children, onClick} = this.props;
        return (
            <Button size="small" className={classes.greyBtn} onClick={onClick}>
                {children}
            </Button>
        );
    }

}

export default withStyles(styles)(GreyBtn);

import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
});

class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open
    }
  }

  handleClose = () => {
    this.setState({
      open: false
    })
  }

  render() {
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <Backdrop className={classes.backdrop} open={open} onClick={() => this.handleClose()}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
}

export default connect(
  null,
  null
)(withStyles(styles)(Loader));

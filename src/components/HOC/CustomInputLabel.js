import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';

const styles = theme => ({
  customInputLabel: {
    color: "#000",
    fontSize: 14,
    display: "flex",
    fontWeight: "500",
    height: 14,
  }
});

class CustomInputLabel extends Component {
  render() {
    const { classes, children } = this.props;
    return (
      <InputLabel className={classes.customInputLabel}>
        {children}
      </InputLabel>
    );
  }

}

export default withStyles(styles)(CustomInputLabel);

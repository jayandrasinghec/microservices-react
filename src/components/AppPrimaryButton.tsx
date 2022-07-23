import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  divcontainer: { 
    opacity: 0.5, 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    width: '100%', 
    height: '100%', 
    alignItems: 'center', 
    textAlign: 'center', 
    flex: 1 },
}))

export default function AppPrimaryButton (props: any) {
  const classes = useStyles()
  return (
    <div className={classes.divcontainer}>
      {/* <div>
        <Typography variant="h4" gutterBottom>
          Nothing here!
        </Typography>
      </div> */}
      <div>
        <Typography variant="subtitle1" gutterBottom>
          There are no results here. {props.comment}
        </Typography>
      </div>
    </div>
  );
}
import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  containerdiv: { 
    opacity: 0.5, 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center',
    width: '100%', 
    alignItems: 'center', 
    textAlign: 'center', 
    minHeight: 500 
    },
}))




export default function ComingSoon () {
  const classes = useStyles()
  return (
    <div className={classes.containerdiv}>
      <div>
        <Typography variant="h4" gutterBottom>
          Coming Soon
        </Typography>
      </div>
      <div>
        <Typography variant="subtitle1" gutterBottom>
          This page will be coming soon!
        </Typography>
      </div>
    </div>
  );
}

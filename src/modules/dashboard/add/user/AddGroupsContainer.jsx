import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button';
// import Paper from '@material-ui/core/Paper';
// import PersonIcon from '@material-ui/icons/Person';
// import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
// import AddIcon from '@material-ui/icons/Add';
import AssignGroupsUserView from '../../../../components/AssignGroupsUserView'

// import { callApi } from '../../../../utils/api'
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
    // maxHeight: 500,
    marginBottom: '20px'
  },
  fields: {
    display: 'flex',
    marginTop: '10px',
    marginBottom: '10px'
  },
  textField: {
    backgroundColor: '#F7F7F7',
  },
  input: {
    height: 40
  },
  selectRoot: {
    height: 33,
  },
  select: {
    height: 33,
    paddingTop: 0,
    paddingBottom: 0,
    verticalAlign: "middle"
  },
  container: {
    backgroundColor: '#EEF1F8',
    borderRadius: '8px',
    padding: 15,
    overflow: 'auto'
  },
  link: {
    padding: 10,
    marginTop: 15 
}
}))

export default function AddTwo(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <AssignGroupsUserView userId={props.match.params.id} {...props} />
        <br />
        <Link
          className={classes.link}
          to={`/dash/directory/add/user/${props.match.params.id}/applications`}>
          <div className="primary-btn-view">Next</div>
          {/* <Button variant="contained" color="primary">Next</Button> */}
        </Link>
      </div>
    </div>
  )
}
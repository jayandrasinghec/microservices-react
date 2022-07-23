import React from 'react';
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AssignUserApplicationView from '../../../../components/AssignUserApplicationView'
import { Link } from 'react-router-dom'


const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
    marginBottom: '20px'
  },

  container: {
    backgroundColor: '#E9EDF6',
    borderRadius: '8px',
    padding: 15,
    overflow: 'auto'
  },

  link: {
    padding: 10,
    marginTop: 15
  }
}))

const downloadAppData = () => {
}

export default function AddOne(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <AssignUserApplicationView userId={props.match.params.id} onUpdate={downloadAppData} />
        <br />
        <Link
          className={classes.link}
          to={`/dash/directory/user/${props.match.params.id}`}>
          <div className="primary-btn-view">Next</div>
        </Link>
      </div>
    </div>
  )
}

import React, { useState } from 'react';
import UploadFile from '../../../components/Import/Import/UploadFile/UploadFile';
import FileInfo from '../../../components/Import/Import/FileInfo/FileInfo';
import Progress from '../../../components/Import/Import/Progress/Progress';
import { useHistory } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { makeStyles, Stepper, StepLabel, Step } from '@material-ui/core';
import { Description, Dashboard } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  stepper: {
    maxWidth: '50vw',
    margin: '0 auto',
    width: '100%',
    backgroundColor: 'transparent'
  },
  steplabel: {
    color: '#363793'
  }
}));

const ImportFile = () => {
	const classes = useStyles();
	const history = useHistory();
	
	const [uploadedData, setUploadedData] = useState([]);

	const activeStep = history.location.pathname.indexOf('/info') >= 0 ? 1 : history.location.pathname.indexOf('/progress') >= 1 ? 2 : 0;
	
	const steps = [
    {
      name: 'Upload File',
      Icon: Description
    },
    {
      name: 'File Info',
      Icon: Dashboard
    }
  ]

	return(
		<>
		<Stepper activeStep={activeStep} className={classes.stepper}>
			{steps.map(label => {
				const stepProps = {};
				const labelProps = {};

				return (
					<Step key={label} {...stepProps}>
						<StepLabel {...labelProps}><label.Icon className={classes.steplabel} /> {label.name}</StepLabel>
					</Step>
				)
			})}
		</Stepper>
		<Switch>
			<Route exact path='/dash/sod/import/:type/file/upload' component={() => <UploadFile setUploadData={setUploadedData} />} />
			<Route exact path='/dash/sod/import/:type/file/info' component={() => <FileInfo uploadedData={uploadedData} />} />
			<Route exact path='/dash/sod/import/:type/file/progress' component={() => <Progress />} />
		</Switch>
		</>
	);
}

export default ImportFile;
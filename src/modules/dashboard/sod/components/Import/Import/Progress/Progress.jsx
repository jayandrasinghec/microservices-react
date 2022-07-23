import React, { useEffect, useState } from 'react';
import { Box, LinearProgress, Typography, withStyles } from '@material-ui/core';
import { useHistory } from 'react-router';
import { callApi } from '../../../../../../../utils/api';
import { useLocation, useParams } from 'react-router-dom';

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 20,
    borderRadius: 10,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 250 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: theme.palette.success.main,
  },
}))(LinearProgress);


const Progress = ({ }) => {

  const history = useHistory();
  const location = useLocation();
  const { type } = useParams();

  const [progress, setProgress] = useState(0);
  const [id, setId] = useState(location.state && location.state.id ? location.state.id : '');
  
  const getProgress = () => {
    let url = '';
    if(type === 'entities'){
      url = `/sod/import/sodentities/getProgress/${id}`
    }
    if(type === 'policies'){
      url = `/sod/import/policyRule/getProgress/${id}`
    }
    callApi(url)
      .then(res => {
        if(res.success) {
          setProgress(res.data.percent)
          if(res.data.importStatus === 'COMPLETE') {
            history.push({ pathname: `/dash/sod/import/${type}/importSummary/created`, state: { id: id } })
          }
        }
      })
      .catch(err => {})
  }
  
  useEffect(() => {
    if(id && id !== null && id !== undefined && id !== ''){
      getProgress()
    }else{
      history.push('/dash/sod/import');
    }
  }, [progress])

  useEffect(() => {
    setInterval(()=>{
      setProgress((prev)=>prev+1)
    }, 2000)
  }, [])

	return(
		<Box display="flex" alignItems="center" padding="32px" marginTop="32px">
			<Box width="100%" mr={1}>
				<BorderLinearProgress variant="determinate" value={progress} />
			</Box>
			<Box minWidth={35}>
				<Typography variant="body2">{progress}%</Typography> 
			</Box>
		</Box>
	);
}

export default Progress;
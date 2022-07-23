import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import * as _ from 'underscore'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
// import AppBar from '@material-ui/core/AppBar';
import { TabPanel } from '@material-ui/lab';

import Stage from '../../../components/Stage'
import { PutCampaignStage } from '../../../actions/CampaignActions';
import CustomInputLabel from '../../../../../../components/HOC/CustomInputLabel';
import { isActiveForRoles } from '../../../../../../utils/auth';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  stepperContent: {
    padding: theme.spacing(4),
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  txtFieldGutter: {
    marginBottom: theme.spacing(3),
  },
  calendarIcon: {
    color: '#989898'
  },
  link: {
    paddingBottom: 5,
    marginTop: '10px',
    marginLeft: '30px',
    fontSize: 14,
    transition: 'all 0.1s ease',
    //fontWeight: 'bold !important',
    color: '#1F4287',
    textDecorationLine: 'none',
    '&:hover': {
      fontWeight: 'bold',
      color: '#363795',
      borderBottom: '3px solid #1F4287',
    },
    '&:active': {
      fontWeight: 'bold !important',
      borderBottom: '3px solid #363795 !important',
      color: '#363795',
    },
    cursor: 'pointer'
  },
  activeLink: {
    fontWeight: 'bold !important',
    borderBottom: '3px solid #1F4287',
    color: '#1F4287',
  },
  gutterZero: {
    paddingTop: '0px !important',
    paddingBottom: '0px !important',
  },
  btnDefault: {
    color: '#989898'
  },
  reviewValue: {
    marginTop: theme.spacing(2),
  },
  custRadioWrapper: {

    border: '1px solid #ccc',
    borderRadius: 8,
    margin: '8px 0px',

  },
  formControl: {
      marginBottom: '0px !important'
  }
}));

const defaultData = {
  stages: {
    "1":{
      "name":"",
      "description":"",
      "duration":"",
      "notifyBeforeDeadline":"",
      "notifyOnlyWhenNoDecision":false,
      "userId":"",
      "reportingManager":false
   }
  }
}


export default function CampaignStage(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const currentStage = props.match.params.currentStage
  const type = props.type
  const id = props.match.params.id
  const campaignStage = props.campaignStage
  const editCampaignStages = campaignStage ? _.size(campaignStage) : null

  const [stage, setStage] = React.useState(editCampaignStages || 1)
  const [value, setValue] = React.useState(1);
  const [newData, setNewData] = React.useState(campaignStage || { 1: {} })
  


  const handleChange = function handleChange (e) {
    setStage(e.target.value)
    let obj = {
      1: newData ? newData[1] : {}
    }
    if(e.target.value === 2){
      obj[2] = newData ? newData[2] : {}
    }else if(e.target.value === 3){
      obj[2] = newData ? newData[2] : {}
      obj[3] = newData ? newData[3] : {}
    }
    setNewData(obj)
    setValue(1)
  }
  

  const handleNext = function handleNext(data, currStage) {
    // if(type === 'edit'){
    //   const editData = data
    //   delete editData.userName
    //   dispatch(PutCampaignStage(editData, id, currStage, history))
    //   return
    // }else{
    //   newData[currStage] = data
      if(currStage < stage) {
        let obj = newData
        obj[currStage] = data
        setNewData(newData)
        const nextStage = parseInt(currStage) + 1;
        setValue(nextStage)
        // props.history.push(`/dash/governance/campaign/create/123/stage/${nextStage}`)
      }else{
        let obj = newData
        obj[currStage] = data
        let sentData = {}
        sentData.stages = obj
        // console.log('sentData',sentData)
        dispatch(PutCampaignStage(sentData, id, type, history)) 
    }
    // console.log(newData)
    // }
  };

  const handleNextStage = (currStage) => {
    const nextStage = parseInt(currStage) + 1
    setValue(nextStage)
    // props.history.push(`/dash/governance/campaign/edit/${id}/stage/${nextStage}`)
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value != index}
        id={`wrapped-tabpanel-${index}`}
        aria-labelledby={`wrapped-tab-${index}`}
        className="pt-3"
        {...other}
      >
        {value == index && (
            <Stage
                currentStage={value}
                data={newData[value] || {}}
                setNewData={setNewData}
                stages={stage}
                id={id}
                handleNext={handleNext}
                handleNextStage={handleNextStage}
                type={props.type}
            />
        )}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `wrapped-tab-${index}`,
      'aria-controls': `wrapped-tabpanel-${index}`,
    };
  }

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item xs={10}>
        <Paper className={classes.stepperContent}>
          <Grid container spacing={4}>
            {/* {currentStage == 1 ? ( */}
              <Grid item xs={6} >
              <CustomInputLabel>Select Total Stages</CustomInputLabel>
              <FormControl variant="outlined" className={classes.formControl} margin="dense" fullWidth>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  ariant="outlined"
                  fullWidth
                  value={stage}
                  disabled={!isActiveForRoles(['ORG_ADMIN'])}
                  onChange={handleChange}
                  // onChange={e => setStage(e.target.value)}
                >
                  <MenuItem value={1}>One</MenuItem>
                  <MenuItem value={2}>Two</MenuItem>
                  <MenuItem value={3}>Three</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
                {/* <div className={classes.root}> */}
                    {/* <AppBar position="static"> */}
                        <Tabs value={value} textColor="primary" indicatorColor="primary" onChange={handleTabChange} aria-label="wrapped label tabs example">
                            {Object.keys(newData).map((item, k) => {
                                return <Tab value={parseInt(item)} key={k} label={`Stage ${item}`} wrapped {...a11yProps(item)} />
                            })}
                        {/* <Tab
                            value="one"
                            label=""
                            wrapped
                            {...a11yProps('one')}
                        />
                        <Tab value="two" label="Item Two" {...a11yProps('two')} />
                        <Tab value="three" label="Item Three" {...a11yProps('three')} /> */}
                        </Tabs>
                    {/* </AppBar> */}
                    <TabPanel value={value} index={1} type={type}>
                        Item One
                    </TabPanel>
                    <TabPanel value={value} index={2} type={type}>
                        Item Two
                    </TabPanel>
                    <TabPanel value={value} index={3} type={type}>
                        Item Three
                    </TabPanel>
                {/* </div> */}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

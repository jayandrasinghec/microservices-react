import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CustomInputLabel from '../../../../../components/HOC/CustomInputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Checkbox from '@material-ui/core/Checkbox';
import InputAdornment from '@material-ui/core/InputAdornment';
import EventIcon from '@material-ui/icons/Event';
import GreyBtn from '../../../../../components/HOC/GreyBtn';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles((theme) => ({
  cusStepper: {
    backgroundColor: 'transparent',
    '& .MuiStepLabel-label': {
      color: '#1f4287',
      fontWeight: 400,
    },
    '& .Mui-disabled .MuiSvgIcon-root': {
      fill: '#808080',
      border: '4px solid #808080',
      background: '#808080',
    },
    '& .MuiSvgIcon-root': {
      fill: '#fff',
      border: '4px solid #1f4287',
      borderRadius: 20,
      background: '#fff',
    },
    '& .MuiStepConnector-alternativeLabel': {
      left: 'calc(-50% + 12px)',
      right: 'calc(50% + 12px)',
    }
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

  }
}));

function getSteps() {
  return ['Campaign Details', 'Scope', 'Stages'];
}

function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return 'Select campaign settings...';
    case 1:
      return 'What is an ad group anyways?';
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Unknown stepIndex';
  }
}

export default function CreateCampaign() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = function handleNext() {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = function handleBack() {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item xs={10}>
        <Stepper activeStep={activeStep} alternativeLabel className={classes.cusStepper}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel icon={<FiberManualRecordIcon />}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={10}>
            <Paper className={classes.stepperContent}>
              {/* first Step */}
              {
                activeStep === 0 &&
                <>
                  <Grid container spacing={4}>
                    <Grid item xs={6} >
                      <CustomInputLabel>Name</CustomInputLabel>
                      <TextField id="outlined-basic" variant="outlined" margin="dense" fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                      <CustomInputLabel></CustomInputLabel>
                      <RadioGroup row>
                        <FormControlLabel
                          value="top"
                          control={<Radio color="primary" />}
                          label="Start Now"
                          labelPlacement="end"
                        />
                        <FormControlLabel
                          value="start"
                          control={<Radio color="primary" />}
                          label="Start Later"
                          labelPlacement="end"
                        />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={6} >
                      <CustomInputLabel>Description</CustomInputLabel>
                      <TextField
                        id="outlined-multiline-static"
                        label="Multiline"
                        multiline
                        rows={6}
                        variant="outlined"
                        fullWidth
                        margin='dense'
                      />
                    </Grid>
                    <Grid item xs={6} >
                      <CustomInputLabel>Starts on</CustomInputLabel>
                      <TextField id="outlined-basic" variant="outlined" margin="dense" fullWidth className={classes.txtFieldGutter} InputProps={{
                        endAdornment: <InputAdornment position="end"><EventIcon className={classes.calendarIcon} /></InputAdornment>,
                      }} />
                      <CustomInputLabel>Certification completion period (in days)</CustomInputLabel>
                      <TextField id="outlined-basic" variant="outlined" margin="dense" fullWidth />
                    </Grid>
                    <Grid item xs={12} className={classes.gutterZero}>
                      <FormControlLabel
                        value="end"
                        control={<Checkbox color="primary" />}
                        label="Repeat Occurence"
                        labelPlacement="end"
                      />
                    </Grid>
                    <Grid item xs={6} >
                      <CustomInputLabel>Frequency in days</CustomInputLabel>
                      <TextField id="outlined-basic" variant="outlined" margin="dense" fullWidth />
                    </Grid>
                    <Grid item xs={6} >
                      <CustomInputLabel>Frequency</CustomInputLabel>
                      <FormControl variant="outlined" className={classes.formControl} margin="dense" fullWidth>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          ariant="outlined"
                          fullWidth
                        >
                          <MenuItem value={10}>Weekly</MenuItem>
                          <MenuItem value={20}>Monthly</MenuItem>
                          <MenuItem value={30}>Quaterly</MenuItem>
                          <MenuItem value={30}>Half Yearly</MenuItem>
                          <MenuItem value={30}>Anually</MenuItem>

                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} >
                      <GreyBtn>Discard</GreyBtn>
                    </Grid>
                    <Grid item xs={6} container justify="flex-end">
                      <Button onClick={handleNext} color="primary" variant="contained" disableElevation size="small">
                        Next
                      </Button>
                    </Grid>
                  </Grid>
                </>
              }

              {/* first Step ends*/}

              {/* second Step */}
              {
                activeStep === 1 &&
                <>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <CustomInputLabel>Who does this rule apply to</CustomInputLabel>
                      <RadioGroup>
                        <FormControlLabel
                          value="top"
                          control={<Radio color="primary" />}
                          label="All Users"
                          labelPlacement="end"
                          className={classes.custRadioWrapper}
                        />
                        <FormControlLabel
                          value="start"
                          control={<Radio color="primary" />}
                          label="Top specific organization groups, and users applications"
                          labelPlacement="end"
                          className={classes.custRadioWrapper}
                        />
                      </RadioGroup>

                    </Grid>
                    <Grid item xs={12}>
                      <CustomInputLabel>Applications</CustomInputLabel>
                      <TextField id="outlined-basic" variant="outlined" margin="dense" fullWidth />
                    </Grid>

                    <Grid item xs={12}>
                      <CustomInputLabel>Groups</CustomInputLabel>
                      <TextField id="outlined-basic" variant="outlined" margin="dense" fullWidth />
                    </Grid>

                    <Grid item xs={12}>
                      <CustomInputLabel>Users</CustomInputLabel>
                      <TextField id="outlined-basic" variant="outlined" margin="dense" fullWidth />
                    </Grid>

                    <Grid item xs={12}>
                      <CustomInputLabel>Exclusion User</CustomInputLabel>
                      <TextField id="outlined-basic" variant="outlined" margin="dense" fullWidth />
                    </Grid>

                    <Grid item xs={6}>
                      <GreyBtn onClick={handleBack}>Previous</GreyBtn>
                      <GreyBtn>Discard</GreyBtn>
                    </Grid>
                    <Grid item xs={6} container justify="flex-end">
                      <Button onClick={handleNext} color="primary" variant="contained" disableElevation size="small">
                        Next
                      </Button>
                    </Grid>
                  </Grid>
                </>
              }

              {/* second Step end*/}

              {/* third Step */}
              {
                activeStep === 2 &&
                <Grid container spacing={4}>
                  <Grid item xs={6} >
                    <CustomInputLabel>Select Stage</CustomInputLabel>
                    <FormControl variant="outlined" className={classes.formControl} margin="dense" fullWidth>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        ariant="outlined"
                        fullWidth
                        defaultValue={10}
                      >
                        <MenuItem value={10}>One</MenuItem>
                        <MenuItem value={20}>Two</MenuItem>
                        <MenuItem value={30}>Three</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                  </Grid>
                  <Grid item xs={6} >
                    <CustomInputLabel>Name</CustomInputLabel>
                    <TextField id="outlined-basic" variant="outlined" margin="dense" fullWidth />
                  </Grid>
                  <Grid item xs={6}>
                  </Grid>
                  <Grid item xs={6} >
                    <CustomInputLabel>Description</CustomInputLabel>
                    <TextField
                      id="outlined-multiline-static"
                      label="Multiline"
                      multiline
                      rows={6}
                      variant="outlined"
                      fullWidth
                      margin='dense'
                    />
                  </Grid>
                  <Grid item xs={6} >
                    <CustomInputLabel>Duration</CustomInputLabel>
                    <TextField id="outlined-basic" variant="outlined" margin="dense" fullWidth className={classes.txtFieldGutter} />
                    <CustomInputLabel>Notify before deadline</CustomInputLabel>
                    <TextField id="outlined-basic" variant="outlined" margin="dense" fullWidth />
                  </Grid>
                  <Grid item xs={12} className={classes.gutterZero}>
                    <FormControlLabel
                      value="end"
                      control={<Checkbox color="primary" />}
                      label="Notify only when no decision"
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomInputLabel>Level one approver</CustomInputLabel>
                    <RadioGroup row>
                      <FormControlLabel
                        value="top"
                        control={<Radio color="primary" />}
                        label="User"
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        value="start"
                        control={<Radio color="primary" />}
                        label="Group"
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        value="start"
                        control={<Radio color="primary" />}
                        label="Reporting Manager"
                        labelPlacement="end"
                      />
                    </RadioGroup>
                    <TextField id="outlined-basic" variant="outlined" margin="dense" fullWidth />
                  </Grid>
                  <Grid item xs={6}>
                  </Grid>

                  <Grid item xs={6} >
                    <CustomInputLabel>Default reviewer reference</CustomInputLabel>
                    <TextField id="outlined-basic" variant="outlined" margin="dense" fullWidth />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomInputLabel>Stop review on</CustomInputLabel>
                    <Typography className={classes.reviewValue}> default </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <GreyBtn onClick={handleBack}>Previous</GreyBtn>
                    <GreyBtn>Discard</GreyBtn>
                  </Grid>
                  <Grid item xs={6} container justify="flex-end">
                    <Button color="primary" variant="contained" disableElevation size="small">
                      Submit
                  </Button>
                  </Grid>
                </Grid>
              }
              {/* third Step end */}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

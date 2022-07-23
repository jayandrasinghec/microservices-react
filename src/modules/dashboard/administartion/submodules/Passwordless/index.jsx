import React from 'react';

import { callApi } from '../../../../../utils/api';
import { showSuccess } from '../../../../../utils/notifications';
import { makeStyles } from '@material-ui/core/styles';
import {isActiveForRoles} from '../../../../../utils/auth'
import CardViewWrapper from "../../../../../components/HOC/CardViewWrapper";
import ScrollWrapper from "../../../../../components/HOC/ScrollWrapper";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
// import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';



const useStyles = makeStyles((theme) => ({
  container: { 
    overflow: 'auto' 
  },
  letteravatar: { 
    height: 50, 
    width: 50 
  },
  cardView: {
    padding: "8px",
    borderRadius: "8px",
    boxShadow: "none",
    '& .MuiCardActions-root': {
      display: "flex",
      padding: "0px 16px 8px 16px",
      height: 18,
    }
  },
  authTitle: {
    paddingBottom: "0px",
    '& .MuiCardHeader-content': {
      '& span': {
        fontSize: 16,
        lineHeight: "0px",
        marginTop: "-4px",
        color: "#1F4287",
        fontWeight: "600"
      }
    }
  },
  mfauthCardContent:{
    height: 100,
    overflow: "scroll",
  },
  cardTitle: {
    padding: theme.spacing(4),
    fontSize: 22,
    fontWeight: 500,
    color: "#141821",
    borderBottom: "1px solid #979797",
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(2),
    },
  },
  verificationBox: {
      padding: theme.spacing(4),
      [theme.breakpoints.down('md')]: {
          padding: theme.spacing(2),
      },
  },
  verification: {
      display: "flex",
      alignItems: "center",
      border: '1px solid black',
      padding: 10
  },
  verificationSelected: {
    display: "flex",
    alignItems: "center",
    border: '1px solid black',
    padding: 10,
    backgroundColor: '#363793',
    color: 'white'
},
  verificationIcon: {
      height: 48,
      marginRight: 16,
  },
  checkbox: {
    width: 15,
    height: 15,
    color: 'rgb(153,204,102)',
    marginRight: '5px',
    marginLeft: 10
  },
  
}))

export default function PasswordLess() {

  const classes = useStyles()
  const [checked, setChecked] = React.useState(false)
  const [factors, setFactors] = React.useState([])

  const downloadData = () => {
    callApi(`/authsrvc/pll/settings`)
      .then(e => {
        if(e.success){
          setChecked(e.data ? e.data.status : false)
          setFactors(e.data ? e.data.factors : [])
        }
      })
      .catch(e => console.log(e))
  }
  const handleStatus = (data) => {
    callApi(`/authsrvc/pll/${data}`, 'PUT')
      .then(e => {
        if(e.success) {
          setChecked(data)
          showSuccess('Status Updated Successfully', '200')
        }
      })
      .catch(e => console.log(e))
  }

  const handleFactorToggle = (factor, status) => {
    callApi(`/authsrvc/pll/factor/${factor}/${status}`, 'PUT')
      .then(e => {
        if(e.success) {
          downloadData()
          showSuccess('Factor Updated Successfully', '200')
        }
      })
      .catch(e => console.log(e))
  }

  const showName={
    SMSAuthenticator:'OTP Based',
    PushAuthenticator:'Consent Based',
    CymmetriAuthenticator:'TOTP Based',
  }
  const showDescription={
    SMSAuthenticator:'Allows the users to verify their identities with a One Time Password sent to their registered email address and/or mobile no.',
    PushAuthenticator:'Allow users to verify their identities with explicit consent from their registered devices. The user will be asked for approval on their Cymmetri Authenticator mobile application to allow access to Cymmetri.',
    CymmetriAuthenticator:'Allow users to verify their identities with 2-Factor Authentication (2FA) with Cymmetri Authenticator app. It is a mobile security app available on iOS and Android platforms that generates an alphanumeric secret key after setting up an account by scanning the QR code displayed on the Cymmetri IAM Cloud website. Users can use the Time Based OTP generated on their registered devices.',
  }

  React.useEffect(() => downloadData(), [])

  return (
    <>
      <ScrollWrapper>
        <Grid container>
          <Grid item xs={12}>
            <CardViewWrapper>
              <div style={{ float: 'right' }}>
                <span style={{ marginRight: 10 }}>Status</span>
                <FormControlLabel
                  control={
                    <Switch
                      name="toggleCA"
                      color="primary"
                      checked={checked}
                      disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                      onChange={(e) => handleStatus(e.target.checked)}
                    />
                  }
                />
              </div>

              <Grid container spacing={3}>
                {factors && factors.map((data, index) => {
                  return(
                    <Grid key={index} item xs={12} sm={12} md={6} lg={6}>
                      <Card className={classes.cardView}>
                        <CardHeader
                          action={
                            <FormControlLabel
                              control={
                                <Switch
                                  name="toggleCA"
                                  color="primary"
                                  checked={data.enabled}
                                  disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || checked === false}
                                  onChange={(e) => handleFactorToggle(data.type, e.target.checked)}
                                />
                              }
                            />
                          }
                          title={showName[data.type] || data.type}
                          className={classes.authTitle}
                        />
                        <CardContent>
                          <Typography variant="body2" color="textSecondary" component="p" className={classes.mfauthCardContent}>
                            {showDescription[data.type] || data.type}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )
                })}
              </Grid>
            </CardViewWrapper>
          </Grid>
        </Grid>
      </ScrollWrapper>
    </> 
  )
}

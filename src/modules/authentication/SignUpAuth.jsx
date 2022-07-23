import React from 'react'
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import RadioGroup from '@material-ui/core/RadioGroup';
import Paper from '@material-ui/core/Paper'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import LogoCCIO from '../../assets/LogoCCIO.png'
import LogoNoSpace from '../../FrontendDesigns/master-screen-settings/assets/img/icons/logo-nospace.svg'
import '../../FrontendDesigns/master-screen-settings/assets/css/main.css'
import '../../FrontendDesigns/master-screen-settings/assets/css/nice-select.css'
import '../../FrontendDesigns/master-screen-settings/assets/css/react-sign-up.css'

const useStyles = makeStyles((theme) => ({
radio: {
  backgroundColor: '#e7e7e7',
  color: '#e7e7e7',
  marginLeft: '10px',
  marginRight: '10px',
  width: 24,
  height: 24
}
}))

export default function SignUpAuth(props) {
  const classes = useStyles();
  const type = React.useState(props.match.params.id)
  const [radio, setRadio] = React.useState()
  return(
    <div>
      <h3 className="mb-2">Setup multifactor authentication</h3>
      <p className="font-small mb-3">Your company requires multifactor authentication to add an additional layer of security when signinng into your account</p>
      {/* <br/> */}
      <div style={{textDecoration:'none'}}>
        <div className="card mb-4">
          <a href="javascript:void(0);" className="p-4 authication-card">
            <img src={LogoNoSpace} alt="logo" className="mr-3"/>
            <p className="mb-0">{type[0] === 'cymmetri' ? "Cymmetri Authenticator" : type[0] === 'google' ? "Google Authenticator" : "SMS Authenticator"} <br/>
              <span>Enter single-use code from mobile app</span></p>
            </a>
        </div>     
      </div>
      <hr />
      <div style={{display: 'flex',marginTop:'16px'}}>
        <p style={{flexGrow:1}} className="mb-0">Select your device</p>
          <RadioGroup
            row aria-label="position" name="position" value={radio}
            onChange={event => setRadio(event.target.value)}>
            <div style={{ margin: '1px'}}>
              <FormControlLabel value="iphone" control={<Radio color="primary" name="type" classes={{ root: classes.radio }}/>} label="iPhone" />
            </div>
            <div style={{ margin: '1px'}}>
              <FormControlLabel value="android" control={<Radio color="primary" name="type" classes={{ root: classes.radio }}/>} label="Android" />
            </div>
          </RadioGroup>
      </div>
      <div className="media my-4">
        <img src={LogoNoSpace} alt="logo" className="mr-3"/>
        <p>Download <a href="javascript:void(0);" className="primary-color">mobile app from the google playstore</a> onto your mobile device</p>
      </div>
      <div class="row align-items-center justify-content-center">
        <div class="col-sm-8">
          <p class="mb-0">After installing the mobile app</p>
        </div>
        <div class="col-sm-3 text-right">
          <Link to={`/auth/signup/authorize/${type[0]}`} style={{paddingTop: '10px'}}>
            <Button disabled={radio ? false : true} variant="contained" color="primary" style={{float: 'right',borderRadius:'8px'}}>Next</Button>
          </Link>
        </div>
      </div>
      {/* <div style={{display: 'flex'}}>
        <div style={{margin: '10px', fontSize: '15px'}} ><p>After installing the mobile app</p></div>
        <div style={{flexGrow: '1', margin: '20px 10px'}}>
          <Link to="/auth/signup/authorize" style={{paddingTop: '10px'}}>
            <Button variant="contained" style={{float: 'right',borderRadius:'8px',backgroundColor:'#363795',color:'white'}}>Next</Button>
          </Link>
        </div>
      </div> */}
    </div>
  )
}
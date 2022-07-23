import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { callApi } from '../../../../../utils/api';
import { showSuccess, showError } from '../../../../../utils/notifications'
import AppSelectInput from '../../../../../components/form/AppSelectInput';
import AppTextInput from '../../../../../components/form/AppTextInput';
import AppCheckbox from '../../../../../components/form/AppCheckbox';
import { getAuthToken, isActiveForRoles } from '../../../../../utils/auth'
import { Checkbox, Collapse, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { CustomInputBox } from './CustomInputBox';
import clsx from 'clsx';
import CustomInputLabel from '../../../../../components/HOC/CustomInputLabel';
import { CustomInputCheckbox } from './CustomInputCheckbox';


const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flex: 1,
      },
      gridcontainer: {
        overflowY: 'auto',
        marginBottom: 15,
        marginTop: 15,
        marginLeft: '15px',
        marginRight: '15px',
        width: '100%' ,
        backgroundColor: '#EEF1F8',
        borderRadius: '10px',
      },
      griditemone: {
        paddingTop: 0,
        margin: '0px'
      },
      griditemtwo:{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '30px',
      },
      heading: {
          fontWeight: 'bold',
      },
      buttondiv: {
        display: 'flex',
        alignItems: 'center',
        margin: '35px 10px 10px'
      },
      button: {
        borderRadius: '8px'
      },
      button2: {
        padding: '10px 20px',
        fontSize: '16px'
      },
      downloadItem: {
        marginTop:'75px',
        background: 'white',
        height: '150px',
        borderRadius: '10px',
        padding: '30px',
        paddingBottom: '10px',
        margin: '0px'
      },
      custRadioWrapper: {
        border: '1px solid #ccc',
        borderRadius: 8,
        margin: '8px 0px',
      }
  }))

export default function OpenIdSettings(props) {
    const { id } = props.app
    const defaultvalues = {
        'id': id,
        'clientName': '',
        'clientId': '',
        'clientSecret': '',
        'redirectUris': [],
        'logoUri': '',
        'tosUri': '',
        'policyUri': '',
        // 'clientUri': '',
        'audience': [],
        'contacts': [],
        // 'scope': 'openid profile email',
        // commented below line to add static options in checkbox.
        // 'scope': [{'label':'openid', 'value': true}, {'label':'profile', 'value': true}, {'label':'email', 'value': true}],
        'scope': [],
        'grantTypes': ["authorization_code"],
        'responseTypes': ['code'],
        'subjectType': 'public',
        'sectorIdentifierUri': '',
        'tokenEndpointAuthMethod': 'client_secret_basic',
        'requestObjectSigningAlg': '',
        'userInfoSignedResponseAlg': '',
        'tokenEndpointAuthSigningAlg': ''
    }
     
    const classes = useStyles()
    const [openIdData, setOpenIdData] = React.useState(defaultvalues)
    const [mainCollapse, setMainCollapse] = React.useState(true)
    const [accessCollapse, setAccessCollapse] = React.useState(false)
    const [credentialCollapse, setCredentialCollapse] = React.useState(false)
    // const [tokensCollapse, setTokensCollapse] = React.useState(false)
    const [cryptoCollapse, setCryptoCollapse] = React.useState(false)
    // const [othersCollapse, setOthersCollapse] = React.useState(false)
    const [add, setAdd] = React.useState(false)
    const [errors, _setErrors] = React.useState({})
    
    const setError = e => _setErrors({ ...errors, ...e })

    // Commented constructScopeObj & deconstructScopeObj functions to add static options in checkbox
    // const constructScopeObj = (data) => {
    //   let arr = data.split(' ');
    //   // console.log(arr);
    //   let newArr = [];
    //   arr.map(a => {
    //     let obj = {};
    //     obj['label'] = a;
    //     obj['value'] = true
    //     newArr.push(obj)
    //   })
    //   // console.log('newArr', newArr);
    //   return newArr;
    // }
    // // constructScopeObj(sampleScope)

    // const deconstructScopeObj = (data) => {
    //   let filteredArr = data.filter(a => a.value !== false)
    //   let scopeStr = filteredArr.map(v => v.label)
    //   return scopeStr.join(' ');
    // }
    // // deconstructScopeObj(sampleScope)

    const constructScopeArr = (data) => {
      let arr = data.split(' ');
      return arr;
    }

    const deconstructScopeArr = (data) => {
      return data.join(' ');
    }
    
    const options = ['HS256','HS384','HS512','RS256','RS384','RS512','ES256','ES384','ES512','PS256','PS384','PS512']
    const labels = [
      'HMAC using SHA-256',
      'HMAC using SHA-384',
      'HMAC using SHA-512',
      'RSASSA-PKCS1-v1_5 using SHA-256',
      'RSASSA-PKCS1-v1_5 using SHA-384',
      'RSASSA-PKCS1-v1_5 using SHA-512',
      'ECDSA using P-256 and SHA-256',
      'ECDSA using P-384 and SHA-384',
      'ECDSA using P-521 and SHA-512',
      'RSASSA-PSS using SHA-256 and MGF1 with SHA-256',
      'RSASSA-PSS using SHA-384 and MGF1 with SHA-384',
      'RSASSA-PSS using SHA-512 and MGF1 with SHA-512'
    ]
    
    const change = e => {
        setOpenIdData({ ...openIdData, ...e })
    }

    const onSave = () => {
      let postData = openIdData;
      // postData.scope = deconstructScopeObj(openIdData.scope)
      postData.scope = deconstructScopeArr(openIdData.scope)
      callApi(`/sso-config/openidConfig/createClient`, 'POST', postData)
        .then((e) => {
          if(e.success){
            let newData = e.data;
            // newData.scope = e.data && constructScopeObj(e.data.scope)
            newData.scope = e.data && constructScopeArr(e.data.scope)
            setOpenIdData(newData) 
            showSuccess('OpenID config added successfully.')
            setAdd(false)
            alert(`Your client secret is ${e.data.clientSecret}`)
          }
        })
    }
    
    const getOpenIDConfig = () => {
      callApi(`/sso-config/openidConfig/getClient/${id}`)
        .then(e => {
          if(e.success){
            let newData = e.data;
            // newData.scope = e.data && constructScopeObj(e.data.scope)
            newData.scope = e.data && constructScopeArr(e.data.scope)
            setOpenIdData(newData) 
          }
        })
        .catch((err) => {
          if(err.errorCode === 'SSOCONFIGSRVC.OPENID_CLIENT_NOT_FOUND'){
            setAdd(true)
          }
        })
    }

    const onUpdate = () => {
      let postData = openIdData;
      // postData.scope = deconstructScopeObj(openIdData.scope)
      postData.scope = deconstructScopeArr(openIdData.scope)
      callApi(`/sso-config/openidConfig/updateClient/${id}`, 'POST', postData)
        .then((e) => {
          if(e.success){
            let newData = e.data;
            // newData.scope = e.data && constructScopeObj(e.data.scope)
            newData.scope = e.data && constructScopeArr(e.data.scope)
            setOpenIdData(newData) 
            setAdd(false)
            showSuccess('OpenID config updated successfully.')
          }
        })
        .catch((err) => {
          let newData = openIdData;
          // newData.scope = constructScopeObj(openIdData.scope)
          newData.scope = constructScopeArr(openIdData.scope)
          setOpenIdData(newData)
        })
    }

    React.useEffect(() => {
      getOpenIDConfig()
    }, [])

    const radioChange = e => {
      change({...openIdData ,tokenEndpointAuthMethod : e.target.value})
    }

    const changeSubjectRadio = e => {
      change({...openIdData ,subjectType : e.target.value})
    }

    const handleGrantTypes = e => {
      if(e.target.checked){
        change({ grantTypes: [...openIdData.grantTypes ,e.target.value] })
      } else {
        let arr = openIdData.grantTypes.filter(val => val !== e.target.value);
        change({grantTypes: arr})
      }
    }

    const handleScope = e => {
      if(e.target.checked){
        change({ scope: [...openIdData.scope ,e.target.value] })
      } else {
        let arr = openIdData.scope.filter(val => val !== e.target.value);
        change({scope: arr})
      }
    }

    const handleResponseTypes = e => {
      if(e.target.checked){
        change({ responseTypes: [...openIdData.responseTypes ,e.target.value] })
      } else {
        let arr = openIdData.responseTypes.filter(val => val !== e.target.value);
        change({responseTypes: arr})
      }
    }

    const checkClientId = () => {
      if ((openIdData.clientId || '').length === 0) {
        setError({clientId: 'Client ID is required'})
      } else {
        setError({clientId: null})
      }
    }

    const checkRedirectUris = () => {
      if((openIdData.redirectUris).length < 1) {
        setError({redirectUris: 'At least one redirect URI is required'})
      } else {
        setError({redirectUris: null})
      }
    }

    // Commented below functions to add static options in checkbox
    // const checkScope = () => {
    //   let newScopeData = openIdData.scope;
    //   let filteredArr = newScopeData.filter(a => a.value !== false)
    //   let filteredArrKey = filteredArr.filter(a => a.label === 'openid')

    //   if((filteredArr).length < 1) {
    //     setError({scope: 'At least one scope is required'})
    //   } else if((filteredArrKey).length !== 1){
    //     setError({scope: 'openid scope is required'})
    //   } else {
    //     setError({scope: null})
    //   }
    // }

    const isValid = !Object.values(errors).some(e => e != null) && openIdData.clientId && openIdData.redirectUris.length > 0 && openIdData.scope.length > 0;
  
    return (
        <div className={classes.container}>
            <Grid container spacing={3} className={classes.gridcontainer + " justify-content-around"}>
                <Grid item xs={12} md={12} className={classes.griditemone}>
                    <Grid className={classes.griditemtwo}>
                        <div className="accordion cym-custom-scroll " id="accordionExample">
                            <div className="settings-table-card row" id="headingOne">
                                <div className="col-12 col-md-12" onClick={() => { setMainCollapse(!mainCollapse) }} style={{color: '#363795', cursor: 'pointer', padding: '0px 0px 10px'}}>
                                    <span>Main</span>
                                    <span className="float-right">{ mainCollapse ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/> }</span>
                                </div>
                            </div>
                            <Collapse in={mainCollapse}>
                                <div id="collapseOne" className="collapse show">
                                    <Grid item xs={12} className="my-3">
                                        <AppTextInput
                                            label="Client ID"
                                            required
                                            value={openIdData.clientId}
                                            error={!!errors.clientId}
                                            onBlur={checkClientId}
                                            helperText={errors.clientId}
                                            name="clientId"
                                            disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                            onChange={e => change({ ...openIdData ,clientId : e.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className="my-3">
                                        <AppTextInput
                                            label="Client Name"
                                            value={openIdData.clientName}
                                            name="clientName"
                                            disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                            onChange={e => change({ ...openIdData ,clientName : e.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className="my-3">
                                        <AppTextInput
                                            label="Client Secret"
                                            placeholder="Optional, if left blank will be auto-generated by the system."
                                            value={openIdData.clientSecret}
                                            // disabled={add ? false : true}
                                            name="clientSecret"
                                            disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                            onChange={e => change({ ...openIdData ,clientSecret : e.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className="my-3">
                                        <CustomInputBox
                                          label="Redirect URI(s)"
                                          name="redirectUris"
                                          placeholder="https://"
                                          change={(data) => change({ ...openIdData ,redirectUris : data})}
                                          data={openIdData.redirectUris}
                                          error={!!errors.redirectUris}
                                          onBlur={checkRedirectUris}
                                          disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                          helperText={errors.redirectUris}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className="my-3">
                                        <AppTextInput
                                            label="Logo"
                                            value={openIdData.logoUri}
                                            name="logoUri"
                                            placeholder="https://"
                                            disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                            onChange={e => change({ ...openIdData ,logoUri : e.target.value})}
                                        />
                                        {openIdData.logoUri && (
                                          <iframe 
                                          style={{ marginTop: '20px'}}
                                          src={openIdData.logoUri} 
                                          title="Preview Logo" />
                                        )}
                                    </Grid>
                                    <Grid item xs={12} className="my-3">
                                        <AppTextInput
                                            label="Terms Of Service"
                                            value={openIdData.tosUri}
                                            name="tosUri"
                                            disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                            placeholder="https://"
                                            onChange={e => change({ ...openIdData ,tosUri : e.target.value})}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className="my-3">
                                        <AppTextInput
                                            label="Policy Statement"
                                            value={openIdData.policyUri}
                                            disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                            name="policyUri"
                                            placeholder="https://"
                                            onChange={e => change({ ...openIdData ,policyUri : e.target.value})}
                                        />
                                    </Grid>
                                    {/* <Grid item xs={12} className="my-3">
                                        <AppTextInput
                                            label="Home Page"
                                            value={openIdData.clientUri}
                                            name="clientUri"
                                            placeholder="https://"
                                            onChange={e => change({ ...openIdData ,clientUri : e.target.value})}
                                        />
                                    </Grid> */}
                                    <Grid item xs={12} className="my-3">
                                        <CustomInputBox
                                          label="Audience"
                                          name="audience"
                                          disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                          placeholder="Add audience"
                                          change={(data) => change({ ...openIdData ,audience : data})}
                                          data={openIdData.audience}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className="my-3">
                                        <CustomInputBox
                                          label="Contacts"
                                          name="contacts"
                                          disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                          placeholder="New Contact"
                                          change={(data) => change({ ...openIdData ,contacts : data})}
                                          data={openIdData.contacts}
                                        />
                                    </Grid>
                                </div>
                            </Collapse>
                            <div className="settings-table-card row" id="headingOne">
                                <div className="col-12 col-md-12" onClick={() => { setAccessCollapse(!accessCollapse) }} style={{color: '#363795', cursor: 'pointer', padding: '0px 0px 10px'}}>
                                    <span>Access</span>
                                    <span className="float-right">{ accessCollapse ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/> }</span>
                                </div>
                            </div>
                            <Collapse in={accessCollapse}>
                                <div id="collapseOne" className="collapse show">
                                    <Grid item xs={12} className="my-3">
                                        {/* <AppTextInput
                                            label="Scope"
                                            value={openIdData.scope}
                                            name="scope"
                                            onChange={e => change({ scope: e.target.value })}
                                        /> */}
                                        {/* Commented below component to add static options in checkbox */}
                                        {/* <CustomInputCheckbox
                                          label="Scope"
                                          name="scope"
                                          placeholder="Add Scope"
                                          change={(data) => change({ ...openIdData ,scope : data})}
                                          data={openIdData.scope}
                                          error={!!errors.scope}
                                          onBlur={checkScope}
                                          helperText={errors.scope}
                                        /> */}
                                        Scope <span style={{color: 'red'}}>*</span>
                                        <Grid>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                name="openid"
                                                color="primary"
                                                value="openid"
                                                // checked={openIdData.grantTypes}
                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                checked={openIdData.scope.find(a => a === 'openid') ? true : false}
                                                onChange={(e) => handleScope(e)}
                                              />
                                            }
                                            label="openid"
                                          />
                                        </Grid>
                                        <Grid>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                name="email"
                                                color="primary"
                                                value="email"
                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                checked={openIdData.scope.find(a => a === 'email') ? true : false}
                                                onChange={(e) => handleScope(e)}
                                              />
                                            }
                                            label="email"
                                          />
                                        </Grid>
                                        <Grid>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                name="profile"
                                                color="primary"
                                                value="profile"
                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                checked={openIdData.scope.find(a => a === 'profile') ? true : false}
                                                onChange={(e) => handleScope(e)}
                                              />
                                            }
                                            label="profile"
                                          />
                                        </Grid>
                                        <Grid>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                name="address"
                                                color="primary"
                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                value="address"
                                                checked={openIdData.scope.find(a => a === 'address') ? true : false}
                                                onChange={(e) => handleScope(e)}
                                              />
                                            }
                                            label="address"
                                          />
                                        </Grid>
                                        <Grid>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                name="phone"
                                                color="primary"
                                                value="phone"
                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                checked={openIdData.scope.find(a => a === 'phone') ? true : false}
                                                onChange={(e) => handleScope(e)}
                                              />
                                            }
                                            label="phone"
                                          />
                                        </Grid>
                                        <Grid>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                name="offline_access"
                                                color="primary"
                                                value="offline_access"
                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                checked={openIdData.scope.find(a => a === 'offline_access') ? true : false}
                                                onChange={(e) => handleScope(e)}
                                              />
                                            }
                                            label="offline_access"
                                          />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} className="my-3">
                                        Grant Types
                                        <Grid>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                name="authorizationCode"
                                                color="primary"
                                                value="authorization_code"
                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                // checked={openIdData.grantTypes}
                                                checked={openIdData.grantTypes.find(a => a === 'authorization_code') ? true : false}
                                                onChange={(e) => handleGrantTypes(e)}
                                              />
                                            }
                                            label="Authorization Code"
                                          />
                                        </Grid>
                                        <Grid>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                name="clientCredentials"
                                                color="primary"
                                                value="client_credentials"
                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                checked={openIdData.grantTypes.find(a => a === 'client_credentials') ? true : false}
                                                onChange={(e) => handleGrantTypes(e)}
                                              />
                                            }
                                            label="Client Credentials"
                                          />
                                        </Grid>
                                        <Grid>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                name="implicit"
                                                color="primary"
                                                value="implicit"
                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                checked={openIdData.grantTypes.find(a => a === 'implicit') ? true : false}
                                                onChange={(e) => handleGrantTypes(e)}
                                              />
                                            }
                                            label="Implicit"
                                          />
                                        </Grid>
                                        <Grid>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                name="refreshToken"
                                                color="primary"
                                                value="refresh_token"
                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                checked={openIdData.grantTypes.find(a => a === 'refresh_token') ? true : false}
                                                onChange={(e) => handleGrantTypes(e)}
                                              />
                                            }
                                            label="Refresh Token"
                                          />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} className="my-3">
                                        Response Type
                                        <Grid>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                name="code"
                                                color="primary"
                                                value="code"
                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                // checked={openIdData.grantTypes}
                                                checked={openIdData.responseTypes.find(a => a === 'code') ? true : false}
                                                onChange={(e) => handleResponseTypes(e)}
                                              />
                                            }
                                            label="code"
                                          />
                                        </Grid>
                                        <Grid>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                name="id_token"
                                                color="primary"
                                                value="id_token"
                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                checked={openIdData.responseTypes.find(a => a === 'id_token') ? true : false}
                                                onChange={(e) => handleResponseTypes(e)}
                                              />
                                            }
                                            label="id_token"
                                          />
                                        </Grid>
                                        <Grid>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                name="id_token token"
                                                color="primary"
                                                value="id_token token"
                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                checked={openIdData.responseTypes.find(a => a === 'id_token token') ? true : false}
                                                onChange={(e) => handleResponseTypes(e)}
                                              />
                                            }
                                            label="id_token token"
                                          />
                                        </Grid>
                                        <Grid>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                name="code id_token"
                                                color="primary"
                                                value="code id_token"
                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                checked={openIdData.responseTypes.find(a => a === 'code id_token') ? true : false}
                                                onChange={(e) => handleResponseTypes(e)}
                                              />
                                            }
                                            label="code id_token"
                                          />
                                        </Grid>
                                        <Grid>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                name="code token"
                                                color="primary"
                                                value="code token"
                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                checked={openIdData.responseTypes.find(a => a === 'code token') ? true : false}
                                                onChange={(e) => handleResponseTypes(e)}
                                              />
                                            }
                                            label="code token"
                                          />
                                        </Grid>
                                        <Grid>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                name="code id_token token"
                                                color="primary"
                                                value="code id_token token"
                                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                                checked={openIdData.responseTypes.find(a => a === 'code id_token token') ? true : false}
                                                onChange={(e) => handleResponseTypes(e)}
                                              />
                                            }
                                            label="code id_token token"
                                          />
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                      Subject Type
                                      <RadioGroup
                                        row
                                        value={openIdData.subjectType}
                                        onChange={changeSubjectRadio}
                                      >
                                        <FormControlLabel
                                          value={'public'}
                                          control={<Radio color="primary" />}
                                          label="Public"
                                          disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                          labelPlacement="end"
                                        />
                                        <FormControlLabel
                                          value={'pairwise'}
                                          control={<Radio color="primary" />}
                                          label="Pairwise"
                                          disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                          labelPlacement="end"
                                        />
                                      </RadioGroup>
                                    </Grid>
                                    <Grid item xs={12} className="my-3">
                                        <AppTextInput
                                            label="Sector Identifier URI"
                                            value={openIdData.sectorIdentifierUri}
                                            name="sectorIdentifierUri"
                                            disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                            placeholder="https://"
                                            onChange={e => change({ ...openIdData ,sectorIdentifierUri : e.target.value})}
                                        />
                                    </Grid>
                                </div>
                            </Collapse>
                            <div className="settings-table-card row" id="headingOne">
                                <div className="col-12 col-md-12" onClick={() => { setCredentialCollapse(!credentialCollapse) }} style={{color: '#363795', cursor: 'pointer', padding: '0px 0px 10px'}}>
                                    <span>Credentials</span>
                                    <span className="float-right">{ credentialCollapse ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/> }</span>
                                </div>
                            </div>
                            <Collapse in={credentialCollapse}>
                                <div id="collapseOne" className="collapse show">
                                  <Grid item xs={12}>
                                    Token Endpoint Authentication Method
                                    <RadioGroup
                                      value={openIdData.tokenEndpointAuthMethod}
                                      // onChange={e =>  ? change({ allUsers: true }) : change({ allUsers: false })}
                                      onChange={radioChange}
                                    >
                                      <FormControlLabel
                                        value={'client_secret_basic'}
                                        control={<Radio color="primary" />}
                                        label="Client Secret over HTTP Basic"
                                        labelPlacement="end"
                                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                        className={classes.custRadioWrapper}
                                      />
                                      <FormControlLabel
                                        value={'client_secret_post'}
                                        control={<Radio color="primary" />}
                                        label="Client Secret over HTTP POST"
                                        labelPlacement="end"
                                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                        className={classes.custRadioWrapper}
                                      />
                                      <FormControlLabel
                                        value={'private_key_jwt'}
                                        control={<Radio color="primary" />}
                                        label="Private Key JWT"
                                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                        labelPlacement="end"
                                        className={classes.custRadioWrapper}
                                      />
                                      {/* <FormControlLabel
                                        value={'private_key_jwt_doubt'}
                                        control={<Radio color="primary" />}
                                        label="Asymmetrically-signed JWT assertion"
                                        labelPlacement="end"
                                        className={classes.custRadioWrapper}
                                      /> */}
                                      <FormControlLabel
                                        value={'none'}
                                        control={<Radio color="primary" />}
                                        label="No authentication"
                                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                        labelPlacement="end"
                                        className={clsx(classes.custRadioWrapper, 'mb-3')}
                                      />
                                    </RadioGroup>
                                  </Grid>
                                </div>
                            </Collapse>
                            {/* <div className="settings-table-card row" id="headingOne">
                                <div className="col-12 col-md-12" onClick={() => { setTokensCollapse(!tokensCollapse) }} style={{color: '#363795', cursor: 'pointer', padding: '0px 0px 10px'}}>
                                    <span>Tokens</span>
                                    <span className="float-right">{ tokensCollapse ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/> }</span>
                                </div>
                            </div>
                            <Collapse in={tokensCollapse}>
                                <div id="collapseOne" className="collapse show">
                                    <Grid item xs={12} className="mb-3">
                                        No Input fields are available for this tab.
                                    </Grid>
                                </div>
                            </Collapse> */}
                            <div className="settings-table-card row" id="headingOne">
                                <div className="col-12 col-md-12" onClick={() => { setCryptoCollapse(!cryptoCollapse) }} style={{color: '#363795', cursor: 'pointer', padding: '0px 0px 10px'}}>
                                    <span>Crypto</span>
                                    <span className="float-right">{ cryptoCollapse ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/> }</span>
                                </div>
                            </div>
                            <Collapse in={cryptoCollapse}>
                                <div id="collapseOne" className="collapse show">
                                    <Grid item xs={12}>
                                      Request Object Signing Algorithm
                                      <AppSelectInput
                                        name="requestObjectSigningAlg"
                                        className="mb-3"
                                        value={openIdData.requestObjectSigningAlg}
                                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                        onChange={e => change({...openIdData ,requestObjectSigningAlg : e.target.value})}
                                        options={options.map(o => o)}
                                        labels={labels.map(v => v)}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      User Info Signing Algorithm
                                      <AppSelectInput
                                        name="userInfoSignedResponseAlg"
                                        className="mb-3"
                                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                        value={openIdData.userInfoSignedResponseAlg}
                                        onChange={e => change({...openIdData ,userInfoSignedResponseAlg : e.target.value})}
                                        options={options.map(o => o)}
                                        labels={labels.map(v => v)}
                                      />
                                    </Grid>
                                    <Grid item xs={12}>
                                      ID Token Signing Algorithm
                                      <AppSelectInput
                                        name="tokenEndpointAuthSigningAlg"
                                        className="mb-3"
                                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                        value={openIdData.tokenEndpointAuthSigningAlg}
                                        onChange={e => change({...openIdData ,tokenEndpointAuthSigningAlg : e.target.value})}
                                        options={options.map(o => o)}
                                        labels={labels.map(v => v)}
                                      />
                                    </Grid>
                                </div>
                            </Collapse>
                            {/* <div className="settings-table-card row" id="headingOne">
                                <div className="col-12 col-md-12" onClick={() => { setOthersCollapse(!othersCollapse) }} style={{color: '#363795', cursor: 'pointer', padding: '0px'}}>
                                    <span>Other</span>
                                    <span className="float-right">{ othersCollapse ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/> }</span>
                                </div>
                            </div>
                            <Collapse in={othersCollapse}>
                                <div id="collapseOne" className="collapse show">
                                    <Grid item xs={12} className="my-3">
                                        No Input fields are available for this tab.
                                    </Grid>
                                </div>
                            </Collapse> */}
                            <div className="float-right my-2">
                              <Button
                                type="submit"
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || !isValid}
                                size="small"
                                onClick={add ? onSave : onUpdate}
                                variant="contained"
                                className={classes.button}
                                color="primary">
                                  {/* {add ? 'ADD' : 'SAVE'} */}
                                  SAVE
                              </Button>
                          </div>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

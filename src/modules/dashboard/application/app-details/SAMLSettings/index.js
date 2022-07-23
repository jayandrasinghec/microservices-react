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
import EditWarningModal from '../../../../../components/EditWarningModal';


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
      }
  }))

export default function SAMLSettings(props) {

    const defaultvalues = {
        "nameIdFormat": "",
        "signatureAlgorithm": "",
        "nameIdValueField": "",
        "signResponses": "false",
        "requestIssuer": "",
        "acsUrl": "",
        "signAssertions": "false",
        "canonicalizationMethod": "",
        "samlType": ""
    }

    const classes = useStyles()
    const [saml, setSaml] = React.useState(defaultvalues)
    const [saving, setSaving] = React.useState(false)
    const [open, setOpen] = React.useState(false);
    const [tempSamlType, setTempSamlType] = React.useState('');

    const handleModalOpen = () => {
        setOpen(true);
    };

    const handleModalClose = () => {
        setOpen(false);
        setTempSamlType('')
    };

    const downloadSAMLData = () => {
        callApi(`/sso-config/saml/applicationConfig/${props.app.id}`)
            .then(response => {
                if(response.data){
                    setSaml(response.data)
                }
            })
            .catch(error => {})
    }

    // const onDownloadClick = () => {
    //     fetch("/samlsrvc/api/metadata",{
    //         method:'GET',
    //         Accept:'application/xml',
    //         headers:{
    //             "Authorization": `Bearer ${getAuthToken()}`,
    //             "Accept":'application/xml',
    //         }
    //     })
    //     .then(response => response.blob())
    //     .then(blob => {
    //         var url = window.URL.createObjectURL(blob);
    //         var a = document.createElement('a');
    //         a.href = url;
    //         a.download = "config.xml";
    //         document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
    //         a.click();
    //         a.remove();  //after
    //     })
    // }
    React.useEffect(() => {
        downloadSAMLData()
    }, [])

    const change = e => {
        setSaml({ ...saml, ...e })
    }

    const validate = () => {
        let arr = []
        let item = {
            'nameIdFormat': 'NameID Format',
            'signatureAlgorithm': 'Signature Algorithm',
            'nameIdValueField': 'NameID Value',
            'requestIssuer': 'Request Issuer',
            'acsUrl': 'Assertion Consumer Service URL',
            'canonicalizationMethod': 'Canonicalization Method',
            'samlType': 'Saml Type',
        }
        Object.keys(saml).map(data => {
            if(saml[data] === ""){
                arr.push(data)
                showError(`${item[data]} field is mandatory`)
            }
        })
        if(arr.length === 0) {
            return true
        }else{
            return false
        }
    }


    const onSave = () => {
        setSaving(true)
        if(validate()){
            callApi(`/sso-config/saml/applicationConfig/save/${props.app.id}`, 'PUT', saml)
                .then(e => {
                    setSaving(false)
                    if (e.success) {
                        showSuccess('Updated Successfully!')
                        setSaml(e.data)
                    }
                })
                .catch(error => setSaving(false))
        }
      }

    let SignatureOptions = ['RSA_SHA1', 'RSA_SHA256', 'RSA_SHA512', 'DSA_SHA1']

    let NameIDFormatOptions = ['UNSPECIFIED', 'TRANSIENT', 'PERSISTENT', 'EMAIL', 'USERNAME']
    let NameIDFormatOptionLabels = ['unspecified', 'transient', 'persistent', 'email', 'username']

    let NameIDValueOptions = [ 'EMAIL', 'MOBILE', 'FIRSTNAME', 'LASTNAME', 'DISPLAYNAME', 'LOGIN']
    let NameIDValueOptionLabels = [ 'email', 'mobile', 'firstName', 'lastName', 'displayName', 'loginId']

    let CanonicalizationOptions= ['EXCLUSIVE', 'INCLUSIVE', 'EXCLUSIVE_WITH_COMMENTS', 'INCLUSIVE_WITH_COMMENTS']
    let CanonicalizationOptionLabels= ['Exclusive', 'Inclusive', 'Exclusive with comments', 'Inclusive with comments']

    return (
        <div className={classes.container}>
            <Grid container spacing={3} className={classes.gridcontainer + " justify-content-around"}>
                <Grid item xs={12} md={12} className={classes.griditemone}>
                    <Grid className={classes.griditemtwo}>
                        <span className="float-right" style={{color: '#363795', cursor: 'pointer'}} onClick={props.onDownloadClick}>View Metadata</span>
                        <Grid item xs={12} className="my-3">
                            <AppSelectInput
                                label="SAML Type"
                                value={saml.samlType}
                                onChange={e => {
                                    if (e.target.value) {
                                        handleModalOpen()
                                        setTempSamlType(e.target.value)
                                    }
                                }}
                                options={['SP_INITIATED', 'IDP_INITIATED']}
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} className="my-3">
                            <AppSelectInput
                                label="Signature Algorithm"
                                value={saml.signatureAlgorithm}
                                onChange={e => change({ signatureAlgorithm: e.target.value })}
                                options={SignatureOptions}
                                name="signatureAlgorithm"
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} className="my-3">
                            <AppSelectInput
                                label="NameID Format"
                                value={saml.nameIdFormat}
                                onChange={e => change({ nameIdFormat: e.target.value })}
                                labels={NameIDFormatOptionLabels}
                                options={NameIDFormatOptions}
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} className="my-3">
                            <AppSelectInput
                                label="NameID Value"
                                value={saml.nameIdValueField}
                                onChange={e => change({ nameIdValueField: e.target.value })}
                                labels={NameIDValueOptionLabels}
                                options={NameIDValueOptions}
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} className="my-3">
                            <AppCheckbox
                                value={saml.signResponses === "true" ? true : false}
                                onChange={e => change({ signResponses: e.toString()}) }
                                label="Sign Responses"
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} className="my-3">
                            <AppTextInput
                                label="Request Issuer"
                                value={saml.requestIssuer}
                                name="requestIssuer"
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                // placeholder={"Request Issuer"}
                                onChange={e => change({ requestIssuer: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} className="my-3">
                            <AppCheckbox
                                value={saml.signAssertions === "true" ? true : false}
                                onChange={e => change({ signAssertions: e.toString()}) }
                                label="Sign Assertions"
                                required
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                            />
                        </Grid>
                        <Grid item xs={12} className="my-3">
                            <AppSelectInput
                                label="Canonicalization Method"
                                value={saml.canonicalizationMethod}
                                onChange={e => change({ canonicalizationMethod: e.target.value })}
                                labels={CanonicalizationOptionLabels}
                                options={CanonicalizationOptions}
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} className="my-3">
                            <AppTextInput
                                label="Assertion Consumer Service URL"
                                value={saml.acsUrl}
                                // placeholder={"Request Issuer"}
                                onChange={e => change({ acsUrl: e.target.value })}
                                required
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                            />
                        </Grid>
                        <div className={classes.buttondiv}>
                            <Button
                                type="submit"
                                onClick={onSave}
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || saving}
                                variant="contained"
                                className={classes.button}
                                color="primary">
                                    Save
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
            <EditWarningModal 
                title={`Update SAML Type to ${tempSamlType}`}
                des='This action might break the entire SAML SSO flow.'
                open={open} 
                confirm={() => {
                    change({ samlType: tempSamlType })
                    handleModalClose()
                }}
                close={handleModalClose}
            />
        </div>
    )
}

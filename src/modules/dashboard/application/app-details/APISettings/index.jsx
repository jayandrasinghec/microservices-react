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

export default function APISettings(props) {

    const defaultvalues = {
        "sourceAppTokenParamName": "",
        "applicationPass": "",
        "targetAppRedirectUrl": "",
        "tokenValidity": "",
        "targetAppTokenParamName": "",
        "externalApplicationId":""
    }
     
    const classes = useStyles()
    const [api, setApi] = React.useState(defaultvalues)

    const downloadSAMLData = () => {
        callApi(`/sso-config/apiconfig/${props.app.id}`)
            .then(response => {
                if(response.data){
                    setApi(response.data)
                }
            })
            .catch(error => {})
    }

    
    React.useEffect(() => {
        downloadSAMLData()
    }, [])

    const change = e => {
        setApi({ ...api, ...e })
    }

    const validate = () => {
        let arr = []
        let item = {
            "sourceAppTokenParamName": "Source app token param name",
            "targetAppRedirectUrl": "Target App Redirect Url",
            "tokenValidity": "Token Validity",
            "targetAppTokenParamName": "Target app token param name",
            "externalApplicationId": "External Application ID"
        }
        Object.keys(api).map(data => {
            if(data !== "applicationPass" && api[data] === ""){
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
        if(validate()){
            callApi(`/sso-config/apiconfig/save/${props.app.id}`, 'PUT', api)
                .then(e => {
                    if (e.success) {
                        showSuccess('Updated Successfully!')
                        setApi(e.data)
                    }
                })
                .catch(error => {})
        }
      }

    return (
        <div className={classes.container}>
            <Grid container spacing={3} className={classes.gridcontainer + " justify-content-around"}>
                <Grid item xs={12} md={12} className={classes.griditemone}>
                    <Grid className={classes.griditemtwo}>
                        <span className="float-right" style={{color: '#363795', cursor: 'pointer'}} onClick={props.onDownloadClick}>View Metadata</span>
                        <Grid item xs={12} className="my-3">
                            <AppTextInput
                                label="Source app token param name"
                                value={api.sourceAppTokenParamName}
                                name="sourceAppTokenParamName"
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                onChange={e => change({ sourceAppTokenParamName: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} className="my-3">
                            <AppTextInput
                                label="Application Secret"
                                value={api.applicationPass}
                                type="password"
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                onChange={e => change({ applicationPass: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} className="my-3">
                            <AppTextInput
                                label="Target App Redirect Url"
                                value={api.targetAppRedirectUrl}
                                name="targetAppRedirectUrl"
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                onChange={e => change({ targetAppRedirectUrl: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} className="my-3">
                            <AppTextInput
                                label="Token Validity"
                                value={api.tokenValidity}
                                onChange={e => change({ tokenValidity: e.target.value })}
                                required
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12} className="my-3">
                            <AppTextInput
                                label="Target app token param name"
                                value={api.targetAppTokenParamName}
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                onChange={e => change({ targetAppTokenParamName: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} className="my-3">
                            <AppTextInput
                                label="External Application ID"
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                value={api.externalApplicationId}
                                onChange={e => change({ externalApplicationId: e.target.value })}
                                required
                            />
                        </Grid>
                        <div className={classes.buttondiv}>
                            <Button
                                type="submit"
                                onClick={onSave}
                                variant="contained"
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                className={classes.button}
                                color="primary">
                                    Save
                            </Button>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

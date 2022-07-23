import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications'
import AppTextInput from '../../../../../components/form/AppTextInput';
import Delete from '../../../../../FrontendDesigns/new/assets/img/icons/Delete.svg'
import { isActiveForRoles } from '../../../../../utils/auth';


const useStyles = makeStyles(() => ({
  paperLevel: {
    margin: '0 0 20px',
    padding: '7px 22px',
    display: 'flex',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: '10px',
    flexDirection: 'column',
    overflow: 'hidden',
    alignItems: 'flex-start',
  },
  griditemone: { 
    display: 'flex', 
    alignItems: 'center' 
  },
  displayflex: { 
    display: 'flex' 
  },
  griditemtwo: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'flex-end' 
  },
  buttondiv: { 
    display: 'flex', 
    alignItems: 'center', 
    margin: '35px 0px 10px' 
  },
  button: { 
    borderRadius: '8px' 
  },
}))


const AttributeItem = (props) => {
  const classes = useStyles();
  const { item, index, app, max, id } = props
  let app_id = app.id;
  const defaultValues = {
    [app_id + '-'+ max +'-key']: '',
    [app_id + '-'+ max +'-value']: ''
  }

  const [newData, setNewData] = React.useState(item || defaultValues)
  const [changes, setChange] = React.useState(false)
  
  const change = e => {
    setChange(true)
    setNewData({ ...newData, ...e })
  }

  const sortNewData = Object.keys(newData);
  sortNewData.sort();

  const onSave = () => {
    
    // let postData = {
    //   "samlAttribute": [newData],
    //   "applicationId" : app_id
    // }
    // if(id === null) {
    //   // callApi(`/samlsrvc/api/saveSamlAttributes`, 'POST', postData)
    //   callApi(`/samlsrvc/api/saveSamlAttributes`, 'POST', postData)
    //     .then(e => {
    //       setChange(false)
    //       if (e.success) showSuccess('Action Performed Successfully!')
    //       props.downloadData()
    //     })
    //     .catch(error => {})
    // } else {
      let data = newData
      Object.assign(data, {"application-id" : app_id})
      // callApi(`/samlsrvc/api/updateMapping`, 'PUT', data)
      callApi(`/sso-config/saml/attributeMapper/save/${app_id}`, 'PUT', data)
        .then(e => {
          setChange(false)
          if (e.success) {
            showSuccess('Action Performed Successfully!')
            props.updateMappings(e.data.samlAttribute, e.data.maxindex)
          }
        })
        .catch(error => {})
    // }
  }

  const onDelete = () => {
    let data = newData
    Object.assign(data, {"application-id" : app_id})

    // callApi(`/samlsrvc/api/deleteSamlAttrById`, 'DELETE', newData)
    callApi(`/sso-config/saml/attributeMapper/${app_id}`, 'DELETE', newData)
      .then(e => {
        if (e.success) {
          showSuccess('Deleted Successfully!')
          props.updateMappings(e.data.samlAttribute, e.data.maxindex)
        }
      })
  }

  return (
    <div className={classes.paperLevel}>
      <Grid container spacing={3}>
        {
          sortNewData.map(data => (
            <Grid item xs={6} md={5}>
              <AppTextInput
                label={data.includes('value') ? 'Application Attribute' : 'Cymmetri Attribute'}
                value={newData[data]}
                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                name={data}
                placeholder={"Set default value here"}
                onChange={e => change({ [e.target.name]: e.target.value })} />
            </Grid>
          ))
        }
        <Grid item xs={12} md={2} className={classes.griditemtwo}>
          <div className={classes.buttondiv}>
            <Button
              disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || !changes}
              onClick={onSave}
              variant="contained" 
              className={classes.button} 
              color="primary"
            >
              Save
            </Button>

            {
              isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && newData !== null && app_id + '-'+ max +'-key' !== '' && (
                <a onClick={onDelete} className="ml-2" style={{cursor: "pointer"}}>
                  <img src={Delete} alt="" title="" />
                </a>)
            }
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default AttributeItem;

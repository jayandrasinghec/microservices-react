import React from 'react'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
// import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import { callApi } from '../../../../../utils/api'

import CardViewWrapper from "../../../../../components/HOC/CardViewWrapper"
import CardViewWrapperTitle from "../../../../../components/HOC/CardViewWrapperTitle"
import ScrollWrapper from "../../../../../components/HOC/ScrollWrapper"
import {isActiveForRoles} from '../../../../../utils/auth'

const useStyles = makeStyles(() => ({
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
  description: {
    padding: '0 16px'
  },
  disabledCheckbox: {
    '& [type="checkbox"]': {
      '&:checked + label': {
        '&:after': {
          background: '#D3D3D3'
        }
      }
    }
  }
}))

const defaultQuery = {
  direction: "ASC",
  pageNumber: 0,
  pageSize: 10,
  sort: "WORKFLOW_NAME"
}

export default function Workflow() {
  const classes = useStyles()
  const [data, setData] = React.useState([])
  const [global, setGlobal] = React.useState(false)

  const downloadData = () => {
    callApi(`/workflowsrvc/api/workflow/list`, 'POST', defaultQuery)
      .then(e => {
        if (e.success) setData(e.data && e.data.elements ? e.data.elements : [])
      })

    callApi(`/workflowsrvc/api/workflow/globalConfig`, 'GET')
      .then(e => {
        if (e.success) setGlobal(e.data ? e.data : false)
      })
  }

  React.useEffect(() => downloadData(), [])
  const excludeCards = ["Cymmetri Group Creation","Cymmetri Internal Roles","User Creation","User Request for Application"]
  return (
    <ScrollWrapper>
      <Grid container>
        <Grid item xs={12}>
          <CardViewWrapper>
            <CardViewWrapperTitle>
              <FormControlLabel
                control={
                  <div className={clsx("custom-checkbox", !isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) ? classes.disabledCheckbox : '')} style={{ marginLeft: 10 }}>
                    <input 
                      type="checkbox" 
                      name="checkedCA" 
                      id={1} 
                      disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                      checked={global} 
                      onChange={e => {
                        setGlobal(!global)
                        callApi(`/workflowsrvc/api/workflow/globalConfig/${e.target.checked}`, 'PUT')
                      } }
                    /> 
                    <label htmlFor={1} />
                  </div>
                }
                label="Global Configurations"
              />
            </CardViewWrapperTitle>
            <Grid container spacing={2}>
              {data.map(o => {
                if(excludeCards.includes(o.name)){
                  return null
                }
                return (
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Card className={classes.cardView}>
                      <CardHeader
                        action={
                          <FormControlLabel
                            control={
                              <Switch
                                name="toggleCA"
                                color="primary"
                                defaultChecked={o.enabled}
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                onChange={e => isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && callApi(`/workflowsrvc/api/workflow/${o.id}/${e.target.checked}`, 'PUT')} />
                            }
                          />
                        }
                        title={o.name}
                        className={classes.authTitle}
                      />
                      <CardContent className={classes.description}>
                        <Typography variant="body2" color="textSecondary" component="p">
                          {o.description}
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
  )
}


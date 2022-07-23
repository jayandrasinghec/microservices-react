import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { NavLink } from 'react-router-dom'
import { Switch, Route, Redirect } from "react-router-dom"
import { CircularProgress } from '@material-ui/core'
import { callApi } from '../../../../utils/api'
import GroupDetailApp from './application'
import GroupDetailActivity from './Activity'
import GroupDetailUsers from './user'
import GroupDetailEditInfo from './EditInfo'
import '../../../../FrontendDesigns/master-screen-settings/assets/css/group-detail.css'
import {isActiveForRoles} from '../../../../utils/auth'
import ellipsis from 'text-ellipsis'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  layout: {
    // flexGrow: 1,
    backgroundColor: 'white',
    margin: 10
  },
  Nav: {
    display: 'flex',
    paddingBottom: '0px !important'
  },
  activeLink: {
    borderBottom: '3px solid #1F4287',
    fontWeight: '900 !important',
    color: '#363795 !important',
    paddingBottom: 5
  },
  link: {
    paddingBottom: 5,
    marginTop: '0px',
    marginLeft: '10px',
    marginRight: '20px',
    fontWeight: 'normal',
    fontSize: 14,
    color: '#1F4287',
    textDecorationLine: 'none',
    '&:hover': {
      color: '#363795',
      textDecorationLine: 'none',
    }
  },
  bellicon: {
    marginTop: '0px',
    width: '19px',
    height: '24px'
  },
  small: {
    width: '25px',
    height: '26px',
    // marginTop: '5px',
    marginLeft: '10px'
  },
  search: {
    // marginLeft: '10px',
  },
  bulk: {

    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    color: '#FFFFFF',
  },
  name: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    marginBottom: 30,
    fontSize: 20,
    color: '#1F4287',
  },
  designation: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    color: '#8392A7',
    lineHeight: 1.5
  },
  ephone: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '13px',
    lineHeight: '15px',
    color: '#171717',
    marginLeft: '7px',
    marginTop: '5px'
  },
  circularprog: { 
    display: 'flex', 
    width: '100%', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  container: { 
    display: 'flex', 
    flex: 1,
  }

}))


export default function GroupDetail(props) {
  const classes = useStyles()
  const [data, setData] = React.useState()

  const downloadData = () => {
    callApi(`/usersrvc/api/group/${props.match.params.id}`)
      .then(response => setData(response.data))
      .catch(error => {})
  }

  React.useEffect(() => downloadData(), [])

  if (!data) return (
    <div className={classes.circularprog}>
      <CircularProgress color="secondary" />
    </div>
  )

  return (
    <div className={classes.root}>
      <div className="add-user-group-row-2 mt-2">
        <div className="user-group-lhs row">
          <div className="col-md-9">
            <h5 className="">{data.name}</h5>
            <span className="sub-desc">{data.description ? ellipsis(data.description, 300) : "No Description"}</span>
          </div>
          <div className="col-md-3 text-right">
            <span className="group-icon"><img src="assets/img/icons/user-gray.svg" alt="" className="mr-2"/> {data.userCount}</span>
            <span className="group-icon"><img src="assets/img/icons/user-assign.svg" alt="" className="mr-2"/> {data.appCount}</span>
          </div>
          <div className="pt-2 mt-2 d-flex flex-row align-items-center">
            <div className="cym-tab-view">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && (
                  <NavLink to={`/dash/directory/groups/${data.id}/users`}
                    className={"nav-link"}
                    activeClassName={"active"}>Users</NavLink>)
                }
                </li>
                <li className="nav-item" role="presentation">
                  {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && (
                    <NavLink to={`/dash/directory/groups/${data.id}/applications`}
                      className={"nav-link"}
                      activeClassName={"active"}>Applications</NavLink>)
                  }
                </li>
                <li className="nav-item" role="presentation">
                  {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && (
                  <NavLink to={`/dash/directory/groups/${data.id}/activity`}
                    className={"nav-link"}
                    activeClassName={"active"}>Activity</NavLink>)
                  }
                </li>
                <li className="nav-item" role="presentation">
                {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && (
                    <NavLink to={`/dash/directory/groups/${data.id}/edit-info`}
                      className={"nav-link"}
                      activeClassName={"active"}>Edit</NavLink>)
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.container}>
        <Switch>
          <Route exact={true} path="/dash/directory/groups/:id/applications" component={p => <GroupDetailApp {...p} group={data} onUpdate={downloadData} />} />
          <Route exact={true} path="/dash/directory/groups/:id/activity" component={p => <GroupDetailActivity {...p} group={data} /> } />
          <Route exact={true} path="/dash/directory/groups/:id/users" component={p => <GroupDetailUsers {...p} group={data} onUpdate={downloadData} /> } />
          <Route exact={true} path="/dash/directory/groups/:id/edit-info" component={p => <GroupDetailEditInfo {...p} group={data} onUpdate={downloadData} /> } />
          <Redirect to={`/dash/directory/groups/${data.id}/users`} />
        </Switch>
      </div>
    </div>
  )
}

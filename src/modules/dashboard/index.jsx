import React from 'react'
import clsx from 'clsx'
import { Switch, Route, Redirect, Link, NavLink } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import IconButton from '@material-ui/core/IconButton'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DashboardIcon from '../../FrontendDesigns/master-screen-settings/assets/img/icons/dashboard.svg'
import LogoCCIO from '../../assets/LogoCCIO.png'
import LogoWhite from '../../assets/Cymmetri_logo_white.png'
import ListAltIcon from '../../FrontendDesigns/master-screen-settings/assets/img/icons/dir.svg'
import AppsIcon from '../../FrontendDesigns/master-screen-settings/assets/img/icons/app.svg'
import SupervisorAccountIcon from '../../FrontendDesigns/master-screen-settings/assets/img/icons/admin.svg'
import SettingsIcon from '../../FrontendDesigns/master-screen-settings/assets/img/icons/setting.svg'
import Hamburger from '../../assets/Hamburger.svg'
import Workflow from '../../assets/Workflow.svg'
import ReportIcon from '../../assets/ReportIcon.svg'
import Administration from '../../assets/Administration.svg'
import Directory from '../../assets/Directory.svg'

import AddModule from './add'
import DirectoryModule from './directory'
import ApplicationModule from './application/index'
import ApplicationAddModule from './application/add-new'
import AppDetailModule from './application/app-details'
import AppNewModule from './application/add-new'
import UserProfileModule from './profile'
import ComingSoon from '../../components/ComingSoon'
import AdministrationModule from './administartion';
import PolicyModule from './policcy';
import WorkflowModule from './workflow';
import SettingsModule from './settings';
import ReportModule from './report';
import Audit from './audit';
import DashboardModule from './dash';
import GovernanceModule from './governance';
import SodModule from './sod'

import { callApi } from '../../utils/api'
import { getCurrentUser } from '../../utils/auth'
import { isActiveForRoles } from '../../utils/auth'
import Discovery from './discovery'

const drawerWidth = 210

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    backgroundColor: '#363793'
  },
  drawer: {
    width: drawerWidth,
    border: 0
  },
  drawerOpen: {
    width: drawerWidth,
    backgroundColor: '#363793',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    backgroundColor: '#363793',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingLeft: 0,
  },
  paper: {
    border: 0
  },
  activeItem: {
    color: theme.palette.primary[100],
  },
  Item: {
    color: '#fff',
  },
  active: {
    color: '#1D1E7E',
    backgroundColor: '#1D1E7E',
  },
  link: {
    backgroundColor: 'red'
  },
  inactive: {
    color: '#fff',
  },
  iconButton : {
    "&.MuiIconButton-label" : {
      width: 'auto !important',
      boxSizing: 'content-box',
      MozBoxSizing: 'content-box',
      WebkitBoxSizing: 'content-box'
    }
  },
  welcomeCemmentrixLogo: {
    width: 160,
    marginLeft: '20px',
    '& img': {
      width: "100%",
      height: "100%",
    }
  },

}))

export default function Dashboard() {
  const classes = useStyles()
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(true)
  const downloadData = () => {
    callApi(`/selfservice/api/selfservice/`, 'GET')
      .then(e => {
        if (e && e.success) {
          setData(e.data ? e.data : [])
        } else if (e && e.status === 500) {
          downloadData()
        }
      })
      .catch(() => downloadData)
  }
  React.useEffect(() => downloadData(), [])

  const handleDrawerOpen = () => setOpen(!open)

  const userJson = getCurrentUser()
  if (!userJson) return <Redirect to="/auth" />

  const sidebar = [
    {
      name: 'Dashboard',
      route: '/dash/dashboard',
      Icon: DashboardIcon,
      roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY', 'HELP_DESK', 'APP_ADMIN', 'REPORT_ADMIN']
    },
    {
      name: 'Directory',
      route: '/dash/directory',
      Icon: Directory,
      roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY', 'HELP_DESK']
    },
    {
      name: 'Applications',
      // route: '/dash/applications',
      route: '/dash/apps',
      Icon: AppsIcon,
      roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN', 'READ_ONLY']
    },
    {
      name: 'Administration',
      route: '/dash/admin',
      Icon: Administration,
      roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']
    },
    {
      name: 'Governance',
      route: '/dash/governance',
      Icon: Administration,
      roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']
    },
    {
      name: 'Settings',
      route: '/dash/settings',
      Icon: SettingsIcon,
      roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']
    },
    {
      name: 'Report',
      route: '/dash/report',
      Icon: ReportIcon,
      roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY', 'REPORT_ADMIN']
    },
    {
      name: 'Policy',
      route: '/dash/policy',
      Icon: SupervisorAccountIcon,
      roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']
    },
    {
      name: 'Workflow',
      route: '/dash/workflow',
      Icon: Workflow,
      roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']
    },
    {
      name: 'Audit',
      route: '/dash/audit',
      Icon: ReportIcon,
      roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY', 'APP_ADMIN']
    },
    {
      name: 'SOD',
      route: '/dash/sod',
      Icon: ReportIcon,
      roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']
    },
    {
      name: 'Discovery',
      route: '/dash/discovery',
      Icon: ReportIcon,
      roles: ['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']
    },
  ]

  return (
    <div className={classes.root}>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, { [classes.drawerOpen]: open, [classes.drawerClose]: !open })}
        classes={{
          paper: clsx(classes.paper, { [classes.drawerOpen]: open, [classes.drawerClose]: !open })
        }}>
        { open ?  
        <IconButton disabled color="inherit" className={classes.welcomeCemmentrixLogo}>
          <img alt="Logo" src={LogoWhite} style={{ width: '160px', marginTop: '15px' }}/>
        </IconButton>
        :
        <IconButton disabled color="inherit" edge="start">
          <span className={classes.iconButton}>
            <img alt="Logo" src={LogoCCIO} style={{ marginLeft: '50px' }} />
          </span>
        </IconButton>
        }
        <IconButton color="inherit" onClick={handleDrawerOpen} edge="start">
          <img alt="Logo" src={Hamburger} style={{ marginLeft: '15px', marginBottom: '10px' }} />
        </IconButton>
        {
          sidebar.map(s => {
            if (s.roles && s.roles.length > 0) {
              if (!isActiveForRoles(s.roles)) return
            }
            
            return (
              <NavLink key={s.name} to={s.route} style={{ color: "#fff", margin: '0px 10px', borderRadius: '10px' }} activeStyle={{ backgroundColor: '#1D1E7E' }}>
                <ListItem to={s.route} button key={s.name} >
                  <ListItemIcon>
                    <img src={s.Icon} style={{ opacity: 1.5, }} />
                  </ListItemIcon>
                  <ListItemText primary={s.name} />
                  {/* :active */}
                </ListItem>
              </NavLink>
            )
          })
        }
        {/* </div> */}
      </Drawer>

      <main className={classes.content}>
        <div className="userdash-content">
          <Switch>
            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY', 'HELP_DESK']) && <Route path="/dash/directory/user/:id" component={UserProfileModule} />}
            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']) && <Route path="/dash/directory/add" component={p => <AddModule {...p} profile={data} />} />}
            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'APP_ADMIN']) && <Route exact={true} path="/dash/apps/applications/add" component={p => <ApplicationModule {...p} profile={data} />} />}
            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY', 'APP_ADMIN']) && <Route path="/dash/apps/applications/:id" component={p => <AppDetailModule {...p} profile={data} />} />}
            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY', 'APP_ADMIN']) && <Route path="/dash/audit" component={p => <Audit {...p} profile={data} />} />}
            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY', 'HELP_DESK']) && <Route path="/dash/directory" component={p => <DirectoryModule {...p} profile={data} />} />}
            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY', 'APP_ADMIN']) && <Route path="/dash/apps" component={p => <ApplicationModule {...p} profile={data} />} />}
            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY', 'APP_ADMIN', 'HELP_DESK', 'REPORT_ADMIN']) && <Route path="/dash/dashboard" component={p => <DashboardModule {...p} profile={data} />} />}
            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']) && <Route path="/dash/admin" component={p => <AdministrationModule {...p} profile={data} />} />}
            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']) && <Route path="/dash/governance" component={p => <GovernanceModule {...p} profile={data} />} />}
            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']) && <Route path="/dash/settings" component={p => <SettingsModule {...p} profile={data} />} />}
            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY', 'REPORT_ADMIN']) && <Route path="/dash/report" component={p => <ReportModule {...p} profile={data} />} />}
            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']) && <Route path="/dash/policy" component={p => <PolicyModule {...p} profile={data} />} />}
            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']) && <Route path="/dash/workflow" component={p => <WorkflowModule {...p} profile={data} />} />}
            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']) && <Route path="/dash/sod" component={p => <SodModule {...p} profile={data} />} />}
            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']) && <Route path="/dash/discovery" component={p => <Discovery {...p} profile={data} />} />}

            {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY', 'APP_ADMIN', 'HELP_DESK', 'REPORT_ADMIN']) ? <Redirect to="/dash/dashboard" /> : <Redirect to="/auth" />}
          </Switch>
        </div>
      </main>
    </div >
  )
}

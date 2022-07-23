import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link as Linking } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import SearchField from '../../../../components/AppSearchField'
import DropDown from '../../../../components/DropDownComponent'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import AppListCard from './TenantAppList'
import MenuItem from '@material-ui/core/MenuItem'
import { callApi } from '../../../../utils/api'

import EmptyScreen from '../../../../components/EmptyScreen'
import { TablePagination } from '@material-ui/core'
import {isActiveForRoles} from '../../../../utils/auth'
import CustomPagination from '../../../../components/CustomPagination'

const drop = [
  {type: 'asc'}, {type: 'desc'}
]


const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  Nav: {
    display: 'flex',
    paddingBottom: '10px !important'
    // marginTop: '12px'
  },
  link: {
    marginTop: '12px',
    marginRight: '25px',
    marginLeft: '10px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    color: '#1F4287',
    textDecorationLine: 'none',
    '&:hover': {
      fontWeight: 'bold',
      color: '#363795'
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
  name: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    color: '#171717',
    // marginTop: '9px',
  },
  bulk: {

    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    color: '#FFFFFF',
  }
}))


const defaultFilters = {
    displayName: "",
    order: "asc",
    pageNo: 0,
    size: 12,
    sortBy: "displayName",
    tag: ""
  }

export default function AppLayout(props) {
  const classes = useStyles()
  const [filters, _setFilters] = React.useState(defaultFilters)

  const [apps, setApps] = React.useState([])
  const [totalApps, setTotalApps] = React.useState(0)

  const downloadApps = () => {
    callApi(`/provsrvc/applicationTenant/applicationListByPage`, 'POST', filters)
      .then(e => { if (e.success) {
        setApps(e.data && e.data.content ? e.data.content : [])
        setTotalApps(e.data.totalElements)

      }})
  }

  React.useEffect(() => downloadApps(), [filters])

  const setSearchQuery = e => { _setFilters({ ...filters, displayName: e }) }
  const setSortQuery = e => _setFilters({ ...filters, order: e })
  const handleChangePage = (event, newPage) => _setFilters({ ...filters, pageNo : newPage })
  const handleChangeRowsPerPage = (event) => {
    _setFilters({ ...filters, pageNo : 0, size : parseInt(event, 10) })
  }

  const renderApps = () => {
    return (
      <Grid container spacing={3}>
        {
          apps.map(u => {
            // const navigate = () => props.history.push(`/dash/applications/${u.id}`)
            const navigate = () => props.history.push(`/dash/apps/applications/${u.id}`)
            return (
              <Grid key={u.id} item xs={12} md={6} lg={4}>
                {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','APP_ADMIN','READ_ONLY']) && (<div style={{ padding: 10 }}>
                  <AppListCard app={u} onClick={isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','APP_ADMIN', 'READ_ONLY']) && navigate} />
                </div>)}
              </Grid>
            )
          })
        }
      </Grid>
    )
  }

  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
      <Grid container spacing={3} style={{ marginBottom: 15, marginTop: 5 }}>
        <Grid item md={6} xs={12} style={{ paddingTop: 0 }}>
          <SearchField
            onBlur={downloadApps}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Apps" />
        </Grid>
        <Grid item md={6} xs={12} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingTop: 0 }}>
          {/* <DropDown title="Sort" options={drop} body={
            drop.map(o => {
              return (
                <MenuItem key={o.type} value={filters.order} onClick={() => setSortQuery(o.type)}>
                  <div className={classes.displayflex} >
                    <span className={classes.span}>{o.type}</span>
                  </div>
                </MenuItem>
              )
            })
          } />   */}
          {/* {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','APP_ADMIN']) && (<Linking to="/dash/applications/add"> */}
          {isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','APP_ADMIN']) && (<Linking to="/dash/apps/applications/add">
            <Button variant="contained" color="primary" style={{ marginLeft: 15 }} startIcon={<AddIcon />} >
              <span className={classes.bulk}>Add New</span>
            </Button>
          </Linking>)}
        </Grid>
      </Grid>

      <div style={{ padding: 1, margin: 0 }}>
        {apps.length === 0 ? <EmptyScreen /> : renderApps()}
      </div>
{/* 
      <TablePagination
        component="div"
        count={totalApps}
        rowsPerPageOptions={[10, 12, 25, 50, 100]}
        page={filters.pageNo}
        onChangePage={handleChangePage}
        rowsPerPage={filters.size}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
      <CustomPagination             
              count={Math.ceil(totalApps / filters.size)}
              totalCount = {totalApps}
              rowsPerPageOption={[10, 12, 25, 50, 100]}
              page={filters.pageNo}
              onChangePage={handleChangePage}
              rowsPerPage={filters.size}
              onChangeRowsPerPage={handleChangeRowsPerPage}
        />
    </div>
  )
}
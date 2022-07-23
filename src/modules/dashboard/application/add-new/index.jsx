import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import SearchField from '../../../../components/AppSearchField'
import Button from '@material-ui/core/Button'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import AppListCard from './AppListCard'
import { callMasterApi } from '../../../../utils/api'
import AppTags from './AppTags'
import MenuItem from '@material-ui/core/MenuItem'
import EmptyScreen from '../../../../components/EmptyScreen'
import { TablePagination } from '@material-ui/core'
import * as ProvSrvc from '../../../../api/provsrvc'
import DropDown from '../../../../components/DropDownComponent'
import CustomPagination from '../../../../components/CustomPagination'

const drop = [
  {type: 'ascending'}, {type: 'descending'}
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
  },
  gridcontainer: { 
    margin: 0, 
    width: '100%' 
  },
  container: { 
    display: 'flex', 
    flex: 1, 
    flexDirection: 'column', 
    width: '100%', 
    // overflow: 'auto' 
  },
  gridcontainerone: { 
    margin: 0, 
    marginBottom: 15, 
    marginTop: 5,
    width: '100%'
  },
  itemone: { 
    paddingTop: 0 
  },
  itemtwo: { 
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-end', 
    paddingTop: 0 
  },
  displayflex: { 
    display: 'flex' 
  },
  span: { 
    fontStyle: 'normal', 
    fontWeight: 'normal', 
    fontSize: '12px', 
    lineHeight: '20px', 
    color: '#8998AC;', 
    marginLeft: '0px' 
  },
  // overflow: { 
  //   flex: 1, 
  //   overflow: 'auto', 
  // },

}))


const defaultFilters = {
  displayName: "",
  order: "ascending",
  pageNo: 0,
  size: 10,
  sortBy: "appName",
}

export default function AppLayout(props) {
  const classes = useStyles()
  const [filters, _setFilters] = React.useState(defaultFilters)

  const [apps, setApps] = React.useState([])
  const [totalApps, setTotalApps] = React.useState(0)

  const downloadApps = () => {
    ProvSrvc.applicationListByPage(filters)
      .then(e => {
        if (e.success) {
          setApps(e.data && e.data.content ? e.data.content : [])
          setTotalApps(e.data ? e.data.totalElements : 0)
        }
      })
  }

  React.useEffect(() => downloadApps(), [filters])

  const setSearchQuery = e => _setFilters({ ...filters, displayName: e })
  const setTag = e => _setFilters({ ...filters, tag: e })
  const setSortQuery = e => _setFilters({ ...filters, order: e })
  const handleChangePage = (event, newPage) => _setFilters({ ...filters, pageNo: newPage })
  const handleChangeRowsPerPage = (event) => {
    _setFilters({ ...filters, pageNo: 0, size: parseInt(event, 10) })
  }

  const renderApps = () => {
    return (
      <Grid container spacing={3} className={classes.gridcontainer}>
        {
          apps
            .map(u => {
            return (
              <Grid key={u.id} item xs={12} md={6} lg={4}>
                <AppListCard history={props.history} app={u} />
              </Grid>
            )
          })
        }
      </Grid>
    )
  }

  return (
    <div className={classes.container}>
      <Grid container spacing={1} className={classes.gridcontainerone}>
        <Grid item md={3} xs={12}>
          <AppTags
            totalApps={totalApps}
            currentTag={filters.tag} onClick={e => setTag(e)} />
        </Grid>

        <Grid item md={9} xs={12}>
          <Grid container spacing={3} className={classes.gridcontainerone}>
            <Grid item md={12} xs={12} className={classes.itemone}>
              <SearchField
                onBlur={downloadApps}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Apps Master" />
              {/* <DropDown title="Sort" options={drop} body={
                drop.map(o => {
                  return (
                    <MenuItem key={o.type} value={filters.sortDirection} onClick={() => setSortQuery(o.type)}>
                      <div className={classes.displayflex} >
                        <span className={classes.span}>{o.type}</span>
                      </div>
                    </MenuItem>
                  )
                })
              } />  */}
            </Grid>
          </Grid>
          <div>
            {apps.length === 0 ? <EmptyScreen /> : renderApps()}
          </div>
        </Grid>
      </Grid>

      {/* <TablePagination
        component="div"
        count={totalApps}
        page={filters.pageNo}
        onChangePage={handleChangePage}
        rowsPerPage={filters.size}
        onChangeRowsPerPage={handleChangeRowsPerPage} /> */}
        <CustomPagination
                   count={Math.ceil(totalApps / filters.size)}
                   totalCount = {totalApps}
                   page={filters.pageNo}
                   onChangePage={handleChangePage}
                   rowsPerPage={filters.size}
                   onChangeRowsPerPage={handleChangeRowsPerPage}
              />
    </div>
  )
}
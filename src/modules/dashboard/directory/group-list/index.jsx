import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link as Linking } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'


import { isActiveForRoles } from '../../../../utils/auth'
import SearchField from '../../../../components/AppSearchField'
import GroupListCard from '../../../../components/GroupListCard'
import { callApi } from '../../../../utils/api'
import EmptyScreen from '../../../../components/EmptyScreen'
import { TablePagination } from '@material-ui/core'
import DropDown from '../../../../components/DropDownComponent'
import MenuItem from '@material-ui/core/MenuItem'
import CustomPagination from '../../../../components/CustomPagination'

const drop = [
  {type: 'ASC'}, {type: 'DESC'}
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
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden'
  },
  gridcontainer: {
    margin: 0,
    width: '100%'
  },
  griditemone: {
    paddingTop: 0
  },
  griditemtwo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 0
  },
  button: {
    marginLeft: 15
  },
  divlist: {
    flex: 1,
    overflow: 'auto'
  },

}))


const defaultFilters = {
  direction: "DESC",
  pageNumber: 0,
  pageSize: 10,
  keyword: "",
  sort: "GROUP_NAME"
}

export default function UserLayout(props) {
  const classes = useStyles()
  const [filters, _setFilters] = React.useState(defaultFilters)
  const [groups, setGroups] = React.useState([])
  const [totalUsers, setTotalUsers] = React.useState(0)

  const downloadGroups = () => {
    callApi(`/usersrvc/api/group/list`, 'POST', filters)
      .then(e => {
        if (e.success) {

          setGroups(e.data && e.data.elements ? e.data.elements : [])
          setTotalUsers(e.data ? e.data.totalElements : 0)
        }
      })
  }
  React.useEffect(() => downloadGroups(), [filters])

  const setSearchQuery = e => { _setFilters({ ...filters, keyword: e, pageNumber: 0 }) }

  const change = e => _setFilters({ ...filters, ...e })
  const handleChangePage = (event, newPage) => _setFilters({ ...filters, pageNumber: newPage })
  const handleChangeRowsPerPage = (event) => {
    _setFilters({ ...filters, pageNumber: 0, pageSize: parseInt(event, 10) })
  }

  return (
    <div className={classes.container}>
      <Grid container spacing={3} className={classes.gridcontainer}>
        <Grid item md={6} xs={12} className={classes.griditemone}>
          <SearchField
            onBlur={downloadGroups}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by group name" />
        </Grid>
        <Grid item md={6} xs={12} className={classes.griditemtwo}>
          <DropDown title="Sort" options={drop} body={
            drop.map(o => {
              return (
                <MenuItem key={o.type} value={filters.sortDirection} onClick={() => change({ direction: o.type })} >
                  <div className={classes.displayflex}>
                    <span className={classes.span}>{o.type}</span>
                  </div>
                </MenuItem>
              )
            })
          }/>
          {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']) && (<Linking to="/dash/directory/add/groups">
            <Button variant="contained" color="primary" className={classes.button} startIcon={<AddIcon />} ><span className={classes.bulk}>Add Group</span></Button>
          </Linking>)}
        </Grid>
      </Grid>

      <div className={classes.divlist}>
        {
          groups.length === 0 ?
            <EmptyScreen /> :
            groups.map(u => <GroupListCard onClick={() => isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN','READ_ONLY']) && props.history.push(`/dash/directory/groups/${u.id}`)} key={u.id} group={u} history={props.history} onUpdate={downloadGroups} />)
        }
      </div>

      {/* <TablePagination
        component="div"
        count={totalUsers}
        page={filters.pageNumber}
        onChangePage={handleChangePage}
        rowsPerPage={filters.pageSize}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
      <CustomPagination              
              count={Math.ceil(totalUsers / filters.pageSize)} 
              totalCount = {totalUsers}             
              page={filters.pageNumber}
              onChangePage={handleChangePage}
              rowsPerPage={filters.pageSize}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
    </div>
  )
}
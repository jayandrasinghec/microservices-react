/* eslint-disable react/display-name */
import React from 'react'
import { callApi } from '../../../../../utils/api'
import WorkflowAssign from './WorkflowAssign'
import AppMaterialTable from '../../../../../components/AppMaterialTable';
import {isActiveForRoles} from '../../../../../utils/auth'
import { TablePagination } from '@material-ui/core'
import SearchField from '../../../../../components/AppSearchField'
import CustomPagination from '../../../../../components/CustomPagination';


const defaultFilters =
{
  "direction": "ASC",
  "filters": {
    // "groupIds": "5ebd52974ba32c7bc4f860b7",
    "status": [
      "PENDING_APPROVAL"
    ],
    // "userId": "5ebd52974ba32c7bc4f860b7"
  },
  pageNumber: 0,
  pageSize: 10,
  "sort": "CREATED_DATETIME",
  "type": "REQUESTS"
}


export default function Global() {
  const [query, _setQuery] = React.useState(defaultFilters)
  const [data, setData] = React.useState([])
  const [reassign, setReassign] = React.useState(false);
  const [totalUsers, setTotalUsers] = React.useState(0)


  const handleReassignClick = () => {
    setReassign(true);
  };

  const handleReassignClose = () => {
    setReassign(false);
  };

  const downloadData = (f = query) => {
    callApi(`/workflowsrvc/api/workflowtaskassignment/admin/list`, 'POST', f)
      .then(e => {
        if (e.success) {
          setData(e.data && e.data.elements ? e.data.elements : [])
          setTotalUsers(e.data ? e.data.totalElements : 0)
        } 
      })
  }

  React.useEffect(() => downloadData(), [query])

  const setSearchQuery = e => {
    _setQuery({ ...query, keyword: e , pageNumber: 0  });
  }
  const handleChangePage = (event, newPage) => _setQuery({ ...query, pageNumber: newPage })
  const handleChangeRowsPerPage = (event) => {
    _setQuery({ ...query, pageNumber: 0, pageSize: parseInt(event, 10) })
  }

  const columns = [
    // { title: 'Process Name', field: 'topic' },
    { title: 'Application', field: 'appName' },
    // { title: 'Type', field: 'type' },
    { title: 'Status', field: 'status' },
    { title: 'Created By', field: 'createdBy' },
    { title: 'Group Name', field: 'groupName' },
    { title: 'Requestor', field: 'requestorName' },
    { title: 'Current Assign', field: 'assigneeName' },
    isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) ? {
      title: 'Actions',
      render: u => {
        const onSubmit = () => {
          handleReassignClose()
          downloadData()
        }

        // return isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && <WorkflowAssign item={u} onClose={handleReassignClose} onUpdate={onSubmit} />
        return <WorkflowAssign item={u} onClose={handleReassignClose} onUpdate={onSubmit} />
      }
    } : { sorting: false }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
      {/* <SearchField
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search" /> */}

      <AppMaterialTable 
        columns={data.length > 0 ? columns : []}
        data={data}
      />
      {/* <TablePagination
        component="div"
        // rowsPerPageOptions={[12, 24, 60, 120]}
        count={totalUsers}
        page={query.pageNumber}
        onChangePage={handleChangePage}
        rowsPerPage={query.pageSize}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
      <CustomPagination
                   count={Math.ceil(totalUsers / query.pageSize)}
                   totalCount = {totalUsers}
                   page={query.pageNumber}
                    onChangePage={handleChangePage}
                    rowsPerPage={query.pageSize}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
              />
    </div>
  )
}



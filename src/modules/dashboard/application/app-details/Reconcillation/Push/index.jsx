/* eslint-disable react/display-name */
import React from 'react'
import Plus from '../../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/plus.svg'
import { callApi } from '../../../../../../utils/api'
import { showSuccess } from '../../../../../../utils/notifications'
import AppMaterialTable from '../../../../../../components/AppMaterialTable';
import Edit from '../../../../../../FrontendDesigns/new/assets/img/icons/edit.svg'
import {isActiveForRoles} from '../../../../../../utils/auth'
import { TablePagination } from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import AddPush from '../AddRule/AddPush'
import EditPush from '../EditRule/EditPush'
import Delete from '../../../../../../FrontendDesigns/new/assets/img/icons/Delete.svg'
import DeleteModal from '../../../../../../components/DeleteModal';
import DropDown from '../../../../../../components/DropDownComponent'
import MenuItem from '@material-ui/core/MenuItem'
import CustomPagination from '../../../../../../components/CustomPagination';
import { getFormatedDate } from '../../../../../../utils/helper';

const defaultFilters = {
  order: "ASC",
  pageNo: 0,
  size: 10,
  sortBy: "type"
}

const drop = [
  {type: 'ASC'}, {type: 'DESC'}
]

export default function Push(props) {

  const {id} = props.match.params
  const {table, setTable} = props
  const [addEditView, setAddEditView] = React.useState()
  const [rowId, setRowId] = React.useState()
  const [filters, _setFilters] = React.useState(defaultFilters)

  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false)
  const [name, setName] = React.useState("");

  const handleModalOpen = (mode, id) => {
    setOpen(true);
    setName(mode);
    setRowId(id);
  };
  const handleModalClose = () => {
    setOpen(false);
    setName("");
    setRowId("");
  };

  const [data, setData] = React.useState([])
  const [totalUsers, setTotalUsers] = React.useState(0)

  const downloadData = () => {
  
    const postBody = {
      "filter": {
        "applicationId": id
      },
      "keyword": "",
      "pageNumber": filters.pageNo,
      "pageSize": filters.size,
      "sortDirection": filters.order,
      "sortOn": [
        filters.sortBy
      ]
    }

    callApi(`/provsrvc/reconciliation/push/search`, 'POST', postBody)
    .then(e => {
      console.log(e)
      if (e.success) {
        setData(e.data ? e.data.content : [])
        setTotalUsers(e.data ? e.data.totalElements : 0)
      } 
    })
  }

  const deleteRow = () => {
    setSaving(true)
    callApi(`/provsrvc/reconciliation/push/${rowId} `, 'DELETE')
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('Deleted Successfully!')
          downloadData()
          handleModalClose()
        }
      })
      .catch(() => setSaving(false))
  }

  React.useEffect(() => downloadData(), [filters])

  const columns = [
    { title: 'Name', field: 'name', render: rowData => <span> {rowData.name || '--'} </span> },
    { title: 'Mode', field: 'reconMode', render: rowData => <span> {rowData.reconMode || '--'} </span> },
    // { title: 'Frequency', field: 'frequency', render: rowData => <span> {rowData.frequency || '--'} </span> },
    { title: 'Type', field: 'type', render: rowData => <span> {rowData.type || '--'} </span> },
    { title: 'Sync State', field: 'idmRepositoryField', render: rowData => <span> {rowData.idmRepositoryField || '--'} </span> },
    // { title: 'Updated At', field: 'updatedDateTime', render: row =>  <span>{ getFormatedDate(row.lastRunDateTime, 'DD/MM/YYYY HH:mm:ss')}</span> },
    { title: 'Last Run Datetime', field: 'lastRunDateTime', render: row =>  <span>{ row.lastRunDateTime ? getFormatedDate(row.lastRunDateTime, 'DD/MM/YYYY HH:mm:ss') : '--'}</span> },
  ]

  const handleChangePage = (event, newPage) => _setFilters({ ...filters, pageNo: newPage })
  const handleChangeRowsPerPage = (event) => {
    _setFilters({ ...filters, pageNo: 0, size: parseInt(event, 10) })
  }

  return (
    <>
    { table === true ? (
      <>
      <AppMaterialTable
        columns={data.length > 0 ? columns : []}
        data={data}
        actions={[
          {
            icon: () => (
              <div style={{ display: 'flex' }}>
                <DropDown title={filters.order || 'Sort'} options={drop} body={
                  drop.map(o => {
                    return (
                      <MenuItem key={o.type} value={filters.order} onClick={() => _setFilters({ ...filters, order: o.type })} >
                        <div>
                          <span>{o.type}</span>
                        </div>
                      </MenuItem>
                    )
                  })
                }/>
                {isActiveForRoles(['ORG_ADMIN']) && 
                <div 
                  onClick={() => {
                    setTable(false)
                    setAddEditView('ADD-NEW')
                  }}
                  style={{ cursor: 'pointer' }} 
                  className="primary-btn-view">
                    <img src={Plus} alt="" title /> ADD NEW
                </div>}
              </div>
            ),
            isFreeAction: true,
          },
          {
            icon: () => (
              <VisibilityIcon style={{ color: '#ddd' }}/>
            ),
            tooltip: 'View Row',
            onClick: (event, rowData) => { 
              setTable(false) 
              setRowId(rowData.id)
              setAddEditView('VIEW-ROW')
            }
          },
          {
            icon: () => (
              <img src={Edit} alt="" title />
            ),
            hidden: !isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']),
            tooltip: 'Edit Row',
            onClick: (event, rowData) => { 
              setTable(false) 
              setRowId(rowData.id)
              setAddEditView('EDIT-ROW')
            }
          },
          {
            icon: () => (
              <img src={Delete} alt="" title />
            ),
            tooltip: 'Delete Row',
            hidden: !isActiveForRoles(['ORG_ADMIN']),
            onClick: (event, rowData) => { 
              setTable(true)
              handleModalOpen(rowData.mode, rowData.id)
            }
          },
          
        ]}
        body={
          <>
            {open ? (<DeleteModal saving={saving} open={open} onClose={handleModalClose} name={name} onDelete={deleteRow} />) : (<></>)}
          </>
        }
      />
      {/* <TablePagination
        component="div"
        // rowsPerPageOptions={[12, 24, 60, 120]}
        count={totalUsers}
        page={filters.pageNo}
        onChangePage={handleChangePage}
        rowsPerPage={filters.size}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
      <CustomPagination             
              count={Math.ceil(totalUsers / filters.size)}
              totalCount = {totalUsers}
              page={filters.pageNo}
              onChangePage={handleChangePage}
              rowsPerPage={filters.size}
              onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </>
    ) : (
      addEditView === 'ADD-NEW' ? 
        ( <AddPush app={props.app} downloadData={downloadData} setTable={setTable} /> ) :
      addEditView === 'EDIT-ROW' ? 
        ( <EditPush app={props.app} downloadData={downloadData} setTable={setTable} rowId={rowId} type="EDIT"/> ) :
      addEditView === 'VIEW-ROW' ? 
        ( <EditPush app={props.app} downloadData={downloadData} setTable={setTable} rowId={rowId} type="VIEW"/> ) : (<></>)
    )}
    
    </>
  )
}



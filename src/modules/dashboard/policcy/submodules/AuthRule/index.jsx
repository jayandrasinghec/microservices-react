import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { isActiveForRoles } from '../../../../../utils/auth';
import { callApi } from '../../../../../utils/api';
import EditAuthRule from './EditAuthRule';
import ActiveStatusChip from '../../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../../components/HOC/InactiveStatusChip';
import AppMaterialTable from '../../../../../components/AppMaterialTable';
import DeleteModal from '../../../../../components/DeleteModal';
import Delete from '../../../../../FrontendDesigns/new/assets/img/icons/Delete.svg';
import Edit from '../../../../../FrontendDesigns/new/assets/img/icons/edit.svg';
import Plus from '../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/plus.svg';
import { showSuccess } from '../../../../../utils/notifications';
import CustomPagination from '../../../../../components/CustomPagination';

const useStyles = makeStyles(theme => ({
  button: {
    float: 'right',
    borderRadius: '8px',
    marginRight: 20
  },
}));

const defaultRuleFilters = {
  "filter": {
    "type": "AUTH"
  },
  "keyword": "string",
  "pageNumber": 0,
  "pageSize": 10,
  "sortDirection": "ASC",
  "sortOn": [
    "id"
  ]
}

const defaultData = {
  "name": "",
  "description": "",
  "active": false,
  "type": "AUTH",
  "resultSet": [{
    "authProvider": "CYMMETRI_AUTH",
    "authFailedCount": 3,
    "mobileMaxDeviceLimit": "",
    "mobileRefreshTokenExpiryMinutes": "",
    "mobileTokenExpiryMinutes": "",
    "refreshTokenExpiryMinutes": 60,
    "tokenExpiryMinutes": 60,
    "unlockAfterMinutes": 60
  }]
}

const AuthenticationRule = (props) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [filters, _setFilters] = useState(defaultRuleFilters);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState("");
  const [ids, setIds] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [newData, setNewData] = useState(defaultData)
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState("add");
  const [authRuleListData, setAuthRuleListData] = useState([]);

  const columns = [
    { title: 'Name', field: 'name', cellStyle: { fontWeight: '700', border: 'none' } },
    { title: 'Description', field: 'description' },
    { title: 'Provider', field: 'resultSet[0].authProvider' },
    {
      title: 'Status',
      field: 'active',
      render: rowData => {
        return rowData.active === true ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip>
      }
    }
  ]

  const downloadRuleList = () => {
    callApi(`/rulesrvc/ruleEngine/list`, 'POST', filters)
      .then(e => {
        if(e.success) {
          e.data && e.data.content && e.data.content.length > 0 && setAuthRuleListData(e.data.content)
          e.data && setTotal(e.data ? e.data.totalElements : 0)
        }
      })
  }

  useEffect(() => {
    downloadRuleList()
  }, [filters])

  const handleModalOpen = (name, id) => {
    setOpen(true);
    setName(name);
    setIds(id);
  };
  const handleModalClose = () => {
    setOpen(false);
    setName("");
    setIds("");
  };

  const handleDelete = () => {
    setSaving(true)
    callApi(`/rulesrvc/ruleEngine/${ids}`, 'DELETE')
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('Rule Deleted Successfully!')
          downloadRuleList()
          handleModalClose()
        }
      })
      .catch(() => setSaving(false))
  }

  const handleClick = (data) => {
    setNewData(data)
    setOpenEdit(true)
  }

  const handleChangePage = (event, newPage) => {
    _setFilters({ ...filters, pageNumber: newPage })
  }

  const handleChangeRowsPerPage = (event) => { 
    _setFilters({ ...filters, pageNumber: 0, pageSize: parseInt(event, 10) })
  }

  return (
    <>
      {!openEdit && (
        <>
          <AppMaterialTable
            columns={authRuleListData.length > 0 ? columns : []}
            data={authRuleListData}
            actions={[
              {
                icon: () => isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) && (
                  <div>
                    <div onClick={() => {handleClick(newData); setMode('add')}} style={{ cursor: 'pointer' }} className="primary-btn-view">
                      <img src={Plus} alt="" title /> Add Rule
                    </div>
                  </div>
                ),
                hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
                isFreeAction: true,
              },
              {
                icon: () => (
                  isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : <img src={Edit} alt="" title />
                ),
                tooltip: 'Edit Rule',
                onClick: (event, rowData) => {
                  handleClick(rowData)
                  setMode('edit')
                },
                hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
              },
              {
                icon: () => (
                  <img src={Delete} alt="" title />
                ),
                tooltip: 'Delete Rule',
                onClick: (event, rowData) => handleModalOpen(rowData.name, rowData.id),
                hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
              }
            ]}
            body={
              <>
                {open ? (<DeleteModal saving={saving} open={open} onClose={handleModalClose} name={name} onDelete={handleDelete} />) : (<></>)}
              </>
            }
          />
           <CustomPagination              
              count={Math.ceil(total / filters.pageSize)}
              totalCount = {total}
              page={filters.pageNumber}
              onChangePage={handleChangePage}
              rowsPerPage={filters.pageSize}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </>
      )}
      {openEdit && (
        <EditAuthRule 
          editData={newData} 
          mode={mode} 
          setOpenEdit={setOpenEdit} 
          setMode={setMode}
          downloadRuleList={downloadRuleList} 
        />
      )}
    </>
  )
}

export default AuthenticationRule

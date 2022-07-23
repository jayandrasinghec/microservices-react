import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import AddIcon from "@material-ui/icons/Add";
import VisibilityIcon from '@material-ui/icons/Visibility';
import Avatar from "@material-ui/core/Avatar";

import DeleteModal from '../../../../../../../components/DeleteModal';
import { isActiveForRoles } from '../../../../../../../utils/auth';
import CustomPagination from '../../../../../../../components/CustomPagination';
import CustomMaterialTable from '../../../../../../../components/CustomMaterialTable';
import CardViewWrapper from '../../../../../../../components/HOC/CardViewWrapper';
import ActiveStatusChip from '../../../../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../../../../components/HOC/InactiveStatusChip';
import { callApi } from '../../../../../../../utils/api';
import { showSuccess } from '../../../../../../../utils/notifications';
import { AsyncAutoComplete } from '../../../../../administartion/components/AsyncAutocomplete';


const useStyles = makeStyles(theme => ({
  rulesSearchAdd: {
    float: "right",
  },
  tableAddIcon: {
    height: 32,
  },
  editDeleteIcon: {
    "& img": {
      width: "16px",
      height: "16px",
    },
  },

}));

export const SodTasks = (props) => {
  const { data } = props;
  const classes = useStyles();

  const [saving, setSaving] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [newData, setNewData] = useState(data);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [ids, setIds] = useState('');
  const [linkedTaskData, setLinkedTaskData] = useState([]);
  const [task, setTask] = useState(null);
  const [taskList, setTaskList] = useState([]);
  const [total, setTotal] = useState(0);

  const defaultQuery = {
    "filter": {
      "active": null,
      "businessRoleId": newData.id ? newData.id : "",
      "name": "",
      "processId": "",
    },
    "keyword": "",
    "pageSize": 10,
    "pageNumber": 0,
    "sortDirection": "ASC",
    "sortOn": [
      "id"
    ]
  }

  const defaultTaskListQuery = {
    "filter": {
      "active": null,
      "businessRoleId": "",
      "name": "",
      "processId": "",
    },
    "keyword": "",
    "pageSize": 10,
    "pageNumber": 0,
    "sortDirection": "ASC",
    "sortOn": [
        "id"
    ]
  }

  const [query, _setQuery] = React.useState(defaultQuery);
  const [taskListquery, _setTaskListQuery] = useState(defaultTaskListQuery);

  useEffect(() => {
    downloadLinkedTaskData()
  }, [query])

  const downloadLinkedTaskData = () => {
    setLoading(true)
    callApi(`/sod/task/list`, 'POST', query)
      .then(e => {
        setLoading(false)
        if (e.success) {
          setLinkedTaskData(e.data ? e.data.content : [])
          setTotal(e.data ? e.data.totalElements : 0)
        } 
      })
      .catch(() => setLoading(false))
  }

  const columns = [
    { title: "Task Name", field: "name" },
    { title: "Task Description", field: "description" },
    { title: "Risk Score", field: "riskLevel" },
    {
      title: 'Status',
      field: 'active',
      render: rowData => {
        return rowData.active === true ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip>
      }
    },
  ]

  const handleDeleteModalOpen = (name, id) => {
    setOpenDelete(true);
    setName(name);
    setIds(id);
  }

  const handleDeleteModalclose = () =>{
    setOpenDelete(false);
    setName('');
    setIds('');
  } 

  const handleDelete = () => {
    const data = {
      "businessRoleId": newData.id,
      "taskId": ids
    }
    setSaving(true);
    callApi(`/sod/task/removeBusinessRole`, 'PUT', data)
      .then(e => {
        if (e.success) {
          setSaving(false);
          setOpenDelete(false);
          downloadLinkedTaskData();
          showSuccess("Linked Task Deleted Successfully.");
        } 
      })
      .catch(() => setSaving(false))
  }

  const handleAddTask = () => {
    const data = {
      "taskId": task.id,
      "businessRoleId": newData.id
    }
    setSaving(true);
    callApi(`/sod/task/addBusinessRole`, 'PUT', data)
      .then(e => {
        if (e.success) {
          setSaving(false);
          setTask(null);
          downloadLinkedTaskData();
          showSuccess("Task Linked Successfully.");
        } 
      })
      .catch(() => setSaving(false))
  }

  const getTaskData = (value, success, error) => {
    let obj = taskListquery;
    obj.filter.name = value;
    callApi(`/sod/task/list`, 'POST', obj)
    .then(e => {
      if (e.success) {
        setTaskList(e.data ? e.data.content : [])
        success(e.data ? e.data.content : [])
      } 
    })
  }

  const handleChangePage = (event, newPage) => {
    _setQuery({ ...query, pageNumber: newPage })
  }

  const handleChangeRowsPerPage = (event) => { 
    _setQuery({ ...query, pageNumber: 0, pageSize: parseInt(event, 10) })
  }

  return (
    <>
      <CardViewWrapper>
        <h5>Link Task to Business Role - SoD</h5>
        <Grid container justify="space-between" className="pt-3">
          <Grid item xs={6}>
            <AsyncAutoComplete
              label=""
              value={task}
              style={{ maxWidth: 300 }}
              disabled={isActiveForRoles(['READ_ONLY'])}
              getOptionLabel={(option, allOptions) => {
                if (typeof option === "object") {
                  return option.name;
                } else {
                  return '';
                }
              }}
              api={(value, success, error) => {
                getTaskData(value, success, error)
              }}
              onLoadApiCall={true}
              onChange={(event, newValue, reason) => {
                if(newValue){
                  setTask(newValue)
                }

                if(reason === 'clear') {
                  setTask(null)
                }          
              }}
              isSetOptions={true}
              allOptions={taskList}
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              disabled={!task}
              disableElevation
              disableFocusRipple
              disableRipple
              onClick={handleAddTask}
              style={{ float: 'right', marginTop: 4 }}
            >
              Link Task Definition
            </Button>
          </Grid>
        </Grid>
      </CardViewWrapper>
      <CustomMaterialTable
        columns={linkedTaskData.length > 0 ? columns : []}
        data={linkedTaskData}
        isLoading={loading}
        title='Linked Task to Business Role - SoD'
        actions={
          [
            {
              icon: () => (
                isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : 
                <Avatar
                  src={require("../../../../../../../assets/Delete.png")}
                  className={classes.editDeleteIcon}
                />
              ),
              tooltip: "Delete",
              hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
              onClick: (event, rowData) => handleDeleteModalOpen(rowData.name, rowData.id)
            },
          ]
        }
        body={
          <DeleteModal 
            saving={saving} 
            open={openDelete} 
            onClose={handleDeleteModalclose} 
            onDelete={handleDelete}
            name={name}
            desc='Are you sure you want to remove linked process. 
              Warning! This action cannot be undone.' 
          /> 
        }
      />
      <Grid item xs={12} spacing={3,2} style={{margin: 16}}>
        <CustomPagination              
          count={Math.ceil(total / query.pageSize)}
          totalCount = {total}
          page={query.pageNumber}
          onChangePage={handleChangePage}
          rowsPerPage={query.pageSize}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Grid>
    </>
  )
}

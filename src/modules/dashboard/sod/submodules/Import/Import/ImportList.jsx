import React, { useEffect, useState } from 'react';
import CustomMaterialTable from '../../../../../../components/CustomMaterialTable';
import CustomPagination from '../../../../../../components/CustomPagination';
import { isActiveForRoles } from '../../../../../../utils/auth';
import { Button, makeStyles } from '@material-ui/core';
import { PlayForWork } from '@material-ui/icons';
import { useHistory } from 'react-router';
import { callApi } from '../../../../../../utils/api';
import { getFormatedDate } from '../../../../../../utils/helper';
import { useParams } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  button: {
    borderRadius: '8px',
    marginRight: 20
  },
  tabs: {
    padding: 0
  },
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
  stepper: {
    maxWidth: '50vw',
    margin: '0 auto',
    width: '100%',
    backgroundColor: 'transparent'
  },
  steplabel: {
    color: '#363793'
  }
}));


const defaultQuery = {
  pageNo: 0,
  pageSize: 10
}

const ImportList = ({ }) => {
  const classes = useStyles();
  const history = useHistory();
  const { type } = useParams()

  const [query, _setQuery] = useState(defaultQuery);
  const [totalFiles, setTotalFiles] = useState(0);
  const [rowData, setRowData] = useState([]);
  
  const getAllImports = () => {
    let url=''
    if(type === 'entities'){
      url = `/sod/import/sodentities/getAllLots`;
    }
    if(type === 'policies'){
      url = `/sod/import/policyRule/getAllLots`;
    }
    callApi(url, 'POST', query)
      .then(res => {
        if(res.success) {
          let row = res.data.content.map((item) => {
            let obj = {}
            obj.id = item.id;
            obj.fileName = item.fileName;
            obj.type = item.type;
            obj.status = item.status;
            obj.createdBy = item.createdBy;
            obj.created = item.created;

            return obj;
          })
          setRowData(row)
          setTotalFiles(res.data.totalElements)
        }
      })
      .catch(err => {})
  }

  useEffect(() => {
    getAllImports();
  }, [query.pageNo, query.pageSize]);

  const columns=[
   { title: 'File Name', field: 'fileName' },
   { title: 'Type', field: 'type' },
   { title: 'Status', field: 'status' },
   { title: 'Created By', field: 'createdBy' },
   { title: 'Created At', field: 'created', render: row => <span>{getFormatedDate(row['created'])}</span> }
  ]

  const handleImportClick = () => {
    history.push(`/dash/sod/import/${type}/file/upload`)
  }

  const handleChangePage = (_, newPage) => {
     _setQuery({ ...query, pageNo: newPage });
  }

  const handleChangeRowsPerPage = (event) => {
    _setQuery({ ...query, pageNo: 0, pageSize: parseInt(event, 10) })
  }

  const handleRedirectToImportSummary = (newRowData) => {
    history.push({pathname: `/dash/sod/import/${type}/importSummary/created`, state: { id: newRowData.id }});
  }

  return(
    <>
      <CustomMaterialTable
        columns={rowData.length > 0 ? columns : []}
        data={rowData}
        onRowClick={(_, newRowData) => handleRedirectToImportSummary(newRowData)}
        actions={
          [
            {
              icon: () => (
                <span>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PlayForWork/>}
                    disableElevation
                    disableFocusRipple
                    disableRipple
                    className={classes.tableAddIcon}
                  >
                    Import
                  </Button>
                </span>
              ),
              isFreeAction: true,
              hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
              onClick: () => handleImportClick(),
            },
          ]
        }
      />
      <CustomPagination              
        count={Math.ceil(totalFiles / query.pageSize)}
        totalCount = {totalFiles}
        page={query.pageNo}
        onChangePage={handleChangePage}
        rowsPerPage={query.pageSize}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
}

export default ImportList;
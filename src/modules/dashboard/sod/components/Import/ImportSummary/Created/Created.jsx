import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import CustomMaterialTable from '../../../../../../../components/CustomMaterialTable';
import { getFormatedDate } from '../../../../../../../utils/helper';
import CustomPagination from '../../../../../../../components/CustomPagination';
import { callApi } from '../../../../../../../utils/api';

const Created = ({ data }) => {
  const history = useHistory();
  const location = useLocation();
  const { type } = useParams();
  const [id, setId] = useState(location.state && location.state.id ? location.state.id : '');

	const defaultQuery = {
    id: id,
    status: "CREATED",
    pageNo: 0,
    pageSize: 10
  }

  const [rowData, setRowData] = useState([])
  const [query, _setQuery] = useState(defaultQuery)
  const [totalData, setTotalData] = useState(0)

	const getCreatedImportedRecords = () => {
    let url = '';
    if(type === 'entities'){
      url = `/sod/import/sodentities/getImportedRecords`
    }
    if(type === 'policies'){
      url = `/sod/import/policyRule/getImportedRecords`
    }
    callApi(url, 'POST', query)
      .then(res => {
        if(res.success) {
          let row = res.data.content.map((item) => {
            let obj = {}
            obj.name = type === 'entities' ? item.record.processName : item.record.policyName;
            obj.createdBy = item.createdBy;
            obj.created = item.created;

            return obj;
          })
          setRowData(row)
          setTotalData(res.data.totalElements)
        }
      })
      .catch(err => {})
  }

  useEffect(() => {
    if(id && id !== undefined && id !== null && id !== ''){
      getCreatedImportedRecords();
    }else{
      history.push('/dash/sod/import');
    }
	}, [query.pageNo, query.pageSize, id])

	const columns = [
    { title: 'Name', field: 'name', cellStyle: { fontWeight: '700', border: 'none' } },
    { title: 'Created By', field: 'createdBy' },
    { title: 'Created At', field: 'created', render: row =>  <span>{ getFormatedDate(row['created'])}</span>}
  ]

	const handleChangePage = (event, newPage) => _setQuery({ ...query, pageNo: newPage })
  const handleChangeRowsPerPage = (event) => {
    _setQuery({ ...query, pageNo: 0, pageSize: parseInt(event, 10) })
  }

	return(
		<Grid container>
			<Grid item xs={12}>
				<CustomMaterialTable 
					title={<p>{data.created} records created.</p>}
					columns={rowData.length > 0 ? columns : []}
					data={rowData}
				/>
				<CustomPagination
					count={Math.ceil(totalData / query.pageSize)} 
					totalCount = {totalData}    
					page={query.pageNo}
					onChangePage={handleChangePage}
					rowsPerPage={query.pageSize}
					onChangeRowsPerPage={handleChangeRowsPerPage}
        />
			</Grid>
		</Grid>
	);
}

export default Created;
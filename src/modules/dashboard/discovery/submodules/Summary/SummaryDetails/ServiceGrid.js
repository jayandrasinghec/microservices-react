import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DescriptionIcon from '@material-ui/icons/Description';
import WarningIcon from '@material-ui/icons/Warning';
import CloseIcon from '@material-ui/icons/Close'
import { Button, Grid, Modal } from '@material-ui/core';

import CustomPagination from '../../../../../../components/CustomPagination'
import ServiceDescriptionModal from './ServiceDescriptionModal';
import { callApi } from '../../../../../../utils/api';
import CustomTable from '../../../components/CustomTable';

const useStyles = makeStyles(theme => ({
  link: {
    color: '#007bff',
    '&:hover': {
      color: '#0056b3',
      cursor: 'pointer',
      textDecoration: 'underline'
    }
  },
  rulesSearchAdd: {
    float: "right",
  },
}));

export default function ServiceGrid(props) {
  const {scanId, id, setId, setSection, setViolationName} = props;
  const classes = useStyles();

  const [open, setOpen] = useState(false)
  const [rowData, setRowData] = useState(null)
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [pageFilter, setPageFilter] = useState({
    limit: 10,
    page: 0
  })

  const handleModalOpen = (data) => { setOpen(true); setRowData(data); };
  const handleModalClose = () => { setOpen(false); setRowData(null);};

  useEffect(() => {
    getServiceGridData()
  }, [pageFilter])

  const getServiceGridData = () => {
    callApi(`/iddiscsrvc/v1/api/${scanId}/services/${id}/findings?limit=${pageFilter.limit}&page=${pageFilter.page+1}`, 'GET')
      .then(e => {
        setData(e.data ? Object.values(e.data[0]) : [])
        setTotal(e.data ? e.count : 0)
      })
  }

  const displaySeverity = (val) => {
    if(val === 'danger') {
      return <span className="text-danger"><WarningIcon /><span className='mt-1 ml-2'>High</span></span>
    }else if(val === 'warning') {
      return <span className="text-warning"><WarningIcon /><span className='mt-1 ml-2'>Medium</span></span>
    }else{
      return <span>{val}</span>
    }
  }

  const columns = [
    // { title: 'Severity', field: 'level', cellStyle: { color: '#1F4287', fontWeight: 600 }, render: rowData => <span> {rowData.level || '--'} </span> },
    { title: 'Severity', render: rowData => <> {displaySeverity(rowData.level)} </> },
    { title: 'Name', field: 'name', render: rowData => <span className={classes.link} onClick={() => {setViolationName(rowData.name); setSection('items')}}> {rowData.description || '--'} </span>},
    { title: 'Flagged Resources', field: 'flagged_items', render: rowData => <span> {`${rowData.flagged_items}/${rowData.checked_items}` || '--'} </span>},
    { title: 'Description', field: 'description', render: rowData => <Button onClick={() => handleModalOpen(rowData)}><DescriptionIcon color="primary"/></Button>},
  ]

  const handleChangePage = (event, newPage) => {
    setPageFilter({ ...pageFilter, page: newPage });
  }
  const handleChangeRowsPerPage = (event) => {
    setPageFilter({ ...pageFilter,page: 0, limit: parseInt(event, 10) });
  }

  return (
    <>
      <Grid container spacing={3,2}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="small"
            disableElevation
            onClick={() => {
              setId(null)
              setSection('dash')
            }}
          >
            Back to Dashboard
          </Button>
        </Grid>
      </Grid>
      <CustomTable  
        title="Service Violations"
        columns={data.length > 0 ? columns : []}
        data={data}
      />
      <CustomPagination
        count={Math.ceil(total / pageFilter.limit)}
        totalCount = {total}
        page={pageFilter.page}
        onChangePage={handleChangePage}
        rowsPerPage={pageFilter.limit}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      {/* <ServiceDescriptionModal /> */}
      <Modal open={open} onClose={handleModalClose}>
        <div className="" id="centralModalSm1" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document" style={{overflowy: 'initial !important'}}>
            <div className="modal-content p-2">
              <div className="modal-header pb-1">
                <h4 className="modal-title w-100" id="myModalLabel">Description</h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true"><CloseIcon style={{ cursor: 'pointer' }} onClick={handleModalClose} /></span>
                </button>
              </div>
              {/* <div className="modal-body p-0" style={{ height: '65vh', overflowY: 'auto' }}> */}
              <div className="modal-body p-3" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                <div className=''>
                  {rowData && rowData.rationale}
                </div>
                <br/>
                { 
                  rowData && rowData.remediation && 
                  <><div>
                    <div className='h5'>Remediation</div>
                    <div>{rowData.remediation}</div>
                  </div> 
                  <br/></>
                }
                { 
                  rowData && rowData.compliance && rowData.compliance.length && 
                  <><div>
                    <div className='h5'>Compliance</div>
                    <ul>
                      {
                        rowData.compliance.map((comp, k) => <li key={k}>{comp.name}{comp.version && ` version ${comp.version}`}, {comp.reference && `reference ${comp.reference}`}</li>)
                      }
                    </ul>
                  </div> 
                  {/* <br/> */}
                  </>
                }
                { 
                  rowData && rowData.references && rowData.references.length && 
                  <><div>
                    <div className='h5'>References</div>
                    <ul>
                      {
                        rowData.references.map((ref, k) => <li key={k}><a href={ref}>{ref}</a></li>)
                      }
                    </ul>
                  </div> 
                  </>
                }
              </div>
              <div className="modal-footer pt-1 p-2">
                <Button variant="contained" color="primary" type="button" onClick={handleModalClose}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

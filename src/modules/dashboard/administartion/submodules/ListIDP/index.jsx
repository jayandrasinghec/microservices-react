/* eslint-disable react/display-name */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom"
import Box from '@material-ui/core/Box'
import { Link as Linking } from 'react-router-dom'
import VisibilityIcon from '@material-ui/icons/Visibility'
import Delete from '../../../../../FrontendDesigns/new/assets/img/icons/Delete.svg'
import Edit from '../../../../../FrontendDesigns/new/assets/img/icons/edit.svg'
import Plus from '../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/plus.svg';
import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications'
import ActiveStatusChip from '../../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../../components/HOC/InactiveStatusChip';
import MaterialTable from 'material-table';
import Modal from '@material-ui/core/Modal';
import Dustbin from '../../../../../assets/Dustbin.png'
import Button from '@material-ui/core/Button';
import CardViewWrapper from "../../../../../components/HOC/CardViewWrapper"
import ScrollWrapper from "../../../../../components/HOC/ScrollWrapper"
import Grid from '@material-ui/core/Grid';
import { isActiveForRoles } from '../../../../../utils/auth'
import { TablePagination } from '@material-ui/core'
import CustomPagination from '../../../../../components/CustomPagination';

const defaultQuery = {
  order: "ASC",
  pageNo: 0,
  size: 10,
  sortBy: "name"
}

function getModalStyle() {
  const top = 28;
  const left = 35;

  return {
    top: `${top}%`,
    left: `${left}%`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'fixed',
    width: 500,
    backgroundColor: 'white',
    borderRadius: '20px',
    textAlign: 'center',
    alignItems: 'center',
    display: 'block'
  },
  content: {
    width: 500,
    backgroundColor: '#E9EDF6',
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: '0px 0px 20px 20px',
    display: 'block'
  },
  modalheader: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '19px',
    lineHeight: '21px',
  },
  modalcontent: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '21px',
  },
  modalcancel: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '21px',
    color: '#363795',
  },
  ruleTable: {
    // paddingBottom: "0px !important",
    // marginBottom: '-16px',
    '& .MuiToolbar-gutters': {
      padding: "0px !important",
      '& .MuiTextField-root': {
        border: "1px solid #ccc",
        borderRadius: "4px",
        paddingLeft: "8px",
        '& .MuiInput-underline:before': {
          display: "none",
        },
        '& .MuiInput-underline:after': {
          display: "none",
        }
      },

      '& .MuiIconButton-root:hover': {
        background: "transparent",
        '& .MuiTouchRipple-root': {
          display: "none"
        }
      }
    },

    '& table': {
      // overflowX: 'none',
      border: '1px solid #ddd',
      // borderCollapse: "separate",
      borderSpacing: "0",
    },
    '& th ': {
      padding: "16px !important",
    },
    '& td ': {
      borderBottom: 0,
    },
    '& .MuiPaper-root': {
      boxShadow: "none",
      background: "transparent"
    },
    '& .MuiTablePagination-caption': {
      display: "unset !important",
      position: "absolute",
      color: "#a9b2c3",
    },
    '& .MuiTableCell-footer': {
      borderBottom: '0px',
      '& .MuiTablePagination-selectRoot': {
        background: "#282a73",
        borderRadius: "20px",
        color: "#fff",
        '& svg': {
          color: "#fff"
        }
      },
      '& .MuiButton-contained.Mui-disabled': {
        background: "transparent",
      }
    },
  },
  rulesSearchAdd: {
    float: 'right',
  },
  tableAddIcon: {
    height: 32,
  },
  editDeleteIcon: {
    '& img': {
      width: "16px",
      height: "16px",
    }
  },
  cardViewWrapper: {
    padding: theme.spacing(3, 2),
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
  },
  displayflex: {
    display: 'flex'
  },
  pointer: {
    cursor: 'pointer'
  }
}));

export default function Global() {
  const classes = useStyles();

  const [data, setData] = React.useState([])
  const [query, _setQuery] = React.useState(defaultQuery)
  const [totalData, setTotalData] = React.useState(0)
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [ids, setIds] = React.useState("");
  const [saving, setSaving] = React.useState(false)
  const history = useHistory();

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

  const downloadData = () => {
    callApi(`/authsrvc/AuthenticationProvider/listByPage?pageNo=${query.pageNo}&size=${query.size}&sortBy=${query.sortBy}&order=${query.order}`, 'GET')
      .then(e => {

        if (e.success) {
          setData(e.data && e.data.content ? e.data.content : [])
          setTotalData(e.data ? e.data.totalElements : 0)
        }
      })
  }

  React.useEffect(() => downloadData(), [query])

  const deleteApp = () => {
    setSaving(true)
    callApi(`/authsrvc/AuthenticationProvider/delete/${ids}`, 'POST')
      .then(e => {
        setSaving(false)
        if (e.success) {
          showSuccess('Deleted Successfully!')
          downloadData()
          handleModalClose()
        }
      })
      .catch(() => {
        setSaving(false)
      })
  }


  const body = (
    <div>
      <div style={modalStyle} className={classes.paper}>
        <div style={{ display: 'block' }}>
          <img alt="Dustbin" src={Dustbin} style={{ margin: '25px 0 10px 0' }} />
          <div style={{ paddingBottom: '10px' }}><span className={classes.modalheader}>Delete {name} IDP</span></div>
        </div>
        <div className={classes.content}>
          <div style={{ paddingTop: '10px' }}><span className={classes.modalcontent}>Warning! This cannot be undone.</span></div>
          {/* <div><span className={classes.modalcontent}>amet, consectur adipiscing elit, set do eusmud</span></div>
          <div><span className={classes.modalcontent}>tampor incident labour eu done dolore</span></div> */}
          <Button disabled={saving} onClick={deleteApp} variant="contained" style={{ margin: '10px' }} color="primary">{!saving ? 'Delete' : 'Deleting'}</Button>
          <div style={{ padding: '0 0 20px 0' }}><Linking onClick={handleModalClose} className={classes.modalcancel}>Cancel</Linking></div>
        </div>
      </div>
    </div>
  )

  const handleChangePage = (event, newPage) =>{ return _setQuery({ ...query, pageNo: newPage })}
 
  const handleChangeRowsPerPage = (event) => {
    _setQuery({ ...query, pageNo: 0, size: parseInt(event, 10) })
  }

  const columns = [
    { title: 'Name', field: 'name', cellStyle: { fontWeight: '700', border: 'none' } },
    { title: 'Description', field: 'description' },
    { title: 'Type', field: 'type' },
    {
      title: 'Status',
      field: 'active',
      render: rowData => {
        return rowData.active === true ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip>
      }
    },
  ]

  const handleClick = (id) => {
    history.push(`/dash/admin/idp/${id}`)
  }

  return (
    // <ScrollWrapper>
    <>
    <Grid container>
      <Grid item xs={12}>
        <Box className={classes.cardViewWrapper}>
          <Grid container spacing={2}>
            <Grid item xs={12} className={classes.ruleTable}>
              <MaterialTable
                title=""
                columns={columns}
                data={data}
                // isLoading={loading}
                options={{
                  paging: false,
                  rowStyle: {
                    border: '1px solid #ddd',
                    backgroundColor: '#fff',
                  },
                  cellStyle: {
                    borderBottom: 'none',
                  },
                  headerStyle: {
                    backgroundColor: 'transparent',
                    borderBottom: 'none',
                    color: '#666667',
                  },
                  paginationType: 'stepped',
                  draggable: true,
                  actionsColumnIndex: -1
                }}
                localization={{
                  pagination: {
                    labelRowsPerPage: '',
                    labelDisplayedRows: 'Displaying {from}-{to} of {count} records'
                  }
                }}
                actions={[
                  {
                    icon: () => isActiveForRoles(['ORG_ADMIN']) && (
                      <div className={classes.displayflex}>
                        <Linking to="/dash/admin/idp/add">
                          <div className={classes.pointer} className="primary-btn-view">
                            <img src={Plus} alt="" title /> ADD IDP
                        </div>
                        </Linking>
                      </div>
                    ),
                    isFreeAction: true,
                  },
                  {
                    icon: () => isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : <img src={Edit} alt="" title />,
                    tooltip: 'Edit Policy',
                    // hidden:!isActiveForRoles(['ORG_ADMIN']),
                    onClick: (event, rowData) => handleClick(rowData.id)
                  },
                  {
                    icon: () => (
                      <img src={Delete} alt="" title />
                    ),
                    tooltip: 'Delete Policy',
                    hidden: !isActiveForRoles(['ORG_ADMIN']),
                    onClick: (event, rowData) => handleModalOpen(rowData.name, rowData.id)
                  }
                ]}
              />
              <Modal open={open} onClose={handleModalClose}>
                {body}
              </Modal>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
    {/* <TablePagination
    component="div"
    // rowsPerPageOptions={[12, 24, 60, 120]}
    count={totalData}
    page={query.pageNo}
    onChangePage={handleChangePage}
    rowsPerPage={query.size}
    onChangeRowsPerPage={handleChangeRowsPerPage}
  /> */}
    <CustomPagination       
        count={Math.ceil(totalData / query.size)}
        totalCount = {totalData}
        page={query.pageNo}
        onChangePage={handleChangePage}
        rowsPerPage={query.size}
        onChangeRowsPerPage={handleChangeRowsPerPage}
    />
  </>
    // </ScrollWrapper>
  )
}

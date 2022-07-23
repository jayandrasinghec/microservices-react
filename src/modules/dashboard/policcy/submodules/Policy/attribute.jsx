/* eslint-disable react/display-name */
import React from 'react';
import { Link as Linking } from 'react-router-dom'

import '../../../../../FrontendDesigns/master-screen-settings/assets/css/settings.css';
import '../../../../../FrontendDesigns/master-screen-settings/assets/css/nice-select.css';
import Plus from '../../../../../FrontendDesigns/master-screen-settings/assets/img/icons/plus.svg';
import { callApi } from '../../../../../utils/api'

import ActiveStatusChip from '../../../../../components/HOC/ActiveStatusChip';
import InactiveStatusChip from '../../../../../components/HOC/InactiveStatusChip';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'auto',
    margin: 20
  },
  flexdiv: {
    display: 'flex',
  },
}))


export default function Global() {
  const [data, setData] = React.useState([])
  const classes = useStyles()

  const downloadData = () => {
    callApi(`/authsrvc/passwordPolicy/search?name=password%20policy%20name&pageNo=0&size=10&order=descending&sortBy=created'`, 'GET')
      .then(e => {

        if (e.success) setData(e.data&&e.data.content ? e.data.content : [])
      })
  }

  React.useEffect(() => downloadData(), [])

  // const onSubmit = () => {
  //   callApi(`/utilsrvc/meta/${newMaster.type}`, 'POST', newMaster)
  //     .then(e => {
  //
  //       if (e.success) {
  //         showSuccess('Master Added Successfully!')
  //         handleModalClose()
  //         downloadData()
  //       }
  //     })
  // }

  // const body = (
  //   <div>
  //     <div className="settings-add-new-global-modal" id="centralModalSm" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
  //       aria-hidden="true">
  //       <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
  //         <div className="modal-content">
  //           <div className="modal-header">
  //             <h4 className="modal-title w-100" id="myModalLabel">Add New Global Masters</h4>
  //             {/* <button type="button" className="close" data-dismiss="modal" aria-label="Close"> */}
  //             <span aria-hidden="true"><CloseIcon style={{ cursor: 'pointer' }} onClick={handleModalClose} /></span>
  //             {/* </button> */}
  //           </div>
  //           <div className="modal-body">
  //             <form>
  //               <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center mb-3">
  //                 <div className="col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
  //                   <AppTextInput
  //                     value={newMaster.name} onChange={e => change({ name: e.target.value })}
  //                     label="Name / Key" />
  //                 </div>
  //                 <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto">
  //                   <AppCheckbox
  //                     value={newMaster.status} onChange={e => change({ status: Boolean(e) })}
  //                     switchLabel={newMaster.status ? 'Active' : 'In-active'}
  //                     label="Status" />

  //                 </div>
  //               </div>
  //               <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center">
  //                 <div className="col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
  //                   <AppTextInput
  //                     value={newMaster.value} onChange={e => change({ value: e.target.value })}
  //                     label="Value" />
  //                 </div>
  //                 <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto">
  //                   <AppSelectInput
  //                     label="Type"
  //                     value={newMaster.type} onChange={e => change({ type: e.target.value })}
  //                     options={drop.map(o => o.type)} />
  //                 </div>
  //               </div>
  //             </form>
  //           </div>
  //           <div className="modal-footer">
  //             <button type="button" className="btn btn-left btn-sm mr-auto" onClick={handleModalClose}>Discard</button>
  //             <Button disabled={!isValid || saving} onClick={onSubmit} variant="contained" style={{ float: 'right', borderRadius: '8px', }}
  //               color="primary">{!saving ? 'Save' : 'Saving'}</Button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  const columns = [
    { title: 'Policy', field: 'name', cellStyle: { fontWeight: '700', border: 'none' } },
    { title: 'Description', field: 'description' },
    { title: 'Type', field: 'type' },
    {
      title: 'Status',
      field: 'active',
      render: rowData => {
        return rowData.active === true ? <ActiveStatusChip>Active</ActiveStatusChip> : <InactiveStatusChip>Inactive</InactiveStatusChip>
      }
    },
    { title: 'Created by', field: 'createdBy' },
  ]

  return (
    <div className={classes.container}>
      <MaterialTable
        title=""
        columns={columns}
        data={data}
        // isLoading={loading}
        options={{
          rowStyle: {
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
            icon: () => (
              <div className={classes.flexdiv}>
                <Linking to="/dash/policy/password/add">
                <div style={{ cursor: 'pointer' }} className="primary-btn-view">
                  <img src={Plus} alt="" title /> ADD Role
                </div>
                </Linking>
            </div>
            ),
            isFreeAction: true,
          },
        ]}
      />
      {/* <Modal open={open} onClose={handleModalClose}>
        {body}
      </Modal> */}
    </div>
  )
}



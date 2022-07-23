import React from 'react'
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import VisibilityIcon from '@material-ui/icons/Visibility'
import AceEditor from "react-ace";
import Beautify from 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/webpack-resolver'

import { callApi } from '../../../../../utils/api'
import { showSuccess } from '../../../../../utils/notifications'
import { isActiveForRoles } from '../../../../../utils/auth'
import AppTextInput from '../../../../../components/form/AppTextInput'
import AppSelectInput from '../../../../../components/form/AppSelectInput'
import AppCheckbox from '../../../../../components/form/AppCheckbox'
import AddNewModal from '../../../../../components/AddNewNotification'
import MUIRichTextEditor from 'mui-rte'
import InvertColorsIcon from '@material-ui/icons/InvertColors'
import Box from '@material-ui/core/Box';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import Collapsible from 'react-collapsible';
import { convertFromHTML, ContentState, convertToRaw, stateToHTML, convertFromRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html';
import '../../../../../FrontendDesigns/master-screen-settings/assets/css/notification-template.css'
import { Avatar, IconButton, TablePagination } from '@material-ui/core'
import CustomPagination from '../../../../../components/CustomPagination';
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'

const defaultTheme = createMuiTheme()

Object.assign(defaultTheme, {
    overrides: {
        MUIRichTextEditor: {
            root: {
                marginTop: 5,
                width: "100%",
                backgroundColor: "#E9EDF6"
            },
            editor: {
                //overflow: "scroll",
                backgroundColor: "#F6F6F9",
                minHeight: 90,
                //maxHeight: 100,
                padding: 10
            },
            placeHolder: {
                minHeight:85
            },
        }
    }
})

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex', flexDirection: 'column', width: '100%', padding: 25,
    },
    list: {
        backgroundColor: "rgba(255,255,255,.25)", padding: '25px 15px 25px 15px !Important', borderRadius: 12
    },
    heading: {
        fontSize: 18,
        marginBottom: 20,
    },
    listItem: {
        backgroundColor: "#ffffff",
        marginBottom: 10,
        padding: 20
    },
    item: {
        marginLeft: "0px !important",
        marginRight: "0px !important"
    },
    gridText: {
        textAlign: "start"
    },
    gridIcon: {
        textAlign: "end",
        "& .MuiIconButton-root": {
            padding: '0px'
        }
    }, 
    gridName: {
        fontSize: "16px !important",
        fontWeight: "500 !important"
    }, 
    gridTime: {
        fontSize: 16
    }, 
    boxActive: {
        background: "#6dc497",
        color: "#fff",
        borderRadius: 20,
        textAlign: "center",
        fontSize: 12,
        width: "fit-content",
        padding: "4px 16px",
    }, boxInActive: {
        color: "#fff",
        borderRadius: 20,
        textAlign: "center",
        fontSize: 12,
        width: "fit-content",
        padding: "4px 16px",
        background: "#8392A7",
    },
    helpText: {
        marginTop: 20,
        padding: "25px 15px 25px 15px",
        backgroundColor: "rgba(255, 205, 5, 0.381529)",
        borderRadius: 6
    },
    helpTextHeading: {
        fontSize: 16,
        lineHeight: "19px"
    },
    helpTextBody: {
        fontSize: 15,

    },
    checkLable: {
        fontSize: 18,
        fontWeight: 500,
    },
    expandDiv: {
        backgroundColor: "white",
        padding: 5,
        marginTop: 15,
        marginBottom: 5,
        borderRadius: 6,
    },
    editDeleteIcon: {
      "& img": {
        width: "16px",
        height: "16px",
      },
    },
    button: {
      float: 'right',
      borderRadius: '8px',
  },
}))

const list = [
    { id: 1, name: "Email - Forgot Password", time: "8 Hours", status: "Active" },
    { id: 2, name: "Email - Password Reset", time: "2 Hours", status: "Disabled" },
    { id: 3, name: "Email - New user created", time: "", status: "Active" },
    { id: 4, name: "SMS - OTP template", time: "", status: "Active" },
    { id: 5, name: "Push - Notification template", time: "8 Days", status: "Active" },
]
const defaultMaster = {
    id: "",
    templateSubject: "",
    //expiryTime: "",
    //expiryType: "",
    //email: true,
    //sms: true,
    type: null,
    reportingManager: true,
    templateBody: ""
}
const defaultFilters = {
    direction: "DESC",
    pageNumber: 0,
    pageSize: 10,
    keyword: "",
}
export default function NotificationTemplate() {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false);
    const [newMaster, setNewMaster] = React.useState(defaultMaster)
    const [totalUsers, setTotalUsers] = React.useState(0)
    const [filters, _setFilters] = React.useState(defaultFilters)
    const [mode, setMode] = React.useState('html')

    // const modeOptions = [
    //   'javascript',
    //   'java',
    //   'python',
    //   'xml',
    //   'ruby',
    //   'sass',
    //   'markdown',
    //   'mysql',
    //   'json',
    //   'html',
    //   'handlebars',
    //   'golang',
    //   'csharp',
    //   'elixir',
    //   'typescript',
    //   'css'
    // ]

    const modeOptions = ['html']

    const handleChange = (e) => {
      setMode(e.target.value)
    }

    const handleModalOpen = () => {
        setOpen(true);
    };
    const handleModalClose = () => {
        setOpen(false);
        setNewMaster(defaultMaster);
        getNotificationList();
    };
    const [notifications, setNotification] = React.useState([]);
    const [notificationVariables, setNotificationVariable] = React.useState([]);
    const [saving, setSaving] = React.useState(false);
    const handleChangePage = (event, newPage) => _setFilters({ ...filters, pageNumber: newPage })
    const handleChangeRowsPerPage = (event) => {
        _setFilters({ ...filters, pageNumber: 0, pageSize: parseInt(event, 10) })
    }
    React.useEffect(() => getNotificationList(), [filters])
    const getNotificationList = () => {
        callApi(`/notification/api/notification/template`, 'POST', filters)
            .then(e => {
                if (e.success) {
                    setNotification(e.data && e.data.content ? e.data.content : [])
                    setTotalUsers(e.data ? e.data.totalElements : 0)
                }
            })
    }
    const getNotificationVariables = () => {

        callApi(`/notification/api/notification/systemVariables`, 'POST', {})
            .then(e => {
                if (e.success) {
                    setNotificationVariable(e.data && e.data.content ? e.data.content : [])
                }
            })
    }
    const getNotificationData = (id) => {
        var selected = notifications.filter(ele => ele.id == id);
        if (selected.length > 0) {
            selected[0].active = selected[0].status == "ACTIVE" ? true : false;
            var text = selected[0].templateBody ? selected[0].templateBody : "";
            const sampleMarkup = text
            const contentHTML = convertFromHTML(sampleMarkup)
            const state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap)
            selected[0].templateBodyHtml = JSON.stringify(convertToRaw(state))
            setNewMaster(selected[0]);
            handleModalOpen();
        }
        // callApi(`/notification/api/notification/template/${id}`, 'GET')
        //     .then(e => {
        //         if (e.success) {
        //             setNewMaster(e.data && e.data.content ? e.data.content : defaultMaster)
        //             handleModalOpen();
        //         }
        //     })
    }
    React.useEffect(() => {
        if (defaultMaster.id) {
            handleModalOpen();
        }
    }, [defaultMaster])
    React.useEffect(() => {
        getNotificationList()
        getNotificationVariables()
    }, [])
    const updateNotificationStatus = (status) => {
        callApi(`/notification/api/notification/template/${newMaster.id}/${Boolean(status) ? "ACTIVE" : "DISABLE"}/`, 'PUT')
            .then(e => {
                if (e.success) {
                    //getNotificationList();
                    change({ active: status });
                    //change({ status: status ? "ACTIVE" : "DISABLE" })
                    showSuccess(`Notification Updated Successfully!`)
                }
            })

    }
    const onSubmit = () => {
        setSaving(true)
        callApi(`/notification/api/notification/template/${newMaster.id}`, 'PUT', {
            reportingManager: newMaster.reportingManager,
            systemNotification: newMaster.systemNotification,
            templateBody: newMaster.templateBody,
            templateSubject: newMaster.templateSubject,
            type: newMaster.type
        })
            .then(e => {
                setSaving(false)
                if (e.success) {
                    handleModalClose()
                    getNotificationList();
                    showSuccess(`Notification ${newMaster.id ? 'Updated' : 'Added'} Successfully!`)
                }
            })
            .catch(err => setSaving(false))
    }
    const isValid = newMaster.templateSubject && newMaster.type && (newMaster.templateBody && newMaster.templateBody != "<p></p>")
    const change = e => {
        setNewMaster({ ...newMaster, ...e })
    }
    const [errors, _setErrors] = React.useState({});
    const setError = e => _setErrors({ ...errors, ...e })
    const checkValue = () => setError({ value: (newMaster.value || '').length > 1 ? null : 'Value is required' });
    const modalBody = (
      <div className="settings-add-new-global-modal" id="centralModalSm1" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document" style={{overflowy: 'initial !important'}}>
          <div className="modal-content p-2">
            <div className="modal-header pb-1">
              <h4 className="modal-title w-100 pb-2" id="myModalLabel">{newMaster.name}</h4>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true"><CloseIcon style={{ cursor: 'pointer' }} onClick={handleModalClose} /></span>
              </button>
            </div>
            <div className="modal-body p-2" style={{ backgroundColor: '#E9EDF6', height: '73vh', overflowY: 'auto' }}>
              <div style={{ padding: 15 }}>
                <Collapsible trigger="System Variables" triggerStyle={{ backgroundColor: "#363795", padding: 8, color: "white" }}>
                  <div className={classes.expandDiv}>
                    {notificationVariables.map(variable => (
                      <>
                        <label><b>{"${" + variable.name + "}"}</b> : {variable.description}</label>
                        <br />
                      </>
                    ))}
                  </div>
                </Collapsible>
                <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center mb-2 mt-2">
                  <div className="col-12 col-sm-12 col-md-12 col-lg-12 pl-0">
                    <AppTextInput
                      required
                      error={!!errors.templateSubject}
                      onChange={checkValue}
                      disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                      helperText={errors.templateSubject}
                      value={newMaster.templateSubject}
                      onChange={e => change({ templateSubject: e.target.value })}
                      label="Subject"
                    />
                  </div>
                </div>
                <div className="row col-12 col-md-12 col-lg-12">
                  <div className="row col-md-10 col-lg-10">
                    <div className="makeStyles-label-80 ol-12 col-sm-12 col-md-12 col-lg-12 pl-0">Type</div>
                    <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center mb-2">
                      <div className="col-12 col-sm-12 col-md-12 col-lg-3 pl-0">
                        <AppSelectInput
                          // label="Type"
                          disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                          value={(newMaster.type) ? newMaster.type[0] : null}
                          onChange={e => change({ type: e.target.value ? [e.target.value] : null })}
                          options={["EMAIL", "SMS"]} 
                        />
                      </div>
                      {/* <div className="col-12 col-sm-12 col-md-12 col-lg-2 pl-0">
                          <AppSelectInput
                              //label="Time"
                              value={newMaster.expiryTime}
                              onChange={e => change({ expiryTime: e.target.value })}
                              options={[1, 2, 3, 4, 5]} />
                      </div>
                      <div className="col-12 col-sm-12 col-md-12 col-lg-2 pl-0">
                          <AppSelectInput
                              //label={"&nbsp;"}
                              value={newMaster.expiryType}
                              onChange={e => change({ expiryType: e.target.value })}
                              options={["Hour", "Days"]} />
                      </div> */}
                      <div className="col-12 col-sm-12 col-md-12 col-lg-10 pl-0" style={{ display: 'flex' }}>
                        {/* <div className="custom-checkbox">
                            <input type="checkbox" checked={true} name={"email"} id={"email"} /> <label htmlFor={"email"} ></label>
                        </div>
                        <label className={classes.checkLable} style={{ paddingRight: 10 }}>Email</label>
                        <div className="custom-checkbox">
                            <input type="checkbox" checked={true} name={"sms"} id={"sms"} /> <label htmlFor={"sms"} ></label>
                        </div>
                        <label className={classes.checkLable} style={{ paddingRight: 10 }}>Sms</label> */}
                        <div className="custom-checkbox">
                          <input
                            type="checkbox"
                            value={newMaster.reportingManager}
                            checked={newMaster.reportingManager}
                            name={"notification"}
                            id={"notification"}
                            disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                            onChange={(e) => {
                              change({ reportingManager: e.target.value == "true" ? false : true })
                            }} 
                          /> 
                          <label htmlFor={"notification"} ></label>
                        </div>
                        <label className={classes.checkLable}>Send notification to Reporting Manager</label>
                      </div>
                    </div>
                  </div>
                  <div className="row col-md-2 col-lg-3">
                    <div className="col-12 col-sm-12 col-md-12 col-lg-12 pl-0">
                        <AppCheckbox
                          value={newMaster.active} onChange={e => { updateNotificationStatus(e) }}
                          switchLabel={newMaster.active ? 'Active' : 'In-active'}
                          disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                          label="Status" 
                        />
                    </div>
                  </div>
                </div>
                <Grid item xs={12}>
                  <Grid container spacing={3} alignItems="center" alignContent="center">
                    <Grid item xs={12} lg={3}>Editor Mode</Grid>
                      <Grid item xs={12} lg={3}>
                        <AppSelectInput
                          value={mode}
                          onChange={handleChange}
                          disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                          options={modeOptions.map(opt => opt)}
                        />
                      </Grid>
                    </Grid>
                </Grid>
              </div>
              <AceEditor
                mode={mode}
                theme="twilight"
                // commands={Beautify.commands}
                onChange={(newValue) => change({ templateBody: newValue })}
                value={newMaster.templateBody}
                height="60%"
                width="100%"
                fontSize={14}
                wrapEnabled={true}
                enableBasicAutocompletion
                enableLiveAutocompletion
                name="UNIQUE_ID_OF_DIV"
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true
                }}
              />
            </div>
            <div className="modal-footer p-2">
              <button type="button" className="btn btn-left btn-sm mr-auto" onClick={handleModalClose}>Discard</button>
              <Button 
                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || !isValid || saving}
                onClick={onSubmit} 
                variant="contained" 
                className={classes.button}
                color="primary"
              > 
                Save 
              </Button>
              {/* <button type="button" className="btn btn-left btn-sm ml-auto" onClick={handleModalClose}>Close</button> */}
              {/* <a href="JavaScript:void(0)" className="primary-btn-view">UPDATE</a> */}
            </div>
          </div>
        </div>
      </div>
    )

    // body is replaced with modalBody.
    const body = (
        <AddNewModal
            title={newMaster.name}
            onClose={handleModalClose}
            disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']) || !isValid || saving}
            onSubmit={onSubmit}
            body={
                <form style={{ padding: 15 }}>
                    <Collapsible trigger="System Variables" triggerStyle={{ backgroundColor: "#363795", padding: 8, color: "white" }}>
                        <div className={classes.expandDiv}>
                            {notificationVariables.map(variable => (
                                <>
                                    <label><b>{"${" + variable.name + "}"}</b> : {variable.description}</label>
                                    <br />
                                </>
                            ))}
                        </div>
                    </Collapsible>
                    <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center mb-2 mt-2">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 pl-0">
                            <AppTextInput
                                required
                                error={!!errors.templateSubject}
                                onChange={checkValue}
                                disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                helperText={errors.templateSubject}
                                value={newMaster.templateSubject}
                                onChange={e => change({ templateSubject: e.target.value })}
                                label="Subject" />
                        </div>
                    </div>
                    <div className="row col-12 col-md-12 col-lg-12">
                        <div className="row col-md-10 col-lg-10">
                            <div className="makeStyles-label-80 ol-12 col-sm-12 col-md-12 col-lg-12 pl-0">Type</div>

                            <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center mb-2">
                                <div className="col-12 col-sm-12 col-md-12 col-lg-3 pl-0">
                                    <AppSelectInput
                                        // label="Type"
                                        disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                        value={(newMaster.type) ? newMaster.type[0] : null}
                                        onChange={e => change({ type: e.target.value ? [e.target.value] : null })}
                                        options={["EMAIL", "SMS"]} />
                                </div>
                                {/* <div className="col-12 col-sm-12 col-md-12 col-lg-2 pl-0">
                                    <AppSelectInput
                                        //label="Time"
                                        value={newMaster.expiryTime}
                                        onChange={e => change({ expiryTime: e.target.value })}
                                        options={[1, 2, 3, 4, 5]} />
                                </div>
                                <div className="col-12 col-sm-12 col-md-12 col-lg-2 pl-0">
                                    <AppSelectInput
                                        //label={"&nbsp;"}
                                        value={newMaster.expiryType}
                                        onChange={e => change({ expiryType: e.target.value })}
                                        options={["Hour", "Days"]} />
                                </div> */}
                                <div className="col-12 col-sm-12 col-md-12 col-lg-10 pl-0" style={{ display: 'flex' }}>
                                    {/* <div className="custom-checkbox">
                                        <input type="checkbox" checked={true} name={"email"} id={"email"} /> <label htmlFor={"email"} ></label>
                                    </div>
                                    <label className={classes.checkLable} style={{ paddingRight: 10 }}>Email</label>
                                    <div className="custom-checkbox">
                                        <input type="checkbox" checked={true} name={"sms"} id={"sms"} /> <label htmlFor={"sms"} ></label>
                                    </div>
                                    <label className={classes.checkLable} style={{ paddingRight: 10 }}>Sms</label> */}
                                    <div className="custom-checkbox">
                                        <input
                                            type="checkbox"
                                            value={newMaster.reportingManager}
                                            checked={newMaster.reportingManager}
                                            name={"notification"}
                                            id={"notification"}
                                            disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                            onChange={(e) => {
                                                change({ reportingManager: e.target.value == "true" ? false : true })
                                            }} 
                                        /> <label htmlFor={"notification"} ></label>
                                    </div>
                                    <label className={classes.checkLable}>Send notification to Reporting Manager</label>
                                </div>

                            </div>
                        </div>
                        <div className="row col-md-2 col-lg-3">
                            <div className="col-12 col-sm-12 col-md-12 col-lg-12 pl-0">
                                <AppCheckbox
                                    value={newMaster.active} onChange={e => { updateNotificationStatus(e) }}
                                    switchLabel={newMaster.active ? 'Active' : 'In-active'}
                                    disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                    label="Status" />
                            </div>
                        </div>
                    </div>
                    
                    <Grid item xs={12} className="mb-3">
                      <Grid container spacing={3} alignItems="center" alignContent="center">
                        <Grid item xs={12} lg={3}>Editor Mode</Grid>
                          <Grid item xs={12} lg={3}>
                            <AppSelectInput
                              value={mode}
                              onChange={handleChange}
                              disabled={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                              options={modeOptions.map(opt => opt)}
                            />
                          </Grid>
                        </Grid>
                    </Grid>

                    <AceEditor
                      mode={mode}
                      theme="twilight"
                      commands={Beautify.commands}
                      onChange={(newValue) => change({ templateBody: newValue })}
                      value={newMaster.templateBody}
                      height="100%"
                      width="100%"
                      fontSize={14}
                      wrapEnabled={true}
                      enableBasicAutocompletion
                      enableLiveAutocompletion
                      name="UNIQUE_ID_OF_DIV"
                      editorProps={{ $blockScrolling: true }}
                      setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true
                      }}
                    />

                    {/* <div className="modal-body">
                        <div className="makeStyles-label-80 ol-12 col-sm-12 col-md-12 col-lg-12 pl-0">Body</div>
                        <div className="ol-12 col-sm-12 col-md-12 col-lg-12 pl-0">
                            <MuiThemeProvider theme={defaultTheme}>
                                <MUIRichTextEditor
                                    readOnly={!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN'])}
                                    defaultValue={newMaster.templateBodyHtml}
                                    onChange={e => {
                                        var data = convertToRaw(e.getCurrentContent());
                                        const markup = draftToHtml(data);
                                        change({ templateBody: markup.replace(/(\r\n|\n|\r)/gm, "") })
                                    }}
                                />
                            </MuiThemeProvider>
                        </div>
                    </div> */}
                </form>
            }
        />
    )
    return (
        <div id="dash-admin" className={classes.root}>
            <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
                <Grid item xs={12} className={classes.list}>
                    <h3 className={classes.heading}>Notification Templates</h3>
                    {notifications.map(ele => (
                        <div className={classes.listItem}>
                            <div className={'row ' + classes.item}>
                                <Grid xs={6} className={classes.gridText + " " + classes.gridName}>
                                    {ele.name}
                                </Grid>
                                <Grid xs={2} className={classes.gridText + " " + classes.gridTime}>
                                    {/* {ele.time} */}
                                </Grid>
                                <Grid xs={2} className={classes.gridText}>
                                    {(ele.status == "ACTIVE")}
                                    <Box className={(ele.status == "ACTIVE") ? classes.boxActive : classes.boxInActive}>
                                        {ele.status == "ACTIVE" ? "Active" : "Inactive"}
                                    </Box>
                                </Grid>
                                <Grid xs={2} className={classes.gridIcon}>
                                <IconButton
                                    color="primary"
                                    disableRipple
                                    // aria-label="Edit Rule"
                                    component="span"
                                    // size="small"
                                    onClick={() => { getNotificationData(ele.id) }}
                                    >
                                    { isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon  style={{ color: '#ddd' }}/> : 
                                    <img src="assets/img/icons/edit.svg" alt="" title="" /> }
                                </IconButton>
                                    {/* {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN', 'READ_ONLY']) ? (
                                        <img src="assets/img/icons/edit.svg" alt="" title="" onClick={() => { getNotificationData(ele.id) }} />
                                    ) : null} */}
                                </Grid>
                                {/* <Grid xs={1} className={classes.gridIcon}>
                                    <img src="assets/img/icons/delete.svg" alt="" title="" />
                                </Grid> */}
                            </div>
                        </div>
                    ))}
                    {/* <TablePagination
                        component="div"
                        count={totalUsers}
                        page={filters.pageNumber}
                        onChangePage={handleChangePage}
                        rowsPerPage={filters.pageSize}
                        // rowsPerPageOptions={[2,4,10]}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    /> */}
                     <CustomPagination
                   count={Math.ceil(totalUsers / filters.pageSize)}
                   totalCount = {totalUsers}
                   page={filters.pageNumber}
                   onChangePage={handleChangePage}
                   rowsPerPage={filters.pageSize}
                   // rowsPerPageOptions={[2,4,10]}
                   onChangeRowsPerPage={handleChangeRowsPerPage}
              />

                </Grid>
                {/* <Grid xs={4} className={"pl-3"}>
                    <div className={classes.helpText}>
                        <label className={classes.helpTextHeading}><img src="assets/img/icons/info.svg" alt="" title="" />&nbsp;&nbsp;Help Text</label>
                        <label className={classes.helpTextBody}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </label>
                    </div>
                </Grid> */}
            </Grid>

            <Modal open={open} onClose={handleModalClose}>
                {/* {body} */}
                {modalBody}
            </Modal>
        </div >
    )

}

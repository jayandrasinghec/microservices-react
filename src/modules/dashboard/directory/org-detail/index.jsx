import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link as Linking, NavLink } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import AddIcon from '@material-ui/icons/Add'
import Button from '@material-ui/core/Button'
import '../../../../FrontendDesigns/master-screen-settings/assets/css/org-detail.css'
import { isActiveForRoles } from '../../../../utils/auth'
import SearchField from '../../../../components/AppSearchField'
import OrgListCard from '../../../../components/OrgListCard'
import { callApi } from '../../../../utils/api'
import EmptyScreen from '../../../../components/EmptyScreen'
import { TablePagination } from '@material-ui/core'
import DropDown from '../../../../components/DropDownComponent'
import MenuItem from '@material-ui/core/MenuItem'
import Modal from '@material-ui/core/Modal';
import AddNewModal from '../../../../components/AddNewComponent'
import AppCheckbox from '../../../../components/form/AppCheckbox'
import AppTextInput from '../../../../components/form/AppTextInput'
import AppSelectInput from '../../../../components/form/AppSelectInput'
import Org from './list';
import Type from './types';
const drop = [
    { type: 'ASC' }, { type: 'DESC' }
]

const parent = [
    { parent: 'No Parent' }
]

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
    },
    Nav: {
        display: 'flex',
        paddingBottom: '10px !important'
        // marginTop: '12px'
    },
    link: {
        marginTop: '12px',
        marginRight: '25px',
        marginLeft: '10px',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '18px',
        color: '#1F4287',
        textDecorationLine: 'none',
        '&:hover': {
            fontWeight: 'bold',
            color: '#363795'
        }
    },
    bellicon: {
        marginTop: '0px',
        width: '19px',
        height: '24px'
    },
    small: {
        width: '25px',
        height: '26px',
        // marginTop: '5px',
        marginLeft: '10px'
    },
    search: {
        // marginLeft: '10px',
    },
    name: {
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '14px',
        color: '#171717',
        // marginTop: '9px',
    },
    bulk: {

        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        color: '#FFFFFF',
    },
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflow: 'hidden'
    },
    gridcontainer: {
        margin: 0,
        width: '100%'
    },
    griditemone: {
        paddingTop: 0
    },
    griditemtwo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingTop: 0
    },
    button: {
        marginLeft: 15
    },
    divlist: {
        flex: 1,
        overflow: 'auto'
    },
    paper: {
        position: 'fixed',
        width: 500,
        backgroundColor: 'white',
        borderRadius: '20px',
        textAlign: 'center',
        alignItems: 'center',
        display: 'block'
    },
}))


const defaultFilters = {
    direction: "DESC",
    pageNumber: 0,
    pageSize: 10,
    keyword: "",
    sort: "GROUP_NAME"
}
function getModalStyle() {
    const top = 28;
    const left = 35;

    return {
        top: `${top}%`,
        left: `${left}%`,
    };
}
const defaultMaster = {
    type: "UserType",
    name: "",
    value: "",
    status: false
}
export default function UserLayout(props) {
    const classes = useStyles()
    const [filters, _setFilters] = React.useState(defaultFilters)
    const [groups, setGroups] = React.useState([])
    const [totalUsers, setTotalUsers] = React.useState(0)
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [innerTab, setInnerTab] = React.useState("1");
    const downloadOrg = () => {
        var data = [
            {
                "id": 1, "name": "Marketing manager", "description": "marketing manager mumbai", "numberOfUsers": 27, "listOfUsers": [], "numberOfOu": 0, "numberOfApps": 10
            },
            {
                "id": 2, "name": "Intern", "description": "Fresher and intern", "numberOfUsers": 35, "listOfUsers": [], "numberOfOu": 0, "numberOfApps": 2
            }
        ]
        setGroups(data);
        setTotalUsers(2);
        // callApi(`/usersrvc/api/group/list`, 'POST', filters)
        //   .then(e => {
        //     if (e.success) {
        //       setGroups(e.data && e.data.elements ? e.data.elements : [])
        //       setTotalUsers(e.data ? e.data.totalElements : 0)
        //     }
        //   })
    }
    React.useEffect(() => downloadOrg(), [filters])

    const setSearchQuery = e => { _setFilters({ ...filters, keyword: e }); setTimeout(downloadOrg, 100) }
    const change = e => _setFilters({ ...filters, ...e })
    const handleChangePage = (event, newPage) => _setFilters({ ...filters, pageNumber: newPage })
    const handleChangeRowsPerPage = (event) => {
        _setFilters({ ...filters, pageNumber: 0, pageSize: parseInt(event.target.value, 10) })
    }
    const handleModalOpen = (e) => {
        e.preventDefault()
        setOpen(true);
    };
    const handleModalClose = () => {
        setOpen(false);
        setNewMaster(defaultMaster);
    };
    const [newMaster, setNewMaster] = React.useState(defaultMaster)
    const [errors, _setErrors] = React.useState({})
    const changeModel = e => setNewMaster({ ...newMaster, ...e })
    const checkName = () => setError({ name: (newMaster.name || '').length > 1 ? null : 'Name is required' })
    const checkValue = () => setError({ value: (newMaster.value || '').length > 1 ? null : 'Value is required' })
    const setError = e => _setErrors({ ...errors, ...e })
    const clickInnerTab = e => { setInnerTab(e) }
    const body = (
        <AddNewModal
            title="Add New Organisation Unit"
            onClose={handleModalClose}
            // disabled={!isValid || saving}
            // onSubmit={onSubmit}
            body={
                <form>
                    <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center mb-3">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
                            <AppTextInput
                                required
                                error={!!errors.name}
                                onBlur={checkName}
                                helperText={errors.name}
                                value={newMaster.name}
                                onChange={e => changeModel({ name: e.target.value })}
                                label="Organisation Name" />
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto">
                            <AppSelectInput
                                label="Parent"
                                placeholder="No Parent"
                                value={newMaster.parent}
                                onChange={e => changeModel({ type: e.target.value })}
                                options={parent.map(o => o.parent)} />
                        </div>
                    </div>
                    <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 pl-0">
                            <AppSelectInput
                                label="Type"
                                placeholder="Select Type"
                                value={newMaster.type}
                                onChange={e => changeModel({ type: e.target.value })}
                                options={drop.map(o => o.type)} />
                        </div>
                        <div className="col-12 col-sm-12 col-md-12 col-lg-6 ml-auto">
                        </div>
                    </div>
                    <div className="settings-forms d-flex flex-sm-column flex-column flex-lg-row flex-md-column align-items-center">
                        <div className="col-12 col-sm-12 col-md-12 col-lg-12 pl-0">
                            <AppTextInput
                                required
                                multiline={true}
                                error={!!errors.name}
                                onBlur={checkName}
                                helperText={errors.name}
                                value={newMaster.name}
                                onChange={e => changeModel({ name: e.target.value })}
                                label="Description" />
                        </div>

                    </div>
                </form>
            }
        />
    );

    return (
        <div className={classes.container}>
            <Grid container spacing={3} className={classes.gridcontainer}>
                <Grid item md={6} xs={12} className={classes.griditemone}>
                    <SearchField
                        onBlur={downloadOrg}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search by organisation name" />
                </Grid>
                <Grid item md={6} xs={12} className={classes.griditemtwo}>
                    {/* <DropDown title="Sort" options={drop} body={
                        drop.map(o => {
                            return (
                                <MenuItem key={o.type} value={filters.sortDirection} onClick={() => change({ direction: o.type })} >
                                    <div className={classes.displayflex}>
                                        <span className={classes.span}>{o.type}</span>
                                    </div>
                                </MenuItem>
                            )
                        })
                    } /> */}
                    {isActiveForRoles(['ORG_ADMIN', 'DOMAIN_ADMIN']) && (
                        // <Linking to="/dash/directory/add/org">
                        <Button onClick={handleModalOpen} variant="contained" color="primary" className={classes.button} startIcon={<AddIcon />} ><span className={classes.bulk}>New OU</span></Button>
                        //  </Linking>
                    )}
                </Grid>
            </Grid>
            <div className="cym-org-list-row mt-4 mr-3" key={1}>
                <Grid container spacing={3} className={classes.root}>
                    <Grid item xs={6} className={classes.Nav}>
                        <div className="cym-tab-view mb-3 mb-sm-3 mb-md-0">
                            <ul className="nav nav-tabs" role="tablist">
                                <li key={"1"} className="nav-item" role="presentation" style={{ height: "50px" }}>
                                    <a onClick={() => { clickInnerTab("1") }} className={(innerTab == "1") ? "nav-link active" : "nav-link"}>
                                        {"Organisation"}
                                    </a>
                                </li>
                                <li key={"2"} className="nav-item" role="presentation">
                                    <a onClick={() => { clickInnerTab("2") }} className={(innerTab == "2") ? "nav-link active" : "nav-link"} >
                                        {"Types"}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </Grid>
                </Grid>
                {(innerTab == "1") ? <Org /> : <Type />}
            </div>
            <Modal open={open} onClose={handleModalClose}>
                {body}
            </Modal>
        </div>
    )
}
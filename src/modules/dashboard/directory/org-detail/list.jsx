import React, { useState } from 'react'
import { Switch, Route, Redirect } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search'
import EmptyScreen from '../../../../components/EmptyScreen'
import AppCheckbox from '../../../../components/form/AppCheckbox'
// import Delete from '../../'// /../FrontendDesigns/master-screen-settings/assets/img/icons/Delete.svg';
import LetterAvatar from '../../../../components/LetterAvatar';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/Remove';
import ChevronRightIcon from '@material-ui/icons/Add';
import TreeItem from '@material-ui/lab/TreeItem';
const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: 15,
    },
    letteravatar: {
        height: 50,
        width: 50
    },
    searchicon: {
        color: '#363793',
        fontSize: "30px"
    },
}))
const list = [
    { id: 1, name: "Unotech New", parent: null, active: false },
    { id: 2, name: "Unotech New", parent: null, active: false },
    { id: 3, name: "Unotech New", parent: null, active: false },
    { id: 4, name: "Unotech New", parent: "1", active: false },
    { id: 5, name: "Unotech New", parent: "1", active: false },
    { id: 6, name: "Unotech New", parent: "4", active: false },
    { id: 7, name: "Unotech New", parent: "2", active: false },
]
const data = [{
    id: 'root',
    name: 'Unotech New',
    children: [
        {
            id: '1',
            name: 'Unotech New',
        },
        {
            id: '3',
            name: 'Unotech New',
            children: [
                {
                    id: '4',
                    name: 'Customer Services',
                },
            ],
        },
    ],
}, {
    id: 'root2',
    name: 'Unotech New',
}, {
    id: 'root3',
    name: 'Unotech New',
},
{
    id: 'root4',
    name: 'Unotech New',
}
];
const list2 = [
    { id: 1, name: "Azar Hosseini", description: "Sr. Product Manager", photo: "" },
    { id: 2, name: "Lew Silverton", description: "Sr. Product Manager", photo: "" },
    { id: 3, name: "Filipa Gaspar", description: "Sr. Product Manager", photo: "" },
    { id: 4, name: "Monica Böttger", description: "Sr. Product Manager", photo: "" },
    { id: 5, name: "Gabriel Moreira", description: "Sr. Product Manager", photo: "" },
    { id: 6, name: "Sakane Miiko", description: "Sr. Product Manager", photo: "" },
    { id: 7, name: "Pan Hyuk", description: "Sr. Product Manager", photo: "" },
    { id: 8, name: "Igor Antonovich", description: "Sr. Product Manager", photo: "" },
    { id: 9, name: "Tô Anh Ðức", description: "Sr. Product Manager", photo: "" }
]

export default function Org(props) {
    const classes = useStyles()
    const [newList, manageList] = React.useState(list);
    const onOrgClick = (id) => {
        var arr = newList;
        arr.map(ele => {
            if (ele.id == id) {
                ele.active = (ele.active) ? false : true
                // manageList([...newList,ele]);
            }
        });
        manageList([...arr]);
    }

    const appendData = (id) => {
        var arr = [];
        arr = newList.filter(ele => ele.parent_id == id);
        var ele = appendEle(arr);
        var referenceNode = document.querySelector('#' + id + '');
        referenceNode.append('<p>ttt</p>');
    }
    const remoeveEle = (id) => {

    }

    const appendEle = (list) => list.map(ele => (
        <>
            <div key={ele.id} id={ele.id} className="col-12 col-sm-12 col-md-12 col-lg-12 mb-2 mb-sm-2  mb-md-2 mb-lg-2 ">
                <div className="org-col" style={{ backgroundColor: (ele.active) ? "#ffffff" : "#f2f4fa" }}>
                    <div className="d-flex flex-column flex-sm-row flex-md-row justify-content-between align-items-center">
                        <div className="org-detail-view d-flex flex-column flex-sm-column flex-md-row align-items-center">
                            <div className="pl-2">
                                <h3>{ele.name}</h3>
                            </div>
                        </div>
                        <div onClick={() => { onOrgClick(ele.id) }} className="actions-view">
                            {/* <a href="javascript:void(0)"><img src={Edit} alt="" title="" /></a> */}
                            <a onClick={() => { }} >
                                <img className="" src={(ele.active == false) ? "assets/img/icons/plus.png" : "assets/img/icons/minus.png"} alt="Add" title="" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    ))
    const renderTree = (nodes) => (
        <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
        </TreeItem>
    );
    return (
        <div className="row" className={classes.container}>
            <div className="row col-12 col-sm-12 col-md-12 col-lg-12 pl-0">
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 pl-0">
                    {data.map(item => (
                        <TreeView
                            className={classes.root}
                            defaultCollapseIcon={<ExpandMoreIcon style={{fontSize:30}}/>}
                            // <img className="tree-icon" src={"assets/img/icons/plus.png"} alt="Add" title="" />
                            defaultExpanded={[]}
                            defaultExpandIcon={<ChevronRightIcon style={{fontSize:30}} />}
                            //<img className="tree-icon" src={"assets/img/icons/minus.png"} alt="Add" title="" />
                        >
                            {renderTree(item)}
                        </TreeView>

                    ))}

                    {/* {newList.map(ele => ele.parent == null ? (
                        <div key={ele.id} id={ele.id} className="col-12 col-sm-12 col-md-12 col-lg-12 mb-2 mb-sm-2  mb-md-2 mb-lg-2 ">
                            <div className="org-col" style={{ backgroundColor: (ele.active) ? "#ffffff" : "#f2f4fa" }}>
                                <div className="d-flex flex-column flex-sm-row flex-md-row justify-content-between align-items-center">
                                    <div className="org-detail-view d-flex flex-column flex-sm-column flex-md-row align-items-center">
                                        <div className="pl-2">
                                            <h3>{ele.name}</h3>
                                        </div>
                                    </div>
                                    <div onClick={() => { onOrgClick(ele.id) }} className="actions-view">
                                        <a href="javascript:void(0)"><img src={Edit} alt="" title="" /></a> 
                                        <a onClick={() => { }} >
                                            <img className="" src={(ele.active == false) ? "assets/img/icons/plus.png" : "assets/img/icons/minus.png"} alt="Add" title="" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null
                    )} */}
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 pl-0">
                    <div className="cym-user-list-row " key={"1"}>
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: 4 }}>
                                <h3 className="user-row-heading mb-3">{"Customer Services"}</h3>
                            </div>
                            <div style={{ flex: 1, textAlign: 'right' }}>
                                <SearchIcon className={classes.searchicon} />
                            </div>
                        </div>
                        <div className="row">
                            {list2.map(u => (
                                <div key={u.id} className="col-12 col-sm-12 col-md-12 col-lg-12 mb-1 mb-sm-1  mb-md-1 mb-lg-1">
                                    <div className="user-col">
                                        <div className="d-flex flex-column flex-sm-row flex-md-row justify-content-between align-items-center">
                                            <div className="user-detail-view d-flex flex-column flex-sm-column flex-md-row align-items-center">
                                                <div className="check-view">
                                                    <div className="custom-checkbox">
                                                        <input type="checkbox" name={u.id + 'c'} id={u.id + 'c'} /> <label htmlFor={u.id + 'c'} />
                                                    </div>
                                                </div>
                                                <div className="img-view">
                                                    <LetterAvatar className={classes.letteravatar} text={u.name} status={"ACTIVE"} />
                                                    {/* <img src={Admin} alt="" title="" /> */}
                                                    <span className="status avail"></span>
                                                </div>
                                                <div className="pl-3">
                                                    <h3>{u.name}</h3>
                                                    <span>{u.designation || 'no designation'}</span>
                                                </div>
                                            </div>
                                            <div className="actions-view">
                                                <div className="user-menu-view dropdown">
                                                    <div className="d-flex flex-row dropdown-toggle" data-toggle="dropdown" onClick={() => { }}>
                                                        <span />
                                                        <span />
                                                        <span />
                                                        <Menu
                                                            id="simple-menu"
                                                            // anchorEl={anchorEl}
                                                            keepMounted
                                                            // open={anchorEl}
                                                            // onClose={handleClose}
                                                            className="nav nav-tabs" role="tablist">
                                                            <MenuItem onClick={() => { }}>
                                                                <div className={classes.flexdiv}>
                                                                    <span className={classes.settings}>Action</span>
                                                                </div>
                                                            </MenuItem>
                                                        </Menu>
                                                    </div>
                                                </div>
                                                {/* <a href="javascript:void(0)">
                                                    <img src="assets/img/icons/edit.svg" alt="" title="" />
                                                </a> */}
                                                {/* <a onClick={() => deleteAdmin(u, d.role)} ><img src={Delete} alt="" title="" /></a> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* <EmptyScreen/> */}
        </div>
    )
}
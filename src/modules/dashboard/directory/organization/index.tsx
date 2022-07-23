import React, { useState, useEffect } from 'react';
import Divider from '@material-ui/core/Divider';
import DNDTreeView from './components/DNDTreeView';
import './styles.css'
import Grid from '@material-ui/core/Grid';
import { connect } from "react-redux";
import { GetOrganizationUnitAction, GetFilterOrganizationUnitAction } from "./redux/actions/organizationUnitActions";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "../../../../redux/reducers";
import RightPanelView from './components/RightPanelView';
import { getContent } from './utils';
import SideBarView from './components/SideBarView';
import SearchIcon from "@material-ui/icons/Search";
import DehazeIcon from '@material-ui/icons/Dehaze';
//const data = require('./__mocks/organization.json')
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import SearchIconCustom from './components/DNDTreeView/icons/SearchIconCustom';
const clickEvent = (event: any) => {

};

const searchEvent = (event: any) => {

};

interface Props {
  route: any;
  loading: any;
  orgUnits: any;
  content: any;
  selectedNode: any;
}

const Drawer: React.FC<Props> = (Props) => {

  const dispatch = useDispatch();
  /* const org_Units = useSelector(
    (store: IReduxState) => store.organizationUnitReducer.orgUnits || []
  ); */

  /*  const filterOrgUnits = useSelector(
     (store: IReduxState) => store.organizationUnitReducer.filterOrgUnits || []
   ); */
  const loading = useSelector(
    (store: IReduxState) => store.organizationUnitReducer.loading
  );
  const [orgUnits, setorgUnits] = useState(Props.orgUnits)
  const [selectedNode, setSelectedNode] = useState(Props.orgUnits)
  const [rightDraggedItem, setrightDraggedItem] = useState(null);

  useEffect(() => {
    dispatch(GetOrganizationUnitAction());
  }, []);

  useEffect(() => {
    setorgUnits(Props.orgUnits);
    setSelectedNode(Props.orgUnits);
    // console.log('set Org units ',Props.orgUnits);
  }, [Props.orgUnits]);

  const clickEvent = (event: any) => {
    let obj = getContent(orgUnits, event)
    if (obj && obj.children) {
      setSelectedNode(obj);
    }
    else {
      setSelectedNode({})
    }
  };

  const menuEvent = (event: any) => {
    console.log(event, 'menuEvent')
  }


  const searchEvent = (event: any) => {
    dispatch(GetFilterOrganizationUnitAction(orgUnits, event));
  };

  const rightpanelDraghandler = (event: any) => {
    // console.log('rightpanelDraghandler ', event);
    setrightDraggedItem(event);
  }

  return (
    <div className="wrapper">
     <div className="row">
         <div className="col-3 container_1">
             <div className="search-con">
               <div className="search-con-inner">
                  <DehazeIcon/>
                  <div className="search_label">Org Unit</div>
               </div>
               <SearchIconCustom />
              </div>
         </div>
         <div className="col-6 align-self-center">
           <span className="heading">Users</span>
         </div>
         <div className="col-3 align-self-center">
           <div className="row justify-content-end">
            <span style={{marginRight:"15px"}}><SearchIconCustom/></span> 
           <Divider orientation="vertical" flexItem style={{backgroundColor:"#173F74",marginRight:"15px"}}/>
            <div className="sort_btn">
            <div className="text-center">
            <span className="left">A<ArrowRightAltIcon/>Z</span>
            <span className="right">Groups</span>
            </div>
            </div>
            
           </div>
         </div>
     </div>
     <div className="row">

      <div className="col-3 container_1">
        <DNDTreeView
          data={orgUnits}
          // orgData={orgUnits}
          clickEvent={(event: any) => clickEvent(event)}
          searchEvent={(event: any) => searchEvent(event)}
          rightDraggedItem={rightDraggedItem}
        />
      </div>




      {/* <Divider className="mr-3 ml-0 mt-5" orientation="vertical" style={{ height: '100vh' }} /> */}


      <div className="col-6 container_2">
        <RightPanelView
          selectedNode={selectedNode}
          data={orgUnits}
          searchEvent={(event: any) => searchEvent(event)}
          dragStartHandler={(event: any) => { rightpanelDraghandler(event) }}
          rightDraggedItem={rightDraggedItem}
          sClickEvent={(event: any) => menuEvent(event)}
        />
      </div>
      {/* <Divider className="mr-2 ml-0 mt-5" orientation="vertical" style={{ height: '100vh' }} /> */}
      <div className=" col-3 container_3">
        <SideBarView />
      </div>

    </div>
    </div>
  );
}
//export default Drawer;

const mapStateToProps = (state: any, ownProps: any) => {
  const data = state.organizationUnitReducer.orgUnits;

  return {
    orgUnits: data
  };
}

export default connect(mapStateToProps)(Drawer);

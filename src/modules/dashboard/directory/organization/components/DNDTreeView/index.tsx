import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import './styles.css';
import TreeItem from '@material-ui/lab/TreeItem';
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import AddIcon from "@material-ui/icons/Add";
import Input from '@material-ui/core/Input';
import { AppBar, Avatar, Button, InputAdornment, Tab, Tabs, TextField } from '@material-ui/core';
import SearchIcon from "@material-ui/icons/Search";
import { createStyles, SvgIconProps, Theme, Typography } from "@material-ui/core";
import { moveNode, deleteNode, search, getContent } from '../../utils';
import Immutable from "immutable";
import { setOrganizationUnitAction } from '../../redux/actions/organizationUnitActions';
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import TreeviewIcon from "./icons/TreeviewIcon";
import NetworkIcon from "./icons/NetworkIcon";
import Addicon2 from "./icons/Addicon2";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import RemoveOutlinedIcon from '@material-ui/icons/RemoveOutlined';
let _ = require('lodash');
interface RenderTree {
  id: string;
  name: string;
  children?: RenderTree[];
}
interface Props {
  clickEvent?: any;
  data: any;
  searchEvent: any;
  rightDraggedItem?: any;
}

const DNDTreeView: React.FC<Props> = (Props) => {

  const dispatch = useDispatch();
  const classes = useTreeItemStyles();
  const labelStyle = classes.label;
  const iconContainerStyle = classes.iconContainer;
  const [expanded, setExpanded] = useState<string[]>([Props.data.id]);
  const [data, setData] = useState<any>(Props.data);
  const [select, setSelect] = useState('unotech.com')

  useEffect(() => {
    setData(Props.data)
  }, [Props.data]);

  useEffect(() => {
    draggedTreeNode = { node: Props.rightDraggedItem };
  }, [Props.rightDraggedItem]);

  const { clickEvent, searchEvent } = Props

  const handleEvent = (event: any, value: any) => {
    clickEvent(value)
    setSelect(value)
  };


  const handleSearchEvent = (value: any) => {
    const dataCopy = _.cloneDeep(Props.data);
    const newData = search(dataCopy.children, value);
    dataCopy.children = [...newData];
    setData(dataCopy);
  };

  let draggedTreeNode: any | null;
  const handleDragLeave = (ev: React.DragEvent<HTMLElement>) => {
    ev.currentTarget.classList.remove(classes.dragOver);
  };
  const handleDrop = (ev: React.DragEvent<HTMLLIElement>, destinationNode: any) => {
    //ev.preventDefault();
    ev.stopPropagation();
    //if (!draggedTreeNode || !draggedTreeNode.parentNode){return;} 
    const newData = Immutable.fromJS(Props.data).toJS();
    let obj = getContent(Props.data, draggedTreeNode.node);
    //console.log('obj ',obj);
    if (obj && Object.keys(obj).length !== 0) {
      moveNode(newData, draggedTreeNode.node, destinationNode.id);
      deleteNode(newData, draggedTreeNode.node.id, draggedTreeNode.parentNode.id);
    } else {
      moveNode(newData, draggedTreeNode.node, destinationNode.id);
    }
    dispatch(setOrganizationUnitAction(newData));
    ev.currentTarget.classList.remove(classes.dragOver);
  };
  const handleDragStart = (
    ev: React.DragEvent<HTMLLIElement>,
    parentNode: any | null,
    node: any,
    depth: number
  ) => {
    ev.stopPropagation();
    draggedTreeNode = { parentNode, node, depth } as any;
  };
  const handleDragOver = (
    ev: React.DragEvent<HTMLLIElement>,
    destinationNode: any,
    depth: number
  ) => {
    ev.preventDefault();
    ev.stopPropagation();

    let allowToDrag = true;
    if (!draggedTreeNode) return;

    if (
      draggedTreeNode.parentNode?.id === destinationNode.id ||
      draggedTreeNode.node.id === destinationNode.id ||
      (draggedTreeNode.node.children &&
        draggedTreeNode.node.children.length > 0 &&
        draggedTreeNode.depth < depth)
    )
      return;
    if (allowToDrag) {
      ev.preventDefault();
      ev.currentTarget.classList.add(classes.dragOver);
    }
  };
  const handleOrderChange = (
    ev: React.DragEvent<HTMLDivElement>,
    isBeforeDestinationNode: boolean
  ) => {
    ev.stopPropagation();
    ev.preventDefault();

    // if (props.onNodeReOrder) props.onNodeReOrder(ev, isBeforeDestinationNode);

    ev.currentTarget.style.height = "3px";
    ev.currentTarget.style.borderWidth = "0px";
  };

  const handleDragOver_child = (
    ev: React.DragEvent<HTMLDivElement>,
    isBeforeDestinationNode: boolean
  ) => {
    ev.stopPropagation();

    //if (!props.validateDragOver(isBeforeDestinationNode)) return;

    ev.preventDefault();
    ev.currentTarget.style.height = "30px";
    ev.currentTarget.style.borderWidth = "3px";
  };

  const renderLabel = (node: any, depth: any) => {
    let isExpanded: boolean = expanded.some((x) => x === node.id)
    let labelRootStyle =
      node.children
        ? classes.labelRootParent
        : classes.labelRootChild;
    labelRootStyle += ` ${node.disabled ? classes.disabled : ""}`;

    return (
      <>
        <div className={labelRootStyle} draggable={false}>
          {(node.icon) && (
            <div className={classes.labelIcon}>
              <img alt="image" />
            </div>
          )}
          <div className={classes.labelText}>
            {node.name}
          </div>
        </div>
        {isExpanded && (
          <div
            onDrop={(ev) => handleOrderChange(ev, false)}
            onDragOver={(ev: any) => handleDragOver(ev, false, depth)}
            onDragLeave={(ev) => handleDragLeave(ev)}
            draggable={false}
            style={{
              height: "3px",
              border: "dashed 0px white",
              backgroundColor: "transparent !important",
            }}
          />
        )}
      </>
    );
  };




  const renderTree = (parentNode: any | null, node: any, depth: number) => {
    return (
      <TreeItem
        nodeId={node.id}
        draggable={parentNode !== null}
        onDrop={(ev) => handleDrop(ev, node)}
        onDragLeave={(ev) => { handleDragLeave(ev) }}
        onDragStart={(ev) => parentNode && handleDragStart(ev, parentNode, node, depth)}
        onDragOver={(ev: React.DragEvent<HTMLLIElement>) => handleDragOver(ev, node, depth)}
        classes={{
          root: classes.root,
          content: classes.content,
          label: labelStyle,
          iconContainer: iconContainerStyle,
          group: (node.children && node.children.filter((item :any)=> item.children ).length)? classes.group:classes.group_border,
          expanded: classes.expanded,
          selected:classes.selected,
        }}
        label={renderLabel(node, depth)}
        key={`${node.id}_treeItem`}
      >
        {node.children
          ? node.children
            .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
            .map((childNode: any) => renderTree(node, childNode, depth + 1))
          : null}
      </TreeItem>
    );
  };

  return (

    <div className="container_tree">
      <div>
        <Tabs className="tab" value={0} style={{height:"40px",minHeight:"40px"}}TabIndicatorProps={{ style: { background: '#173F74' } }} aria-label="simple tabs example">
          <Tab label={<div className="d-flex"><TreeviewIcon /> <span className="px-2">Tree view</span></div>} />
          <Tab icon={<NetworkIcon />} />
        </Tabs>
      </div>

      <div className="default-label">{select}</div>
      <div className="treeview-con">
        <TreeView
          className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon style={{ fill: "rgba(54, 55, 149, 0.5)" }} />}
          defaultExpanded={['root']}
          defaultEndIcon={<RemoveOutlinedIcon style={{ fill: "rgba(23, 63, 116, 0.5)" }}/>}
          defaultExpandIcon={<ChevronRightIcon style={{ fill: "rgba(54, 55, 149, 0.5)" }} />}
          onNodeSelect={(event: any, value: any) => handleEvent(event, value)}
        >

          <div className='pt-2'>
            {renderTree(null, data, 0)}
          </div>


        </TreeView>
        <div className="button">
          <Avatar style={{ backgroundColor: "#fff" ,height:"40px",width:"40px"}}>
            <Addicon2/>
          </Avatar>
        </div>
      </div>
    </div>

    /*  <TreeView
         className={classes.root}
         defaultCollapseIcon={<ExpandMoreIcon style={{ fill: "var( --theme-font-1) !important" }} />}
         defaultExpanded={['root']}
         defaultExpandIcon={<ChevronRightIcon style={{ fill: "var( --theme-font-1) !important" }} />}
         onNodeSelect={(event: any, value: any) => handleEvent(event, value)}
     >
         <TextField id='outlined-basic' 
         placeholder='search' 
         size='small' 
         variant='outlined'
         onChange={(event: any) => handleSearchEvent(event.target.value)}
         InputProps={{
             startAdornment: (
               <InputAdornment position="start">
                 <SearchIcon />
               </InputAdornment>
             ),
           }}
         
         />

         <div className='pt-2'>
           {renderTree(null, data, 0)}
         </div>


     </TreeView> */

  );
}
export default DNDTreeView;

const useTreeItemStyles = makeStyles((theme: Theme) =>
  createStyles({

    root: {
      color: theme.palette.text.secondary,
      "&:focus > $content": {
        color: "var(--tree-view-color)",
      },
      // "&:focus > $content $label, &:hover > $content $label, &$selected > $content $label": {
      //   backgroundColor: "transparent",
      // },
      '&:focus > $content, &$selected > $content': {
        backgroundColor: `#CCE4FF!important`,
        color: 'var(--tree-view-color)',
      },
      marginBottom: "5px",
      marginTop: "5px",
    },
    disabled: {
      opacity: "0.5",
    },
    group: {
      marginLeft: "23px",
    },
    group_border: {
      marginLeft: "23px",
      borderLeft:"1px solid rgba(23, 63, 116, 0.5)"
    },

    expanded: {
    },
    content: {
      color: theme.palette.text.secondary,
      paddingRight: theme.spacing(1),
      fontWeight: theme.typography.fontWeightMedium,

      "$expanded > &": {
        fontWeight: theme.typography.fontWeightRegular,
        paddingBottom: "10px",
        
      },
      alignItems: "baseline",
      marginBottom: "10px",
      
    },
    label: {
      fontFamily:"'Poppins', sans-serif !important",
      fontSize:"14px !important ",
      fontWeight: 400,
      
      paddingLeft: "0px !important",
      // bottom: "5px",
    },
    labelWithIcon: {
      fontWeight: "inherit",
      color: "inherit",
      paddingLeft: "0px !important",
      // top: "3px",
    },
    labelRootParent: {
      display: "flex",
      alignItems: "center",
      padding: "0 0 0px 0",
      marginLeft: "3px",
    },
    labelRootChild: {
      display: "flex",
      alignItems: "center",
      padding: "0 0 0px 0",
    },
    labelIcon: {
      marginRight: "5px",
    },
    labelText: {
      fontWeight: "inherit",
      flexGrow: 1,
      color: "#173F74 !important",
    },
    iconContainer: {
      width: "15px",
      marginLeft: "-3px",
     
    },
    hiddenIconContainer: {
      display: "none",
    },
    dragOver: {
      backgroundColor: "#bdbdbd",
      borderBottomRightRadius: "16px",
      borderTopRightRadius: "16px",
      transition: "opacity 200ms",
    },
    selected:{
    }
  })
);

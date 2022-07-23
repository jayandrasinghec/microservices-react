import {
  Button,
  createStyles,
  makeStyles,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { deleteOrganizationUnitAction, setOrganizationUnitAction } from "../../redux/actions/organizationUnitActions";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import Immutable from "immutable";
import AddIcon from "@material-ui/icons/Add";
import "./styles.css";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  Avatar,
  Badge,
  Checkbox,
  IconButton,
  Theme,
  Typography,
} from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { deleteRow, addNode, moveNode, deleteNode, getContent } from "../../utils";
import ContextMenu from "./context-menu";
import MenuPopUp from "./pop-up/menu-popup";
import AddOu from "./pop-up/AddOu";
import AddUsers from "./pop-up/AddUsers";
import AddGroups from "./pop-up/AddGroups";
// import AddBoxIcon from '@material-ui/icons/AddBox';
interface Props {
  selectedNode: any;
  data: any;
  content: any[];
  dragStartHandler: any;
  searchEvent: any;
  rightDraggedItem: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    table: {
      /*minWidth: 650,*/
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  })
);
function createData(id: string, name: string, avatar: any) {
  return { id, name, avatar };
}

const options = {
  user: [
    "Add to group",
    "Move",
    "Delete",
    "Rename",
    "Info",
    "Reset Password",
    "Disable Account",
  ],
  group: ["Add Users", "Move", "Rename", "Delete", "Info"],
  org: [
    "Context Menu Options",
    "Delegation Control",
    "Move",
    "Rename",
    "Info",
    "Delete",
  ],
};

//

export default function RightPanelView(Props: any) {
  const dispatch = useDispatch();
  // const [searchEvent,rightDraggedItem,sClickEvent]=Props
  //const content: any[] = Props.content;

  const searchEvent = Props.searchEvent
  const rightDraggedItem = Props.rightDraggedItem

  const selectedNodeChildren: any[] = Props.selectedNode.children;
  const buttonName: any = Props.selectedNode.children;
  const classes = useStyles();
  const [trigger, setTrigger] = useState(false);
  const [data, setData] = useState<any>(Props.data);
  const [isOpen, setIsOpen] = useState(false);
  const [tittle, setTittle] = useState('');
  const [ouOpen, setOuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [rowSelectedId, setRowSelectedId] = useState<any>('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    setData(Props.data);
  }, [Props.data]);

  const handleDragStart = (ev: React.DragEvent<HTMLLIElement>, node: any) => {
    // ev.dataTransfer.setData("name", v);
    Props.dragStartHandler(node);
  };
  const handleDelete = (id: any) => {
    const newData = Immutable.fromJS(Props.data).toJS();
    deleteRow(newData.children, id);
    dispatch(deleteOrganizationUnitAction(newData));
  };

  // const handleAdd = (id: any) => {
  //   const newData = Immutable.fromJS(Props.data).toJS();
  //   addNode(newData, {"id": "ou-user-3","name": "OU User 3","avatar": "OU3"}, 'child-3');
  //   dispatch(deleteOrganizationUnitAction(newData));
  // };

  const clickEvent = (value: any) => {
    const newData = Immutable.fromJS(Props.data).toJS();
    value.id = `${Props.selectedNode.children.length + 1}`;
    //value.type = Props.selectedNode.type == 'user' ? Props.selectedNode.type : 'org'
    if (value.type == 'org' || Props.selectedNode.type == 'root') {
      value.children = [];
    }
    addNode(newData, value, Props.selectedNode.id);
    dispatch(deleteOrganizationUnitAction(newData));
  };


  const sClickEvent = (value: any) => {
    const newData = Immutable.fromJS(Props.data).toJS();
    const selectedNode = getContent(newData, rowSelectedId);

    if (value && Object.keys(value).length !== 0) {
      moveNode(newData, selectedNode, value.id);
      deleteNode(newData, selectedNode.id, Props.selectedNode.id);
      //handleDelete(rowSelectedId)
    } else {
      moveNode(newData, selectedNode, value.id);
    }
    dispatch(setOrganizationUnitAction(newData));
  };

  const handleOpen = (tittle: any) => {
    setIsOpen(!isOpen);
    setTittle(tittle);

  };

  const openPopup = (popup: any) => {
    switch (popup) {
      case "Groups":
        setGroupOpen(!groupOpen);
        break;

      case "Users":
        setUserOpen(!userOpen);
        break;

      case "OU":
        setOuOpen(!ouOpen);
        break;
    }
  };

  const getContextOptions = (type: any) => {
    switch (type) {
      case "user":
        return options.user;
      case "group":
        return options.group;
      case "org":
        return options.org;
      default:
        return [];
    }
  };

  //

  const contextMenuSelected = (event: any) => {
    setRowSelectedId(event.itemID);
    switch (event.option) {
      case "Add to group":
        break;
      case "Move":
        // setTrigger(true);

        setIsOpen(!isOpen)
        setTittle(`${event.option}`)
        handleClose();

        break;
      case "Delete":
        // handleOpen(event.option);
        handleDelete(event.itemID);
        handleClose();
        // handleClose();
        break;
      case "Rename":
        break;
      case "Info":
        console.log("Info is selected");
        break;
      case "Reset Password":
        console.log("Reset Password is selected");
        break;
      case "Disable Account":
        console.log("Disable Account is selected");
        break;
    }

  };

  return (
    
    <div className="container_view">
      <TableContainer component={Paper}>
        <Table>
          <TableHead className="table_head">
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                 size="small" />
              </TableCell>
              <TableCell>
                Name
              </TableCell>
              <TableCell>
                Designation
              </TableCell>
              <TableCell >
                Country
              </TableCell>
              <TableCell align="right">
                <AddIcon
                  style={{ border: "2px solid #9C9C9C", fill: "#9C9C9C", height: "18.75px", width: "18.75px" }}
                />
              </TableCell>


            </TableRow>
          </TableHead>
          <TableBody>
            {selectedNodeChildren && selectedNodeChildren.map((row) => (
              <TableRow
                key={row.name}
                draggable={trigger}
                onDragStart={(ev: any) => handleDragStart(ev, row)}
              >
                <TableCell></TableCell>
                <TableCell>
                  <div className="sname">{row.name}</div>
                  <div className="fname">Terry Baker</div>
                </TableCell>
                <TableCell>
                  <div className="designation">Sales Admin</div>
                </TableCell>
                <TableCell>
                  <div className="country">India</div>
                </TableCell>
                <TableCell>

                </TableCell>

              </TableRow>
            ))}
            
          </TableBody>
          
        </Table>

      </TableContainer>
      <div className="loadmore">Load more</div>
    </div>



    // <TableContainer component={Paper}>
    //   {/* {Props.selectedNode.type != 'root' && Props.selectedNode.children  && <Button className="mx-2"
    //     style={{ float: "right" }}
    //     variant="contained"
    //     color="primary"
    //     onClick={(e: any) => openPopup('Users')}
    //     >
    //       <AddIcon /> ADD USER
    //     </Button>}

    //     {!Props.selectedNode || Props.selectedNode.type != 'user' && Props.selectedNode.children &&<Button className="mx-2"
    //       style={{ float: "right" }}
    //       variant="contained"
    //       color="primary"
    //       onClick={(e: any) => openPopup('OU')}
    //     >
    //       <AddIcon /> ADD OU
    //     </Button>	} */}

    //   <Table className={classes.table} aria-label="simple table">

    //     <TableHead>

    //     </TableHead>
    //     <TableBody>
    //       {selectedNodeChildren && selectedNodeChildren.map((row) => (
    //         <TableRow
    //           key={row.name}
    //           draggable={trigger}
    //           onDragStart={(ev: any) => handleDragStart(ev, row)}
    //         >
    //           <TableCell className="d-flex cell">
    //             <Checkbox
    //               inputProps={{ "aria-label": "uncontrolled-checkbox" }}
    //             />
    //             <Badge
    //               // overlap="circular"
    //               anchorOrigin={{
    //                 vertical: "bottom",
    //                 horizontal: "right",
    //               }}
    //               variant="dot"
    //             >
    //               <Avatar className={classes.large}>{row.avatar}</Avatar>
    //             </Badge>

    //             <div className="px-5">
    //               <Typography
    //                 variant="subtitle1"
    //                 gutterBottom
    //                 style={{ textAlign: "center" }}
    //               >
    //                 {row.name}
    //               </Typography>
    //             </div>
    //           </TableCell>
    //           <TableCell>
    //             <Typography variant="body2" gutterBottom>
    //               {row.designation ? row.designation : (row.description ? row.description : '')  }
    //             </Typography>
    //           </TableCell>

    //           <TableCell align="right">
    //             {
    //               <ContextMenu
    //                 options={getContextOptions(row.type)}
    //                 parentID={row.id}
    //                 contextMenuSelected={(event: any) =>
    //                   contextMenuSelected(event)
    //                 }
    //               ></ContextMenu>
    //             }
    //           </TableCell>
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>

    //   <AddGroups
    //     isDialogOpened={groupOpen}
    //     handleCloseDialog={() => setGroupOpen(false)}
    //     clickEvent={(value:any,id:any) => clickEvent(value)}
    //   />

    //   <AddUsers
    //     isDialogOpened={userOpen}
    //     handleCloseDialog={() => setUserOpen(false)}
    //     clickEvent={(value:any,id:any) => clickEvent(value)}

    //   />

    // <AddOu
    //     isDialogOpened={ouOpen}
    //     handleCloseDialog={() => setOuOpen(false)}
    //     clickEvent={(value:any,id:any) => clickEvent(value)}
    //   />
    //   <MenuPopUp
    //     isDialogOpened={isOpen}
    //     handleCloseDialog={() => setIsOpen(false)}
    //     tittle={tittle}
    //     data={data}
    //     searchEvent={searchEvent}
    //     rightDraggedItem={rightDraggedItem}
    //     sClickEvent={(value:any) => sClickEvent(value)}



    //   />
    // </TableContainer>
  );
}

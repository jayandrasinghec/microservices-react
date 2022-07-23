import React, { useState, useEffect } from 'react';
import './styles.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import DNDTreeView from "../../../DNDTreeView";
import { getContent } from '../../../../utils';

interface Props {
  data:any;
  searchEvent:any
  rightDraggedItem:any;
  sClickEvent:any;
  selectedNode:any
}


export default function MenuPopUp(Props: any) {
  const { isDialogOpened, handleCloseDialog, tittle,data,searchEvent,rightDraggedItem,sClickEvent } = Props;

  const [selectedNode, setSelectedNode] = useState(Props.data)

  const handleClose = () => {
    handleCloseDialog(false);
  };

  
  const handleClick = (event: any) => {   
    let obj = getContent(Props.data, event);
    setSelectedNode(obj); 
  };

  const handleConfirmClick = () => {
    sClickEvent(selectedNode);
    handleClose();
  }

 return (
   <div
   className="dialogBg">
       <Dialog open={isDialogOpened}
    aria-labelledby="max-width-dialog-title"
   >
      <DialogTitle id="max-width-dialog-title">
      <div className="row justify-content-center">
        {tittle} 
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="dialogTree"
        style={{height:'200px',overflow:'scroll'}}>
          
        <DNDTreeView
        data={data}
        searchEvent={searchEvent}
        rightDraggedItem={rightDraggedItem}        
        clickEvent={(event: any) => handleClick(event)}
        />
        </DialogContentText>
        <DialogActions className="dialogActions">
        <div className="row justify-content-center">
            <Button 
            className="ml-3" 
            variant="contained" 
            color="primary"
            onClick={handleConfirmClick}>
              Confirm
            </Button>
            <Button
              className="ml-3"
              variant="contained"
              color="primary"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </DialogActions>
      </DialogContent>
    </Dialog>
   </div>
   
  );
}

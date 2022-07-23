import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  InputLabel,
  Input,
  FormHelperText,
  TextField,
  TextareaAutosize,
} from "@material-ui/core";

export default function AddGroups(Props: any) {
  const { isDialogOpened, handleCloseDialog, clickEvent } = Props;
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [avatar, setAvatar] = useState('')
  // const [designation, setDesignation] = useState('child-2')
  const handleClose = () => {
    handleCloseDialog(false);
  };
  const handleAdd=(avatar:any,description:any,name:any)=>{
    const group={"name": name, "description": description, "avatar": 'GP'}

    clickEvent(group)
    handleCloseDialog(false);
  }

  return (
    <Dialog open={isDialogOpened} aria-labelledby="max-width-dialog-title">
      <DialogTitle id="max-width-dialog-title"></DialogTitle>
      <DialogContent>
      <DialogContentText>
          <div style={{ height: "125px", width: "500px" }}>
            <div className="container">
              <div className="text-center">
                <h4>ADD GROUPS</h4>
              </div>
              <div className="row py-3">
                <div className="col-6">
                  Name
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    value={name}
                    onChange={(e:any)=>setName(e.target.value)}
                  />
                </div>
                <div className="col-6">
                 <div>Description</div>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    value={description}
                    onChange={(e:any)=>setDescription(e.target.value)}
                  />
                </div>
              </div>
              {/* <div className="row py-3">
                <div className="col-6">
                   Group Avatar
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    value={avatar}
                    onChange={(e:any)=>setAvatar(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  Group Designation
                  <TextField
                    placeholder="child-1"
                    
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    value={designation}
                    onChange={(e:any)=>setDesignation(e.target.value)}
                  />
                </div>
              </div> */}
            </div>
          </div>
        </DialogContentText>
        <DialogActions className="py-5" style={{ justifyContent: "center" }}>
          <Button
            className="mx-3"
            variant="contained"
            // color="primary"
            onClick={handleClose}
          >
            Discard
          </Button>
          <Button
            className="mx-3"
            variant="contained"
            color="primary"
            onClick={(event:any)=>handleAdd(avatar,description,name)}
            // setFilters(defaultQuery.filter);
          >
            Add Group
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

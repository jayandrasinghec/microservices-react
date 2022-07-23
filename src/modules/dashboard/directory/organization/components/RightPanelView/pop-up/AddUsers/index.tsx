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
} from "@material-ui/core";

export default function AddUsers(Props: any) {
  const { isDialogOpened, handleCloseDialog,clickEvent } = Props;
const [name, setName] = useState('')
// const [id, setId] = useState('')
const [avatar, setAvatar] = useState('')
const [designation, setDesignation] = useState('')
  const handleClose = () => {
    handleCloseDialog(false);
  };

  const handleAdd=(avatar:any,designation:any,name:any)=>{
    const user={"designation": designation,"name": name,"avatar": avatar, "type" : 'user'}

    clickEvent(user)
    handleCloseDialog(false);
  }

  return (
    <Dialog open={isDialogOpened} aria-labelledby="max-width-dialog-title">
      <DialogTitle id="max-width-dialog-title"></DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div style={{ height: "150px", width: "500px" }}>
            <div className="container">
              <div className="text-center">
                <h4>ADD USERS</h4>
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
                 <div> Designation</div>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    value={designation}
                    onChange={(e:any)=>setDesignation(e.target.value)}
                  />
                </div>
              </div>
              {/* <div className="row py-3">
                <div className="col-6">
                   User Avatar
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    value={avatar}
                    onChange={(e:any)=>setAvatar(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  User Designation
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
        <DialogActions style={{ justifyContent: "center" }}>
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
            onClick={(event:any)=>handleAdd(avatar,designation,name)}
            // setFilters(defaultQuery.filter);
          >
            Add User
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

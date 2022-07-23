import { Button, Grid, makeStyles, Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppCheckbox from "../../../../../components/form/AppCheckbox";
import AppSelectInput from "../../../../../components/form/AppSelectInput";
import { callApi, getTenant } from "../../../../../utils/api";
import { isActiveForRoles } from "../../../../../utils/auth";
import { showSuccess } from "../../../../../utils/notifications";
import { GetAllHookAction } from "../../actions/settingActions";
import CommonScriptEditor from "./commonScriptEditor";

const hookActionType = [
  { label: "PRE", value: "PRE" },
  { label: "POST", value: "POST" },
];
const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    //   height: 400,
    overflow: "hidden",
    flex: 1,
  },
  divone: {
    marginRight: 20,
    marginLeft: 10,
    borderRadius: "10px",
    flex: 1,
    overflowY: "auto",
  },
  paperone: {
    padding: 25,
    marginBottom: 20,
    marginTop: 20,
    border: "none",
    boxShadow: "none",
  },
  papertwo: {
    padding: 25,
    marginBottom: 20,
    marginTop: 20,
    border: "none",
    boxShadow: "none",
  },
  flexdiv: {
    display: "flex",
  },
  button: {
    float: "right",
    borderRadius: "8px",
    marginRight: 20,
  },
  saveBtnContainer: {
    textAlign: "end",
  },
}));


const AddEditHook = ({ screens, setScreens, allData,downloadData }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const getAllActions = useSelector((state) => {
    if (state.settingReducer.hookAction) {
      return state.settingReducer.hookAction;
    } else {
      return [];
    }
  });
  const [script, setScript] = useState("");
  const [open, setOpen] = useState(false);
  const [saving,setSaving] = useState(false)
  const [data, setData] = useState({ action: "", type: "", status: false });
  const handleModalOpen = () => {
    setOpen(true);
  };
  const handleModalClose = () => {
    setOpen(false);
  };
  const handleScriptOnChanges = (newValue) => {
    setScript(newValue);
  };

  const onEditValueChange = ()=>{ 
    if(screens.isEditId){
      let currentData = allData.filter((item)=>item.id === screens.isEditId)[0];
      setData({action:currentData.action,type:currentData.type,status:currentData.status});
      setScript(currentData.script)
    }
  }
  useEffect(() => {
    dispatch(GetAllHookAction());
    onEditValueChange()
  }, []);
  const onSubmit = () => {
    let reqData = { ...data, script: script };
    setSaving(true)
    callApi(`${screens.isEditId? `/utilsrvc/hook/config/${screens.isEditId}` : `/utilsrvc/hook/config`}`, `${screens.isEditId?"put": "post"}`, reqData, "", false, {
      tenant: getTenant(),
    })
      .then((res) => {
        if (res.success) {
          setScreens({ isAdd: false, isEditId:"" }); 
          downloadData();
          if(screens.isEditId){
            showSuccess("Script Updated Successfully!");
          }else{
            showSuccess("Script Added Successfully!");
          }
        }
        setSaving(false)  
      })
      .catch((err) => {
        console.log(err);
        setSaving(false) 
      });
  };
  let isValid = data.action !== "" && data.type !== "" && script !== "";
  
  return (
    <div className={classes.container}>
      <div className={classes.divone}>
        <Paper variant="outlined" elevation={3} className={classes.paperone}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <AppSelectInput 
                value={data.action}            
                onChange={(e) => setData({ ...data, action: e.target.value })}
                options={getAllActions.map((item) => item.value)}
                fullWidth
                style={{ width: "100%" }}
                labels={getAllActions.map((r) => r.label)}
                label="Action"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppSelectInput 
                value={data.type}  
                onChange={(e) => setData({ ...data, type: e.target.value })}
                options={hookActionType.map((item) => item.value)}
                labels={hookActionType.map((r) => r.label)}
                fullWidth
                style={{ width: "100%" }}
                label="Type"
              />
            </Grid>
            <Grid item xs={12} md={2} className={classes.checkBoxContainer}>
              <AppCheckbox
                value={data.status}
                onChange={(value) => setData({ ...data, status: value })}
                switchLabel={data.status ? "Active" : "Inactive"}
                disabled={!isActiveForRoles(["ORG_ADMIN"])}
                label="Status"
              />
            </Grid>
          </Grid>
        </Paper>

        <CommonScriptEditor
          openFullEditor={open}
          handleScriptOnChanges={handleScriptOnChanges}
          script={script}
          handleOpenFullEditor={handleModalOpen}
          handleCloseFullEditor={handleModalClose}
        />
        <div className={classes.flexdiv}>
          <Grid item xs={6}>
            <Button onClick={() => setScreens({ isAdd: false })}>
              Discard
            </Button>
          </Grid>
          <Grid item xs={6} className={classes.saveBtnContainer}>
            <Button
              disabled={!isValid || saving}
              onClick={onSubmit}
              variant="contained"
              className={classes.button}
              color="primary"
            >
              {!saving ? 'Save' : 'Saving'}
            </Button>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default AddEditHook;

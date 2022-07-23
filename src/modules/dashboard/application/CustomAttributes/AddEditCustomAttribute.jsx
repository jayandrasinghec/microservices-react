import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import AppTextInput from "../../../../components/form/AppTextInput";
import GreyBtn from "../../../../components/HOC/GreyBtn";
import AppCheckbox from "../../../../components/form/AppCheckbox";
import { callApi } from "../../../../utils/api";
import { showSuccess } from "../../../../utils/notifications";
const styles = (theme) => ({
  helpText: {
    background: "#f1e09a",
    padding: "16px",
    borderRadius: "4px",
    marginTop: "94px",
    "& div": {
      display: "flex",
      alignItems: "center",
      marginBottom: "8px",
      "& svg": {
        marginRight: "4px",
      },
    },
  },
  rulesSearchAdd: {
    float: "right",
  },
  questionItem: {
    padding: "8px 0px 8px 16px",
  },
  custDialog: {
    "& .MuiDialog-paper": {
      background: "#e6eaf6",
      width: "600px",
    },
    "& .MuiDialogActions-root": {
      padding: "8px 16px 16px 16px",
      justifyContent: "unset",
    },
  },
  closeButton: {
    float: "right",
    marginTop: "-8px",
  },
  statusSwitch: {
    marginBottom: "-16px",
    marginLeft: "0px",
  },
  txtCenter: {
    textAlign: "center",
  },
});
const defaultValues = {
  type: "CustomAttribute",
  name: "",
  value: "",
  status: false,
  active: false,
};
function AddEditCustomAttribute({
  classes,
  handleClose,
  open,
  edit,
  editData,
  downloadAttributes,
}) {
  const [newData, setNewData] = useState(defaultValues);
  const [saving, setSaving] = React.useState(false);
  const [errors, _setErrors] = React.useState({});

  const setError = (e) => _setErrors({ ...errors, ...e });

  const isValid = !Object.values(errors).some((e) => e != null) && newData.name && newData.value

  const change = (e) => {
    setNewData({ ...newData, ...e });
  };

  useEffect(() => {
    if (edit) {
      setNewData(editData);
    }
  }, []);

  const validate = (key) => {
    if(!newData[key] || !(newData[key]).trim().length){
      setError({ [key] : 'This field is required'} )
    }else{
      setError({ [key] : null })
    }
  }

  const onSave = () => {
    setSaving(true);
    if (!newData.id) {
      callApi(`/utilsrvc/meta/CustomAttribute`, "POST", newData)
        .then((e) => {
          setSaving(false);
          handleClose();
          if (e.success) {
            showSuccess("New attribute added successfully!");
            downloadAttributes();
          }
        })
        .catch((error) => {
          setSaving(false);
        });
    } else {
      callApi(`/utilsrvc/meta/CustomAttribute`, "POST", newData)
        .then((e) => {
          setSaving(false);
          if (e.success) {
            showSuccess("Attribute updated Successfully!");
            if (newData.active === true) {
              callApi(
                `/utilsrvc/meta/activate/CustomAttribute/${newData.id}`,
                "PUT"
              ).then((e) => {
                if (e.success) {
//                   showSuccess("Activated Successfully!");
                  downloadAttributes();
                  handleClose();
                }
              });
            } else {
              callApi(
                `/utilsrvc/meta/deactivate/CustomAttribute/${newData.id}`,
                "PUT"
              ).then((e) => {
                if (e.success) {
//                   showSuccess("Deactivated Successfully!");
                  downloadAttributes();
                  handleClose();
                }
              });
            }
          }
        })
        .catch((error) => {
          setSaving(false);
        });
    }
  };
  return (
    <div className={classes.custDialog}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        className={classes.custDialog}
      >
        <DialogTitle id="form-dialog-title">
          {`${edit ? "Edit Custom Atrribute" : "ADD Custom Atrribute"}`}
          <IconButton aria-label="close" className={classes.closeButton}>
            <CloseIcon onClick={handleClose} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Card elevation={0}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <AppTextInput
                    label="Attribute"
                    value={newData && newData.name}
                    disabled={edit}
                    required
                    onChange={(e) => change({ name: e.target.value })}
                    error={!!errors.name}
                    helperText={errors.name}
                    onBlur={() => validate('name')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <AppTextInput
                    label="Description"
                    required
                    value={newData && newData.value}
                    onChange={(e) => change({ value: e.target.value })}
                    error={!!errors.value}
                    helperText={errors.value}
                    onBlur={() => validate('value')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <AppCheckbox
                    value={newData && newData.active}
                    onChange={(e) => change({ active: e })}
                    label={`${newData.active ? "Active" : "Inactive"}`}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>

        <div className={classes.txtCenter}>
          Warning! This action will impact user reconciliation (pull or push)
          process.
        </div>

        <DialogActions>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <GreyBtn onClick={handleClose}>Cancel</GreyBtn>
            </Grid>
            <Grid
              item
              xs={6}
              sm={6}
              md={6}
              lg={6}
              container
              direction="row"
              justify="flex-end"
            >
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="small"
                disableElevation
                disabled={!isValid || saving}
                onClick={onSave}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(AddEditCustomAttribute);

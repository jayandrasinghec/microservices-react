import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  withStyles,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import VisibilityIcon from '@material-ui/icons/Visibility'

import ActiveStatusChip from "../../../../../../components/HOC/ActiveStatusChip";
import InactiveStatusChip from "../../../../../../components/HOC/InactiveStatusChip";
import CardViewWrapper from "../../../../../../components/HOC/CardViewWrapper";
import { isActiveForRoles } from "../../../../../../utils/auth";
import DeleteIcon from "../../../../../../assets/Delete.png";
import EditRuleModal from "../EditRuleModal";
import { TabPanel, NestedTabs } from "./nestedTabs";
import AddNewRuleApplication from "./addNewRuleApplication";
import AddNewRuleCondition from "./addNewRuleCondition";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  GetRulesDetailsByIdAction,
  PostDeleteRuleAction,
} from "../actions/administrationRuleActions";
import DeleteModal from "../../../../../../components/DeleteModal";

const styles = (theme) => ({
  ruleCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    "& .ruleType": {
      color: "#363795",
      fontWeight: "700",
    },
    "& .ruleDesc": {
      color: "#8897ab",
    },
    "& .ruleName": {
      fontWeight: "700",
    },
    "& .editDeleteIcon": {
      "& img": {
        width: "16px",
        height: "16px",
      },
    },
    "& .adaptiveScore": {
      fontWeight: "500",
    },
  },
  ruleApplyRadio: {
    border: "1px solid #ccc",
    margin: "16px 0px 0px 0px",
    borderRadius: "4px",
    width: "100%",
    display: "block",
  },
});

function ProvisionRuleMain(props) {
  const { classes, GetRulesDetailsByIdAction, rulesDetailsById, PostDeleteRuleAction, history } = props;
  const [isEdit, setisEdit] = useState(false);
  const [isVisible, setIsVisible] = useState(false)
  const [value, setValue] = React.useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [deleteName, setDeleteName] = useState('')
  const [saving, setSaving] = useState(false)

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setIsVisible(false)
  };
  const handleClose = () => {
    setisEdit(false);
  };

  const handleEditRuleClick = () => {
    setisEdit(true);
  };

  const handleDeleteRuleClick = () => {
    setSaving(true)
    PostDeleteRuleAction(props.ruleId, history)
  };

  useEffect(() => {
    if (props.ruleId !== null) {
      GetRulesDetailsByIdAction(props.ruleId);
    }
  },[]);

  
  return (
    <>
      {isEdit && <EditRuleModal open={isEdit} handleClose={handleClose} />}
      <Box className={classes.ruleCard}>
        <Grid container alignItems="center">
          <Grid item xs={3}>
            <Typography className="ruleType">
              {rulesDetailsById && rulesDetailsById.name !== null
                ? rulesDetailsById.name
                : ""}
            </Typography>
            <Typography className="ruleDesc">
              {rulesDetailsById && rulesDetailsById.description !== null
                ? rulesDetailsById.description
                : ""}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography className="ruleName">
              Provision
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography className="ruleType">
              Execution Type
            </Typography>
            <Typography className="ruleDesc">
              {rulesDetailsById && rulesDetailsById.allConditionApplied !== true
                ? 'Any'
                : 'All'}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            {rulesDetailsById && rulesDetailsById.active ? (
              <ActiveStatusChip>Active</ActiveStatusChip>
            ) : (
              <InactiveStatusChip>Inactive</InactiveStatusChip>
            )}
          </Grid>
          <Grid
            item
            xs={2}
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <IconButton
              color="primary"
              aria-label="Edit Rule"
              component="span"
              onClick={handleEditRuleClick}
            >
              { isActiveForRoles(['READ_ONLY']) ? <VisibilityIcon style={{ color: '#ddd' }}/> : 
              <Avatar
                src={require("../../../../../../assets/Edit.png")}
                className="editDeleteIcon"
              /> }
            </IconButton>
            {isActiveForRoles(["ORG_ADMIN"]) && <IconButton
              color="primary"
              aria-label="Delete Rule"
              component="span"
              // disabled={rulesDetailsById.active === true ? true : false}
              disabled={
                (rulesDetailsById && rulesDetailsById.active) ||
                !isActiveForRoles(["ORG_ADMIN"])
              }
              // onClick={handleDeleteRuleClick}
              onClick={() => setShowConfirmation(true)}
            >
              <Avatar src={DeleteIcon} className="editDeleteIcon" />
            </IconButton> }
          </Grid>
          {showConfirmation && (
            <DeleteModal
              open={showConfirmation}
              name={deleteName}
              saving={saving}
              onClose={() => setShowConfirmation(false)}
              onDelete={() => handleDeleteRuleClick()}
            />
           )}
        </Grid>
      </Box>
      <CardViewWrapper>
        <NestedTabs value={value} onChange={handleChange} setIsVisible={setIsVisible} />
      </CardViewWrapper>
        <TabPanel value={value} index={0}>
          <AddNewRuleApplication  ruleId={props.ruleId} isVisible={isVisible} setIsVisible={setIsVisible} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AddNewRuleCondition ruleId={props.ruleId} rulesDetailsById={rulesDetailsById} isVisible={isVisible} setIsVisible={setIsVisible} />
        </TabPanel>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    // loading: state.adminRuleReducer.loading,
    ruleId: state.adminRuleReducer.ruleId,
    rulesDetailsById:
      state.adminRuleReducer.ruleDetailsById !== null &&
      state.adminRuleReducer.ruleDetailsById.data,
    // deleteRule: state.adminRuleReducer.deleteRule !== null && state.adminRuleReducer.deleteRule,
    // mfaConfigDetails: state.administrationmfaReducer.mfaConfigDetails !== null && state.administrationmfaReducer.mfaConfigDetails
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    ...bindActionCreators(
      {
        GetRulesDetailsByIdAction,
        PostDeleteRuleAction
      },
      dispatch
    ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ProvisionRuleMain));

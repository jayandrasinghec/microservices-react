import React, { Component } from 'react';
import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CircularProgress from '@material-ui/core/CircularProgress';

import CardViewWrapper from "../../../../../components/HOC/CardViewWrapper";
import CustomInputLabel from '../../../../../components/HOC/CustomInputLabel';
import GreyBtn from '../../../../../components/HOC/GreyBtn';
import { PostUserListSearchAction, PostGroupListSearchAction, PostRuleAssignedToAction } from './actions/administrationRuleActions';
import { Typography } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import ClearIcon from '@material-ui/icons/Clear';

const styles = theme => ({
  ruleApplyRadio: {
    border: "1px solid #ccc",
    margin: "16px 0px 0px 0px",
    borderRadius: "4px",
    width: "100%",
    display: "block",
  },
  marginTop: {
    marginTop: 10
  },
  specificGroupUser: {
    marginTop: 16,
    '& .title': {
      marginBottom: 16
    }
  },
  customChip: {
    background: '#4e97c8',
    borderRadius: 4,
    marginRight: 16,
    marginBottom: 16,
    '&:hover, &:focus': {
      background: '#4e97c8',
    },
    '& span': {
      color: '#fff'
    },
    '& svg': {
      color: '#fff'
    }
  },
  noDataChip: {
    border: 'none'
  }
});


class AdminRuleConfigAssigned extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'specific',
      user: [],
      group: [],
      isGroupDisabled: true,
      excludeduser: [],
      selectedUser: [],
      selectedGroup: [],
      ruleDetailsByIdData: {},
      isEdit:true
    }
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (this.props.userListSearch !== nextProps.userListSearch) {
      if (nextProps.userListSearch.data !== null && nextProps.userListSearch.data !== undefined) {
        this.setState({
          user: nextProps.userListSearch.data.elements
        })
      }
    }
    if (this.props.groupListSearch !== nextProps.groupListSearch) {
      if (nextProps.groupListSearch.data !== null) {
        this.setState({
          group: nextProps.groupListSearch.data.elements
        })
      }
    }
    if (this.props.ruleDetailsById !== nextProps.ruleDetailsById) {
      if (nextProps.ruleDetailsById.data !== null) {
        this.setState({
          ruleDetailsByIdData: nextProps.ruleDetailsById.data
        })
        let attachedGroupIDsArr = [];
        if(nextProps.ruleDetailsById.data.attachedGroupIDs && nextProps.ruleDetailsById.data.attachedGroupIDs.length > 0 ) {
          nextProps.ruleDetailsById.data.attachedGroupIDs.map((obj, index) => {
            attachedGroupIDsArr.push(obj.id)
          })
          this.setState({
            selectedGroup: attachedGroupIDsArr
          })
        }
        let attachedUserIDsArr = []
        if(nextProps.ruleDetailsById.data.attachedUserIDs && nextProps.ruleDetailsById.data.attachedUserIDs.length > 0 ) {
          nextProps.ruleDetailsById.data.attachedUserIDs.map((obj, index) => {
            attachedUserIDsArr.push(obj.id)
          })
          this.setState({
            selectedUser: attachedUserIDsArr
          })
        }
        let excludedUserIDsArr = []
        if(nextProps.ruleDetailsById.data.excludedUserIDs && nextProps.ruleDetailsById.data.excludedUserIDs.length > 0 ) {
          nextProps.ruleDetailsById.data.excludedUserIDs.map((obj, index) => {
            excludedUserIDsArr.push(obj.id)
          })
          this.setState({
            excludeduser: excludedUserIDsArr
          })
        }
      }
    }
  }


  handleRadioActionChange = (event) => {
    this.setState({
      value: event.target.value
    }, () => {
      if (this.state.value === "all") {
        this.setState({
          isGroupDisabled: true
        })
      } else {
        this.setState({
          isGroupDisabled: false
        })
      }
    })
  }

  onChangeExcludeUserHandler(event) {
    event.preventDefault();
    let keyword = event.target.value;
    let postData = {
      "direction": "ASC",
      "filters": {
        "department": "",
        "designation": "",
        "email": "",
        "group": "",
        "location": "",
        "mobile": "",
        "reportingManager": "",
        "status": [],
        "userType": ""
      },
      "keyword": keyword,
      "pageNumber": "0",
      "pageSize": "10",
      "sort": "FIRST_NAME"
    }
    this.props.PostUserListSearchAction(postData);
  }

  onChangeGroupHandler = (event) => {
    event.preventDefault();
    let keyword = event.target.value;
    let postData = {
      "direction": "ASC",
      "keyword": keyword,
      "pageNumber": "0",
      "pageSize": "10",
      "sort": "GROUP_NAME"
    }
    this.props.PostGroupListSearchAction(postData);
  }

  getOptionSelectedHandler = (option, value, type) => {
    if (type === "exuser") {
      let excludeduserCopy = this.state.excludeduser;
      let exuserIds = [];
      if (value.length > 0) {
        value.map((obj, index) => {
          exuserIds.push(obj.id)
        })
      }
      excludeduserCopy = excludeduserCopy.concat(exuserIds);
      this.setState({
        excludeduser: excludeduserCopy
      })
    }
    if (type === "user") {
      let selectedUserCopy = this.state.selectedUser;
      let userIds = [];
      if (value.length > 0) {
        value.map((obj, index) => {
          userIds.push(obj.id)
        })
      }
      selectedUserCopy = selectedUserCopy.concat(userIds);
      this.setState({
        selectedUser: selectedUserCopy
      })
    }
    if (type === "group") {
      let selectedGroupCopy = this.state.selectedGroup;
      let groupIds = [];
      if (value.length > 0) {
        value.map((obj, index) => {
          groupIds.push(obj.id)
        })
      }
      selectedGroupCopy = selectedGroupCopy.concat(groupIds);
      this.setState({
        selectedGroup: selectedGroupCopy
      })
    }

  }

  onFormSubmitHandler = () => {
    let postData = {
      "id": this.props.ruleId,
      "forEveryOne": this.state.isGroupDisabled === true ? true : false,
      "attachedGroupIDs": this.state.isGroupDisabled === true ? [] : this.state.selectedGroup,
      "attachedUserIDs": this.state.isGroupDisabled === true ? [] : this.state.selectedUser,
      "excludedUserIDs": this.state.excludeduser
    }
    this.setState({
      value: 'all',
      user: [],
      group: [],
      isGroupDisabled: true,
      excludeduser: [],
      selectedUser: [],
      selectedGroup: []
    }, () => {
      this.props.PostRuleAssignedToAction(postData, this.props.ruleId);
    })
  }

  delteSubmissionHandler = () => {
    let postData = {
      "id": this.props.ruleId,
      "forEveryOne": this.state.isGroupDisabled === true ? true : false,
      "attachedGroupIDs": this.state.selectedGroup,
      "attachedUserIDs": this.state.selectedUser,
      "excludedUserIDs": this.state.excludeduser
    }
    this.props.PostRuleAssignedToAction(postData, this.props.ruleId)
  }

  handleDelete = (e,obj,index, type) => {
    e.preventDefault();
    if(type === 'group') {
      let selectedGroupCopy = this.state.selectedGroup;
      let tempArr = selectedGroupCopy.filter(data => data !== obj.id);
      selectedGroupCopy = tempArr;
      this.setState({
        selectedGroup: selectedGroupCopy
      }, () => {
        this.delteSubmissionHandler();
      })
    } else if (type === 'user') {
      let selectedUserCopy = this.state.selectedUser;
      let tempArr = selectedUserCopy.filter(data => data !== obj.id);
      selectedUserCopy = tempArr;
      this.setState({
        selectedUser: selectedUserCopy
      }, () => {
        this.delteSubmissionHandler();
      })
    } else if (type === 'exuser') {
      let excludedUserCopy = this.state.excludeduser;
      let tempArr = excludedUserCopy.filter(data => data !== obj.id);
      excludedUserCopy = tempArr;
      this.setState({
        excludeduser: excludedUserCopy
      }, () => {
        this.delteSubmissionHandler();
      })
    } else {
      return
    }
  }

  render() {
    const { classes, loading, handleSubmit } = this.props;
    const { value, user, group, isGroupDisabled, ruleDetailsByIdData } = this.state;
    
    return (
      <>
        <form onSubmit={handleSubmit(val => this.onFormSubmitHandler(val))}>
          <Card elevation={0}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>

                  <CustomInputLabel >
                    Who Does this rule apply to
                    
                  </CustomInputLabel>
                  <img src='assets/img/icons/edit.svg' style={{cursor:'pointer'}} onClick={()=>this.setState({isEdit:!this.state.isEdit})} />
                  </div>
                  <Grid container spacing={2} className={classes.specificGroupUser}>
                    <Grid item xs={12} >
                      <CustomInputLabel>
                        To sepecific groups and users
                      </CustomInputLabel>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography className="title">
                        Groups
                      </Typography>
                      {
                        ruleDetailsByIdData.attachedGroupIDs !== undefined && ruleDetailsByIdData.attachedGroupIDs !== null && ruleDetailsByIdData.attachedGroupIDs.length > 0
                        ?
                          ruleDetailsByIdData.attachedGroupIDs.map((obj, index) => {
                            return <Chip
                              label={obj.name}
                              clickable
                              className={classes.customChip}
                              onDelete={(e) => this.handleDelete(e,obj, index, 'group')}
                              deleteIcon={<ClearIcon />}
                            />
                        })
                        :
                        <Chip className={classes.noDataChip} label="No assigned groups" disabled variant="outlined" />
                      }
                    </Grid>
                    <Grid item xs={4}>
                      <Typography className="title">
                        Users
                      </Typography>
                      {
                        ruleDetailsByIdData.attachedUserIDs !== undefined && ruleDetailsByIdData.attachedUserIDs !== null && ruleDetailsByIdData.attachedUserIDs.length > 0
                        ?
                          ruleDetailsByIdData.attachedUserIDs.map((obj, index) => {
                            return <Chip
                              label={obj.name}
                              clickable
                              className={classes.customChip}
                              onDelete={(e) => this.handleDelete(e,obj, index, 'user')}
                              deleteIcon={<ClearIcon />}
                            />
                        })
                        :
                        <Chip className={classes.noDataChip} label="No assigned users" disabled variant="outlined" />
                      }
                    </Grid>
                    <Grid item xs={4}>
                      <Typography className="title">
                        Exclusion
                      </Typography>
                      {
                        ruleDetailsByIdData.excludedUserIDs !== undefined && ruleDetailsByIdData.excludedUserIDs !== null && ruleDetailsByIdData.excludedUserIDs.length > 0
                        ?
                          ruleDetailsByIdData.excludedUserIDs.map((obj, index) => {
                            return <Chip
                              label={obj.name}
                              clickable
                              className={classes.customChip}
                              onDelete={(e) => this.handleDelete(e, obj, index, 'exuser')}
                              deleteIcon={<ClearIcon />}
                            />
                        })
                        :
                        <Chip className={classes.noDataChip} label="No exclusion users" disabled variant="outlined" />
                      }
                    </Grid>
                  </Grid>
                  {!this.state.isEdit && <RadioGroup aria-label="quiz" name="quiz" value={value} onChange={(e) => this.handleRadioActionChange(e)}>
                    <FormControlLabel color="primary" value="all" control={<Radio />} label="All Users" className={classes.ruleApplyRadio} />
                    <FormControlLabel value="specific" control={<Radio />} label="To sepecific groups and users" className={classes.ruleApplyRadio} />
                  </RadioGroup>}
                </Grid>

                {!this.state.isEdit && <Grid item xs={12}>
                  <CustomInputLabel>Group</CustomInputLabel>
                  <Autocomplete
                    id="group"
                    multiple
                    autoHighlight
                    loading={loading}
                    options={group}
                    disabled={isGroupDisabled}
                    onChange={(event, value) => this.getOptionSelectedHandler(event, value, 'group')}
                    getOptionLabel={(option) => option.name}
                    onInputChange={(e) => this.onChangeGroupHandler(e)}
                    renderOption={(option) => (
                      <>
                        {option.name}
                      </>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        InputProps={{
                          ...params.InputProps,
                          autoComplete: 'new-password',
                          endAdornment: (
                            <>
                              {loading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>}
                {!this.state.isEdit && <Grid item xs={12}>
                  <CustomInputLabel>User</CustomInputLabel>
                  <Autocomplete
                    id="user"
                    multiple
                    autoHighlight
                    loading={loading}
                    options={user}
                    disabled={isGroupDisabled}
                    onChange={(event, value) => this.getOptionSelectedHandler(event, value, 'user')}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                    onInputChange={(e) => this.onChangeExcludeUserHandler(e)}
                    renderOption={(option) => (
                      <>
                        {option.firstName} {option.lastName} -- <i>{option.email}</i>
                      </>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        InputProps={{
                          ...params.InputProps,
                          autoComplete: 'new-password',
                          endAdornment: (
                            <>
                              {loading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>}
                {!this.state.isEdit && <Grid item xs={12}>
                  <CustomInputLabel>Exclusion</CustomInputLabel>
                </Grid>}
                {!this.state.isEdit && <Grid item xs={12}>
                  <CustomInputLabel>User</CustomInputLabel>
                  <Autocomplete
                    id="exclusionUser"
                    multiple
                    autoHighlight
                    loading={loading}
                    options={user}
                    filterSelectedOptions={true}
                    clearOnBlur={true}
                    getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                    onChange={(event, value) => this.getOptionSelectedHandler(event, value, 'exuser')}
                    onInputChange={(e) => this.onChangeExcludeUserHandler(e)}
                    renderOption={(option) => (
                      <>
                        {option.firstName} {option.lastName} -- <i>{option.email}</i>
                      </>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        InputProps={{
                          ...params.InputProps,
                          autoComplete: 'new-password',
                          endAdornment: (
                            <>
                              {loading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>}
              </Grid>
            </CardContent>
          </Card>

          {!this.state.isEdit &&<Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <GreyBtn>Discard</GreyBtn>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} container direction="row" justify="flex-end">
                <Button variant="contained" color="primary" type="submit" size="small" disableElevation>
                  Save
                </Button>
              </Grid>
            </Grid>
          </Box>}
        </form>
      </>
    )
  }
}

AdminRuleConfigAssigned = reduxForm({
  form: "AdminRuleConfigAssignedForm",
  // validate,
  enableReinitialize: true
})(AdminRuleConfigAssigned);

function mapStateToProps(state) {
  return {
    loading: state.adminRuleReducer.loading,
    ruleId: state.adminRuleReducer.ruleId,
    userListSearch: state.adminRuleReducer.userListSearch !== null && state.adminRuleReducer.userListSearch,
    groupListSearch: state.adminRuleReducer.groupListSearch !== null && state.adminRuleReducer.groupListSearch,
    ruleDetailsById: state.adminRuleReducer.ruleDetailsById !== null && state.adminRuleReducer.ruleDetailsById
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({
      PostUserListSearchAction,
      PostGroupListSearchAction,
      PostRuleAssignedToAction
    }, dispatch)
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AdminRuleConfigAssigned));


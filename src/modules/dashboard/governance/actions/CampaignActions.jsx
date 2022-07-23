import React from 'react';
import {
    actionCreator,
    checkHttpStatus,
    jsonApiHeader,
    CampaignActionTypes,
    POST_CAMPAIGN_DETAILS_API,
    GET_ALL_CAMPAIGN_LIST_API,
    POST_UPDATE_CAMPAIGN_STATUS_API,
    POST_CAMPAIGN_HISTORY_LIST_API,
    POST_CAMPAIGN_ASSIGNMENT_LIST_API,
    GET_CAMPAIGN_HISTORY_DETAILS_API,
    POST_CAMPAIGN_ASSIGNMENT_HISTORY_LIST_API,
    PUT_CAMPAIGN_STAGE_API,
    GET_CAMPAIGN_STAGE_API,
    GET_CAMPAIGN_SCOPE_API,
    PUT_CAMPAIGN_PUBLISH_API,
    PUT_CAMPAIGN_MANUAL_START_API,
    PUT_CAMPAIGN_MANUAL_STOP_API,
    POST_CAMPAIGN_ACTIVE_SUMMARY,
    POST_CAMPAIGN_ACTIVE_ASSIGNMENTS,
    POST_CAMPAIGN_HISTORY_SUMMARY,
    POST_CAMPAIGN_HISTORY_ASSIGNMENTS
} from '../constants/index';

// import { enqueueSnackbarAction, closeSnackbarAction } from "./snackbarActions";
import Button from '@material-ui/core/Button';
import { showError, showSuccess } from '../../../../utils/notifications';
import { errors } from '../../../../utils/error';

const search = (key) => {
  for (var i = 0; i < errors.length; i++) {
    if (errors[i].key === key) {
      return errors[i].value;
    }
  }
}

export const PostCampaignDetails = (postData, history, setSaving) => {
    return (dispatch, getState) => {
        setSaving(true)
        dispatch(actionCreator(CampaignActionTypes.post_CampaignDetails.REQUEST));
        fetch(`${POST_CAMPAIGN_DETAILS_API}`, {
            method: 'POST',
            headers: jsonApiHeader('', true),
            body: JSON.stringify(postData)
        })
            .then(checkHttpStatus)
            .then(function (response) {
                if(response.success) {
                    dispatch(actionCreator(CampaignActionTypes.post_CampaignDetails.SUCCESS, response.data));
                    history.push(`/dash/governance/campaign/create/${response.data.id}/scope`)
                    showSuccess("Added Successfully")
                }else{
                    dispatch(actionCreator(CampaignActionTypes.post_CampaignDetails.FAILURE));
                    showError(search(response.errorCode)) 
                }
                setSaving(false)
            })
            .catch(function (error) {
                dispatch(actionCreator(CampaignActionTypes.post_CampaignDetails.FAILURE));
                showError(error.errorCode || "Some error occurred")
                setSaving(false)
            });
    };
};

// export const PostCampaignStage = (postData, id, history) => {
//   return (dispatch, getState) => {
//       dispatch(actionCreator(CampaignActionTypes.post_CampaignStage.REQUEST));
//       fetch(`${PUT_CAMPAIGN_STAGE_API}/${id}/stage`, {
//           method: 'POST',
//           headers: jsonApiHeader('', true),
//           body: JSON.stringify(postData)
//       })
//           .then(checkHttpStatus)
//           .then(function (response) {
//               if(response.success) {
//                   dispatch(actionCreator(CampaignActionTypes.post_CampaignStage.SUCCESS, response.data));
//                   history.push(`/dash/governance/campaign/details/${id}`)
//                   showSuccess("Added Successfully")
//               }else{
//                   dispatch(actionCreator(CampaignActionTypes.post_CampaignStage.FAILURE));
//                   showError(response.errorCode) 
//               }
//           })
//           .catch(function (error) {
//               dispatch(actionCreator(CampaignActionTypes.post_CampaignStage.FAILURE));
//               showError("Some error occurred")
//           });
//   };
// };

export const GetCampaignDetails = (id) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(CampaignActionTypes.get_CampaignDetails.REQUEST));
        fetch(`${POST_CAMPAIGN_DETAILS_API}/${id}`, {
            method: 'GET',
            headers: jsonApiHeader('', true),
            // body: JSON.stringify(postData)
        })
            .then(checkHttpStatus)
            .then(function (response) {
                if(response.success) {
                    dispatch(actionCreator(CampaignActionTypes.get_CampaignDetails.SUCCESS, response.data));
                }else{
                    dispatch(actionCreator(CampaignActionTypes.get_CampaignDetails.FAILURE));
                    showError(search(response.errorCode)) 
                }
            })
            .catch(function (error) {
                dispatch(actionCreator(CampaignActionTypes.get_CampaignDetails.FAILURE));
                showError(search(error.errorCode) || "Some error occurred")
            });
    };
};

export const GetCampaignStage = (id) => {
  return (dispatch, getState) => {
      dispatch(actionCreator(CampaignActionTypes.get_CampaignStage.REQUEST));
      fetch(`${GET_CAMPAIGN_STAGE_API}/${id}`, {
          method: 'GET',
          headers: jsonApiHeader('', true),
          // body: JSON.stringify(postData)
      })
          .then(checkHttpStatus)
          .then(function (response) {
              if(response.success) {
                  dispatch(actionCreator(CampaignActionTypes.get_CampaignStage.SUCCESS, response.data));
              }else{
                  dispatch(actionCreator(CampaignActionTypes.get_CampaignStage.FAILURE));
                  showError(search(response.errorCode)) 
              }
          })
          .catch(function (error) {
              dispatch(actionCreator(CampaignActionTypes.get_CampaignStage.FAILURE));
              showError(search(error.errorCode) || "Some error occurred")
          });
  };
};

export const GetCampaignHistoryDetails = (id) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(CampaignActionTypes.get_CampaignHistoryDetails.REQUEST));
        fetch(`${GET_CAMPAIGN_HISTORY_DETAILS_API}/${id}`, {
            method: 'GET',
            headers: jsonApiHeader('', true),
            // body: JSON.stringify(postData)
        })
            .then(checkHttpStatus)
            .then(function (response) {
                if(response.success) {
                    dispatch(actionCreator(CampaignActionTypes.get_CampaignHistoryDetails.SUCCESS, response.data));
                }else{
                    dispatch(actionCreator(CampaignActionTypes.get_CampaignHistoryDetails.FAILURE));
                    showError(search(response.errorCode)) 
                }
            })
            .catch(function (error) {
                dispatch(actionCreator(CampaignActionTypes.get_CampaignHistoryDetails.FAILURE));
                showError(search(error.errorCode) || "Some error occurred")
            });
    };
};

export const PutCampaignStage = (postData, id, type, history) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(CampaignActionTypes.put_CampaignStage.REQUEST));
        fetch(`${PUT_CAMPAIGN_STAGE_API}/${id}`, {
            method: 'PUT',
            headers: jsonApiHeader('', true),
            body: JSON.stringify(postData)
        })
            .then(checkHttpStatus)
            .then(function (response) {
                if(response.success) {
                    dispatch(actionCreator(CampaignActionTypes.put_CampaignStage.SUCCESS, response.data));
                    // type === 'create' && history.push(`/dash/governance/campaign/details/${id}`)
                    history.push(`/dash/governance/campaign`)
                    showSuccess("Updated Successfully")
                }else{
                    dispatch(actionCreator(CampaignActionTypes.put_CampaignStage.FAILURE));
                    showError(search(response.errorCode)) 
                }
            })
            .catch(function (error) {
                dispatch(actionCreator(CampaignActionTypes.put_CampaignStage.FAILURE));
                showError(search(error.errorCode) || "Some error occurred")
            });
    };
};

export const PutCampaignDetails = (postData, id, history, setSaving, setChanged) => {
  return (dispatch, getState) => {
      setSaving(true)
      dispatch(actionCreator(CampaignActionTypes.put_CampaignDetails.REQUEST));
      fetch(`${POST_CAMPAIGN_DETAILS_API}/${id}`, {
          method: 'PUT',
          headers: jsonApiHeader('', true),
          body: JSON.stringify(postData)
      })
          .then(checkHttpStatus)
          .then(function (response) {
              if(response.success) {
                  dispatch(actionCreator(CampaignActionTypes.put_CampaignDetails.SUCCESS, response.data));
                //   history.push(`/dash/governance/campaign/edit/${id}/scope`)
                  showSuccess("Updated Successfully")
              }else{
                  dispatch(actionCreator(CampaignActionTypes.put_CampaignDetails.FAILURE));
                  showError(search(response.errorCode))
              }
              setSaving(false)
              setChanged(false)
          })
          .catch(function (error) {
              dispatch(actionCreator(CampaignActionTypes.put_CampaignDetails.FAILURE));
              showError(search(error.errorCode) || "Some error occurred")
              setSaving(false)
          });
  };
};

export const GetAllCampaignList = (postData) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(CampaignActionTypes.get_AllCampaignLists.REQUEST));
        fetch(`${GET_ALL_CAMPAIGN_LIST_API}`, {
            method: 'POST',
            headers: jsonApiHeader('', true),
            body: JSON.stringify(postData)
        })
            .then(checkHttpStatus)
            .then(function (response) {
                if(response.success) {
                    dispatch(actionCreator(CampaignActionTypes.get_AllCampaignLists.SUCCESS, response.data));
                }else{
                    dispatch(actionCreator(CampaignActionTypes.get_AllCampaignLists.FAILURE));
                    showError(search(response.errorCode)) 
                }
            })
            .catch(function (error) {
                dispatch(actionCreator(CampaignActionTypes.get_AllCampaignLists.FAILURE));
                showError(search(error.errorCode) || "Some error occurred")
            });
    };
};

export const PutCampaignPublish = (id, filters) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(CampaignActionTypes.put_CampaignPublish.REQUEST));
        fetch(`${PUT_CAMPAIGN_PUBLISH_API}/${id}`, {
            method: 'PUT',
            headers: jsonApiHeader('', true),
            // body: JSON.stringify(postData)
        })
            .then(checkHttpStatus)
            .then(function (response) {
                if(response.success) {
                    dispatch(actionCreator(CampaignActionTypes.put_CampaignPublish.SUCCESS, response.data));
                    showSuccess("Campaign published successfully")
                    dispatch(GetAllCampaignList(filters))
                }else{
                    dispatch(actionCreator(CampaignActionTypes.put_CampaignPublish.FAILURE));
                    showError(search(response.errorCode)) 
                }
            })
            .catch(function (error) {
                dispatch(actionCreator(CampaignActionTypes.put_CampaignPublish.FAILURE));
                showError(search(error.errorCode) || "Some error occurred")
            });
    };
};

export const PutManualStart = (id, filters) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(CampaignActionTypes.put_CampaignManualStart.REQUEST));
        fetch(`${PUT_CAMPAIGN_MANUAL_START_API}/${id}`, {
            method: 'PUT',
            headers: jsonApiHeader('', true),
            // body: JSON.stringify(postData)
        })
            .then(checkHttpStatus)
            .then(function (response) {
                if(response.success) {
                    dispatch(actionCreator(CampaignActionTypes.put_CampaignManualStart.SUCCESS, response.data));
                    showSuccess("Campaign start initiated successfully")
                    dispatch(GetAllCampaignList(filters))
                }else{
                    dispatch(actionCreator(CampaignActionTypes.put_CampaignManualStart.FAILURE));
                    showError(search(response.errorCode)) 
                }
            })
            .catch(function (error) {
                dispatch(actionCreator(CampaignActionTypes.put_CampaignManualStart.FAILURE));
                showError(search(error.errorCode) || "Some error occurred")
            });
    };
};

export const PutManualStop = (id, filters) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(CampaignActionTypes.put_CampaignManualStop.REQUEST));
        fetch(`${PUT_CAMPAIGN_MANUAL_STOP_API}/${id}`, {
            method: 'PUT',
            headers: jsonApiHeader('', true),
            // body: JSON.stringify(postData)
        })
            .then(checkHttpStatus)
            .then(function (response) {
                if(response.success) {
                    dispatch(actionCreator(CampaignActionTypes.put_CampaignManualStop.SUCCESS, response.data));
                    showSuccess("Campaign stop initiated successfully")
                    dispatch(GetAllCampaignList(filters))
                }else{
                    dispatch(actionCreator(CampaignActionTypes.put_CampaignManualStop.FAILURE));
                    showError(search(response.errorCode)) 
                }
            })
            .catch(function (error) {
                dispatch(actionCreator(CampaignActionTypes.put_CampaignManualStop.FAILURE));
                showError(search(error.errorCode) || "Some error occurred")
            });
    };
};

export const PostCampaignHistoryList = (postData) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(CampaignActionTypes.post_CampaignHistoryList.REQUEST));
        fetch(`${POST_CAMPAIGN_HISTORY_LIST_API}`, {
            method: 'POST',
            headers: jsonApiHeader('', true),
            body: JSON.stringify(postData)
        })
            .then(checkHttpStatus)
            .then(function (response) {
                if(response.success) {
                    dispatch(actionCreator(CampaignActionTypes.post_CampaignHistoryList.SUCCESS, response.data));
                    // showSuccess(response.message)
                }else{
                    dispatch(actionCreator(CampaignActionTypes.post_CampaignHistoryList.FAILURE));
                    showError(search(response.errorCode)) 
                }
            })
            .catch(function (error) {
                dispatch(actionCreator(CampaignActionTypes.post_CampaignHistoryList.FAILURE));
                showError(search(error.errorCode) || "Some error occurred")
            });
    };
};

export const PostCampaignAssignmentList = (postData, id) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(CampaignActionTypes.post_CampaignAssignmentList.REQUEST));
        fetch(`${POST_CAMPAIGN_ASSIGNMENT_LIST_API}/${id}`, {
            method: 'POST',
            headers: jsonApiHeader('', true),
            body: JSON.stringify(postData)
        })
            .then(checkHttpStatus)
            .then(function (response) {
                if(response.success) {
                    dispatch(actionCreator(CampaignActionTypes.post_CampaignAssignmentList.SUCCESS, response.data));
                    // showSuccess(response.message)
                }else{
                    dispatch(actionCreator(CampaignActionTypes.post_CampaignAssignmentList.FAILURE));
                    showError(search(response.errorCode)) 
                }
            })
            .catch(function (error) {
                dispatch(actionCreator(CampaignActionTypes.post_CampaignAssignmentList.FAILURE));
                showError(search(error.errorCode) || "Some error occurred")
            });
    };
};

export const PostCampaignAssignmentHistoryList = (postData, id) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(CampaignActionTypes.post_CampaignAssignmentHistoryList.REQUEST));
        fetch(`${POST_CAMPAIGN_ASSIGNMENT_HISTORY_LIST_API}/${id}`, {
            method: 'POST',
            headers: jsonApiHeader('', true),
            body: JSON.stringify(postData)
        })
            .then(checkHttpStatus)
            .then(function (response) {
                if(response.success) {
                    dispatch(actionCreator(CampaignActionTypes.post_CampaignAssignmentHistoryList.SUCCESS, response.data));
                    // showSuccess(response.message)
                }else{
                    dispatch(actionCreator(CampaignActionTypes.post_CampaignAssignmentHistoryList.FAILURE));
                    showError(search(response.errorCode)) 
                }
            })
            .catch(function (error) {
                dispatch(actionCreator(CampaignActionTypes.post_CampaignAssignmentHistoryList.FAILURE));
                showError(search(error.errorCode) || "Some error occurred")
            });
    };
};

export const GetCampaignScope = (id) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(CampaignActionTypes.get_CampaignScope.REQUEST));
        fetch(`${GET_CAMPAIGN_SCOPE_API}/${id}`, {
            method: 'GET',
            headers: jsonApiHeader('', true),
            // body: JSON.stringify(postData)
        })
            .then(checkHttpStatus)
            .then(function (response) {
                if(response.success) {
                    let obj = {...response.data};
                    obj.allUsers = response.data.allUsers ? true : false
                    dispatch(actionCreator(CampaignActionTypes.get_CampaignScope.SUCCESS, obj));
                }else{
                    dispatch(actionCreator(CampaignActionTypes.get_CampaignScope.FAILURE));
                    showError(search(response.errorCode)) 
                }
            })
            .catch(function (error) {
                dispatch(actionCreator(CampaignActionTypes.get_CampaignScope.FAILURE));
                showError(search(error.errorCode) || "Some error occurred")
            });
    };
};

export const PostCampaignScope = (postData, id, history, type, setSaving, setChanged) => {
    return (dispatch, getState) => {
        setSaving(true)
        dispatch(actionCreator(CampaignActionTypes.post_CampaignScope.REQUEST));
        fetch(`${GET_CAMPAIGN_SCOPE_API}/${id}`, {
            method: 'PUT',
            headers: jsonApiHeader('', true),
            body: JSON.stringify(postData)
        })
            .then(checkHttpStatus)
            .then(function (response) {
                if(response.success) {
                    dispatch(actionCreator(CampaignActionTypes.post_CampaignScope.SUCCESS, response.data));
                    type !== 'edit' && history.push(`/dash/governance/campaign/create/${id}/stage`)
                    showSuccess("Scope Updated Successfully")
                }else{
                    dispatch(actionCreator(CampaignActionTypes.post_CampaignScope.FAILURE));
                    showError(search(response.errorCode)) 
                }
                setSaving(false)
                setChanged(false)
            })
            .catch(function (error) {
                dispatch(actionCreator(CampaignActionTypes.post_CampaignScope.FAILURE));
                showError(search(error.errorCode) || "Some error occurred")
                setSaving(false)
            });
    };
};

export const PostCampaignActiveSummary = (postData, body) => {
  return (dispatch, getState) => {
      dispatch(actionCreator(CampaignActionTypes.post_CampaignActiveSummary.REQUEST));
      fetch(`${POST_CAMPAIGN_ACTIVE_SUMMARY}`, {
          method: 'POST',
          headers: jsonApiHeader('', true),
          body: JSON.stringify(postData)
      })
          .then(checkHttpStatus)
          .then(function (response) {
              if(response.success) {
                  dispatch(actionCreator(CampaignActionTypes.post_CampaignActiveSummary.SUCCESS, response.data));
                  // showSuccess(response.message)
                  body.filter.campaignExecutionId = response.data.content[0].executionId
                  dispatch(PostCampaignActiveAssignments(body))

              }else{
                  dispatch(actionCreator(CampaignActionTypes.post_CampaignActiveSummary.FAILURE));
                  showError(search(response.errorCode)) 
              }
          })
          .catch(function (error) {
              dispatch(actionCreator(CampaignActionTypes.post_CampaignActiveSummary.FAILURE));
              showError(search(error.errorCode) || "Some error occurred")
          });
  };
};

export const PostCampaignActiveAssignments = (postData) => {
  return (dispatch, getState) => {
      dispatch(actionCreator(CampaignActionTypes.post_CampaignActiveAssignments.REQUEST));
      fetch(`${POST_CAMPAIGN_ACTIVE_ASSIGNMENTS}`, {
          method: 'POST',
          headers: jsonApiHeader('', true),
          body: JSON.stringify(postData)
      })
          .then(checkHttpStatus)
          .then(function (response) {
              if(response.success) {
                  dispatch(actionCreator(CampaignActionTypes.post_CampaignActiveAssignments.SUCCESS, response.data));
                  // showSuccess(response.message)
              }else{
                  dispatch(actionCreator(CampaignActionTypes.post_CampaignActiveAssignments.FAILURE));
                  showError(search(response.errorCode)) 
              }
          })
          .catch(function (error) {
              dispatch(actionCreator(CampaignActionTypes.post_CampaignActiveAssignments.FAILURE));
              showError(search(error.errorCode) || "Some error occurred")
          });
  };
};

export const PostCampaignHistorySummary = (postData, body) => {
  return (dispatch, getState) => {
      dispatch(actionCreator(CampaignActionTypes.post_CampaignHistorySummary.REQUEST));
      fetch(`${POST_CAMPAIGN_HISTORY_SUMMARY}`, {
          method: 'POST',
          headers: jsonApiHeader('', true),
          body: JSON.stringify(postData)
      })
          .then(checkHttpStatus)
          .then(function (response) {
              if(response.success) {
                  dispatch(actionCreator(CampaignActionTypes.post_CampaignHistorySummary.SUCCESS, response.data));
                  // showSuccess(response.message)
                  body.filter.campaignExecutionId = response.data.content[0].executionId
                  dispatch(PostCampaignHistoryAssignments(body))

              }else{
                  dispatch(actionCreator(CampaignActionTypes.post_CampaignHistorySummary.FAILURE));
                  showError(search(response.errorCode)) 
              }
          })
          .catch(function (error) {
              dispatch(actionCreator(CampaignActionTypes.post_CampaignHistorySummary.FAILURE));
              showError(search(error.errorCode) || "Some error occurred")
          });
  };
};

export const PostCampaignHistoryAssignments = (postData) => {
  return (dispatch, getState) => {
      dispatch(actionCreator(CampaignActionTypes.post_CampaignHistoryAssignments.REQUEST));
      fetch(`${POST_CAMPAIGN_HISTORY_ASSIGNMENTS}`, {
          method: 'POST',
          headers: jsonApiHeader('', true),
          body: JSON.stringify(postData)
      })
          .then(checkHttpStatus)
          .then(function (response) {
              if(response.success) {
                  dispatch(actionCreator(CampaignActionTypes.post_CampaignHistoryAssignments.SUCCESS, response.data));
                  // showSuccess(response.message)
              }else{
                  dispatch(actionCreator(CampaignActionTypes.post_CampaignHistoryAssignments.FAILURE));
                  showError(search(response.errorCode)) 
              }
          })
          .catch(function (error) {
              dispatch(actionCreator(CampaignActionTypes.post_CampaignHistoryAssignments.FAILURE));
              showError(search(error.errorCode) || "Some error occurred")
          });
  };
};

export const ClearCampaignDetails = () => ({
    type: CampaignActionTypes.clear_CampaignDetails.SUCCESS
})

export const ClearCampaignStage = () => ({
  type: CampaignActionTypes.clear_CampaignStage.SUCCESS
})

export const clearCampaignAssignmentList = () => ({
    type: CampaignActionTypes.clear_CampaignAssignmentList.SUCCESS,
})

export const clearCampaignHistoryDetails = () => ({
    type: CampaignActionTypes.clear_CampaignHistoryDetails.SUCCESS,
})

export const clearCampaignAssignmentHistoryList = () => ({
    type: CampaignActionTypes.clear_CampaignAssignmentHistoryList.SUCCESS,
})

export const clearCampaignScope = () => ({
    type: CampaignActionTypes.clear_CampaignScope.SUCCESS,
})

export const clearCampaignHistory = () => ({
    type: CampaignActionTypes.clear_CampaignHistoryList.SUCCESS,
})

export const clearCampaignActiveSummary = () => ({
  type: CampaignActionTypes.clear_CampaignActiveSummary.SUCCESS,
})

export const clearCampaignActiveAssignments = () => ({
  type: CampaignActionTypes.clear_CampaignActiveAssignments.SUCCESS,
})

export const clearCampaignHistorySummary = () => ({
  type: CampaignActionTypes.clear_CampaignHistorySummary.SUCCESS,
})

export const clearCampaignHistoryAssignments = () => ({
  type: CampaignActionTypes.clear_CampaignHistoryAssignments.SUCCESS,
})


import { callApi } from "../../../../../../utils/api";

export const getAttributeList = async () => {
  let data;
  try {
    data = await callApi("/rulesrvc/rule/provision/attributeList");
  } catch (error) {
    console.log(error);
  }
  if (data && data.data) {
    return data.data;
  }
};
export const getSelectedAttributeList = async (servicename, serviceUrl) => {
  let data;
  try {
    data = await callApi(`/${servicename}${serviceUrl}`);
  } catch (error) {
    console.log(error);
  }
  if (data && data.data) {
    return data.data;
  }
};

export const setExecuteCondition = async (ruleId, postData) => {
  try {
    await callApi(
      `/rulesrvc/rule/provision/changeConditionApplied/${ruleId}`,
      "PUT",
      postData
    );
  } catch (error) {
    console.log(error);
  }
};

export const saveNewProvisionRuleCondition = async (postData) => {
  let data;
  try {
    data = await callApi(
      "/rulesrvc/rule/provision/condition/create",
      "POST",
      postData
    );
  } catch (error) {
    console.log(error);
  }
  return data;
};

export const getConditionRuleList = async (ruleId, query) => {
  let data;
  try {
    data = await callApi(
      `/rulesrvc/rule/provision/condition/conditionList/${ruleId}?pageNo=${query.pageNo}&size=${query.size}&sortBy=${query.sortBy}&order=${query.order}`
    );
  } catch (error) {
    console.log(error);
  }
  if (data && data.data) {
    return data.data;
  }
};

export const changeRuleConditionStatus = async (ruleId, postData) => {
  let data;
  try {
    data = await callApi(
      `/rulesrvc/rule/provision/condition/changeStatus/${ruleId}/${postData}`,
      "PUT"
    );
  } catch (error) {
    console.log(error);
  }
  return data;
};

export const getApplicationData = async () => {
  let postdata = {
    displayName: "",
    order: "desc",
    pageNo: 0,
    size: 20,
    sortBy: "displayName",
    tag: "",
  };
  let data;
  try {
    data = await callApi(
      "/provsrvc/applicationTenant/applicationListByPage",
      "POST",
      postdata
    );
  } catch (error) {
    console.log(error);
  }
  if (data && data.data) {
    return data.data;
  }
};

export const getApplicationRoles = async (id) => {
  let data;
  try {
    data = await callApi(`/provsrvc/applicationRole/findByApplicationId/${id}`);
  } catch (error) {
    console.log(error);
  }
  if (data && data.data) {
    return data.data;
  }
};

export const saveNewProvisionRuleApplication = async (ruleId, postData) => {
  let data;
  try {
    data = await callApi(
      `/rulesrvc/rule/provision/addApplication/${ruleId}`,
      "POST",
      postData
    );
  } catch (error) {
    console.log(error);
  }
  return data;
};

export const getApplicationRuleList = async (ruleId) => {
  let data;
  try {
    data = await callApi(
      `/rulesrvc/rule/provision/applicationForRule/${ruleId}`
    );
  } catch (error) {
    console.log(error);
  }
  if (data && data.data) {
    return data.data;
  }
};

export const removeConditionRule = async (ruleId) => {
  let data;
  try {
    data = await callApi(
      `/rulesrvc/rule/provision/condition/conditionDelete/${ruleId}`,
      "DELETE"
    );
  } catch (error) {
    console.log(error);
  }
  return data;
};

export const removeApplicationRule = async (ruleId, appId) => {
  let data;
  try {
    data = await callApi(
      `/rulesrvc/rule/provision/removeApplication/${ruleId}/${appId}`,
      "DELETE"
    );
  } catch (error) {
    console.log(error);
  }
  return data;
};

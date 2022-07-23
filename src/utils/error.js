export const errors = [
  // AUTH Module
  {
    key: 'REGSRVC.UNKNOWN',
    value: 'Error. Please try again later or contact Cymmetri Administrator.'
  },
  {
    key: 'REGSRVC.USER_NOT_FOUND',
    value: 'User not found.'
  },
  {
    key: 'REGSRVC.INVALID_ARGUMENTS',
    value: 'Error. Please correct input and try again.'
  },
  {
    key: 'REGSRVC.INVALID_DOMAIN',
    value: 'Invalid Domain. Please try again.'
  },
  {
    key: 'REGSRVC.INVALID_CREDENTIALS',
    value: 'Invalid Credentials. Please try again.'
  },
  {
    key: 'REGSRVC.TERMS_AND_CONDITIONS_NOT_FOUND	',
    value: 'Invalid Terms & Conditions. Please try again.'
  },
  {
    key: 'REGSRVC.INVALID_ACCOUNT_VERIFICATION_TOKEN',
    value: 'Invalid request. Contact Cymmetri administrator.'
  },
  {
    key: 'REGSRVC.DATA_IS_NOT_VALID',
    value: 'Invalid data. Please try again.'
  },
  {
    key: 'REGSRVC.PASSWORD_NOT_VALID',
    value: 'Invalid password. Please try again'
  },
  {
    key: 'REGSRVC.EMAIL_EXISTS',
    value: 'Duplicate Email Address. Please try again.'
  },
  {
    key: 'REGSRVC.DOMAIN_EXISTS',
    value: 'Duplicate Domain.'
  },
  {
    key: 'REGSRVC.DB_CONFIG_EXISTS',
    value: 'Database already exists. Contact Cymmetri administrator.'
  },
  {
    key: 'REGSRVC.USER_ALREADY_ACTIVE',
    value: 'User status is active. Contact Cymmetri administrator.'
  },
  // USER MODULE
  {
    key: 'USRSRVC.MANAGER_NOT_FOUND',
    value: 'No Manager Found'
  },
  {
    key: 'USRSRVC.UNSUPPORTED_FILE_TYPE',
    value: 'Unsupported File Type'
  },
  {
    key: 'USRSRVC.UNKNOWN',
    value: 'Error. Please try again later or contact Cymmetri Administrator.'
  },
  {
    key: 'USRSRVC.INVALID_ARGUMENTS',
    value: 'Error. Please correct input and try again.'
  },
  {
    key: 'USRSRVC.NONUNIQUE_GROUPNAME',
    value: 'Group name already exisits. Please try again.'
  },
  {
    key: 'USRSRVC.GROUPTYPE_NOT_FOUND',
    value: 'Group type not found. Contact Cymmetri administrator.'
  },
  {
    key: 'USRSRVC.OU_NOT_FOUND',
    value: 'Organization Unit not found. Please try again.'
  },
  {
    key: 'USRSRVC.PARENTGROUP_NOT_FOUND',
    value: 'Parent Group not found. Please try again.'
  },
  {
    key: 'USRSRVC.GROUP_NOT_FOUND',
    value: 'Group not found. Please try again.'
  },
  {
    key: 'USRSRVC.USER_NOT_FOUND',
    value: 'User not found. Please try again.'
  },
  {
    key: 'USRSRVC.CYCLIC_UPDATE',
    value: 'Operation not allowed for current input.'
  },
  {
    key: 'USRSRVC.INHERITED_GROUP',
    value: 'Operation not allowed for current input.'
  },
  {
    key: 'USRSRVC.USERTYPE_NOT_FOUND',
    value: 'User type not found. Please try again.'
  },
  {
    key: 'USRSRVC.EXISTING_MOBILE',
    value: 'User mobile number in use. Please try again.'
  },
  {
    key: 'USRSRVC.EXISTING_EMAIL',
    value: 'User email address in use. Please try again.'
  },
  {
    key: 'USRSRVC.DEPARTMENT_NOT_FOUND',
    value: 'Department not found. Please try again.'
  },
  {
    key: 'USRSRVC.DESIGNATION_NOT_FOUND',
    value: 'Designation not found. Please try again.'
  },
  {
    key: 'USRSRVC.COUNTRY_NOT_FOUND',
    value: 'Country not found. Please try again.'
  },
  {
    key: 'USRSRVC.EXISTING_LOGIN',
    value: 'User Login ID in use. Please try again.'
  },
  {
    key: 'USRSRVC.APPLICATION_NOT_FOUND',
    value: 'Application not found. Please try again.'
  },
  {
    key: 'USRSRVC.APPLICATION_ROLE_NOT_FOUND',
    value: 'Application role not found. Please try again.'
  },
  
  {
    key: 'PROVSRVC.APPLICATION_TEST_FAILED',
    value: 'Provision Configuration failed.'
  },
  {
    key: 'USRSRVC.USER_NOT_PROVISIONED',
    value: 'User not provisioned. Please try again.'
  },
  {
    key: 'USRSRVC.CHILD_GROUP_FOUND',
    value: 'Cannot Delete as Child group found.'
  },
  {
    key: 'USRSRVC.GROUP_HAS_ASSIGNED_APPS',
    value: 'Group has assigned applications. Remove and try again.'
  },
  {
    key: 'USRSRVC.USER_ASSIGNED_GROUP',
    value: 'Cannot delete as User assigned to group.'
  },
  {
    key: 'USRSRVC.INACTIVE_USER',
    value: 'Inactive User cannot perform this action.'
  },
  {
    key: 'USRSRVC.INVALID_MANAGER',
    value: 'Invalid manager.'
  },
  {
    key: 'USRSRVC.MIN_ORG_ADMIN_RULE_VIOLATION',
    value: 'Admin role cannot be removed for this user.'
  },
  {
    key: 'USRSRVC.USER_ROLE_MAPPING_EXISTS',
    value: 'Role Already Exists.'
  },
  {
    key: 'USRSRVC.APPLICATION_ROLE_ALREADY_ASSIGNED',
    value: 'Application role is already assigned.'
  },
  {
    key: 'USRSRVC.APPLICATION_ALREADY_ASSIGNED',
    value: 'Application is already assigned.'
  },
  {
    key: 'USRSRVC.USER_ROLE_MAPPING_NOT_EXISTS',
    value: 'User role mapping does not exists.'
  },
  {
    key: 'USRSRVC.CANNOT_REMOVE_PROVISIONED_APPLICATION',
    value: 'Cannot remove already provisioned application.'
  },
  {
    key: 'USRSRVC.EMPTY_FILE',
    value: 'Empty file uploaded.'
  },
  {
    key: 'USRSRVC.MANAGER_NOT_FOUND',
    value: 'Manager is Inactive.'
  },
  // AUTHSRVC
  {
    key: 'AUTHSRVC.ACCESS_DENIED',
    value: 'Invalid Credentials.'
  },
  {
    key: 'AUTHSRVC.UNKNOWN',
    value: 'Error. Please try again later or contact Cymmetri Administrator.'
  },
  {
    key: 'AUTHSRVC.INVALID_TOKEN',
    value: 'Token is invalid.'
  },
  {
    key: 'AUTHSRVC.USER_NOT_FOUND',
    value: 'User not found.'
  },
  {
    key: 'AUTHSRVC.CANT_SET_FALSE_DEFAULT_PASSWORD_POLICY',
    value: 'Default password policy cannot be false.'
  },
  {
    key: 'AUTHSRVC.CONNECTION_FAILED',
    value: 'Connection failed.'
  },
  {
    key: 'AUTHSRVC.CANT_DELETE_DEFAULT_PASSWORD_POLICY',
    value: 'Cannot delete default password policy.'
  },
  {
    key: 'AUTHSRVC.INVALID_ARGUMENTS',
    value: 'Invalid argument.'
  },
  {
    key: 'AUTHSRVC.INVALID_AUTH_POLICY_CONFIG',
    value: 'Invalid auth policy config.'
  },
  {
    key: 'AUTHSRVC.ACCESS_DENIED_TOKEN',
    value: 'Session expired. Please login again'
  },
  {
    key: 'AUTHSRVC.NON_REMOVABLE_REFERENCED_ENTITY',
    value: 'Cannot modify IDP configuration till active under Authentication Policy.'
  },
  {
    key: 'AUTHSRVC.PASSWORD_POLICY_NAME_ALRAEDY_EXISTS',
    value: 'Password policy name already exists.'
  },
  {
    key: 'AUTHSRVC.DEFAULT_POLICY_UPDATE_NOT_ALLOWED',
    value: 'Default password policy update not allowed.'
  },
  //  MFASRVC
  {
    key: 'MFASRVC.UNKNOWN',
    value: 'Error. Please try again.'
  },
  {
    key: 'MFASRVC.USER_NOT_FOUND',
    value: 'User not found. Please try again.'
  },
  {
    key: 'MFASRVC.ALREADY_SENT_SMS_OTP',
    value: 'SMS OTP already sent.'
  },
  {
    key: 'MFASRVC.INVALID_SMS_OTP',
    value: 'Invalid SMS OTP provided.'
  },
  {
    key: 'MFASRVC.MFA_CONFIG_NOT_FOUND',
    value: 'Multi Factor Authentication configuration not found.'
  },
  {
    key: 'MFASRVC.INVALID_ARGUMENTS',
    value: 'Error. Invalid request.'
  },
  {
    key: 'MFASRVC.QUESTION_NOT_FOUND',
    value: 'Question not found.'
  },
  {
    key: 'MFASRVC.DUPLICATE_QUESTION',
    value: 'Question field is duplicate. Please try again.'
  },
  {
    key: 'MFASRVC.INCORRECT_ANSWER',
    value: 'Answer field is incorrect. Please try again.'
  },
  {
    key: 'MFASRVC.INVALID_USERID',
    value: 'Invalid User. Please try again.'
  },
  {
    key: 'MFASRVC.INVALID_QUESTIONID',
    value: 'Question is invalid. Please try again.'
  },
  {
    key: 'MFASRVC.USER_NOT_REGISTERED',
    value: 'User is not registered for TOTP/Push Authentication'
  },
  {
    key: 'MFASRVC.EMPTY_QUESTION',
    value: 'Question field is empty. Please try again.'
  },
  {
    key: 'MFASRVC.FAILED_MINIMUM_CORRECT_ANSWER',
    value: 'Please provide correct answer for each question.'
  },
  {
    key: 'MFASRVC.INVALID_TOTP',
    value: 'Invalid Time based OTP provided.'
  },
  {
    key: 'MFASRVC.INVALID_ANSWER',
    value: 'Answer field is invalid. Please try again.'
  },
  {
    key: 'MFASRVC.QUESTION_NOT_REGISTERED',
    value: 'Question is not registered.'
  },
  {
    key: 'MFASRVC.NON_REMOVABLE_QUESTION',
    value: 'Question in use and cannot be removed.'
  },
  // WKFLSRVC
  {
    key: 'WKFLSRVC.UNKNOWN',
    value: 'Please contact system administrator.'
  },
  {
    key: 'WKFLSRVC.WORKFLOW_NOT_FOUND',
    value: 'No workflow available.'
  },
  {
    key: 'WKFLSRVC.INVALID_ARGUMENTS',
    value: 'Invalid argument.'
  },
  {
    key: 'WKFLSRVC.INVALID_LEVEL',
    value: 'Workflow configuration issue.'
  },
  {
    key: 'WKFLSRVC.EXCEEDED_REPORTING_MANAGER',
    value: 'Application cannot have more than one reporting manager.'
  },
  {
    key: 'WKFLSRVC.WORKFLOW_SETUP_NOT_FOUND',
    value: 'Workflow configuration issue.'
  },
  {
    key: 'WKFLSRVC.REQUESTOR_NOT_FOUND',
    value: 'No requestor found.'
  },
  {
    key: 'WKFLSRVC.WORKFLOW_IN_PROGESS',
    value: 'Approval in progress.'
  },
  {
    key: 'WKFLSRVC.REPORTING_MANAGER_NOT_FOUND',
    value: 'No manager found.'
  },
  {
    key: 'WKFLSRVC.LEVEL_NOT_IN_RANGE',
    value: 'Workflow level is not in range.'
  },
  {
    key: 'WKFLSRVC.WORKFLOW_SETUP_ALREADY_EXISTS',
    value: 'Workflow setup already exists.'
  },
  {
    key: 'WKFLSRVC.COMMON_REQ_ASSG_ID',
    value: 'Request for approval has gone to concerned approval manager.'
  },
  {
    key: 'WKFLSRVC.SAME_REQUESTOR_ASSIGNEE',
    value: 'Workflow cannot be assigned to same user.'
  },
  // SSOCONFIGSRVC
  {
    key: 'SSOCONFIGSRVC.UNKNOWN',
    value: 'Error. Please try again.'
  },
  {
    key: 'SSOCONFIGSRVC.SSO_CONFIG_NOT_FOUND',
    value: 'SSO config not found.'
  },
  {
    key: 'SSOCONFIGSRVC.SAML_CONFIG_NOT_FOUND',
    value: 'Saml config not found.'
  },
  {
    key: 'SSOCONFIGSRVC.OPENID_CLIENT_NOT_FOUND',
    value: 'OpenID config not found.'
  },
  {
    key: 'SSOCONFIGSRVC.DUPLICATE_OPENID_CLIENT_ID',
    value: 'Duplicate OpenID Client ID.'
  },
  {
    key: 'SSOCONFIGSRVC.API_CONFIG_NOT_FOUND',
    value: 'API config not found.'
  },
  // UTILSRVC
  {
    key: 'UTILSRVC.UNKNOWN',
    value: 'Error. Please try again.'
  },
  {
    key: 'UTILSRVC.INVALID_ARGUMENTS',
    value: 'Error. Please correct input and try again.'
  },
  {
    key: 'UTILSRVC.CONFIGURATION_EXIST',
    value: 'Hook already present.'
  },
  {
    key: 'UTILSRVC.ALREADY_EXISTS',
    value: 'Hook already present.'
  },
  {
    key: 'UTILSRVC.META_ATTRIBUTE_EXISTS',
    value: 'Name/Key or Value already exist.'
  },
  // PROVSRVC
  {
    key: 'PROVSRVC.UNKNOWN',
    value: 'Error. Please try again later or contact Cymmetri Administrator.'
  },
  {
    key: 'PROVSRVC.USER_NOT_FOUND',
    value: 'User not found.'
  },
  {
    key: 'PROVSRVC.INVALID_ARGUMENTS',
    value: 'Error. Please correct input and try again.'
  },
  {
    key: 'PROVSRVC.APPLICATION_NOT_FOUND',
    value: 'Application not found. Please try again.'
  },
  {
    key: 'PROVSRVC.INVALID_USER_ACTION',
    value: 'User action not allowed. Please check configuration.'
  },
  {
    key: 'PROVSRVC.INVALID_GROUP_ACTION',
    value: 'Group action not allowed. Please check configuration.'
  },
  {
    key: 'PROVSRVC.INVALID_ROLE_ACTION',
    value: 'Role action not allowed. Please check configuration.'
  },
  {
    key: 'PROVSRVC.INAVLID_ACTION',
    value: 'Error. Please try again.'
  },
  {
    key: 'PROVSRVC.UID_NOT_FOUND',
    value: 'Record not found. Please try again.'
  },
  {
    key: 'PROVSRVC.Empty_Role_Id',
    value: 'Role not provided. Please try again.'
  },
  {
    key: 'PROVSRVC.Duplicate_GroupID',
    value: 'Duplicate Group association.'
  },
  {
    key: 'PROVSRVC.Invalid_GroupId',
    value: 'Invalid Group association.'
  },
  {
    key: 'PROVSRVC.CONNECTOR_NOT_FOUND',
    value: 'Connector not available. Please contact Cymmetri administrator.'
  },
  {
    key: 'PROVSRVC.UNSUPPORTED_OPERATION',
    value: 'Operation not supported.'
  },
  {
    key: 'PROVSRVC.APPLICATION_ALREADY_EXISTS',
    value: 'Application already exists.'
  },
  {
    key: 'PROVSRVC.INVALID_POLICYATTRIBUTE_ID',
    value: 'Invalid Policy configuration. Please try again.'
  },
  {
    key: 'PROVSRVC.DUPLICATE_POLICYATTRIBUTE',
    value: 'Duplicate Policy attribute selected.'
  },
  {
    key: 'PROVSRVC.INVALID_POLICY_MAP',
    value: 'Invalid Policy map.'
  },
  {
    key: 'PROVSRVC.INVALID_MASTER_AAPPLICATION_Id',
    value: 'Invalid master application reference.'
  },
  {
    key: 'PROVSRVC.NO_MAPPING_FOUND',
    value: 'Policy map not found.'
  },
  {
    key: 'PROVSRVC.DUPLICATE_POLICY_MAPPING',
    value: 'Duplicate Policy mapping.'
  },
  {
    key: 'PROVSRVC.INAVLID_POLICYATTRIBUTE_APPLICATION',
    value: 'Invalid Policy association. Please try again.'
  },
  {
    key: 'PROVSRVC.PROVISIONING_NOT_ENABLE',
    value: 'Provisioning not enable'
  },
  {
    key: 'PROVSRVC.DUPLICATE_ROLE',
    value: 'Role ID in use. Please try again.'
  },
  {
    key: 'PROVSRVC.DUPPLICATE_NAME',
    value: 'Name already in use.'
  },
  // RULESRVC
  {
    key: 'RULESRVC.UNKNOWN',
    value: 'Error. Please try again.'
  },
  {
    key: 'RULESRVC.RULE_NOT_FOUND',
    value: 'Rule not found.'
  },
  {
    key: 'RULESRVC.RULE_CONDITION_NOT_FOUND',
    value: 'Rule condition not found.'
  },
  {
    key: 'RULESRVC.RULE_ACTION_GROUP_NOT_FOUND',
    value: 'No group associated with rule. Please try again.'
  },
  {
    key: 'RULESRVC.NON_REMOVABLE_REFERENCED_ENTITY',
    value: 'Cannot be modified as entity in use.'
  },
  {
    key: 'RULESRVC.ALRAEDY_EXISTS',
    value: 'Rule already exists.'
  },
  {
    key: 'RULESRVC.MULTIPLE_ZONES_FOUND',
    value: 'Multiple zones found.'
  },
  {
    key: 'RULESRVC.ZONE_NOT_FOUND',
    value: 'Zone not found.'
  },
  {
    key: 'RULESRVC.INVALID_ARGUMENTS',
    value: 'Error. Please try again.'
  },
  {
    key: 'RULESRVC.DEFAULT_RULE_NOT_FOUND',
    value: 'Default rule not found.'
  },

  //Governance
  {
    key: 'IGSRVC.UNKNOWN',
    value: 'Please try again.'  
  },
  {
    key: 'IGSRVC.INVALID_JWT',
    value: 'Invalid JWT token.'  
  },
  {
    key: 'IGSRVC.CAMPAIGN_COMPLETION_PERIOD_EXCEED',
    value: 'Campaign Completion Period Exceeded.'  
  },
  {
    key: 'IGSRVC.CAMPAIGN_STAGE_NOT_FOUND',
    value: 'Campaign Stage Not Found.'  
  },
  {
    key: 'IGSRVC.CAMPAIGN_SCOPE_NOT_FOUND',
    value: 'Campaign Scope Not Found.'  
  },
  {
    key: 'IGSRVC.CAMPAIGN_ALREADY_IN_DRAFT_STATE',
    value: 'Campaign Already In Draft State.'  
  },
  {
    key: 'IGSRVC.CAMPAIGN_ALREADY_IN_PUBLISHED_STATE',
    value: 'Campaign Already In Published State.'  
  },
  {
    key: 'IGSRVC.CAMPAIGN_EXECUTION_IN_PROGRESS',
    value: 'Campaign Execution in Progress.'  
  },
  {
    key: 'IGSRVC.CAMPAIGN_ASSIGNMENT_NOT_FOUND',
    value: 'Campaign Assignment Not Found.'  
  },
  {
    key: 'IGSRVC.CAMPAIGN_HISTORY_NOT_FOUND',
    value: 'Campaign History Not Found.'  
  },
  {
    key: 'IGSRVC.UNABLE_TO_PROCESS_RESPONSE',
    value: 'Unable To Process Response.'  
  },
  {
    key: 'IGSRVC.CAMPAIGN_ASSIGNMENT_APPLICATION_NOT_FOUND',
    value: 'Campaign Assignment Application Not Found.'  
  },
  {
    key: 'IGSRVC.CAMPAIGN_ASSIGNMENT_APPLICATION_ROLE_NOT_FOUND',
    value: 'Campaign Assignment Application Role Not Found.'  
  },
  {
    key: 'IGSRVC.APP_ROLE_ALREADY_PROCEED',
    value: 'App Role Already Proceeded.'  
  },
  {
    key: 'IGSRVC.INACTIVE_USER_FOUND',
    value: 'Inactive User Found.'  
  },
  {
    key: 'IGSRVC.NO_ACTIVE_EXECUTION_FOUND',
    value: 'No Active Execution Found.'  
  },
  {
    key: 'IGSRVC.INVALID_CRON_EXPRESSION',
    value: 'Invalid Cron Expression.'  
  },
  {
    key: 'IGSRVC.DUPLICATE_CAMPAIGNNAME',
    value: 'Duplicate Campaign Name.'  
  },
  {
    key: 'IGSRVC.CAMPAIGN_NOT_FOUND',
    value: 'Campaign not found.'
  },
  {
    key: 'IGSRVC.INVALID_ARGUMENTS',
    value: 'Please correct input and try again.'
  },
  {
    key: 'IGSRVC.CAMPAIGN_STATE_STARTED',
    value: 'Campaign State Already Started.'
  },
  {
    key: 'IGSRVC.STAGE_LIMIT_EXCEED',
    value: 'Stage Limit Exceeded.'
  },
  {
    key: 'IGSRVC.DUPLICATE_STAGE',
    value: 'Duplicate Stage.'
  },
  {
    key: 'IGSRVC.ASSIGNMENT_ALREADY_PROCEED',
    value: 'Assignment Already Proceeded.'
  },
  {
    key: 'IGSRVC.INVALID_CAMPAIGN_ITERATION',
    value: 'Invalid Campaign Iteration.'
  },
  {
    key: 'IGSRVC.INVALID_CAMPAIGN_MANAGER_ASSIGNEE',
    value: 'Campaign manager or assignee configured in stages are not valid.'
  },
  {
    key: 'IGSRVC.INVALID_CAMPAIGN_STATUS',
    value: 'Campaign execution in progress, operation not allowed.'
  },
  {
    key: 'IGSRVC.USER_WITH_NO_VALID_APPLICATION',
    value: 'No valid assignments found, aborted execution.'
  },
  {
    key: 'IGSRVC.CONNECTION_FAILED',
    value: 'Please check your internet connection.'
  },
  {
    key: 'IGSRVC.ALRAEDY_EXISTS',
    value: 'Record already exists.'
  },
  {
    key: 'IGSRVC.FORBIDDEN',
    value: 'Please contact system administrator.'
  },
  {
    key: 'IGSRVC.UNAUTHORIZED',
    value: 'Please contact system administrator.'
  },
  // IGPROCESS
  {
    key: 'IGPROCESS.UNKNOWN',
    value: 'Please try again.'
  },
  {
    key: 'IGPROCESS.INVALID_ARGUMENTS',
    value: 'Please correct input and try again.'
  },
  {
    key: 'IGPROCESS.CAMPAIGN_NOT_FOUND',
    value: 'Campaign Not Found.'
  },
  {
    key: 'IGPROCESS.NO_ACTIVE_EXECUTION_FOUND',
    value: 'No Active Execution Found.'
  },
  {
    key: 'IGPROCESS.CAMPAIGN_HISTORY_NOT_FOUND',
    value: 'Campaign History Not Found.'
  },
  {
    key: 'IGPROCESS.INVALID_CAMPAIGN_ITERATION',
    value: 'Invalid Campaign Iteration.'
  },
  {
    key: 'IGPROCESS.CAMPAIGN_EXECUTION_IN_PROGRESS',
    value: 'Campaign Execution In Progress.'
  },
  {
    key: 'IGPROCESS.MATCHING_ASSIGNMENTS_NOT_FOUND',
    value: 'Campaign criteria does not match any users.'
  },
  // SCHEDULER
  {
    key: 'SCHEDULER.UNKNOWN',
    value: 'Please try again.'
  },
  {
    key: 'SCHEDULER.TASK_NOT_FOUND',
    value: 'Task Not Found.'
  },
  {
    key: 'SCHEDULER.TASK_NOT_ACTIVE',
    value: 'Task Not Active.'
  },
  {
    key: 'SCHEDULER.INVALID_ARGUMENTS',
    value: 'Please correct input and try again.'
  },
  {
    key: 'SCHEDULER.INVALID_START_DATE',
    value: 'Invalid Start Date.'
  },
  {
    key: 'SCHEDULER.TENANT_NOT_FOUND',
    value: 'Tenant Not Found.'
  },
  {
    key: 'SCHEDULER.UPDATE_NOT_SUPPORTED',
    value: 'Update Is Not Supported.'
  },
  {
    key: 'SCHEDULER.CRON_REPETITION_BELOW_ALLOWED_LIMIT',
    value: 'Cron Repetition Is Below Allowed Limit.'
  },
  {
    key: 'SCHEDULER.INVALID_CRON_EXPRESSION',
    value: 'Invalid Cron Expression.'
  },
  // SODSRVC
  {
    key: 'SODSRVC.ALREADY_EXISTS',
    value: 'Error. Value Already Exists.'
  },
  {
    key: 'SODSRVC.INVALID_ARGUMENTS',
    value: 'Error. Please correct the input and try again.'
  },
]

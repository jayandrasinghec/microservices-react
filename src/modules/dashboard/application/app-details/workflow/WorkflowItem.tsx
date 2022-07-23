import React from "react";
import * as _ from "underscore";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import AppSelectInput from "../../../../../components/form/AppSelectInput";
import WorkflowSubRow from "./WorkflowSubRow";
import { callApi } from "../../../../../utils/api";
import { showSuccess } from "../../../../../utils/notifications";
import { isActiveForRoles } from "../../../../../utils/auth";
import { Context } from "@ag-grid-enterprise/all-modules";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
    maxHeight: 40,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  paperNo: {
    margin: "20px",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
  },
  grid: {
    padding: 1,
    backgroundColor: "#EEF1F8",
    borderRadius: "10px",
  },
  paperLevel: {},
  radio: {
    backgroundColor: "#e7e7e7",
    color: "#e7e7e7",
    marginLeft: "10px",
    marginRight: "10px",
    width: 24,
    height: 24,
  },
  mainDiv: {
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
    width: "100%",
    marginLeft: "10px",
    marginTop: "30px",
    marginRight: "10px",
    flex: 1,
  },
  textField: {
    backgroundColor: "#F7F7F7",
    width: 300,
  },
  label: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5,
  },
  input: {
    height: 40,
  },
  selectRoot: {
    height: 40,
    lineHeight: 2,
  },
  select: {
    lineHeight: "40px",
    height: 40,
    paddingTop: 0,
    paddingBottom: 0,
    verticalAlign: "middle",
  },
  saveButton: {
    margin: "0 10px 10px",
  },
  headerfour: {
    margin: "10px",
    padding: "10px",
    fontSize: 18,
  },
  levelheading: {
    margin: "30px 20px",
    fontSize: 16,
    color: "black",
  },
  leveldiv: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  appselect: {
    minWidth: "240px",
    marginRight: "20px",
    marginBottom: "5px",
  },
  infoicon: {
    marginRight: "15px",
  },
}));

interface IWorkflowSetup {
  id?: string;
  applicationId: string;
  level: number;
  workflowId: string;
  context: {
    [key: string]: {
      approverLevel: number;
      groupId?: string;
      userId?: string;
      reportingManager?: boolean;
    };
  };
}

interface IProps {
  title: string;
  appId: string;
  workflowId: string;
  data: IWorkflowSetup;
  onUpdate: (changes: any) => void;
  onSave: () => void;
  onAdd: () => void;
}

export default function WorkflowItem(props: IProps) {
  const classes = useStyles();
  const [workflow, setWorkflow] = React.useState<IWorkflowSetup>();
  const [flowDetail, setFlowDetail] = React.useState(false);
  const body = {
    applicationId: props.appId,
    workflowId: props.workflowId,
  };

  const [data, _setData] = React.useState<IWorkflowSetup>({
    applicationId: props.appId,
    level: 1,
    workflowId: props.workflowId,
    context: {},
  });
  React.useEffect(() => {
    getFlowDetail();
  }, [flowDetail]);
  const getFlowDetail = () => {
    callApi(
      `/workflowsrvc/api/workflowsetup/findByWorkflowAndAppId`,
      "POST",
      body
    ).then((e) => {
      if (e.success) {
        setWorkflow(e.data ? e.data : []);
        if (e.data.id) _setData({ ...data, ...e.data });
        else
          _setData({ ...data, context: e.data.context, level: e.data.level });
      }
    });
  }
  const [valid, setValid] = React.useState(false);
  React.useEffect(() => {
    var invCount = 0;
    levels.filter((l) => l <= data.level)
      .map((l: any) => {
        invCount = !(data.context ? data.context[l] ? (data.context[l].userId || data.context[l].groupId || data.context[l].reportingManager) : false : false) ? invCount + 1 : invCount;
      });

    if (invCount > 0) {
      setValid(false);
    } else {
      setValid(true);
    }
  }, [data])

  React.useEffect(() => {
    levels.filter((l) => l > data.level)
      .map((l: any) => {
        if (data.context && data.context[l]) {
          delete data.context[l];
        }
      });
    setHashRepoertingManager(_.values(data.context).some(
      (v) => !!v.reportingManager
    ));
  }, [data])

  const [updated, setUpdated] = React.useState(false);

  const createWorkflow = () => {
    callApi(`/workflowsrvc/api/workflowsetup`, "POST", data)
      .then(() => {
        showSuccess("Workflow setup has been created")
        setFlowDetail(!flowDetail);
      })
      .catch(() => setUpdated(false));
  };

  const updateWorkflow = () => {
    callApi(`/workflowsrvc/api/workflowsetup/${data.id}`, "PUT", data)
      .then(() => showSuccess("Workflow setup has been updated"))
      .catch(() => setUpdated(false));
  };

  const onSubmit = () => {
    if (!data.id) createWorkflow();
    else updateWorkflow();
    setUpdated(false);
  };

  const setData = (d: any) => {
    setUpdated(true);
    _setData({ ...data, ...d });
    // _setData({ ...data, ...d });
  };

  const updateRow = (row: any, index: number) => {
    data.context = data.context || {};
    data.context[index] = { ...row };
    setData(data);
  };

  const levels = [1, 2, 3, 4];
  var [hasReportingManager, setHashRepoertingManager] = React.useState(false);


  return (
    <div className={classes.grid}>
      <h4 className={classes.headerfour}>{props.title}</h4>
      <div className={classes.paperNo}>
        <div className={classes.levelheading}>Number of level(s)</div>
        <div className={classes.leveldiv}>
          <AppSelectInput
            label=""
            className={classes.appselect}
            value={data.level}
            options={levels}
            disabled={isActiveForRoles(['READ_ONLY'])}
            labels={["One", "Two", "Three", "Four"]}
            onChange={(e) => setData({ level: e.target.value ? e.target.value : null })}
          />
          <InfoOutlinedIcon className={classes.infoicon} />
        </div>
      </div>
      {levels
        .filter((l) => l <= data.level)
        .map((l) => {
          const value = (data && data.context && data.context[l]) || {
            approverLevel: l,
          };
          return (
            <>
              <WorkflowSubRow
                key={l}
                hasReportingManager={hasReportingManager}
                onUpdate={(changes) => updateRow(changes, l)}
                value={value}
              />
            </>
          );
        })}
      {isActiveForRoles(["ORG_ADMIN", "DOMAIN_ADMIN", "APP_ADMIN"]) && (
        <div className={classes.saveButton}>
          <Button onClick={onSubmit} disabled={!updated || !data.level || !valid}>
            Save
          </Button>
        </div>
      )}
    </div>
  );
}

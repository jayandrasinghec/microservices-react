import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import AppUserInput from "../../../../../components/form/AppUserInput";
import AppGroupInput from "../../../../../components/form/AppGroupInput";
import { callApi } from "../../../../../utils/api";
import { isActiveForRoles } from "../../../../../utils/auth";

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
    backgroundColor: "#EEF1F8",
    borderRadius: "10px",
  },
  paperLevel: {
    margin: "20px",
    padding: "20px",
    display: "flex",
    justifyContent: "flex-start",
    backgroundColor: "white",
    borderRadius: "10px",
    flexDirection: "column",
    overflow: "hidden",
    alignItems: "flex-start",
  },
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
  container: {
    fontSize: 16,
    paddingBottom: "10px",
    color: "black",
  },
  containerone: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  formlabel: {
    marginRight: "50px",
  },
  appinput: {
    width: "100%",
  },
}));

const defaultUsers = {
  direction: "ASC",
  keyword: "",
  pageNumber: 0,
  pageSize: 50,
  sort: "FIRST_NAME",
};

const defaultGroups = {
  direction: "ASC",
  pageNumber: 0,
  pageSize: 10,
  keyword: "",
  sort: "GROUP_NAME",
};

interface IProps {
  value: {
    approverLevel: number;
    groupId?: string;
    userId?: string;
    reportingManager?: boolean;
    groupSelect?: boolean;
    userSelect?: boolean;
  };
  hasReportingManager?: boolean;
  onUpdate: (changes: any) => void;
}

export default function WorkflowSubRow(props: IProps) {
  const classes = useStyles();
  const { approverLevel } = props.value;
  const [value, _setValue] = React.useState(
    props.value.groupSelect || props.value.groupId
      ? "group"
      : props.value.reportingManager
      ? "reportingManager"
      : "user"
  );
  
  React.useEffect(()=>{
    var v = props.value.groupSelect || props.value.groupId
    ? "group"
    : props.value.reportingManager
    ? "reportingManager"
    : "user";
    _setValue(v)
  },[props.value])

  
  const setValue = (v: string) => {
    //_setValue(v);
    if (v === "reportingManager")
      props.onUpdate({ approverLevel, reportingManager: true });
    else if (v === "user") props.onUpdate({ approverLevel, userId: null,userSelect:true });
    else if (v === "group") props.onUpdate({ approverLevel, groupId: null,groupSelect:true });
  };

  return (
    <div className={classes.paperLevel}>
      <div className={classes.container}>
        Level {props.value.approverLevel} approver 
      </div>
      <div className={classes.containerone}>
        <FormControl component="fieldset">
          <RadioGroup
            row
            aria-label="position"
            name="position"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          >
            <FormControlLabel
              value="user"
              control={
                <Radio color="primary" classes={{ root: classes.radio }} />
              }
              label="User"
              className={classes.formlabel}
              disabled={isActiveForRoles(['READ_ONLY'])}
            />
            <FormControlLabel
              value="group"
              control={
                <Radio color="primary" classes={{ root: classes.radio }} />
              }
              label="Group"
              className={classes.formlabel}
              disabled={isActiveForRoles(['READ_ONLY'])}
            />
            {(!props.hasReportingManager || props.value.reportingManager) && (
              <FormControlLabel
                value="reportingManager"
                control={
                  <Radio color="primary" classes={{ root: classes.radio }} />
                }
                label="Reporting Manager"
                disabled={isActiveForRoles(['READ_ONLY'])}
              />
            )}
          </RadioGroup>
        </FormControl>
      </div>
      {value === "user" ? (
        <AppUserInput
          label=""
          value={props.value.userId}
          disabled={isActiveForRoles(['READ_ONLY'])}
          fullWidth
          className={classes.appinput}
          // @ts-ignore
          onGroupId={(e) => props.onUpdate({ approverLevel, userId: e })}
        />
      ) : value === "group" ? (
        <AppGroupInput
          label=""
          value={props.value.groupId}
          disabled={isActiveForRoles(['READ_ONLY'])}
          fullWidth
          className={classes.appinput}
          // @ts-ignore
          onGroupId={(e) => props.onUpdate({ approverLevel, groupId: e })}
        />
      ) : (
        <div />
      )}
    </div>
  );
}

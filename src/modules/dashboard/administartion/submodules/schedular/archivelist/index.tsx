import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import AddIcon from "@material-ui/icons/Add";
import CardViewWrapper from "../../../../../../components/HOC/CardViewWrapper";
import "./styles.css";
import CustomPagination from "../../../../../../components/CustomPagination";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ActiveStatusChip from "../../../../../../components/HOC/ActiveStatusChip";
import InactiveStatusChip from "../../../../../../components/HOC/InactiveStatusChip";
import { isActiveForRoles } from "../../../../../../utils/auth";
import LogFilterCard from "../../Logs/LogFilterCard";
import TuneIcon from "@material-ui/icons/Tune";
import { callApi } from "../../../../../../utils/api";
import { getAuthToken } from "../../../../../../utils/auth";
import { connect } from "react-redux";
import { GetExecutionTaskListAction } from "../redux/actions/historicalSchedularActions";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "../../../../../../redux/reducers";
import Filters from "../components/filter";
//import { styles } from '../styles';
interface Props {
  route: any;
  loading: any;
}

const Archivelist: React.FC<Props> = (Props) => {
  const columns: any = [
    {
      title: "Service / Event",
      field: "referenceType",
    },
    { title: "Sub Event", field: "event" },
    { title: "Execution Date", field: "plannedStart" },
    { title: "Execution Status", field: "executionStatus" },
    { title: "Remarks", field: "executionRemarks" },
  ];
  const defaultQuery = {
    filter: {
      referenceId: "",
      referenceType: "",
      status: null,
      from: "",
      to: "",
      entity: null,
    },
    keyword: "",
    pageNumber: 0,
    pageSize: 10,
    sortDirection: "ASC",
    sortOn: ["updatedAt"],
  };
  const [enableFilters, setEnableFilter] = useState(false);
  const [saving, setSaving] = useState(false);
  const [query, _setQuery] = useState(defaultQuery);
  const [logs, setLogs] = React.useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const dispatch = useDispatch();
  const taskLists = useSelector(
    (store: IReduxState) => store.historicalSchedularReducer.taskLists || []
  );
  const loading = useSelector(
    (store: IReduxState) => store.historicalSchedularReducer.loading
  );
  const executionStatusOptions = [
    { key: "STARTED", label: "STARTED" },
    { key: "RUNNING", label: "RUNNING" },
    { key: "FINISHED", label: "FINISHED" },
    { key: "ABORTED", label: "ABORTED" },
  ];
  const entity = [
    { key: "Governance", label: "Governance" },
    { key: "Reconciliation", label: "Reconciliation" },
    { key: "De-provision", label: "De-provision" },
    { key: "Hook/Script", label: "Hook/Script" },
  ];
  const statusOptions = [
    { key: 0, label: "Active" },
    { key: 1, label: "Inactive" },
  ];

  const handleAddNewRule = () => {};

  useEffect(() => {
    dispatch(GetExecutionTaskListAction(defaultQuery));
  }, []);

  const handleClickEditRuleCondition = (event: any, rowData: any) => {};
  const setQuery = (e: any) => {
    _setQuery({ ...query, ...e });
  };
  const handleFilterClick = () => setEnableFilter(!enableFilters);
  const downloadlogs = (change = {}) => {
    setSaving(true);
    callApi(`/utilsrvc/log/list`, "POST", { ...query, ...change })
      .then((e: any) => {
        setSaving(false);
        if (e.success) {
          setLogs(e.data ? e.data.content : []);
          // setTotalLogs(e.data ? e.data.content.length : 0)
          setTotalLogs(e.data.totalElements);
        }
      })
      .catch((err: any) => setSaving(false));
  };

  const filterEvent = (event: any) => {
    console.log("filterEvent ", event);
    dispatch(GetExecutionTaskListAction(query));
  };

  return (
    <div style={{ overflow: "auto", height: "min-content" }}>
      <Grid item md={12} xs={12} className="griditemtwo">
        <Button
          onClick={() => handleFilterClick()}
          startIcon={<TuneIcon className="tuneicon" />}
          className="tuneicon"
        >
          Filters
        </Button>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          {enableFilters && (
            <Grid item xs={12}>
              {/* <LogFilterCard
            downloadlogs={downloadlogs}
            query={query}
            setQuery={setQuery}
            saving={saving}
            defaultQuery={defaultQuery} /> */}
              <Filters
                filterEvent={(event: any) => filterEvent(event)}
                header="Execution Status"
                statusOptions={executionStatusOptions}
                query={query}
                setQuery={setQuery}
                defaultQuery={defaultQuery}
                options={entity}
              />
            </Grid>
          )}
          <CardViewWrapper>
            <Grid container spacing={2}>
              <Grid item xs={12} className="ruleTable">
                <MaterialTable
                  title=""
                  columns={columns}
                  data={taskLists}
                  isLoading={loading}
                  options={{
                    paging: false,
                    rowStyle: {
                      backgroundColor: "#fff",
                    },

                    headerStyle: {
                      backgroundColor: "transparent",
                      borderBottom: "none",
                      color: "#666667",
                    },
                    paginationType: "stepped",
                    draggable: true,
                    actionsColumnIndex: -1,
                  }}
                  // localization={{
                  //   pagination: {
                  //     labelRowsPerPage: "",
                  //     labelDisplayedRows:
                  //       "Displaying {from}-{to} of {count} records",
                  //   },
                  // }}
                  /*   actions={[
                  {
                    icon: () =>
                      isActiveForRoles(["READ_ONLY"]) ? (
                        <VisibilityIcon style={{ color: "#ddd" }} />
                      ) : (
                        <Avatar
                          src={require("../../../../../../assets/Edit.png")}
                          className="editDeleteIcon"
                        />
                      ),
                    tooltip: "Edit Rule",
                    // hidden:!isActiveForRoles(['ORG_ADMIN','DOMAIN_ADMIN']),
                    onClick: (event, rowData) =>
                      handleClickEditRuleCondition(event, rowData),
                  },
                ]} */
                />
              </Grid>
            </Grid>
          </CardViewWrapper>

          <CustomPagination data={taskLists} />
        </Grid>
      </Grid>
    </div>
  );
};
export default Archivelist;
